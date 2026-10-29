// ==UserScript==
// @name         Dinuba Help Desk - Assign Unassigned Tickets
// @namespace    dinuba.helpdesk.assignment
// @version      1.3.7
// @description  Responsive assignment scan with confirmation before live saves.
// @match        https://975.insight.schooldude.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  'use strict';
  if (window.__dinubaAssignTickets) return;
  window.__dinubaAssignTickets = true;

  const CONFIG = {
    autoRun: false, // Only scan after clicking Assign Tickets; prevents background scans.
    previewOnly: false, // Live assignments require the confirmation below.
    scanIntervalMs: 15000,
    sweepIntervalMs: 60000,
    // Faster checks while keeping dropdown, pagination, and Save verification.
    gridStableMs: 450,
    saveInitialWaitMs: 200,
    pollIntervalMs: 75,
    // Only exact values in the Assigned To column qualify. Empty cells are skipped.
    unassignedValues: ['unassigned', 'none'],
    technicians: {
      sage: 'sage@dinuba.k12.ca.us',
      jose: 'Jose.Hernandez@dinuba.k12.ca.us',
      sam: 'samantha.porras@dinuba.k12.ca.us',
      hugo: 'Hugo.Morales@dinuba.k12.ca.us',
      aaron: 'amorgan@dinuba.k12.ca.us'
    }
  };
  const norm = value => String(value ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
  const siteOwners = {
    'washington intermediate school': 'sage', 'roosevelt elementary': 'sage',
    'kennedy elementary': 'sage', 'lincoln elementary': 'sage',
    'dinuba intermediate school': 'jose', 'wilson elementary': 'jose',
    'jefferson elementary': 'jose', 'edtech/lgss/elop': 'jose',
    'maintenance & operations': 'jose', 'dinuba high school': 'sam',
    'grand view elementary': 'hugo', 'district office': 'hugo',
    'dinuba vocational center': 'hugo', 'sierra vista hs': 'aaron',
    'ronald reagan academy': 'aaron', 'adult school': 'aaron'
  };
  const elementarySites = new Set([
    'roosevelt elementary', 'kennedy elementary', 'lincoln elementary',
    'wilson elementary', 'jefferson elementary', 'grand view elementary'
  ]);
  const aaronChromebookSites = new Set([
    'dinuba high school', 'washington intermediate school',
    'dinuba intermediate school', 'sierra vista hs'
  ]);
  function route(site, workType, description) {
    const s = norm(site), type = norm(workType), desc = norm(description);
    // Work Type = Chromebook is treated as the Chromebook repair queue.
    // Otherwise require both Chromebook and repair language in the description.
    const repair = /\bchromebooks?\b/.test(type) ||
      (/\bchromebooks?\b/.test(desc) &&
       /\b(repair\w*|broken|damage\w*|crack\w*|screen|keyboard|battery|won['’]?t (?:turn|power)|not (?:charging|working))\b/.test(desc));
    if (/\bdisposals?\b/.test(type) || /\b(?:disposals?|dispose)\b/.test(desc)) return 'hugo';
    if (repair && elementarySites.has(s)) return 'hugo';
    if (repair && aaronChromebookSites.has(s)) return 'aaron';
    return siteOwners[s] || null;
  }

  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const visible = el => !!el && el.isConnected && el.getClientRects().length > 0 &&
    getComputedStyle(el).visibility !== 'hidden';
  const cell = (row, field) => row.querySelector(`[class~="x-grid3-col-base.inc_incident.${field}"]`);
  const value = (row, field) => cell(row, field)?.textContent?.trim() || '';
  const isUnassigned = row => CONFIG.unassignedValues.includes(norm(value(row, 'assigned_to')));
  const rows = grid => all('.x-grid3-row', grid).filter(row => cell(row, 'assigned_to'));
  const enabled = el => visible(el) && !el.disabled && el.getAttribute('aria-disabled') !== 'true' &&
    !el.closest('.x-item-disabled');
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  async function until(fn, message, timeout = 8000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      const result = fn();
      if (result) return result;
      await wait(CONFIG.pollIntervalMs);
    }
    throw new Error(message);
  }
  function click(el) {
    el.scrollIntoView({block: 'nearest', inline: 'nearest'});
    for (const type of ['mousedown', 'mouseup', 'click']) {
      el.dispatchEvent(new MouseEvent(type, {bubbles: true, cancelable: true, view: window, button: 0, buttons: type === 'mousedown' ? 1 : 0}));
    }
  }
  // SchoolDude's All Open Tickets header lives inside #MainGrid. The Save,
  // Reset, pagination, and editable grid are in its nested #Data_List panel.
  // Do not require Print Tickets; that button isn't present in every account.
  function ticketSurface() {
    const matches = all('#MainGrid').filter(panel => {
      if (!visible(panel)) return false;
      const heading = all('.x-panel-header-text', panel).find(el =>
        visible(el) && /^all open tickets(?:\s*\(\d+\))?$/.test(norm(el.textContent))
      );
      return !!heading;
    });
    if (matches.length !== 1) return null;
    const scope = matches[0];
    const heading = all('.x-panel-header-text', scope).find(el =>
      visible(el) && /^all open tickets(?:\s*\(\d+\))?$/.test(norm(el.textContent))
    );
    return {scope, heading};
  }

  // Only the uniquely identified All Open Tickets grid may be edited.
  function context() {
    const surface = ticketSurface();
    if (!surface) return null;
    const panels = all('#Data_List', surface.scope).filter(visible);
    if (panels.length !== 1) return null;
    const panel = panels[0];
    const grids = all('.x-grid3', panel).filter(grid => visible(grid) &&
      !!grid.querySelector('[class~="x-grid3-col-base.inc_incident.assigned_to"]'));
    const saves = all('button#Save', panel).filter(visible);
    if (grids.length !== 1 || saves.length !== 1) return null;
    return {...surface, panel, grid: grids[0], save: saves[0]};
  }

  // The actual action bar is the Save / Reset toolbar underneath the grid.
  function actionToolbar(surface) {
    const dataPanel = surface?.scope?.querySelector('#Data_List');
    if (!dataPanel || !visible(dataPanel)) return null;
    const save = all('button#Save', dataPanel).filter(visible);
    const reset = all('button#Reset', dataPanel).filter(visible);
    if (save.length !== 1 || reset.length !== 1) return null;
    const saveCell = save[0].closest('td.x-toolbar-cell');
    const resetCell = reset[0].closest('td.x-toolbar-cell');
    if (!saveCell || !resetCell || saveCell.parentElement !== resetCell.parentElement) return null;
    const toolbar = resetCell.parentElement;
    if (!toolbar.matches('.x-toolbar-left-row') || !toolbar.closest('.x-panel-fbar')) return null;
    return {toolbar, anchor: resetCell};
  }
  let busy = false, halted = false, starting = false;
  let lastInteraction = 0;
  let interactionBaseline = 0; // Ignore interactions that happened BEFORE manual Start.
  let progressVisible = false;
  let forceScanAvailable = false;
  let lastSweep = 0;
  document.addEventListener('pointerdown', event => {
    if (event.isTrusted && !event.target.closest('[data-dinuba-assignment]')) lastInteraction = Date.now();
  }, true);
  document.addEventListener('keydown', event => {
    if (event.isTrusted) lastInteraction = Date.now();
  }, true);
  let lastStatus = 'Ready to assign unassigned tickets';

  // Read the count next to the native Open Unassigned filter. The count
  // is only a fast-path hint; users can always force a complete scan.
  // If the sidebar structure changes, return null and fall back to scanning.
  function unassignedSidebarCount() {
    const sidebar = document.getElementById('FilterItems');
    if (!sidebar) return null;
    // GXT moves qtip and count markup between releases. Read the uniquely
    // labelled count from the sidebar's visible text instead of relying on
    // a span's immediate sibling. Ambiguous or missing counts trigger a scan.
    const text = sidebar.innerText || sidebar.textContent || '';
    const matches = [...text.matchAll(/Open\s+Unassigned\s*([\d,]+)/gi)];
    if (matches.length !== 1) return null;
    const count = matches[0][1].replace(/,/g, '');
    return /^\d+$/.test(count) ? Number(count) : null;
  }

  function ensureProgressPanel() {
    let panel = document.getElementById('dinuba-assignment-progress');
    if (panel) return panel;
    panel = document.createElement('div');
    panel.id = 'dinuba-assignment-progress';
    panel.setAttribute('role', 'status');
    panel.setAttribute('aria-live', 'polite');

    const heading = document.createElement('strong');
    heading.textContent = 'Ticket Assignment';

    const message = document.createElement('div');
    message.className = 'dinuba-progress-message';

    const forceButton = document.createElement('button');
    forceButton.type = 'button';
    forceButton.className = 'dinuba-progress-force';
    forceButton.textContent = 'Scan all pages anyway';
    forceButton.hidden = true;
    forceButton.addEventListener('click', event => {
      event.stopPropagation();
      startManualScan(true);
    });

    const close = document.createElement('button');
    close.type = 'button';
    close.className = 'dinuba-progress-close';
    close.textContent = '×';
    close.title = 'Hide assignment progress';
    close.setAttribute('aria-label', 'Hide assignment progress');
    close.addEventListener('click', () => {
      progressVisible = false;
      panel.remove();
    });

    panel.append(heading, close, message, forceButton);
    document.body.appendChild(panel);
    return panel;
  }

  function updateButtonPresentation() {
    all('[data-dinuba-assignment] .dinuba-assign-action').forEach(button => {
      const label = button.querySelector('.dinuba-assign-label');
      const desired = busy ? 'Assigning…' : starting ? 'Starting…' : 'Assign Tickets';
      if (label && label.textContent !== desired) label.textContent = desired;
      button.classList.toggle('is-busy', busy || starting);
      button.setAttribute('aria-busy', String(busy || starting));
      button.title = lastStatus;
    });
  }

  function status(message) {
    lastStatus = message;
    console.info('[Dinuba assignment]', message);
    updateButtonPresentation();
    if (progressVisible) {
      const panel = ensureProgressPanel();
      const text = panel.querySelector('.dinuba-progress-message');
      if (text) text.textContent = message;
      panel.classList.toggle('dinuba-progress-working', busy || starting);
      const forceButton = panel.querySelector('.dinuba-progress-force');
      if (forceButton) forceButton.hidden = !forceScanAvailable || busy || starting;
    }
  }
  function dirty(ctx) {
    return enabled(ctx.save) || !!ctx.grid.querySelector('.x-grid3-dirty-cell');
  }
  function activeEditor() {
    return all('.x-editor, .x-small-editor').some(el => visible(el) &&
      el.querySelector('input:focus, textarea:focus'));
  }
  function findRow(ctx, id) { return rows(ctx.grid).find(r => value(r, 'id') === id); }
  function candidates(ctx) {
    return rows(ctx.grid).filter(isUnassigned);
  }
  function pageFingerprint(ctx) {
    return rows(ctx.grid).map(row => ['id', 'assigned_to', 'rte_location', 'work_type', 'description']
      .map(field => value(row, field)).join('\u001f')).join('\u001e');
  }
  async function settlePage(ctx) {
    let previous = '', stableSince = 0;
    await until(() => {
      requireContext(ctx);
      if (loading(ctx)) { stableSince = 0; return false; }
      const fingerprint = pageFingerprint(ctx);
      if (!stableSince || fingerprint !== previous) {
        previous = fingerprint;
        stableSince = Date.now();
        return false;
      }
      return Date.now() - stableSince >= CONFIG.gridStableMs;
    }, 'Ticket cells did not finish loading.', 20000);
  }
  function currentContext(ctx) {
    const current = context();
    return current && current.scope === ctx.scope && current.panel === ctx.panel &&
      current.grid === ctx.grid ? current : null;
  }
  function requireContext(ctx) {
    if (!currentContext(ctx)) throw new Error('All Open Tickets is no longer the active view.');
  }
  function loading(ctx) {
    return all('.x-mask-loading, .ext-el-mask', ctx.scope).some(visible);
  }
  function pageState(ctx) {
    const toolbars = all('.page-toolbar', ctx.panel).filter(visible);
    if (toolbars.length !== 1) throw new Error('Ticket pagination toolbar was not found uniquely.');
    const toolbar = toolbars[0];
    const display = toolbar.querySelector('.my-paging-display');
    const match = (display?.textContent || '').replace(/,/g, '').match(/Displaying\s+(\d+)\s*[-–]\s*(\d+)\s+of\s+(\d+)/i);
    if (!match) throw new Error('Cannot read the ticket page range; pagination stopped.');
    const first = toolbar.querySelector('.x-tool-page-first')?.closest('button');
    const next = toolbar.querySelector('.x-tool-page-next')?.closest('button');
    if (!first || !next) throw new Error('First/Next ticket page controls were not found.');
    return {start: Number(match[1]), end: Number(match[2]), total: Number(match[3]), first, next};
  }
  const canPage = button => enabled(button) && !button.querySelector('.x-item-disabled');
  // While staging a page, our own edits intentionally make Save enabled.
  function shouldStop(ctx, allowDirty = false) {
    return document.hidden || !currentContext(ctx) ||
      lastInteraction > interactionBaseline ||
      (!allowDirty && dirty(ctx)) || activeEditor();
  }
  async function changePage(ctx, direction) {
    if (shouldStop(ctx)) return false;
    const before = pageState(ctx);
    if (direction === 'first' && before.start <= 1) return true;
    if (direction === 'next' && before.end >= before.total) return false;
    const button = before[direction];
    if (!canPage(button)) throw new Error(`The ${direction} page button is unexpectedly disabled.`);
    const oldIds = rows(ctx.grid).map(row => value(row, 'id')).join(',');
    status(direction === 'first' ? 'Starting at the first ticket page…' : 'Loading the next ticket page…');
    click(button);
    let stableKey = '', stableSince = 0;
    await until(() => {
      requireContext(ctx);
      if (loading(ctx)) { stableKey = ''; return false; }
      const after = pageState(ctx);
      const newIds = rows(ctx.grid).map(row => value(row, 'id')).join(',');
      const moved = direction === 'first' ? after.start <= 1 : after.start > before.start;
      // Both range and row contents must change, then remain stable, before editing.
      if (!moved || newIds === oldIds) { stableKey = ''; return false; }
      const key = `${after.start}:${after.end}:${pageFingerprint(ctx)}`;
      if (key !== stableKey) { stableKey = key; stableSince = Date.now(); return false; }
      return Date.now() - stableSince >= CONFIG.gridStableMs;
    }, `The ${direction} ticket page did not finish loading.`, 20000);
    return true;
  }
  function technicianOption(input, wrap, email) {
    // GXT's aria-owns does not always identify its rendered combo list.
    const fieldId = wrap.id || input.id.replace(/-input$/, '');
    const actualList = document.getElementById(`${fieldId}-combo-list`);
    const owned = document.getElementById(input.getAttribute('aria-owns'));
    const linked = [actualList, owned].find(el => visible(el) && el.querySelector('.x-combo-list-item'));
    const lists = linked ? [linked] : all('.x-combo-list').filter(visible);
    const matches = lists.flatMap(list => all('.x-combo-list-item', list))
      .filter(el => visible(el) && norm(el.textContent) === norm(email));
    return matches.length === 1 ? matches[0] : null;
  }
  // Change Assigned To locally; DO NOT click Save here.
  async function stageAssignment(ctx, id, email) {
    requireContext(ctx);
    const row = findRow(ctx, id);
    if (!row || !isUnassigned(row)) return false;
    const target = cell(row, 'assigned_to');
    if (!target) throw new Error(`Ticket ${id}: Assigned To cell disappeared.`);
    target.scrollIntoView({block: 'nearest', inline: 'nearest'});
    click(target);
    target.dispatchEvent(new MouseEvent('dblclick', {
      bubbles: true, cancelable: true, view: window, detail: 2
    }));
    const input = await until(() => {
      const focused = document.activeElement;
      return focused?.tagName === 'INPUT' && visible(focused) &&
        focused.name === 'base.inc_incident.assigned_to' &&
        focused.closest('.x-grid-editor') && focused;
    }, `Ticket ${id}: Assigned To editor did not open.`);
    const wrap = input.closest('.x-form-field-wrap') || input.parentElement;
    const trigger = wrap.querySelector('.x-form-trigger-arrow, .x-form-trigger');
    if (!trigger) throw new Error(`Ticket ${id}: Assigned To dropdown arrow not found.`);
    click(trigger);
    const option = await until(() => technicianOption(input, wrap, email),
      `Ticket ${id}: technician ${email} was not found in the dropdown.`);
    const current = findRow(ctx, id);
    if (!current || !isUnassigned(current)) {
      throw new Error(`Ticket ${id}: row changed while opening the editor.`);
    }
    requireContext(ctx);
    click(option);
    input.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
    }));
    input.dispatchEvent(new KeyboardEvent('keyup', {
      key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
    }));
    const header = ctx.grid.querySelector('.x-grid3-header');
    if (header) click(header);
    await until(() => {
      const updated = findRow(ctx, id);
      return updated && norm(value(updated, 'assigned_to')) === norm(email);
    }, `Ticket ${id}: Assigned To was not committed in the grid.`);
    await until(() => enabled(ctx.save), `Ticket ${id}: Save did not become enabled.`);
    await until(() => !activeEditor(), `Ticket ${id}: cell editor did not close.`);
    return true;
  }

  // Save every staged change with ONE Save click for this page, then verify.
  async function savePageBatch(ctx, expected) {
    if (!expected.size) return 0;
    requireContext(ctx);
    if (document.hidden || lastInteraction > interactionBaseline || activeEditor()) {
      throw new Error('Batch paused before Save. Review unsaved assignments on this page.');
    }
    for (const [id, email] of expected) {
      const row = findRow(ctx, id);
      if (!row || norm(value(row, 'assigned_to')) !== norm(email)) {
        throw new Error(`Ticket ${id}: value changed before Save. Review unsaved assignments.`);
      }
    }
    if (!enabled(ctx.save)) {
      throw new Error('Save is disabled before batch submission. Check unsaved assignments.');
    }
    status(`Saving ${expected.size} assignment(s) on this page…`);
    click(ctx.save);
    await wait(CONFIG.saveInitialWaitMs);
    await until(() => {
      requireContext(ctx);
      if (!visible(ctx.save) || enabled(ctx.save) || loading(ctx)) return false;
      if (all('.x-message-box').some(visible)) return false;
      for (const [id, email] of expected) {
        const row = findRow(ctx, id);
        if (!row || norm(value(row, 'assigned_to')) !== norm(email) ||
            row.querySelector('.x-grid3-dirty-cell')) return false;
      }
      return !ctx.grid.querySelector('.x-grid3-dirty-cell');
    }, 'The batch Save was not acknowledged. Review the page before retrying.', 20000);
    // This is a UI acknowledgement, not an independent server-side audit.
    return expected.size;
  }

  async function run(manual = false, forceFullScan = false) {
    if (busy || halted || document.hidden) return;
    // Manual runs should not be blocked by a click that happened just before Start.
    interactionBaseline = lastInteraction;
    const ctx = context();
    if (!ctx) {
      if (manual) {
        status('All Open Tickets is still loading, or the Save/grid controls are unavailable.');
        alert('Open All Open Tickets and wait for its grid and Save/Reset toolbar to appear, then try again.');
      }
      return;
    }
    if (dirty(ctx)) { status('Save or reset existing changes before assigning tickets.'); return; }
    if (activeEditor()) { status('Close the open cell editor before assigning tickets.'); return; }
    if (!manual && Date.now() - lastInteraction < 4000) return;
    if (loading(ctx)) { status('Ticket page is still loading. Try again after it finishes.'); return; }

    // If the sidebar says 0 and the current page contains no unassigned
    // tickets, avoid a slow, pointless sweep through every page. This
    // shortcut never edits any ticket and can be bypassed with Scan anyway.
    if (manual && !forceFullScan &&
        unassignedSidebarCount() === 0 && candidates(ctx).length === 0) {
      forceScanAvailable = true;
      status('SchoolDude shows 0 Open Unassigned tickets. No changes made. Use "Scan all pages anyway" if this count is outdated.');
      return;
    }

    // Ask before the first editable action. Dismissing this prompt leaves
    // the grid untouched, which also makes button-response testing safe.
    if (manual && !CONFIG.previewOnly &&
        !window.confirm('Assign and save unassigned SchoolDude tickets now? This will change live ticket assignments.')) {
      status('Assignment cancelled. No changes made.');
      return;
    }

    if (!manual && !candidates(ctx).length && Date.now() - lastSweep < CONFIG.sweepIntervalMs) return;
    forceScanAvailable = false;
    busy = true;
    let saved = 0, proposed = 0, skipped = 0, pages = 0, inspected = 0, eligible = 0, complete = false;
    status(CONFIG.previewOnly ? 'Preview only: scanning ticket pages; no changes will be saved…' : 'Scanning all ticket pages…');
    // Let the browser paint the status before heavy grid/pagination operations.
    await wait(0);
    try {
      if (!await changePage(ctx, 'first')) return;
      const visited = new Set();
      while (!shouldStop(ctx)) {
        await settlePage(ctx);
        if (shouldStop(ctx)) break;
        const page = pageState(ctx);
        if (visited.has(page.start)) throw new Error('Pagination repeated a page; stopped to avoid a loop.');
        visited.add(page.start);
        pages++;
        inspected += rows(ctx.grid).length;
        const unassigned = candidates(ctx);
        eligible += unassigned.length;
        // No filter is needed: visit every page and edit ONLY unassigned tickets.
        const ids = unassigned.map(row => value(row, 'id')).filter(Boolean);
        const expected = new Map();
        status(`Page ${page.start}–${page.end}: staging ${ids.length} unassigned ticket(s)…`);
        for (const id of ids) {
          if (shouldStop(ctx, true)) {
            if (expected.size) {
              throw new Error('Interrupted with unsaved assignments. Review and Save this page manually.');
            }
            break;
          }
          const row = findRow(ctx, id);
          if (!row || !isUnassigned(row)) continue;
          const owner = route(value(row, 'rte_location'), value(row, 'work_type'), value(row, 'description'));
          if (!owner) { skipped++; continue; }
          const email = CONFIG.technicians[owner];
          if (!email) throw new Error(`No configured email for ${owner}.`);
          if (CONFIG.previewOnly) {
            proposed++;
            continue;
          }
          status(`Page ${page.start}–${page.end}: assigning #${id} to ${owner} (${expected.size + 1}/${ids.length})…`);
          if (await stageAssignment(ctx, id, email)) expected.set(id, email);
        }
        if (expected.size) saved += await savePageBatch(ctx, expected);
        if (shouldStop(ctx)) break;
        const after = pageState(ctx);
        if (after.end >= after.total) { complete = true; lastSweep = Date.now(); break; }
        if (!await changePage(ctx, 'next')) break;
      }
      status(CONFIG.previewOnly
        ? `Preview only: ${inspected} rows checked; ${eligible} unassigned; ${proposed} proposed; ${skipped} without a routing rule; 0 saved. ${complete ? 'Reached the last page.' : 'Scan interrupted.'}`
        : `${inspected} rows checked; ${eligible} unassigned; ${saved} saved; ${skipped} without a routing rule; ${pages} page(s). ${complete ? 'Reached the last page.' : 'Scan interrupted.'}`);
    } catch (error) {
      halted = true;
      status(`Stopped: ${error.message} Review the grid before reloading.`);
      console.error('[Dinuba assignment]', error);
      if (manual) alert(`Assignment stopped: ${error.message}`);
    } finally {
      busy = false;
      // Keep button enabled for inspecting results and future manual runs.
      updateButtonPresentation();
    }
  }
  function injectButtonStyles() {
    if (document.getElementById('dinuba-assign-styles')) return;
    const style = document.createElement('style');
    style.id = 'dinuba-assign-styles';
    style.textContent = `
      [data-dinuba-assignment] .dinuba-assign-action {
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        gap: 7px !important;
        box-sizing: border-box !important;
        min-width: 142px !important;
        height: 29px !important;
        padding: 0 12px !important;
        border: 1px solid #1d4ed8 !important;
        border-radius: 6px !important;
        background: #2563eb !important;
        color: #fff !important;
        font: 600 12px/1 Arial, sans-serif !important;
        cursor: pointer !important;
        box-shadow: 0 1px 3px rgba(37,99,235,.24) !important;
        white-space: nowrap !important;
      }
      [data-dinuba-assignment] .dinuba-assign-action:hover {
        background: #1d4ed8 !important;
      }
      [data-dinuba-assignment] .dinuba-assign-action:focus-visible {
        outline: 3px solid #93c5fd !important;
        outline-offset: 2px !important;
      }
      [data-dinuba-assignment] .dinuba-assign-action.is-busy {
        background: #334155 !important;
        border-color: #334155 !important;
        cursor: progress !important;
      }
      [data-dinuba-assignment] .dinuba-assign-icon {
        width: 14px;
        height: 14px;
        flex: 0 0 14px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }
      [data-dinuba-assignment] .dinuba-assign-action.is-busy .dinuba-assign-icon {
        animation: dinuba-assign-spin .85s linear infinite;
      }
      @keyframes dinuba-assign-spin { to { transform: rotate(360deg); } }
      #dinuba-assignment-progress {
        position: fixed !important;
        left: 18px !important;
        bottom: 18px !important;
        z-index: 2147483001 !important;
        max-width: min(360px, calc(100vw - 36px)) !important;
        box-sizing: border-box !important;
        padding: 14px 42px 14px 16px !important;
        border: 1px solid #bfdbfe !important;
        border-left: 4px solid #2563eb !important;
        border-radius: 10px !important;
        background: #fff !important;
        color: #172033 !important;
        font: 13px/1.4 Arial, sans-serif !important;
        box-shadow: 0 8px 24px rgba(15,23,42,.16) !important;
        overflow-wrap: anywhere !important;
      }
      #dinuba-assignment-progress strong {
        display: block !important;
        margin-bottom: 4px !important;
        font-weight: 700 !important;
      }
      #dinuba-assignment-progress .dinuba-progress-message {
        color: #475569 !important;
      }
      #dinuba-assignment-progress .dinuba-progress-close {
        position: absolute !important;
        top: 5px !important;
        right: 7px !important;
        border: 0 !important;
        background: transparent !important;
        color: #64748b !important;
        font: 22px Arial, sans-serif !important;
        cursor: pointer !important;
      }
      #dinuba-assignment-progress .dinuba-progress-force {
        display: inline-block !important;
        margin-top: 9px !important;
        padding: 6px 9px !important;
        background: #eff6ff !important;
        border: 1px solid #93c5fd !important;
        border-radius: 6px !important;
        color: #1d4ed8 !important;
        font: 600 12px Arial, sans-serif !important;
        cursor: pointer !important;
      }
      #dinuba-assignment-progress .dinuba-progress-force[hidden] {
        display: none !important;
      }
      [data-dinuba-assignment="toolbar"] { padding-left: 6px !important; }
      [data-dinuba-assignment="floating"] {
        position: fixed !important;
        right: 18px !important;
        bottom: 18px !important;
        z-index: 2147483000 !important;
        padding: 8px !important;
        background: #fff !important;
        border: 1px solid #cbd5e1 !important;
        border-radius: 10px !important;
        box-shadow: 0 8px 25px rgba(0,0,0,.16) !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }
  // SchoolDude hides overflowed toolbar items in narrow windows.
  // If our button cannot fit, use the clearly visible floating version.
  function hasToolbarSpace(target) {
    const host = target.toolbar.closest('.x-panel-fbar');
    if (!host) return false;
    const available = host.getBoundingClientRect().width;
    const occupied = [...target.toolbar.children].reduce((sum, cell) => {
      if (!cell.matches('td.x-toolbar-cell') ||
          cell.hasAttribute('data-dinuba-assignment') || !visible(cell)) return sum;
      return sum + cell.getBoundingClientRect().width;
    }, 0);
    return available >= occupied + 155;
  }
  // Update the interface synchronously on the user's FIRST click, then
  // begin the actual scan. No idle timer or background scan is required.
  function startManualScan(forceFullScan = false) {
    progressVisible = true;
    ensureProgressPanel();
    if (busy || starting) {
      status(lastStatus);
      return;
    }
    if (halted) {
      status('Previous run stopped after an error. Review the grid and reload.');
      return;
    }
    forceScanAvailable = false;
    starting = true;
    const sidebarCount = unassignedSidebarCount();
    status(sidebarCount === null
      ? 'Checking All Open Tickets…'
      : `Checking ${sidebarCount} Open Unassigned ticket(s)…`);

    // Begin the real work on the next browser task. This is not a wait for
    // user inactivity; it gives the immediate status a chance to render.
    setTimeout(() => {
      starting = false;
      run(true, forceFullScan).catch(error => {
        console.error('[Dinuba assignment] Unexpected start failure', error);
        status(`Assignment could not start: ${error.message}`);
      });
    }, 0);
  }

  function createAssignButton() {
    const button = document.createElement('button');
    button.className = 'dinuba-assign-action';
    button.type = 'button';
    button.innerHTML = `<span class="dinuba-assign-icon" aria-hidden="true">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 7h-9M14 3l-4 4 4 4M4 17h9M10 13l4 4-4 4"/>
      </svg></span><span class="dinuba-assign-label">Assign Tickets</span>`;
    button.title = lastStatus;
    button.addEventListener('click', event => {
      event.stopPropagation();
      startManualScan(false);
    });
    return button;
  }

  // Mount next to Reset in the real SchoolDude toolbar, without needing
  // Print Tickets. If it is temporarily absent, keep a fallback control.
  function install() {
    const surface = ticketSurface();
    const existing = all('[data-dinuba-assignment]');
    if (!surface) {
      existing.forEach(el => el.remove());
      return;
    }
    injectButtonStyles();
    const target = actionToolbar(surface);
    const toolbarReady = !!target && hasToolbarSpace(target);
    const valid = existing.filter(el => toolbarReady
      ? el.dataset.dinubaAssignment === 'toolbar' && el.parentElement === target.toolbar
      : el.dataset.dinubaAssignment === 'floating' && el.parentElement === document.body);
    const keep = valid[0] || null;
    existing.forEach(el => { if (el !== keep) el.remove(); });
    if (keep) {
      if (toolbarReady && keep.previousElementSibling !== target.anchor) {
        target.anchor.after(keep);
      }
      updateButtonPresentation();
      return;
    }

    const holder = document.createElement(toolbarReady ? 'td' : 'div');
    holder.dataset.dinubaAssignment = toolbarReady ? 'toolbar' : 'floating';
    if (toolbarReady) holder.className = 'x-toolbar-cell';
    holder.appendChild(createAssignButton());
    if (toolbarReady) target.anchor.after(holder);
    else document.body.appendChild(holder);
    updateButtonPresentation();
  }
  function tick() {
    install();
    if (CONFIG.autoRun) run();
  }
  let installQueued = false;
  const observer = new MutationObserver(() => {
    // Progress text updates and grid changes during a run do not need a
    // toolbar rescan. The normal interval remounts after a view change.
    if (installQueued || busy || starting) return;
    installQueued = true;
    setTimeout(() => { installQueued = false; install(); }, 120);
  });
  function start() {
    if (!document.body) return;
    observer.observe(document.body, {childList: true, subtree: true});
    tick();
    setInterval(tick, CONFIG.scanIntervalMs);
    window.addEventListener('resize', () => {
      if (!installQueued) {
        installQueued = true;
        setTimeout(() => { installQueued = false; install(); }, 120);
      }
    });
  }
  if (document.body) start();
  else document.addEventListener('DOMContentLoaded', start, {once: true});
})();
