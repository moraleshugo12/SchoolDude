// ==UserScript==
// @name         Add Chromebooks Button with Submission Process
// @namespace    http://tampermonkey.net/
// @version      1.6.2
// @description  Adds the "Add Chromebooks" button and starts the submission process when clicked on SchoolDude pages.
// @author       You
// @match        *://*.schooldude.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  let addBtnScheduled = false;
  let addBtnInserted = false;

  // Function to create the "Add Chromebooks" button
  function createAddChromebooksButton() {
    const table = document.createElement('table');
    table.setAttribute('cellspacing', '0');
    table.setAttribute('role', 'presentation');
    table.id = 'AddChromebooksButton';
    table.className = 'x-btn x-component x-btn-noicon x-unselectable';
    table.style.cssText = 'margin-right: 5px; margin-left: 10px;';
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
          <button
            class="x-btn-text"
            type="button"
            style="position: relative; width: 150px;"
            tabindex="0"
          >
            Add Chromebooks
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
      console.log('"Add Chromebooks" button clicked!');
      injectChromebookSubmissionLogic();
    });

    return table;
  }

  function addButtonToSpecificFooter() {
    if (addBtnInserted) return;

    const footers = document.querySelectorAll('.x-panel-footer');

    for (const footer of footers) {
      const personalizationsButton =
        footer.querySelector('button#Personalizations');

      if (!personalizationsButton) continue;

      if (!footer.querySelector('#AddChromebooksButton')) {
        const toolbar = footer.querySelector('.x-toolbar-left-row');

        if (!toolbar) continue;

        const addChromebooksButton =
          createAddChromebooksButton();

        const addChromebooksCell =
          document.createElement('td');

        addChromebooksCell.className = 'x-toolbar-cell';
        addChromebooksCell.appendChild(addChromebooksButton);

        toolbar.appendChild(addChromebooksCell);

        console.log(
          '"Add Chromebooks" button added to the footer containing "Personalizations".'
        );

        addBtnInserted = true;

        if (observer) observer.disconnect();
        break;

      } else {

        addBtnInserted = true;

        if (observer) observer.disconnect();
        break;
      }
    }
  }

  const observer = new MutationObserver(() => {

    if (addBtnInserted) {
      observer.disconnect();
      return;
    }

    if (addBtnScheduled) return;

    addBtnScheduled = true;

    setTimeout(() => {
      addBtnScheduled = false;
      addButtonToSpecificFooter();
    }, 100);

  });

  window.addEventListener('load', () => {

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

  });

  observer.observe(
    document.body,
    {
      childList: true,
      subtree: true
    }
  );

  window.addEventListener(
    'load',
    addButtonToSpecificFooter
  );

  function injectChromebookSubmissionLogic() {

    console.log(
      'Starting the Chromebook submission process...'
    );

    startProcess();
  }

  var submissionInProgress = false;

  var schools = [
    'Dinuba High School',
    'Dinuba Intermediate School',
    'Grand view Elementary',
    'Kennedy Elementary',
    'Roosevelt Elementary',
    'Wilson Elementary',
    'Lincoln Elementary',
    'Washington Intermediate',
    'Sierra Vista',
    'Jefferson Elementary',
  ];

  var selectedSchool = '';
  var selectedTechnician = '';
  var chromebooks = [];
  var chromebookCount = 0;

  /*
   * =====================================================
   * PREMIUM MODAL SYSTEM
   * =====================================================
   */

  function showModal(content, callback) {

    document
      .querySelectorAll('.sd-modal-background')
      .forEach(el => el.remove());

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
    ].forEach(evt => {

      modal.addEventListener(
        evt,
        function (e) {
          e.stopPropagation();
        }
      );

    });

    modalBackground.appendChild(modal);

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

    const closeModal = (
      reload = false
    ) => {

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

        const active =
          document.activeElement;

        let valueToSubmit = null;

        if (
          active &&
          modal.contains(active) &&
          (
            active.tagName === 'INPUT' ||
            active.tagName === 'SELECT'
          )
        ) {

          valueToSubmit =
            active.value;

        } else {

          const firstInput =
            modal.querySelector(
              'input:not([readonly])'
            );

          const firstSelect =
            modal.querySelector(
              'select'
            );

          if (firstInput) {

            valueToSubmit =
              firstInput.value;

          } else if (firstSelect) {

            valueToSubmit =
              firstSelect.value;

          }

        }

        if (
          valueToSubmit !== null
        ) {

          event.preventDefault();

          callback(
            valueToSubmit
          );

          document.removeEventListener(
            'keydown',
            escHandler
          );

          closeModal(false);
        }

      }
    );

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

    const nextButton =
      modal.querySelector(
        '#nextButton'
      );

    if (nextButton) {

      nextButton.addEventListener(
        'click',
        function (e) {

          e.stopPropagation();

          const input =
            modal.querySelector(
              'input:not([readonly])'
            );

          const select =
            modal.querySelector(
              'select'
            );

          if (input) {

            callback(
              input.value
            );

          } else if (select) {

            callback(
              select.value
            );

          } else {

            callback();

          }

          document.removeEventListener(
            'keydown',
            escHandler
          );

          closeModal(false);

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
        function (e) {

          e.stopPropagation();

          document.removeEventListener(
            'keydown',
            escHandler
          );

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
        function (e) {

          e.stopPropagation();

          document.removeEventListener(
            'keydown',
            escHandler
          );

          closeModal(true);

        }
      );
    }
  }

  /*
   * =====================================================
   * TECHNICIAN
   * =====================================================
   */

  function extractTechnicianName() {

    const email =
      extractLoggedInUserEmail();

    if (!email) return null;

    const user =
      email.split('@')[0];

    const firstChunk =
      user.split('.')[0];

    return firstChunk;
  }

  /*
   * =====================================================
   * START
   * =====================================================
   */

  function startProcess() {

    const extractedTechnicianName =
      extractTechnicianName();

    if (
      extractedTechnicianName
    ) {

      selectedTechnician =
        extractedTechnicianName;

      console.log(
        `Technician assigned: ${selectedTechnician}`
      );

    } else {

      console.error(
        'No technician extracted. Defaulting to "Unknown Technician".'
      );

      selectedTechnician =
        'Unknown Technician';

    }

    var schoolOptions =
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
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
          >
            <path
              d="M6 6L18 18M6 18L18 6"
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
          Your technician account was detected
          automatically.
        </p>

        <div class="sd-field-group">

          <label for="school">
            School / Site
          </label>

          <div class="sd-input-shell">

            <span class="sd-input-icon">
              ⌂
            </span>

            <select
              id="school"
              class="modal-select"
            >
              ${schoolOptions}
            </select>

          </div>

        </div>

        <div class="sd-field-group">

          <label for="technician">
            Technician
          </label>

          <div
            class="sd-input-shell is-readonly"
          >

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
            Detected from your SchoolDude login
          </div>

        </div>

        <div class="button-container sd-actions">

          <button
            id="nextButton"
            class="modal-button sd-primary"
          >
            Continue
            <span aria-hidden="true">
              →
            </span>
          </button>

        </div>

      </div>
      `,
      function () {

        selectedSchool =
          document
            .getElementById('school')
            .value;

        selectedTechnician =
          document
            .getElementById('technician')
            .value;

        promptDistrictTag();

      }
    );
  }

  /*
   * =====================================================
   * DISTRICT TAG
   * =====================================================
   */

  function promptDistrictTag(
    errorMessage = ''
  ) {

    var doneButtonHtml =
      chromebookCount >= 1
        ? `
          <button
            id="doneButton"
            class="modal-button"
          >
            Done
          </button>
        `
        : '';

    var modalHtml = `
      <div class="modal-body">

        <button
          id="closeButton"
          class="modal-button sd-icon-button"
          aria-label="Close"
        >
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
          >
            <path
              d="M6 6L18 18M6 18L18 6"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <div class="sd-kicker">
          DEVICE ${chromebookCount + 1}
        </div>

        <h2>
          Scan district tag
        </h2>

        <p class="sd-subtitle">
          Scan or enter the district asset tag
          for the Chromebook.
        </p>

        ${
          errorMessage
            ? `
              <div
                id="errorMessage"
                class="error-message"
              >
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

        <div class="button-container">

          ${doneButtonHtml}

          <button
            id="nextButton"
            class="modal-button sd-primary"
          >
            Continue →
          </button>

        </div>

      </div>
    `;

    showModal(
      modalHtml,
      function (districtTag) {

        if (
          districtTag.trim() === ''
        ) {

          districtTag = 'N/A';

        } else if (
          districtTag.startsWith('0') &&
          districtTag.length < 9
        ) {

          promptSerialNumber(
            districtTag
          );

          return;

        } else {

          return promptDistrictTag(
            'District Tag must start with a "0" and be less than 9 characters.'
          );
        }

        promptSerialNumber(
          districtTag
        );

      }
    );
  }

  /*
   * =====================================================
   * SERIAL NUMBER
   * =====================================================
   */

  function promptSerialNumber(
    districtTag,
    errorMessage = ''
  ) {

    const errorMessageHtml =
      errorMessage
        ? `
          <div
            id="errorMessage"
            class="error-message"
          >
            ${errorMessage}
          </div>
        `
        : '';

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
          Scan or enter the Chromebook serial
          number. Leave it blank to skip.
        </p>

        ${errorMessageHtml}

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
            Supported serial numbers normally
            begin with N, M, or Y.
          </div>

        </div>

        <div class="button-container">

          <button
            id="nextButton"
            class="modal-button sd-primary"
          >
            Continue →
          </button>

        </div>

      </div>
      `,
      function (serialInput) {

        if (
          serialInput.trim() === ''
        ) {

          console.log(
            '[Serial] blank -> N/A, moving to model prompt'
          );

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

          const u =
            new URL(cleaned);

          cleaned =
            u.pathname
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

          console.log(
            '[Serial] accepted -> next prompt'
          );

          promptModelNumber(
            districtTag,
            cleaned
          );

        } else {

          console.warn(
            '[Serial] invalid prefix -> re-prompt'
          );

          promptSerialNumber(
            districtTag,
            'Serial number must start with N, M, or Y.'
          );

        }

      }
    );
  }

  /*
   * =====================================================
   * MODEL DETECTION
   * =====================================================
   */

  function determineModelNumber(
    serialNumber
  ) {

    if (!serialNumber) return '';

    const prefix4 =
      serialNumber
        .substring(0, 4)
        .toUpperCase();

    const prefix5 =
      serialNumber
        .substring(0, 5)
        .toUpperCase();

    const map5 = {
      'NXHPW': 'R752T',
      'NXGPZ': 'R751T',
      'NXA8Z': 'R753T',
      'NXH8V': 'C733',
      'NXH8Y': 'C851',
      'M2NXY': 'C204M',
      'M1NXV': 'C204M',
      'M2NXC': 'C204M'
    };

    const map4 = {
      'YX0B': 'Lenovo 300e Yoga'
    };

    return (
      map5[prefix5] ||
      map4[prefix4] ||
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

      chromebookCount++;

      promptDistrictTag();

    } else {

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
            This serial number did not match
            one of the models currently stored
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
            >
              Add Device →
            </button>

          </div>

        </div>
        `,
        function (modelNumber) {

          if (
            modelNumber.trim() === ''
          ) {

            promptModelNumber(
              districtTag,
              serialNumber
            );

          } else {

            chromebooks.push({
              districtTag,
              serialNumber,
              modelNumber:
                modelNumber.trim()
            });

            chromebookCount++;

            promptDistrictTag();

          }

        }
      );
    }
  }

  /*
   * =====================================================
   * REVIEW DEVICES
   * =====================================================
   */

  function displayCollectedInfo() {

    if (
      chromebookCount === 0
    ) {

      alert(
        'No Chromebooks To Submit.'
      );

      return;
    }

    var info = `
      <div
        class="modal-body ${
          chromebooks.length > 5
            ? 'scrollable'
            : ''
        }"
      >

        <button
          id="closeButton"
          class="modal-button sd-icon-button"
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
          Confirm the device information below
          before SchoolDude tickets are created.
        </p>

        <div class="sd-summary-grid">

          <div class="sd-summary-card">

            <span>
              School
            </span>

            <strong>
              ${selectedSchool}
            </strong>

          </div>

          <div class="sd-summary-card">

            <span>
              Technician
            </span>

            <strong>
              ${selectedTechnician}
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

        <ul>

          ${
            chromebooks
              .map(
                (
                  chromebook,
                  index
                ) => `
                  <li
                    class="chromebook-item"
                  >

                    <div
                      class="button-group"
                    >

                      <button
                        class="edit-button"
                        data-index="${index}"
                        title="Edit"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
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
                        title="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
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

                    <strong>
                      District Tag:
                    </strong>
                    ${chromebook.districtTag}

                    <br>

                    <strong>
                      Serial #:
                    </strong>
                    ${chromebook.serialNumber}

                    <br>

                    <strong>
                      Model:
                    </strong>
                    ${chromebook.modelNumber}

                  </li>
                `
              )
              .join('')
          }

        </ul>

        <div class="button-container">

          <button
            id="addButton"
            class="modal-button"
          >
            + Add More
          </button>

          <button
            id="nextButton"
            class="modal-button sd-primary"
          >
            Submit Tickets →
          </button>

        </div>

      </div>
    `;

    showModal(
      info,
      function () {}
    );

    document
      .getElementById('addButton')
      .addEventListener(
        'click',
        function () {

          const modal =
            document.querySelector(
              'div.modal'
            );

          if (
            modal &&
            modal.parentNode
          ) {

            modal.parentNode
              .removeChild(modal);
          }

          const modalBackground =
            document.querySelector(
              '.modal-background'
            );

          if (
            modalBackground
          ) {

            modalBackground
              .parentNode
              .removeChild(
                modalBackground
              );
          }

          promptDistrictTag();
        }
      );

    document
      .getElementById('closeButton')
      .addEventListener(
        'click',
        function () {

          const modal =
            document.querySelector(
              'div.modal'
            );

          if (
            modal &&
            modal.parentNode
          ) {

            modal.parentNode
              .removeChild(modal);
          }

          const modalBackground =
            document.querySelector(
              '.modal-background'
            );

          if (
            modalBackground
          ) {

            modalBackground
              .parentNode
              .removeChild(
                modalBackground
              );
          }

        }
      );

    var nextButton =
      document.getElementById(
        'nextButton'
      );

    if (nextButton) {

      nextButton.addEventListener(
        'click',
        function () {

          openNewTicketPage();

        }
      );
    }

    document
      .querySelectorAll(
        '.edit-button'
      )
      .forEach(
        button => {

          button.addEventListener(
            'click',
            function () {

              const index =
                this.getAttribute(
                  'data-index'
                );

              const modalBackground =
                document.querySelector(
                  '.modal-background'
                );

              if (
                modalBackground
              ) {

                modalBackground
                  .parentNode
                  .removeChild(
                    modalBackground
                  );
              }

              editChromebook(
                index
              );

            }
          );

        }
      );

    document
      .querySelectorAll(
        '.delete-button'
      )
      .forEach(
        button => {

          button.addEventListener(
            'click',
            function () {

              const index =
                this.getAttribute(
                  'data-index'
                );

              const modalBackground =
                document.querySelector(
                  '.modal-background'
                );

              if (
                modalBackground
              ) {

                modalBackground
                  .parentNode
                  .removeChild(
                    modalBackground
                  );
              }

              deleteChromebook(
                index
              );

            }
          );

        }
      );
  }

  /*
   * =====================================================
   * EDIT
   * =====================================================
   */

  function editChromebook(index) {

    const chromebook =
      chromebooks[index];

    var existingModal =
      document.querySelector(
        'div.modal'
      );

    if (
      existingModal &&
      existingModal.parentNode
    ) {

      existingModal.parentNode
        .removeChild(
          existingModal
        );
    }

    const editModalContent = `
      <div class="modal-body">

        <div class="sd-kicker">
          EDIT DEVICE
        </div>

        <h2>
          Edit Chromebook
        </h2>

        <p class="sd-subtitle">
          Update any of the device information
          below before submission.
        </p>

        <div class="sd-field-group">

          <label for="districtTag">
            District Tag
          </label>

          <input
            type="text"
            id="districtTag"
            value="${chromebook.districtTag}"
            class="modal-input"
          />

        </div>

        <div class="sd-field-group">

          <label for="serialNumber">
            Serial Number
          </label>

          <input
            type="text"
            id="serialNumber"
            value="${chromebook.serialNumber}"
            class="modal-input"
          />

        </div>

        <div class="sd-field-group">

          <label for="modelNumber">
            Model Number
          </label>

          <input
            type="text"
            id="modelNumber"
            value="${chromebook.modelNumber}"
            class="modal-input"
          />

        </div>

        <div class="button-container">

          <button
            id="cancelButton"
            class="modal-button"
          >
            Cancel
          </button>

          <button
            id="saveButton"
            class="modal-button sd-primary"
          >
            Save Changes
          </button>

        </div>

      </div>
    `;

    showModal(
      editModalContent,
      function () {}
    );

    document
      .getElementById(
        'saveButton'
      )
      .addEventListener(
        'click',
        function () {

          const updatedDistrictTag =
            document
              .getElementById(
                'districtTag'
              )
              .value;

          const updatedSerialNumber =
            document
              .getElementById(
                'serialNumber'
              )
              .value;

          const updatedModelNumber =
            document
              .getElementById(
                'modelNumber'
              )
              .value;

          chromebooks[index] = {

            districtTag:
              updatedDistrictTag,

            serialNumber:
              updatedSerialNumber,

            modelNumber:
              updatedModelNumber

          };

          var modalBackground =
            document.querySelector(
              '.modal-background'
            );

          if (
            modalBackground
          ) {

            modalBackground
              .parentNode
              .removeChild(
                modalBackground
              );
          }

          var modal =
            document.querySelector(
              'div.modal'
            );

          if (
            modal &&
            modal.parentNode
          ) {

            modal.parentNode
              .removeChild(modal);
          }

          displayCollectedInfo();
        }
      );

    document
      .getElementById(
        'cancelButton'
      )
      .addEventListener(
        'click',
        function () {

          var modalBackground =
            document.querySelector(
              '.modal-background'
            );

          if (
            modalBackground
          ) {

            modalBackground.remove();
          }

          displayCollectedInfo();

        }
      );
  }

  /*
   * =====================================================
   * DELETE
   * =====================================================
   */

  function deleteChromebook(index) {

    const confirmDelete =
      confirm(
        'Are you sure you want to delete this Chromebook?'
      );

    if (
      confirmDelete
    ) {

      chromebooks.splice(
        index,
        1
      );

      chromebookCount--;

      var modalBackground =
        document.querySelector(
          '.modal-background'
        );

      if (
        modalBackground
      ) {

        modalBackground
          .parentNode
          .removeChild(
            modalBackground
          );
      }

      displayCollectedInfo();
    }
  }

  /*
   * =====================================================
   * SCHOOL DUDE SUBMISSION
   * =====================================================
   */

  function openNewTicketPage() {

    var button =
      document.querySelector(
        'button#New'
      );

    if (button) {
      button.click();
    }

    setTimeout(
      function () {

        submitChromebooks(
          0,
          selectedSchool
        );

      },
      1000
    );
  }

  function submitChromebooks(
    index,
    selectedSchool
  ) {

    if (
      submissionInProgress
    ) {
      return;
    }

    const loggedInUserEmail =
      extractLoggedInUserEmail();

    console.log(
      loggedInUserEmail
    );

    if (
      !loggedInUserEmail
    ) {

      console.error(
        'Failed to extract logged-in user email. Aborting submission.'
      );

      return;
    }

    if (
      index <
      chromebooks.length
    ) {

      submissionInProgress =
        true;

      showOverlay(
        `Submitting Chromebook ${index + 1} of ${chromebooks.length}`
      );

      var chromebookData =
        chromebooks[index];

      console.log(
        chromebookData
      );

      fillOutFormFields(
        chromebookData,
        loggedInUserEmail,
        selectedSchool,
        function () {

          console.log(
            'Form fields filled for Chromebook ' +
            (index + 1)
          );

          submitForm(
            index,
            function () {

              console.log(
                'Form submitted for Chromebook ' +
                (index + 1)
              );

              if (
                index + 1 <
                chromebooks.length
              ) {

                setTimeout(
                  function () {

                    openNewTicketPage();

                    setTimeout(
                      function () {

                        submissionInProgress =
                          false;

                        submitChromebooks(
                          index + 1,
                          selectedSchool
                        );

                      },
                      1000
                    );

                  },
                  500
                );

              } else {

                console.log(
                  'All Chromebooks submitted. Showing final summary.'
                );

                displaySummary();

                hideOverlay();

                submissionInProgress =
                  false;

              }

            }
          );

        }
      );
    }
  }

  /*
   * =====================================================
   * SUBMISSION OVERLAY
   * =====================================================
   */

  function showOverlay(message) {

    hideOverlay();

    var overlay =
      document.createElement(
        'div'
      );

    overlay.className =
      'overlay';

    overlay.innerHTML = `
      <div class="overlay-message">

        <div class="sd-overlay-kicker">
          SCHOOLDUDE AUTOMATION
        </div>

        ${message}

        <div class="sd-overlay-helper">
          Please keep this window open while
          your tickets are created.
        </div>

      </div>
    `;

    document.body.appendChild(
      overlay
    );
  }

  function hideOverlay() {

    var overlay =
      document.querySelector(
        '.overlay'
      );

    if (overlay) {

      document.body.removeChild(
        overlay
      );
    }
  }

  /*
   * =====================================================
   * LOGGED IN EMAIL
   * =====================================================
   */

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

  /*
   * =====================================================
   * FILL SCHOOLDUDE FORM
   * =====================================================
   */

  function fillOutFormFields(
    chromebookData,
    loggedInUserEmail,
    selectedSchool,
    callback
  ) {

    if (
      !chromebookData ||
      !loggedInUserEmail ||
      !selectedSchool
    ) {

      console.error(
        'Missing required parameters for filling out the form.'
      );

      return;
    }

    function executeStepsSequentially(
      stepIndex
    ) {

      const steps = [

        () => {

          console.log(
            'Selecting "Assigned To" user...'
          );

          selectAssignedToUser();

          setTimeout(
            () =>
              executeStepsSequentially(
                stepIndex + 1
              ),
            500
          );

        },

        () => {

          console.log(
            'Selecting "Location" based on school...'
          );

          selectLocationBySchool(
            selectedSchool
          );

          setTimeout(
            () =>
              executeStepsSequentially(
                stepIndex + 1
              ),
            500
          );

        },

        () => {

          console.log(
            'Selecting "Work Queue" based on school...'
          );

          selectWorkQueueBySchool(
            selectedSchool
          );

          setTimeout(
            () =>
              executeStepsSequentially(
                stepIndex + 1
              ),
            500
          );

        },

        () => {

          console.log(
            'Selecting "Chromebook" as work type...'
          );

          selectWorkTypeAsChromebook();

          setTimeout(
            () =>
              executeStepsSequentially(
                stepIndex + 1
              ),
            500
          );

        },

        () => {

          console.log(
            'Filling out the text area with Chromebook data...'
          );

          const textareaElement =
            document.getElementById(
              'base_inc_incident_description'
            );

          if (
            !textareaElement
          ) {

            console.error(
              'Text area for description not found.'
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

          console.log(
            'Chromebook data entered:',
            desiredValue
          );

          if (
            typeof callback ===
            'function'
          ) {

            callback();
          }

        }

      ];

      if (
        stepIndex <
        steps.length
      ) {

        steps[
          stepIndex
        ]();

      }
    }

    executeStepsSequentially(
      0
    );
  }

  /*
   * =====================================================
   * ASSIGNED TO
   * =====================================================
   */

  function selectAssignedToUser() {

    const loggedInUserEmail =
      extractLoggedInUserEmail();

    if (
      !loggedInUserEmail
    ) {
      return;
    }

    const assignedToDropdownTrigger =
      document
        .getElementsByClassName(
          'x-form-trigger-arrow'
        )[2];

    if (
      !assignedToDropdownTrigger
    ) {

      console.error(
        '"Assigned To" dropdown trigger not found.'
      );

      return;
    }

    assignedToDropdownTrigger.click();

    setTimeout(
      () => {

        const dropdownContainer =
          document.getElementById(
            'base_inc_incident_assigned_to-combo-list'
          );

        if (
          !dropdownContainer
        ) {

          console.error(
            'Dropdown list container not found.'
          );

          return;
        }

        const dropdownOptions =
          Array.from(
            dropdownContainer
              .querySelectorAll(
                '.x-combo-list-item span[qtip]'
              )
          );

        if (
          dropdownOptions.length === 0
        ) {

          console.error(
            'No options found in the "Assigned To" dropdown menu.'
          );

          return;
        }

        const matchingOption =
          dropdownOptions.find(
            option =>
              option
                .getAttribute(
                  'qtip'
                )
                .trim()
                .toLowerCase()
                .includes(
                  loggedInUserEmail
                    .toLowerCase()
                )
          );

        if (
          matchingOption
        ) {

          const parentOption =
            matchingOption.closest(
              '.x-combo-list-item'
            );

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

          console.log(
            `Selected: ${matchingOption.getAttribute('qtip')}`
          );

        } else {

          console.warn(
            `No matching option found for email: ${loggedInUserEmail}`
          );

        }

      },
      500
    );
  }

  /*
   * =====================================================
   * LOCATION
   * =====================================================
   */

  function selectLocationBySchool(
    selectedSchool
  ) {

    const locationDropdownTrigger =
      document
        .getElementsByClassName(
          'x-form-trigger-arrow'
        )[5];

    if (
      !locationDropdownTrigger
    ) {

      console.error(
        '"Location" dropdown trigger not found.'
      );

      return;
    }

    locationDropdownTrigger.click();

    setTimeout(
      () => {

        const dropdownContainer =
          document.getElementById(
            'base_inc_incident_rte_location-combo-list'
          );

        if (
          !dropdownContainer
        ) {

          console.error(
            'Dropdown list container not found for "Location".'
          );

          return;
        }

        const dropdownOptions =
          Array.from(
            dropdownContainer
              .querySelectorAll(
                '.x-combo-list-item span[qtip]'
              )
          );

        if (
          dropdownOptions.length === 0
        ) {

          console.error(
            'No options found in the "Location" dropdown menu.'
          );

          return;
        }

        const matchingOption =
          dropdownOptions.find(
            option => {

              const optionName =
                option
                  .getAttribute(
                    'qtip'
                  )
                  .trim()
                  .toLowerCase();

              if (
                selectedSchool ===
                'Dinuba Intermediate School'
              ) {

                return optionName.includes(
                  'dinuba intermediate'
                );

              }

              if (
                selectedSchool ===
                'Dinuba High School'
              ) {

                return optionName.includes(
                  'dinuba high'
                );

              }

              return optionName.startsWith(
                selectedSchool
                  .split(' ')[0]
                  .toLowerCase()
              );

            }
          );

        if (
          matchingOption
        ) {

          const parentOption =
            matchingOption.closest(
              '.x-combo-list-item'
            );

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

          console.log(
            `Selected location: ${matchingOption.getAttribute('qtip')}`
          );

        } else {

          console.warn(
            `No matching location option found for the school: ${selectedSchool}`
          );

        }

      },
      500
    );
  }

  /*
   * =====================================================
   * WORK QUEUE
   * =====================================================
   */

  function selectWorkQueueBySchool(
    selectedSchool
  ) {

    const workQueueDropdownTrigger =
      document
        .getElementsByClassName(
          'x-form-trigger-arrow'
        )[3];

    if (
      !workQueueDropdownTrigger
    ) {

      console.error(
        '"Work Queue" dropdown trigger not found.'
      );

      return;
    }

    workQueueDropdownTrigger.click();

    setTimeout(
      () => {

        const dropdownContainer =
          document.getElementById(
            'base_inc_incident_work_queue-combo-list'
          );

        if (
          !dropdownContainer
        ) {

          console.error(
            'Dropdown list container not found for "Work Queue".'
          );

          return;
        }

        const dropdownOptions =
          Array.from(
            dropdownContainer
              .querySelectorAll(
                '.x-combo-list-item span[qtip]'
              )
          );

        if (
          dropdownOptions.length === 0
        ) {

          console.error(
            'No options found in the "Work Queue" dropdown menu.'
          );

          return;
        }

        const matchingOption =
          dropdownOptions.find(
            option => {

              const optionName =
                option
                  .getAttribute(
                    'qtip'
                  )
                  .trim()
                  .toLowerCase();

              if (
                selectedSchool ===
                'Dinuba Intermediate School'
              ) {

                return optionName.includes(
                  'dinuba intermediate'
                );

              }

              if (
                selectedSchool ===
                'Dinuba High School'
              ) {

                return optionName.includes(
                  'dinuba high'
                );

              }

              return optionName.startsWith(
                selectedSchool
                  .split(' ')[0]
                  .toLowerCase()
              );

            }
          );

        if (
          matchingOption
        ) {

          const parentOption =
            matchingOption.closest(
              '.x-combo-list-item'
            );

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

          console.log(
            `Selected work queue: ${matchingOption.getAttribute('qtip')}`
          );

        } else {

          console.warn(
            `No matching work queue option found for the school: ${selectedSchool}`
          );

        }

      },
      500
    );
  }

  /*
   * =====================================================
   * WORK TYPE
   * =====================================================
   */

  function selectWorkTypeAsChromebook() {

    const workTypeDropdownTrigger =
      document
        .getElementsByClassName(
          'x-form-trigger-arrow'
        )[4];

    if (
      !workTypeDropdownTrigger
    ) {

      console.error(
        '"Work Type" dropdown trigger not found.'
      );

      return;
    }

    workTypeDropdownTrigger.click();

    setTimeout(
      () => {

        const dropdownContainer =
          document.getElementById(
            'base_inc_incident_work_type-combo-list'
          );

        if (
          !dropdownContainer
        ) {

          console.error(
            'Dropdown list container not found for "Work Type".'
          );

          return;
        }

        const dropdownOptions =
          Array.from(
            dropdownContainer
              .querySelectorAll(
                '.x-combo-list-item span[qtip]'
              )
          );

        if (
          dropdownOptions.length === 0
        ) {

          console.error(
            'No options found in the "Work Type" dropdown menu.'
          );

          return;
        }

        const matchingOption =
          dropdownOptions.find(
            option =>
              option
                .getAttribute(
                  'qtip'
                )
                .trim()
                .toLowerCase() ===
              'chromebook'
          );

        if (
          matchingOption
        ) {

          const parentOption =
            matchingOption.closest(
              '.x-combo-list-item'
            );

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

          console.log(
            'Selected work type: Chromebook'
          );

        } else {

          console.warn(
            'No matching option found for "Chromebook".'
          );

        }

      },
      500
    );
  }

  /*
   * =====================================================
   * TEXT AREA
   * =====================================================
   */

  function triggerTextareaInput(
    textareaElement,
    value
  ) {

    var clickEvent =
      new MouseEvent(
        'click',
        {
          bubbles: true,
          clientX:
            textareaElement.offsetWidth -
            2,
          clientY:
            textareaElement.offsetHeight -
            2,
        }
      );

    textareaElement.dispatchEvent(
      clickEvent
    );

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
  }

  /*
   * =====================================================
   * SAVE
   * =====================================================
   */

  function submitForm(
    currentIndex,
    callback
  ) {

    var saveButton =
      document.getElementById(
        'Save'
      );

    if (
      saveButton
    ) {

      try {

        saveButton.click();

        console.log(
          'Form submitted for Chromebook ' +
          (currentIndex + 1)
        );

        setTimeout(
          function () {

            var errorLabel =
              Array.from(
                document
                  .querySelectorAll(
                    'span'
                  )
              )
              .find(
                span =>
                  span.textContent.includes(
                    'Error'
                  )
              );

            if (
              errorLabel
            ) {

              console.error(
                'Error detected: ' +
                errorLabel.textContent
              );

              localStorage.setItem(
                'currentIndex',
                currentIndex
              );

              location.reload();

            } else {

              if (
                typeof callback ===
                'function'
              ) {

                callback();
              }

            }

          },
          1000
        );

      } catch (error) {

        console.error(
          'Error clicking the "Save" button:',
          error
        );

      }

    } else {

      console.log(
        'Save button not found. Form not submitted.'
      );

    }
  }

  window.addEventListener(
    'load',
    function () {

      const storedIndex =
        localStorage.getItem(
          'currentIndex'
        );

      if (
        storedIndex
      ) {

        const index =
          parseInt(
            storedIndex,
            10
          );

        localStorage.removeItem(
          'currentIndex'
        );

        submitChromebooks(
          index,
          selectedSchool
        );
      }

    }
  );

  /*
   * =====================================================
   * FINAL SUMMARY
   * =====================================================
   */

  function displaySummary() {

    const summaryContent = `
      <div
        class="modal-body ${
          chromebooks.length > 5
            ? 'scrollable'
            : ''
        }"
      >

        <button
          id="closeButton"
          class="modal-button sd-icon-button"
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
          Your Chromebook tickets were
          successfully created in SchoolDude.
        </p>

        <div class="sd-summary-grid">

          <div class="sd-summary-card">

            <span>
              School
            </span>

            <strong>
              ${selectedSchool}
            </strong>

          </div>

          <div class="sd-summary-card">

            <span>
              Technician
            </span>

            <strong>
              ${selectedTechnician}
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

        <ul>

          ${
            chromebooks
              .map(
                chromebook => `
                  <li>

                    <strong>
                      District Tag:
                    </strong>
                    ${chromebook.districtTag}

                    <br>

                    <strong>
                      Serial #:
                    </strong>
                    ${chromebook.serialNumber}

                    <br>

                    <strong>
                      Model Number:
                    </strong>
                    ${chromebook.modelNumber}

                  </li>
                `
              )
              .join('')
          }

        </ul>

        <div class="button-container">

          <button
            id="addMoreButton"
            class="modal-button sd-primary"
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

    document
      .getElementById(
        'addMoreButton'
      )
      .addEventListener(
        'click',
        function () {

          const modal =
            document.querySelector(
              'div.modal'
            );

          if (
            modal &&
            modal.parentNode
          ) {

            modal.parentNode
              .removeChild(modal);
          }

          const modalBackground =
            document.querySelector(
              '.modal-background'
            );

          if (
            modalBackground
          ) {

            modalBackground
              .parentNode
              .removeChild(
                modalBackground
              );
          }

          chromebooks = [];
          chromebookCount = 0;

          selectedSchool = '';
          selectedTechnician = '';

          startProcess();
        }
      );

    document
      .getElementById(
        'closeButton'
      )
      .addEventListener(
        'click',
        function () {

          const modal =
            document.querySelector(
              'div.modal'
            );

          if (
            modal &&
            modal.parentNode
          ) {

            modal.parentNode
              .removeChild(modal);
          }

          const modalBackground =
            document.querySelector(
              '.modal-background'
            );

          if (
            modalBackground
          ) {

            modalBackground
              .parentNode
              .removeChild(
                modalBackground
              );
          }

        }
      );
  }

  /*
   * =====================================================
   * PREMIUM STYLES
   * =====================================================
   */

  function injectStyles() {

    const style =
      document.createElement(
        'style'
      );

    style.type =
      'text/css';

    style.innerHTML = `

      :root {

        --sd-navy:
          #0b1f3a;

        --sd-blue:
          #2563eb;

        --sd-blue-dark:
          #1d4ed8;

        --sd-cyan:
          #38bdf8;

        --sd-text:
          #172033;

        --sd-muted:
          #697386;

        --sd-border:
          rgba(
            15,
            23,
            42,
            .10
          );

        --sd-soft:
          #f6f8fb;

        --sd-danger:
          #dc2626;

        --sd-success:
          #16a34a;
      }

      body.sd-modal-open {

        overflow:
          hidden !important;

      }

      /*
       * ===============================================
       * BLURRED BACKDROP
       * ===============================================
       */

      .modal-background {

        position:
          fixed !important;

        inset:
          0 !important;

        width:
          100vw !important;

        height:
          100vh !important;

        display:
          flex !important;

        align-items:
          center !important;

        justify-content:
          center !important;

        padding:
          24px !important;

        box-sizing:
          border-box !important;

        z-index:
          2147483000 !important;

        background:
          rgba(
            10,
            18,
            32,
            .38
          ) !important;

        -webkit-backdrop-filter:
          blur(14px)
          saturate(130%)
          !important;

        backdrop-filter:
          blur(14px)
          saturate(130%)
          !important;

        opacity:
          0;

        transition:
          opacity
          .17s
          ease;
      }

      .modal-background.is-visible {

        opacity:
          1;

      }

      /*
       * ===============================================
       * MODAL
       * ===============================================
       */

      .sd-modal {

        width:
          min(
            560px,
            calc(
              100vw - 40px
            )
          ) !important;

        max-height:
          min(
            760px,
            calc(
              100vh - 48px
            )
          ) !important;

        overflow:
          hidden !important;

        position:
          relative !important;

        padding:
          0 !important;

        border-radius:
          22px !important;

        border:
          1px solid
          rgba(
            255,
            255,
            255,
            .72
          ) !important;

        background:
          rgba(
            255,
            255,
            255,
            .94
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
          0 32px 80px
          rgba(
            2,
            8,
            23,
            .28
          ),
          0 8px 24px
          rgba(
            2,
            8,
            23,
            .12
          ) !important;

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

        font-family:
          Inter,
          ui-sans-serif,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          Roboto,
          Arial,
          sans-serif !important;

        color:
          var(
            --sd-text
          ) !important;
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
          34px
          34px
          30px;

        text-align:
          left;

      }

      .modal-body.scrollable {

        max-height:
          min(
            690px,
            calc(
              100vh - 70px
            )
          );

        overflow-y:
          auto;

        scrollbar-width:
          thin;

      }

      /*
       * ===============================================
       * HEADINGS
       * ===============================================
       */

      .sd-kicker {

        display:
          inline-flex;

        align-items:
          center;

        gap:
          7px;

        margin-bottom:
          9px;

        font-size:
          11px;

        line-height:
          1;

        letter-spacing:
          .13em;

        font-weight:
          800;

        color:
          var(
            --sd-blue
          );

      }

      .sd-kicker::before {

        content:
          '';

        width:
          7px;

        height:
          7px;

        border-radius:
          999px;

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

        font-size:
          26px !important;

        line-height:
          1.2 !important;

        letter-spacing:
          -.025em !important;

        font-weight:
          750 !important;

        color:
          #0f172a !important;

      }

      .modal-body h3 {

        margin:
          18px
          0
          12px !important;

        font-size:
          16px !important;

        font-weight:
          700 !important;

        color:
          #334155 !important;

      }

      .sd-subtitle {

        margin:
          0
          0
          24px;

        max-width:
          470px;

        color:
          var(
            --sd-muted
          );

        font-size:
          14px;

        line-height:
          1.55;

      }

      /*
       * ===============================================
       * INPUTS
       * ===============================================
       */

      .sd-field-group {

        margin-top:
          18px;

      }

      .modal-body label {

        display:
          block;

        margin:
          0
          0
          7px;

        color:
          #344054;

        font-size:
          13px;

        line-height:
          1.3;

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

        transform:
          translateY(
            -50%
          );

        z-index:
          2;

        color:
          #64748b;

        font-size:
          13px;

        pointer-events:
          none;

      }

      .sd-input-shell.is-readonly
      .sd-input-icon {

        color:
          #16a34a;

        font-size:
          10px;

      }

      .modal-select,
      .modal-input {

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

        background:
          rgba(
            255,
            255,
            255,
            .92
          ) !important;

        color:
          #172033 !important;

        font:
          inherit !important;

        font-size:
          14px !important;

        outline:
          none !important;

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
          ease,
          background
          .15s
          ease !important;

      }

      .sd-input-shell
      .modal-select,

      .sd-input-shell
      .modal-input {

        padding-left:
          38px !important;

      }

      .modal-input[readonly] {

        background:
          #f7f9fc !important;

        color:
          #475569 !important;

      }

      .modal-select:focus,
      .modal-input:focus {

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

        background:
          #fff !important;

      }

      /*
       * ===============================================
       * BUTTONS
       * ===============================================
       */

      .button-container {

        display:
          flex;

        align-items:
          center;

        justify-content:
          flex-end;

        gap:
          10px;

        margin-top:
          24px;

      }

      .modal-button {

        min-height:
          42px;

        padding:
          10px
          17px;

        border:
          1px solid
          transparent;

        border-radius:
          11px;

        font-family:
          inherit;

        font-size:
          13px;

        font-weight:
          700;

        line-height:
          1;

        cursor:
          pointer;

        transition:
          transform
          .12s
          ease,
          box-shadow
          .15s
          ease,
          background
          .15s
          ease,
          border-color
          .15s
          ease;

      }

      .modal-button:hover {

        transform:
          translateY(
            -1px
          );

      }

      .modal-button:active {

        transform:
          translateY(0);

      }

      .modal-button:not(
        .sd-icon-button
      ) {

        background:
          #eef2f7;

        color:
          #334155;

        border-color:
          #dde3eb;

      }

      .modal-button:not(
        .sd-icon-button
      ):hover {

        background:
          #e7edf5;

      }

      .modal-button.sd-primary,
      #nextButton.modal-button {

        background:
          linear-gradient(
            135deg,
            var(
              --sd-blue
            ),
            #1e55d8
          ) !important;

        color:
          #fff !important;

        border-color:
          rgba(
            30,
            78,
            216,
            .55
          ) !important;

        box-shadow:
          0 8px 18px
          rgba(
            37,
            99,
            235,
            .22
          ) !important;

      }

      .modal-button.sd-primary:hover,
      #nextButton.modal-button:hover {

        background:
          linear-gradient(
            135deg,
            #2d6af0,
            var(
              --sd-blue-dark
            )
          ) !important;

        box-shadow:
          0 10px 22px
          rgba(
            37,
            99,
            235,
            .28
          ) !important;

      }

      #doneButton.modal-button,
      #addButton.modal-button,
      #addMoreButton.modal-button {

        background:
          #0f172a !important;

        color:
          #fff !important;

        border-color:
          #0f172a !important;

      }

      /*
       * ===============================================
       * CLOSE BUTTON
       * ===============================================
       */

      .sd-icon-button,
      #closeButton.modal-button {

        position:
          absolute !important;

        top:
          22px !important;

        right:
          22px !important;

        display:
          inline-flex !important;

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

        margin:
          0 !important;

        border:
          1px solid
          #e2e8f0 !important;

        border-radius:
          10px !important;

        background:
          rgba(
            248,
            250,
            252,
            .88
          ) !important;

        color:
          #64748b !important;

        box-shadow:
          none !important;

        z-index:
          4;

      }

      .sd-icon-button:hover,
      #closeButton.modal-button:hover {

        background:
          #fff !important;

        color:
          #0f172a !important;

        border-color:
          #cbd5e1 !important;

      }

      /*
       * ===============================================
       * ERRORS
       * ===============================================
       */

      .error-message {

        margin:
          0
          0
          16px;

        padding:
          11px
          13px;

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
          rgba(
            254,
            242,
            242,
            .92
          );

        color:
          #b42318;

        font-size:
          12.5px;

        line-height:
          1.45;

        font-weight:
          650;

      }

      /*
       * ===============================================
       * SUMMARY CARDS
       * ===============================================
       */

      .sd-summary-grid {

        display:
          grid;

        grid-template-columns:
          repeat(
            3,
            1fr
          );

        gap:
          10px;

        margin:
          18px
          0
          20px;

      }

      .sd-summary-card {

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

        color:
          #172033;

        font-size:
          13px;

        overflow:
          hidden;

        text-overflow:
          ellipsis;

        white-space:
          nowrap;

      }

      /*
       * ===============================================
       * DEVICE LIST
       * ===============================================
       */

      .modal-body ul {

        list-style:
          none;

        margin:
          14px
          0
          0;

        padding:
          0;

      }

      .modal-body ul li,
      .chromebook-item {

        position:
          relative;

        margin:
          0
          0
          10px;

        padding:
          15px
          92px
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

        color:
          #475569;

        font-size:
          13px;

        line-height:
          1.65;

        box-shadow:
          0 1px 2px
          rgba(
            15,
            23,
            42,
            .025
          );

      }

      .modal-body ul li:hover,
      .chromebook-item:hover {

        border-color:
          #d7dee8;

        background:
          #fff;

      }

      .modal-body strong {

        color:
          #1e293b;

        font-weight:
          700;

      }

      .sd-device-number {

        margin-bottom:
          7px;

        color:
          #2563eb;

        font-size:
          10px;

        font-weight:
          800;

        letter-spacing:
          .08em;

      }

      /*
       * ===============================================
       * EDIT / DELETE
       * ===============================================
       */

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
          inline-flex;

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
          all
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
          #e3eeff;

        border-color:
          #c4d7ff;

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

        border-color:
          #fecdd3;

      }

      /*
       * ===============================================
       * SUCCESS
       * ===============================================
       */

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
          18px;

        border-radius:
          50%;

        background:
          #ecfdf3;

        color:
          #16a34a;

        font-size:
          25px;

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

      /*
       * ===============================================
       * DISABLED
       * ===============================================
       */

      .disabled {

        opacity:
          .55;

        cursor:
          not-allowed !important;

        pointer-events:
          none;

      }

      /*
       * ===============================================
       * SUBMISSION OVERLAY
       * ===============================================
       */

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
            9,
            18,
            32,
            .44
          );

        -webkit-backdrop-filter:
          blur(14px)
          saturate(125%);

        backdrop-filter:
          blur(14px)
          saturate(125%);

        color:
          #fff;

      }

      .overlay-message {

        min-width:
          320px;

        max-width:
          520px;

        padding:
          24px
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
            .86
          );

        box-shadow:
          0 24px 70px
          rgba(
            2,
            8,
            23,
            .35
          );

        font-size:
          18px;

        line-height:
          1.4;

        font-weight:
          700;

        text-align:
          center;

      }

      .overlay-message::before {

        content:
          '';

        display:
          block;

        width:
          30px;

        height:
          30px;

        margin:
          0
          auto
          13px;

        border:
          3px solid
          rgba(
            255,
            255,
            255,
            .24
          );

        border-top-color:
          #fff;

        border-radius:
          999px;

        animation:
          sdSpin
          .8s
          linear
          infinite;

      }

      .sd-overlay-kicker {

        margin-bottom:
          8px;

        color:
          #93c5fd;

        font-size:
          10px;

        letter-spacing:
          .12em;

        font-weight:
          900;

      }

      .sd-overlay-helper {

        margin-top:
          8px;

        color:
          #cbd5e1;

        font-size:
          12px;

        font-weight:
          500;

      }

      @keyframes sdSpin {

        to {

          transform:
            rotate(
              360deg
            );

        }

      }

      /*
       * ===============================================
       * MOBILE
       * ===============================================
       */

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

          border-radius:
            18px !important;

        }

        .modal-body {

          padding:
            28px
            22px
            24px;

        }

        .modal-body h2 {

          font-size:
            22px !important;

        }

        #closeButton.modal-button {

          top:
            16px !important;

          right:
            16px !important;

        }

        .sd-summary-grid {

          grid-template-columns:
            1fr;

        }

      }

    `;

    document.head.appendChild(
      style
    );
  }

  injectStyles();

})();
