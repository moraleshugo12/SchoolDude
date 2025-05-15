// ==UserScript==
// @name         Add Chromebooks Button with Submission Process
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds the "Add Chromebooks" button and starts the submission process when clicked on SchoolDude pages.
// @author       You
// @match        *://*.schooldude.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // Function to create the "Add Chromebooks" button
    function createAddChromebooksButton() {
        const table = document.createElement('table');
        table.setAttribute('cellspacing', '0');
        table.setAttribute('role', 'presentation');
        table.id = 'AddChromebooksButton';
        table.className = 'x-btn x-component x-btn-noicon x-unselectable';
        table.style.cssText = 'margin-right: 5px; margin-left: 10px;'; // Added margin-left for spacing
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

        // Add a click event listener for the button
        table.addEventListener('click', () => {
            console.log('"Add Chromebooks" button clicked!');
            injectChromebookSubmissionLogic(); // Trigger the Chromebook submission process
        });

        return table;
    }

    // Function to add the button to the specific footer containing "Personalizations"
    function addButtonToSpecificFooter() {
        // Get all elements with the class "x-panel-footer"
        const footers = document.querySelectorAll('.x-panel-footer');

        footers.forEach((footer) => {
            // Check if the footer contains the "Personalizations" button
            const personalizationsButton = footer.querySelector('button#Personalizations');
            if (personalizationsButton) {
                // Ensure the "Add Chromebooks" button is not already added
                if (!footer.querySelector('#AddChromebooksButton')) {
                    const toolbar = footer.querySelector('.x-toolbar-left-row');
                    if (toolbar) {
                        // Create the "Add Chromebooks" button
                        const addChromebooksButton = createAddChromebooksButton();

                        // Add the button to the toolbar
                        const addChromebooksCell = document.createElement('td');
                        addChromebooksCell.className = 'x-toolbar-cell';
                        addChromebooksCell.appendChild(addChromebooksButton);

                        toolbar.appendChild(addChromebooksCell);

                        console.log('"Add Chromebooks" button added to the footer containing "Personalizations".');
                    }
                }
            }
        });
    }

    // Observe changes to the DOM to ensure dynamic content is handled
    const observer = new MutationObserver(() => {
        addButtonToSpecificFooter(); // Add the button whenever the DOM changes
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial attempt to add the button after the page is fully loaded
    window.addEventListener('load', addButtonToSpecificFooter);

    // Chromebook submission logic function
    function injectChromebookSubmissionLogic() {
        console.log('Starting the Chromebook submission process...');
        startProcess(); // Call your provided startProcess function
    }

    // Your Chromebook submission logic and styles are assumed to be already defined




var submissionInProgress = false; // Flag to prevent multiple submissions

var schools = [
    'Dinuba High School',
    'Grand view Elementary',
    'Kennedy Elementary',
    'Roosevelt Elementary',
    'Wilson Elementary',
    'Lincoln Elementary',
    'Washington Intermediate',
    'Sierra Vista',
    'Jefferson Elementary',
  ];

  // Variables to store user input
var selectedSchool = '';
var selectedTechnician = '';
var chromebooks = [];
var chromebookCount = 0;

function showModal(content, callback) {
    // Create modal background
    var modalBackground = document.createElement('div');
    modalBackground.className = 'modal-background';
    modalBackground.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 1000;
    `;

    // Create modal
    var modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.cssText = `
      background: white;
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      max-width: 500px;
      width: 90%;
      text-align: center;
    `;
    modal.innerHTML = `
      <div class="modal-content">
        ${content}
      </div>
    `;

    modalBackground.appendChild(modal);
    document.body.appendChild(modalBackground);

    // Close modal on background click
    modalBackground.addEventListener('click', function (event) {
      if (event.target === modalBackground) {
        document.body.removeChild(modalBackground);
      }
    });

    // Add keydown event listener for the Enter key
    modal.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        var input = modal.querySelector('input');
        var select = modal.querySelector('select');

        if (input) {
          callback(input.value);
          document.body.removeChild(modalBackground);
        } else if (select) {
          callback(select.value);
          document.body.removeChild(modalBackground);
        }
      }
    });

    // Existing input and button handling code
    var input = modal.querySelector('input');
    var select = modal.querySelector('select');
    if (input) {
      input.focus();
    }

    var nextButton = modal.querySelector('#nextButton');
    if (nextButton) {
      nextButton.addEventListener('click', function () {
        if (input) {
          callback(input.value);
        } else if (select) {
          callback(select.value);
        }
        document.body.removeChild(modalBackground);
      });
    }
    var doneButton = modal.querySelector('#doneButton');
    if (doneButton) {
      doneButton.addEventListener('click', function () {
        var modalBackground = document.querySelector('.modal-background');
        if (modalBackground) {
          modalBackground.parentNode.removeChild(modalBackground); // Safely remove the modal background
        }
        displayCollectedInfo();
      });
    }

    var closeButton = modal.querySelector('#closeButton');
    if (closeButton) {
      closeButton.addEventListener('click', function () {
        document.body.removeChild(modalBackground); // Close the modal
      });
    }
  }

  function extractTechnicianName() {
    // Get the element containing the logged-in user information
    const userElement = document.querySelector('.xtb-text span');

    if (userElement) {
        // Extract the email from the text content
        const emailText = userElement.textContent.trim();

        // Extract the part of the string that contains the email by splitting at the space and taking the last part
        const possibleEmail = emailText.split(' ').pop();

        // Get the part before the "@" symbol
        const namePart = possibleEmail.split('@')[0];

        // Split the name part by the period and join it with a space
        const fullName = namePart.split('.').join(' ');

        console.log(`Full Name: ${fullName}`);
        return fullName;
    }

    return null; // Return null if no user element is found
}



  function startProcess() {
    // Extract the technician name
    const extractedTechnicianName = extractTechnicianName();

    // Directly assign the extracted technician name to `selectedTechnician`
    if (extractedTechnicianName) {
      selectedTechnician = extractedTechnicianName;
      console.log(`Technician assigned: ${selectedTechnician}`);
    } else {
      console.error('No technician extracted. Defaulting to "Unknown Technician".');
      selectedTechnician = 'Unknown Technician';
    }

    // Create school options dropdown
    var schoolOptions = schools.map(school => `<option value="${school}">${school}</option>`).join('');

    // Show modal with the school selection and pre-filled technician name
    showModal(`
      <div class="modal-body">
    <h2>Set Up Chromebook Submission</h2>
    <label for="school">Select School:</label>
    <select id="school" class="modal-select">
      ${schools.map(school => `<option value="${school}">${school}</option>`).join('')}
    </select>
    <label for="technician">Technician:</label>
    <input id="technician" class="modal-input" value="${selectedTechnician}" readonly />
    <div class="button-container">
      <button id="nextButton" class="modal-button">Next</button>
      <button id="closeButton" class="modal-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg></button>
    </div>
  </div>
    `, function () {
      // Save the selected school and pre-filled technician
      selectedSchool = document.getElementById('school').value;
      selectedTechnician = document.getElementById('technician').value;
      promptDistrictTag();
    });
  }

  function promptDistrictTag(errorMessage = '') {
    var doneButtonHtml = chromebookCount >= 1 ? '<button id="doneButton" class="modal-button">Done</button>' : '';

    // Create the HTML for the modal
    var modalHtml = `
      <div class="modal-body">
        ${errorMessage ? `<div id="errorMessage" class="error-message">${errorMessage}</div>` : ''}
        <label for="districtTag">Enter District Tag:</label>
        <input type="text" id="districtTag" class="modal-input">
        ${doneButtonHtml}
      </div>
    `;

    showModal(modalHtml, function (districtTag) {
      // If the input is empty, set districtTag to 'N/A'
      if (districtTag.trim() === '') {
        districtTag = 'N/A'; // Set to N/A if no input
      } else if (districtTag.startsWith('0') && districtTag.length < 9) {
        // Validate the district tag
        promptSerialNumber(districtTag);
        return; // Exit after calling promptSerialNumber
      } else {
        // Prompt again with error message
        return promptDistrictTag('Error: District Tag must start with a "0" and be less than 9 characters');
      }

      // Proceed to the next step
      promptSerialNumber(districtTag);
    });
  }

  function promptSerialNumber(districtTag, errorMessage = '') {
    var errorMessageHtml = errorMessage ? `<div id="errorMessage" class="error-message">${errorMessage}</div>` : '';

    showModal(`
      <div class="modal-body">
        ${errorMessageHtml}
        <label for="serialNumber">Enter Serial # (leave blank to skip):</label>
        <input type="text" id="serialNumber" class="modal-input">
      </div>
    `, function (serialNumber) {
      // If the input is empty, set serialNumber to 'N/A'
      if (serialNumber.trim() === '') {
        serialNumber = 'N/A'; // Set to N/A if no input
      } else if (serialNumber.length > 12) {
        // Validate and process the serial number
        var urlParts = serialNumber.split('/');
        serialNumber = urlParts[urlParts.length - 1];
      } else {
        // Prompt again with error message if the serial number is incorrect
        return promptSerialNumber(districtTag, 'Error: Serial number is incorrect');
      }

      // Continue to the next step
      promptModelNumber(districtTag, serialNumber);
    });
  }


  // Function to determine model number based on serial number
  function determineModelNumber(serialNumber) {
    const modelMapping = {
      'NXHPW': 'R752T',
      'NXGPZ': 'R751T',
      'NXA8Z': 'R753T',
      'NXH8V': 'C733',
      'NXH8Y': 'C851',
      'M2NXY': 'C204M',
      'M1NXV': 'C204M',
      'M2NXC': 'C204M'
    };

    // Get the first 4 letters of the serial number
    const prefix = serialNumber.substring(0, 5);

    return modelMapping[prefix] || ''; // Return the corresponding model or an empty string
  }

  // Function to prompt for model number with auto-selection
  function promptModelNumber(districtTag, serialNumber) {
    // Determine the model number based on the serial number
    const autoSelectedModel = determineModelNumber(serialNumber);

    if (autoSelectedModel) {
      // If a model number is auto-selected, add it directly to the chromebooks array
      chromebooks.push({ districtTag, serialNumber, modelNumber: autoSelectedModel });
      chromebookCount++;
      // Only show the "Done" button in the district tag prompt after the first Chromebook
      if (chromebookCount === 1) {
        var doneButton = document.getElementById('doneButton');
        if (doneButton) {
          doneButton.style.display = 'inline';
        }
      }
      promptDistrictTag();
    } else {
      // Otherwise, prompt the user to manually enter the model number
      showModal(`
        <div class="modal-body">
          <label for="modelNumber">Enter Model Number:</label>
          <input type="text" id="modelNumber" class="modal-input" placeholder="Type Model Number">
        </div>
      `, function (modelNumber) {
        if (modelNumber.trim() === '') {
          // If the user hasn't entered a valid model number, prompt again
          promptModelNumber(districtTag, serialNumber);
        } else {
          chromebooks.push({ districtTag, serialNumber, modelNumber: modelNumber.trim() });
          chromebookCount++;
          // Only show the "Done" button in the district tag prompt after the first Chromebook
          if (chromebookCount === 1) {
            var doneButton = document.getElementById('doneButton');
            if (doneButton) {
              doneButton.style.display = 'inline';
            }
          }
          promptDistrictTag();
        }
      });
    }
  }


  function displayCollectedInfo() {
    // Check if there are any Chromebooks to display
    if (chromebookCount === 0) {
      alert("No Chromebooks To Submit."); // Notify the user
      return; // Exit the function
    }

    // Construct the modal content
    var info = `
    <div class="modal-body ${chromebooks.length > 5 ? 'scrollable' : ''}">
      <button id="closeButton" class="modal-button">✖</button>
    <h2>Collected Information</h2>
    <p><strong>School:</strong> ${selectedSchool}</p>
    <p><strong>Technician:</strong> ${selectedTechnician}</p>
    <h3>Total Chromebooks Submitted: ${chromebookCount}</h3>
    <ul>
      ${chromebooks.map((chromebook, index) => `
        <li class="chromebook-item">
          <div class="button-group">
            <button class="edit-button" data-index="${index}" title="Edit"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M3 21v-3.586l11.293-11.293 3.586 3.586L6.586 21H3z" />
        <path d="M18.207 7.293l-1.5-1.5 2.5-2.5a1 1 0 0 1 1.414 0l1.086 1.086a1 1 0 0 1 0 1.414l-2.5 2.5-1.5-1.5z" />
    </svg></button>
            <button class="delete-button" data-index="${index}" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
        <path fill="none" d="M0 0h24v24H0z"/>
        <path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM16.5 4l-1-1h-7l-1 1H5v2h14V4h-2.5z"/>
    </svg></button>
          </div>
          <strong>District Tag:</strong> ${chromebook.districtTag}<br>
          <strong>Serial #:</strong> ${chromebook.serialNumber}<br>
          <strong>Model Number:</strong> ${chromebook.modelNumber}
        </li>
      `).join('')}
    </ul>
    <div class="button-container">
      <button id="addButton" class="modal-button">Add More</button>
      <button id="nextButton" class="modal-button">Next</button>
    </div>
    </div>
  `;

    // Show the modal with collected information
    showModal(info, function () {
      // No additional actions needed here
    });

    // Add event listener for the "Add Chromebook" button
    document.getElementById('addButton').addEventListener('click', function () {
      // Close the modal and prompt for a new Chromebook
      const modal = document.querySelector('div.modal');
      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal); // Safely remove the modal
      }
      const modalBackground = document.querySelector('.modal-background');
      if (modalBackground) {
        modalBackground.parentNode.removeChild(modalBackground); // Safely remove the modal background
      }

      // Prompt the user to add a new Chromebook
      promptDistrictTag();
    });

    // Add event listener for the "Close" button
    document.getElementById('closeButton').addEventListener('click', function () {
      const modal = document.querySelector('div.modal');
      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal); // Safely remove the modal
      }
      const modalBackground = document.querySelector('.modal-background');
      if (modalBackground) {
        modalBackground.parentNode.removeChild(modalBackground); // Safely remove the modal background
      }
    });

    // Add event listener for the "Next" button
    var nextButton = document.getElementById('nextButton');
    if (nextButton) {
      nextButton.addEventListener('click', function () {
        openNewTicketPage(); // Call the function to open a new ticket page
      });
    }

    // Add event listeners for Edit buttons
    document.querySelectorAll('.edit-button').forEach(button => {
      button.addEventListener('click', function () {
        const index = this.getAttribute('data-index');
        const modalBackground = document.querySelector('.modal-background');
        if (modalBackground) {
          modalBackground.parentNode.removeChild(modalBackground); // Safely remove the modal background
        }
        editChromebook(index); // Call a function to edit the Chromebook
      });
    });

    // Add event listeners for Delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
      button.addEventListener('click', function () {
        const index = this.getAttribute('data-index');
        const modalBackground = document.querySelector('.modal-background');
        if (modalBackground) {
          modalBackground.parentNode.removeChild(modalBackground); // Safely remove the modal background
        }
        deleteChromebook(index); // Call a function to delete the Chromebook
      });
    });
  }

  function editChromebook(index) {
    const chromebook = chromebooks[index];

    // Close any existing modal before opening the edit modal
    var existingModal = document.querySelector('div.modal');
    if (existingModal && existingModal.parentNode) {
      existingModal.parentNode.removeChild(existingModal); // Safely remove the existing modal
    }

    // Create a modal for editing
    const editModalContent = `
      <div class="modal-body">
        <h2>Edit Chromebook Details</h2>
        <label for="districtTag">District Tag:</label>
        <input type="text" id="districtTag" value="${chromebook.districtTag}" class="modal-input">

        <label for="serialNumber">Serial #:</label>
        <input type="text" id="serialNumber" value="${chromebook.serialNumber}" class="modal-input">

        <label for="modelNumber">Model Number:</label>
        <input type="text" id="modelNumber" value="${chromebook.modelNumber}" class="modal-input">

        <button id="saveButton" class="modal-button">Save</button>
        <button id="cancelButton" class="modal-button">Cancel</button>
      </div>
    `;

    // Show the edit modal
    showModal(editModalContent, function () {
      // No additional actions needed here
    });

    // Add event listener for the save button
    document.getElementById('saveButton').addEventListener('click', function () {
      // Get the updated values from the input fields
      const updatedDistrictTag = document.getElementById('districtTag').value;
      const updatedSerialNumber = document.getElementById('serialNumber').value;
      const updatedModelNumber = document.getElementById('modelNumber').value;

      // Update the Chromebook details
      chromebooks[index] = {
        districtTag: updatedDistrictTag,
        serialNumber: updatedSerialNumber,
        modelNumber: updatedModelNumber
      };
       // Close the edit modal
      var modalBackground = document.querySelector('.modal-background');
      if (modalBackground) {
        // Safely remove the modal and the background
        modalBackground.parentNode.removeChild(modalBackground);
      }

      // Close the edit modal
      var modal = document.querySelector('div.modal');
      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal); // Safely remove the modal
      }



      // Refresh the collected information display
      displayCollectedInfo();
    });

    // Add event listener for the cancel button
    document.getElementById('cancelButton').addEventListener('click', function () {
      var modal = document.querySelector('div.modal');
      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal); // Safely remove the modal
      }


    });
  }



  function deleteChromebook(index) {
    // Confirm deletion
    const confirmDelete = confirm('Are you sure you want to delete this Chromebook?');
    if (confirmDelete) {
      // Remove the chromebook from the array
      chromebooks.splice(index, 1);
      chromebookCount--; // Decrement the count

      // Close the modal background
      var modalBackground = document.querySelector('.modal-background');
      if (modalBackground) {
        modalBackground.parentNode.removeChild(modalBackground); // Safely remove the modal background
      }

      // Refresh and show the updated displayed information
      displayCollectedInfo();
    }
  }

// Function to open the new ticket page and trigger additional actions
function openNewTicketPage() {
    var button = document.querySelector('button#New');
    if (button) {
      button.click();
    }

    setTimeout(function () {
      submitChromebooks(0, selectedSchool);
    }, 1000); // Adjust the delay as needed
  }


  function submitChromebooks(index, selectedSchool) {
    if (submissionInProgress) return; // Prevent concurrent submissions

    // Extract the logged-in user's email
    const loggedInUserEmail = extractLoggedInUserEmail();
    console.log(loggedInUserEmail)
    if (!loggedInUserEmail) {
      console.error('Failed to extract logged-in user email. Aborting submission.');
      return;
    }

    if (index < chromebooks.length) {
      submissionInProgress = true; // Set flag to true when starting a submission

      // Show overlay during submission with a dynamic message
      showOverlay(`Submitting Chromebook ${index + 1} of ${chromebooks.length}`);

      var chromebookData = chromebooks[index];
      console.log(chromebookData);
      fillOutFormFields(chromebookData, loggedInUserEmail, selectedSchool, function () {
        console.log('Form fields filled for Chromebook ' + (index + 1));
        submitForm(index, function () {
          console.log('Form submitted for Chromebook ' + (index + 1));

          if (index + 1 < chromebooks.length) {
            setTimeout(function () {
              openNewTicketPage();
              // Proceed to submit the next Chromebook after opening a new ticket
              setTimeout(function () {
                submissionInProgress = false; // Reset the flag
                submitChromebooks(index + 1, selectedSchool);
              }, 1000); // Adjust delay if needed
            }, 500); // Adjust delay if needed
          } else {
            console.log('All Chromebooks submitted. Showing final summary.');
            displaySummary(); // Show the collected information summary
            hideOverlay(); // Hide overlay when done
            submissionInProgress = false; // Reset the flag when done
          }
        });
      });
    }
  }
  function showOverlay(message) {
    // Remove existing overlay if it exists
    hideOverlay();

    // Create overlay element
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = `<div class="overlay-message">${message}</div>`;

    // Append overlay to body
    document.body.appendChild(overlay);
  }

  function hideOverlay() {
    var overlay = document.querySelector('.overlay');
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }

  // Function to extract the logged-in user's email
function extractLoggedInUserEmail() {
    // Locate the element containing the user's email
    const userElement = document.querySelector('.xtb-text span'); // Adjust the selector based on your DOM structure
    if (userElement) {
      const emailText = userElement.textContent.trim(); // Get the full text
      const emailMatch = emailText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/); // Regex to extract email
      if (emailMatch) {
        const email = emailMatch[0]; // Extracted email
        console.log('Logged-in user email:', email);
        return email;
      } else {
        console.error('No email found in the text:', emailText);
      }
    } else {
      console.error('Logged-in user email element not found.');
    }
    return null;
  }

  function fillOutFormFields(chromebookData, loggedInUserEmail, selectedSchool, callback) {
    if (!chromebookData || !loggedInUserEmail || !selectedSchool) {
      console.error('Missing required parameters for filling out the form.');
      return;
    }

    function executeStepsSequentially(stepIndex) {
      const steps = [
        // Step 1: Select the "Assigned To" user
        () => {
          console.log('Selecting "Assigned To" user...');
          selectAssignedToUser();
          setTimeout(() => executeStepsSequentially(stepIndex + 1), 500);
        },

        // Step 2: Select the "Location" based on school
        () => {
          console.log('Selecting "Location" based on school...');
          selectLocationBySchool(selectedSchool);
          setTimeout(() => executeStepsSequentially(stepIndex + 1), 500);
        },

        // Step 3: Select the "Work Queue" based on school
        () => {
          console.log('Selecting "Work Queue" based on school...');
          selectWorkQueueBySchool(selectedSchool);
          setTimeout(() => executeStepsSequentially(stepIndex + 1), 500);
        },

        // Step 4: Always select "Chromebook" as the work type
        () => {
          console.log('Selecting "Chromebook" as work type...');
          selectWorkTypeAsChromebook();
          setTimeout(() => executeStepsSequentially(stepIndex + 1), 500);
        },

        // Step 5: Fill out the text area with Chromebook data
        () => {
          console.log('Filling out the text area with Chromebook data...');
          const textareaElement = document.getElementById('base_inc_incident_description');
          if (!textareaElement) {
            console.error('Text area for description not found.');
            return;
          }

          // Format the Chromebook data and set the value
          const desiredValue = `District Tag: ${chromebookData.districtTag} || \nSerial #: ${chromebookData.serialNumber} || \nModel Number: ${chromebookData.modelNumber}`;
          triggerTextareaInput(textareaElement, desiredValue);

          console.log('Chromebook data entered:', desiredValue);

          // Run the callback function if provided
          if (typeof callback === 'function') {
            callback();
          }
        },
      ];

      // Execute the current step
      if (stepIndex < steps.length) {
        steps[stepIndex]();
      }
    }

    // Start executing the steps sequentially from step 0
    executeStepsSequentially(0);
  }


  // Function to find and select the logged-in user in the dropdown
