// ==UserScript==
// @name         Add Discard Button to Footer with Automation Trigger
// @namespace    http://tampermonkey.net/
// @version      1.1.2
// @description  Adds a "Discard" button to the footer that contains the "Clone Ticket" button and starts the automation process when clicked.
// @author       You
// @match        *://*.schooldude.com/*
// @updateURL    https://raw.githubusercontent.com/moraleshugo12/SchoolDude/main/discard-button.user.js
// @downloadURL  hhttps://raw.githubusercontent.com/moraleshugo12/SchoolDude/main/discard-button.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';
    // Function to reset variables
    function resetVariables() {
        console.log("Resetting all variables and cleaning up for the next discard process.");
        // Clear or reset any temporary data
        sessionStorage.clear(); // Optional: Clears any session storage used
    }

    // Function to create the "Discard" button
    function createDiscardButton() {
        const table = document.createElement('table');
        table.setAttribute('cellspacing', '0');
        table.setAttribute('role', 'presentation');
        table.id = 'DiscardButton'; // Unique ID for the Discard button
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

        // Add a click event listener for the button
        table.addEventListener('click', () => {
            console.log('Discard button clicked!');
            automateTicketInteraction(); // Trigger the automation process
        });

        return table;
    }

    // Function to add the "Discard" button to the footer containing the "Clone Ticket" button
    function addDiscardButtonToFooter() {
        // Get all elements with the class "x-panel-footer"
        const footers = document.querySelectorAll('.x-panel-footer');

        footers.forEach((footer) => {
            // Check if the footer contains the "Clone Ticket" button
            const cloneTicketButton = footer.querySelector('button#Clone_Ticket');
            if (cloneTicketButton) {
                // Ensure the "Discard" button is not already added
                if (!footer.querySelector('#DiscardButton')) {
                    const toolbar = footer.querySelector('.x-toolbar-left-row');
                    if (toolbar) {
                        // Create the "Discard" button
                        const discardButton = createDiscardButton();



                        // Add the button to the toolbar with padding on the left
                        const discardButtonCell = document.createElement('td');
                        discardButtonCell.className = 'x-toolbar-cell';
                        discardButtonCell.style.paddingLeft = '10px'; // Add left padding here
                        discardButtonCell.appendChild(discardButton);

                        toolbar.appendChild(discardButtonCell);

                        console.log('"Discard" button added to the footer containing "Clone Ticket" with left padding.');
                    }
                }
            }
        });
    }

    // Observe changes to the DOM to ensure dynamic content is handled
    const observer = new MutationObserver(() => {
        addDiscardButtonToFooter(); // Add the button whenever the DOM changes
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial attempt to add the button after the page is fully loaded
    window.addEventListener('load', addDiscardButtonToFooter);

    // Include the full automation process logic here
    // Function to set value in a text area and simulate all necessary events
function setValueAndSimulateEvents(element, value) {
    if (element) {
        element.value = value; // Set the value
        element.dispatchEvent(new Event('focus', { bubbles: true })); // Simulate focus
        element.dispatchEvent(new Event('input', { bubbles: true })); // Simulate input
        element.dispatchEvent(new Event('keyup', { bubbles: true })); // Simulate keyup
        element.dispatchEvent(new Event('change', { bubbles: true })); // Simulate change
        element.dispatchEvent(new Event('blur', { bubbles: true })); // Simulate blur
        console.log(`Value set and events triggered for element:`, element);
    } else {
        console.error("Element not found to set value.");
    }
}


// Function to simulate a mouse click on a checkbox and ensure it is checked
function simulateCheckboxClick(checkbox) {
    if (checkbox) {
        // Ensure the checkbox is visible and interactable
        if (checkbox.disabled) {
            console.error("Checkbox is disabled and cannot be clicked:", checkbox);
            return;
        }

        // Simulate a mouse click sequence
        checkbox.dispatchEvent(new MouseEvent('focus', { bubbles: true })); // Focus on the checkbox
        checkbox.dispatchEvent(new MouseEvent('mousedown', { bubbles: true })); // Simulate mousedown
        checkbox.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));   // Simulate mouseup
        checkbox.dispatchEvent(new MouseEvent('click', { bubbles: true }));   // Simulate click

        // Fallback: Ensure checkbox state is toggled if events don't work
        if (!checkbox.checked) {
            checkbox.checked = true; // Manually check the checkbox
            checkbox.dispatchEvent(new Event('change', { bubbles: true })); // Trigger change event
            console.log("Checkbox manually checked as fallback:", checkbox);
        }

        console.log(`Checkbox clicked and events triggered for:`, checkbox);
    } else {
        console.error("Checkbox not found to simulate click.");
    }
}

