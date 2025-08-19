// ==UserScript==
// @name         Add Discard Button to Footer with Automation Trigger
// @namespace    http://tampermonkey.net/
// @version      1.4.1
// @description  Adds a "Discard" button to the footer that contains the "Clone Ticket" button and starts the automation process when clicked.
// @author       You
// @match        *://*.schooldude.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  /* =========================
   *  STYLE INJECTION (CSS)
   * ========================= */
  function injectStyles() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      /* ===== Modal Background ===== */
      .modal-background {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background-color: rgba(0, 0, 0, 0.6);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 2147483647; /* ensure on top of everything */
        backdrop-filter: blur(6px);
      }

      /* ===== Modal ===== */
      .modal {
        background: #fff;
        border-radius: 12px;
        padding: 24px;
        max-width: 520px;
        width: 92%;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.25);
        position: relative;
        animation: fadeIn 0.25s ease;
        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      }

      .modal-body {
        position: relative;
      }

      /* ===== Titles ===== */
      .modal-body h2, .modal-body h3 {
        margin: 0 0 16px 0;
        color: #222;
      }
      .modal-body h2 {
        font-size: 22px;
        font-weight: 600;
      }
      .modal-body h3 {
        font-size: 18px;
        font-weight: 500;
        color: #444;
      }

      /* ===== Labels ===== */
      .modal-body label {
        display: block;
        margin-bottom: 6px;
        font-size: 15px;
        font-weight: 500;
        color: #333;
      }

      /* ===== Inputs & Selects ===== */
      .modal-input, .modal-select, .modal-body input[type="text"] {
        width: 100%;
        padding: 12px;
        margin-bottom: 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 15px;
        transition: border-color 0.25s ease;
      }
      .modal-input:focus, .modal-select:focus, .modal-body input[type="text"]:focus {
        outline: none;
        border-color: #007bff;
      }

      /* ===== Radios ===== */
      .modal-body input[type="radio"] {
        accent-color: #007bff;
      }

      /* ===== Buttons ===== */
      .modal-button {
        padding: 10px 18px;
        margin: 6px 4px 0 0;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s ease, opacity 0.2s ease;
      }
      .modal-button.primary {
        background: #007bff;
        color: #fff;
      }
      .modal-button.primary:hover { background: #0056b3; }
      .modal-button.secondary {
        background: #6c757d;
        color: #fff;
      }
      .modal-button.secondary:hover { background: #545b62; }

      /* ===== Close Button (optional) ===== */
      .modal .close-x {
        position: absolute;
        top: 10px; right: 12px;
        width: 32px; height: 32px;
        background: transparent;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        line-height: 32px;
        text-align: center;
        color: #666;
      }
      .modal .close-x:hover { background: rgba(0,0,0,0.06); }

      /* ===== Item List ===== */
      .chromebook-item {
        border: 1px solid #ddd;
        border-radius: 8px;
        background: #f9f9f9;
        padding: 12px;
        margin-bottom: 10px;
        position: relative;
        transition: background-color 0.2s ease;
      }
      .chromebook-item:hover { background: #f1f1f1; }

      .button-group {
        position: absolute;
        top: 10px; right: 10px;
        display: flex;
        gap: 8px;
      }

      .edit-button, .delete-button {
        border: none;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: 13px;
        color: #fff;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }
      .edit-button { background: #ffc107; }
      .edit-button:hover { background: #e0a800; }
      .delete-button { background: #dc3545; }
      .delete-button:hover { background: #c82333; }

      /* ===== Errors ===== */
      .error-message {
        color: #dc3545;
        font-weight: 600;
        margin-bottom: 12px;
      }

      /* ===== Animations ===== */
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.98); }
        to   { opacity: 1; transform: scale(1); }
      }
    `;
    document.head.appendChild(style);
  }
  injectStyles();

  /* =========================
   *  UI: BUTTON IN FOOTER
   * ========================= */
  function createDiscardButton() {
    const table = document.createElement('table');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('role', 'presentation');
    table.id = 'DiscardButton';
    table.className = 'x-btn x-component x-btn-noicon x-unselectable';
    table.style.cssText = 'margin-right: 5px;';
    table.unselectable = 'on';

    const tbody = document.createElement('tbody');
    tbody.className = 'x-btn-small x-btn-icon-small-left';

    const topRow = document.createElement('tr');
    topRow.innerHTML = `
      <td class="x-btn-tl"><i>&nbsp;</i></td>
      <td class="x-btn-tc"></td>
      <td class="x-btn-tr"><i>&nbsp;</i></td>
    `;

    const middleRow = document.createElement('tr');
    middleRow.innerHTML = `
      <td class="x-btn-ml"><i>&nbsp;</i></td>
      <td class="x-btn-mc">
        <em class="" unselectable="on">
          <button class="x-btn-text" type="button" style="position: relative; width: 150px;" tabindex="0">
            Discard
          </button>
        </em>
      </td>
      <td class="x-btn-mr"><i>&nbsp;</i></td>
    `;

    const bottomRow = document.createElement('tr');
    bottomRow.innerHTML = `
      <td class="x-btn-bl"><i>&nbsp;</i></td>
      <td class="x-btn-bc"></td>
      <td class="x-btn-br"><i>&nbsp;</i></td>
    `;

    tbody.appendChild(topRow);
    tbody.appendChild(middleRow);
    tbody.appendChild(bottomRow);
    table.appendChild(tbody);

    table.addEventListener('click', () => {
      console.log('Discard button clicked!');
      automateTicketInteraction();
    });

    return table;
  }

  function addDiscardButtonToFooter() {
    const footers = document.querySelectorAll('.x-panel-footer');
    footers.forEach((footer) => {
      const cloneTicketButton = footer.querySelector('button#Clone_Ticket');
      if (cloneTicketButton) {
        if (!footer.querySelector('#DiscardButton')) {
          const toolbar = footer.querySelector('.x-toolbar-left-row');
          if (toolbar) {
            const discardButton = createDiscardButton();
            const cell = document.createElement('td');
            cell.className = 'x-toolbar-cell';
            cell.style.paddingLeft = '10px';
            cell.appendChild(discardButton);
            toolbar.appendChild(cell);
            console.log('"Discard" button added near "Clone Ticket".');
          }
        }
      }
    });
  }

  const observer = new MutationObserver(addDiscardButtonToFooter);
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', addDiscardButtonToFooter);

  /* =========================
   *  HELPERS
   * ========================= */
  function setValueAndSimulateEvents(element, value) {
    if (!element) return;
    element.value = value;
    element.dispatchEvent(new Event('focus', { bubbles: true }));
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('keyup', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
  }

  function simulateCheckboxClick(checkbox) {
    if (!checkbox) return;
    if (checkbox.disabled) return;
    checkbox.dispatchEvent(new MouseEvent('focus', { bubbles: true }));
    checkbox.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    checkbox.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    checkbox.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    if (!checkbox.checked) {
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function getDescriptionBoxContent() {
    const descriptionBox = document.getElementById('base_inc_incident_description');
    if (!descriptionBox) return null;
    const descriptionContent = descriptionBox.value || descriptionBox.textContent;
    return (descriptionContent || '').trim();
  }

  function parseDescriptionContent(descriptionContent) {
    if (!descriptionContent) return {};
    const districtTagMatch = descriptionContent.match(/District Tag:\s*([\w-]+)/i);
    const serialNumberMatch = descriptionContent.match(/Serial #:\s*([\w-]+)/i);
    const modelNumberMatch = descriptionContent.match(/Model Number:\s*([\w-]+)/i);
    const districtTag = districtTagMatch ? districtTagMatch[1].trim() : "Unknown";
    const serialNumber = serialNumberMatch ? serialNumberMatch[1].trim() : "Unknown";
    const modelNumber = modelNumberMatch ? modelNumberMatch[1].trim() : "Unknown";
    return { districtTag, serialNumber, modelNumber };
  }

  function getSignedInUser() {
    const toolbarElement = document.querySelector('.x-toolbar-right .xtb-text span');
    if (!toolbarElement) return "Unknown User";
    const textContent = toolbarElement.textContent.trim();
    const userMatch = textContent.match(/Welcome\s+([\w.-]+@[\w.-]+)/i);
    if (!userMatch || !userMatch[1]) return "Unknown User";
    return userMatch[1].split(/[@.]/)[0]; // first part as "name"
  }

  function simulateSaveButtonClick() {
    setTimeout(() => {
      const parentContainer = document.querySelector('#_p-Notes');
      if (!parentContainer) return;
      const saveButton = parentContainer.querySelector('button#Save');
      if (!saveButton) return;
      const isDisabled = saveButton.getAttribute('aria-disabled') === 'true';
      if (isDisabled) return;
      saveButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      saveButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      saveButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    }, 500);
  }

  /* =========================
   *  MODALS
   * ========================= */
  function showModal(contentHtml, onConfirm) {
    const old = document.querySelector('.modal-background');
    if (old) old.remove();

    const bg = document.createElement('div');
    bg.className = 'modal-background';

    const modal = document.createElement('div');
    modal.className = 'modal';

    // optional close X
    const closeX = document.createElement('button');
    closeX.className = 'close-x';
    closeX.setAttribute('aria-label', 'Close');
    closeX.innerHTML = '&times;';
    closeX.onclick = () => { bg.remove(); };
    modal.appendChild(closeX);

    const bodyWrap = document.createElement('div');
    bodyWrap.className = 'modal-body';
    bodyWrap.innerHTML = contentHtml;

    // If caller didn’t include a button, add a default OK that calls onConfirm
    if (!bodyWrap.querySelector('button')) {
      const btn = document.createElement('button');
      btn.textContent = 'OK';
      btn.className = 'modal-button primary';
      btn.onclick = () => { bg.remove(); onConfirm && onConfirm(); };
      bodyWrap.appendChild(btn);
    }

    modal.appendChild(bodyWrap);
    bg.appendChild(modal);
    document.body.appendChild(bg);
  }

  function showReasonPopup() {
    const overlay = document.createElement('div');
    overlay.className = 'modal-background';

    const popup = document.createElement('div');
    popup.className = 'modal';

    const closeX = document.createElement('button');
    closeX.className = 'close-x';
    closeX.setAttribute('aria-label', 'Close');
    closeX.innerHTML = '&times;';
    closeX.onclick = () => { overlay.remove(); };
    popup.appendChild(closeX);

    const body = document.createElement('div');
    body.className = 'modal-body';

    const title = document.createElement('h3');
    title.textContent = 'Reason for Discard';
    body.appendChild(title);

    const options = [
      { value: 'Too many broken parts', label: 'Too many broken parts' },
      { value: 'Bad Motherboard',       label: 'Bad Motherboard' },
      { value: 'Bad Power Button',      label: 'Bad Power Button' },
      { value: '__CUSTOM__',            label: 'Other Reason' } // special
    ];

    const form = document.createElement('form');
    form.style.margin = '0';

    options.forEach((option) => {
      const row = document.createElement('div');
      row.style.display = 'flex';
      row.style.alignItems = 'center';
      row.style.gap = '8px';
      row.style.marginBottom = '8px';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'reason';
      input.value = option.value;
      input.id = 'reason_' + option.value.replace(/\W+/g, '_');

      const label = document.createElement('label');
      label.setAttribute('for', input.id);
      label.textContent = option.label;
      label.style.cursor = 'pointer';

      row.appendChild(input);
      row.appendChild(label);
      form.appendChild(row);
    });

    const customInput = document.createElement('input');
    customInput.type = 'text';
    customInput.placeholder = 'Type custom reason…';
    customInput.className = 'modal-input';
    customInput.disabled = true;
    form.appendChild(customInput);

    form.addEventListener('change', () => {
      const selected = form.querySelector('input[name="reason"]:checked');
      const isCustom = selected && selected.value === '__CUSTOM__';
      customInput.disabled = !isCustom;
      if (isCustom) customInput.focus();
    });

    const confirmButton = document.createElement('button');
    confirmButton.type = 'button';
    confirmButton.className = 'modal-button primary';
    confirmButton.textContent = 'Confirm';

    const submit = () => {
      const selected = form.querySelector('input[name="reason"]:checked');
      if (!selected) {
        alert('Please select a reason.');
        return;
      }
      let reason = selected.value;
      if (reason === '__CUSTOM__') {
        reason = (customInput.value || '').trim();
        if (!reason) {
          alert('Please type a custom reason.');
          customInput.focus();
          return;
        }
      }
      autofillForm(reason);
      overlay.remove();
    };

    customInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        submit();
      }
    });
    confirmButton.addEventListener('click', submit);

    body.appendChild(form);
    body.appendChild(confirmButton);

    popup.appendChild(body);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
  }

  /* =========================
   *  MAIN FLOWS
   * ========================= */
  function autofillForm(reason) {
    const today = new Date().toLocaleDateString();
    const noteContent = `DISCARDED: ${today}\nADDED TO INFORMATION TECHNOLOGY DISCARD LIST\nREASON: ${reason}`;

    const noteTextarea = document.querySelector('#base_inc_notes_note_text');
    setValueAndSimulateEvents(noteTextarea, noteContent);

    const publicCheckbox = document.querySelector('#note_public');
    simulateCheckboxClick(publicCheckbox);

    setTimeout(() => {
      const resolutionCheckbox = document.querySelector('#note_resolution');
      simulateCheckboxClick(resolutionCheckbox);

      setTimeout(() => {
        const completeCheckbox = document.querySelector('#note_completed');
        if (!completeCheckbox?.disabled) simulateCheckboxClick(completeCheckbox);
        simulateSaveButtonClick();
      }, 200);
    }, 200);

    sendToWebApp(reason);
  }

  function sendToWebApp(reason) {
    const descriptionContent = getDescriptionBoxContent();
    const { districtTag, serialNumber, modelNumber } = parseDescriptionContent(descriptionContent);
    const signedInUser = getSignedInUser();
    const currentDate = new Date().toLocaleDateString();
    const comments = `${signedInUser} - ${currentDate}`;

    const siteInput = document.querySelector('#base_inc_incident_rte_location');
    const siteLocation = siteInput ? siteInput.value : 'Unknown';

    const AUTH_KEY = 'discardWebAppAuthorized';
    const alreadyAuthorized = localStorage.getItem(AUTH_KEY) === 'true';

    const baseUrl = 'https://script.google.com/macros/s/AKfycbzjx36W8VXS9UhcseJOxORcF8NwFfxMYmrSUFCS-AYucugYHAV_rfD9yJvv0Yj7VMey/exec';
    const params = new URLSearchParams({
      equipmentType: 'Chromebook',
      makeModel: modelNumber || 'Unknown Model',
      whiteAssetTag: districtTag || 'Unknown Asset Tag',
      serialNumber: serialNumber || 'Unknown Serial Number',
      reason: reason || 'No Reason Provided',
      comments: comments || 'No Comments',
      site: siteLocation || 'Unknown Site'
    });
    if (alreadyAuthorized) params.set('autoClose', '1');

    const url = `${baseUrl}?${params.toString()}`;
    console.log('[Discard] URL:', url);

    const tab = window.open(url, '_blank');

    if (!alreadyAuthorized) {
      const html = `
        <h2>Authorize Google Sheets</h2>
        <p>A new tab has opened.</p>
        <ol style="margin: 0 0 12px 20px; text-align:left;">
          <li>Click <strong>Review permissions</strong>.</li>
          <li>Choose your account and click <strong>Allow</strong>.</li>
          <li>Wait until the page says <strong>Success</strong>.</li>
          <li>Return here and press <strong>Continue</strong>.</li>
        </ol>
        <div>
          <button id="discardAuthContinue" class="modal-button primary">Continue</button>
          <button id="discardAuthCancel" class="modal-button secondary">Cancel</button>
        </div>
      `;
      showModal(html, null);
      document.getElementById('discardAuthContinue')?.addEventListener('click', () => {
        document.querySelector('.modal-background')?.remove();
        localStorage.setItem(AUTH_KEY, 'true');
        console.log('[Discard] Authorization marked complete.');
      });
      document.getElementById('discardAuthCancel')?.addEventListener('click', () => {
        document.querySelector('.modal-background')?.remove();
      });
    } else {
      setTimeout(() => { try { tab && tab.close(); } catch (e) {} }, 2000);
    }
  }

  function clickNotesTab() {
    const tabs = document.querySelectorAll('.x-tab-strip.x-tab-strip-top li');
    if (!tabs?.length) return false;
    for (const tab of tabs) {
      const textSpan = tab.querySelector('.x-tab-strip-text');
      if (textSpan && textSpan.textContent.trim().startsWith('Notes')) {
        tab.click();
        return true;
      }
    }
    return false;
  }

  function clickNewButtonInNotesTab() {
    setTimeout(() => {
      const notesTabContent = document.querySelector('#_p-Notes');
      if (!notesTabContent) return;
      const newButton = notesTabContent.querySelector('button#New');
      if (!newButton) return;
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        showReasonPopup();
      });
      newButton.click();
    }, 1000);
  }

  function automateTicketInteraction() {
    const descriptionContent = getDescriptionBoxContent();
    if (!descriptionContent) return;
    const notesTabClicked = clickNotesTab();
    if (notesTabClicked) clickNewButtonInNotesTab();
  }

})();