function selectAssignedToUser() {
    // Step 1: Extract the logged-in user's email
    const loggedInUserEmail = extractLoggedInUserEmail();
    if (!loggedInUserEmail) return;

    // Step 2: Locate the "Assigned To" dropdown menu trigger
    const assignedToDropdownTrigger = document.getElementsByClassName('x-form-trigger-arrow')[2]; // Adjust index if needed
    if (!assignedToDropdownTrigger) {
      console.error('"Assigned To" dropdown trigger not found.');
      return;
    }

    // Step 3: Open the dropdown menu
    assignedToDropdownTrigger.click();

    // Step 4: Wait for the dropdown options to render and match the email
    setTimeout(() => {
      const dropdownContainer = document.getElementById('base_inc_incident_assigned_to-combo-list'); // Adjust ID if necessary
      if (!dropdownContainer) {
        console.error('Dropdown list container not found.');
        return;
      }

      // Get all dropdown options
      const dropdownOptions = Array.from(dropdownContainer.querySelectorAll('.x-combo-list-item span[qtip]'));

      if (dropdownOptions.length === 0) {
        console.error('No options found in the "Assigned To" dropdown menu.');
        return;
      }

      // Step 5: Find the matching option
      const matchingOption = dropdownOptions.find(option =>
        option.getAttribute('qtip').trim().toLowerCase().includes(loggedInUserEmail.toLowerCase())
      );

      if (matchingOption) {
        // Step 6: Select the matching option
        const parentOption = matchingOption.closest('.x-combo-list-item');

        // Simulate events to ensure proper selection
        parentOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        parentOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        parentOption.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        console.log(`Selected: ${matchingOption.getAttribute('qtip')}`);
      } else {
        console.warn(`No matching option found for email: ${loggedInUserEmail}`);
      }
    }, 500); // Adjust delay to match your dropdown rendering time
  }

  // Function to find and select the location in the dropdown based on the first word of the school name
