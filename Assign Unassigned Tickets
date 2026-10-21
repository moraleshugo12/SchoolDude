// ==UserScript==
// @name         Dinuba Help Desk - Assign Unassigned Tickets
// @namespace    dinuba.helpdesk.assignment
// @version      1.2.2
// @description  Assign unassigned tickets by site and Chromebook repair responsibility, then Save.
// @match        https://975.insight.schooldude.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  'use strict';
  if (window.__dinubaAssignTickets) return;
  window.__dinubaAssignTickets = true;

  const CONFIG = {
    autoRun: true,
    scanIntervalMs: 15000,
    sweepIntervalMs: 60000,
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
      await wait(100);
    }
    throw new Error(message);
  }
  function click(el) {
    el.scrollIntoView({block: 'nearest', inline: 'nearest'});
    for (const type of ['mousedown', 'mouseup', 'click']) {
      el.dispatchEvent(new MouseEvent(type, {bubbles: true, cancelable: true, view: window, button: 0, buttons: type === 'mousedown' ? 1 : 0}));
    }
  }
  function context() {
    const headings = all('.x-panel-header-text[role="heading"]').filter(el =>
      visible(el) && norm(el.textContent) === 'all open tickets');
    if (headings.length !== 1) return null;
    const scope = headings[0].closest('.x-panel');
    if (!scope) return null;
    // The footer and grid share a panel. Avoid unrelated Save buttons or grids.
    const prints = all('button', scope).filter(b => visible(b) &&
      (b.id === 'PrintTicketsBtnInjected' || norm(b.textContent) === 'print tickets'));
    for (const print of prints) {
      let panel = print.parentElement;
      while (panel && scope.contains(panel)) {
        const grids = all('.x-grid3', panel).filter(visible);
        const saves = all('button', panel).filter(b => visible(b) && norm(b.textContent) === 'save');
        if (grids.length === 1 && saves.length === 1) return {print, panel, scope, grid: grids[0], save: saves[0]};
        panel = panel.parentElement;
      }
    }
    return null;
  }
  let busy = false, halted = false;
  let lastInteraction = 0;
  let lastSweep = 0;
  document.addEventListener('pointerdown', event => {
    if (event.isTrusted && !event.target.closest('[data-dinuba-assignment]')) lastInteraction = Date.now();
  }, true);
  document.addEventListener('keydown', event => {
    if (event.isTrusted) lastInteraction = Date.now();
  }, true);
  function status(text) {
    console.info('[Dinuba assignment]', text);
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
      return Date.now() - stableSince >= 1000;
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
  function shouldStop(ctx) {
    return document.hidden || !currentContext(ctx) ||
      Date.now() - lastInteraction < 4000 || dirty(ctx) || activeEditor();
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
      return Date.now() - stableSince >= 1000;
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
  async function assign(ctx, id, email) {
    requireContext(ctx);
    let row = findRow(ctx, id);
    if (!row || !isUnassigned(row)) return false;
    const target = cell(row, 'assigned_to');
    target.scrollIntoView({block: 'nearest', inline: 'nearest'});
    click(target);
    target.dispatchEvent(new MouseEvent('dblclick', {bubbles: true, cancelable: true, view: window, detail: 2}));
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
    // Check again immediately before changing the value.
    row = findRow(ctx, id);
    if (!row || !isUnassigned(row)) throw new Error(`Ticket ${id}: row changed while opening the editor.`);
    requireContext(ctx);
    click(option);
    input.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true}));
    input.dispatchEvent(new KeyboardEvent('keyup', {key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true}));
    // Clicking the column heading area commits editors that commit on blur.
    const header = ctx.grid.querySelector('.x-grid3-header');
    if (header) click(header);
    await until(() => {
      const current = findRow(ctx, id);
      return current && norm(value(current, 'assigned_to')) === norm(email);
    }, `Ticket ${id}: selected technician was not committed to Assigned To.`);
    await until(() => enabled(ctx.save), `Ticket ${id}: Save did not become available.`);
    requireContext(ctx);
    click(ctx.save);
    // Save disabling plus the expected row value is a UI acknowledgement only.
    await wait(500);
    await until(() => {
      const current = findRow(ctx, id);
      return visible(ctx.save) && !enabled(ctx.save) && current &&
        norm(value(current, 'assigned_to')) === norm(email) &&
        !current.querySelector('.x-grid3-dirty-cell') &&
        !all('.x-mask-loading, .ext-el-mask, .x-message-box').some(visible);
    }, `Ticket ${id}: Save could not be confirmed. Check the page before continuing.`, 15000);
    return true;
  }
  async function run(manual = false) {
    if (busy || halted || document.hidden) return;
    const ctx = context();
    if (!ctx) return;
    if (dirty(ctx)) { status('Waiting: save or reset your existing changes first.'); return; }
    if (activeEditor()) { status('Waiting: close the open cell editor/dropdown, then click Assign Tickets.'); return; }
    if (Date.now() - lastInteraction < 4000) { status('Waiting for 4 seconds without page interaction…'); return; }
    if (loading(ctx)) { status('Waiting for the ticket page to load…'); return; }
    // A ticket newly made Unassigned on the current page must not wait for a sweep cooldown.
    if (!manual && !candidates(ctx).length && Date.now() - lastSweep < CONFIG.sweepIntervalMs) return;
    busy = true;
    let saved = 0, skipped = 0, pages = 0, inspected = 0, eligible = 0, complete = false;
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
        const ids = unassigned.map(r => value(r, 'id')).filter(Boolean);
        status(`Page ${page.start}–${page.end}: ${unassigned.length} unassigned ticket(s) found.`);
        for (const id of ids) {
          if (shouldStop(ctx)) break;
          const row = findRow(ctx, id);
          if (!row || !isUnassigned(row)) continue;
          const owner = route(value(row, 'rte_location'), value(row, 'work_type'), value(row, 'description'));
          if (!owner) { skipped++; continue; }
          status(`Assigning #${id} to ${owner}…`);
          if (await assign(ctx, id, CONFIG.technicians[owner])) saved++;
          await wait(500);
        }
        if (shouldStop(ctx)) break;
        const after = pageState(ctx);
        if (after.end >= after.total) { complete = true; lastSweep = Date.now(); break; }
        if (!await changePage(ctx, 'next')) break;
      }
      status(`${inspected} rows checked; ${eligible} unassigned; ${saved} saved; ${skipped} without a routing rule; ${pages} page(s). ${complete ? 'Reached the last page.' : 'Scan interrupted.'}`);
    } catch (error) {
      halted = true;
      status(`Stopped: ${error.message} Reload after reviewing the ticket.`);
      console.error('[Dinuba assignment]', error);
    } finally {
      busy = false;
    }
  }
  function schoolDudeButton(text, width) {
    // Use the same nine-cell button frame and CSS classes as Print Tickets.
    const frame = document.createElement('table');
    frame.cellSpacing = '0';
    frame.className = 'x-btn x-component x-btn-noicon x-unselectable';
    frame.style.marginRight = '5px';
    frame.setAttribute('role', 'presentation');
    frame.innerHTML = `<tbody class="x-btn-small x-btn-icon-small-left">
      <tr><td class="x-btn-tl"><i>&nbsp;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&nbsp;</i></td></tr>
      <tr><td class="x-btn-ml"><i>&nbsp;</i></td><td class="x-btn-mc"><em unselectable="on"><button class="x-btn-text" type="button"></button></em></td><td class="x-btn-mr"><i>&nbsp;</i></td></tr>
      <tr><td class="x-btn-bl"><i>&nbsp;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td></tr>
    </tbody>`;
    const button = frame.querySelector('button');
    button.textContent = text;
    button.style.width = `${width}px`;
    button.style.position = 'relative';
    frame.addEventListener('mouseenter', () => frame.classList.add('x-btn-over'));
    frame.addEventListener('mouseleave', () => frame.classList.remove('x-btn-over', 'x-btn-click'));
    frame.addEventListener('mousedown', () => frame.classList.add('x-btn-click'));
    frame.addEventListener('mouseup', () => frame.classList.remove('x-btn-click'));
    button.addEventListener('focus', () => frame.classList.add('x-btn-focus'));
    button.addEventListener('blur', () => frame.classList.remove('x-btn-focus', 'x-btn-click'));
    return {frame, button};
  }
  function install() {
    const ctx = context();
    all('[data-dinuba-assignment]').forEach(el => {
      if (!ctx || !ctx.panel.contains(el)) el.remove();
    });
    if (!ctx || ctx.panel.querySelector('[data-dinuba-assignment]')) return;
    const anchor = ctx.print.closest('td.x-toolbar-cell');
    if (!anchor) return;
    const holder = document.createElement('td');
    holder.className = 'x-toolbar-cell';
    holder.setAttribute('data-dinuba-assignment', '');
    const assignControl = schoolDudeButton('Assign Tickets', 110);
    const button = assignControl.button;
    button.title = 'Assign unassigned tickets across all pages';
    button.addEventListener('click', () => {
      if (halted) { status('Stopped after an error. Review the ticket and reload.'); return; }
      run(true);
    });
    holder.append(assignControl.frame);
    anchor.after(holder);
  }
  function tick() {
    install();
    if (CONFIG.autoRun) run();
  }
  let installQueued = false;
  new MutationObserver(() => {
    if (installQueued) return;
    installQueued = true;
    setTimeout(() => { installQueued = false; install(); }, 100);
  }).observe(document.body, {childList: true, subtree: true, characterData: true,
    attributes: true, attributeFilter: ['class', 'style', 'aria-hidden']});
  setTimeout(tick, 3000);
  setInterval(tick, CONFIG.scanIntervalMs);
})();
