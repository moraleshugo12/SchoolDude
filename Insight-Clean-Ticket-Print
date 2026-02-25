// ==UserScript==
// @name         Insight Clean Ticket Print
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds the "Add Chromebooks" button and starts the submission process when clicked on SchoolDude pages.
// @author       You
// @match        *://*.schooldude.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  function getValue(id) {
    const el = document.getElementById(id);
    if (!el) return '';
    return el.value || el.innerText || '';
  }

  function printTicket() {
    const data = {
      status: getValue('base_inc_incident_incident_status'),
      assignedTo: getValue('base_inc_incident_assigned_to'),
      workQueue: getValue('base_inc_incident_work_queue'),
      workType: getValue('base_inc_incident_work_type'),
      location: getValue('base_inc_incident_rte_location'),
      building: getValue('base_inc_incident_rte_building'),
      area: getValue('base_inc_incident_rte_area'),
      room: getValue('base_inc_incident_area_room'),
      description: getValue('base_inc_incident_description'),
      onBehalfOf: getValue('base_inc_incident_on_behalf_of')
    };

    const win = window.open('', '_blank', 'width=900,height=700');

    win.document.write(`
      <html>
        <head>
          <title>Ticket Print</title>
          <style>
  * {
    box-sizing: border-box;
  }

  body {
    font-family: "Segoe UI", Roboto, Arial, sans-serif;
    margin: 0;
    padding: 12px;
    background: #f8fafc;
    color: #1f2937;
  }

  .page {
    max-width: 900px;
    margin: 0 auto;
    background: #ffffff;
    border-radius: 8px;
    padding: 12px 16px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  }

  /* Header */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(135deg, #2563eb, #1e40af);
    color: white;
    padding: 10px 14px;
    border-radius: 6px;
    margin-bottom: 12px;
  }

  .header h1 {
    margin: 0;
    font-size: 17px;
    font-weight: 600;
  }

  .meta {
    font-size: 11px;
    opacity: 0.9;
    text-align: right;
  }

  .status-badge {
    display: inline-block;
    margin-top: 2px;
    padding: 3px 8px;
    border-radius: 999px;
    background: rgba(255,255,255,0.25);
    font-size: 11px;
    font-weight: 600;
  }

  /* Details */
  .section {
    margin-bottom: 12px;
  }

  .details {
    display: grid;
    grid-template-columns: 140px 1fr;
    gap: 6px 14px;
  }

  .label {
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    text-align: right;
  }

  .value {
    font-size: 13px;
    padding-bottom: 2px;
    border-bottom: 1px solid #e5e7eb;
    min-height: 16px;
    color: #111827;
  }

  /* Description */
  .description h2 {
    font-size: 13px;
    font-weight: 600;
    margin: 0 0 6px 0;
    color: #1e3a8a;
  }

  .description-box {
    border: 1px solid #e5e7eb;
    border-left: 4px solid #2563eb;
    border-radius: 6px;
    padding: 10px;
    font-size: 13px;
    line-height: 1.35;
    white-space: pre-wrap;
    background: #f9fafb;
    color: #111827;
  }

  /* Prevent page breaks inside main container */
  .page, .section, .description-box {
    page-break-inside: avoid;
  }

  @media print {
    body {
      background: #ffffff;
      padding: 6px;
    }

    .page {
      box-shadow: none;
      border-radius: 0;
      padding: 0;
    }

    .header {
      border-radius: 0;
    }
  }
</style>


        </head>
        <body>
  <div class="page">
    <div class="header">
      <div>
        <h1>Service Ticket</h1>
        <div class="status-badge">${data.status}</div>
      </div>
      <div class="meta">
        Printed<br>
        ${new Date().toLocaleString()}
      </div>
    </div>

    <div class="section">
      <div class="details">
        <div class="label">Assigned To</div><div class="value">${data.assignedTo}</div>
        <div class="label">Work Queue</div><div class="value">${data.workQueue}</div>
        <div class="label">Work Type</div><div class="value">${data.workType}</div>
        <div class="label">Location</div><div class="value">${data.location}</div>
        <div class="label">Building</div><div class="value">${data.building}</div>
        <div class="label">Area</div><div class="value">${data.area}</div>
        <div class="label">Room</div><div class="value">${data.room}</div>
        <div class="label">On Behalf Of</div><div class="value">${data.onBehalfOf}</div>
      </div>
    </div>

    <div class="section description">
      <h2>Description</h2>
      <div class="description-box">
        ${data.description}
      </div>
    </div>
  </div>
</body>

      </html>
    `);

    win.document.close();
    win.focus();
    win.print();
  }

  function findCloseButton() {
    return [...document.querySelectorAll('button.x-btn-text')]
      .find(btn => btn.textContent.trim() === 'Close');
  }

  function insertButton(nextToBtn) {
    if (document.getElementById('tm-print-ticket')) return;

    const td = nextToBtn.closest('td.x-toolbar-cell');
    if (!td) return;

    const newTd = document.createElement('td');
    newTd.className = 'x-toolbar-cell';

    newTd.innerHTML = `
      <table class="x-btn x-component x-btn-noicon x-unselectable" cellspacing="0">
        <tbody class="x-btn-small x-btn-icon-small-left">
          <tr>
            <td class="x-btn-tl"><i>&nbsp;</i></td>
            <td class="x-btn-tc"></td>
            <td class="x-btn-tr"><i>&nbsp;</i></td>
          </tr>
          <tr>
            <td class="x-btn-ml"><i>&nbsp;</i></td>
            <td class="x-btn-mc">
              <em unselectable="on">
                <button id="tm-print-ticket"
                        class="x-btn-text"
                        type="button"
                        style="width:110px;">
                  Print Ticket
                </button>
              </em>
            </td>
            <td class="x-btn-mr"><i>&nbsp;</i></td>
          </tr>
          <tr>
            <td class="x-btn-bl"><i>&nbsp;</i></td>
            <td class="x-btn-bc"></td>
            <td class="x-btn-br"><i>&nbsp;</i></td>
          </tr>
        </tbody>
      </table>
    `;

    td.parentNode.insertBefore(newTd, td);

    newTd.querySelector('button').addEventListener('click', printTicket);
  }

  const observer = new MutationObserver(() => {
    const closeBtn = findCloseButton();
    if (closeBtn) {
      insertButton(closeBtn);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });

})();
