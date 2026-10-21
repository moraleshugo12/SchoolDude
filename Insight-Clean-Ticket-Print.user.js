// ==UserScript==
// @name         Insight Clean Ticket Print (Robust Toolbar)
// @namespace    https://local.print/
// @version      2.1.0
// @description  Choose tickets and print a compact list or detailed ticket sheets.
// @match        https://*.insight.schooldude.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  'use strict';
  if (window.__dinubaPrintInstalled) return;
  window.__dinubaPrintInstalled = true;
  const all = (selector, root = document) => [...root.querySelectorAll(selector)];
  const norm = text => String(text ?? '').replace(/\s+/g, ' ').trim().toLowerCase();
  const visible = el => !!el && el.isConnected && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden';
  const escape = text => String(text ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const fields = {
    id:'Ticket', incident_status:'Status', assigned_to:'Assigned to', rte_location:'Site',
    work_type:'Work type', incident_priority:'Priority', requested_by:'Requested by',
    on_behalf_of:'On behalf of', area_room:'Room', rte_building:'Building',
    rte_area:'Area', work_queue:'Work queue', created_on:'Created',
    description:'Description', resolution:'Resolution'
  };
  function readRows(grid) {
    // This joined user field belongs to Reported By, not On Behalf Of.
    const phoneHeader = all('.x-grid3-hd-inner', grid).find(el =>
      norm(el.textContent) === 'reported by business phone');
    const phoneColumn = (phoneHeader && [...phoneHeader.classList]
      .find(name => /^x-grid3-hd-.+\.cmn_user\.phone$/.test(name))
      ?.replace(/^x-grid3-hd-/, '')) || 'j_6785.cmn_user.phone';
    return all('.x-grid3-row', grid).map(row => {
      const ticket = {};
      for (const key of Object.keys(fields)) {
        const cell = row.querySelector(`[class~="x-grid3-col-base.inc_incident.${key}"]`);
        ticket[key] = cell?.textContent?.trim() || '';
      }
      ticket.reported_by_business_phone = row.querySelector(
        `[class~="x-grid3-col-${phoneColumn}"]`)?.textContent?.trim() || '';
      ticket.selected = row.classList.contains('x-grid3-row-selected') ||
        row.getAttribute('aria-selected') === 'true';
      return ticket;
    }).filter(ticket => ticket.id);
  }
  function listContext(button) {
    let panel = button.parentElement;
    while (panel && panel !== document.body) {
      const grids = all('.x-grid3', panel).filter(visible);
      if (grids.length === 1 && readRows(grids[0]).length) return {panel, grid:grids[0]};
      panel = panel.parentElement;
    }
    return null;
  }
  function readForm(button) {
    let root = button.closest('.x-window') || document;
    const get = key => {
      const id = `base_inc_incident_${key}`;
      const containers = all(`[id="${id}"], [id="${id}-input"], [name="base.inc_incident.${key}"]`, root).filter(visible);
      const el = containers.find(el => /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)) || containers[0];
      if (!el) return '';
      const input = /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) ? el : el.querySelector('input,textarea,select');
      return String(input?.value ?? el.textContent ?? '').trim();
    };
    const ticket = Object.fromEntries(Object.keys(fields).map(key => [key,get(key)]));
    if (!ticket.description && !ticket.rte_location) return null;
    ticket.id ||= new URLSearchParams(location.search).get('id') || 'Current ticket';
    return ticket;
  }
  function nativeButton(text) {
    const cell = document.createElement('td');
    cell.className = 'x-toolbar-cell';
    cell.innerHTML = `<table cellspacing="0" role="presentation" class="x-btn x-component x-btn-noicon x-unselectable" style="margin-right:5px">
      <tbody class="x-btn-small x-btn-icon-small-left"><tr><td class="x-btn-tl"><i>&nbsp;</i></td><td class="x-btn-tc"></td><td class="x-btn-tr"><i>&nbsp;</i></td></tr>
      <tr><td class="x-btn-ml"><i>&nbsp;</i></td><td class="x-btn-mc"><em unselectable="on"><button class="x-btn-text" type="button" style="position:relative;width:110px"></button></em></td><td class="x-btn-mr"><i>&nbsp;</i></td></tr>
      <tr><td class="x-btn-bl"><i>&nbsp;</i></td><td class="x-btn-bc"></td><td class="x-btn-br"><i>&nbsp;</i></td></tr></tbody></table>`;
    const button = cell.querySelector('button');
    button.textContent = text;
    const frame = cell.querySelector('table');
    frame.addEventListener('mouseenter', () => frame.classList.add('x-btn-over'));
    frame.addEventListener('mouseleave', () => frame.classList.remove('x-btn-over','x-btn-click'));
    frame.addEventListener('mousedown', () => frame.classList.add('x-btn-click'));
    frame.addEventListener('mouseup', () => frame.classList.remove('x-btn-click'));
    button.addEventListener('focus', () => frame.classList.add('x-btn-focus'));
    button.addEventListener('blur', () => frame.classList.remove('x-btn-focus'));
    return {cell,button};
  }
  function install() {
    // Own the list button but preserve its existing ID for the assignment script.
    const anchors = all('button').filter(button => visible(button) && button.id === 'LogCallButton');
    for (const anchor of anchors) {
      const anchorCell = anchor.closest('td.x-toolbar-cell');
      const toolbar = anchorCell?.parentElement;
      if (!toolbar) continue;
      toolbar.setAttribute('data-dinuba-print-toolbar', '');
      const oldButtons = all('button', toolbar).filter(button => button.id === 'PrintTicketsBtnInjected');
      let printCell = oldButtons[0]?.closest('td.x-toolbar-cell');
      if (!printCell?.hasAttribute('data-dinuba-print')) {
        const control = nativeButton('Print Tickets');
        control.button.id = 'PrintTicketsBtnInjected';
        control.cell.setAttribute('data-dinuba-print','');
        oldButtons.forEach(button => button.closest('td.x-toolbar-cell')?.remove());
        printCell = control.cell;
      }
      if (anchorCell.nextElementSibling !== printCell) anchorCell.after(printCell);
      const assign = toolbar.querySelector('[data-dinuba-assignment]');
      if (assign && printCell.nextElementSibling !== assign) printCell.after(assign);
    }
    // Keep the existing single-ticket entry point, if present, and add it near Close otherwise.
    for (const close of all('button.x-btn-text').filter(button => visible(button) && norm(button.textContent) === 'close')) {
      if (!readForm(close)) continue;
      const closeCell = close.closest('td.x-toolbar-cell');
      closeCell?.parentElement.setAttribute('data-dinuba-print-toolbar', '');
      if (!closeCell || closeCell.parentElement.querySelector('[id="tm-print-ticket"]')) continue;
      const control = nativeButton('Print Tickets');
      control.button.id = 'tm-print-ticket';
      closeCell.before(control.cell);
    }
  }
  const styles = document.createElement('style');
  styles.textContent = `
    [data-dinuba-print-toolbar]{border-spacing:0!important}
    [data-dinuba-print-toolbar]>td.x-toolbar-cell{padding:0 8px 0 0!important;vertical-align:middle!important}
    [data-dinuba-print-toolbar]>td.x-toolbar-cell:last-child{padding-right:0!important}
    [data-dinuba-print-toolbar]>td.x-toolbar-cell>table.x-btn{margin:0!important}
    #dinuba-print-dialog{padding:0;border:1px solid #e2e8f0;border-radius:18px;width:min(1140px,94vw);max-height:92vh;color:#172b43;background:#fff;font:14px/1.45 'Segoe UI',Arial,sans-serif;box-shadow:0 30px 100px #0f172a45;overflow:hidden;color-scheme:light}
    #dinuba-print-dialog[open]{display:flex;flex-direction:column}
    #dinuba-print-dialog::backdrop{background:#0f172a80;backdrop-filter:blur(4px)}
    #dinuba-print-dialog *{box-sizing:border-box}
    #dinuba-print-dialog header{display:flex;align-items:flex-start;justify-content:space-between;gap:16px;padding:26px 28px 22px;background:white;border-bottom:1px solid #edf0f4;flex-shrink:0}
    #dinuba-print-dialog .eyebrow{margin:0 0 5px;color:#2563eb;font-size:10px;font-weight:700;letter-spacing:1.5px}
    #dinuba-print-dialog h2{margin:0;font-size:26px;line-height:1.2;letter-spacing:-.6px;font-weight:650}
    #dinuba-print-dialog .subheading{margin:7px 0 0;color:#64748b;font-size:13px}
    #dinuba-print-dialog h3{margin:0 0 12px;font-size:12px;font-weight:700;letter-spacing:.35px;color:#475569}
    #dinuba-print-dialog .content{padding:24px 28px;overflow:auto;min-height:0;background:#fbfcfe}
    #dinuba-print-dialog .formats{display:flex;gap:14px;margin-bottom:26px;flex-wrap:wrap}
    #dinuba-print-dialog .format{flex:1;min-width:230px;display:flex;align-items:flex-start;gap:12px;border:1px solid #dce3ec;border-radius:12px;background:#fff;padding:18px;cursor:pointer;transition:border-color .15s,box-shadow .15s}
    #dinuba-print-dialog .format:hover{border-color:#94b6ed;box-shadow:0 3px 12px #0f172a08}
    #dinuba-print-dialog .format:has(input:checked){border-color:#2563eb;background:#eff6ff;box-shadow:inset 0 0 0 1px #2563eb}
    #dinuba-print-dialog .format strong{font-weight:650;font-size:14px}
    #dinuba-print-dialog small{display:block;color:#64748b;line-height:1.6;margin-top:5px;font-size:12px}
    #dinuba-print-dialog input[type=checkbox],#dinuba-print-dialog input[type=radio]{accent-color:#2563eb;width:16px;height:16px;flex-shrink:0;margin:2px 0 0;cursor:pointer}
    #dinuba-print-dialog .filters{display:flex;gap:10px;align-items:center;flex-wrap:wrap;margin-bottom:14px}
    #dinuba-print-dialog .selection{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-bottom:12px}
    #dinuba-print-dialog input[type=search]{flex:2;min-width:200px}#dinuba-print-dialog select{flex:1;min-width:160px}
    #dinuba-print-dialog input[type=search],#dinuba-print-dialog select{height:42px;padding:0 12px;border:1px solid #dce3ec;border-radius:8px;background:#fff;color:#334155;font:inherit;font-size:13px}
    #dinuba-print-dialog input::placeholder{color:#94a3b8}
    #dinuba-print-dialog button{padding:9px 14px;border:1px solid #dce3ec;border-radius:8px;background:#fff;color:#334155;font:600 12px/1.4 'Segoe UI',Arial,sans-serif;cursor:pointer;transition:background .15s,border-color .15s}
    #dinuba-print-dialog button:hover{background:#f1f5f9;border-color:#bdcadd}
    #dinuba-print-dialog button:disabled{opacity:.45;cursor:default}
    #dinuba-print-dialog :is(button,input,select):focus-visible{outline:3px solid #93c5fd;outline-offset:2px}
    #dinuba-print-dialog button.primary{background:#2563eb;color:white;border-color:#2563eb;padding:11px 22px;box-shadow:0 2px 4px #2563eb25}
    #dinuba-print-dialog button.primary:hover{background:#1d4ed8;border-color:#1d4ed8}
    #dinuba-print-dialog header button{width:34px;height:34px;padding:0;border-color:transparent;background:#f1f5f9;border-radius:50%;font-size:16px;color:#64748b}
    #dinuba-print-dialog [data-all]{margin-left:auto;color:#2563eb;background:#eff6ff;border-color:#dbeafe}
    #dinuba-print-dialog .table-wrap{overflow:auto;max-height:34vh;border:1px solid #e2e8f0;border-radius:10px;background:#fff}
    #dinuba-print-dialog table{width:100%;border-collapse:separate;border-spacing:0;font:12px/1.5 'Segoe UI',Arial,sans-serif;color:#334155}
    #dinuba-print-dialog th{position:sticky;top:0;background:#f8fafc;text-align:left;z-index:1;color:#64748b;font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;white-space:nowrap}
    #dinuba-print-dialog td,#dinuba-print-dialog th{padding:12px 14px;border-bottom:1px solid #edf1f5;vertical-align:top}
    #dinuba-print-dialog tbody tr:hover{background:#f8fafc}
    #dinuba-print-dialog tbody tr:has(input:checked){background:#f0f6ff}
    #dinuba-print-dialog tbody tr:last-child td{border-bottom:0}
    #dinuba-print-dialog td.summary{min-width:240px;max-width:400px;overflow-wrap:anywhere}
    #dinuba-print-dialog footer{display:flex;gap:10px;align-items:center;justify-content:flex-end;padding:18px 28px;border-top:1px solid #e9eef5;background:#fff;flex-shrink:0}
    #dinuba-print-dialog .note{color:#7b8a9e;font-size:11px;line-height:1.6;margin:12px 0 0}
    #dinuba-print-dialog .count{margin-right:auto;font-size:12px;font-weight:600;color:#475569;background:#f1f5f9;padding:7px 11px;border-radius:20px}
    #dinuba-print-dialog .error{color:#b91c1c}
    @media(max-width:640px){#dinuba-print-dialog header,#dinuba-print-dialog .content,#dinuba-print-dialog footer{padding:18px}#dinuba-print-dialog .format{min-width:100%}#dinuba-print-dialog footer{flex-wrap:wrap}#dinuba-print-dialog .count{width:100%;margin-bottom:4px}#dinuba-print-dialog .filters>*{min-width:100%}}
  `;
  document.head.append(styles);
  let modal = null;
  const wait = ms => new Promise(resolve => setTimeout(resolve,ms));
  async function until(fn, message, timeout=20000) {
    const start = Date.now();
    while (Date.now()-start < timeout) { const result=fn(); if(result) return result; await wait(100); }
    throw new Error(message);
  }
  function click(el) {
    for(const type of ['mousedown','mouseup','click']) el.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,view:window,button:0}));
  }
  function enabled(button) {
    return visible(button) && !button.disabled && button.getAttribute('aria-disabled') !== 'true' &&
      !button.closest('.x-item-disabled') && !button.querySelector('.x-item-disabled');
  }
  function assertIdle(ctx) {
    if (!visible(ctx.grid) || !ctx.panel.isConnected) throw new Error('The ticket view changed. Close this window and reopen Print Tickets.');
    const save = all('button',ctx.panel).find(button=>visible(button) && norm(button.textContent)==='save');
    if ((save && enabled(save)) || ctx.grid.querySelector('.x-grid3-dirty-cell')) throw new Error('Save or reset your ticket edits before loading pages.');
  }
  function pageState(ctx) {
    const bars=all('.page-toolbar',ctx.panel).filter(visible);
    if(bars.length !== 1) throw new Error('Could not identify the ticket pagination toolbar.');
    const bar=bars[0];
    const match=(bar.querySelector('.my-paging-display')?.textContent || '').replace(/,/g,'').match(/Displaying\s+(\d+)\s*[-–]\s*(\d+)\s+of\s+(\d+)/i);
    if(!match) throw new Error('Could not read the ticket page range.');
    const first=bar.querySelector('.x-tool-page-first')?.closest('button');
    const next=bar.querySelector('.x-tool-page-next')?.closest('button');
    if(!first || !next) throw new Error('Could not find First/Next page controls.');
    return {start:+match[1],end:+match[2],total:+match[3],first,next};
  }
  async function settle(ctx, predicate=()=>true) {
    let last='', since=0;
    await until(()=>{
      assertIdle(ctx);
      if (all('.x-mask-loading,.ext-el-mask',ctx.panel).some(visible) || !predicate()) {since=0;return false;}
      const fingerprint=JSON.stringify(readRows(ctx.grid));
      if(!since || fingerprint!==last){last=fingerprint;since=Date.now();return false;}
      return Date.now()-since>=1000;
    },'Ticket page did not finish loading.');
  }
  async function turnPage(ctx,direction) {
    assertIdle(ctx);
    const before=pageState(ctx), button=before[direction];
    if(direction==='first' && before.start<=1) return;
    if(!enabled(button)) throw new Error(`The ${direction} page button is disabled.`);
    const ids=readRows(ctx.grid).map(ticket=>ticket.id).join(',');
    click(button);
    await settle(ctx,()=>{
      const after=pageState(ctx);
      return (direction==='first'?after.start<=1:after.start>before.start) &&
        readRows(ctx.grid).map(ticket=>ticket.id).join(',')!==ids;
    });
  }
  function matches(ticket, search, site, technician) {
    return (!site || ticket.rte_location===site) && (!technician || ticket.assigned_to===technician) &&
      (!search || norm(Object.values(ticket).join(' ')).includes(norm(search)));
  }
  function openModal(button) {
    if(modal){modal.focus();return;}
    const ctx=listContext(button);
    const form=ctx?null:readForm(button);
    if(!ctx && !form){alert('Open a ticket list or a ticket before printing.');return;}
    const previousFocus=document.activeElement;
    window.__dinubaTicketPrintBusy=true;
    const tickets=new Map(), selected=new Set();
    const add=items=>items.forEach(ticket=>tickets.set(ticket.id,ticket));
    add(ctx?readRows(ctx.grid):[form]);
    const preselected=[...tickets.values()].filter(ticket=>ticket.selected);
    (preselected.length?preselected:[...tickets.values()]).forEach(ticket=>selected.add(ticket.id));
    const dialog=document.createElement('dialog');
    modal=dialog;dialog.id='dinuba-print-dialog';dialog.setAttribute('aria-labelledby','dinuba-print-title');
    dialog.innerHTML=`<header><div><p class="eyebrow">TICKET PRINTING</p><h2 id="dinuba-print-title">Print tickets</h2><p class="subheading">Choose your tickets and how you want them printed.</p></div><button type="button" data-close aria-label="Close print options">✕</button></header>
      <div class="content"><h3>Print format</h3><div class="formats">
      <label class="format"><input type="radio" name="dinuba-format" value="list" checked><span><strong>Ticket list</strong><small>ID, description, location, room, building, reported by, and reported by business phone.</small></span></label>
      <label class="format"><input type="radio" name="dinuba-format" value="detail"><span><strong>Detailed tickets</strong><small>Each ticket starts on a new page with full description and available details.</small></span></label></div>
      <h3>Choose tickets</h3><div class="filters"><input type="search" data-search aria-label="Search tickets" placeholder="Search ticket number, description, site…"><select data-site aria-label="Filter by site"></select><select data-tech aria-label="Filter by technician"></select></div>
      <div class="selection"><button type="button" data-select>Select shown</button><button type="button" data-clear>Clear selection</button><button type="button" data-all>Load all pages</button></div>
      <div class="table-wrap"><table><thead><tr><th>Select</th><th>Ticket</th><th>Site</th><th>Assigned to</th><th>Status</th><th>Description</th></tr></thead><tbody data-rows></tbody></table></div>
      <p class="note" data-note role="status">${ctx?'Current page loaded. Load all pages to include tickets from the rest of this view.':'Current ticket loaded. Values reflect the open form.'} Detailed print includes fields available in this view; it does not fetch attachments or ticket history.</p></div>
      <footer><span class="count" data-count></span><button type="button" data-close>Cancel</button><button type="button" class="primary" data-print>Print selected</button></footer>`;
    document.body.append(dialog);
    const q=selector=>dialog.querySelector(selector);
    let loading=false;
    const note=text=>{q('[data-note]').textContent=text;};
    function fillFilters() {
      for(const [selector,key,label] of [['[data-site]','rte_location','All sites'],['[data-tech]','assigned_to','All technicians']]) {
        const select=q(selector), old=select.value;
        select.innerHTML=`<option value="">${label}</option>`+[...new Set([...tickets.values()].map(t=>t[key]).filter(Boolean))].sort()
          .map(value=>`<option value="${escape(value)}">${escape(value)}</option>`).join('');
        select.value=old;
      }
    }
    function shown(){return [...tickets.values()].filter(t=>matches(t,q('[data-search]').value,q('[data-site]').value,q('[data-tech]').value));}
    function count() {
      q('[data-count]').textContent=`${selected.size} selected · ${tickets.size} loaded`;
      q('[data-print]').disabled=loading || !selected.size;
    }
    function render() {
      q('[data-rows]').innerHTML=shown().map(t=>`<tr><td><input type="checkbox" data-ticket="${escape(t.id)}" aria-label="Print ticket ${escape(t.id)}" ${selected.has(t.id)?'checked':''}></td><td>${escape(t.id)}</td><td>${escape(t.rte_location)}</td><td>${escape(t.assigned_to)}</td><td>${escape(t.incident_status)}</td><td class="summary">${escape(t.description.replace(/\s+/g,' ').slice(0,180))}</td></tr>`).join('') || '<tr><td colspan="6">No tickets match these filters.</td></tr>';
      count();
    }
    dialog.addEventListener('close',()=>{
      dialog.remove();modal=null;window.__dinubaTicketPrintBusy=false;
      if(previousFocus?.isConnected)previousFocus.focus();
    });
    dialog.addEventListener('cancel',event=>{if(loading)event.preventDefault();});
    all('[data-close]',dialog).forEach(b=>b.addEventListener('click',()=>{if(!loading)dialog.close();}));
    q('[data-search]').addEventListener('input',render);
    q('[data-site]').addEventListener('change',render);q('[data-tech]').addEventListener('change',render);
    q('[data-rows]').addEventListener('change',event=>{
      const checkbox=event.target.closest('[data-ticket]');if(!checkbox)return;
      if(checkbox.checked)selected.add(checkbox.dataset.ticket);else selected.delete(checkbox.dataset.ticket);count();
    });
    q('[data-select]').addEventListener('click',()=>{shown().forEach(t=>selected.add(t.id));render();});
    q('[data-clear]').addEventListener('click',()=>{selected.clear();render();});
    q('[data-all]').disabled=!ctx;
    q('[data-all]').addEventListener('click',async()=>{
      loading=true;
      const buttons=all('button',dialog);buttons.forEach(b=>b.disabled=true);count();
      let originalStart=1, captured=false;
      try {
        note('Waiting for any ticket assignment to finish…');
        await until(()=>!window.__dinubaAssignmentBusy,'Assignment is still running. Try loading pages again shortly.');
        assertIdle(ctx);originalStart=pageState(ctx).start;captured=true;
        await turnPage(ctx,'first');
        const visited=new Set();
        while(true){
          await settle(ctx);
          const page=pageState(ctx);
          if(visited.has(page.start))throw new Error('The same page repeated. Collection stopped.');
          visited.add(page.start);add(readRows(ctx.grid));
          note(`Loading tickets ${page.start}–${page.end} of ${page.total}…`);
          if(page.end>=page.total)break;
          await turnPage(ctx,'next');
        }
        note(`All pages loaded: ${tickets.size} tickets. Use Select shown to add more tickets to your selection.`);
      }catch(error){note(`Collection stopped: ${error.message} Already loaded tickets remain available.`);}
      finally {
        // Return to the user's original page without discarding collected tickets.
        try {
          if(captured && visible(ctx.grid) && pageState(ctx).start!==originalStart){
            await turnPage(ctx,'first');
            let guard=0;
            while(pageState(ctx).start<originalStart && pageState(ctx).end<pageState(ctx).total){
              if(++guard>1000)throw new Error('Page restore limit reached.');
              await turnPage(ctx,'next');
            }
          }
        }catch(error){note(`Tickets collected; original page could not be restored: ${error.message}`);}
        loading=false;buttons.forEach(b=>b.disabled=false);fillFilters();render();
      }
    });
    q('[data-print]').addEventListener('click',()=>{
      const chosen=[...tickets.values()].filter(t=>selected.has(t.id));
      if(!chosen.length)return;
      const win=window.open('','_blank','width=1100,height=800');
      if(!win){note('The print window was blocked. Allow pop-ups for SchoolDude and click Print selected again.');return;}
      const format=q('input[name="dinuba-format"]:checked').value;
      win.document.open();win.document.write(printHTML(chosen,format));win.document.close();
      const printButton=win.document.getElementById('print-now');
      printButton.addEventListener('click',()=>{win.focus();win.print();});
      win.document.getElementById('close-preview').addEventListener('click',()=>win.close());
      // Keep the preview and its Print button available if automatic printing is blocked.
      win.setTimeout(()=>{if(!win.closed){win.focus();win.print();}},300);
      note(`Print preview opened for ${chosen.length} ticket(s).`);
    });
    fillFilters();render();dialog.showModal();q('[data-search]').focus();
  }
  function printHTML(tickets,format) {
    const stamp=new Date().toLocaleString();
    const summary=text=>{const clean=String(text||'').replace(/\s+/g,' ').trim();return clean.length>240?`${clean.slice(0,240)}…`:clean;};
    const header=`<header class="report-header"><div><p>DINUBA UNIFIED SCHOOL DISTRICT</p><h1>${format==='list'?'Service ticket list':'Service tickets'}</h1></div><div class="meta">${tickets.length} ticket${tickets.length===1?'':'s'}<br>${escape(stamp)}</div></header>`;
    const list=`<table class="ticket-list"><thead><tr><th>ID</th><th>Description</th><th>Location</th><th>Room</th><th>Building</th><th>Reported By</th><th>Reported By Business Phone</th></tr></thead><tbody>${tickets.map(t=>`<tr><td class="ticket-id">${escape(t.id)}</td><td class="description">${escape(summary(t.description))}</td><td>${escape(t.rte_location)}</td><td>${escape(t.area_room)}</td><td>${escape(t.rte_building)}</td><td>${escape(t.requested_by)}</td><td>${escape(t.reported_by_business_phone)}</td></tr>`).join('')}</tbody></table>`;
    const details=tickets.map(t=>`<article class="ticket-sheet"><header class="ticket-header"><h2>Ticket #${escape(t.id)}</h2><span>${escape(t.incident_status)}</span></header><dl>${Object.entries(fields).filter(([key])=>!['id','description','resolution','incident_status'].includes(key) && t[key]).map(([key,label])=>`<div><dt>${escape(label)}</dt><dd>${escape(t[key])}</dd></div>`).join('')}</dl><section><h3>Description</h3><div class="long-text">${escape(t.description || 'No description available.')}</div></section>${t.resolution?`<section><h3>Resolution</h3><div class="long-text">${escape(t.resolution)}</div></section>`:''}<section class="notes"><h3>Technician notes</h3><div></div><div></div><div></div></section></article>`).join('');
    return `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>SchoolDude — ${tickets.length} ticket(s)</title><style>
      *{box-sizing:border-box}body{margin:0;color:#172f43;font:12px Arial,sans-serif;background:#eaf0f6}.paper{max-width:1100px;margin:24px auto;background:white;padding:28px;box-shadow:0 3px 20px #0002}
      .actions{position:sticky;top:0;display:flex;gap:12px;padding:12px 24px;background:#214f7e;color:white;align-items:center;z-index:1}.actions button{padding:8px 15px;cursor:pointer}.actions span{margin-left:auto;font-size:12px}
      .report-header{display:flex;justify-content:space-between;gap:20px;border-bottom:2px solid #315f88;padding-bottom:14px;margin-bottom:18px}.report-header p{font-size:10px;letter-spacing:1px;margin:0 0 5px;color:#52677b}h1{font-size:24px;margin:0}.meta{text-align:right;font-size:11px;line-height:1.7;color:#52677b}
      table{width:100%;border-collapse:collapse;table-layout:fixed}th{text-align:left;background:#edf2f7;font-size:10px;text-transform:uppercase;letter-spacing:.3px}th,td{padding:9px 7px;border-bottom:1px solid #cbd5df;vertical-align:top;overflow-wrap:anywhere}th:nth-child(1){width:6%}th:nth-child(2){width:34%}th:nth-child(3){width:16%}th:nth-child(4){width:6%}th:nth-child(5){width:8%}th:nth-child(6){width:18%}th:nth-child(7){width:12%}.ticket-id{font-weight:bold}small{display:block;margin-top:4px;color:#52677b}.description{white-space:pre-wrap;font-size:11px;line-height:1.4}
      .ticket-sheet+.ticket-sheet{break-before:page;page-break-before:always;margin-top:32px}.ticket-header{display:flex;align-items:center;justify-content:space-between;gap:15px;border-bottom:2px solid #315f88;padding-bottom:10px}h2{font-size:21px;margin:0}h3{font-size:12px;margin:16px 0 8px}dl{display:grid;grid-template-columns:1fr 1fr;gap:0 24px;margin:8px 0}dl>div{padding:8px 0;border-bottom:1px solid #e1e7ed;break-inside:avoid}dt{font-size:10px;color:#52677b;margin-bottom:4px}dd{margin:0;overflow-wrap:anywhere;font-size:12px}.long-text{white-space:pre-wrap;overflow-wrap:anywhere;line-height:1.55;border:1px solid #ccd6df;padding:12px}.notes>div{height:26px;border-bottom:1px solid #ccd6df}.report-footer{margin-top:18px;color:#617587;font-size:10px}
      @page{size:letter ${format==='list'?'landscape':'portrait'};margin:14mm}@media print{body{background:white;color:#111}.actions{display:none}.paper{max-width:none;margin:0;padding:0;box-shadow:none}.report-header{break-after:avoid}.ticket-sheet+.ticket-sheet{margin-top:0}thead{display:table-header-group}h3,.ticket-header{break-after:avoid}.ticket-sheet,.long-text{break-inside:auto}.notes{break-inside:avoid}tr{break-inside:avoid}}
      </style></head><body><nav class="actions"><button id="print-now" type="button">Print / Save as PDF</button><button id="close-preview" type="button">Close preview</button><span>Review your selected tickets before printing.</span></nav><main class="paper">${header}${format==='list'?list:details}<p class="report-footer">Printed from SchoolDude • ${escape(stamp)}</p></main></body></html>`;
  }
  // Capture prevents older injected button handlers from opening a second print window.
  document.addEventListener('click',event=>{
    const button=event.target.closest?.('button');
    if(!button || !['PrintTicketsBtnInjected','tm-print-ticket'].includes(button.id))return;
    event.preventDefault();event.stopImmediatePropagation();openModal(button);
  },true);
  let queued=false;
  new MutationObserver(()=>{
    if(queued)return;queued=true;
    setTimeout(()=>{queued=false;install();},120);
  }).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});
  install();
})();

