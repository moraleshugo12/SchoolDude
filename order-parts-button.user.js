// ==UserScript==
// @name         Order Parts Button (Styled)
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Adds an "Order Parts" button and a modern modal for part selection; handles Apps Script auth + autoclose.
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
    const style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
      /* ===== Overlay ===== */
      .modal-background {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2147483647; /* on top of everything */
        backdrop-filter: blur(6px);
      }

      /* ===== Modal ===== */
      .modal {
        background: #fff;
        border-radius: 12px;
        padding: 24px;
        width: 92%;
        max-width: 520px;
        box-shadow: 0 20px 60px rgba(0,0,0,.25);
        position: relative;
        animation: modalFadeIn .25s ease;
        font-family: 'Segoe UI', Roboto, Arial, sans-serif;
      }

      .modal h2, .modal h3 {
        margin: 0 0 16px 0;
        color: #222;
      }
      .modal h2 { font-size: 22px; font-weight: 600; }
      .modal h3 { font-size: 18px; font-weight: 500; color: #444; }

      .modal-body { position: relative; }

      /* Close X */
      .modal .close-x {
        position: absolute;
        top: 10px; right: 12px;
        width: 32px; height: 32px;
        border: none;
        border-radius: 50%;
        background: transparent;
        cursor: pointer;
        color: #666;
        font-size: 18px;
        line-height: 32px;
        text-align: center;
      }
      .modal .close-x:hover { background: rgba(0,0,0,.06); }

      /* Labels */
      .modal label {
        display: block;
        margin-bottom: 6px;
        font-size: 15px;
        font-weight: 500;
        color: #333;
      }

      /* Inputs / Selects */
      .modal .modal-input,
      .modal .modal-select {
        width: 100%;
        padding: 12px;
        margin-bottom: 12px;
        border: 1px solid #ccc;
        border-radius: 6px;
        font-size: 15px;
        transition: border-color .2s ease;
      }
      .modal .modal-input:focus,
      .modal .modal-select:focus {
        outline: none;
        border-color: #007bff;
      }

      /* Parts list container */
      .parts-container {
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 10px;
        max-height: 260px;
        overflow: auto;
        margin-bottom: 14px;
        background: #fafafa;
      }

      /* Each part row */
      .part-row {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 6px 8px;
        border-radius: 6px;
        transition: background .15s ease;
        cursor: pointer;
        user-select: none;
      }
      .part-row:hover {
        background: #f1f5f9;
      }
      .part-row input[type="checkbox"] {
        transform: translateY(1px);
        accent-color: #007bff;
      }

      /* Buttons */
      .modal-button {
        padding: 10px 18px;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
        transition: background-color .2s ease;
      }
      .modal-button.primary { background: #007bff; color: #fff; }
      .modal-button.primary:hover { background: #0056b3; }
      .modal-button.danger  { background: #dc3545; color: #fff; }
      .modal-button.danger:hover { background: #c82333; }

      .button-row {
        display: flex;
        gap: 10px;
        justify-content: flex-end;
        margin-top: 10px;
      }

      /* Small helper text */
      .muted {
        color: #6b7280;
        font-size: 13px;
        margin: -4px 0 10px 0;
      }

      @keyframes modalFadeIn {
        from { opacity: 0; transform: translateY(4px) scale(.98); }
        to   { opacity: 1; transform: translateY(0)   scale(1);   }
      }
    `;
    document.head.appendChild(style);
  }
  injectStyles();

  // =======================
  // Your existing data
  // =======================
  const chromebookParts = {
    C733: {
      "BATTERY SKU: KT.00304.008": "Battery",
      "LCD VIDEO CABLE SKU: 50.GUKN7.005": "LCD Video Cable",
      "PALMREST WITH KEYBOARD (WITHOUT TOUCHPAD) SKU: 6B.GUKN7.001": "Palmrest with Keyboard",
      "11.6\" LCD HD 1366X768 MATTE 30 PIN CONNECTOR SKU: KL.0C733.SV2": "11.6\" LCD HD Matte",
      "HINGE RIGHT SKU: 33.GUMN7.001": "Right Hinge",
      "HINGE LEFT SKU: 33.GUMN7.002": "Left Hinge",
      "TOUCHPAD (WITHOUT CABLE) SKU: 56.GUKN7.001": "Touchpad",
      "CAMERA (FRONT-FACING) SKU: KS.0HD06.014": "Front Camera",
      "LCD BEZEL SKU: 60.GUMN7.002": "LCD Bezel",
      "LCD TOP COVER (WITH WIFI CABLE) SKU: 60.H8WN7.001-WITHWIFICABLE": "LCD Top Cover",
    },
    R752T: {
      "BATTERY 3 CELL SKU: KT.0030G.023": "Battery (3-cell)",
      "LCD VIDEO CABLE SKU: 50.GVFN7.005": "LCD Video Cable",
      "PALMREST WITH KEYBOARD (WITHOUT TOUCHPAD) (WITHOUT WORLD-FACING CAMERA) SKU: 6B.H92N7.021": "Palmrest with Keyboard",
      "(TOUCH) 11.6\" LCD HD 1366X768 GLOSSY 40 PIN CONNECTOR SKU: 6M.H90N7.001": "11.6\" LCD HD Glossy",
      "HINGE RIGHT SKU: 33.H93N7.002": "Right Hinge",
      "HINGE LEFT SKU: 33.H93N7.001": "Left Hinge",
      "TOUCHPAD WITH CABLE SKU: 56.H93N7.001-WITHCABLE": "Touchpad with Cable",
      "CAMERA SKU: KS.0HD0U.001": "Camera",
      "CAMERA (WORLD-FACING) SKU: KS.05M0U.001": "World-Facing Camera",
      "LCD TOP COVER SKU: 60.H93N7.002": "LCD Top Cover",
      "Motherboard / Powerbutton": "Motherboard / Powerbutton",
    },
    R751T: {
      "BATTERY 2 CELL SKU: KT.00204.006": "Battery (2-cell)",
      "LCD VIDEO CABLE (WITHOUT EMR CONNECTION) SKU: 50.GPZN7.007": "LCD Video Cable",
      "PALMREST WITH KEYBOARD (WITHOUT TOUCHPAD) SKU: 6B.GPZN7.019": "Palmrest with Keyboard",
      "(TOUCH) 11.6\" LCD HD 1366X768 GLOSSY 40 PIN CONNECTOR WITH DIGITIZER & BEZEL (WITHOUT EMR) SKU: 6M.GPZN7.001": "11.6\" LCD HD Glossy with Digitizer",
      "HINGE RIGHT SKU: 33.GPZN7.002": "Right Hinge",
      "HINGE LEFT SKU: 33.GPZN7.001": "Left Hinge",
      "TOUCHPAD (WITHOUT CABLE) SKU: 56.GPZN7.001": "Touchpad",
      "CAMERA (FRONT-FACING) SKU: KS.0HD05.002": "Front Camera",
      "CAMERA (WORLD-FACING) SKU: KS.05M05.001": "World-Facing Camera",
      "LCD TOP COVER SKU: 60.GPZN7.001": "LCD Top Cover",
      "LCD BEZEL SKU: 6M.GPZN7.001-FRAME": "LCD Bezel",
      "Motherboard / Powerbutton": "Motherboard / Powerbutton",
    },
    R753T: {
      "BATTERY 3 CELL SKU: KT.00304.012": "Battery (3-cell)",
      "LCD VIDEO CABLE (FOR LCD WITH 30 PIN CONNECTOR) SKU: 50.A8ZN7.003": "LCD Video Cable (30-pin)",
      "LCD VIDEO CABLE (FOR LCD WITH 40 PIN CONNECTOR) SKU: 50.A8ZN7.005": "LCD Video Cable (40-pin)",
      "PALMREST WITH KEYBOARD & TOUCHPAD (WITH WORLD-FACING CAMERA LENS) SKU: 60.A8ZN7.001-CA": "Palmrest with Keyboard & Touchpad (World Camera)",
      "PALMREST WITH KEYBOARD & TOUCHPAD (WITHOUT WORLD-FACING CAMERA LENS) SKU: 60.AYSN7.001-CA": "Palmrest with Keyboard & Touchpad",
      "LCD 11.6" WXGA HD 1366X768 30 PIN TOUCHSCREEN W/BEZEL W/ LOCKDOWN CONNECTOR SKU: 6M.A8ZN7.009 ": "LCD HD (30-pin)",
      "LCD HD 1366X768 40 PIN CONNECTOR SKU: 6M.A8ZN7.006": "LCD HD (40-pin)",
      "HINGE RIGHT SKU: 33.A8ZN7.001": "Right Hinge",
      "HINGE LEFT SKU: 33.A8ZN7.002": "Left Hinge",
      "TOUCHPAD (WITHOUT CABLE) SKU: 56.A6VN7.001": "Touchpad",
      "CAMERA SKU: KS.0HD06.023": "Camera",
      "LCD TOP COVER SKU: 60.A8ZN7.003": "LCD Top Cover",
      "Motherboard / Powerbutton": "Motherboard / Powerbutton",
    },
    C851T: {
      "BATTERY 3 CELL SKU: KT.00304.008": "Battery (3-cell)",
      "PALMREST WITH KEYBOARD & TOUCHPAD SKU: 60.H8YN7.001-CA": "Palmrest with Keyboard & Touchpad",
      "(TOUCH) 12\" LCD HD+ 1366X912 MATTE 40 PIN CONNECTOR SKU: KL.12005.002": "12\" LCD HD+ Matte",
      "HINGE LEFT SKU: 33.H8YN7.001": "Left Hinge",
      "HINGE RIGHT SKU: 33.H8YN7.002": "Right Hinge",
      "TOUCHPAD (WITHOUT CABLE) SKU: 56.H8YN7.002": "Touchpad",
      "CAMERA (WORLD-FACING) SKU: KS.05M0U.002": "World-Facing Camera",
      "CAMERA SKU: KS.0HD0U.001": "Camera",
      "LCD TOP COVER SKU: 60.H8YN7.004": "LCD Top Cover",
      "LCD BEZEL SKU: 60.H8YN7.005": "LCD Bezel",
    },
  };

  // =======================
  // Page integrations
  // =======================
  function clickNotesTab() {
    const tabs = document.querySelectorAll('.x-tab-strip.x-tab-strip-top li');
    if (!tabs || tabs.length === 0) return false;
    for (const tab of tabs) {
      const textSpan = tab.querySelector('.x-tab-strip-text');
      if (textSpan && textSpan.textContent.trim().startsWith('Notes')) {
        tab.click();
        return true;
      }
    }
    return false;
  }

  function clickNewButtonInNotesTab(callback) {
    setTimeout(() => {
      const notesTabContent = document.querySelector('#_p-Notes');
      if (!notesTabContent) return;
      const newButton = notesTabContent.querySelector('button#New');
      if (!newButton) return;
      newButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (callback) callback();
      });
      newButton.click();
    }, 500);
  }

  function waitForNoteTextareaAndFillContent(noteContent, callback) {
    const interval = setInterval(() => {
      const noteTextarea = document.querySelector('#base_inc_notes_note_text');
      if (noteTextarea) {
        clearInterval(interval);
        setValueAndSimulateEvents(noteTextarea, noteContent);
        if (callback) callback();
      }
    }, 500);
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

  function getSignedInUser() {
    const toolbarElement = document.querySelector('.x-toolbar-right .xtb-text span');
    if (toolbarElement) {
      const textContent = toolbarElement.textContent.trim();
      const userMatch = textContent.match(/Welcome\s+([\w.-]+@[\w.-]+)/i);
      if (userMatch && userMatch[1]) {
        return userMatch[1].split(/[@.]/)[0];
      }
    }
    return "Unknown User";
  }

  function setValueAndSimulateEvents(element, value) {
    if (!element) return;
    element.value = value;
    element.dispatchEvent(new Event('focus', { bubbles: true }));
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('keyup', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
    element.dispatchEvent(new Event('blur', { bubbles: true }));
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

  // =======================
  // Footer button
  // =======================
  function createOrderPartsButton() {
    const table = document.createElement('table');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('role', 'presentation');
    table.id = 'OrderPartsButton';
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
            Order Parts
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
      console.log('Order Parts button clicked!');
      automateTicketInteraction();
    });

    return table;
  }

  function addOrderPartsButtonToFooter() {
    const footers = document.querySelectorAll('.x-panel-footer');
    footers.forEach((footer) => {
      const cloneTicketButton = footer.querySelector('button#Clone_Ticket');
      if (cloneTicketButton) {
        if (!footer.querySelector('#OrderPartsButton')) {
          const toolbar = footer.querySelector('.x-toolbar-left-row');
          if (toolbar) {
            const orderPartsButton = createOrderPartsButton();
            const orderPartsButtonCell = document.createElement('td');
            orderPartsButtonCell.className = 'x-toolbar-cell';
            orderPartsButtonCell.style.paddingLeft = '10px';
            orderPartsButtonCell.appendChild(orderPartsButton);
            toolbar.appendChild(orderPartsButtonCell);
            console.log('"Order Parts" button added near "Clone Ticket".');
          }
        }
      }
    });
  }

  const observer = new MutationObserver(addOrderPartsButtonToFooter);
  observer.observe(document.body, { childList: true, subtree: true });
  window.addEventListener('load', addOrderPartsButtonToFooter);

  // =======================
  // Modal (Order Parts)
  // =======================
  function showOrderPartsModal() {
    const descriptionContent = getDescriptionBoxContent();
    const { modelNumber } = parseDescriptionContent(descriptionContent);
    let selectedModel = modelNumber;

    // Overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-background';

    // Modal
    const modal = document.createElement('div');
    modal.className = 'modal';

    // Close X
    const closeX = document.createElement('button');
    closeX.className = 'close-x';
    closeX.setAttribute('aria-label', 'Close');
    closeX.innerHTML = '&times;';
    closeX.onclick = () => overlay.remove();
    modal.appendChild(closeX);

    // Title
    const title = document.createElement('h3');
    title.textContent = `Order Parts for Model: ${modelNumber || 'Unknown'}`;
    modal.appendChild(title);

    // Model select (only shown if unknown)
    if (!modelNumber || !chromebookParts[modelNumber]) {
      const modelLabel = document.createElement('label');
      modelLabel.textContent = 'Select Chromebook Model';
      modal.appendChild(modelLabel);

      const modelSelect = document.createElement('select');
      modelSelect.className = 'modal-select';

      const defaultOption = document.createElement('option');
      defaultOption.textContent = 'Choose a model...';
      defaultOption.disabled = true;
      defaultOption.selected = true;
      modelSelect.appendChild(defaultOption);

      Object.keys(chromebookParts).forEach((model) => {
        const option = document.createElement('option');
        option.value = model;
        option.textContent = model;
        modelSelect.appendChild(option);
      });

      modal.appendChild(modelSelect);

      const hint = document.createElement('div');
      hint.className = 'muted';
      hint.textContent = 'Select a model to load available parts.';
      modal.appendChild(hint);

      modelSelect.addEventListener('change', () => {
        selectedModel = modelSelect.value;
        partsContainer.innerHTML = '';
        populatePartsContainer(chromebookParts[selectedModel], partsContainer);
      });
    }

    // Parts container
    const partsContainer = document.createElement('div');
    partsContainer.className = 'parts-container';
    modal.appendChild(partsContainer);

    if (selectedModel && chromebookParts[selectedModel]) {
      populatePartsContainer(chromebookParts[selectedModel], partsContainer);
    }

    // Buttons
    const buttons = document.createElement('div');
    buttons.className = 'button-row';

    const confirmButton = document.createElement('button');
    confirmButton.className = 'modal-button primary';
    confirmButton.textContent = 'Confirm';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'modal-button danger';
    cancelButton.textContent = 'Cancel';

    confirmButton.addEventListener('click', () => {
      const selectedParts = Array.from(partsContainer.querySelectorAll('input[type="checkbox"]:checked'))
        .map(cb => cb.value);
      if (selectedParts.length === 0) {
        alert('No parts selected.');
        return;
      }
      handlePartsOrder(selectedParts, selectedModel);
      overlay.remove();
    });

    cancelButton.addEventListener('click', () => overlay.remove());

    buttons.appendChild(confirmButton);
    buttons.appendChild(cancelButton);
    modal.appendChild(buttons);

    overlay.appendChild(modal);
    document.body.appendChild(overlay);
  }

  function populatePartsContainer(parts, container) {
    Object.entries(parts).forEach(([fullDescription, shortName]) => {
      const label = document.createElement('label');
      label.className = 'part-row';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.value = fullDescription;

      const text = document.createElement('span');
      text.textContent = shortName;

      label.appendChild(checkbox);
      label.appendChild(text);
      container.appendChild(label);
    });
  }

  // =======================
  // Flow
  // =======================
  function handlePartsOrder(selectedParts, selectedModel) {
    const today = new Date().toLocaleDateString();

    setTimeout(() => {
      if (clickNotesTab()) {
        setTimeout(() => {
          clickNewButtonInNotesTab(() => {
            const noteContent = `ORDERED PARTS: ${today}\n- ${selectedParts.join('\n- ')}`;
            waitForNoteTextareaAndFillContent(noteContent, () => {
              const publicCheckbox = document.querySelector('#note_public');
              simulateCheckboxClick(publicCheckbox);

              sendPartsToWebApp(selectedParts, selectedModel, () => {
                simulateSaveButtonClick();
              });
            });
          });
        }, 500);
      } else {
        console.error('Failed to click on the Notes tab.');
      }
    }, 500);
  }

  function showModal(contentHtml, onConfirm) {
    const oldModal = document.querySelector('.modal-background');
    if (oldModal) oldModal.remove();

    const modalBg = document.createElement('div');
    modalBg.className = 'modal-background';

    const modalBox = document.createElement('div');
    modalBox.className = 'modal';

    // Close X
    const closeX = document.createElement('button');
    closeX.className = 'close-x';
    closeX.setAttribute('aria-label', 'Close');
    closeX.innerHTML = '&times;';
    closeX.onclick = () => modalBg.remove();
    modalBox.appendChild(closeX);

    const body = document.createElement('div');
    body.className = 'modal-body';
    body.innerHTML = contentHtml;

    if (!body.querySelector('button')) {
      const defaultBtn = document.createElement('button');
      defaultBtn.textContent = 'OK';
      defaultBtn.className = 'modal-button primary';
      defaultBtn.onclick = () => {
        modalBg.remove();
        onConfirm && onConfirm();
      };
      body.appendChild(defaultBtn);
    }

    modalBox.appendChild(body);
    modalBg.appendChild(modalBox);
    document.body.appendChild(modalBg);
  }

  function sendPartsToWebApp(selectedParts, selectedModel, callback) {
    const descriptionContent = getDescriptionBoxContent();
    const { districtTag, serialNumber, modelNumber } = parseDescriptionContent(descriptionContent);
    const signedInUser = getSignedInUser();
    const siteInput = document.querySelector('#base_inc_incident_rte_location');
    const siteLocation = siteInput ? siteInput.value : 'Unknown';
    const incidentNumberElement = document.querySelector('#base_inc_incident_id');
    const incidentNumber = incidentNumberElement ? incidentNumberElement.textContent.trim() : 'Unknown';
    const currentDate = new Date().toLocaleDateString();

    const equipmentType = 'Chromebook';
    const finalModel = selectedModel || modelNumber;

    // your deployed web app URL
    const base = 'https://script.google.com/a/macros/dinuba.k12.ca.us/s/AKfycbxuIyq5s0vAgqiFoZFw_sa_grEmZztTuJr94_3P5ZQFaAGUaYTpqrBF6r_hXwHA5pPv-A/exec';

    const params = new URLSearchParams({
      equipmentType,
      makeModel: finalModel,
      whiteAssetTag: districtTag,
      serialNumber,
      incidentNumber,
      siteLocation,
      technician: signedInUser,
      selectedParts: selectedParts.join(','), // CSV
      submissionDate: currentDate
    });

    const alreadyAuthorized = localStorage.getItem('partsWebAppAuthorized') === 'true';
    if (alreadyAuthorized) params.set('autoClose', '1');

    const url = `${base}?${params.toString()}`;
    console.log('[Parts] URL:', url);

    const tab = window.open(url, '_blank');

    if (!alreadyAuthorized) {
      const instructions = `
        <h2>Authorize Google Sheets</h2>
        <p>A new tab has opened.</p>
        <ol style="margin:0 0 12px 20px; text-align:left;">
          <li>Click <strong>Review permissions</strong>.</li>
          <li>Choose your account and click <strong>Allow</strong>.</li>
          <li>Wait until the page says <strong>Success</strong>.</li>
          <li>Return here and press <strong>Continue</strong>.</li>
        </ol>
        <div class="button-row">
          <button id="partsAuthContinue" class="modal-button primary">Continue</button>
          <button id="partsAuthCancel" class="modal-button danger">Cancel</button>
        </div>
      `;
      showModal(instructions, function () {});
      document.getElementById('partsAuthContinue')?.addEventListener('click', () => {
        document.querySelector('.modal-background')?.remove();
        localStorage.setItem('partsWebAppAuthorized', 'true');
        if (callback) callback(true);
      });
      document.getElementById('partsAuthCancel')?.addEventListener('click', () => {
        document.querySelector('.modal-background')?.remove();
      });
    } else {
      setTimeout(() => { try { tab && tab.close(); } catch (e) {} }, 2000);
      if (callback) callback(true);
    }
  }

  function parseDescriptionContent(descriptionContent) {
    if (!descriptionContent) return {};
    const districtTagMatch = descriptionContent.match(/District Tag:\s*([\w-]+)/i);
    const serialNumberMatch = descriptionContent.match(/Serial #:\s*([\w-]+)/i);
    const modelNumberMatch = descriptionContent.match(/Model Number:\s*([\w-]+)/i);

    const districtTag = districtTagMatch ? districtTagMatch[1].trim() : 'Unknown';
    const serialNumber = serialNumberMatch ? serialNumberMatch[1].trim() : 'Unknown';
    const modelNumber = modelNumberMatch ? modelNumberMatch[1].trim() : 'Unknown';

    return { districtTag, serialNumber, modelNumber };
  }

  function getDescriptionBoxContent() {
    const descriptionBox = document.getElementById('base_inc_incident_description');
    if (!descriptionBox) return null;
    const descriptionContent = descriptionBox.value || descriptionBox.textContent;
    return (descriptionContent || '').trim();
  }

  // =======================
  // Kickoff
  // =======================
  function automateTicketInteraction() {
    const descriptionContent = getDescriptionBoxContent();
    if (!descriptionContent) {
      alert('No valid description content found. Cannot proceed.');
      return;
    }
    showOrderPartsModal();
  }

})();
