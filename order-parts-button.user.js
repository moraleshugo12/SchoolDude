// ==UserScript==
// @name         Order Parts Button
// @namespace    http://tampermonkey.net/
// @version      1.1.1
// @description  Adds an "Order Parts" button to the footer that contains the "Clone Ticket" button and opens a modal for part selection.
// @author       You
// @match        *://*.schooldude.com/*
// @updateURL    https://github.com/moraleshugo12/SchoolDude/main/order-parts-button.user.js
// @downloadURL  https://github.com/moraleshugo12/SchoolDude/main/order-parts-button.user.js
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    // Data: Chromebook models and their associated parts
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
            "LCD HD 1366X768 30 PIN CONNECTOR SKU: 6M.A8ZN7.001": "LCD HD (30-pin)",
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

    // Function to create the "Order Parts" button
    function createOrderPartsButton() {
        const table = document.createElement('table');
        table.setAttribute('cellspacing', '0');
        table.setAttribute('role', 'presentation');
        table.id = 'OrderPartsButton'; // Unique ID for the Order Parts button
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

        // Add a click event listener for the button
        table.addEventListener('click', () => {
            console.log('Order Parts button clicked!');
            automateTicketInteraction(); // Trigger the automation process
        });

        return table;
    }

    // Function to add the "Order Parts" button to the footer containing the "Clone Ticket" button
    function addOrderPartsButtonToFooter() {
        // Get all elements with the class "x-panel-footer"
        const footers = document.querySelectorAll('.x-panel-footer');

        footers.forEach((footer) => {
            // Check if the footer contains the "Clone Ticket" button
            const cloneTicketButton = footer.querySelector('button#Clone_Ticket');
            if (cloneTicketButton) {
                // Ensure the "Order Parts" button is not already added
                if (!footer.querySelector('#OrderPartsButton')) {
                    const toolbar = footer.querySelector('.x-toolbar-left-row');
                    if (toolbar) {
                        // Create the "Order Parts" button
                        const orderPartsButton = createOrderPartsButton();

                        // Add the button to the toolbar with padding on the left
                        const orderPartsButtonCell = document.createElement('td');
                        orderPartsButtonCell.className = 'x-toolbar-cell';
                        orderPartsButtonCell.style.paddingLeft = '10px'; // Add left padding here
                        orderPartsButtonCell.appendChild(orderPartsButton);

                        toolbar.appendChild(orderPartsButtonCell);

                        console.log('"Order Parts" button added to the footer containing "Clone Ticket" with left padding.');
                    }
                }
            }
        });
    }

    // Observe changes to the DOM to ensure dynamic content is handled
    const observer = new MutationObserver(() => {
        addOrderPartsButtonToFooter(); // Add the button whenever the DOM changes
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });

    // Initial attempt to add the button after the page is fully loaded
    window.addEventListener('load', addOrderPartsButtonToFooter);



    function showOrderPartsModal() {
    // Get the Chromebook model from the description box
    const descriptionContent = getDescriptionBoxContent();
    const { modelNumber } = parseDescriptionContent(descriptionContent);
    let selectedModel = modelNumber; // Default to the extracted model

    // Create the modal container
    const modal = document.createElement('div');
    modal.id = 'orderPartsModal';
    modal.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 20px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        border-radius: 5px;
        z-index: 10000;
        width: 400px;
    `;

    // Add a title
    const title = document.createElement('h3');
    title.textContent = `Order Parts for Model: ${modelNumber || "Unknown"}`;
    title.style.marginBottom = "15px";
    modal.appendChild(title);

    // Create a container for the parts checkboxes
    const partsContainer = document.createElement('div');
    partsContainer.style.cssText = `
        max-height: 200px;
        overflow-y: auto;
        margin-bottom: 15px;
        border: 1px solid #ddd;
        padding: 10px;
    `;

    // Check if the model number matches any predefined models
    if (modelNumber && chromebookParts[modelNumber]) {
        populatePartsContainer(chromebookParts[modelNumber], partsContainer);
    } else {
        // If no match, prompt the user to select a model
        const modelSelectLabel = document.createElement('label');
        modelSelectLabel.textContent = "Select Chromebook Model:";
        modelSelectLabel.style.display = "block";
        modelSelectLabel.style.marginBottom = "10px";

        const modelSelect = document.createElement('select');
        modelSelect.style.cssText = `
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 15px;
        `;

        // Add an empty option as a placeholder
        const defaultOption = document.createElement('option');
        defaultOption.textContent = "Choose a model...";
        defaultOption.disabled = true;
        defaultOption.selected = true;
        modelSelect.appendChild(defaultOption);

        // Populate the dropdown with available Chromebook models
        Object.keys(chromebookParts).forEach((model) => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            modelSelect.appendChild(option);
        });

        // Add an event listener to update parts and the selected model
        modelSelect.addEventListener('change', () => {
            selectedModel = modelSelect.value; // Update the selected model
            partsContainer.innerHTML = ""; // Clear previous parts
            populatePartsContainer(chromebookParts[selectedModel], partsContainer);
        });

        modal.appendChild(modelSelectLabel);
        modal.appendChild(modelSelect);
    }

    modal.appendChild(partsContainer);

    // Add a confirm button
    const confirmButton = document.createElement('button');
    confirmButton.textContent = "Confirm";
    confirmButton.style.cssText = `
        background-color: #007bff;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 15px;
        cursor: pointer;
    `;
    confirmButton.addEventListener('click', () => {
        const selectedParts = Array.from(partsContainer.querySelectorAll('input:checked')).map(
            (checkbox) => checkbox.value // Collect full descriptions of selected parts
        );
        if (selectedParts.length > 0) {
            handlePartsOrder(selectedParts, selectedModel); // Pass the selected model
        } else {
            alert("No parts selected.");
        }
        document.body.removeChild(modal); // Close the modal
    });
    modal.appendChild(confirmButton);

    // Add a cancel button
    const cancelButton = document.createElement('button');
    cancelButton.textContent = "Cancel";
    cancelButton.style.cssText = `
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 5px;
        padding: 10px 15px;
        cursor: pointer;
        margin-left: 10px;
    `;
    cancelButton.addEventListener('click', () => {
        document.body.removeChild(modal); // Close the modal
    });
    modal.appendChild(cancelButton);

    // Append the modal to the document body
    document.body.appendChild(modal);
}


// Function to populate the parts container with checkboxes
function populatePartsContainer(parts, container) {
    Object.entries(parts).forEach(([fullDescription, shortName]) => {
        const label = document.createElement('label');
        label.style.cssText = `
            display: block;
            margin-bottom: 5px;
        `;

        const checkbox = document.createElement('input');
        checkbox.type = "checkbox";
        checkbox.value = fullDescription; // Use full description as the value
        checkbox.style.marginRight = "10px";

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(shortName)); // Display the pretty name
        container.appendChild(label);
    });
}

    function handlePartsOrder(selectedParts, selectedModel) {
    const today = new Date().toLocaleDateString();

    // Step 1: Click on the "Notes" tab, then the "New Note" button
    setTimeout(() => {
        if (clickNotesTab()) {
            console.log("Clicked on the 'Notes' tab.");

            setTimeout(() => {
                clickNewButtonInNotesTab(() => {
                    console.log("Clicked on the 'New Note' button.");

                    // Add the note content
                    const noteContent = `ORDERED PARTS: ${today}\n- ${selectedParts.join("\n- ")}`;
                    waitForNoteTextareaAndFillContent(noteContent, () => {
                        console.log("Note content successfully filled.");

                        // Check the Public checkbox
                        const publicCheckbox = document.querySelector('#note_public');
                        simulateCheckboxClick(publicCheckbox);
                        console.log("'Public' checkbox checked.");

                        // Step 2: Send parts to Google Sheets
                        sendPartsToWebApp(selectedParts, selectedModel, () => {
                            // Step 3: Simulate the Save button click after submission
                            simulateSaveButtonClick(() => {
                                console.log("Save button clicked. Parts order process completed.");
                            });
                        });
                    });
                });
            }, 500); // Wait for the Notes tab content to load
        } else {
            console.error("Failed to click on the 'Notes' tab.");
        }
    }, 500); // Initial delay for the dropdown or other actions to complete
}

    function sendPartsToWebApp(selectedParts, selectedModel, callback) {
    // Extract description content
    const descriptionContent = getDescriptionBoxContent();
    const { districtTag, serialNumber, modelNumber } = parseDescriptionContent(descriptionContent);
    const signedInUser = getSignedInUser();
    const siteInput = document.querySelector('#base_inc_incident_rte_location');
    const siteLocation = siteInput ? siteInput.value : 'Unknown';
    const incidentNumberElement = document.querySelector('#base_inc_incident_id');
    const incidentNumber = incidentNumberElement ? incidentNumberElement.textContent.trim() : 'Unknown';
    const currentDate = new Date().toLocaleDateString();

    const equipmentType = "Chromebook";
    const finalModel = selectedModel || modelNumber; // Use the selected model if available
    const partsQuery = selectedParts.map((part) => encodeURIComponent(part)).join(',');

    // Log all the data being sent to help debug
    console.log("Data being sent to Google Sheets:");
    console.log("Equipment Type:", equipmentType);
    console.log("Model Number:", finalModel);
    console.log("White Asset Tag (District Tag):", districtTag);
    console.log("Serial Number:", serialNumber);
    console.log("Incident Number:", incidentNumber);
    console.log("Site Location:", siteLocation);
    console.log("Technician:", signedInUser);
    console.log("Selected Parts:", selectedParts);
    console.log("Submission Date:", currentDate);

    const url = `https://script.google.com/macros/s/AKfycbxCXC60s0VKgHghbNJGwfbfrljiD3IlEyUvNa_-WEcO9GMW3ttn96MU3zs6BSGROtlXJg/exec?equipmentType=${encodeURIComponent(equipmentType)}&makeModel=${encodeURIComponent(finalModel)}&whiteAssetTag=${encodeURIComponent(districtTag)}&serialNumber=${encodeURIComponent(serialNumber)}&incidentNumber=${encodeURIComponent(incidentNumber)}&siteLocation=${encodeURIComponent(siteLocation)}&technician=${encodeURIComponent(signedInUser)}&selectedParts=${partsQuery}&submissionDate=${encodeURIComponent(currentDate)}`;

    console.log("Generated URL:", url); // Log the full URL being sent

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

        // Execute the callback if provided
        if (callback) callback();
    }, 3000); // Close the tab after 3 seconds
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

    // Main function to perform all actions in sequence
    function automateTicketInteraction() {
        console.log("Starting ticket interaction automation...");

        // Step 1: Show order parts modal
        const descriptionContent = getDescriptionBoxContent(); // Extract description content
        if (descriptionContent) {
            // Directly show the modal for ordering parts
            showOrderPartsModal(); // Show the modal as the first step

            // Continue the remaining steps after the modal is closed
            console.log("Order Parts modal displayed. Waiting for user interaction...");
        } else {
            alert("No valid description content found. Cannot proceed.");
            return; // Exit if no valid description box content
        }

    }



})();