function selectLocationBySchool(selectedSchool) {
    // Step 1: Extract the first word from the selectedSchool name
    const firstWord = selectedSchool.split(' ')[0];

    // Step 2: Locate the "Location" dropdown menu trigger
    const locationDropdownTrigger = document.getElementsByClassName('x-form-trigger-arrow')[5]; // Adjust to the correct index
    if (!locationDropdownTrigger) {
      console.error('"Location" dropdown trigger not found.');
      return;
    }

    // Step 3: Open the dropdown menu
    locationDropdownTrigger.click();

    // Step 4: Wait for the dropdown options to render and match the first word
    setTimeout(() => {
      const dropdownContainer = document.getElementById('base_inc_incident_rte_location-combo-list'); // Adjust ID if necessary
      if (!dropdownContainer) {
        console.error('Dropdown list container not found for "Location".');
        return;
      }

      // Get all dropdown options
      const dropdownOptions = Array.from(dropdownContainer.querySelectorAll('.x-combo-list-item span[qtip]'));

      if (dropdownOptions.length === 0) {
        console.error('No options found in the "Location" dropdown menu.');
        return;
      }

      // Step 5: Find the matching option based on the first word
      const matchingOption = dropdownOptions.find(option =>
        option.getAttribute('qtip').trim().toLowerCase().startsWith(firstWord.toLowerCase())
      );

      if (matchingOption) {
        // Step 6: Select the matching option
        const parentOption = matchingOption.closest('.x-combo-list-item');

        // Simulate events to ensure proper selection
        parentOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        parentOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        parentOption.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        console.log(`Selected location: ${matchingOption.getAttribute('qtip')}`);
      } else {
        console.warn(`No matching location option found for the school: ${selectedSchool}`);
      }
    }, 500); // Adjust delay to match your dropdown rendering time
  }
   // Function to find and select the location in the dropdown based on the first word of the school name
