// ==UserScript==
// @name         Log Help Desk Call
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  Adds the "Log Call" button and submits the log form to SchoolDude.
// @author       You
// @match        *://*.schooldude.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // ====== Styles (modal + wait overlay) ======
    function ensureLogCallStyles() {
        if (document.getElementById('log-call-styles')) return;
        const style = document.createElement('style');
        style.id = 'log-call-styles';
        style.textContent = `
      .lc-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.55);
        display: flex; align-items: center; justify-content: center; z-index: 9999; }
      .lc-modal { background: #fff; width: 600px; max-width: 95vw; border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,.25); padding: 18px 18px 12px; position: relative;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
      .lc-header { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
      .lc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .lc-field { display: flex; flex-direction: column; margin-bottom: 10px; min-width: 0; }
      .lc-field label { font-size: 13px; color: #333; margin-bottom: 6px; }
      .lc-field input, .lc-field select, .lc-field textarea {
        border: 1px solid #ccc; border-radius: 6px; padding: 8px 10px; font-size: 14px; max-width: 100%; }
      .lc-field select[size] { height: auto; }
      .lc-field textarea { min-height: 90px; resize: vertical; }
      .lc-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
      .lc-btn { border: 0; border-radius: 6px; padding: 8px 14px; font-size: 14px; cursor: pointer; }
      .lc-btn-primary { background: #007bff; color: #fff; }
      .lc-btn-secondary { background: #e9ecef; color: #111; }
      .lc-close { position: absolute; right: 10px; top: 8px; border: none; background: transparent;
        font-size: 18px; cursor: pointer; color: #666; }
      .lc-error { color: #c62828; font-size: 13px; margin-bottom: 8px; display: none; }

      /* Smaller Caller input */
      .lc-caller input { max-width: 240px; }

      /* Wait overlay */
      .lc-wait-bg { position: fixed; inset: 0; background: rgba(0,0,0,.7);
        display: flex; align-items: center; justify-content: center; z-index: 100000; pointer-events: all; }
      .lc-wait-card { background: rgba(0,0,0,.85); color: #fff; padding: 18px 22px; border-radius: 10px;
        display: flex; align-items: center; gap: 14px; min-width: 260px; box-shadow: 0 8px 26px rgba(0,0,0,.35);}
      .lc-spinner { width: 26px; height: 26px; border: 3px solid rgba(255,255,255,.25);
        border-top-color: #fff; border-radius: 50%; animation: lcspin 0.9s linear infinite; }
      .lc-wait-msg { font-size: 15px; font-weight: 600; letter-spacing: .2px; }
      @keyframes lcspin { to { transform: rotate(360deg); } }
    `;
        document.head.appendChild(style);
    }

    // ====== Wait overlay helpers ======
    function showWaitOverlay(message = 'Please wait…') {
        let wrap = document.createElement('div');
        wrap.className = 'lc-wait-bg';
        wrap.innerHTML = `
      <div class="lc-wait-card">
        <div class="lc-spinner" aria-hidden="true"></div>
        <div class="lc-wait-msg">${message}</div>
      </div>
    `;
        document.body.appendChild(wrap);
        return wrap;
    }
    function updateWaitOverlay(overlay, message) {
        if (!overlay) return;
        const msg = overlay.querySelector('.lc-wait-msg');
        if (msg) msg.textContent = message;
    }
    function hideWaitOverlay(overlay) {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }

    // ====== Utils ======
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    async function waitForEl(sel, timeout = 8000, poll = 80) {
        const t0 = Date.now();
        while (Date.now() - t0 < timeout) {
            const el = document.querySelector(sel);
            if (el) return el;
            await sleep(poll);
        }
        return null;
    }
    function norm(s) { return (s || '').toLowerCase().trim(); }
    function normHtml(s) { return (s || '').toLowerCase().trim().replace(/&amp;/g, '&'); }
    function normQueue(s) {
        return (s || '')
            .replace(/&amp;/g, '&')
            .replace(/\s+/g, ' ')
            .replace(/\s*\(\d+\)\s*$/, '')
            .toLowerCase()
            .trim();
    }
    async function waitForListMatch(listEl, matchFn, timeout = 8000, poll = 120) {
        const t0 = Date.now();
        while (Date.now() - t0 < timeout) {
            const items = listEl.querySelectorAll('.x-combo-list-item span[qtip]');
            for (const sp of items) {
                if (matchFn(sp)) return sp;
            }
            await sleep(poll);
        }
        return null;
    }
    function getSignedInUser() {
        const span = document.querySelector('#sl-27 span');
        if (!span) return null;
        const text = span.textContent || '';
        const emailMatch = text.match(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+)/);
        return emailMatch ? emailMatch[1] : null;
    }

    // ====== Assigned-To ======
    const ASSIGNED_TO_INPUT_SEL = '#base_inc_incident_assigned_to';
    const ASSIGNED_TO_LIST_CONTAINER_SEL = '#base_inc_incident_assigned_to-combo-list';

    function getAssignedToTrigger() {
        const input = document.querySelector(ASSIGNED_TO_INPUT_SEL);
        if (!input) return null;
        const wrap = input.closest('.x-form-field-wrap');
        return wrap ? (wrap.querySelector('img.x-form-trigger') || wrap.querySelector('img')) : null;
    }
    async function openAssignedToDropdown() {
        const input = await waitForEl(ASSIGNED_TO_INPUT_SEL, 10000);
        if (!input) throw new Error('Assigned To input not found');
        const trigger = getAssignedToTrigger();
        if (!trigger) throw new Error('Assigned To trigger not found');
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        trigger.click();
        await sleep(150);
        let listContainer = await waitForEl(ASSIGNED_TO_LIST_CONTAINER_SEL, 5000);
        if (!listContainer) {
            trigger.click();
            await sleep(150);
            listContainer = await waitForEl(ASSIGNED_TO_LIST_CONTAINER_SEL, 5000);
        }
        if (!listContainer) throw new Error('Assigned To list did not appear');
        await sleep(80);
        return { input, listContainer };
    }
    function parseEmailFromQtipOrText(el) {
        const q = el.getAttribute('qtip') || el.textContent || '';
        const m = q.match(/\(([^)]+)\)/);
        return m ? m[1].trim() : '';
    }
    async function selectAssignedToByEmailOrName(emailOrName) {
        const needleRaw = (emailOrName || '').trim();
        const needle = needleRaw.toLowerCase();
        const { input, listContainer } = await openAssignedToDropdown();
        input.value = '';
        input.dispatchEvent(new Event('input', { bubbles: true }));
        await sleep(50);
        input.value = needleRaw;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'e' }));
        const targetSpan = await waitForListMatch(
            listContainer,
            (sp) => {
                const txt = (sp.textContent || '').toLowerCase();
                if (needle.includes('@')) {
                    return parseEmailFromQtipOrText(sp).toLowerCase() === needle;
                }
                return txt.includes(needle);
            },
            9000,
            140
        );
        if (!targetSpan) throw new Error('Assignee not found in dropdown: ' + needleRaw);
        const item = targetSpan.closest('.x-combo-list-item') || targetSpan;
        item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        item.click();
        await sleep(160);
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.blur();
        console.log('Assigned To set to:', (targetSpan.textContent || '').trim());
        return true;
    }

    // ====== Location ======
    const LOCATION_INPUT_SEL = '#base_inc_incident_rte_location';
    const LOCATION_LIST_CONTAINER_SEL = '#base_inc_incident_rte_location-combo-list';

    function getLocationTrigger() {
        const input = document.querySelector(LOCATION_INPUT_SEL);
        if (!input) return null;
        const wrap = input.closest('.x-form-field-wrap');
        return wrap ? (wrap.querySelector('img.x-form-trigger') || wrap.querySelector('img')) : null;
    }
    async function openLocationDropdown() {
        const input = await waitForEl(LOCATION_INPUT_SEL, 10000);
        if (!input) throw new Error('Location input not found');
        const trigger = getLocationTrigger();
        if (!trigger) throw new Error('Location trigger not found');
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        trigger.click();
        await sleep(250);
        const list = await waitForEl(LOCATION_LIST_CONTAINER_SEL, 5000);
        if (!list) throw new Error('Location list did not appear');
        await sleep(80);
        return { input, list };
    }
    async function selectLocationByLabel(label) {
        const wanted = normHtml(label);
        const { input, list } = await openLocationDropdown();
        input.value = label;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'e' }));
        const targetSpan = await waitForListMatch(
            list,
            (sp) => {
                const q = normHtml(sp.getAttribute('qtip') || '');
                const txt = normHtml(sp.textContent || '');
                return q === wanted || txt === wanted || q.includes(wanted) || txt.includes(wanted);
            },
            8000,
            140
        );
        if (!targetSpan) throw new Error('Location not found in dropdown: ' + label);
        const item = targetSpan.closest('.x-combo-list-item') || targetSpan;
        item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        item.click();
        await sleep(120);
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.blur();
        console.log('Location set to:', (targetSpan.textContent || '').trim());
        return true;
    }

    // ====== Work Queue ======
    const WORKQ_INPUT_SEL = '#base_inc_incident_work_queue';
    const WORKQ_LIST_CONTAINER_SEL = '#base_inc_incident_work_queue-combo-list';

    function getWorkQueueTrigger() {
        const input = document.querySelector(WORKQ_INPUT_SEL);
        if (!input) return null;
        const wrap = input.closest('.x-form-field-wrap');
        return wrap ? (wrap.querySelector('img.x-form-trigger') || wrap.querySelector('img')) : null;
    }
    async function openWorkQueueDropdown() {
        const input = await waitForEl(WORKQ_INPUT_SEL, 10000);
        if (!input) throw new Error('Work Queue input not found');
        const trigger = getWorkQueueTrigger();
        if (!trigger) throw new Error('Work Queue trigger not found');
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        trigger.click();
        await sleep(250);
        const list = await waitForEl(WORKQ_LIST_CONTAINER_SEL, 5000);
        if (!list) throw new Error('Work Queue list did not appear');
        await sleep(80);
        return { input, list };
    }
    async function selectWorkQueueByLabel(queueLabel) {
        const wanted = normQueue(queueLabel);
        const { input, list } = await openWorkQueueDropdown();
        input.value = queueLabel;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'e' }));
        const targetSpan = await waitForListMatch(
            list,
            (sp) => {
                const q = normQueue(sp.getAttribute('qtip') || '');
                const txt = normQueue(sp.textContent || '');
                return q === wanted || txt === wanted || q.includes(wanted) || txt.includes(wanted);
            },
            9000,
            140
        );
        if (!targetSpan) throw new Error('Work Queue not found in dropdown: ' + queueLabel);
        const item = targetSpan.closest('.x-combo-list-item') || targetSpan;
        item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        item.click();
        await sleep(140);
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.blur();
        console.log('Work Queue set to:', (targetSpan.textContent || '').trim());
        return true;
    }
    function mapSchoolToQueueLabel(school) {
        const map = {
            'Adult School': 'Adult School Queue',
            'Dinuba High School': 'Dinuba HS Queue',
            'Dinuba Vocational Center': 'Dinuba Vocational Center',
            'District Office': 'District Office Queue',
            'Grand View Elementary': 'Grand View Queue',
            'Jefferson Elementary': 'Jefferson Queue',
            'Kennedy Elementary': 'Kennedy Queue',
            'LGSS Center': 'LGSS Queue',
            'Lincoln Elementary': 'Lincoln Queue',
            'Maintenance & Operations': 'Maintenance Queue',
            'Ronald Reagan Academy': 'Ronald Reagan Queue',
            'Roosevelt Elementary': 'Roosevelt Queue',
            'Sierra Vista HS': 'Sierra Vista Queue',
            'Transportation Department': 'Transportation Queue',
            'Washington Intermediate School': 'Washington Queue',
            'Wilson Elementary': 'Wilson Queue'
        };
        return map[school] || school;
    }
    async function selectWorkQueueBySchool(school) {
        const label = mapSchoolToQueueLabel(school);
        return selectWorkQueueByLabel(label);
    }

    // ====== Work Type (always "Help Desk Call") ======
    const WORKTYPE_INPUT_SEL = '#base_inc_incident_work_type';
    const WORKTYPE_LIST_CONTAINER_SEL = '#base_inc_incident_work_type-combo-list';

    function getWorkTypeTrigger() {
        const input = document.querySelector(WORKTYPE_INPUT_SEL);
        if (!input) return null;
        const wrap = input.closest('.x-form-field-wrap');
        return wrap ? (wrap.querySelector('img.x-form-trigger') || wrap.querySelector('img')) : null;
    }
    async function openWorkTypeDropdown() {
        const input = await waitForEl(WORKTYPE_INPUT_SEL, 10000);
        if (!input) throw new Error('Work Type input not found');
        const trigger = getWorkTypeTrigger();
        if (!trigger) throw new Error('Work Type trigger not found');
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        trigger.click();
        await sleep(220);
        let list = await waitForEl(WORKTYPE_LIST_CONTAINER_SEL, 5000);
        if (!list) {
            trigger.click();
            await sleep(220);
            list = await waitForEl(WORKTYPE_LIST_CONTAINER_SEL, 5000);
        }
        if (!list) throw new Error('Work Type list did not appear');
        await sleep(80);
        return { input, list };
    }
    async function selectWorkTypeByLabel(label) {
        const wanted = (label || '').toLowerCase().trim();
        const { input, list } = await openWorkTypeDropdown();
        input.value = label;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'e' }));
        const targetSpan = await waitForListMatch(
            list,
            (sp) => {
                const q = (sp.getAttribute('qtip') || '').toLowerCase().trim();
                const txt = (sp.textContent || '').toLowerCase().trim();
                return q === wanted || txt === wanted || q.includes(wanted) || txt.includes(wanted);
            },
            9000,
            140
        );
        if (!targetSpan) throw new Error('Work Type not found in dropdown: ' + label);
        const item = targetSpan.closest('.x-combo-list-item') || targetSpan;
        item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        item.click();
        await sleep(140);
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.blur();
        console.log('Work Type set to:', (targetSpan.textContent || '').trim());
        return true;
    }
    async function selectHelpDeskWorkType() {
        return selectWorkTypeByLabel('Help Desk Call');
    }

    // ====== On Behalf Of ======
    const OBO_INPUT_SEL = '#base_inc_incident_on_behalf_of';
    const OBO_LIST_CONTAINER_SEL = '#base_inc_incident_on_behalf_of-combo-list';

    function getOnBehalfOfTrigger() {
        const input = document.querySelector(OBO_INPUT_SEL);
        if (!input) return null;
        const wrap = input.closest('.x-form-field-wrap');
        return wrap ? (wrap.querySelector('img.x-form-trigger') || wrap.querySelector('img')) : null;
    }
    async function openOnBehalfOfDropdown() {
        const input = await waitForEl(OBO_INPUT_SEL, 10000);
        if (!input) throw new Error('On Behalf Of input not found');
        const trigger = getOnBehalfOfTrigger();
        if (!trigger) throw new Error('On Behalf Of trigger not found');
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        trigger.click();
        await sleep(220);
        let list = await waitForEl(OBO_LIST_CONTAINER_SEL, 5000);
        if (!list) {
            trigger.click();
            await sleep(220);
            list = await waitForEl(OBO_LIST_CONTAINER_SEL, 5000);
        }
        if (!list) throw new Error('On Behalf Of list did not appear');
        await sleep(80);
        return { input, list };
    }
    async function selectOnBehalfOfByEmailOrName(emailOrName) {
        const needle = (emailOrName || '').toLowerCase().trim();
        const { input, list } = await openOnBehalfOfDropdown();
        input.value = emailOrName;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'e' }));
        const targetSpan = await waitForListMatch(
            list,
            (sp) => {
                const txt = (sp.textContent || '').toLowerCase();
                const q = (sp.getAttribute('qtip') || '').toLowerCase();
                if (needle.includes('@')) {
                    const m = q.match(/\(([^)]+)\)/);
                    const email = (m && m[1]) ? m[1].toLowerCase().trim() : '';
                    return email === needle;
                }
                return txt.includes(needle) || q.includes(needle);
            },
            9000,
            140
        );
        if (!targetSpan) throw new Error('User not found in On Behalf Of: ' + emailOrName);
        const item = targetSpan.closest('.x-combo-list-item') || targetSpan;
        item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        item.click();
        await sleep(140);
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.blur();
        console.log('On Behalf Of set to:', (targetSpan.textContent || '').trim());
        return true;
    }

    // ====== Incident Status (for closing when resolved on call) ======
    const STATUS_INPUT_SEL = '#base_inc_incident_incident_status';
    const STATUS_LIST_CONTAINER_SEL = '#base_inc_incident_incident_status-combo-list';

    function getIncidentStatusTrigger() {
        const input = document.querySelector(STATUS_INPUT_SEL);
        if (!input) return null;
        const wrap = input.closest('.x-form-field-wrap');
        return wrap ? (wrap.querySelector('img.x-form-trigger') || wrap.querySelector('img')) : null;
    }
    async function openIncidentStatusDropdown() {
        const input = await waitForEl(STATUS_INPUT_SEL, 10000);
        if (!input) throw new Error('Incident Status input not found');
        const trigger = getIncidentStatusTrigger();
        if (!trigger) throw new Error('Incident Status trigger not found');

        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
        trigger.click();

        await sleep(220);
        let list = await waitForEl(STATUS_LIST_CONTAINER_SEL, 5000);
        if (!list) {
            trigger.click();
            await sleep(220);
            list = await waitForEl(STATUS_LIST_CONTAINER_SEL, 5000);
        }
        if (!list) throw new Error('Incident Status list did not appear');
        await sleep(80);
        return { input, list };
    }
    async function selectIncidentStatusByLabel(label) {
        const wanted = (label || '').toLowerCase().trim();
        const { input, list } = await openIncidentStatusDropdown();

        // (If the field filters) type the label
        input.value = label;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'e' }));

        const targetSpan = await waitForListMatch(
            list,
            (sp) => {
                const q = (sp.getAttribute('qtip') || '').toLowerCase().trim();
                const txt = (sp.textContent || '').toLowerCase().trim();
                return q === wanted || txt === wanted || q.includes(wanted) || txt.includes(wanted);
            },
            9000,
            140
        );
        if (!targetSpan) throw new Error('Incident Status not found in dropdown: ' + label);

        const item = targetSpan.closest('.x-combo-list-item') || targetSpan;
        item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        item.dispatchEvent(new MouseEvent('mouseup',   { bubbles: true }));
        item.click();

        await sleep(140);
        input.dispatchEvent(new Event('change', { bubbles: true }));
        input.blur();

        console.log('Incident Status set to:', (targetSpan.textContent || '').trim());
        return true;
    }

    // ====== Description box ======
    const DESC_SEL = '#base_inc_incident_description';

    function composeDescription(payload) {
        const dt = new Date().toLocaleString();
        const techLine = payload.techLabel || payload.techEmail || '—';
        const phoneLine = payload.phone || '—';
        const roomLine = payload.room || '—';
        const resolved = payload.resolvedOnCall ? 'Yes' : 'No';
        return [
            `CALLER: ${payload.caller} ||`,
            `SITE: ${payload.school} ||`,
            `RM #: ${roomLine} ||`,
            `PHONE: ${phoneLine} ||`,
            `TECH: ${techLine} ||`,
            `URGENCY: ${payload.urgency} ||`,
            `RESOLVED ON CALL: ${resolved} ||`,
            `SUMMARY: ${payload.summary} ||`,
            ``,
            `Logged via Quick Log on ${dt}`
        ].join('\n');
    }
    async function fillTicketDescription(text) {
        const ta = await waitForEl(DESC_SEL, 10000);
        if (!ta) throw new Error('Description textarea not found');
        ta.focus();
        ta.value = text;
        ta.dispatchEvent(new Event('input', { bubbles: true }));
        ta.dispatchEvent(new Event('change', { bubbles: true }));
        ta.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: ' ' }));
        ta.blur();
        console.log('Description filled.');
        return true;
    }

    // ====== Room field filler ======
    const ROOM_INPUT_SEL = '#base_inc_incident_area_room';
    async function fillRoomField(roomVal) {
        if (!roomVal) return false;
        const roomInput = await waitForEl(ROOM_INPUT_SEL, 10000);
        if (!roomInput) throw new Error('Room input not found');
        roomInput.focus();
        roomInput.value = roomVal;
        roomInput.dispatchEvent(new Event('input', { bubbles: true }));
        roomInput.dispatchEvent(new Event('change', { bubbles: true }));
        roomInput.blur();
        console.log('Room field filled:', roomVal);
        return true;
    }

    // ====== Save / Apply clickers ======
    function isToolbarBtnDisabled(btn) {
        if (!btn) return true;
        if (btn.getAttribute('aria-disabled') === 'true') return true;
        const parentTable = btn.closest('table');
        if (parentTable && /\bx-item-disabled\b/.test(parentTable.className)) return true;
        return false;
    }
    async function clickSaveButton() {
        const saveBtn = await waitForEl('button#Save', 10000);
        if (!saveBtn) throw new Error('Save button not found');
        for (let i = 0; i < 15 && isToolbarBtnDisabled(saveBtn); i++) {
            await sleep(200);
        }
        if (!isToolbarBtnDisabled(saveBtn)) {
            saveBtn.focus();
            saveBtn.click();
            console.log('Clicked Save.');
            return true;
        }
        console.warn('Save still disabled, trying Apply.');
        const applyBtn = document.querySelector('button#Apply');
        if (applyBtn && !isToolbarBtnDisabled(applyBtn)) {
            applyBtn.focus();
            applyBtn.click();
            console.log('Clicked Apply (fallback).');
            return true;
        }
        throw new Error('Both Save and Apply are disabled.');
    }

    // ====== Modal ======
    function showLogCallModal() {
        ensureLogCallStyles();

        const bg = document.createElement('div');
        bg.className = 'lc-modal-bg';

        const modal = document.createElement('div');
        modal.className = 'lc-modal';
        modal.innerHTML = `
      <button class="lc-close" title="Close" aria-label="Close">×</button>
      <div class="lc-header">Log Call – Tech Support</div>
      <div class="lc-error" id="lcError">Please fill the required fields marked with *</div>

      <!-- Row 1: Caller (small) + Tech -->
      <div class="lc-row">
        <div class="lc-field lc-caller">
          <label for="lcCaller">Caller Name *</label>
          <input id="lcCaller" type="text" placeholder="Jane Doe" />
        </div>
        <div class="lc-field">
          <label for="lcTech">Tech</label>
          <select id="lcTech">
            <option value="">Select...</option>
            <option value="samantha.porras@dinuba.k12.ca.us">Samantha Porras (samantha.porras@dinuba.k12.ca.us)</option>
            <option value="auggie@dinuba.k12.ca.us">Auggie Lopez (auggie@dinuba.k12.ca.us)</option>
            <option value="jose.hernandez@dinuba.k12.ca.us">Jose Hernandez (jose.hernandez@dinuba.k12.ca.us)</option>
            <option value="amorgan@dinuba.k12.ca.us">Aaron Morgan (amorgan@dinuba.k12.ca.us)</option>
            <option value="sage@dinuba.k12.ca.us">Sage Clark (sage@dinuba.k12.ca.us)</option>
            <option value="hugo.morales@dinuba.k12.ca.us">Hugo Morales (hugo.morales@dinuba.k12.ca.us)</option>
            <option value="ramon.rivera@dinuba.k12.ca.us">Ramon Rivera (ramon.rivera@dinuba.k12.ca.us)</option>
            <option value="julia.costa@dinuba.k12.ca.us">Julia Costa (julia.costa@dinuba.k12.ca.us)</option>
          </select>
        </div>
      </div>

      <!-- Row 2: School + Room -->
      <div class="lc-row">
        <div class="lc-field">
          <label for="lcSchool">School Site *</label>
          <select id="lcSchool">
            <option value="">Select...</option>
            <option>Adult School</option>
            <option>Dinuba High School</option>
            <option>Dinuba Vocational Center</option>
            <option>District Office</option>
            <option>Grand View Elementary</option>
            <option>Jefferson Elementary</option>
            <option>Kennedy Elementary</option>
            <option>LGSS Center</option>
            <option>Lincoln Elementary</option>
            <option>Maintenance &amp; Operations</option>
            <option>Ronald Reagan Academy</option>
            <option>Roosevelt Elementary</option>
            <option>Sierra Vista HS</option>
            <option>Transportation Department</option>
            <option>Washington Intermediate School</option>
            <option>Wilson Elementary</option>
          </select>
        </div>
        <div class="lc-field">
          <label for="lcRoom">Room Number</label>
          <input id="lcRoom" type="text" placeholder="e.g. 205A" />
        </div>
      </div>

      <!-- Row 3: Phone + Urgency -->
      <div class="lc-row">
        <div class="lc-field">
          <label for="lcPhone">Phone Number (optional)</label>
          <input id="lcPhone" type="tel" placeholder="(555) 555-5555" />
        </div>
        <div class="lc-field">
          <label for="lcUrgency">Urgency</label>
          <select id="lcUrgency">
            <option>Normal</option>
            <option>Low</option>
            <option>High</option>
            <option>Critical</option>
          </select>
        </div>
      </div>

      <div class="lc-field">
        <label for="lcSummary">Issue Summary *</label>
        <input id="lcSummary" type="text" placeholder="Short description" />
      </div>

      <!-- Resolved during call -->
      <div class="lc-field" style="margin-top:4px;">
        <label for="lcResolved" style="display:flex; align-items:center; gap:8px; cursor:pointer;">
          <input id="lcResolved" type="checkbox" />
          Ticket was resolved during call (close as “Closed”)
        </label>
      </div>

      <div class="lc-actions">
        <button class="lc-btn lc-btn-secondary" id="lcCancel">Cancel</button>
        <button class="lc-btn lc-btn-primary" id="lcSubmit">Submit</button>
      </div>
    `;

        modal.addEventListener('click', e => e.stopPropagation());
        bg.appendChild(modal);
        document.body.appendChild(bg);

        const get = id => modal.querySelector('#' + id);
        const caller = get('lcCaller');
        const school = get('lcSchool');
        const techSel = get('lcTech');
        const room = get('lcRoom');
        const phone = get('lcPhone');
        const urgency = get('lcUrgency');
        const summary = get('lcSummary');
        const resolvedChk = get('lcResolved');
        const errorBox = get('lcError');

        // Close handlers
        modal.querySelector('.lc-close').addEventListener('click', () => document.body.removeChild(bg));
        get('lcCancel').addEventListener('click', () => document.body.removeChild(bg));
        bg.addEventListener('click', () => document.body.removeChild(bg));

        // Submit handler
        get('lcSubmit').addEventListener('click', async () => {
            const missing = !caller.value.trim() || !school.value.trim() || !summary.value.trim();
            if (missing) {
                errorBox.style.display = 'block';
                return;
            }
            errorBox.style.display = 'none';

            const techLabel = (techSel && techSel.value) ? (techSel.options[techSel.selectedIndex]?.text || '') : '';
            const payload = {
                caller: caller.value.trim(),
                school: school.value.trim(),
                room: room.value.trim(),
                techEmail: techSel && techSel.value ? techSel.value : '',
                techLabel: techLabel,
                phone: phone.value.trim(), // optional
                urgency: urgency.value.trim(),
                summary: summary.value.trim(),
                resolvedOnCall: !!resolvedChk.checked,
                ts: Date.now()
            };

            sessionStorage.setItem('logCallDraft', JSON.stringify(payload));
            console.log('Saved to sessionStorage.logCallDraft:', payload);

            // Show blocking wait overlay & close the modal
            const waitOverlay = showWaitOverlay('Filling out ticket…');
            document.body.removeChild(bg);

            try {
                if (payload.techEmail) {
                    updateWaitOverlay(waitOverlay, 'Setting assignee…');
                    await sleep(300);
                    await selectAssignedToByEmailOrName(payload.techEmail);
                }

                if (payload.school) {
                    updateWaitOverlay(waitOverlay, 'Selecting location…');
                    await sleep(300);
                    await selectLocationByLabel(payload.school);
                }

                if (payload.school) {
                    updateWaitOverlay(waitOverlay, 'Routing to work queue…');
                    await sleep(300);
                    await selectWorkQueueBySchool(payload.school);
                }

                updateWaitOverlay(waitOverlay, 'Choosing work type…');
                await sleep(350);
                await selectHelpDeskWorkType();

                const myEmail = getSignedInUser();
                if (myEmail) {
                    updateWaitOverlay(waitOverlay, 'Setting On Behalf Of…');
                    await sleep(350);
                    await selectOnBehalfOfByEmailOrName(myEmail);
                }

                if (payload.room) {
                    updateWaitOverlay(waitOverlay, 'Filling room…');
                    await sleep(200);
                    await fillRoomField(payload.room);
                }

                updateWaitOverlay(waitOverlay, 'Adding description…');
                await sleep(250);
                await fillTicketDescription(composeDescription(payload));

                // If resolved during call, set Incident Status -> Closed
                if (payload.resolvedOnCall) {
                    updateWaitOverlay(waitOverlay, 'Setting status to Closed…');
                    await sleep(250);
                    await selectIncidentStatusByLabel('Closed');
                }

                updateWaitOverlay(waitOverlay, 'Saving ticket…');
                await sleep(300);
                await clickSaveButton();

            } catch (e) {
                console.warn('Auto-fill/Save error:', e);
            } finally {
                hideWaitOverlay(waitOverlay);
            }
        });

        caller.focus();
    }

    // ====== Button Creation (adds at end of footer toolbar row) ======
    function createLogCallButtonElement() {
        const td = document.createElement('td');
        td.className = 'x-toolbar-cell';
        td.setAttribute('role', 'presentation');

        const table = document.createElement('table');
        table.cellSpacing = '0';
        table.setAttribute('role', 'presentation');
        table.className = 'x-btn x-component x-btn-noicon x-unselectable';
        table.style.marginRight = '5px';

        const tbody = document.createElement('tbody');
        tbody.className = 'x-btn-small x-btn-icon-small-left';

        const trTop = document.createElement('tr');
        trTop.innerHTML =
            '<td class="x-btn-tl"><i>&nbsp;</i></td>' +
            '<td class="x-btn-tc"></td>' +
            '<td class="x-btn-tr"><i>&nbsp;</i></td>';
        tbody.appendChild(trTop);

        const trMid = document.createElement('tr');
        const inner =
            '<td class="x-btn-ml"><i>&nbsp;</i></td>' +
            '<td class="x-btn-mc"><em class="" unselectable="on">' +
            '<button class="x-btn-text" id="LogCallButton" type="button" style="position: relative; width: 100px;">Log Call</button>' +
            '</em></td>' +
            '<td class="x-btn-mr"><i>&nbsp;</i></td>';
        trMid.innerHTML = inner;
        tbody.appendChild(trMid);

        const trBot = document.createElement('tr');
        trBot.innerHTML =
            '<td class="x-btn-bl"><i>&nbsp;</i></td>' +
            '<td class="x-btn-bc"></td>' +
            '<td class="x-btn-br"><i>&nbsp;</i></td>';
        tbody.appendChild(trBot);

        table.appendChild(tbody);
        td.appendChild(table);

        // click => click "New" then show modal
        td.querySelector('#LogCallButton').addEventListener('click', () => {
            const newBtn = document.querySelector('button#New');
            if (newBtn) {
                newBtn.click();
                console.log("Clicked 'New' to open ticket.");
                setTimeout(showLogCallModal, 600);
            } else {
                console.warn("Could not find 'New' button.");
                showLogCallModal();
            }
        });

        return td;
    }

    function addLogCallButton() {
        // avoid duplicates
        if (document.getElementById('LogCallButton')) return;

        const toolbarRow = document.querySelector('.x-panel-footer .x-toolbar-left-row') ||
            document.querySelector('.x-toolbar-left-row');
        if (!toolbarRow) {
            // toolbar not present yet
            return;
        }

        const td = createLogCallButtonElement();
        const afterThisTd = (document.querySelector('#AddChromebooksButton') || {}).closest
            ? document.querySelector('#AddChromebooksButton').closest('td')
            : null;

        if (afterThisTd && afterThisTd.parentNode) {
            afterThisTd.parentNode.insertBefore(td, afterThisTd.nextSibling);
        } else {
            toolbarRow.appendChild(td);
        }

        console.log('Log Call button added.');
    }

    // ===== Wait for Add Chromebooks before adding Log Call (matches your working pattern) =====
    let logBtnScheduled = false;
    let logBtnInserted = false;

    function createAndInsertLogCallAfterChromebooks(footer) {
        if (!footer) return;
        const toolbar = footer.querySelector('.x-toolbar-left-row');
        if (!toolbar) return;

        const addCbBtn = footer.querySelector('#AddChromebooksButton');
        if (!addCbBtn) return; // defer until the Chromebooks button is present

        if (footer.querySelector('#LogCallButton')) {
            logBtnInserted = true;
            return; // already there
        }

        // Build our <td> … Log Call … </td>
        ensureLogCallStyles?.();
        const td = createLogCallButtonElement(); // your function returns the <td> wrapper

        // Insert right after Add Chromebooks
        const afterCell = addCbBtn.closest('td');
        if (afterCell && afterCell.parentNode) {
            afterCell.parentNode.insertBefore(td, afterCell.nextSibling);
        } else {
            toolbar.appendChild(td);
        }

        logBtnInserted = true;
        console.log('[LogCall] Button added after Add Chromebooks.');
    }

    function addLogCallToSpecificFooter() {
        if (logBtnInserted && document.getElementById('LogCallButton')) return;

        const footers = document.querySelectorAll('.x-panel-footer');
        for (const footer of footers) {
            // Only target the footer that contains the Personalizations control (like your working script)
            const hasPersonalizations = !!footer.querySelector('button#Personalizations');
            if (!hasPersonalizations) continue;

            // Only insert once the Add Chromebooks button exists in that footer
            const hasAddChromebooks = !!footer.querySelector('#AddChromebooksButton');
            if (!hasAddChromebooks) continue;

            createAndInsertLogCallAfterChromebooks(footer);
            if (logBtnInserted) break;
        }
    }

    // Throttled MutationObserver (same behavior as your working code)
    const logObserver = new MutationObserver(() => {
        // If our button was removed by a re-render, allow re-adding
        if (logBtnInserted && !document.getElementById('LogCallButton')) {
            logBtnInserted = false;
        }
        if (logBtnInserted || logBtnScheduled) return;
        logBtnScheduled = true;
        setTimeout(() => {
            logBtnScheduled = false;
            addLogCallToSpecificFooter();
        }, 100); // batch rapid DOM churn
    });

    // Try once after full load, then watch for SPA changes
    window.addEventListener('load', () => {
        addLogCallToSpecificFooter();
        if (!logBtnInserted) {
            logObserver.observe(document.body, { childList: true, subtree: true });
        }
    });

})();