// Function to wait for a checkbox to become enabled
function waitForCheckboxToEnable(checkbox, callback) {
    const interval = setInterval(() => {
        if (!checkbox.disabled) {
            clearInterval(interval); // Stop checking once the checkbox is enabled
            console.log(`Checkbox is now enabled:`, checkbox);
            callback(); // Execute the callback
        }
    }, 100); // Check every 100 milliseconds
}

// Function to extract information from the description box
function getDescriptionBoxContent() {
    const descriptionBox = document.getElementById('base_inc_incident_description');
    if (descriptionBox) {
        const descriptionContent = descriptionBox.value || descriptionBox.textContent;
        console.log("Description Box Content:", descriptionContent);
        return descriptionContent.trim();
    } else {
        console.error("Description box not found.");
        return null;
    }
}

// Function to parse information (District Tag, Serial Number, Model Number) from the description box
function parseDescriptionContent(descriptionContent) {
    if (!descriptionContent) {
        console.error("No description content provided for parsing.");
        return {};
    }

    // Regular expressions to extract District Tag, Serial Number, and Model Number
    const districtTagMatch = descriptionContent.match(/District Tag:\s*([\w-]+)/i);
    const serialNumberMatch = descriptionContent.match(/Serial #:\s*([\w-]+)/i);
    const modelNumberMatch = descriptionContent.match(/Model Number:\s*([\w-]+)/i);

    // Extracted values or default to 'Unknown'
    const districtTag = districtTagMatch ? districtTagMatch[1].trim() : "Unknown";
    const serialNumber = serialNumberMatch ? serialNumberMatch[1].trim() : "Unknown";
    const modelNumber = modelNumberMatch ? modelNumberMatch[1].trim() : "Unknown";

    console.log("Parsed District Tag:", districtTag);
    console.log("Parsed Serial Number:", serialNumber);
    console.log("Parsed Model Number:", modelNumber);

    return { districtTag, serialNumber, modelNumber };
}

// Function to get the signed-in user from the toolbar and return only the first name
function getSignedInUser() {
    const toolbarElement = document.querySelector('.x-toolbar-right .xtb-text span');
    if (toolbarElement) {
        const textContent = toolbarElement.textContent.trim();
        const userMatch = textContent.match(/Welcome\s+([\w.-]+@[\w.-]+)/i); // Extract email from text
        if (userMatch && userMatch[1]) {
            const fullEmail = userMatch[1]; // Full email, e.g., "john.doe@example.com"
            const firstName = fullEmail.split(/[@.]/)[0]; // Split by "@" or "." and take the first part
            console.log("Signed-in User First Name:", firstName);
            return firstName; // Return only the first name
        }
    }
    console.error("Could not find the signed-in user.");
    return "Unknown User";
}

// Function to check if all three checkboxes are filled
function areAllCheckboxesChecked() {
    const publicCheckbox = document.querySelector('#note_public');
    const resolutionCheckbox = document.querySelector('#note_resolution');
    const completeCheckbox = document.querySelector('#note_completed');

    // Verify all checkboxes are checked
    return (
        publicCheckbox && publicCheckbox.checked &&
        resolutionCheckbox && resolutionCheckbox.checked &&
        completeCheckbox && completeCheckbox.checked
    );
}

// Function to trigger the "Save" button only when all conditions are met
function clickSaveButtonWhenReady() {
    const interval = setInterval(() => {
        if (areAllCheckboxesChecked()) {
            clearInterval(interval); // Stop checking once all checkboxes are checked

            // Locate the "Save" button
            const saveButton = document.querySelector('button#Save');

            if (saveButton) {
                // Check if the button is enabled
                const isDisabled = saveButton.getAttribute('aria-disabled') === 'true';
                if (!isDisabled) {
                    saveButton.click(); // Trigger the click
                    console.log("Save button clicked successfully.");
                } else {
                    console.error("Save button is disabled and cannot be clicked.");
                }
            } else {
                console.error("Save button not found in the DOM.");
            }
        } else {
            console.log("Waiting for all checkboxes to be checked...");
        }
    }, 500); // Check every 500ms
}

// Function to simulate a click on the correct "Save" button
function simulateSaveButtonClick() {
    setTimeout(() => {
        // Locate the parent container for the correct Save button
        const parentContainer = document.querySelector('#_p-Notes'); // Adjust this selector if needed

        if (parentContainer) {
            // Find the Save button within this container
            const saveButton = parentContainer.querySelector('button#Save');

            if (saveButton) {
                // Check if the button is disabled
                const isDisabled = saveButton.getAttribute('aria-disabled') === 'true';

                if (!isDisabled) {
                    // Simulate a click event on the Save button
                    saveButton.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
                    saveButton.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
                    saveButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));

                    console.log("Simulated a click on the Save button.");
                } else {
                    console.error("Save button is disabled and cannot be clicked.");
                }
            } else {
                console.error("Save button not found within the specified container.");
            }
        } else {
            console.error("Parent container for the Save button not found.");
        }
    }, 500); // Wait for DOM elements to be fully rendered
}
function autofillForm(reason) {
    const today = new Date().toLocaleDateString();

    // Format the note content
    const noteContent = `DISCARDED: ${today}\nADDED TO INFORMATION TECHNOLOGY DISCARD LIST\nREASON: ${reason}`;

    // Fill the "Note:" textarea and simulate events
    const noteTextarea = document.querySelector('#base_inc_notes_note_text');
    setValueAndSimulateEvents(noteTextarea, noteContent); // Set value and simulate events

    // Step 1: Click the "Public" checkbox
    const publicCheckbox = document.querySelector('#note_public');
    simulateCheckboxClick(publicCheckbox); // Simulate mouse click

    // Step 2: Wait 1 second, then click the "Mark As Resolution" checkbox
    setTimeout(() => {
        const resolutionCheckbox = document.querySelector('#note_resolution');
        simulateCheckboxClick(resolutionCheckbox); // Simulate mouse click

        // Step 3: Wait another second, then click the "Mark Ticket Complete" checkbox
        setTimeout(() => {
            const completeCheckbox = document.querySelector('#note_completed');
            if (!completeCheckbox.disabled) {
                simulateCheckboxClick(completeCheckbox); // Simulate mouse click
            } else {
                console.error("The 'Mark Ticket Complete' checkbox is still disabled.");
            }

            // Step 4: Wait for all checkboxes to be checked, then click the "Save" button
            // Step 4: Simulate a click on the Save button
            simulateSaveButtonClick();
        }, 200); // Wait 1 second before clicking "Mark Ticket Complete"
    }, 200); // Wait 1 second before clicking "Mark As Resolution"

    // Step 5: Send the data to the Web App
    sendToWebApp(reason);
}
 // Function to wait for the note textarea to be available and then set its content
    function waitForNoteTextareaAndFillContent(noteContent, callback) {
        const interval = setInterval(() => {
            const noteTextarea = document.querySelector('#base_inc_notes_note_text'); // Selector for the textarea
            if (noteTextarea) {
                clearInterval(interval); // Stop checking once the textarea is found
                setValueAndSimulateEvents(noteTextarea, noteContent); // Set the value and trigger events
                console.log("Note content added.");

                if (callback) callback(); // Execute callback after setting the note content
            }
        }, 500); // Check every 500ms
    }