function selectWorkQueueBySchool(selectedSchool) {
    // Step 1: Extract the first word from the selectedSchool name
    const firstWord = selectedSchool.split(' ')[0];

    // Step 2: Locate the "Location" dropdown menu trigger
    const locationDropdownTrigger = document.getElementsByClassName('x-form-trigger-arrow')[3]; // Adjust to the correct index
    if (!locationDropdownTrigger) {
      console.error('"Location" dropdown trigger not found.');
      return;
    }

    // Step 3: Open the dropdown menu
    locationDropdownTrigger.click();

    // Step 4: Wait for the dropdown options to render and match the first word
    setTimeout(() => {
      const dropdownContainer = document.getElementById('base_inc_incident_rte_location-combo-list'); // Adjust ID if necessary
      if (!dropdownContainer) {
        console.error('Dropdown list container not found for "Location".');
        return;
      }

      // Get all dropdown options
      const dropdownOptions = Array.from(dropdownContainer.querySelectorAll('.x-combo-list-item span[qtip]'));

      if (dropdownOptions.length === 0) {
        console.error('No options found in the "Location" dropdown menu.');
        return;
      }

      // Step 5: Find the matching option based on the first word
      const matchingOption = dropdownOptions.find(option =>
        option.getAttribute('qtip').trim().toLowerCase().startsWith(firstWord.toLowerCase())
      );

      if (matchingOption) {
        // Step 6: Select the matching option
        const parentOption = matchingOption.closest('.x-combo-list-item');

        // Simulate events to ensure proper selection
        parentOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        parentOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        parentOption.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        console.log(`Selected location: ${matchingOption.getAttribute('qtip')}`);
      } else {
        console.warn(`No matching location option found for the school: ${selectedSchool}`);
      }
    }, 500); // Adjust delay to match your dropdown rendering time
  }

  // Function to find and select the work queue in the dropdown based on the first word of the school name
