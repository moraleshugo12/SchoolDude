// ==UserScript==
// @name         Dinuba - Assign and Save Open Tickets
// @namespace    dinuba.ticket.assignment
// @version      1.3.8
// @description  Assign unassigned tickets by school and save batches across pages.
// @match        https://975.insight.schooldude.com/live*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(() => {
  'use strict';
  const USERS = {
    sage: 'sage@dinuba.k12.ca.us',
    jose: 'Jose.Hernandez@dinuba.k12.ca.us',
    sam: 'samantha.porras@dinuba.k12.ca.us',
    hugo: 'Hugo.Morales@dinuba.k12.ca.us',
    aaron: 'amorgan@dinuba.k12.ca.us',
  };
  const SCHOOLS = {
    'washington intermediate school': 'sage', 'roosevelt elementary': 'sage',
    'kennedy elementary': 'sage', 'lincoln elementary': 'sage',
    'dinuba intermediate school': 'jose', 'wilson elementary': 'jose',
    'jefferson elementary': 'jose', 'edtech/lgss/elop': 'jose',
    'maintenance & operations': 'jose', 'dinuba high school': 'sam',
    'grand view elementary': 'hugo', 'district office': 'hugo',
    'dinuba vocational center': 'hugo', 'sierra vista hs': 'aaron',
    'ronald reagan academy': 'aaron', 'adult school': 'aaron',
  };
  const norm = s => String(s ?? '').normalize('NFKC').toLowerCase().replace(/\s+/g, ' ').trim();
  const visible = e => e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
  const all = (s, root = document) => [...root.querySelectorAll(s)];
  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
  let running = false, stopped = false;
  function openTicketsView() {
    return all('[id="MainGrid"]').find(root => visible(root) &&
      all('.x-panel-header-text', root).some(label =>
        label.closest('.x-panel') === root && visible(label) && norm(label.textContent) === 'all open tickets'));
  }
  async function until(fn, description, timeout = 15000) {
    const start = Date.now();
    while (Date.now() - start < timeout) {
      if (stopped) throw new Error('Stopped. Any unsaved edits remain on the page.');
      if (running && !openTicketsView()) throw new Error('Left All Open Tickets. Assignment stopped.');
      const result = fn();
      if (result) return result;
      await sleep(150);
    }
    throw new Error(`Timed out: ${description}. Check the page before running again.`);
  }
  function click(e) {
    if (running && !openTicketsView()) throw new Error('Left All Open Tickets. Assignment stopped.');
    if (!e) throw new Error('Required page control is missing.');
    e.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    for (const type of ['mousedown', 'mouseup', 'click'])
      e.dispatchEvent(new MouseEvent(type, { bubbles: true, cancelable: true, view: window }));
  }
  const disabled = e => !e || e.disabled || e.getAttribute('aria-disabled') === 'true' || !!e.closest('.x-item-disabled');
  const cell = (row, field) => row.querySelector(`[class~="x-grid3-col-base.inc_incident.${field}"]`);
  const value = (row, field) => cell(row, field)?.textContent.trim() || '';
  const empty = s => /^(?:unassigned|unassigned user|none|\(none\)|--|not assigned)?$/i.test(s.trim());
  const rows = () => { const root = openTicketsView(); return root ? all('.x-grid3-row[storeindex]', root).filter(visible) : []; };
  function grid() {
    const row = rows()[0];
    if (!row) throw new Error('No ticket rows found. Open All Open Tickets first.');
    return row.closest('.x-grid-panel') || row.closest('.x-panel');
  }
  const saveButton = () => { const root = openTicketsView(); return root && all('button[id="Save"]', root).find(visible); };
  const busy = () => all('#wait,.x-mask-loading').some(visible);
  function pager(kind) {
    return all(`.x-tool-page-${kind}`, grid()).filter(visible).map(e => e.closest('button')).find(Boolean);
  }
  function signature() {
    return rows().map(r => value(r, 'id')).join('|') + ' / ' + all('.my-paging-display').filter(visible).map(e => e.textContent).join('|');
  }
  async function turn(kind) {
    const control = pager(kind);
    if (disabled(control)) return false;
    const before = signature();
    click(control);
    await until(() => !busy() && signature() !== before, `loading ${kind} page`, 30000);
    await sleep(400);
    return true;
  }
  function owner(school) {
    const key = norm(school);
    const match = Object.keys(SCHOOLS).find(s => key === s || key === `${s} school`);
    return match ? USERS[SCHOOLS[match]] : null;
  }
  async function assign(id, email) {
    const row = rows().find(r => value(r, 'id') === id);
    if (!row || !empty(value(row, 'assigned_to'))) return false;
    const target = cell(row, 'assigned_to');
    click(target);
    target.dispatchEvent(new MouseEvent('dblclick', { bubbles: true, cancelable: true, view: window, detail: 2 }));
    const input = await until(() => all('input[name="base.inc_incident.assigned_to"]').find(visible), 'opening assignment editor');
    input.focus();
    // Open the actual reference dropdown: selecting an item commits its internal user ID.
    const trigger = input.closest('.x-form-field-wrap')?.querySelector('.x-form-trigger');
    if (trigger) click(trigger);
    else input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', keyCode: 40, which: 40, bubbles: true }));
    const item = await until(() => {
      const list = document.getElementById(input.id.replace(/-input$/, '-combo-list'));
      const scope = list && visible(list) ? list : null;
      return scope && all('.x-combo-list-item', scope).find(e => norm(e.textContent) === norm(email));
    }, `finding ${email} in assignment dropdown`);
    click(item);
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
    click(cell(row, 'id'));
    await until(() => {
      const current = rows().find(r => value(r, 'id') === id);
      return current && norm(value(current, 'assigned_to')) === norm(email);
    }, `committing assignment for ticket ${id}`);
    return true;
  }
  const panel = document.createElement('td');
  panel.className = 'x-toolbar-cell';
  panel.dataset.dinubaAutoAssign = 'toolbar';
  const controls = document.createElement('div');
  controls.style.cssText = 'display:flex;align-items:center;gap:8px;margin-left:8px;white-space:nowrap;font:12px Arial;color:#15428b';
  // Use the same three-piece GXT table skin as the neighboring toolbar buttons.
  const buttonFrame = document.createElement('table');
  buttonFrame.cellSpacing = '0';
  buttonFrame.setAttribute('role', 'presentation');
  buttonFrame.className = 'x-btn x-component x-btn-noicon x-unselectable';
  buttonFrame.setAttribute('unselectable', 'on');
  buttonFrame.style.marginRight = '5px';
  buttonFrame.innerHTML = `<tbody class="x-btn-small x-btn-icon-small-left">
    <tr><td class="x-btn-tl"><i>&nbsp;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&nbsp;</i></td></tr>
    <tr><td class="x-btn-ml"><i>&nbsp;</i></td><td class="x-btn-mc"><em unselectable="on"><button class="x-btn-text" type="button" tabindex="0" style="position:relative;width:85px">Auto Assign</button></em></td><td class="x-btn-mr"><i>&nbsp;</i></td></tr>
    <tr><td class="x-btn-bl"><i>&nbsp;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td></tr>
  </tbody>`;
  const start = buttonFrame.querySelector('button');
  buttonFrame.addEventListener('mouseenter', () => { if (!start.disabled) buttonFrame.classList.add('x-btn-over'); });
  buttonFrame.addEventListener('mouseleave', () => buttonFrame.classList.remove('x-btn-over', 'x-btn-click'));
  start.addEventListener('mousedown', () => { if (!start.disabled) buttonFrame.classList.add('x-btn-click'); });
  start.addEventListener('mouseup', () => buttonFrame.classList.remove('x-btn-click'));
  start.addEventListener('focus', () => buttonFrame.classList.add('x-btn-focus'));
  start.addEventListener('blur', () => buttonFrame.classList.remove('x-btn-focus', 'x-btn-click'));
  const stop = document.createElement('button');
  stop.type = 'button';
  stop.textContent = 'Stop'; stop.disabled = true; stop.hidden = true;
  const status = document.createElement('span');
  status.setAttribute('role', 'status');
  status.style.cssText = 'display:inline-block;max-width:230px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap';
  controls.append(buttonFrame, stop, status); panel.append(controls);
  function syncToolbar() {
    const root = openTicketsView();
    const save = root && all('button[id="Save"]', root).find(visible);
    const toolbar = save?.closest('.x-panel-fbar');
    const toolbarRow = toolbar && all('.x-toolbar-left-row', toolbar)[0];
    if (!root || !toolbarRow) {
      if (running) stopped = true;
      if (panel.isConnected) panel.remove();
      return;
    }
    if (panel.parentElement !== toolbarRow) toolbarRow.append(panel);
  }
  let toolbarUpdatePending = false;
  new MutationObserver(() => {
    if (toolbarUpdatePending) return;
    toolbarUpdatePending = true;
    requestAnimationFrame(() => { toolbarUpdatePending = false; syncToolbar(); });
  }).observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['class', 'style'] });
  window.addEventListener('hashchange', syncToolbar);
  syncToolbar();
  function report(message) {
    status.textContent = message.split('\n').slice(0, 2).join(' ');
    status.title = message;
    console.info('[Dinuba assignment]', message);
  }
  stop.onclick = () => { stopped = true; stop.disabled = true; };
  start.onclick = async () => {
    if (running || !openTicketsView()) return;
    running = true; stopped = false; start.disabled = true; stop.disabled = false; stop.hidden = false;
    buttonFrame.classList.add('x-item-disabled');
    buttonFrame.classList.remove('x-btn-over', 'x-btn-click');
    let total = 0;
    const seen = new Set(), skipped = new Set();
    try {
      grid();
      if (!disabled(saveButton())) throw new Error('Save your existing edits first, then run assignment.');
      if (all('input[name="base.inc_incident.assigned_to"]').some(visible))
        throw new Error('Finish or cancel the currently open assignment editor first.');
      await turn('first');
      let pages = 0;
      while (true) {
        if (++pages > 2000) throw new Error('Page limit reached; stopped to prevent a loop.');
        if (stopped) throw new Error('Stopped.');
        const batch = [];
        for (const row of rows()) {
          const id = value(row, 'id'), school = value(row, 'rte_location');
          if (!id || seen.has(id) || !empty(value(row, 'assigned_to'))) continue;
          const email = owner(school);
          if (!email) { skipped.add(`${id}: ${school || '(no school)'}`); continue; }
          batch.push({ id, email });
        }
        if (batch.length) {
          const changed = [];
          for (const ticket of batch) {
            report(`Saved: ${total}\nAssigning #${ticket.id} to ${ticket.email}…`);
            if (await assign(ticket.id, ticket.email)) changed.push(ticket);
          }
          if (changed.length) {
            const save = await until(() => { const b = saveButton(); return !disabled(b) && b; }, 'enabling Save');
            report(`Saved: ${total}\nSaving ${changed.length} assignments…`);
            click(save);
            await sleep(800);
            await until(() => !busy() && disabled(saveButton()), 'finishing Save', 60000);
            // Reload from the server before declaring the batch complete.
            const refresh = pager('refresh');
            if (disabled(refresh)) throw new Error('Cannot refresh to verify the saved batch.');
            const oldRows = rows();
            click(refresh);
            await until(() => !busy() && oldRows.some(r => !r.isConnected), 'reloading saved tickets', 30000);
            await sleep(400);
            for (const ticket of changed) {
              const row = rows().find(r => value(r, 'id') === ticket.id);
              if (row && norm(value(row, 'assigned_to')) !== norm(ticket.email))
                throw new Error(`Ticket ${ticket.id} did not retain its assignment after refresh.`);
              seen.add(ticket.id);
            }
            total += changed.length;
          }
          // Assignment can remove rows from an unassigned filter or change sorting.
          // Restart at page one after every saved batch so shifted rows are not missed.
          await turn('first');
          continue;
        }
        if (!await turn('next')) break;
      }
      report(`Finished. Saved ${total} assignments.\nSkipped ${skipped.size} unassigned tickets with unmatched schools.${skipped.size ? '\n' + [...skipped].join('\n') : ''}`);
    } catch (error) {
      report(`Stopped. Saved ${total} assignments.\n${error.message}`);
      console.error('[Dinuba assignment]', error);
    } finally {
      running = false; start.disabled = false; stop.disabled = true; stop.hidden = true;
      buttonFrame.classList.remove('x-item-disabled');
    }
  };
})();