// Function to trigger the "Save" button
function clickSaveButton() {
    // Add a delay to ensure the button is rendered and accessible
    setTimeout(() => {
        // Locate the Save button using ID and ensure it's the correct one
        const saveButton = document.querySelector('button#Save');

        if (saveButton) {
            // Check if the Save button is disabled
            const isDisabled = saveButton.getAttribute('aria-disabled') === 'true';

            if (!isDisabled) {
                saveButton.click(); // Trigger the click
                console.log("Save button clicked successfully.");
            } else {
                console.error("Save button is disabled and cannot be clicked.");
            }
        } else {
            console.error("Save button not found in the DOM. Attempting to locate using parent structure...");

            // Try an alternative approach by navigating the DOM structure
            const toolbarSaveButton = document.querySelector(
                'table#sl-856 button#Save'
            );

            if (toolbarSaveButton) {
                const isToolbarDisabled =
                    toolbarSaveButton.getAttribute('aria-disabled') === 'true';

                if (!isToolbarDisabled) {
                    toolbarSaveButton.click(); // Trigger the click
                    console.log("Toolbar Save button clicked successfully.");
                } else {
                    console.error(
                        "Toolbar Save button is disabled and cannot be clicked."
                    );
                }
            } else {
                console.error("Toolbar Save button also not found.");
            }
        }
    }, 500); // Wait for 500ms before attempting to click
}

