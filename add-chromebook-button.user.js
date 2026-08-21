// ==UserScript==
// @name         Add Chromebooks Button with Submission Process
// @namespace    http://tampermonkey.net/
// @version      1.8.3
// @description  Professional Chromebook intake workflow and automated SchoolDude ticket submission.
// @author       You
// @match        *://*.schooldude.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  let addBtnScheduled = false;
  let addBtnInserted = false;

  let submissionInProgress = false;

  const schools = [
    'Dinuba High School',
    'Dinuba Intermediate School',
    'Grand view Elementary',
    'Kennedy Elementary',
    'Roosevelt Elementary',
    'Wilson Elementary',
    'Lincoln Elementary',
    'Washington Intermediate',
    'Sierra Vista',
    'Jefferson Elementary'
  ];

  let selectedSchool = '';
  let selectedTechnician = '';
  let chromebooks = [];
  let chromebookCount = 0;

  /* =========================================================
     ADD CHROMEBOOK BUTTON
     ========================================================= */

  function createAddChromebooksButton() {
    const table = document.createElement('table');

    table.setAttribute('cellspacing', '0');
    table.setAttribute('role', 'presentation');

    table.id = 'AddChromebooksButton';
    table.className = 'x-btn x-component x-btn-noicon x-unselectable';

    table.style.cssText =
      'margin-right:5px;margin-left:10px;';

    table.unselectable = 'on';

    const tbody = document.createElement('tbody');

    tbody.className =
      'x-btn-small x-btn-icon-small-left';

    const topRow = document.createElement('tr');

    topRow.innerHTML = `
      <td class="x-btn-tl"><i>&nbsp;</i></td>
      <td class="x-btn-tc"></td>
      <td class="x-btn-tr"><i>&nbsp;</i></td>
    `;

    const middleRow =
      document.createElement('tr');

    middleRow.innerHTML = `
      <td class="x-btn-ml"><i>&nbsp;</i></td>

      <td class="x-btn-mc">
        <em unselectable="on">

          <button
            class="x-btn-text"
            type="button"
            style="position:relative;width:150px;"
            tabindex="0"
          >
            Add Chromebooks
          </button>

        </em>
      </td>

      <td class="x-btn-mr"><i>&nbsp;</i></td>
    `;

    const bottomRow =
      document.createElement('tr');

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
      console.log(
        '"Add Chromebooks" button clicked!'
      );

      injectChromebookSubmissionLogic();
    });

    return table;
  }

  function addButtonToSpecificFooter() {
    if (addBtnInserted) return;

    const footers =
      document.querySelectorAll(
        '.x-panel-footer'
      );

    for (const footer of footers) {
      const personalizationsButton =
        footer.querySelector(
          'button#Personalizations'
        );

      if (!personalizationsButton) {
        continue;
      }

      if (
        !footer.querySelector(
          '#AddChromebooksButton'
        )
      ) {
        const toolbar =
          footer.querySelector(
            '.x-toolbar-left-row'
          );

        if (!toolbar) continue;

        const addChromebooksButton =
          createAddChromebooksButton();

        const addChromebooksCell =
          document.createElement('td');

        addChromebooksCell.className =
          'x-toolbar-cell';

        addChromebooksCell.appendChild(
          addChromebooksButton
        );

        toolbar.appendChild(
          addChromebooksCell
        );

        console.log(
          '"Add Chromebooks" button added.'
        );

        addBtnInserted = true;

        if (observer) {
          observer.disconnect();
        }

        break;
      }

      addBtnInserted = true;

      if (observer) {
        observer.disconnect();
      }

      break;
    }
  }

  const observer =
    new MutationObserver(() => {
      if (addBtnInserted) {
        observer.disconnect();
        return;
      }

      if (addBtnScheduled) {
        return;
      }

      addBtnScheduled = true;

      setTimeout(() => {
        addBtnScheduled = false;

        addButtonToSpecificFooter();
      }, 100);
    });

  window.addEventListener(
    'load',
    () => {
      addButtonToSpecificFooter();

      if (!addBtnInserted) {
        observer.observe(
          document.body,
          {
            childList: true,
            subtree: true
          }
        );
      }
    }
  );

  if (document.body) {
    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true
      }
    );
  }

  function injectChromebookSubmissionLogic() {
    console.log(
      'Starting Chromebook submission process...'
    );

    startProcess();
  }

  /* =========================================================
     MODAL SYSTEM
     ========================================================= */

  function removeExistingModal() {
    document
      .querySelectorAll(
        '.sd-modal-background'
      )
      .forEach(element => {
        element.remove();
      });

    document.body.classList.remove(
      'sd-modal-open'
    );
  }

  function showModal(
    content,
    callback = function () {}
  ) {
    removeExistingModal();

    const modalBackground =
      document.createElement('div');

    modalBackground.className =
      'modal-background sd-modal-background';

    const modal =
      document.createElement('div');

    modal.className =
      'modal sd-modal';

    modal.setAttribute(
      'role',
      'dialog'
    );

    modal.setAttribute(
      'aria-modal',
      'true'
    );

    modal.innerHTML = `
      <div class="sd-modal-accent"></div>

      <div class="modal-content">
        ${content}
      </div>
    `;

    [
      'click',
      'mousedown',
      'mouseup'
    ].forEach(eventName => {
      modal.addEventListener(
        eventName,
        function (event) {
          event.stopPropagation();
        }
      );
    });

    modalBackground.appendChild(
      modal
    );

    document.body.appendChild(
      modalBackground
    );

    document.body.classList.add(
      'sd-modal-open'
    );

    requestAnimationFrame(() => {
      modalBackground.classList.add(
        'is-visible'
      );

      modal.classList.add(
        'is-visible'
      );
    });

    let isClosing = false;

    const closeModal = (
      reload = false
    ) => {
      if (isClosing) return;

      isClosing = true;

      modalBackground.classList.remove(
        'is-visible'
      );

      modal.classList.remove(
        'is-visible'
      );

      document.body.classList.remove(
        'sd-modal-open'
      );

      setTimeout(() => {
        if (
          modalBackground.parentNode
        ) {
          modalBackground.remove();
        }

        if (reload) {
          location.reload();
        }
      }, 170);
    };

    modalBackground.addEventListener(
      'click',
      function (event) {
        if (
          event.target ===
          modalBackground
        ) {
          closeModal(true);
        }
      }
    );

    const escHandler =
      function (event) {
        if (
          event.key === 'Escape'
        ) {
          document.removeEventListener(
            'keydown',
            escHandler
          );

          closeModal(true);
        }
      };

    document.addEventListener(
      'keydown',
      escHandler
    );

    const cleanupKeyboard = () => {
      document.removeEventListener(
        'keydown',
        escHandler
      );
    };

    const firstInput =
      modal.querySelector(
        'input:not([readonly])'
      );

    const firstSelect =
      modal.querySelector(
        'select'
      );

    setTimeout(() => {
      if (firstInput) {
        firstInput.focus();
      } else if (firstSelect) {
        firstSelect.focus();
      }
    }, 80);

    modal.addEventListener(
      'keydown',
      function (event) {
        if (
          event.key !== 'Enter'
        ) {
          return;
        }

        if (
          event.target &&
          event.target.tagName ===
          'TEXTAREA'
        ) {
          return;
        }

        if (
          modal.querySelector(
            '.review-modal-body'
          )
        ) {
          return;
        }

        const nextButton =
          modal.querySelector(
            '#nextButton'
          );

        if (!nextButton) {
          return;
        }

        event.preventDefault();

        nextButton.click();
      }
    );

    const nextButton =
      modal.querySelector(
        '#nextButton'
      );

    if (nextButton) {
      nextButton.addEventListener(
        'click',
        function (event) {
          event.stopPropagation();

          const input =
            modal.querySelector(
              'input:not([readonly])'
            );

          const select =
            modal.querySelector(
              'select'
            );

          let value;

          /*
           * IMPORTANT:
           * If a dropdown exists, use the dropdown
           * value first. This fixes the school value.
           */
          if (select) {
            value = select.value;
          } else if (input) {
            value = input.value;
          }

          cleanupKeyboard();

          closeModal(false);

          setTimeout(() => {
            callback(value);
          }, 180);
        }
      );
    }

    const doneButton =
      modal.querySelector(
        '#doneButton'
      );

    if (doneButton) {
      doneButton.addEventListener(
        'click',
        function (event) {
          event.stopPropagation();

          cleanupKeyboard();

          closeModal(false);

          setTimeout(
            displayCollectedInfo,
            180
          );
        }
      );
    }

    const closeButton =
      modal.querySelector(
        '#closeButton'
      );

    if (closeButton) {
      closeButton.addEventListener(
        'click',
        function (event) {
          event.stopPropagation();

          cleanupKeyboard();

          closeModal(true);
        }
      );
    }

    return {
      modal,
      modalBackground,
      closeModal
    };
  }

  /* =========================================================
     TECHNICIAN DETECTION
     ========================================================= */

  function extractTechnicianName() {
    const email =
      extractLoggedInUserEmail();

    if (!email) {
      return null;
    }

    const user =
      email.split('@')[0];

    return user.split('.')[0];
  }

  function extractLoggedInUserEmail() {
    const el =
      document.querySelector(
        '.xtb-text span'
      );

    if (!el) {
      console.error(
        'Logged-in user element not found.'
      );

      return null;
    }

    const text =
      el.textContent.trim();

    const match =
      text.match(
        /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/
      );

    if (!match) {
      console.error(
        'No email found in logged-in user text:',
        text
      );

      return null;
    }

    return match[0];
  }

  /* =========================================================
     START WORKFLOW
     ========================================================= */

  function startProcess() {
    const extractedTechnicianName =
      extractTechnicianName();

    if (extractedTechnicianName) {
      selectedTechnician =
        extractedTechnicianName;
    } else {
      selectedTechnician =
        'Unknown Technician';
    }

    const schoolOptions =
      schools
        .map(
          school =>
            `<option value="${school}">${school}</option>`
        )
        .join('');

    showModal(
      `
      <div class="modal-body">

        <button
          id="closeButton"
          class="modal-button sd-icon-button"
          type="button"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
          >
            <path
              d="M6 6L18 18M18 6L6 18"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <div class="sd-kicker">
          CHROMEBOOK INTAKE
        </div>

        <h2>
          Start a new submission
        </h2>

        <p class="sd-subtitle">
          Choose the campus for these devices.
          Your technician account was detected automatically.
        </p>

        <div class="sd-field-group">

          <label for="school">
            School / Site
          </label>

          <div class="sd-input-shell">

            <span class="sd-input-icon">
              ◉
            </span>

            <select
              id="school"
              class="modal-select"
            >
              ${schoolOptions}
            </select>

          </div>

          <div class="sd-helper">
            Tickets will automatically be routed to this site.
          </div>

        </div>

        <div class="sd-field-group">

          <label for="technician">
            Technician
          </label>

          <div class="sd-input-shell is-readonly">

            <span class="sd-input-icon">
              ●
            </span>

            <input
              id="technician"
              class="modal-input"
              value="${selectedTechnician}"
              readonly
            />

          </div>

          <div class="sd-helper">
            Automatically detected from your SchoolDude login.
          </div>

        </div>

        <div class="button-container">

          <button
            id="nextButton"
            class="modal-button sd-primary"
            type="button"
          >
            Continue
            <span>→</span>
          </button>

        </div>

      </div>
      `,
      function (schoolValue) {

        /*
         * FIX:
         * Use the school value captured BEFORE
         * the modal closes.
         */
        selectedSchool =
          String(
            schoolValue || ''
          ).trim();

        console.log(
          'Selected School:',
          selectedSchool
        );

        console.log(
          'Selected Technician:',
          selectedTechnician
        );

        promptDistrictTag();
      }
    );
  }

  /* =========================================================
     DISTRICT TAG
     ========================================================= */

  function promptDistrictTag(
    errorMessage = ''
  ) {
    const doneButtonHtml =
      chromebookCount >= 1
        ? `
          <button
            id="doneButton"
            class="modal-button sd-secondary-dark"
            type="button"
          >
            Review Devices
          </button>
        `
        : '';

    showModal(
      `
      <div class="modal-body">

        <button
          id="closeButton"
          class="modal-button sd-icon-button"
          type="button"
          aria-label="Close"
        >
          ✕
        </button>

        <div class="sd-kicker">
          DEVICE ${chromebookCount + 1}
        </div>

        <h2>
          Scan district tag
        </h2>

        <p class="sd-subtitle">
          Scan or enter the district asset tag
          for the next Chromebook.
        </p>

        ${
          errorMessage
            ? `
              <div class="error-message">
                ${errorMessage}
              </div>
            `
            : ''
        }

        <div class="sd-field-group">

          <label for="districtTag">
            District Tag
          </label>

          <input
            type="text"
            id="districtTag"
            class="modal-input"
            placeholder="Example: 01234567"
            autocomplete="off"
          />

          <div class="sd-helper">
            District tags must begin with 0.
          </div>

        </div>

        ${
          chromebookCount > 0
            ? `
            <div class="sd-current-count">
              <strong>${chromebookCount}</strong>
              ${
                chromebookCount === 1
                  ? 'Chromebook'
                  : 'Chromebooks'
              }
              currently added
            </div>
            `
            : ''
        }

        <div class="button-container">

          ${doneButtonHtml}

          <button
            id="nextButton"
            class="modal-button sd-primary"
            type="button"
          >
            Continue →
          </button>

        </div>

      </div>
      `,
      function (districtTag) {
        districtTag =
          String(
            districtTag || ''
          ).trim();

        if (
          districtTag === ''
        ) {
          districtTag = 'N/A';

          promptSerialNumber(
            districtTag
          );

          return;
        }

        if (
          districtTag.startsWith('0') &&
          districtTag.length < 9
        ) {
          promptSerialNumber(
            districtTag
          );

          return;
        }

        promptDistrictTag(
          'District Tag must start with "0" and contain fewer than 9 characters.'
        );
      }
    );
  }

  /* =========================================================
     SERIAL
     ========================================================= */

  function promptSerialNumber(
    districtTag,
    errorMessage = ''
  ) {
    showModal(
      `
      <div class="modal-body">

        <div class="sd-kicker">
          DEVICE ${chromebookCount + 1}
        </div>

        <h2>
          Scan serial number
        </h2>

        <p class="sd-subtitle">
          Scan or enter the Chromebook serial number.
          Leave it blank if a serial number is unavailable.
        </p>

        ${
          errorMessage
            ? `
              <div class="error-message">
                ${errorMessage}
              </div>
            `
            : ''
        }

        <div class="sd-field-group">

          <label for="serialNumber">
            Serial Number
          </label>

          <input
            type="text"
            id="serialNumber"
            class="modal-input"
            placeholder="Scan or enter serial number"
            autocomplete="off"
          />

          <div class="sd-helper">
            Supported serials normally begin with N, M, or Y.
          </div>

        </div>

        <div class="button-container">

          <button
            id="nextButton"
            class="modal-button sd-primary"
            type="button"
          >
            Continue →
          </button>

        </div>

      </div>
      `,
      function (serialInput) {
        if (
          String(serialInput || '')
            .trim() === ''
        ) {
          promptModelNumber(
            districtTag,
            'N/A'
          );

          return;
        }

        let cleaned =
          String(serialInput)
            .trim();

        try {
          const url =
            new URL(cleaned);

          cleaned =
            url.pathname
              .split('/')
              .filter(Boolean)
              .pop() ||
            cleaned;
        } catch (_) {
          const parts =
            cleaned.split('/');

          cleaned =
            parts[
              parts.length - 1
            ];
        }

        cleaned =
          cleaned
            .split('?')[0]
            .split('#')[0];

        cleaned =
          cleaned
            .replace(
              /[^A-Za-z0-9]/g,
              ''
            )
            .toUpperCase();

        console.log(
          '[Serial] cleaned:',
          cleaned
        );

        if (
          /^[NMY]/.test(cleaned)
        ) {
          promptModelNumber(
            districtTag,
            cleaned
          );
        } else {
          promptSerialNumber(
            districtTag,
            'Serial number must begin with N, M, or Y.'
          );
        }
      }
    );
  }

  /* =========================================================
     MODEL DETECTION
     ========================================================= */

  function determineModelNumber(
    serialNumber
  ) {
    if (!serialNumber) {
      return '';
    }

    const serial =
      String(serialNumber)
        .toUpperCase();

    /*
     * ANY SERIAL STARTING WITH YX
     */
    if (
      serial.startsWith('YX')
    ) {
      return 'Lenovo 300e Yoga';
    }

    const prefix5 =
      serial.substring(
        0,
        5
      );

    const map5 = {
      NXHPW: 'R752T',
      NXGPZ: 'R751T',
      NXA8Z: 'R753T',
      NXH8V: 'C733',
      NXH8Y: 'C851',
      M2NXY: 'C204M',
      M1NXV: 'C204M',
      M2NXC: 'C204M'
    };

    return (
      map5[prefix5] ||
      ''
    );
  }

  function promptModelNumber(
    districtTag,
    serialNumber
  ) {
    const autoSelectedModel =
      determineModelNumber(
        serialNumber
      );

    if (
      autoSelectedModel
    ) {
      chromebooks.push({
        districtTag,
        serialNumber,
        modelNumber:
          autoSelectedModel
      });

      chromebookCount =
        chromebooks.length;

      promptDistrictTag();

      return;
    }

    showModal(
      `
      <div class="modal-body">

        <div class="sd-kicker">
          DEVICE ${chromebookCount + 1}
        </div>

        <h2>
          Enter model
        </h2>

        <p class="sd-subtitle">
          This serial number did not match a model
          in the automatic lookup table.
        </p>

        <div class="sd-field-group">

          <label for="modelNumber">
            Model Number
          </label>

          <input
            type="text"
            id="modelNumber"
            class="modal-input"
            placeholder="Type model number"
            autocomplete="off"
          />

        </div>

        <div class="button-container">

          <button
            id="nextButton"
            class="modal-button sd-primary"
            type="button"
          >
            Add Device →
          </button>

        </div>

      </div>
      `,
      function (modelNumber) {
        modelNumber =
          String(
            modelNumber || ''
          ).trim();

        if (
          modelNumber === ''
        ) {
          promptModelNumber(
            districtTag,
            serialNumber
          );

          return;
        }

        chromebooks.push({
          districtTag,
          serialNumber,
          modelNumber
        });

        chromebookCount =
          chromebooks.length;

        promptDistrictTag();
      }
    );
  }

  /* =========================================================
     REVIEW SCREEN
     ========================================================= */

  function displayCollectedInfo() {
    chromebookCount =
      chromebooks.length;

    if (
      chromebookCount === 0
    ) {
      alert(
        'No Chromebooks To Submit.'
      );

      return;
    }

    console.log(
      'Review School:',
      selectedSchool
    );

    console.log(
      'Review Technician:',
      selectedTechnician
    );

    const info = `
      <div class="modal-body review-modal-body">

        <div class="review-header-section">

          <button
            id="closeButton"
            class="modal-button sd-icon-button"
            type="button"
          >
            ✕
          </button>

          <div class="sd-kicker">
            REVIEW SUBMISSION
          </div>

          <h2>
            Review Chromebooks
          </h2>

          <p class="sd-subtitle">
            Confirm the device information before
            SchoolDude tickets are created.
          </p>

          <div class="sd-summary-grid">

            <div class="sd-summary-card">

              <span>
                School
              </span>

              <strong>
                ${selectedSchool || 'Not Selected'}
              </strong>

            </div>

            <div class="sd-summary-card">

              <span>
                Technician
              </span>

              <strong>
                ${selectedTechnician || 'Unknown'}
              </strong>

            </div>

            <div class="sd-summary-card">

              <span>
                Devices
              </span>

              <strong>
                ${chromebookCount}
              </strong>

            </div>

          </div>

        </div>

        <div class="review-list-wrapper">

          <ul class="review-device-list">

            ${
              chromebooks
                .map(
                  (
                    chromebook,
                    index
                  ) => `
                  <li class="chromebook-item">

                    <div class="button-group">

                      <button
                        class="edit-button"
                        data-index="${index}"
                        type="button"
                        title="Edit"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="17"
                          height="17"
                          fill="currentColor"
                        >
                          <path
                            d="M3 21v-3.586l11.293-11.293 3.586 3.586L6.586 21H3z"
                          />
                          <path
                            d="M18.207 7.293l-1.5-1.5 2.5-2.5a1 1 0 0 1 1.414 0l1.086 1.086a1 1 0 0 1 0 1.414l-2.5 2.5-1.5-1.5z"
                          />
                        </svg>
                      </button>

                      <button
                        class="delete-button"
                        data-index="${index}"
                        type="button"
                        title="Delete"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="currentColor"
                        >
                          <path
                            d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM16.5 4l-1-1h-7l-1 1H5v2h14V4h-2.5z"
                          />
                        </svg>
                      </button>

                    </div>

                    <div class="sd-device-number">
                      DEVICE ${index + 1}
                    </div>

                    <div class="device-detail-row">
                      <span>
                        District Tag
                      </span>

                      <strong>
                        ${chromebook.districtTag}
                      </strong>
                    </div>

                    <div class="device-detail-row">
                      <span>
                        Serial #
                      </span>

                      <strong>
                        ${chromebook.serialNumber}
                      </strong>
                    </div>

                    <div class="device-detail-row">
                      <span>
                        Model
                      </span>

                      <strong>
                        ${chromebook.modelNumber}
                      </strong>
                    </div>

                  </li>
                `
                )
                .join('')
            }

          </ul>

        </div>

        <div class="review-action-bar">

          <div class="review-device-count">

            <strong>
              ${chromebookCount}
            </strong>

            ${
              chromebookCount === 1
                ? 'device ready'
                : 'devices ready'
            }

          </div>

          <div class="review-action-buttons">

            <button
              id="addButton"
              class="modal-button"
              type="button"
            >
              + Add More
            </button>

            <button
              id="reviewSubmitButton"
              class="modal-button sd-primary"
              type="button"
            >
              Submit Tickets →
            </button>

          </div>

        </div>

      </div>
    `;

    showModal(
      info,
      function () {}
    );

    const addButton =
      document.getElementById(
        'addButton'
      );

    if (addButton) {
      addButton.addEventListener(
        'click',
        function () {
          removeExistingModal();

          promptDistrictTag();
        }
      );
    }

    const submitButton =
      document.getElementById(
        'reviewSubmitButton'
      );

    if (submitButton) {
      submitButton.addEventListener(
        'click',
        function () {
          removeExistingModal();

          openNewTicketPage();
        }
      );
    }

    document
      .querySelectorAll(
        '.edit-button'
      )
      .forEach(button => {
        button.addEventListener(
          'click',
          function () {
            const index =
              Number(
                this.getAttribute(
                  'data-index'
                )
              );

            removeExistingModal();

            editChromebook(
              index
            );
          }
        );
      });

    document
      .querySelectorAll(
        '.delete-button'
      )
      .forEach(button => {
        button.addEventListener(
          'click',
          function () {
            const index =
              Number(
                this.getAttribute(
                  'data-index'
                )
              );

            deleteChromebook(
              index
            );
          }
        );
      });
  }

  /* =========================================================
     EDIT
     ========================================================= */

  function editChromebook(
    index
  ) {
    const chromebook =
      chromebooks[index];

    if (!chromebook) {
      return;
    }

    showModal(
      `
      <div class="modal-body">

        <div class="sd-kicker">
          EDIT DEVICE
        </div>

        <h2>
          Edit Chromebook
        </h2>

        <p class="sd-subtitle">
          Update the device information below.
        </p>

        <div class="sd-field-group">

          <label for="editDistrictTag">
            District Tag
          </label>

          <input
            type="text"
            id="editDistrictTag"
            value="${chromebook.districtTag}"
            class="modal-input"
          />

        </div>

        <div class="sd-field-group">

          <label for="editSerialNumber">
            Serial Number
          </label>

          <input
            type="text"
            id="editSerialNumber"
            value="${chromebook.serialNumber}"
            class="modal-input"
          />

        </div>

        <div class="sd-field-group">

          <label for="editModelNumber">
            Model Number
          </label>

          <input
            type="text"
            id="editModelNumber"
            value="${chromebook.modelNumber}"
            class="modal-input"
          />

        </div>

        <div class="button-container">

          <button
            id="cancelEditButton"
            class="modal-button"
            type="button"
          >
            Cancel
          </button>

          <button
            id="saveEditButton"
            class="modal-button sd-primary"
            type="button"
          >
            Save Changes
          </button>

        </div>

      </div>
      `,
      function () {}
    );

    const saveButton =
      document.getElementById(
        'saveEditButton'
      );

    if (saveButton) {
      saveButton.addEventListener(
        'click',
        function () {
          const updatedDistrictTag =
            document
              .getElementById(
                'editDistrictTag'
              )
              .value
              .trim();

          const updatedSerialNumber =
            document
              .getElementById(
                'editSerialNumber'
              )
              .value
              .trim();

          const updatedModelNumber =
            document
              .getElementById(
                'editModelNumber'
              )
              .value
              .trim();

          chromebooks[index] = {
            districtTag:
              updatedDistrictTag,

            serialNumber:
              updatedSerialNumber,

            modelNumber:
              updatedModelNumber
          };

          chromebookCount =
            chromebooks.length;

          removeExistingModal();

          displayCollectedInfo();
        }
      );
    }

    const cancelButton =
      document.getElementById(
        'cancelEditButton'
      );

    if (cancelButton) {
      cancelButton.addEventListener(
        'click',
        function () {
          removeExistingModal();

          displayCollectedInfo();
        }
      );
    }
  }

  /* =========================================================
     DELETE
     ========================================================= */

  function deleteChromebook(
    index
  ) {
    const confirmDelete =
      confirm(
        'Are you sure you want to delete this Chromebook?'
      );

    if (!confirmDelete) {
      return;
    }

    chromebooks.splice(
      index,
      1
    );

    chromebookCount =
      chromebooks.length;

    removeExistingModal();

    if (
      chromebookCount === 0
    ) {
      promptDistrictTag();

      return;
    }

    displayCollectedInfo();
  }

  /* =========================================================
     OPEN NEW TICKET
     ========================================================= */

  function openNewTicketPage() {
    const button =
      document.querySelector(
        'button#New'
      );

    if (!button) {
      console.error(
        'New ticket button not found.'
      );

      alert(
        'The SchoolDude "New" ticket button could not be found.'
      );

      return;
    }

    button.click();

    setTimeout(() => {
      submitChromebooks(
        0,
        selectedSchool
      );
    }, 1000);
  }

  /* =========================================================
     SUBMIT CHROMEBOOKS
     ========================================================= */

  function submitChromebooks(
    index,
    school
  ) {
    if (
      submissionInProgress
    ) {
      return;
    }

    const loggedInUserEmail =
      extractLoggedInUserEmail();

    if (
      !loggedInUserEmail
    ) {
      console.error(
        'Unable to determine logged-in email.'
      );

      return;
    }

    if (
      index >=
      chromebooks.length
    ) {
      return;
    }

    submissionInProgress =
      true;

    showOverlay(
      `Submitting Chromebook ${index + 1} of ${chromebooks.length}`
    );

    const chromebookData =
      chromebooks[index];

    fillOutFormFields(
      chromebookData,
      loggedInUserEmail,
      school,
      function () {
        submitForm(
          index,
          function () {
            if (
              index + 1 <
              chromebooks.length
            ) {
              submissionInProgress =
                false;

              const newButton =
                document.querySelector(
                  'button#New'
                );

              if (newButton) {
                newButton.click();
              }

              setTimeout(() => {
                submitChromebooks(
                  index + 1,
                  school
                );
              }, 1200);

            } else {
              submissionInProgress =
                false;

              hideOverlay();

              displaySummary();
            }
          }
        );
      }
    );
  }

  /* =========================================================
     SUBMISSION OVERLAY
     ========================================================= */

  function showOverlay(
    message
  ) {
    hideOverlay();

    const overlay =
      document.createElement('div');

    overlay.className =
      'overlay';

    overlay.innerHTML = `
      <div class="overlay-message">

        <div class="sd-spinner"></div>

        <div class="sd-overlay-kicker">
          SCHOOLDUDE AUTOMATION
        </div>

        <div class="sd-overlay-title">
          ${message}
        </div>

        <div class="sd-overlay-helper">
          Please keep this window open while
          your tickets are being created.
        </div>

      </div>
    `;

    document.body.appendChild(
      overlay
    );
  }

  function hideOverlay() {
    const overlay =
      document.querySelector(
        '.overlay'
      );

    if (overlay) {
      overlay.remove();
    }
  }

  /* =========================================================
     FORM FILLING
     ========================================================= */

  function fillOutFormFields(
    chromebookData,
    loggedInUserEmail,
    school,
    callback
  ) {
    if (
      !chromebookData ||
      !loggedInUserEmail ||
      !school
    ) {
      console.error(
        'Missing required parameters.'
      );

      console.log({
        chromebookData,
        loggedInUserEmail,
        school
      });

      return;
    }

    const steps = [
      function (next) {
        selectAssignedToUser();

        setTimeout(
          next,
          500
        );
      },

      function (next) {
        selectLocationBySchool(
          school
        );

        setTimeout(
          next,
          500
        );
      },

      function (next) {
        selectWorkQueueBySchool(
          school
        );

        setTimeout(
          next,
          500
        );
      },

      function (next) {
        selectWorkTypeAsChromebook();

        setTimeout(
          next,
          500
        );
      },

      function (next) {
        const textareaElement =
          document.getElementById(
            'base_inc_incident_description'
          );

        if (
          !textareaElement
        ) {
          console.error(
            'Description textarea not found.'
          );

          return;
        }

        const desiredValue =
          `District Tag: ${chromebookData.districtTag} || \n` +
          `Serial #: ${chromebookData.serialNumber} || \n` +
          `Model Number: ${chromebookData.modelNumber}`;

        triggerTextareaInput(
          textareaElement,
          desiredValue
        );

        next();
      }
    ];

    let stepIndex = 0;

    function runNextStep() {
      if (
        stepIndex >=
        steps.length
      ) {
        if (
          typeof callback ===
          'function'
        ) {
          callback();
        }

        return;
      }

      const currentStep =
        steps[stepIndex];

      stepIndex++;

      currentStep(
        runNextStep
      );
    }

    runNextStep();
  }

  /* =========================================================
     ASSIGNED TO
     ========================================================= */

  function selectAssignedToUser() {
    const loggedInUserEmail =
      extractLoggedInUserEmail();

    if (
      !loggedInUserEmail
    ) {
      return;
    }

    const triggers =
      document.getElementsByClassName(
        'x-form-trigger-arrow'
      );

    const trigger =
      triggers[2];

    if (!trigger) {
      console.error(
        '"Assigned To" trigger not found.'
      );

      return;
    }

    trigger.click();

    setTimeout(() => {
      const dropdownContainer =
        document.getElementById(
          'base_inc_incident_assigned_to-combo-list'
        );

      if (
        !dropdownContainer
      ) {
        console.error(
          'Assigned To dropdown not found.'
        );

        return;
      }

      const options =
        Array.from(
          dropdownContainer.querySelectorAll(
            '.x-combo-list-item span[qtip]'
          )
        );

      const matchingOption =
        options.find(option => {
          const qtip =
            option.getAttribute(
              'qtip'
            );

          return (
            qtip &&
            qtip
              .toLowerCase()
              .includes(
                loggedInUserEmail
                  .toLowerCase()
              )
          );
        });

      if (
        matchingOption
      ) {
        clickComboOption(
          matchingOption
        );
      }
    }, 500);
  }

  /* =========================================================
     LOCATION
     ========================================================= */

  function selectLocationBySchool(
    school
  ) {
    const triggers =
      document.getElementsByClassName(
        'x-form-trigger-arrow'
      );

    const trigger =
      triggers[5];

    if (!trigger) {
      console.error(
        'Location trigger not found.'
      );

      return;
    }

    trigger.click();

    setTimeout(() => {
      const container =
        document.getElementById(
          'base_inc_incident_rte_location-combo-list'
        );

      if (!container) {
        return;
      }

      const options =
        Array.from(
          container.querySelectorAll(
            '.x-combo-list-item span[qtip]'
          )
        );

      const matchingOption =
        findSchoolOption(
          options,
          school
        );

      if (
        matchingOption
      ) {
        clickComboOption(
          matchingOption
        );
      }
    }, 500);
  }

  /* =========================================================
     WORK QUEUE
     ========================================================= */

  function selectWorkQueueBySchool(
    school
  ) {
    const triggers =
      document.getElementsByClassName(
        'x-form-trigger-arrow'
      );

    const trigger =
      triggers[3];

    if (!trigger) {
      console.error(
        'Work Queue trigger not found.'
      );

      return;
    }

    trigger.click();

    setTimeout(() => {
      const container =
        document.getElementById(
          'base_inc_incident_work_queue-combo-list'
        );

      if (!container) {
        return;
      }

      const options =
        Array.from(
          container.querySelectorAll(
            '.x-combo-list-item span[qtip]'
          )
        );

      const matchingOption =
        findSchoolOption(
          options,
          school
        );

      if (
        matchingOption
      ) {
        clickComboOption(
          matchingOption
        );
      }
    }, 500);
  }

  function findSchoolOption(
    options,
    school
  ) {
    return options.find(
      option => {
        const qtip =
          option.getAttribute(
            'qtip'
          );

        if (!qtip) {
          return false;
        }

        const optionName =
          qtip
            .trim()
            .toLowerCase();

        if (
          school ===
          'Dinuba Intermediate School'
        ) {
          return optionName.includes(
            'dinuba intermediate'
          );
        }

        if (
          school ===
          'Dinuba High School'
        ) {
          return optionName.includes(
            'dinuba high'
          );
        }

        return optionName.startsWith(
          school
            .split(' ')[0]
            .toLowerCase()
        );
      }
    );
  }

  function clickComboOption(
    matchingOption
  ) {
    const parentOption =
      matchingOption.closest(
        '.x-combo-list-item'
      );

    if (!parentOption) {
      return;
    }

    parentOption.dispatchEvent(
      new MouseEvent(
        'mousedown',
        {
          bubbles: true
        }
      )
    );

    parentOption.dispatchEvent(
      new MouseEvent(
        'mouseup',
        {
          bubbles: true
        }
      )
    );

    parentOption.dispatchEvent(
      new MouseEvent(
        'click',
        {
          bubbles: true
        }
      )
    );
  }

  /* =========================================================
     WORK TYPE
     ========================================================= */

  function selectWorkTypeAsChromebook() {
    const triggers =
      document.getElementsByClassName(
        'x-form-trigger-arrow'
      );

    const trigger =
      triggers[4];

    if (!trigger) {
      console.error(
        'Work Type trigger not found.'
      );

      return;
    }

    trigger.click();

    setTimeout(() => {
      const container =
        document.getElementById(
          'base_inc_incident_work_type-combo-list'
        );

      if (!container) {
        return;
      }

      const options =
        Array.from(
          container.querySelectorAll(
            '.x-combo-list-item span[qtip]'
          )
        );

      const matchingOption =
        options.find(option => {
          const qtip =
            option.getAttribute(
              'qtip'
            );

          return (
            qtip &&
            qtip
              .trim()
              .toLowerCase() ===
              'chromebook'
          );
        });

      if (
        matchingOption
      ) {
        clickComboOption(
          matchingOption
        );
      }
    }, 500);
  }

  /* =========================================================
     TEXT AREA
     ========================================================= */

  function triggerTextareaInput(
    textareaElement,
    value
  ) {
    textareaElement.focus();

    textareaElement.value =
      value;

    textareaElement.dispatchEvent(
      new Event(
        'input',
        {
          bubbles: true
        }
      )
    );

    textareaElement.dispatchEvent(
      new Event(
        'change',
        {
          bubbles: true
        }
      )
    );

    textareaElement.blur();
  }

  /* =========================================================
     SUBMIT FORM
     ========================================================= */

  function submitForm(
    currentIndex,
    callback
  ) {
    const saveButton =
      document.getElementById(
        'Save'
      );

    if (!saveButton) {
      console.error(
        'Save button not found.'
      );

      submissionInProgress =
        false;

      hideOverlay();

      return;
    }

    try {
      saveButton.click();

      console.log(
        'Form submitted for Chromebook ' +
        (currentIndex + 1)
      );

      setTimeout(() => {
        const errorLabel =
          Array.from(
            document.querySelectorAll(
              'span'
            )
          ).find(span => {
            return (
              span.textContent &&
              span.textContent.includes(
                'Error'
              )
            );
          });

        if (
          errorLabel
        ) {
          console.error(
            'Error detected:',
            errorLabel.textContent
          );

          submissionInProgress =
            false;

          hideOverlay();

          return;
        }

        if (
          typeof callback ===
          'function'
        ) {
          callback();
        }
      }, 1000);

    } catch (error) {
      console.error(
        'Error clicking Save:',
        error
      );

      submissionInProgress =
        false;

      hideOverlay();
    }
  }

  /* =========================================================
     FINAL SUMMARY
     ========================================================= */

  function displaySummary() {
    const summaryContent = `
      <div class="modal-body final-summary-body">

        <button
          id="closeButton"
          class="modal-button sd-icon-button"
          type="button"
        >
          ✕
        </button>

        <div class="sd-success-icon">
          ✓
        </div>

        <div class="sd-kicker">
          SUBMISSION COMPLETE
        </div>

        <h2>
          Chromebooks submitted
        </h2>

        <p class="sd-subtitle">
          Your Chromebook tickets have been
          submitted to SchoolDude.
        </p>

        <div class="sd-summary-grid">

          <div class="sd-summary-card">

            <span>
              School
            </span>

            <strong>
              ${selectedSchool || 'Not Selected'}
            </strong>

          </div>

          <div class="sd-summary-card">

            <span>
              Technician
            </span>

            <strong>
              ${selectedTechnician || 'Unknown'}
            </strong>

          </div>

          <div class="sd-summary-card">

            <span>
              Submitted
            </span>

            <strong>
              ${chromebookCount}
            </strong>

          </div>

        </div>

        <div class="final-summary-device-list">

          ${
            chromebooks
              .map(
                (
                  chromebook,
                  index
                ) => `
                <div class="final-device-card">

                  <div class="sd-device-number">
                    DEVICE ${index + 1}
                  </div>

                  <div>
                    <strong>
                      ${chromebook.districtTag}
                    </strong>
                  </div>

                  <div>
                    ${chromebook.serialNumber}
                  </div>

                  <div>
                    ${chromebook.modelNumber}
                  </div>

                </div>
              `
              )
              .join('')
          }

        </div>

        <div class="button-container">

          <button
            id="addMoreButton"
            class="modal-button sd-primary"
            type="button"
          >
            Add More Chromebooks
          </button>

        </div>

      </div>
    `;

    showModal(
      summaryContent,
      function () {}
    );

    const addMoreButton =
      document.getElementById(
        'addMoreButton'
      );

    if (
      addMoreButton
    ) {
      addMoreButton.addEventListener(
        'click',
        function () {
          chromebooks = [];

          chromebookCount = 0;

          selectedSchool = '';

          selectedTechnician = '';

          removeExistingModal();

          startProcess();
        }
      );
    }
  }

  /* =========================================================
     STYLES
     ========================================================= */

  function injectStyles() {
    const style =
      document.createElement(
        'style'
      );

    style.type =
      'text/css';

    style.innerHTML = `

      :root {
        --sd-blue: #2563eb;
        --sd-blue-dark: #1d4ed8;
        --sd-cyan: #38bdf8;
        --sd-text: #172033;
        --sd-muted: #697386;
        --sd-border: #e5e9f0;
        --sd-danger: #dc2626;
        --sd-success: #16a34a;
      }

      body.sd-modal-open {
        overflow: hidden !important;
      }

      .modal-background {
        position: fixed !important;
        inset: 0 !important;

        width: 100vw !important;
        height: 100vh !important;

        display: flex !important;

        justify-content:
          center !important;

        align-items:
          center !important;

        box-sizing:
          border-box !important;

        padding:
          24px !important;

        z-index:
          2147483000 !important;

        background:
          rgba(
            8,
            15,
            28,
            .42
          ) !important;

        -webkit-backdrop-filter:
          blur(16px)
          saturate(130%)
          !important;

        backdrop-filter:
          blur(16px)
          saturate(130%)
          !important;

        opacity: 0;

        transition:
          opacity
          .17s
          ease;
      }

      .modal-background.is-visible {
        opacity: 1;
      }

      .sd-modal {
        position:
          relative !important;

        width:
          min(
            570px,
            calc(
              100vw - 40px
            )
          ) !important;

        max-height:
          calc(
            100vh - 48px
          ) !important;

        overflow:
          hidden !important;

        padding:
          0 !important;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .75
          ) !important;

        border-radius:
          22px !important;

        background:
          rgba(
            255,
            255,
            255,
            .96
          ) !important;

        -webkit-backdrop-filter:
          blur(28px)
          saturate(140%)
          !important;

        backdrop-filter:
          blur(28px)
          saturate(140%)
          !important;

        box-shadow:
          0 32px 90px
          rgba(
            2,
            8,
            23,
            .32
          ),
          0 8px 25px
          rgba(
            2,
            8,
            23,
            .12
          ) !important;

        color:
          var(
            --sd-text
          ) !important;

        font-family:
          Inter,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          Roboto,
          Arial,
          sans-serif !important;

        transform:
          translateY(
            10px
          )
          scale(
            .985
          );

        opacity:
          0;

        transition:
          transform
          .2s
          cubic-bezier(
            .2,
            .8,
            .2,
            1
          ),
          opacity
          .16s
          ease;
      }

      .sd-modal.is-visible {
        transform:
          translateY(0)
          scale(1);

        opacity:
          1;
      }

      .sd-modal-accent {
        height:
          4px;

        background:
          linear-gradient(
            90deg,
            var(
              --sd-blue
            ),
            var(
              --sd-cyan
            )
          );
      }

      .modal-content {
        width:
          100%;
      }

      .modal-body {
        position:
          relative;

        box-sizing:
          border-box;

        padding:
          34px;

        text-align:
          left;
      }

      .sd-kicker {
        display:
          inline-flex;

        align-items:
          center;

        gap:
          8px;

        margin-bottom:
          10px;

        color:
          var(
            --sd-blue
          );

        font-size:
          11px;

        line-height:
          1;

        font-weight:
          800;

        letter-spacing:
          .13em;
      }

      .sd-kicker::before {
        content: "";

        width:
          7px;

        height:
          7px;

        border-radius:
          100%;

        background:
          var(
            --sd-blue
          );

        box-shadow:
          0 0 0 4px
          rgba(
            37,
            99,
            235,
            .10
          );
      }

      .modal-body h2 {
        margin:
          0
          50px
          8px
          0 !important;

        color:
          #0f172a !important;

        font-size:
          26px !important;

        line-height:
          1.2 !important;

        font-weight:
          750 !important;

        letter-spacing:
          -.025em !important;
      }

      .sd-subtitle {
        max-width:
          470px;

        margin:
          0
          0
          24px;

        color:
          var(
            --sd-muted
          );

        font-size:
          14px;

        line-height:
          1.55;
      }

      .sd-field-group {
        margin-top:
          18px;
      }

      .modal-body label {
        display:
          block;

        margin-bottom:
          7px;

        color:
          #344054;

        font-size:
          13px;

        font-weight:
          700;
      }

      .sd-helper {
        margin-top:
          6px;

        color:
          #8a94a6;

        font-size:
          11.5px;
      }

      .sd-current-count {
        margin-top:
          18px;

        padding:
          10px
          13px;

        border:
          1px solid
          #e7ecf3;

        border-radius:
          10px;

        background:
          #f8fafc;

        color:
          #64748b;

        font-size:
          12px;
      }

      .sd-current-count strong {
        color:
          var(
            --sd-blue
          );
      }

      .sd-input-shell {
        position:
          relative;
      }

      .sd-input-icon {
        position:
          absolute;

        left:
          14px;

        top:
          50%;

        z-index:
          2;

        transform:
          translateY(
            -50%
          );

        color:
          #64748b;

        pointer-events:
          none;
      }

      .sd-input-shell.is-readonly
      .sd-input-icon {
        color:
          #16a34a;
      }

      .modal-input,
      .modal-select {
        width:
          100% !important;

        min-height:
          46px !important;

        box-sizing:
          border-box !important;

        margin:
          0 !important;

        padding:
          11px
          14px !important;

        border:
          1px solid
          #dbe1ea !important;

        border-radius:
          12px !important;

        outline:
          none !important;

        background:
          rgba(
            255,
            255,
            255,
            .94
          ) !important;

        color:
          #172033 !important;

        font-family:
          inherit !important;

        font-size:
          14px !important;

        box-shadow:
          0 1px 2px
          rgba(
            15,
            23,
            42,
            .03
          ) !important;

        transition:
          border-color
          .15s
          ease,
          box-shadow
          .15s
          ease !important;
      }

      .sd-input-shell
      .modal-input,
      .sd-input-shell
      .modal-select {
        padding-left:
          40px !important;
      }

      .modal-input[readonly] {
        background:
          #f7f9fc !important;
      }

      .modal-input:focus,
      .modal-select:focus {
        border-color:
          rgba(
            37,
            99,
            235,
            .68
          ) !important;

        box-shadow:
          0 0 0 4px
          rgba(
            37,
            99,
            235,
            .10
          ) !important;
      }

      .button-container {
        display:
          flex;

        justify-content:
          flex-end;

        align-items:
          center;

        gap:
          10px;

        margin-top:
          24px;
      }

      .modal-button {
        min-height:
          42px;

        box-sizing:
          border-box;

        padding:
          10px
          17px;

        border:
          1px solid
          #dde3eb;

        border-radius:
          11px;

        background:
          #eef2f7;

        color:
          #334155;

        font-family:
          inherit;

        font-size:
          13px;

        font-weight:
          700;

        cursor:
          pointer;

        transition:
          transform
          .12s
          ease,
          background
          .15s
          ease,
          box-shadow
          .15s
          ease;
      }

      .modal-button:hover {
        transform:
          translateY(
            -1px
          );

        background:
          #e7edf5;
      }

      .modal-button.sd-primary {
        border-color:
          #1f58db !important;

        background:
          linear-gradient(
            135deg,
            #2f6df2,
            #1d4ed8
          ) !important;

        color:
          #fff !important;

        box-shadow:
          0 8px 18px
          rgba(
            37,
            99,
            235,
            .24
          ) !important;
      }

      .modal-button.sd-primary:hover {
        background:
          linear-gradient(
            135deg,
            #3676ff,
            #1947c7
          ) !important;

        box-shadow:
          0 10px 23px
          rgba(
            37,
            99,
            235,
            .30
          ) !important;
      }

      .sd-secondary-dark,
      #doneButton {
        border-color:
          #0f172a !important;

        background:
          #0f172a !important;

        color:
          #fff !important;
      }

      .sd-icon-button,
      #closeButton {
        position:
          absolute !important;

        top:
          22px !important;

        right:
          22px !important;

        z-index:
          100 !important;

        display:
          flex !important;

        align-items:
          center !important;

        justify-content:
          center !important;

        width:
          36px !important;

        height:
          36px !important;

        min-height:
          36px !important;

        padding:
          0 !important;

        border:
          1px solid
          #e2e8f0 !important;

        border-radius:
          10px !important;

        background:
          #f8fafc !important;

        color:
          #64748b !important;

        box-shadow:
          none !important;
      }

      .error-message {
        margin:
          0
          0
          18px;

        padding:
          12px
          14px;

        border:
          1px solid
          rgba(
            220,
            38,
            38,
            .18
          );

        border-radius:
          11px;

        background:
          #fef2f2;

        color:
          #b42318;

        font-size:
          12.5px;

        line-height:
          1.45;

        font-weight:
          650;
      }

      .sd-summary-grid {
        display:
          grid;

        grid-template-columns:
          repeat(
            3,
            minmax(
              0,
              1fr
            )
          );

        gap:
          10px;
      }

      .sd-summary-card {
        min-width:
          0;

        padding:
          13px
          14px;

        border:
          1px solid
          #e5e9f0;

        border-radius:
          12px;

        background:
          #f8fafc;
      }

      .sd-summary-card span {
        display:
          block;

        margin-bottom:
          4px;

        color:
          #8a94a6;

        font-size:
          10px;

        font-weight:
          800;

        letter-spacing:
          .07em;

        text-transform:
          uppercase;
      }

      .sd-summary-card strong {
        display:
          block;

        overflow:
          hidden;

        color:
          #172033;

        font-size:
          13px;

        white-space:
          nowrap;

        text-overflow:
          ellipsis;
      }

      /* =====================================================
         REVIEW SCREEN
         ===================================================== */

      .review-modal-body {
        display:
          flex !important;

        flex-direction:
          column !important;

        width:
          100%;

        height:
          min(
            700px,
            calc(
              100vh - 80px
            )
          );

        max-height:
          calc(
            100vh - 80px
          );

        box-sizing:
          border-box;

        padding:
          0 !important;

        overflow:
          hidden !important;
      }

      .review-header-section {
        flex:
          0 0 auto;

        position:
          relative;

        padding:
          32px
          34px
          20px;

        border-bottom:
          1px solid
          rgba(
            15,
            23,
            42,
            .06
          );
      }

      .review-list-wrapper {
        flex:
          1 1 auto;

        min-height:
          0;

        overflow:
          hidden;

        padding:
          0
          0
          0
          34px;
      }

      .review-device-list {
        height:
          100%;

        box-sizing:
          border-box;

        margin:
          0 !important;

        padding:
          16px
          26px
          16px
          0 !important;

        overflow-y:
          auto !important;

        overflow-x:
          hidden !important;

        list-style:
          none;

        scrollbar-width:
          thin;

        scrollbar-color:
          #cbd5e1
          transparent;
      }

      .review-device-list::-webkit-scrollbar {
        width:
          7px;
      }

      .review-device-list::-webkit-scrollbar-track {
        background:
          transparent;
      }

      .review-device-list::-webkit-scrollbar-thumb {
        border-radius:
          999px;

        background:
          #cbd5e1;
      }

      .chromebook-item {
        position:
          relative;

        box-sizing:
          border-box;

        margin:
          0
          0
          10px;

        padding:
          15px
          90px
          15px
          16px;

        border:
          1px solid
          #e5e9f0;

        border-radius:
          13px;

        background:
          linear-gradient(
            180deg,
            #fff,
            #fbfcfe
          );

        box-shadow:
          0 1px 2px
          rgba(
            15,
            23,
            42,
            .03
          );
      }

      .chromebook-item:hover {
        border-color:
          #d3dce8;
      }

      .sd-device-number {
        margin-bottom:
          9px;

        color:
          #2563eb;

        font-size:
          10px;

        font-weight:
          800;

        letter-spacing:
          .09em;
      }

      .device-detail-row {
        display:
          flex;

        gap:
          8px;

        margin-top:
          3px;

        font-size:
          12.5px;

        line-height:
          1.5;
      }

      .device-detail-row span {
        flex:
          0 0 82px;

        color:
          #8a94a6;
      }

      .device-detail-row strong {
        color:
          #334155;

        font-weight:
          700;

        word-break:
          break-word;
      }

      .button-group {
        position:
          absolute;

        top:
          12px;

        right:
          12px;

        display:
          flex;

        gap:
          6px;
      }

      .edit-button,
      .delete-button {
        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        width:
          31px;

        height:
          31px;

        padding:
          0;

        border-radius:
          9px;

        cursor:
          pointer;

        transition:
          background
          .14s
          ease,
          border-color
          .14s
          ease;
      }

      .edit-button {
        border:
          1px solid
          #dbe5ff;

        background:
          #eff5ff;

        color:
          #2563eb;
      }

      .edit-button:hover {
        background:
          #dfeaff;
      }

      .delete-button {
        border:
          1px solid
          #fee2e2;

        background:
          #fff1f2;

        color:
          #dc2626;
      }

      .delete-button:hover {
        background:
          #ffe4e6;
      }

      .review-action-bar {
        flex:
          0 0 auto !important;

        display:
          flex !important;

        align-items:
          center !important;

        justify-content:
          space-between !important;

        width:
          100% !important;

        box-sizing:
          border-box !important;

        gap:
          16px !important;

        margin:
          0 !important;

        padding:
          16px
          34px
          20px !important;

        border-top:
          1px solid
          rgba(
            15,
            23,
            42,
            .08
          );

        background:
          rgba(
            255,
            255,
            255,
            .99
          );

        box-shadow:
          0 -10px 30px
          rgba(
            15,
            23,
            42,
            .07
          );

        position:
          relative !important;

        z-index:
          50 !important;

        visibility:
          visible !important;

        opacity:
          1 !important;
      }

      .review-device-count {
        flex:
          0 0 auto;

        color:
          #64748b;

        font-size:
          12px;

        font-weight:
          600;
      }

      .review-device-count strong {
        color:
          #0f172a;

        font-size:
          14px;
      }

      .review-action-buttons {
        display:
          flex !important;

        align-items:
          center !important;

        justify-content:
          flex-end !important;

        gap:
          10px !important;

        visibility:
          visible !important;

        opacity:
          1 !important;
      }

      .review-action-buttons
      .modal-button {
        display:
          inline-flex !important;

        align-items:
          center !important;

        justify-content:
          center !important;

        visibility:
          visible !important;

        opacity:
          1 !important;

        position:
          relative !important;

        top:
          auto !important;

        bottom:
          auto !important;

        left:
          auto !important;

        right:
          auto !important;
      }

      /* =====================================================
         FINAL SUMMARY
         ===================================================== */

      .final-summary-body {
        max-height:
          calc(
            100vh - 80px
          );

        overflow-y:
          auto;
      }

      .sd-success-icon {
        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        width:
          52px;

        height:
          52px;

        margin-bottom:
          20px;

        border-radius:
          50%;

        background:
          #ecfdf3;

        color:
          #16a34a;

        font-size:
          26px;

        font-weight:
          900;

        box-shadow:
          0 0 0 7px
          rgba(
            22,
            163,
            74,
            .07
          );
      }

      .final-summary-device-list {
        max-height:
          280px;

        overflow-y:
          auto;

        margin-top:
          18px;

        padding-right:
          5px;
      }

      .final-device-card {
        margin-bottom:
          8px;

        padding:
          12px
          14px;

        border:
          1px solid
          #e5e9f0;

        border-radius:
          11px;

        background:
          #f8fafc;

        color:
          #64748b;

        font-size:
          12px;
      }

      /* =====================================================
         SUBMITTING OVERLAY
         ===================================================== */

      .overlay {
        position:
          fixed;

        inset:
          0;

        z-index:
          2147483001;

        display:
          flex;

        align-items:
          center;

        justify-content:
          center;

        padding:
          24px;

        background:
          rgba(
            8,
            15,
            28,
            .48
          );

        -webkit-backdrop-filter:
          blur(16px);

        backdrop-filter:
          blur(16px);
      }

      .overlay-message {
        width:
          min(
            420px,
            calc(
              100vw - 40px
            )
          );

        box-sizing:
          border-box;

        padding:
          28px;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .22
          );

        border-radius:
          18px;

        background:
          rgba(
            15,
            23,
            42,
            .92
          );

        color:
          #fff;

        text-align:
          center;

        box-shadow:
          0 30px 80px
          rgba(
            2,
            8,
            23,
            .40
          );
      }

      .sd-spinner {
        width:
          30px;

        height:
          30px;

        margin:
          0
          auto
          16px;

        border:
          3px solid
          rgba(
            255,
            255,
            255,
            .20
          );

        border-top-color:
          #fff;

        border-radius:
          50%;

        animation:
          sdSpin
          .8s
          linear
          infinite;
      }

      .sd-overlay-kicker {
        margin-bottom:
          7px;

        color:
          #93c5fd;

        font-size:
          10px;

        font-weight:
          900;

        letter-spacing:
          .12em;
      }

      .sd-overlay-title {
        color:
          #fff;

        font-size:
          18px;

        font-weight:
          750;
      }

      .sd-overlay-helper {
        margin-top:
          8px;

        color:
          #cbd5e1;

        font-size:
          12px;

        line-height:
          1.45;
      }

      @keyframes sdSpin {
        to {
          transform:
            rotate(
              360deg
            );
        }
      }

      /* =====================================================
         MOBILE / SMALL WINDOW
         ===================================================== */

      @media (
        max-width:
        620px
      ) {
        .modal-background {
          padding:
            12px !important;
        }

        .sd-modal {
          width:
            calc(
              100vw - 24px
            ) !important;

          max-height:
            calc(
              100vh - 24px
            ) !important;

          border-radius:
            18px !important;
        }

        .modal-body {
          padding:
            28px
            22px;
        }

        .modal-body h2 {
          font-size:
            22px !important;
        }

        .sd-summary-grid {
          grid-template-columns:
            1fr;
        }

        .review-modal-body {
          height:
            calc(
              100vh - 30px
            );

          max-height:
            calc(
              100vh - 30px
            );
        }

        .review-header-section {
          padding:
            26px
            22px
            16px;
        }

        .review-list-wrapper {
          padding-left:
            22px;
        }

        .review-device-list {
          padding-right:
            16px !important;
        }

        .review-action-bar {
          padding:
            14px
            22px
            18px !important;

          flex-direction:
            column !important;

          align-items:
            stretch !important;
        }

        .review-device-count {
          text-align:
            center;
        }

        .review-action-buttons {
          width:
            100%;
        }

        .review-action-buttons
        .modal-button {
          flex:
            1;
        }
      }

    `;

    document.head.appendChild(
      style
    );
  }

  injectStyles();

})();