function selectWorkQueueBySchool(selectedSchool) {
    // Step 1: Extract the first word from the selectedSchool name
    const firstWord = selectedSchool.split(' ')[0];

    // Step 2: Locate the "Work Queue" dropdown menu trigger
    const workQueueDropdownTrigger = document.getElementsByClassName('x-form-trigger-arrow')[3]; // Adjust to the correct index
    if (!workQueueDropdownTrigger) {
      console.error('"Work Queue" dropdown trigger not found.');
      return;
    }

    // Step 3: Open the dropdown menu
    workQueueDropdownTrigger.click();

    // Step 4: Wait for the dropdown options to render and match the first word
    setTimeout(() => {
      const dropdownContainer = document.getElementById('base_inc_incident_work_queue-combo-list'); // Adjust ID if necessary
      if (!dropdownContainer) {
        console.error('Dropdown list container not found for "Work Queue".');
        return;
      }

      // Get all dropdown options
      const dropdownOptions = Array.from(dropdownContainer.querySelectorAll('.x-combo-list-item span[qtip]'));

      if (dropdownOptions.length === 0) {
        console.error('No options found in the "Work Queue" dropdown menu.');
        return;
      }

      // Step 5: Find the matching option based on the first word
      const matchingOption = dropdownOptions.find(option =>
        option.getAttribute('qtip').trim().toLowerCase().startsWith(firstWord.toLowerCase())
      );

      if (matchingOption) {
        // Step 6: Select the matching option
        const parentOption = matchingOption.closest('.x-combo-list-item');

        // Simulate events to ensure proper selection
        parentOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        parentOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        parentOption.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        console.log(`Selected work queue: ${matchingOption.getAttribute('qtip')}`);
      } else {
        console.warn(`No matching work queue option found for the school: ${selectedSchool}`);
      }
    }, 500); // Adjust delay to match your dropdown rendering time
  }

  // Function to always select "Chromebook" as the work type in the dropdown