// Function to extract the site information
    function getSiteInformation() {
        const siteInput = document.querySelector('#base_inc_incident_rte_location');
        if (siteInput) {
            const siteValue = siteInput.value.trim();
            console.log("Site Information:", siteValue);
            return siteValue;
        } else {
            console.error("Site input field not found.");
            return "Unknown Site";
        }
    }

// Function to send data to the Google Apps Script Web App using window.open
function sendToWebApp(reason) {
    // Extract description content
    const descriptionContent = getDescriptionBoxContent();

    // Parse the description content to extract District Tag, Serial Number, and Model Number
    const { districtTag, serialNumber, modelNumber } = parseDescriptionContent(descriptionContent);

    // Get the signed-in user's email or username
    const signedInUser = getSignedInUser();

    const site = getSiteInformation();

    // Get the current date in "MM/DD/YYYY" format
    const currentDate = new Date().toLocaleDateString();

    // Construct the comments field with user and date
    const comments = `${signedInUser} - ${currentDate}`;

    // Construct the URL with query parameters
    const equipmentType = "Chromebook"; // Static value for equipment type
    const url = `https://script.google.com/macros/s/AKfycbxZR-auawZgnt5Kb2fTR8L2L0gRW7mrWgkPUBPzpqVLMdqqtEeJ1gcfhJ44hLCP7x4n9A/exec?equipmentType=${encodeURIComponent(equipmentType)}&makeModel=${encodeURIComponent(modelNumber)}&whiteAssetTag=${encodeURIComponent(districtTag)}&serialNumber=${encodeURIComponent(serialNumber)}&reason=${encodeURIComponent(reason)}&comments=${encodeURIComponent(comments)}&site=${encodeURIComponent(site)}`;

    // Open a new tab
    const newTab = window.open(url, '_blank');

    // Wait for 3 seconds and then close the tab
    setTimeout(() => {
        if (newTab) {
            newTab.close();
            console.log("New tab closed successfully.");
        } else {
            console.error("Failed to open or close the new tab.");
        }
        // Reset everything for the next discard action
            resetVariables();
    }, 3000); // Close the tab after 3 seconds
}


