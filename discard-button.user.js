// ==UserScript==
// @name         SchoolDude Discard Automation
// @namespace    http://tampermonkey.net/
// @version      1.6.5
// @description  Adds a Discard button to SchoolDude and automates device discard notes and logging.
// @author       You
// @match        *://*.schooldude.com/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
    'use strict';

    console.log('[Discard] Script v1.6.4 loaded.');


    /* =========================================================
     * STYLES
     * ========================================================= */

    function injectStyles() {

        if (document.getElementById('discardAutomationStyles')) {
            return;
        }

        const style = document.createElement('style');

        style.id = 'discardAutomationStyles';

        style.textContent = `

            /* ============================
             * GENERIC MODAL BACKGROUND
             * ============================ */

            .discard-generic-overlay {
                position: fixed !important;

                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;

                display: flex !important;

                align-items: center !important;
                justify-content: center !important;

                padding: 20px !important;

                box-sizing: border-box !important;

                background:
                    rgba(15, 23, 42, 0.58) !important;

                backdrop-filter:
                    blur(8px) !important;

                -webkit-backdrop-filter:
                    blur(8px) !important;

                z-index:
                    2147483647 !important;
            }


            .discard-generic-modal {

                position: relative !important;

                display: block !important;

                visibility: visible !important;

                opacity: 1 !important;

                width: 480px !important;

                max-width:
                    calc(100vw - 40px) !important;

                max-height:
                    calc(100vh - 40px) !important;

                overflow-y: auto !important;

                box-sizing:
                    border-box !important;

                padding:
                    28px !important;

                background:
                    #ffffff !important;

                border:
                    1px solid rgba(15,23,42,.08) !important;

                border-radius:
                    16px !important;

                box-shadow:
                    0 24px 80px rgba(15,23,42,.32) !important;

                font-family:
                    "Segoe UI",
                    Arial,
                    sans-serif !important;

                color:
                    #0f172a !important;

                z-index:
                    2147483647 !important;
            }


            /* ============================
             * DISCARD REASON OVERLAY
             * ============================ */

            .discard-modal-background {

                position:
                    fixed !important;

                inset:
                    0 !important;

                display:
                    flex !important;

                align-items:
                    center !important;

                justify-content:
                    center !important;

                padding:
                    20px !important;

                box-sizing:
                    border-box !important;

                background:
                    rgba(15, 23, 42, 0.60) !important;

                backdrop-filter:
                    blur(9px) !important;

                -webkit-backdrop-filter:
                    blur(9px) !important;

                z-index:
                    2147483647 !important;
            }


            .discard-reason-modal {

                position:
                    relative !important;

                display:
                    block !important;

                visibility:
                    visible !important;

                opacity:
                    1 !important;

                width:
                    500px !important;

                max-width:
                    calc(100vw - 40px) !important;

                max-height:
                    calc(100vh - 40px) !important;

                overflow-y:
                    auto !important;

                box-sizing:
                    border-box !important;

                padding:
                    28px !important;

                background:
                    #ffffff !important;

                border:
                    1px solid rgba(15,23,42,.08) !important;

                border-radius:
                    18px !important;

                box-shadow:
                    0 28px 90px rgba(15,23,42,.35) !important;

                font-family:
                    "Segoe UI",
                    Arial,
                    sans-serif !important;

                color:
                    #0f172a !important;

                z-index:
                    2147483647 !important;

                animation:
                    discardModalIn .18s ease-out !important;
            }


            @keyframes discardModalIn {

                from {

                    opacity: 0;

                    transform:
                        translateY(6px)
                        scale(.985);

                }

                to {

                    opacity: 1;

                    transform:
                        translateY(0)
                        scale(1);

                }

            }


            .discard-reason-option {

                display:
                    flex !important;

                align-items:
                    center !important;

                gap:
                    12px !important;

                box-sizing:
                    border-box !important;

                width:
                    100% !important;

                padding:
                    12px 14px !important;

                margin-bottom:
                    8px !important;

                border:
                    1px solid #e2e8f0 !important;

                border-radius:
                    10px !important;

                background:
                    #ffffff !important;

                cursor:
                    pointer !important;

                transition:
                    border-color .15s ease,
                    background .15s ease,
                    box-shadow .15s ease !important;
            }


            .discard-reason-option:hover {

                background:
                    #f8fafc !important;

                border-color:
                    #cbd5e1 !important;
            }


            .discard-reason-option:has(input:checked) {

                background:
                    #eff6ff !important;

                border-color:
                    #60a5fa !important;

                box-shadow:
                    0 0 0 2px rgba(37,99,235,.06) !important;
            }


            .discard-reason-option input {

                width:
                    17px !important;

                height:
                    17px !important;

                margin:
                    0 !important;

                accent-color:
                    #2563eb !important;

                flex:
                    0 0 auto !important;
            }


            .discard-reason-option span {

                color:
                    #334155 !important;

                font-size:
                    14px !important;

                font-weight:
                    500 !important;
            }


            .discard-action-button {

                min-height:
                    40px !important;

                padding:
                    10px 18px !important;

                border-radius:
                    8px !important;

                font-family:
                    "Segoe UI",
                    Arial,
                    sans-serif !important;

                font-size:
                    14px !important;

                font-weight:
                    600 !important;

                cursor:
                    pointer !important;

                box-sizing:
                    border-box !important;
            }


            .discard-action-button.primary {

                border:
                    1px solid #2563eb !important;

                background:
                    #2563eb !important;

                color:
                    white !important;
            }


            .discard-action-button.primary:hover {

                background:
                    #1d4ed8 !important;

                border-color:
                    #1d4ed8 !important;
            }


            .discard-action-button.secondary {

                border:
                    1px solid #cbd5e1 !important;

                background:
                    #ffffff !important;

                color:
                    #334155 !important;
            }


            .discard-action-button.secondary:hover {

                background:
                    #f8fafc !important;
            }

        `;

        document.head.appendChild(style);
    }


    injectStyles();



    /* =========================================================
     * WAIT HELPER
     * ========================================================= */

    function waitForElement(
        selector,
        timeout = 12000,
        interval = 200
    ) {

        return new Promise((resolve, reject) => {

            const startTime = Date.now();

            const check = () => {

                const element =
                    document.querySelector(selector);

                if (element) {

                    resolve(element);

                    return;
                }

                if (
                    Date.now() - startTime >=
                    timeout
                ) {

                    reject(
                        new Error(
                            `Timed out waiting for: ${selector}`
                        )
                    );

                    return;
                }

                setTimeout(
                    check,
                    interval
                );
            };

            check();
        });
    }



    /* =========================================================
     * SET INPUT VALUE
     * ========================================================= */

    function setValueAndSimulateEvents(
        element,
        value
    ) {

        if (!element) {
            return;
        }

        try {
            element.focus();
        } catch (e) {}


        element.value = value;


        element.dispatchEvent(
            new Event(
                'input',
                {
                    bubbles: true
                }
            )
        );


        element.dispatchEvent(
            new Event(
                'keyup',
                {
                    bubbles: true
                }
            )
        );


        element.dispatchEvent(
            new Event(
                'change',
                {
                    bubbles: true
                }
            )
        );


        try {
            element.blur();
        } catch (e) {}
    }



    /* =========================================================
     * CHECKBOX HELPER
     * ========================================================= */

    function simulateCheckboxClick(
        checkbox
    ) {

        if (!checkbox) {

            console.warn(
                '[Discard] Checkbox not found.'
            );

            return;
        }


        if (checkbox.disabled) {

            console.warn(
                '[Discard] Checkbox is disabled:',
                checkbox.id
            );

            return;
        }


        if (checkbox.checked) {

            console.log(
                '[Discard] Checkbox already checked:',
                checkbox.id
            );

            return;
        }


        try {

            checkbox.click();

        } catch (error) {

            checkbox.dispatchEvent(
                new MouseEvent(
                    'mousedown',
                    {
                        bubbles: true
                    }
                )
            );


            checkbox.dispatchEvent(
                new MouseEvent(
                    'mouseup',
                    {
                        bubbles: true
                    }
                )
            );


            checkbox.dispatchEvent(
                new MouseEvent(
                    'click',
                    {
                        bubbles: true
                    }
                )
            );
        }


        if (!checkbox.checked) {

            checkbox.checked = true;


            checkbox.dispatchEvent(
                new Event(
                    'change',
                    {
                        bubbles: true
                    }
                )
            );
        }
    }



    /* =========================================================
     * GET DESCRIPTION
     * ========================================================= */

    function getDescriptionBoxContent() {

        const descriptionBox =
            document.getElementById(
                'base_inc_incident_description'
            );


        if (!descriptionBox) {

            return null;
        }


        const descriptionContent =
            descriptionBox.value ||
            descriptionBox.textContent;


        return (
            descriptionContent || ''
        ).trim();
    }



    /* =========================================================
     * PARSE DESCRIPTION
     * ========================================================= */

    function parseDescriptionContent(
        descriptionContent
    ) {

        if (!descriptionContent) {

            return {

                districtTag:
                    'Unknown',

                serialNumber:
                    'Unknown',

                modelNumber:
                    'Unknown'

            };
        }


        const districtTagMatch =
            descriptionContent.match(
                /District Tag:\s*([\w-]+)/i
            );


        const serialNumberMatch =
            descriptionContent.match(
                /Serial #:\s*([\w-]+)/i
            );


        const modelNumberMatch =
            descriptionContent.match(
                /Model Number:\s*([\w-]+)/i
            );


        const districtTag =
            districtTagMatch
                ? districtTagMatch[1].trim()
                : 'Unknown';


        const serialNumber =
            serialNumberMatch
                ? serialNumberMatch[1].trim()
                : 'Unknown';


        const modelNumber =
            modelNumberMatch
                ? modelNumberMatch[1].trim()
                : 'Unknown';


        return {

            districtTag,

            serialNumber,

            modelNumber

        };
    }



    /* =========================================================
     * SIGNED IN USER
     * ========================================================= */

    function getSignedInUser() {

        const toolbarElement =
            document.querySelector(
                '.x-toolbar-right .xtb-text span'
            );


        if (!toolbarElement) {

            return 'Unknown User';
        }


        const textContent =
            toolbarElement
                .textContent
                .trim();


        const userMatch =
            textContent.match(
                /Welcome\s+([\w.-]+@[\w.-]+)/i
            );


        if (
            !userMatch ||
            !userMatch[1]
        ) {

            return 'Unknown User';
        }


        return userMatch[1]
            .split(/[@.]/)[0];
    }



    /* =========================================================
     * GENERIC MESSAGE MODAL
     * ========================================================= */

    function showModal(
        contentHtml
    ) {

        document
            .querySelectorAll(
                '.discard-generic-overlay'
            )
            .forEach(
                element =>
                    element.remove()
            );


        const overlay =
            document.createElement('div');


        overlay.className =
            'discard-generic-overlay';


        const modal =
            document.createElement('div');


        modal.className =
            'discard-generic-modal';


        modal.innerHTML = `

            <button
                type="button"
                class="discardGenericClose"
                style="
                    position:absolute;
                    top:14px;
                    right:16px;

                    width:32px;
                    height:32px;

                    border:none;
                    border-radius:50%;

                    background:transparent;

                    color:#64748b;

                    font-size:24px;

                    line-height:28px;

                    cursor:pointer;
                "
            >
                ×
            </button>

            ${contentHtml}

        `;


        overlay.appendChild(
            modal
        );


        document.body.appendChild(
            overlay
        );


        modal
            .querySelector(
                '.discardGenericClose'
            )
            ?.addEventListener(
                'click',
                () => {

                    overlay.remove();
                }
            );


        return overlay;
    }



    /* =========================================================
     * CREATE DISCARD BUTTON
     * ========================================================= */

    function createDiscardButton() {

        const table =
            document.createElement(
                'table'
            );


        table.setAttribute(
            'cellspacing',
            '0'
        );


        table.setAttribute(
            'role',
            'presentation'
        );


        table.id =
            'DiscardButton';


        table.className =
            'x-btn x-component x-btn-noicon x-unselectable';


        table.style.cssText =
            'margin-right:5px;';


        table.unselectable =
            'on';



        const tbody =
            document.createElement(
                'tbody'
            );


        tbody.className =
            'x-btn-small x-btn-icon-small-left';



        const topRow =
            document.createElement(
                'tr'
            );


        topRow.innerHTML = `

            <td class="x-btn-tl">
                <i>&nbsp;</i>
            </td>

            <td class="x-btn-tc"></td>

            <td class="x-btn-tr">
                <i>&nbsp;</i>
            </td>

        `;



        const middleRow =
            document.createElement(
                'tr'
            );


        middleRow.innerHTML = `

            <td class="x-btn-ml">
                <i>&nbsp;</i>
            </td>

            <td class="x-btn-mc">

                <em
                    class=""
                    unselectable="on"
                >

                    <button
                        class="x-btn-text"
                        type="button"
                        style="
                            position:relative;
                            width:150px;
                        "
                        tabindex="0"
                    >
                        Discard
                    </button>

                </em>

            </td>

            <td class="x-btn-mr">
                <i>&nbsp;</i>
            </td>

        `;



        const bottomRow =
            document.createElement(
                'tr'
            );


        bottomRow.innerHTML = `

            <td class="x-btn-bl">
                <i>&nbsp;</i>
            </td>

            <td class="x-btn-bc"></td>

            <td class="x-btn-br">
                <i>&nbsp;</i>
            </td>

        `;



        tbody.appendChild(
            topRow
        );


        tbody.appendChild(
            middleRow
        );


        tbody.appendChild(
            bottomRow
        );


        table.appendChild(
            tbody
        );


        table.addEventListener(
            'click',
            (event) => {

                event.preventDefault();

                event.stopPropagation();


                console.log(
                    '[Discard] Discard button clicked.'
                );


                automateTicketInteraction();
            }
        );


        return table;
    }



    /* =========================================================
     * ADD DISCARD BUTTON TO FOOTER
     * ========================================================= */

    function addDiscardButtonToFooter() {

        const footers =
            document.querySelectorAll(
                '.x-panel-footer'
            );


        footers.forEach(
            footer => {

                const cloneTicketButton =
                    footer.querySelector(
                        'button#Clone_Ticket'
                    );


                if (!cloneTicketButton) {
                    return;
                }


                if (
                    footer.querySelector(
                        '#DiscardButton'
                    )
                ) {

                    return;
                }


                const toolbar =
                    footer.querySelector(
                        '.x-toolbar-left-row'
                    );


                if (!toolbar) {
                    return;
                }


                const discardButton =
                    createDiscardButton();


                const cell =
                    document.createElement(
                        'td'
                    );


                cell.className =
                    'x-toolbar-cell';


                cell.style.paddingLeft =
                    '10px';


                cell.appendChild(
                    discardButton
                );


                toolbar.appendChild(
                    cell
                );


                console.log(
                    '[Discard] Button added beside Clone Ticket.'
                );
            }
        );
    }



    /* =========================================================
     * WATCH PAGE FOR SCHOOLDUDE DYNAMIC CONTENT
     * ========================================================= */

    let footerObserverTimer = null;


    const observer =
        new MutationObserver(
            () => {

                clearTimeout(
                    footerObserverTimer
                );


                footerObserverTimer =
                    setTimeout(
                        addDiscardButtonToFooter,
                        100
                    );
            }
        );


    observer.observe(
        document.body,
        {

            childList:
                true,

            subtree:
                true

        }
    );


    window.addEventListener(
        'load',
        addDiscardButtonToFooter
    );


    addDiscardButtonToFooter();



    /* =========================================================
     * FIND NOTES TAB
     * ========================================================= */

    function findNotesTab() {

        const tabs =
            document.querySelectorAll(
                '.x-tab-strip.x-tab-strip-top li'
            );


        if (!tabs.length) {

            console.warn(
                '[Discard] No tabs found.'
            );

            return null;
        }


        for (
            const tab of tabs
        ) {

            const textSpan =
                tab.querySelector(
                    '.x-tab-strip-text'
                );


            if (!textSpan) {
                continue;
            }


            const tabText =
                textSpan
                    .textContent
                    .trim();


            if (
                tabText
                    .toLowerCase()
                    .startsWith('notes')
            ) {

                return tab;
            }
        }


        return null;
    }



    /* =========================================================
     * CLICK NOTES TAB
     * ========================================================= */

    function clickNotesTab() {

        const tab =
            findNotesTab();


        if (!tab) {

            console.error(
                '[Discard] Notes tab not found.'
            );

            return false;
        }


        console.log(
            '[Discard] Clicking Notes tab.'
        );


        try {

            tab.click();

        } catch (error) {

            console.warn(
                '[Discard] Normal tab click failed.',
                error
            );


            tab.dispatchEvent(
                new MouseEvent(
                    'click',
                    {
                        bubbles: true,
                        cancelable: true,
                        view: window
                    }
                )
            );
        }


        return true;
    }



    /* =========================================================
     * REASON MODAL
     * ========================================================= */

    function showReasonPopup() {

        console.log(
            '[Discard] Showing reason modal.'
        );


        document
            .querySelectorAll(
                '.discard-modal-background'
            )
            .forEach(
                element =>
                    element.remove()
            );


        const overlay =
            document.createElement(
                'div'
            );


        overlay.className =
            'discard-modal-background';



        const popup =
            document.createElement(
                'div'
            );


        popup.className =
            'discard-reason-modal';



        popup.innerHTML = `

            <button
                id="discardModalClose"
                type="button"

                aria-label="Close"

                style="
                    position:absolute;
                    top:14px;
                    right:16px;

                    width:34px;
                    height:34px;

                    display:flex;
                    align-items:center;
                    justify-content:center;

                    border:none;
                    border-radius:50%;

                    background:transparent;

                    color:#64748b;

                    font-size:25px;

                    line-height:1;

                    cursor:pointer;
                "
            >
                ×
            </button>



            <div
                style="
                    margin-bottom:7px;

                    color:#64748b;

                    font-size:11px;
                    font-weight:700;

                    letter-spacing:.10em;

                    text-transform:uppercase;
                "
            >
                Information Technology
            </div>



            <div
                style="
                    margin-bottom:7px;

                    color:#0f172a;

                    font-size:24px;
                    font-weight:700;

                    letter-spacing:-.02em;
                "
            >
                Reason for Discard
            </div>



            <div
                style="
                    margin-bottom:22px;

                    color:#64748b;

                    font-size:14px;

                    line-height:1.55;
                "
            >
                Select why this device is being removed from service.
            </div>



            <div
                id="discardReasonOptions"
            ></div>



            <div
                id="discardCustomContainer"

                style="
                    display:none;

                    margin-top:14px;
                "
            >

                <label
                    for="discardCustomReason"

                    style="
                        display:block;

                        margin-bottom:6px;

                        color:#334155;

                        font-size:13px;

                        font-weight:600;
                    "
                >
                    Custom discard reason
                </label>



                <input
                    id="discardCustomReason"

                    type="text"

                    autocomplete="off"

                    placeholder="Enter discard reason..."

                    style="
                        box-sizing:border-box;

                        width:100%;

                        padding:12px 14px;

                        border:1px solid #cbd5e1;

                        border-radius:9px;

                        background:#ffffff;

                        color:#0f172a;

                        font-family:
                            'Segoe UI',
                            Arial,
                            sans-serif;

                        font-size:14px;

                        outline:none;
                    "
                >

            </div>



            <div
                id="discardReasonError"

                style="
                    display:none;

                    margin-top:14px;

                    padding:10px 12px;

                    border:
                        1px solid #fecaca;

                    border-radius:
                        8px;

                    background:
                        #fef2f2;

                    color:
                        #b91c1c;

                    font-size:
                        13px;

                    line-height:
                        1.4;
                "
            >
            </div>



            <div
                style="
                    display:flex;

                    justify-content:flex-end;

                    gap:10px;

                    margin-top:24px;

                    padding-top:18px;

                    border-top:
                        1px solid #e2e8f0;
                "
            >

                <button
                    id="discardModalCancel"

                    type="button"

                    class="
                        discard-action-button
                        secondary
                    "
                >
                    Cancel
                </button>



                <button
                    id="discardModalContinue"

                    type="button"

                    class="
                        discard-action-button
                        primary
                    "
                >
                    Continue
                </button>

            </div>

        `;



        overlay.appendChild(
            popup
        );


        /*
         * Append directly to BODY.
         *
         * Important because SchoolDude
         * uses many nested ExtJS
         * containers.
         */

        document.body.appendChild(
            overlay
        );



        const reasons = [

            'Too many broken parts',

            'Bad Motherboard',

            'Bad Power Button',

            'Broken Screen',

            'Bad Battery',

            'Damaged Charging Port',

            'Liquid Damage',

            'Beyond Economical Repair',

            'Other Reason'

        ];



        const optionsContainer =
            popup.querySelector(
                '#discardReasonOptions'
            );



        reasons.forEach(
            reason => {

                const row =
                    document.createElement(
                        'label'
                    );


                row.className =
                    'discard-reason-option';


                const input =
                    document.createElement(
                        'input'
                    );


                input.type =
                    'radio';


                input.name =
                    'discardReason';


                input.value =
                    reason;



                const text =
                    document.createElement(
                        'span'
                    );


                text.textContent =
                    reason;



                row.appendChild(
                    input
                );


                row.appendChild(
                    text
                );


                optionsContainer.appendChild(
                    row
                );
            }
        );



        const customContainer =
            popup.querySelector(
                '#discardCustomContainer'
            );


        const customInput =
            popup.querySelector(
                '#discardCustomReason'
            );


        const errorBox =
            popup.querySelector(
                '#discardReasonError'
            );



        popup
            .querySelectorAll(
                'input[name="discardReason"]'
            )
            .forEach(
                input => {

                    input.addEventListener(
                        'change',
                        () => {

                            errorBox.style.display =
                                'none';


                            if (
                                input.value ===
                                'Other Reason'
                            ) {

                                customContainer.style.display =
                                    'block';


                                setTimeout(
                                    () => {

                                        customInput.focus();

                                    },
                                    50
                                );

                            } else {

                                customContainer.style.display =
                                    'none';
                            }
                        }
                    );
                }
            );



        function closeModal() {

            overlay.remove();
        }



        popup
            .querySelector(
                '#discardModalClose'
            )
            ?.addEventListener(
                'click',
                closeModal
            );



        popup
            .querySelector(
                '#discardModalCancel'
            )
            ?.addEventListener(
                'click',
                closeModal
            );



        popup
            .querySelector(
                '#discardModalContinue'
            )
            ?.addEventListener(
                'click',
                async () => {

                    const selected =
                        popup.querySelector(
                            'input[name="discardReason"]:checked'
                        );


                    if (!selected) {

                        errorBox.textContent =
                            'Please select a discard reason.';


                        errorBox.style.display =
                            'block';


                        return;
                    }



                    let reason =
                        selected.value;



                    if (
                        reason ===
                        'Other Reason'
                    ) {

                        reason =
                            (
                                customInput.value ||
                                ''
                            ).trim();


                        if (!reason) {

                            errorBox.textContent =
                                'Please enter the discard reason.';


                            errorBox.style.display =
                                'block';


                            customInput.focus();


                            return;
                        }
                    }



                    console.log(
                        '[Discard] Selected reason:',
                        reason
                    );


                    closeModal();



                    await openNewNoteAndDiscard(
                        reason
                    );
                }
            );



        customInput
            .addEventListener(
                'keydown',
                event => {

                    if (
                        event.key ===
                        'Enter'
                    ) {

                        event.preventDefault();


                        popup
                            .querySelector(
                                '#discardModalContinue'
                            )
                            ?.click();
                    }
                }
            );



        console.log(
            '[Discard] Reason modal added to document.body.'
        );
    }



    /* =========================================================
     * FIND NEW BUTTON
     * ========================================================= */

    function findNewNoteButton() {

        /*
         * First try the original
         * Notes-panel selector.
         */

        let button =
            document.querySelector(
                '#_p-Notes button#New'
            );


        if (button) {
            return button;
        }


        /*
         * Then try any visible
         * button with ID New.
         */

        const buttons =
            document.querySelectorAll(
                'button#New'
            );


        for (
            const candidate of buttons
        ) {

            const rect =
                candidate.getBoundingClientRect();


            if (
                rect.width > 0 &&
                rect.height > 0
            ) {

                return candidate;
            }
        }


        /*
         * Last fallback:
         * look for a visible button
         * whose text is New.
         */

        const allButtons =
            document.querySelectorAll(
                'button'
            );


        for (
            const candidate of allButtons
        ) {

            if (
                candidate
                    .textContent
                    .trim()
                    .toLowerCase() !==
                'new'
            ) {

                continue;
            }


            const rect =
                candidate.getBoundingClientRect();


            if (
                rect.width > 0 &&
                rect.height > 0
            ) {

                return candidate;
            }
        }


        return null;
    }



    /* =========================================================
     * WAIT FOR NEW BUTTON
     * ========================================================= */

    function waitForNewNoteButton(
        timeout = 12000
    ) {

        return new Promise(
            (resolve, reject) => {

                const start =
                    Date.now();


                function check() {

                    const button =
                        findNewNoteButton();


                    if (button) {

                        resolve(button);

                        return;
                    }


                    if (
                        Date.now() - start >
                        timeout
                    ) {

                        reject(
                            new Error(
                                'New Note button was not found.'
                            )
                        );

                        return;
                    }


                    setTimeout(
                        check,
                        200
                    );
                }


                check();
            }
        );
    }



    /* =========================================================
     * CLICK NEW NOTE BUTTON
     * ========================================================= */

    function clickSchoolDudeButton(
        button
    ) {

        if (!button) {
            return;
        }


        console.log(
            '[Discard] Clicking SchoolDude button:',
            button
        );


        /*
         * Start with normal click.
         */

        try {

            button.click();

        } catch (error) {

            console.warn(
                '[Discard] button.click() failed.',
                error
            );
        }
    }



    /* =========================================================
     * OPEN NEW NOTE AND DISCARD
     * ========================================================= */

    async function openNewNoteAndDiscard(
        reason
    ) {

        console.log(
            '[Discard] Beginning New Note automation.'
        );


        try {

            /*
             * Give Notes tab a brief
             * moment to become active.
             */

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        300
                    )
            );


            /*
             * Find SchoolDude New button.
             */

            const newButton =
                await waitForNewNoteButton(
                    12000
                );


            console.log(
                '[Discard] New Note button found.'
            );


            clickSchoolDudeButton(
                newButton
            );


            /*
             * Wait for note textarea.
             */

            const noteEditor =
                await waitForElement(
                    '#base_inc_notes_note_text',
                    12000,
                    200
                );


            console.log(
                '[Discard] New Note editor loaded.',
                noteEditor
            );


            /*
             * Give ExtJS a moment to
             * create its remaining
             * controls.
             */

            await new Promise(
                resolve =>
                    setTimeout(
                        resolve,
                        350
                    )
            );


            autofillForm(
                reason
            );


        } catch (error) {

            console.error(
                '[Discard] Unable to open New Note:',
                error
            );


            showModal(`

                <div
                    style="
                        margin-bottom:7px;

                        color:#dc2626;

                        font-size:11px;

                        font-weight:700;

                        letter-spacing:.09em;

                        text-transform:uppercase;
                    "
                >
                    Automation Error
                </div>


                <h2
                    style="
                        margin:
                            0 0 10px 0;

                        color:
                            #0f172a;

                        font-size:
                            22px;
                    "
                >
                    Couldn't Open New Note
                </h2>


                <p
                    style="
                        margin:
                            0 0 12px 0;

                        color:
                            #475569;

                        font-size:
                            14px;

                        line-height:
                            1.55;
                    "
                >
                    Your discard reason was selected,
                    but SchoolDude did not open the
                    New Note editor.
                </p>


                <p
                    style="
                        margin:
                            0;

                        color:
                            #64748b;

                        font-size:
                            13px;

                        line-height:
                            1.5;
                    "
                >
                    The console has additional diagnostic information.
                </p>

            `);
        }
    }



    /* =========================================================
     * AUTOFILL NOTE
     * ========================================================= */

    function autofillForm(
        reason
    ) {

        console.log(
            '[Discard] Filling New Note.'
        );


        const today =
            new Date()
                .toLocaleDateString();


        const noteContent =
            `DISCARDED: ${today}\n` +
            `ADDED TO INFORMATION TECHNOLOGY DISCARD LIST\n` +
            `REASON: ${reason}`;



        const noteTextarea =
            document.querySelector(
                '#base_inc_notes_note_text'
            );


        if (!noteTextarea) {

            console.error(
                '[Discard] Note textarea not found.'
            );


            showModal(`

                <h2
                    style="
                        margin:
                            0 0 10px 0;
                    "
                >
                    Note Editor Not Found
                </h2>

                <p
                    style="
                        color:#475569;
                        line-height:1.5;
                    "
                >
                    SchoolDude opened the Notes area,
                    but the note text field could not
                    be found.
                </p>

            `);


            return;
        }



        setValueAndSimulateEvents(
            noteTextarea,
            noteContent
        );


        console.log(
            '[Discard] Discard note entered.'
        );



        /*
         * Public checkbox.
         */

        const publicCheckbox =
            document.querySelector(
                '#note_public'
            );


        simulateCheckboxClick(
            publicCheckbox
        );



        /*
         * Resolution checkbox.
         */

        setTimeout(
            () => {

                const resolutionCheckbox =
                    document.querySelector(
                        '#note_resolution'
                    );


                simulateCheckboxClick(
                    resolutionCheckbox
                );



                /*
                 * Completed checkbox.
                 */

                setTimeout(
                    () => {

                        const completeCheckbox =
                            document.querySelector(
                                '#note_completed'
                            );


                        if (
                            completeCheckbox &&
                            !completeCheckbox.disabled
                        ) {

                            simulateCheckboxClick(
                                completeCheckbox
                            );
                        }



                        /*
                         * Save note.
                         */

                        simulateSaveButtonClick();

                    },
                    300
                );

            },
            300
        );



        /*
         * Send device to
         * discard spreadsheet.
         */

        sendToWebApp(
            reason
        );
    }



    /* =========================================================
     * SAVE NOTE
     * ========================================================= */

    function simulateSaveButtonClick() {

        console.log(
            '[Discard] Looking for Save button.'
        );


        setTimeout(
            () => {

                let saveButton =
                    document.querySelector(
                        '#_p-Notes button#Save'
                    );


                /*
                 * Fallback if SchoolDude
                 * changes panel structure.
                 */

                if (!saveButton) {

                    const buttons =
                        document.querySelectorAll(
                            'button#Save'
                        );


                    for (
                        const candidate of buttons
                    ) {

                        const rect =
                            candidate.getBoundingClientRect();


                        if (
                            rect.width > 0 &&
                            rect.height > 0
                        ) {

                            saveButton =
                                candidate;

                            break;
                        }
                    }
                }



                if (!saveButton) {

                    console.error(
                        '[Discard] Save button not found.'
                    );

                    return;
                }



                const ariaDisabled =
                    saveButton.getAttribute(
                        'aria-disabled'
                    );


                const htmlDisabled =
                    saveButton.disabled;



                if (
                    ariaDisabled === 'true' ||
                    htmlDisabled
                ) {

                    console.warn(
                        '[Discard] Save button is currently disabled.'
                    );


                    /*
                     * Wait another second
                     * because SchoolDude
                     * may still be updating.
                     */

                    setTimeout(
                        simulateSaveButtonClick,
                        1000
                    );


                    return;
                }



                console.log(
                    '[Discard] Clicking Save.'
                );


                try {

                    saveButton.click();

                } catch (error) {

                    saveButton.dispatchEvent(
                        new MouseEvent(
                            'click',
                            {
                                bubbles:
                                    true,

                                cancelable:
                                    true,

                                view:
                                    window
                            }
                        )
                    );
                }

            },
            600
        );
    }



    /* =========================================================
     * SEND TO GOOGLE SHEETS
     * ========================================================= */

    function sendToWebApp(
        reason
    ) {

        const descriptionContent =
            getDescriptionBoxContent();



        const {

            districtTag,

            serialNumber,

            modelNumber

        } =
            parseDescriptionContent(
                descriptionContent
            );



        const signedInUser =
            getSignedInUser();



        const currentDate =
            new Date()
                .toLocaleDateString();



        const comments =
            `${signedInUser} - ${currentDate}`;



        const siteInput =
            document.querySelector(
                '#base_inc_incident_rte_location'
            );



        const siteLocation =
            siteInput
                ? (
                    siteInput.value ||
                    siteInput.textContent ||
                    'Unknown'
                  ).trim()

                : 'Unknown';



        const AUTH_KEY =
            'discardWebAppAuthorized_v3';



        const alreadyAuthorized =
            localStorage.getItem(
                AUTH_KEY
            ) === 'true';



        const baseUrl =
            'https://script.google.com/a/macros/dinuba.k12.ca.us/s/AKfycby38UmH1PKPap-vPnV1_dwTpN-cmAGkDsDwRDjjQdHpvZsdkhLG8l17GC8PNFiuakxo_w/exec';



        const params =
            new URLSearchParams({

                equipmentType:
                    'Chromebook',

                makeModel:
                    modelNumber ||
                    'Unknown Model',

                whiteAssetTag:
                    districtTag ||
                    'Unknown Asset Tag',

                serialNumber:
                    serialNumber ||
                    'Unknown Serial Number',

                reason:
                    reason ||
                    'No Reason Provided',

                comments:
                    comments ||
                    'No Comments',

                site:
                    siteLocation ||
                    'Unknown Site'

            });



        if (alreadyAuthorized) {

            params.set(
                'autoClose',
                '1'
            );
        }



        const url =
            `${baseUrl}?${params.toString()}`;



        console.log(
            '[Discard] Sending device to Google Sheet.'
        );


        console.log(
            '[Discard] URL:',
            url
        );



        const tab =
            window.open(
                url,
                '_blank'
            );



        if (!alreadyAuthorized) {

            const authorizationModal =
                showModal(`

                    <div
                        style="
                            margin-bottom:7px;

                            color:#2563eb;

                            font-size:11px;

                            font-weight:700;

                            letter-spacing:.09em;

                            text-transform:uppercase;
                        "
                    >
                        One-Time Setup
                    </div>


                    <h2
                        style="
                            margin:
                                0 0 10px 0;

                            color:
                                #0f172a;

                            font-size:
                                22px;
                        "
                    >
                        Authorize Google Sheets
                    </h2>


                    <p
                        style="
                            color:#475569;

                            font-size:14px;

                            line-height:1.55;
                        "
                    >
                        A new browser tab has opened.
                        Complete Google's authorization
                        process, then return here.
                    </p>


                    <ol
                        style="
                            margin:
                                14px 0 20px 20px;

                            padding:0;

                            color:#475569;

                            font-size:14px;

                            line-height:1.75;
                        "
                    >

                        <li>
                            Click
                            <strong>
                                Review permissions
                            </strong>.
                        </li>

                        <li>
                            Select your district
                            Google account.
                        </li>

                        <li>
                            Click
                            <strong>
                                Allow
                            </strong>.
                        </li>

                        <li>
                            Wait until the page
                            shows
                            <strong>
                                Success
                            </strong>.
                        </li>

                        <li>
                            Return here and
                            click Continue.
                        </li>

                    </ol>


                    <div
                        style="
                            display:flex;

                            justify-content:flex-end;

                            gap:10px;

                            padding-top:18px;

                            border-top:
                                1px solid #e2e8f0;
                        "
                    >

                        <button
                            id="discardAuthCancel"

                            type="button"

                            class="
                                discard-action-button
                                secondary
                            "
                        >
                            Cancel
                        </button>


                        <button
                            id="discardAuthContinue"

                            type="button"

                            class="
                                discard-action-button
                                primary
                            "
                        >
                            Continue
                        </button>

                    </div>

                `);



            authorizationModal
                .querySelector(
                    '#discardAuthContinue'
                )
                ?.addEventListener(
                    'click',
                    () => {

                        localStorage.setItem(
                            AUTH_KEY,
                            'true'
                        );


                        authorizationModal.remove();


                        console.log(
                            '[Discard] Google authorization marked complete.'
                        );
                    }
                );



            authorizationModal
                .querySelector(
                    '#discardAuthCancel'
                )
                ?.addEventListener(
                    'click',
                    () => {

                        authorizationModal.remove();
                    }
                );

        } else {

            /*
             * Apps Script page normally
             * closes itself with autoClose,
             * but attempt to close it here
             * as a fallback.
             */

            setTimeout(
                () => {

                    try {

                        if (
                            tab &&
                            !tab.closed
                        ) {

                            tab.close();
                        }

                    } catch (error) {

                        console.warn(
                            '[Discard] Could not close Google tab.',
                            error
                        );
                    }

                },
                2500
            );
        }
    }



    /* =========================================================
     * MAIN DISCARD WORKFLOW
     * ========================================================= */

    async function automateTicketInteraction() {

        console.log(
            '[Discard] Starting discard workflow.'
        );


        /*
         * Verify ticket information exists.
         */

        const descriptionContent =
            getDescriptionBoxContent();



        if (!descriptionContent) {

            console.error(
                '[Discard] Ticket description could not be found.'
            );


            showModal(`

                <div
                    style="
                        margin-bottom:7px;

                        color:#dc2626;

                        font-size:11px;

                        font-weight:700;

                        letter-spacing:.09em;

                        text-transform:uppercase;
                    "
                >
                    Unable to Continue
                </div>


                <h2
                    style="
                        margin:
                            0 0 10px 0;

                        font-size:22px;

                        color:#0f172a;
                    "
                >
                    Device Information Missing
                </h2>


                <p
                    style="
                        margin:0;

                        color:#475569;

                        font-size:14px;

                        line-height:1.55;
                    "
                >
                    The device information could not
                    be found in this ticket's description.
                </p>

            `);


            return;
        }



        /*
         * Make sure Notes tab exists.
         */

        const notesTab =
            findNotesTab();



        if (!notesTab) {

            console.error(
                '[Discard] Notes tab not found.'
            );


            showModal(`

                <div
                    style="
                        margin-bottom:7px;

                        color:#dc2626;

                        font-size:11px;

                        font-weight:700;

                        letter-spacing:.09em;

                        text-transform:uppercase;
                    "
                >
                    Unable to Continue
                </div>


                <h2
                    style="
                        margin:
                            0 0 10px 0;

                        font-size:22px;

                        color:#0f172a;
                    "
                >
                    Notes Tab Not Found
                </h2>


                <p
                    style="
                        margin:0;

                        color:#475569;

                        font-size:14px;

                        line-height:1.55;
                    "
                >
                    The Notes tab could not be located
                    on this SchoolDude ticket.
                </p>

            `);


            return;
        }



        /*
         * Open Notes.
         */

        clickNotesTab();



        /*
         * IMPORTANT:
         *
         * The Reason modal no longer
         * depends on SchoolDude's
         * New Note button.
         *
         * This means the modal should
         * appear even if Notes takes a
         * little while to finish loading.
         */

        setTimeout(
            () => {

                showReasonPopup();

            },
            250
        );
    }



})();