function selectWorkTypeAsChromebook() {
    // Step 1: Locate the "Work Type" dropdown menu trigger
    const workTypeDropdownTrigger = document.getElementsByClassName('x-form-trigger-arrow')[4]; // Adjust index if necessary
    if (!workTypeDropdownTrigger) {
      console.error('"Work Type" dropdown trigger not found.');
      return;
    }

    // Step 2: Open the dropdown menu
    workTypeDropdownTrigger.click();

    // Step 3: Wait for the dropdown options to render
    setTimeout(() => {
      const dropdownContainer = document.getElementById('base_inc_incident_work_type-combo-list'); // Adjust ID if necessary
      if (!dropdownContainer) {
        console.error('Dropdown list container not found for "Work Type".');
        return;
      }

      // Get all dropdown options
      const dropdownOptions = Array.from(dropdownContainer.querySelectorAll('.x-combo-list-item span[qtip]'));

      if (dropdownOptions.length === 0) {
        console.error('No options found in the "Work Type" dropdown menu.');
        return;
      }

      // Step 4: Find the "Chromebook" option
      const matchingOption = dropdownOptions.find(option =>
        option.getAttribute('qtip').trim().toLowerCase() === 'chromebook'
      );

      if (matchingOption) {
        // Step 5: Select the "Chromebook" option
        const parentOption = matchingOption.closest('.x-combo-list-item');

        // Simulate events to ensure proper selection
        parentOption.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
        parentOption.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
        parentOption.dispatchEvent(new MouseEvent('click', { bubbles: true }));

        console.log('Selected work type: Chromebook');
      } else {
        console.warn('No matching option found for "Chromebook".');
      }
    }, 500); // Adjust delay to match your dropdown rendering time
  }


  // Function to trigger textarea input