// Function to click on the Notes tab based on its text content
function clickNotesTab() {
    // Locate all tabs
    const tabs = document.querySelectorAll('.x-tab-strip.x-tab-strip-top li');
    if (!tabs || tabs.length === 0) {
        console.error("No tabs found.");
        return false;
    }

    // Search for the Notes tab
    for (const tab of tabs) {
        const textSpan = tab.querySelector('.x-tab-strip-text');
        if (textSpan && textSpan.textContent.trim().startsWith('Notes')) {
            tab.click(); // Click the Notes tab
            console.log("Clicked on the Notes tab:", textSpan.textContent.trim());
            return true;
        }
    }

    console.error("Notes tab not found.");
    return false;
}

// Function to click the New button within the Notes tab
 // Function to click the New button in the Notes tab
    function clickNewButtonInNotesTab(callback) {
        // Wait for the Notes tab content to load
        setTimeout(() => {
            // Ensure we are within the Notes tab container
            const notesTabContent = document.querySelector('#_p-Notes'); // ID for the Notes tab content
            if (notesTabContent) {
                // Find the specific New button within the Notes tab
                const newButton = notesTabContent.querySelector('button#New');
                if (newButton) {
                    newButton.addEventListener('click', (e) => {
                        e.preventDefault(); // Prevent default behavior
                        console.log("New Note button clicked.");
                        if (callback) callback(); // Execute the callback (e.g., to fill the note content)
                    });
                    newButton.click(); // Trigger the click
                    console.log("Clicked the New button in the Notes tab.");
                } else {
                    console.error("New button not found within the Notes tab.");
                }
            } else {
                console.error("Notes tab content not found.");
            }
        }, 500); // Delay to ensure the Notes tab content is fully loaded
    }

