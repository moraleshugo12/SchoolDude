// ==UserScript==
// @name         Log Help Desk Call
// @namespace    http://tampermonkey.net/
// @version      1.2.3
// @description  Adds the "Log Call" button and submits the log form to SchoolDude.
// @author       You
// @match        *://*.schooldude.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  /* ===========================
   *  CSS (modal + overlay + UI)
   * =========================== */
  function ensureLogCallStyles() {
    if (document.getElementById('log-call-styles')) return;
    const style = document.createElement('style');
    style.id = 'log-call-styles';
    style.textContent = `
      .lc-modal-bg { position: fixed; inset: 0; background: rgba(0,0,0,.55);
        display: flex; align-items: center; justify-content: center; z-index: 9999; }
      .lc-modal { background: #fff; width: 640px; max-width: 95vw; border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0,0,0,.25); padding: 18px 18px 12px; position: relative;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
      .lc-header { font-size: 18px; font-weight: 700; margin-bottom: 12px; }
      .lc-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
      .lc-field { position: relative; display: flex; flex-direction: column; margin-bottom: 10px; min-width: 0; }
      .lc-field label { font-size: 13px; color: #333; margin-bottom: 6px; display:flex; align-items:center; gap:8px;}
      .lc-field input, .lc-field select, .lc-field textarea {
        border: 1px solid #ccc; border-radius: 6px; padding: 8px 10px; font-size: 14px; max-width: 100%; }
      .lc-field textarea { min-height: 90px; resize: vertical; }
      .lc-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 8px; }
      .lc-btn { border: 0; border-radius: 6px; padding: 8px 14px; font-size: 14px; cursor: pointer; }
      .lc-btn-primary { background: #007bff; color: #fff; }
      .lc-btn-secondary { background: #e9ecef; color: #111; }
      .lc-close { position: absolute; right: 10px; top: 8px; border: none; background: transparent;
        font-size: 18px; cursor: pointer; color: #666; }
      .lc-error { color: #c62828; font-size: 13px; margin-bottom: 8px; display: none; }
      .lc-caller input { max-width: 240px; }
      .lc-help { font-size: 12px; color:#666; margin-top: 6px; }

      /* Suggestions dropdown (for modal OBO) */
      .lc-suggest-box {
        position: absolute; top: 100%; left: 0; margin-top: 4px; width: 100%;
        background: #fff; border: 1px solid #ccc; border-radius: 6px;
        max-height: 220px; overflow-y: auto; z-index: 10001; display: none;
        box-shadow: 0 6px 18px rgba(0,0,0,.12);
      }
      .lc-suggest-item {
        padding: 8px 10px; cursor: pointer; font-size: 14px; white-space: nowrap;
        text-overflow: ellipsis; overflow: hidden;
      }
      .lc-suggest-item.active, .lc-suggest-item:hover { background: #007bff; color: #fff; }
      .lc-suggest-empty, .lc-suggest-loading { padding: 10px; font-size: 13px; }

      /* Quick action chips */
      .lc-chip-row { display:flex; gap:8px; margin-top:6px; flex-wrap: wrap; }
      .lc-chip { display:inline-flex; align-items:center; gap:6px; border:1px solid #d0d7de;
        border-radius:999px; padding:6px 10px; font-size:13px; cursor:pointer; user-select:none; background:#f6f8fa; }
      .lc-chip:hover { background:#eef1f4; }
      .lc-chip .dot { width:8px; height:8px; border-radius:50%; background:#007bff; }

      /* Wait overlay */
      .lc-wait-bg { position: fixed; inset: 0; background: rgba(0,0,0,.7);
        display: flex; align-items: center; justify-content: center; z-index: 100000; pointer-events: all; }
      .lc-wait-card { background: rgba(0,0,0,.85); color: #fff; padding: 18px 22px; border-radius: 10px;
        display: flex; align-items: center; gap: 14px; min-width: 260px; box-shadow: 0 8px 26px rgba(0,0,0,.35); }
      .lc-spinner { width: 26px; height: 26px; border: 3px solid rgba(255,255,255,.25);
        border-top-color: #fff; border-radius: 50%; animation: lcspin 0.9s linear infinite; }
      .lc-wait-msg { font-size: 15px; font-weight: 600; letter-spacing: .2px; }
      @keyframes lcspin { to { transform: rotate(360deg); } }
    `;
    document.head.appendChild(style);
  }

  /* ===========================
   *  Wait overlay helpers
   * =========================== */
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  function showWaitOverlay(message = 'Please wait…') {
    const wrap = document.createElement('div');
    wrap.className = 'lc-wait-bg';
    wrap.innerHTML = `
      <div class="lc-wait-card">
        <div class="lc-spinner" aria-hidden="true"></div>
        <div class="lc-wait-msg">${message}</div>
      </div>`;
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

  /* ===========================
   *  Generic utilities
   * =========================== */
  async function waitForEl(sel, timeout = 8000, poll = 80) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
      const el = document.querySelector(sel);
      if (el) return el;
      await sleep(poll);
    }
    return null;
  }
  function throttle(fn, wait = 60) {
    let t = 0, lastArgs = null, pending = false;
    const call = () => { pending = false; t = Date.now(); fn(...lastArgs); };
    return function (...args) {
      lastArgs = args;
      const now = Date.now();
      const remaining = wait - (now - t);
      if (remaining <= 0) call();
      else if (!pending) { pending = true; setTimeout(call, remaining); }
    };
  }
  const normHtml = (s) => (s || '').toLowerCase().trim().replace(/&amp;/g, '&');
  const normQueue = (s) => (s || '')
    .replace(/&amp;/g, '&').replace(/\s+/g, ' ')
    .replace(/\s*\(\d+\)\s*$/, '').toLowerCase().trim();

  async function waitForListMatch(listEl, matchFn, timeout = 8000, poll = 120) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
      const items = listEl.querySelectorAll('.x-combo-list-item span[qtip]');
      for (const sp of items) if (matchFn(sp)) return sp;
      await sleep(poll);
    }
    return null;
  }

  /* ===========================
   *  Header / User helpers
   * =========================== */
  function getSignedInUser() {
    const span = document.querySelector('#sl-27 span'); // page header user element
    if (!span) return null;
    const text = span.textContent || '';
    const emailMatch = text.match(/([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+)/);
    return emailMatch ? emailMatch[1] : null;
  }
  const getLocalPart = (email) => (email || '').split('@')[0] || '';

  // Types into the modal OBO input like a human (keeps native list stable and visible)
  async function typeLike(focusEl, text, { stepDelay = 70 } = {}) {
    focusEl.value = '';
    await mirrorToNativeOBO('', focusEl);
    await sleep(stepDelay);
    for (let i = 0; i < text.length; i++) {
      const partial = text.slice(0, i + 1);
      focusEl.value = partial;
      await mirrorToNativeOBO(partial, focusEl);
      if (nativeOBO.list) nativeOBO.list.scrollTop = 0;
      await sleep(stepDelay);
    }
  }

  // Find a native OBO row by exact email and return its label (pretty name)
  function findLabelInNativeByEmail(email) {
    if (!nativeOBO.list) return '';
    const spans = nativeOBO.list.querySelectorAll('.x-combo-list-item span[qtip]');
    for (const sp of spans) {
      const m = (sp.getAttribute('qtip') || '').match(/\(([^)]+)\)/);
      const em = m ? m[1].trim().toLowerCase() : '';
      if (em === (email || '').toLowerCase()) {
        return (sp.textContent || '').trim();
      }
    }
    return '';
  }

  // Wait for the email to appear in the native OBO list
  async function waitForEmailVisibleInNative(email, timeout = 3000, poll = 120) {
    const t0 = Date.now();
    while (Date.now() - t0 < timeout) {
      const label = findLabelInNativeByEmail(email);
      if (label) return label;
      await sleep(poll);
    }
    return '';
  }

  /* ===========================
   *  Assigned-To (Tech) dropdown
   * =========================== */
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
    if (!listContainer) { trigger.click(); await sleep(150); listContainer = await waitForEl(ASSIGNED_TO_LIST_CONTAINER_SEL, 5000); }
    if (!listContainer) throw new Error('Assigned To list did not appear');

    await sleep(80);
    return { input, listContainer };
  }

  function parseEmailFromQtipOrText(el) {
    const q = el.getAttribute('qtip') || el.textContent || '';
    const m = q.match(/\(([^)]+)\)/);
    return m ? m[1].trim() : '';
  }

  // Select a tech in the native Assigned-To by email or name
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
        if (needle.includes('@')) return parseEmailFromQtipOrText(sp).toLowerCase() === needle;
        return txt.includes(needle);
      },
      9000, 140
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
    return true;
  }

  // Close native Assigned-To dropdown (optional: restore focus)
  async function closeAssignedToDropdown(focusBackEl = null) {
    try {
      const trigger = getAssignedToTrigger();
      const list = document.querySelector(ASSIGNED_TO_LIST_CONTAINER_SEL);
      if (trigger && list && list.offsetParent !== null) {
        trigger.click();
        await sleep(80);
      }
    } catch (e) {
      console.warn('closeAssignedToDropdown error:', e);
    } finally {
      if (focusBackEl) {
        const ss = focusBackEl.selectionStart ?? null;
        const se = focusBackEl.selectionEnd ?? null;
        focusBackEl.focus();
        try { if (ss !== null && se !== null) focusBackEl.setSelectionRange(ss, se); } catch {}
      }
    }
  }

  // Read all options from native Assigned-To dropdown
  async function collectAssignedToOptions() {
    const { input, listContainer } = await openAssignedToDropdown();

    // Clear any filter first
    input.value = '';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'e' }));
    await sleep(150);

    const out = [];
    const seen = new Set();
    listContainer.querySelectorAll('.x-combo-list-item span[qtip]').forEach(sp => {
      const label = (sp.textContent || '').trim();
      const m = (sp.getAttribute('qtip') || '').match(/\(([^)]+)\)/);
      const email = m ? m[1].trim() : '';
      const key = (email || label).toLowerCase();
      if (!seen.has(key) && email) { seen.add(key); out.push({ label, email }); }
    });
    return out;
  }

  /* ===========================
   *  Location dropdown
   * =========================== */
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
      8000, 140
    );
    if (!targetSpan) throw new Error('Location not found in dropdown: ' + label);

    const item = targetSpan.closest('.x-combo-list-item') || targetSpan;
    item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    item.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    item.click();

    await sleep(120);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.blur();
    return true;
  }

  /* ===========================
   *  Work Queue dropdown
   * =========================== */
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
      9000, 140
    );
    if (!targetSpan) throw new Error('Work Queue not found in dropdown: ' + queueLabel);

    const item = targetSpan.closest('.x-combo-list-item') || targetSpan;
    item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    item.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    item.click();

    await sleep(140);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.blur();
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
    return selectWorkQueueByLabel(mapSchoolToQueueLabel(school));
  }

  /* ===========================
   *  Work Type dropdown
   * =========================== */
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
    if (!list) { trigger.click(); await sleep(220); list = await waitForEl(WORKTYPE_LIST_CONTAINER_SEL, 5000); }
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
      9000, 140
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
    return true;
  }
  async function selectHelpDeskWorkType() { return selectWorkTypeByLabel('Help Desk Call'); }

  /* ===========================
   *  On Behalf Of (native mirroring)
   * =========================== */
  const OBO_INPUT_SEL = '#base_inc_incident_on_behalf_of';
  const OBO_LIST_CONTAINER_SEL = '#base_inc_incident_on_behalf_of-combo-list';

  function getOnBehalfOfTrigger() {
    const input = document.querySelector(OBO_INPUT_SEL);
    if (!input) return null;
    const wrap = input.closest('.x-form-field-wrap');
    return wrap ? (wrap.querySelector('img.x-form-trigger') || wrap.querySelector('img')) : null;
  }

  // Cache native OBO handles
  const nativeOBO = { input: null, list: null, trigger: null, ready: false };

  // Suppress auto-opening of native list for a short window (after programmatic changes)
  let oboAutoOpen = true;
  let oboAutoOpenTimer = null;
  function suppressNativeOBOAutoOpen(ms = 700) {
    oboAutoOpen = false;
    clearTimeout(oboAutoOpenTimer);
    oboAutoOpenTimer = setTimeout(() => { oboAutoOpen = true; }, ms);
  }

  // Ensure native OBO is present/open (and restore modal focus range if provided)
  async function ensureNativeOBOOpen(focusBackEl = null, { forceOpen = false } = {}) {
    if (nativeOBO.ready && document.body.contains(nativeOBO.input)) {
      if (nativeOBO.list && nativeOBO.list.offsetParent === null && nativeOBO.trigger) {
        if (forceOpen || oboAutoOpen) { nativeOBO.trigger.click(); await sleep(120); }
      } else if (!nativeOBO.list && (forceOpen || oboAutoOpen)) {
        nativeOBO.trigger.click(); await sleep(180);
        nativeOBO.list = document.querySelector(OBO_LIST_CONTAINER_SEL) || null;
      }
      if (focusBackEl) {
        const ss = focusBackEl.selectionStart ?? null;
        const se = focusBackEl.selectionEnd ?? null;
        focusBackEl.focus();
        try { if (ss !== null && se !== null) focusBackEl.setSelectionRange(ss, se); } catch {}
      }
      return nativeOBO;
    }

    // Initial discovery
    const input = await waitForEl(OBO_INPUT_SEL, 10000);
    if (!input) throw new Error('On Behalf Of input not found');
    const trigger = getOnBehalfOfTrigger();
    if (!trigger) throw new Error('On Behalf Of trigger not found');

    input.focus();
    input.dispatchEvent(new Event('input', { bubbles: true }));

    if (forceOpen || oboAutoOpen) { trigger.click(); await sleep(180); }

    let list = document.querySelector(OBO_LIST_CONTAINER_SEL);
    if (!list && (forceOpen || oboAutoOpen)) {
      trigger.click(); await sleep(180);
      list = await waitForEl(OBO_LIST_CONTAINER_SEL, 5000);
    }

    nativeOBO.input = input;
    nativeOBO.list = list || null;
    nativeOBO.trigger = trigger;
    nativeOBO.ready = true;

    if (focusBackEl) {
      const ss = focusBackEl.selectionStart ?? null;
      const se = focusBackEl.selectionEnd ?? null;
      focusBackEl.focus();
      try { if (ss !== null && se !== null) focusBackEl.setSelectionRange(ss, se); } catch {}
    }
    return nativeOBO;
  }

  // Close native OBO dropdown (keep modal focus intact)
  async function closeNativeOBODropdown(focusBackEl = null) {
    try {
      suppressNativeOBOAutoOpen(700);
      if (!nativeOBO.ready) return;
      if (nativeOBO.list && nativeOBO.list.offsetParent !== null && nativeOBO.trigger) {
        nativeOBO.trigger.click();
        await sleep(100);
      }
    } catch (e) {
      console.warn('closeNativeOBODropdown error:', e);
    } finally {
      if (focusBackEl) {
        const ss = focusBackEl.selectionStart ?? null;
        const se = focusBackEl.selectionEnd ?? null;
        focusBackEl.focus();
        try { if (ss !== null && se !== null) focusBackEl.setSelectionRange(ss, se); } catch {}
      }
    }
  }

  // Mirror text from modal input -> native OBO (without stealing focus)
  async function mirrorToNativeOBO(text, focusBackEl) {
    const selStart = focusBackEl?.selectionStart ?? null;
    const selEnd = focusBackEl?.selectionEnd ?? null;

    const { input, list } = await ensureNativeOBOOpen(focusBackEl);
    input.value = text;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'e' }));
    if (list) list.scrollTop = 0;

    if (focusBackEl) {
      focusBackEl.focus();
      try { if (selStart !== null && selEnd !== null) focusBackEl.setSelectionRange(selStart, selEnd); } catch {}
    }
  }

  // Choose a specific OBO item by email or name (extracts email if "(email)" is present)
  async function selectOnBehalfOfByEmailOrName(emailOrName) {
    const raw = (emailOrName || '').trim();
    const needle = raw.toLowerCase();
    const emailMatch = needle.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+/);
    const needleEmail = emailMatch ? emailMatch[0] : '';

    const { input, list } = await ensureNativeOBOOpen(null, { forceOpen: true });

    input.value = needleEmail || raw;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'e' }));

    const targetSpan = await waitForListMatch(
      list,
      (sp) => {
        const txt = (sp.textContent || '').toLowerCase();
        const q   = (sp.getAttribute('qtip') || '').toLowerCase();
        if (needleEmail) {
          const m = q.match(/\(([^)]+)\)/);
          const email = (m && m[1]) ? m[1].toLowerCase().trim() : '';
          return email === needleEmail; // exact email match
        }
        return txt.includes(needle) || q.includes(needle);
      },
      9000, 140
    );
    if (!targetSpan) throw new Error('User not found in On Behalf Of: ' + raw);

    const item = targetSpan.closest('.x-combo-list-item') || targetSpan;
    item.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    item.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    item.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    item.click();

    await sleep(140);
    input.dispatchEvent(new Event('change', { bubbles: true }));
    input.blur();
    return true;
  }

  // Read visible OBO matches from native list to feed modal suggestions
  async function collectMatchesFromNative(_currentQuery, focusBackEl) {
    await ensureNativeOBOOpen(focusBackEl);
    await sleep(140);

    const out = [];
    const seen = new Set();
    const list = nativeOBO.list;
    if (!list) return out;

    list.querySelectorAll('.x-combo-list-item span[qtip]').forEach(sp => {
      const label = (sp.textContent || '').trim();
      const m = (sp.getAttribute('qtip') || '').match(/\(([^)]+)\)/);
      const email = m ? m[1].trim() : '';
      const key = (email || label).toLowerCase();
      if (!seen.has(key)) { seen.add(key); out.push({ label, email }); }
    });
    return out;
  }

  // Retry helper (native list can be slow)
  async function retrySelectOnBehalfOf(emailOrName, attempts = 6, delay = 250) {
    for (let i = 0; i < attempts; i++) {
      try { await selectOnBehalfOfByEmailOrName(emailOrName); return true; }
      catch { await sleep(delay); }
    }
    throw new Error('Could not auto-select On Behalf Of after retries: ' + emailOrName);
  }

  /* ===========================
   *  Incident Status dropdown
   * =========================== */
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
    if (!list) { trigger.click(); await sleep(220); list = await waitForEl(STATUS_LIST_CONTAINER_SEL, 5000); }
    if (!list) throw new Error('Incident Status list did not appear');

    await sleep(80);
    return { input, list };
  }

  async function selectIncidentStatusByLabel(label) {
    const wanted = (label || '').toLowerCase().trim();
    const { input, list } = await openIncidentStatusDropdown();

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
      9000, 140
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
    return true;
  }

  /* ===========================
   *  Description + misc fields
   * =========================== */
  const DESC_SEL = '#base_inc_incident_description';
  function composeDescription(payload) {
    const dt = new Date().toLocaleString();
    const techLine = payload.techLabel || payload.techEmail || '—';
    const phoneLine = payload.phone || '—';
    const roomLine = payload.room || '—';
    const resolved = payload.resolvedOnCall ? 'Yes' : 'No';
    const oboLine = payload.oboDisplay || payload.obo || '—';
    return [
      `CALLER: ${payload.caller} ||`,
      `SITE: ${payload.school} ||`,
      `RM #: ${roomLine} ||`,
      `PHONE: ${phoneLine} ||`,
      `TECH: ${techLine} ||`,
      `ON BEHALF OF: ${oboLine} ||`,
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
    return true;
  }

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
    return true;
  }

  // Toolbar Save/Apply clickers
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
    for (let i = 0; i < 15 && isToolbarBtnDisabled(saveBtn); i++) await sleep(200);
    if (!isToolbarBtnDisabled(saveBtn)) { saveBtn.focus(); saveBtn.click(); return true; }

    const applyBtn = document.querySelector('button#Apply');
    if (applyBtn && !isToolbarBtnDisabled(applyBtn)) { applyBtn.focus(); applyBtn.click(); return true; }

    throw new Error('Both Save and Apply are disabled.');
  }

  /* ===========================
   *  Modal (UI + behavior)
   * =========================== */
  function showLogCallModal() {
    ensureLogCallStyles();

    // Backdrop + shell
    const bg = document.createElement('div');
    bg.className = 'lc-modal-bg';

    const modal = document.createElement('div');
    modal.className = 'lc-modal';
    modal.innerHTML = `
      <button class="lc-close" title="Close" aria-label="Close">×</button>
      <div class="lc-header">Log Call – Tech Support</div>
      <div class="lc-error" id="lcError">Please fill the required fields marked with *</div>

      <!-- Row 1: Caller + Tech -->
      <div class="lc-row">
        <div class="lc-field lc-caller">
          <label for="lcCaller">Caller Name *</label>
          <input id="lcCaller" type="text" placeholder="Jane Doe" />
        </div>
        <div class="lc-field">
          <label for="lcTech">Tech</label>
          <select id="lcTech"><option value="">Loading…</option></select>
        </div>
      </div>

      <!-- Row 1.5: On Behalf Of (mirrors native dropdown) -->
      <div class="lc-field">
        <label for="lcOBOInput">On Behalf Of (optional)</label>
        <input id="lcOBOInput" type="text" placeholder="Start typing a name or email…" autocomplete="off" />
        <div id="lcOBOSuggestions" class="lc-suggest-box" role="listbox" aria-label="On Behalf Of suggestions"></div>
        <div class="lc-chip-row">
          <div class="lc-chip" id="lcOBOUseMyself"><span class="dot"></span> Use myself</div>
        </div>
        <div class="lc-help">Type to search; suggestions mirror the native dropdown. Use ↑/↓ and Enter, or click.</div>
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
          <label for="lcRoom">Location</label>
          <input id="lcRoom" type="text" placeholder="e.g. 205A" />
        </div>
      </div>

      <!-- Row 3: Phone -->
      <div class="lc-field">
        <label for="lcPhone">Phone Number (optional)</label>
        <input id="lcPhone" type="tel" placeholder="(555) 555-5555" />
      </div>

      <!-- Summary -->
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

    // Field lookups
    const get = id => modal.querySelector('#' + id);
    const caller     = get('lcCaller');
    const school     = get('lcSchool');
    const techSel    = get('lcTech');
    const room       = get('lcRoom');
    const phone      = get('lcPhone');
    const summary    = get('lcSummary');
    const resolvedChk= get('lcResolved');
    const errorBox   = get('lcError');

    // OBO elements
    const oboInput       = get('lcOBOInput');
    const oboSuggestBox  = get('lcOBOSuggestions');
    const chipUseMyself  = get('lcOBOUseMyself');

    /* -- Close modal actions -- */
    modal.querySelector('.lc-close').addEventListener('click', () => document.body.removeChild(bg));
    get('lcCancel').addEventListener('click', () => document.body.removeChild(bg));
    bg.addEventListener('click', () => document.body.removeChild(bg));

    /* -- Populate Tech list from native Assigned-To -- */
    (async () => {
      try {
        const options = await collectAssignedToOptions();
        techSel.innerHTML = '';

        const first = document.createElement('option');
        first.value = '';
        first.textContent = 'Select...';
        techSel.appendChild(first);

        options.forEach(({ label, email }) => {
          const opt = document.createElement('option');
          opt.value = email;           // used later during autofill
          opt.textContent = label;     // shows full "Last, First (email)"
          techSel.appendChild(opt);
        });
      } catch (e) {
        console.warn('Populate Tech from Assigned-To failed:', e);
        techSel.innerHTML = '<option value="">Select...</option>';
      } finally {
        await closeAssignedToDropdown(caller); // close native list; return focus to first field
      }
    })();

    /* -- OBO: suggestions fed by native list -- */
    let activeIndex = -1;

    const hideSuggestions = () => { oboSuggestBox.style.display = 'none'; activeIndex = -1; };
    const showLoading = () => {
      oboSuggestBox.innerHTML = `<div class="lc-suggest-loading">Searching…</div>`;
      oboSuggestBox.style.display = 'block';
    };
    const showEmpty = () => {
      oboSuggestBox.innerHTML = `<div class="lc-suggest-empty">No matches</div>`;
      oboSuggestBox.style.display = 'block';
    };
    function renderSuggestions(matches) {
      if (!matches || !matches.length) { showEmpty(); return; }
      oboSuggestBox.innerHTML = '';
      matches.forEach((opt, i) => {
        const div = document.createElement('div');
        div.className = 'lc-suggest-item' + (i === activeIndex ? ' active' : '');
        div.textContent = opt.label;
        div.dataset.email = opt.email;
        div.setAttribute('role', 'option');
        div.addEventListener('mousedown', async (e) => {
          e.preventDefault();
          suppressNativeOBOAutoOpen(800);
          await mirrorToNativeOBO(opt.label, oboInput);
          oboInput.value = opt.label;
          hideSuggestions();
          await closeNativeOBODropdown(oboInput);
          if (opt.email) { try { await selectOnBehalfOfByEmailOrName(opt.email); } catch {} }
        });
        oboSuggestBox.appendChild(div);
      });
      oboSuggestBox.style.display = 'block';
    }

    // Debounce (suggestions) + throttle (native mirror)
    const debounce = (fn, wait) => { let t = null; return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), wait); }; };
    const mirroredInputHandler = throttle(async () => {
      try { await mirrorToNativeOBO(oboInput.value || '', oboInput); }
      catch (e) { console.warn('OBO mirror error:', e); }
    }, 60);
    const debouncedSuggest = debounce(async () => {
      const q = (oboInput.value || '').trim();
      if (q.length < 2) { hideSuggestions(); return; }
      showLoading();
      const matches = await collectMatchesFromNative(q, oboInput);
      activeIndex = -1;
      renderSuggestions(matches.slice(0, 25));
    }, 250);

    // OBO input events
    oboInput.addEventListener('focus', async () => {
      try {
        await ensureNativeOBOOpen(oboInput);
        await mirrorToNativeOBO(oboInput.value || '', oboInput);
        if ((oboInput.value || '').trim().length >= 2) debouncedSuggest();
      } catch (e) { console.warn('OBO open error:', e); }
    });
    oboInput.addEventListener('input', () => {
      mirroredInputHandler();
      const q = (oboInput.value || '').trim();
      if (q.length < 2) { hideSuggestions(); return; }
      debouncedSuggest();
    });
    oboInput.addEventListener('keydown', async (e) => {
      const items = [...oboSuggestBox.querySelectorAll('.lc-suggest-item')];
      if (e.key === 'Escape') {
        suppressNativeOBOAutoOpen(600);
        hideSuggestions();
        await closeNativeOBODropdown(oboInput);
        return;
      }
      if (!items.length) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        activeIndex = (activeIndex + 1) % items.length;
        renderSuggestions(items.map(el => ({ label: el.textContent.trim(), email: el.dataset.email })));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        activeIndex = (activeIndex - 1 + items.length) % items.length;
        renderSuggestions(items.map(el => ({ label: el.textContent.trim(), email: el.dataset.email })));
      } else if (e.key === 'Enter') {
        const active = items[activeIndex] || items[0];
        if (active) {
          e.preventDefault();
          const label = active.textContent.trim();
          const email = active.dataset.email || '';
          suppressNativeOBOAutoOpen(800);
          await mirrorToNativeOBO(label, oboInput);
          oboInput.value = label;
          hideSuggestions();
          await closeNativeOBODropdown(oboInput);
          if (email) { try { await selectOnBehalfOfByEmailOrName(email); } catch {} }
        }
      }
    });
    oboInput.addEventListener('blur', () => {
      suppressNativeOBOAutoOpen(400);
      setTimeout(() => hideSuggestions(), 150);
    });

    // Chip: Use myself
    chipUseMyself.addEventListener('click', async () => {
      suppressNativeOBOAutoOpen(900);
      const myEmail = getSignedInUser();
      if (!myEmail) return;

      try {
        await ensureNativeOBOOpen(oboInput, { forceOpen: true });
        const local = getLocalPart(myEmail);
        await typeLike(oboInput, local, { stepDelay: 70 });
        if (nativeOBO.list) nativeOBO.list.scrollTop = 0;
        await sleep(180);

        const label = await waitForEmailVisibleInNative(myEmail, 5000, 60);
        try { await selectOnBehalfOfByEmailOrName(myEmail); }
        catch { await retrySelectOnBehalfOf(myEmail, 6, 150); }

        oboInput.value = label || myEmail;
      } catch (e) {
        console.warn('Use myself error:', e);
        oboInput.value = myEmail;
        try {
          await ensureNativeOBOOpen(oboInput, { forceOpen: true });
          await mirrorToNativeOBO(myEmail, oboInput);
        } catch {}
      }

      hideSuggestions();
      await closeNativeOBODropdown(oboInput);
    });

    /* -- Submit handler -- */
    get('lcSubmit').addEventListener('click', async () => {
      const missing = !caller.value.trim() || !school.value.trim() || !summary.value.trim();
      if (missing) { errorBox.style.display = 'block'; return; }
      errorBox.style.display = 'none';

      const techLabel = (techSel && techSel.value) ? (techSel.options[techSel.selectedIndex]?.text || '') : '';
      const selectedLabel = (oboInput.value || '').trim();

      let oboEmail = '';
      let oboDisplay = '';
      if (!selectedLabel) {
        oboEmail = '';
        oboDisplay = '';
      } else if (selectedLabel.includes('@')) {
        oboEmail = selectedLabel;          // user typed an email
        oboDisplay = selectedLabel;
      } else {
        oboEmail = '';                      // label with no email
        oboDisplay = selectedLabel;
      }

      const payload = {
        caller: caller.value.trim(),
        school: school.value.trim(),
        room: room.value.trim(),
        techEmail: techSel && techSel.value ? techSel.value : '',
        techLabel: techLabel,
        phone: phone.value.trim(),
        summary: summary.value.trim(),
        resolvedOnCall: !!resolvedChk.checked,
        obo: oboEmail,
        oboDisplay: oboDisplay,
        ts: Date.now()
      };

      sessionStorage.setItem('logCallDraft', JSON.stringify(payload));

      // Begin autofill flow
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

        if (selectedLabel) {
          updateWaitOverlay(waitOverlay, 'Setting On Behalf Of…');
          await sleep(300);
          await selectOnBehalfOfByEmailOrName(selectedLabel);
        }

        if (payload.room) {
          updateWaitOverlay(waitOverlay, 'Filling room…');
          await sleep(200);
          await fillRoomField(payload.room);
        }

        updateWaitOverlay(waitOverlay, 'Adding description…');
        await sleep(250);
        await fillTicketDescription(composeDescription(payload));

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

  /* ===========================
   *  Toolbar button injection
   * =========================== */
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
    trMid.innerHTML =
      '<td class="x-btn-ml"><i>&nbsp;</i></td>' +
      '<td class="x-btn-mc"><em class="" unselectable="on">' +
      '<button class="x-btn-text" id="LogCallButton" type="button" style="position: relative; width: 100px;">Log Call</button>' +
      '</em></td>' +
      '<td class="x-btn-mr"><i>&nbsp;</i></td>';
    tbody.appendChild(trMid);

    const trBot = document.createElement('tr');
    trBot.innerHTML =
      '<td class="x-btn-bl"><i>&nbsp;</i></td>' +
      '<td class="x-btn-bc"></td>' +
      '<td class="x-btn-br"><i>&nbsp;</i></td>';
    tbody.appendChild(trBot);

    table.appendChild(tbody);
    td.appendChild(table);

    td.querySelector('#LogCallButton').addEventListener('click', () => {
      const newBtn = document.querySelector('button#New');
      if (newBtn) { newBtn.click(); setTimeout(showLogCallModal, 600); }
      else { showLogCallModal(); }
    });

    return td;
  }

  // Keep a single button instance anchored after "Reset"
  let lcNode = null; let lcPlaced = false; let lcRafId = 0;

  function getHostToolbarRow() {
    const rows = document.querySelectorAll('.x-panel-footer .x-toolbar-left-row, .x-toolbar-left-row');
    for (const row of rows) {
      const hasReset = !!row.querySelector('button#Reset');
      const hasNewOrPers = !!row.querySelector('button#New') || !!row.querySelector('button#Personalizations');
      if (hasReset && hasNewOrPers) return row;
    }
    return null;
  }
  function cleanupOrphanDuplicates() {
    const allBtns = document.querySelectorAll('#LogCallButton');
    if (allBtns.length <= 1) return;
    const keep = lcNode?.querySelector('#LogCallButton') || allBtns[0];
    allBtns.forEach(btn => {
      if (btn !== keep) {
        const td = btn.closest('td');
        (td || btn).remove();
      }
    });
  }
  function placeLogCallAfterReset() {
    const row = getHostToolbarRow();
    if (!row) return;
    cleanupOrphanDuplicates();
    if (!lcNode) lcNode = createLogCallButtonElement();

    const extras = document.querySelectorAll('#LogCallButton');
    if (extras.length > 1) cleanupOrphanDuplicates();

    const resetTable = row.querySelector('button#Reset')?.closest('table');
    const resetCell  = resetTable?.closest('td');
    if (!resetCell) return;

    if (resetTable) resetTable.style.marginRight = '5px';
    const ourTable = lcNode.querySelector('table.x-btn');
    if (ourTable) ourTable.style.marginRight = '0px';

    if (lcNode !== resetCell.nextSibling) resetCell.parentNode.insertBefore(lcNode, resetCell.nextSibling);
    lcPlaced = true;
  }
  function schedulePlace() {
    if (lcRafId) cancelAnimationFrame(lcRafId);
    lcRafId = requestAnimationFrame(() => { lcRafId = 0; placeLogCallAfterReset(); });
  }

  // Initial placement + watch DOM mutations
  schedulePlace();
  const lcObserver = new MutationObserver(() => {
    if (lcPlaced && !document.getElementById('LogCallButton')) lcPlaced = false;
    schedulePlace();
  });
  lcObserver.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', schedulePlace);

})();