function triggerTextareaInput(textareaElement, value) {
    var clickEvent = new MouseEvent('click', {
      bubbles: true,
      clientX: textareaElement.offsetWidth - 2,
      clientY: textareaElement.offsetHeight - 2,
    });
    textareaElement.dispatchEvent(clickEvent);

    textareaElement.value = value;
    textareaElement.dispatchEvent(new Event('input', { bubbles: true }));
    textareaElement.dispatchEvent(new Event('change', { bubbles: true }));
  }



  function submitForm(currentIndex, callback) {
    var saveButton = document.getElementById('Save');
    if (saveButton) {
      try {
        saveButton.click();
        console.log('Form submitted for Chromebook ' + (currentIndex + 1));

        // Check for error message after a short delay
        setTimeout(function () {
          var errorLabel = Array.from(document.querySelectorAll('span')).find(span => span.textContent.includes('Error'));

          if (errorLabel) {
            console.error('Error detected: ' + errorLabel.textContent);

            // Store the current index in local storage before refreshing
            localStorage.setItem('currentIndex', currentIndex);

            // Refresh the page
            location.reload();
          } else {
            // If no error, proceed with the callback
            if (typeof callback === 'function') {
              callback();
            }
          }
        }, 1000); // Initial delay to check for errors
      } catch (error) {
        console.error('Error clicking the "Save" button:', error);
      }
    } else {
      console.log('Save button not found. Form not submitted.');
    }
  }

  window.onload = function() {
    const storedIndex = localStorage.getItem('currentIndex');
    if (storedIndex) {
      const index = parseInt(storedIndex, 10);
      localStorage.removeItem('currentIndex'); // Clear the stored index
      submitChromebooks(index, selectedTechnician, selectedSchool); // Resume submission
    }
  };


  function displaySummary() {
    const summaryContent = `
      <div class="modal-body ${chromebooks.length > 5 ? 'scrollable' : ''}">
        <h2>Submitted Chromebook Information</h2>
        <p><strong>School:</strong> ${selectedSchool}</p>
        <p><strong>Technician:</strong> ${selectedTechnician}</p>
        <h3>Total Chromebooks Submitted: ${chromebookCount}</h3>
        <ul>
          ${chromebooks.map(chromebook => `
            <li>
              <strong>District Tag:</strong> ${chromebook.districtTag}<br>
              <strong>Serial #:</strong> ${chromebook.serialNumber}<br>
              <strong>Model Number:</strong> ${chromebook.modelNumber}<br>
            </li>
          `).join('')}
        </ul>
        <button id="addMoreButton" class="modal-button">Add Chromebooks</button>
        <button id="closeButton" class="modal-button"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
        <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg></button>
      </div>
    `;

    showModal(summaryContent, function () {
      // No additional actions needed here
    });

    // Add event listener for the "Add More Chromebooks" button
    document.getElementById('addMoreButton').addEventListener('click', function () {
      // Close the modal
      const modal = document.querySelector('div.modal');
      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal); // Safely remove the modal
      }
      const modalBackground = document.querySelector('.modal-background');
      if (modalBackground) {
        modalBackground.parentNode.removeChild(modalBackground); // Safely remove the modal background
      }

      // Reset necessary variables to allow for a new submission
      chromebooks = [];
      chromebookCount = 0;
      selectedSchool = '';
      selectedTechnician = '';

      // Start the process again
      startProcess();
    });

    // Add event listener for the close button
    document.getElementById('closeButton').addEventListener('click', function () {
      const modal = document.querySelector('div.modal');
      if (modal && modal.parentNode) {
        modal.parentNode.removeChild(modal); // Safely remove the modal
      }
      const modalBackground = document.querySelector('.modal-background');
      if (modalBackground) {
        modalBackground.parentNode.removeChild(modalBackground); // Safely remove the modal background
      }
    });
  }


  function injectStyles() {
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `

     /* Styling for the labels (e.g., "Select School", "Technician") */
  .modal-body label {
    font-size: 16px; /* Larger font size for better visibility */
    font-weight: 500; /* Slightly bold */
    color: #333; /* Dark text color for contrast */
    margin-bottom: 5px; /* Add spacing below the label */
    display: block; /* Ensure labels are on their own line */
  }

  /* Input and Select Styling */
  .modal-select,
  .modal-input {
    width: 100%; /* Full width */
    padding: 12px; /* Comfortable padding */
    margin: 10px 0; /* Add spacing around inputs */
    border: 1px solid #ccc; /* Light gray border */
    border-radius: 6px; /* Rounded corners for modern design */
    font-size: 16px; /* Adjust font size for readability */
    transition: border-color 0.3s ease; /* Smooth transition on focus */
  }

  .modal-input:focus,
  .modal-select:focus {
    border-color: #007bff; /* Blue border on focus */
    outline: none; /* Remove default outline */
  }

  /* Modal Header for Titles */
  .modal-body h2 {
    font-size: 18px; /* Larger font size for titles */
    font-weight: bold; /* Bold for emphasis */
    color: #000; /* Darker text for visibility */
    margin-bottom: 20px; /* Add spacing below titles */
  }

  .modal-body h3 {
    font-size: 18px; /* Subheading font size */
    font-weight: 500; /* Medium weight */
    color: #555; /* Slightly lighter than main headings */
    margin-bottom: 15px; /* Add spacing below subheadings */
  }

  /* Error Message Styling */
  .error-message {
    color: #dc3545; /* Red color for error messages */
    font-size: 16px; /* Slightly larger font size for emphasis */
    font-weight: bold; /* Bold for visibility */
    margin-bottom: 10px; /* Add spacing below error messages */
  }

      /* Modal background */
      .modal-background {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0, 0, 0, 0.6); /* Darker semi-transparent background */
        display: flex;
        justify-content: center; /* Center horizontally */
        align-items: center; /* Center vertically */
        z-index: 1000; /* Ensure it's on top */
        backdrop-filter: blur(5px); /* Optional blur effect */
      }

      .modal {
        background: white;
        border-radius: 12px; /* Softer corners */
        padding: 20px;
        max-width: 480px;
        width: 90%; /* Adjust width for responsiveness */
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        position: relative; /* Position relative for better alignment */
        margin: 0 auto; /* Center the modal */
        display: flex; /* Use flexbox for centering */
        flex-direction: column; /* Stack children vertically */
      }

      .modal-content {
        width: 100%; /* Make sure content takes full width */
        display: flex;
        flex-direction: column; /* Stack content vertically */
      }



      .modal-body.scrollable {
        max-height: 400px; /* Adjust height as needed */
        overflow-y: auto; /* Add vertical scrollbar */
      }

      .modal-select,
      .modal-input {
        width: 100%;
        padding: 12px; /* Increased padding for a modern feel */
        margin: 10px 0;
        border: 1px solid #ccc; /* Light gray border */
        border-radius: 6px; /* Rounded corners */
        font-size: 16px; /* Adjust font size */
        transition: border-color 0.3s; /* Smooth transition */
      }

      .modal-input:focus,
      .modal-select:focus {
        border-color: #007bff; /* Highlight border on focus */
        outline: none; /* Remove default outline */
      }

    /* Close Button (Top-Right) */
  .modal-button#closeButton {
    position: absolute; /* Absolutely position the close button */
    top: 10px; /* Distance from the top edge */
    right: 10px; /* Distance from the right edge */
    padding: 5px 10px; /* Compact padding */
    font-size: 16px; /* Slightly larger font for visibility */
    background: #dc3545; /* Red background color */
    color: white; /* White text color */
    border: none; /* No border */
    border-radius: 4px; /* Rounded corners */
    cursor: pointer; /* Pointer cursor */
    transition: background-color 0.3s ease; /* Smooth hover effect */
  }

  .modal-button#closeButton:hover {
    background-color: #c82333; /* Darker red for hover effect */
  }

  /* Inline Buttons (Aligned at Bottom) */
  .modal-button {
    padding: 8px 16px; /* Compact padding for smaller size */
    margin: 0 5px; /* Space between buttons */
    border: none; /* No border */
    border-radius: 4px; /* Rounded corners */
    font-size: 14px; /* Smaller font size */
    cursor: pointer; /* Pointer cursor */
    background: #007bff; /* Blue background color */
    color: white; /* White text color */
    transition: background-color 0.3s ease; /* Smooth hover effect */
    display: inline-block; /* Ensure buttons stay inline */
  }

  .modal-button:hover {
    background: #0056b3; /* Darker blue on hover */
  }

  /* Button Container for Inline Layout */
  .button-container {
    text-align: center; /* Center align buttons horizontally */
    margin-top: 20px; /* Add spacing above buttons */
  }

  /* Modal Content Styling */
  .modal-body {
    position: relative; /* Relative positioning for close button */
    padding: 20px;
  }

  /* List Styling */
  .modal-body ul {
    padding: 0;
    list-style: none;
  }

  .modal-body ul li {
    border: 1px solid #ddd; /* Light gray border */
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px; /* Rounded corners */
    background-color: #f9f9f9; /* Light background */
    position: relative; /* For button positioning */
    transition: background-color 0.3s;
  }

  .modal-body ul li:hover {
    background-color: #f1f1f1; /* Slightly darker background on hover */
  }

  /* Button Group for Edit/Delete in List Items */
  .button-group {
    position: absolute; /* Position buttons absolutely */
    top: 10px; /* Align with the top of the list item */
    right: 10px; /* Align to the right */
    display: flex; /* Flexbox for alignment */
    gap: 8px; /* Space between buttons */
  }

  .edit-button, .delete-button {
    padding: 5px 8px; /* Compact padding */
    border: none;
    border-radius: 4px;
    font-size: 12px; /* Smaller font */
    cursor: pointer;
    color: white; /* White text */
    transition: background-color 0.3s ease;
  }

  .edit-button {
    background-color: #ffc107; /* Yellow */
  }

  .edit-button:hover {
    background-color: #e0a800; /* Darker yellow */
  }

  .delete-button {
    background-color: #dc3545; /* Red */
  }

  .delete-button:hover {
    background-color: #c82333; /* Darker red */
  }
      .error-message {
        margin-bottom: 10px;
        color: #c82333; /* Error color */
      }

      h2 {
        margin-top: 0;
        font-size: 24px; /* Increase font size for headings */
        color: #333; /* Consistent heading color */
      }

      h3 {
        margin-top: 10px;
        font-size: 20px; /* Increase font size for sub-headings */
        color: #555; /* Slightly lighter color for sub-headings */
      }

      /* Bold labels */
      .modal-body strong {
        font-weight: 600; /* Use a semi-bold font weight */
        color: #333; /* Consistent text color */
      }

      .disabled {
        background-color: #ccc; /* Grey background */
        cursor: not-allowed; /* Change cursor to indicate disabled state */
        pointer-events: none; /* Prevent clicks */
      }

      .overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.7);
        color: white;
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000; /* Ensure it appears above other elements */
      }

      .overlay-message {
        font-size: 48px;
        text-align: center;
      }

      /* Border around each Chromebook entry */
      .modal-body ul li {
        border: 1px solid #ddd; /* Light gray border */
        padding: 10px;
        margin-bottom: 10px;
        border-radius: 8px; /* Softer corners */
        background-color: #f9f9f9; /* Light background for list items */
        transition: background-color 0.3s; /* Smooth transition */
      }

      .modal-body ul li:hover {
        background-color: #f1f1f1; /* Darker shade on hover */
      }
        /* Styling for the collected information list */
  .chromebook-item {
    position: relative; /* Position relative for button placement */
    border: 1px solid #ddd; /* Light gray border */
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 8px; /* Softer corners */
    background-color: #f9f9f9; /* Light background for list items */
    transition: background-color 0.3s; /* Smooth transition */
  }

  .chromebook-item:hover {
    background-color: #f1f1f1; /* Slightly darker on hover */
  }

  /* Button group (Edit/Delete) */
  .button-group {
    position: absolute; /* Position buttons absolutely */
    top: 10px; /* Align to the top */
    right: 10px; /* Align to the right */
    display: flex; /* Flexbox for alignment */
    gap: 8px; /* Space between buttons */
  }

  /* Edit button */
  .edit-button {
    background-color: #ffc107; /* Yellow color */
    color: #ffffff; /* White text */
    border: none; /* No border */
    padding: 5px 10px; /* Padding for size */
    border-radius: 5px; /* Rounded corners */
    font-size: 14px; /* Font size */
    cursor: pointer; /* Pointer cursor */
    transition: background-color 0.3s ease; /* Hover effect */
  }

  .edit-button:hover {
    background-color: #e0a800; /* Darker yellow */
  }

  /* Delete button */
  .delete-button {
    background-color: #dc3545; /* Red color */
    color: #ffffff; /* White text */
    border: none; /* No border */
    padding: 5px 10px; /* Padding for size */
    border-radius: 5px; /* Rounded corners */
    font-size: 14px; /* Font size */
    cursor: pointer; /* Pointer cursor */
    transition: background-color 0.3s ease; /* Hover effect */
  }

  .delete-button:hover {
    background-color: #c82333; /* Darker red */
  }
    `;
    document.head.appendChild(style);
  }

  // Call the function to inject styles
  injectStyles();




})();