// Function to display a modern, professional pop-up with discard reasons and a custom input option
function showReasonPopup() {
    // Create the pop-up container
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.backgroundColor = '#ffffff';
    popup.style.padding = '30px';
    popup.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
    popup.style.zIndex = '10000';
    popup.style.borderRadius = '12px';
    popup.style.width = '400px';
    popup.style.fontFamily = 'Arial, sans-serif';

    // Add a title
    const title = document.createElement('h1');
    title.textContent = 'Reason for Discard';
    title.style.marginBottom = '20px';
    title.style.color = '#333';
    title.style.fontSize = '24px';
    title.style.fontWeight = 'bold';
    title.style.textAlign = 'center';
    popup.appendChild(title);

    // Create radio button options
    const options = [
        { value: 'Too many broken parts', label: 'Too many broken parts' },
        { value: 'Bad Motherboard', label: 'Bad Motherboard' },
        { value: 'Bad Power Button', label: 'Bad Power Button' },
        { value: 'Custom', label: 'Custom Reason (please specify):' }, // Custom reason option
    ];

    const form = document.createElement('form');
    form.style.marginBottom = '20px';

    // Loop through options and create radio buttons
    options.forEach((option) => {
        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '10px';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'flex-start';
        wrapper.style.gap = '10px';

        const input = document.createElement('input');
        input.type = 'radio';
        input.name = 'reason';
        input.value = option.value;
        input.style.cursor = 'pointer';
        input.style.marginTop = '3px';

        const label = document.createElement('label');
        label.textContent = option.label;
        label.style.color = '#555';
        label.style.fontSize = '16px';
        label.style.cursor = 'pointer';

        wrapper.appendChild(input);
        wrapper.appendChild(label);

        // Add a textarea for the custom reason option
        if (option.value === 'Custom') {
            const customReasonInput = document.createElement('textarea');
            customReasonInput.placeholder = 'Enter your custom reason here...';
            customReasonInput.style.width = '100%';
            customReasonInput.style.height = '60px';
            customReasonInput.style.border = '1px solid #ddd';
            customReasonInput.style.borderRadius = '8px';
            customReasonInput.style.padding = '10px';
            customReasonInput.style.fontSize = '14px';
            customReasonInput.style.resize = 'none';
            customReasonInput.style.display = 'none'; // Initially hidden
            customReasonInput.style.marginTop = '10px';
            customReasonInput.style.boxSizing = 'border-box';

            // Show the textarea only when the custom option is selected
            input.addEventListener('change', () => {
                if (input.checked) {
                    customReasonInput.style.display = 'block';
                }
            });

            // Hide the textarea when other options are selected
            form.addEventListener('change', () => {
                if (!input.checked) {
                    customReasonInput.style.display = 'none';
                    customReasonInput.value = ''; // Clear custom input if deselected
                }
            });

            wrapper.appendChild(customReasonInput);
        }

        form.appendChild(wrapper);
    });

    popup.appendChild(form);

    // Add action buttons (Confirm and Cancel)
    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.justifyContent = 'flex-end';
    buttonContainer.style.gap = '10px';

    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'Confirm';
    confirmButton.style.backgroundColor = '#007bff';
    confirmButton.style.color = 'white';
    confirmButton.style.border = 'none';
    confirmButton.style.borderRadius = '8px';
    confirmButton.style.padding = '10px 15px';
    confirmButton.style.cursor = 'pointer';
    confirmButton.style.fontSize = '14px';
    confirmButton.style.fontWeight = 'bold';
    confirmButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    confirmButton.style.transition = 'background-color 0.3s ease';
    confirmButton.addEventListener('mouseenter', () => {
        confirmButton.style.backgroundColor = '#0056b3';
    });
    confirmButton.addEventListener('mouseleave', () => {
        confirmButton.style.backgroundColor = '#007bff';
    });

    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'Cancel';
    cancelButton.style.backgroundColor = '#dc3545';
    cancelButton.style.color = 'white';
    cancelButton.style.border = 'none';
    cancelButton.style.borderRadius = '8px';
    cancelButton.style.padding = '10px 15px';
    cancelButton.style.cursor = 'pointer';
    cancelButton.style.fontSize = '14px';
    cancelButton.style.fontWeight = 'bold';
    cancelButton.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    cancelButton.style.transition = 'background-color 0.3s ease';
    cancelButton.addEventListener('mouseenter', () => {
        cancelButton.style.backgroundColor = '#c82333';
    });
    cancelButton.addEventListener('mouseleave', () => {
        cancelButton.style.backgroundColor = '#dc3545';
    });

    buttonContainer.appendChild(confirmButton);
    buttonContainer.appendChild(cancelButton);
    popup.appendChild(buttonContainer);

    // Append the pop-up to the document body
    document.body.appendChild(popup);

    // Handle the Confirm button click
    confirmButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission

        // Get the selected reason
        const selectedOption = form.querySelector('input[name="reason"]:checked');
        let customReason = '';

        // Check if custom reason was selected
        if (selectedOption && selectedOption.value === 'Custom') {
            const customReasonInput = form.querySelector('textarea');
            customReason = customReasonInput.value.trim();
            if (!customReason) {
                alert('Please specify your custom reason.');
                return;
            }
        }

        // Use the custom reason if provided, otherwise use the selected option
        const reason = customReason || (selectedOption ? selectedOption.value : '');

        if (reason) {
            autofillForm(reason); // Call the autofill function with the selected reason
            document.body.removeChild(popup); // Remove the pop-up
        } else {
            alert('Please select or enter a reason.');
        }
    });

    // Handle the Cancel button click
    cancelButton.addEventListener('click', (e) => {
        e.preventDefault(); // Prevent form submission
        document.body.removeChild(popup); // Close the pop-up
    });
}
// Main function to perform all actions in sequence
function automateTicketInteraction() {
    resetVariables();

        const descriptionContent = getDescriptionBoxContent(); // Step 1: Extract description
        if (descriptionContent) {
            const notesTabClicked = clickNotesTab(); // Step 2: Click the Notes tab
            if (notesTabClicked) {
                clickNewButtonInNotesTab(() => {
                    console.log("New Note button clicked. Showing reason popup...");
                    showReasonPopup(); // Step 3: Show the reason selection popup
                });
            }
        }
    }

})();

