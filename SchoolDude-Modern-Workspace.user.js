// ==UserScript==
// @name         SchoolDude Modern Workspace
// @namespace    dinuba.helpdesk.theme
// @version      5.2.0
// @description  Complete visual theme: typography, navigation, buttons, icons, grids, forms, filters, tabs, menus, and dialogs.
// @match        https://*.insight.schooldude.com/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(() => {
  'use strict';
  if (document.getElementById('dinuba-modern-workspace-theme')) return;
  let css = `
    body[data-dinuba-modern] {
      --dw-ink:#24344b; --dw-muted:#738298; --dw-blue:#2563eb;
      --dw-line:#e3e9f2; --dw-canvas:#f3f6fb; --dw-nav:#142137;
      color:var(--dw-ink); background:var(--dw-canvas)!important;
      font-family:'Segoe UI',Arial,sans-serif;
      -webkit-font-smoothing:antialiased;
    }
    /* Surface changes only: GXT retains ownership of position and geometry. */
    body[data-dinuba-modern] :is(.x-panel-body,.x-grid3,.x-grid3-scroller) {
      background-color:#fff!important; color:var(--dw-ink);
    }
    body[data-dinuba-modern] .x-panel-header {
      background-image:none!important; background-color:#f8fafd!important;
      border-color:var(--dw-line)!important; color:var(--dw-ink)!important;
      box-shadow:inset 0 -1px var(--dw-line);
    }
    body[data-dinuba-modern] .x-panel-header-text {
      font-family:'Segoe UI',Arial,sans-serif!important;
      font-weight:650!important; color:inherit!important;
    }
    body[data-dinuba-modern] :is(.x-panel-tbar,.x-panel-bbar,.x-panel-footer) {
      background:#f8fafd!important; border-color:var(--dw-line)!important;
    }
    body[data-dinuba-modern] .x-toolbar:not(.sl-head-image) {
      background-image:none!important; background-color:#f8fafd!important;
      border-color:var(--dw-line)!important;
    }
    body[data-dinuba-modern] :is(.xtb-text,.my-paging-text,.my-paging-display) {
      font-family:'Segoe UI',Arial,sans-serif!important; color:#64748b!important;
    }

    /* Deep slate masthead; the district logo and original icon sprites remain. */
    body[data-dinuba-modern] .sl-head {
      background:#101c30!important; border:0!important;
      box-shadow:inset 0 -1px #ffffff12;
    }
    body[data-dinuba-modern] .sl-head :is(.sl-head-menu,.sl-head-tools) {
      background:transparent!important; border-color:transparent!important;
    }
    body[data-dinuba-modern] .sl-head .sl-head-image {
      background-color:#101c30!important;
    }
    body[data-dinuba-modern] .sl-head :is(.x-btn-text,.xtb-text) {
      color:#dce7f7!important; text-shadow:none!important;
    }
    body[data-dinuba-modern] .sl-head .x-btn {
      background:transparent!important; box-shadow:none!important;
    }
    body[data-dinuba-modern] .sl-head .x-btn:is(:hover,.x-btn-over) {
      background:#ffffff0d!important;
    }
    body[data-dinuba-modern] .sl-head .x-btn.sl-head-menu-sel {
      background:#ffffff12!important; box-shadow:inset 0 -3px #60a5fa!important;
    }
    body[data-dinuba-modern] .sl-head .sl-head-search input {
      background:#1f304b!important; border-color:#3a4c67!important;
      color:#f1f5f9!important; border-radius:7px!important;
    }
    body[data-dinuba-modern] #products-list {
      background:#1f304b!important; color:#e2e8f0!important;
      border:1px solid #3a4c67!important; border-radius:5px!important;
    }
    body[data-dinuba-modern] .sl-top-toolbar {
      background:#edf2f9!important; box-shadow:inset 0 -1px #dde5f0;
    }
    body[data-dinuba-modern] .sl-top-toolbar .sl-top-toolbar-sel {
      color:#1d4ed8!important;
    }

    /* Navigation stays within its existing scrollable panel. */
    body[data-dinuba-modern] .navigation-panel,
    body[data-dinuba-modern] .navigation-panel :is(.x-panel-body,.x-panel-header,.x-view) {
      background:#142137!important; color:#b9c7db!important;
      border-color:#25344b!important;
    }
    body[data-dinuba-modern] .navigation-panel .x-panel-header {
      box-shadow:inset 0 -1px #ffffff0a;
    }
    body[data-dinuba-modern] .navigation-panel .x-panel-header-text {
      color:#ecf3ff!important;
    }
    body[data-dinuba-modern] .navigation-panel .x-view-item {
      margin:3px 7px; padding:7px 8px; border-radius:7px;
      font:12px/1.45 'Segoe UI',Arial,sans-serif;
      color:#bdcce0!important; border:0!important;
      background:transparent!important;
      transition:background-color .12s,color .12s;
    }
    body[data-dinuba-modern] .navigation-panel .x-view-item:hover {
      background:#ffffff09!important; color:#fff!important;
    }
    body[data-dinuba-modern] .navigation-panel .x-view-item:is(.x-view-highlightrow,.x-view-item-sel,.x-view-item-selected) {
      background:#244067!important; color:#f1f6ff!important;
      box-shadow:inset 3px 0 #60a5fa;
    }
    body[data-dinuba-modern] .navigation-panel .x-view-item>span>span:last-child:not([qtip]) {
      color:#a7bbd6!important; font-variant-numeric:tabular-nums;
      font-size:11px;
    }
    body[data-dinuba-modern] .navigation-panel .x-view-item>span>span[style*="font-weight: bold"] {
      color:#7891b1!important; font-size:10px; letter-spacing:.8px;
      text-transform:uppercase;
    }

    /* Strip the old button-frame backgrounds, while keeping the frame cells. */
    body[data-dinuba-modern] table.x-btn {
      background:#fff!important; border-radius:6px;
      box-shadow:inset 0 0 0 1px #cad6e6,0 1px 2px #172b4308;
      transition:background-color .12s,box-shadow .12s;
    }
    body[data-dinuba-modern] .x-btn :is(.x-btn-tl,.x-btn-tc,.x-btn-tr,.x-btn-ml,.x-btn-mc,.x-btn-mr,.x-btn-bl,.x-btn-bc,.x-btn-br) {
      background-image:none!important; background-color:transparent!important;
    }
    body[data-dinuba-modern] .x-btn .x-btn-text {
      font-family:'Segoe UI',Arial,sans-serif!important;
      font-weight:550!important; color:#345578!important;
      text-shadow:none!important; cursor:pointer;
    }
    body[data-dinuba-modern] table.x-btn:is(:hover,.x-btn-over) {
      background:#eff6ff!important;
      box-shadow:inset 0 0 0 1px #8eafe2,0 2px 5px #2563eb0c;
    }
    body[data-dinuba-modern] table.x-btn.x-btn-click {
      background:#e0edff!important;
    }
    body[data-dinuba-modern] table.x-btn[data-dw-action="primary"] {
      background:#2563eb!important; box-shadow:inset 0 0 0 1px #2563eb,0 2px 5px #2563eb22;
    }
    body[data-dinuba-modern] table.x-btn[data-dw-action="primary"] .x-btn-text {
      color:#fff!important;
    }
    body[data-dinuba-modern] table.x-btn[data-dw-action="primary"]:hover {
      background:#1d4ed8!important;
    }
    body[data-dinuba-modern] table.x-btn.x-item-disabled {
      background:#f1f4f8!important; box-shadow:inset 0 0 0 1px #e7edf4!important;
    }
    body[data-dinuba-modern] table.x-btn.x-item-disabled .x-btn-text {
      color:#a5afbc!important; cursor:default;
    }
    body[data-dinuba-modern] [data-dw-footer]>td.x-toolbar-cell {
      padding-right:8px!important; vertical-align:middle!important;
    }
    body[data-dinuba-modern] [data-dw-footer]>td.x-toolbar-cell:last-child {
      padding-right:0!important;
    }
    body[data-dinuba-modern] [data-dw-footer]>td.x-toolbar-cell>table.x-btn {
      margin:0!important;
    }

    /* Keep grid cell widths, padding, and row heights controlled by the app. */
    body[data-dinuba-modern] .x-grid3-header {
      background-image:none!important; background-color:#f0f4fa!important;
      border-color:#dce5f0!important;
    }
    body[data-dinuba-modern] .x-grid3-hd-inner {
      color:#536982!important; font-family:'Segoe UI',Arial,sans-serif!important;
      font-weight:650!important; text-shadow:none!important;
    }
    body[data-dinuba-modern] .x-grid3-hd-inner>span {color:#536982!important}
    body[data-dinuba-modern] .x-grid3-row {
      background-color:#fff!important; border-color:#e8edf5!important;
    }
    body[data-dinuba-modern] .x-grid3-row-alt {background-color:#f8fafd!important}
    body[data-dinuba-modern] .x-grid3-row:nth-child(even) {background-color:#f8fafd!important}
    body[data-dinuba-modern] .x-grid3-cell {
      border-color:#e8edf5!important; color:#334155;
    }
    body[data-dinuba-modern] .x-grid3-cell-inner {
      font-family:'Segoe UI',Arial,sans-serif!important;
    }
    body[data-dinuba-modern] .x-grid3-row:is(:hover,.x-grid3-row-over) {
      background-color:#f0f6ff!important;
    }
    body[data-dinuba-modern] .x-grid3-row.x-grid3-row-selected {
      background-color:#e8f0ff!important; border-color:#c7d9fb!important;
    }
    body[data-dinuba-modern] .x-grid3-cell-selected {
      background-color:#dce9ff!important; box-shadow:inset 0 0 0 1px #93b6f3;
    }
    body[data-dinuba-modern] [class~="x-grid3-col-base.inc_incident.id"] {
      font-weight:700; color:#2563eb!important; font-variant-numeric:tabular-nums;
    }
    body[data-dinuba-modern] [class~="x-grid3-col-base.inc_incident.assigned_to"] {
      color:#40628b;
    }
    body[data-dinuba-modern] [data-dw-status="unassigned"] {
      color:#b45309!important; font-weight:650;
    }
    body[data-dinuba-modern] [data-dw-status="new"] {color:#1d4ed8!important}
    body[data-dinuba-modern] [data-dw-status="working"] {color:#7c3aed!important}
    body[data-dinuba-modern] [data-dw-status="complete"] {color:#047857!important}
    body[data-dinuba-modern] [data-dw-status="waiting"] {color:#a16207!important}
    body[data-dinuba-modern] .x-grid3-dirty-cell {box-shadow:inset 3px 0 #f59e0b}

    /* Inputs keep their original dimensions and trigger geometry. */
    body[data-dinuba-modern] :is(input.x-form-text,textarea.x-form-textarea,.gwt-TextBox) {
      background-color:#fff!important; background-image:none!important;
      border-color:#cbd7e6!important; border-radius:5px;
      color:#24344b!important; font-family:'Segoe UI',Arial,sans-serif!important;
    }
    body[data-dinuba-modern] :is(input.x-form-text,textarea.x-form-textarea,.gwt-TextBox):focus {
      border-color:#7da4ee!important; outline:2px solid #bfdbfe!important; outline-offset:0;
    }
    body[data-dinuba-modern] .x-form-empty-field {color:#8c9bb0!important}
    body[data-dinuba-modern] .x-form-item-label {
      color:#52657d!important; font-family:'Segoe UI',Arial,sans-serif!important;
    }
    body[data-dinuba-modern] .x-combo-list {
      border-color:#d3ddea!important; border-radius:8px;
      background:#fff!important; box-shadow:0 12px 30px #172b4326;
    }
    body[data-dinuba-modern] .x-combo-list-inner {background:#fff!important}
    body[data-dinuba-modern] .x-combo-list-item {
      color:#334155!important; border-color:transparent!important;
      font-family:'Segoe UI',Arial,sans-serif!important;
    }
    body[data-dinuba-modern] .x-combo-list-item:is(:hover,.x-combo-selected,.x-view-highlightrow) {
      background:#edf4ff!important; border-color:#edf4ff!important; color:#1d4ed8!important;
    }
    body[data-dinuba-modern] :is(.x-menu,.x-window) {
      border-color:#cfdae8!important; border-radius:9px;
      box-shadow:0 14px 40px #172b4322;
    }
    body[data-dinuba-modern] :is(.x-menu-list,.x-window-body) {background-color:#fff!important}
    body[data-dinuba-modern] .x-menu-item-active {
      background:#eff6ff!important; border-color:#dbeafe!important;
    }
    body[data-dinuba-modern] .page-toolbar {background:#f6f9fd!important}
    body[data-dinuba-modern] .xtb-sep {opacity:.35}
    body[data-dinuba-modern] button:focus-visible {
      outline:2px solid #60a5fa!important; outline-offset:2px;
    }
    body[data-dinuba-modern] .x-grid3-scroller::-webkit-scrollbar,
    body[data-dinuba-modern] .navigation-panel .x-panel-body::-webkit-scrollbar {width:11px;height:11px}
    body[data-dinuba-modern] .x-grid3-scroller::-webkit-scrollbar-thumb {
      background:#bccbde;border:3px solid #f4f7fb;border-radius:8px;
    }
    body[data-dinuba-modern] .x-grid3-scroller::-webkit-scrollbar-track {background:#f4f7fb}
    body[data-dinuba-modern] .navigation-panel .x-panel-body::-webkit-scrollbar-thumb {
      background:#3c506e;border:3px solid #142137;border-radius:8px;
    }
    @media(prefers-reduced-motion:reduce){body[data-dinuba-modern] *{transition:none!important}}
    @media print {body[data-dinuba-modern]{background:#fff!important}}
  `;
  // Comprehensive second layer for the rest of the legacy GXT components.
  css += `
    body[data-dinuba-modern] {
      --dw-font:'Segoe UI Variable Text','Segoe UI',Arial,sans-serif;
      --dw-ink:#213047;--dw-muted:#7a8a9f;--dw-line:#e4eaf3;
      --dw-blue:#4f46e5;--dw-canvas:#f4f6fc;--dw-nav:#111b30;
      font-family:var(--dw-font)!important;color-scheme:light;
    }
    body[data-dinuba-modern] :is(div,span,td,th,p,label,a,button,input,textarea,select,legend,li,option) {
      font-family:var(--dw-font)!important;text-shadow:none!important;
    }
    body[data-dinuba-modern] :is(button,input,textarea,select) {font-synthesis:none}
    body[data-dinuba-modern] :is(.x-component,.x-panel,.x-panel-body,.x-form-field) {color:var(--dw-ink)}
    body[data-dinuba-modern] :is(a.link,a.data-reference,.data-reference) {
      color:#4f46e5!important;text-decoration:none!important;font-weight:550;
    }
    body[data-dinuba-modern] :is(a.link,a.data-reference,.data-reference):hover {
      color:#3730a3!important;text-decoration:underline!important;text-underline-offset:3px;
    }
    body[data-dinuba-modern] ::selection {background:#c7d2fe;color:#1e1b4b}
    body[data-dinuba-modern] .x-viewport {background:#f4f6fc!important}
    body[data-dinuba-modern] :is(.x-panel-bwrap,.x-panel-body,.x-column-layout-ct) {border-color:#e4eaf3!important}
    body[data-dinuba-modern] .x-panel-header {
      background:#fff!important;box-shadow:inset 0 -1px #e9edf5;
    }
    body[data-dinuba-modern] .x-panel-header-text {
      font-size:13px!important;font-weight:700!important;letter-spacing:-.2px;
    }
    body[data-dinuba-modern] #Main {box-shadow:inset 1px 0 #e4eaf3}
    body[data-dinuba-modern] #Main .component-panel-with-icon>.x-panel-header:not(.x-hide-display) {
      background:linear-gradient(100deg,#fff,#f7f8ff)!important;
    }
    body[data-dinuba-modern] .x-panel-inline-icon {border-radius:5px}

    /* Midnight navigation, with a clear hierarchy and compact count badges. */
    body[data-dinuba-modern] .sl-head {background:#0c1425!important;box-shadow:inset 0 -1px #ffffff0d}
    body[data-dinuba-modern] .sl-head .sl-head-image {background-color:#0c1425!important}
    body[data-dinuba-modern] .sl-head .x-btn .x-btn-text {font-weight:600!important;font-size:12px!important;color:#cbd5e8!important}
    body[data-dinuba-modern] .sl-head .x-btn.sl-head-menu-sel {
      background:linear-gradient(180deg,#818cf819,#818cf807)!important;
      box-shadow:inset 0 -3px #a5b4fc!important;
    }
    body[data-dinuba-modern] .sl-head .x-btn.sl-head-menu-sel .x-btn-text {color:#fff!important}
    body[data-dinuba-modern] .sl-head .xtb-text {font-size:10px!important;letter-spacing:.2px;color:#8da1c2!important}
    body[data-dinuba-modern] .sl-head-search input {box-shadow:inset 0 0 0 1px #ffffff08}
    body[data-dinuba-modern] .sl-top-toolbar {background:#eef1f9!important;box-shadow:inset 0 -1px #e0e6f2}
    body[data-dinuba-modern] .sl-top-toolbar .xtb-text,
    body[data-dinuba-modern] .sl-top-toolbar .xtb-text span {color:#718096!important;font-size:11px!important}
    body[data-dinuba-modern] .sl-top-toolbar .x-btn {
      background:#fff9!important;box-shadow:inset 0 0 0 1px #dce3f1!important;border-radius:5px;
    }
    body[data-dinuba-modern] .sl-top-toolbar .x-btn-text {color:#4f46e5!important;font-weight:650!important}
    body[data-dinuba-modern] .navigation-panel,
    body[data-dinuba-modern] .navigation-panel :is(.x-panel-body,.x-panel-header,.x-view,.x-panel-footer) {
      background:#111b30!important;border-color:#20304b!important;color:#b8c6de!important;
    }
    body[data-dinuba-modern] .navigation-panel .x-panel-header-text {
      color:#94a8c7!important;font-size:11px!important;text-transform:uppercase;letter-spacing:1px;
    }
    body[data-dinuba-modern] .navigation-panel .x-view-item {
      background:transparent!important;color:#aebdd6!important;border-radius:8px;
      font-size:12px!important;font-weight:500;line-height:1.5;
      margin:3px 8px;padding:8px 9px;
    }
    body[data-dinuba-modern] .navigation-panel .x-view-item [qtip]::before {
      content:'';display:inline-block;width:5px;height:5px;border-radius:2px;
      background:#647a9b;margin:0 9px 2px 0;vertical-align:middle;
    }
    body[data-dinuba-modern] .navigation-panel .x-view-item>span>span:last-child:not([qtip]):not([style*="font-weight"]) {
      flex:0 0 auto!important;background:#ffffff0b;color:#8fa5c6!important;
      border-radius:5px;padding:0 5px;min-width:22px;text-align:center!important;
      font-size:10px!important;font-weight:650;
    }
    body[data-dinuba-modern] .navigation-panel .x-view-item:has([data-dw-nav-section]) {
      box-shadow:none!important;background:transparent!important;cursor:default;
    }
    body[data-dinuba-modern] .navigation-panel [data-dw-nav-section] {
      background:transparent!important;padding:0!important;color:#697e9f!important;
      font-size:9px!important;font-weight:700!important;letter-spacing:1.3px;
      text-transform:uppercase;
    }
    body[data-dinuba-modern] .navigation-panel .x-view-item:is(.x-view-highlightrow,.x-view-item-sel,.x-view-item-selected) {
      background:linear-gradient(100deg,#4f46e542,#4f46e51c)!important;
      color:#e7eaff!important;box-shadow:inset 3px 0 #a5b4fc;
    }
    body[data-dinuba-modern] .navigation-panel .x-view-item:is(.x-view-highlightrow,.x-view-item-sel,.x-view-item-selected) [qtip]::before {background:#a5b4fc}

    /* Modern button faces, including plain buttons injected by other scripts. */
    body[data-dinuba-modern] table.x-btn {
      border-radius:7px;background:#fff!important;
      box-shadow:inset 0 0 0 1px #d5deed,0 2px 3px #1e293b06;
    }
    body[data-dinuba-modern] .x-btn .x-btn-text {
      color:#415571!important;font-size:12px!important;font-weight:600!important;letter-spacing:.05px;
    }
    body[data-dinuba-modern] table.x-btn:is(:hover,.x-btn-over) {
      background:#f4f3ff!important;box-shadow:inset 0 0 0 1px #b2acf0,0 3px 8px #4f46e511;
    }
    body[data-dinuba-modern] table.x-btn.x-btn-click {background:#eceafe!important;box-shadow:inset 0 0 0 1px #a69eea}
    body[data-dinuba-modern] table.x-btn[data-dw-action="primary"] {
      background:linear-gradient(130deg,#6366f1,#4f46e5)!important;
      box-shadow:inset 0 0 0 1px #4f46e5,0 3px 8px #4f46e52b;
    }
    body[data-dinuba-modern] table.x-btn[data-dw-action="primary"] .x-btn-text {color:#fff!important}
    body[data-dinuba-modern] table.x-btn[data-dw-action="primary"]:is(:hover,.x-btn-over) {
      background:linear-gradient(130deg,#5558e9,#4338ca)!important;
    }
    body[data-dinuba-modern] table.x-btn[data-dw-action="secondary"] {
      background:#f0f3ff!important;box-shadow:inset 0 0 0 1px #d8defa;
    }
    body[data-dinuba-modern] table.x-btn[data-dw-action="secondary"] .x-btn-text {color:#4f46e5!important}
    body[data-dinuba-modern] table.x-btn[data-dw-action="danger"] {
      background:#fff5f5!important;box-shadow:inset 0 0 0 1px #f3cece;
    }
    body[data-dinuba-modern] table.x-btn[data-dw-action="danger"] .x-btn-text {color:#c24141!important}
    body[data-dinuba-modern] table.x-btn.x-item-disabled {
      background:#f3f5f8!important;box-shadow:inset 0 0 0 1px #e7ecf3!important;opacity:.7;
    }
    body[data-dinuba-modern] table.x-btn.x-item-disabled .x-btn-text {color:#9aa7b8!important}
    body[data-dinuba-modern] .x-btn.x-btn-focus {outline:2px solid #a5b4fc;outline-offset:2px}
    body[data-dinuba-modern] button:not(.x-btn-text):not(#dinuba-print-dialog button):not(#dw-shell button) {
      font-size:12px;font-weight:600;color:#425370;
      background:#fff;border:1px solid #d7dfee;border-radius:7px;
      box-shadow:0 1px 2px #1e293b08;cursor:pointer;
    }
    body[data-dinuba-modern] button:not(.x-btn-text):not(#dinuba-print-dialog button):not(#dw-shell button):hover {
      background:#f4f3ff;border-color:#b8b2ed;
    }
    body[data-dinuba-modern] button:disabled {cursor:default!important;opacity:.6}

    /* Tab strips and filter/query builders no longer use the old blue gradients. */
    body[data-dinuba-modern] :is(.x-tab-panel-header,.x-tab-strip-wrap,.x-tab-strip,.x-tab-strip-spacer) {
      background:#eef1f8!important;background-image:none!important;border-color:#e0e6f0!important;
    }
    body[data-dinuba-modern] .x-tab-strip :is(.x-tab-left,.x-tab-right,.x-tab-strip-inner) {
      background-image:none!important;background-color:transparent!important;
    }
    body[data-dinuba-modern] .x-tab-strip-text {
      color:#718198!important;font-size:12px!important;font-weight:600!important;
    }
    body[data-dinuba-modern] .x-tab-strip-active {
      background:#fff!important;box-shadow:inset 0 -3px #6366f1;border-radius:7px 7px 0 0;
    }
    body[data-dinuba-modern] .x-tab-strip-active .x-tab-strip-text {color:#4f46e5!important}
    body[data-dinuba-modern] .x-tab-panel-body {border-color:#e4eaf3!important;background:#fff!important}
    body[data-dinuba-modern] .filter-panel,
    body[data-dinuba-modern] .filter-panel :is(.x-panel-body,.x-toolbar,.x-panel-header) {
      background:#f8faff!important;border-color:#e5eaf4!important;
    }
    body[data-dinuba-modern] .filter-panel :is(.x-form-label,.x-form-item-label,.xtb-text) {
      font-size:11px!important;font-weight:600;color:#62758e!important;
    }
    body[data-dinuba-modern] .filter-panel .x-form-field {font-size:12px!important}
    body[data-dinuba-modern] :is(.dashed-line,.dashed-line-start,.dashed-pointer) {border-color:#c6d2e6!important}
    body[data-dinuba-modern] .hbar {color:#72829b!important}
    body[data-dinuba-modern] .x-vsplitbar {background:#e9edf5!important;background-image:none!important}

    /* A calmer, sharper ticket table with readable text at the existing density. */
    body[data-dinuba-modern] .x-grid3-header {
      background:#f1f4fa!important;box-shadow:inset 0 -1px #dce4f0;
    }
    body[data-dinuba-modern] .x-grid3-hd-inner,
    body[data-dinuba-modern] .x-grid3-hd-inner>span {
      color:#52667f!important;font-size:11px!important;font-weight:700!important;letter-spacing:.15px;
    }
    body[data-dinuba-modern] .x-grid3-hd:hover {background:#e9edf8!important}
    body[data-dinuba-modern] .x-grid3-cell-inner {
      font-size:12px!important;color:#43536b!important;font-weight:400;
    }
    body[data-dinuba-modern] .x-grid3-row {border-color:#edf0f6!important}
    body[data-dinuba-modern] .x-grid3-cell {border-right-color:#edf0f6!important;border-bottom-color:#edf0f6!important}
    body[data-dinuba-modern] .x-grid3-row:nth-child(even) {background:#fafbfe!important}
    body[data-dinuba-modern] .x-grid3-row:is(:hover,.x-grid3-row-over) {background:#f1f3ff!important}
    body[data-dinuba-modern] .x-grid3-row.x-grid3-row-selected {
      background:#edefff!important;border-color:#d2d5fc!important;box-shadow:inset 3px 0 #6366f1;
    }
    body[data-dinuba-modern] .x-grid3-cell-selected {background:#e1e5ff!important;box-shadow:inset 0 0 0 1px #a5b4fc}
    body[data-dinuba-modern] [class~="x-grid3-col-base.inc_incident.id"] {
      color:#4f46e5!important;font-weight:750!important;font-variant-numeric:tabular-nums;
    }
    body[data-dinuba-modern] [class~="x-grid3-col-base.inc_incident.description"] {color:#25364f!important;font-weight:500}
    body[data-dinuba-modern] [class~="x-grid3-col-base.inc_incident.rte_location"] {color:#4b6281!important;font-weight:550}
    body[data-dinuba-modern] [class~="x-grid3-col-base.inc_incident.assigned_to"] {color:#6174a0!important;font-size:11px!important}
    body[data-dinuba-modern] :is([class~="x-grid3-col-base.inc_incident.created_on"],[class~="x-grid3-col-base.inc_incident.last_updated_on"]) {
      color:#8a96a9!important;font-size:11px!important;font-variant-numeric:tabular-nums;
    }
    body[data-dinuba-modern] .x-grid3-cell-inner[data-dw-status] {font-weight:650!important}
    body[data-dinuba-modern] .x-grid3-cell-inner[data-dw-status]>span {
      border-radius:5px;padding:1px 5px;font-size:11px!important;box-decoration-break:clone;
    }
    body[data-dinuba-modern] .x-grid3-cell-inner[data-dw-status="new"] {color:#4338ca!important}
    body[data-dinuba-modern] .x-grid3-cell-inner[data-dw-status="new"]>span {background:#e9e7ff}
    body[data-dinuba-modern] .x-grid3-cell-inner[data-dw-status="working"] {color:#7c3aed!important}
    body[data-dinuba-modern] .x-grid3-cell-inner[data-dw-status="working"]>span {background:#f0e8ff}
    body[data-dinuba-modern] .x-grid3-cell-inner[data-dw-status="complete"] {color:#047857!important}
    body[data-dinuba-modern] .x-grid3-cell-inner[data-dw-status="complete"]>span {background:#e2f5eb}
    body[data-dinuba-modern] .x-grid3-cell-inner:is([data-dw-status="waiting"],[data-dw-status="unassigned"]) {color:#a16207!important}
    body[data-dinuba-modern] .x-grid3-cell-inner:is([data-dw-status="waiting"],[data-dw-status="unassigned"])>span {background:#fff0d2}
    body[data-dinuba-modern] .x-grid3-row-body {color:#5d6f89!important;background:#f7f9ff!important}
    body[data-dinuba-modern] .page-toolbar,
    body[data-dinuba-modern] .x-panel-fbar {background:#fbfcff!important;box-shadow:inset 0 1px #e5eaf3}
    body[data-dinuba-modern] .page-toolbar :is(.my-paging-text,.my-paging-display,.xtb-text) {color:#7e8ca3!important;font-size:11px!important}
    body[data-dinuba-modern] .page-toolbar .x-btn {background:transparent!important;box-shadow:none!important}
    body[data-dinuba-modern] .page-toolbar .x-btn:hover {background:#edefff!important}

    /* Text fields, validation, selects, and form labels share one visual language. */
    body[data-dinuba-modern] :is(input,textarea,select):not([type=checkbox],[type=radio],[type=hidden],[type=button],[type=submit]) {
      font-family:var(--dw-font)!important;color:#334563!important;
      border-color:#ccd7e8!important;border-radius:6px!important;
      background-color:#fff!important;caret-color:#6366f1;
    }
    body[data-dinuba-modern] :is(input,textarea,select):focus {
      border-color:#a5a0ed!important;outline:2px solid #c7d2fe!important;outline-offset:0;
    }
    body[data-dinuba-modern] :is(input,textarea)::placeholder {color:#a1aec1!important;opacity:1}
    body[data-dinuba-modern] :is(input,textarea).x-form-empty-field {color:#a1aec1!important}
    body[data-dinuba-modern] :is(input,textarea,select):disabled,
    body[data-dinuba-modern] .x-item-disabled .x-form-field {background-color:#f0f3f8!important;color:#9aa8bc!important}
    body[data-dinuba-modern] :is(input,textarea)[readonly] {background-color:#f8faff!important}
    body[data-dinuba-modern] :is(input[type=checkbox],input[type=radio]) {accent-color:#6366f1;cursor:pointer}
    body[data-dinuba-modern] :is(.x-form-item-label,.x-form-label,legend) {color:#60728d!important;font-size:12px!important;font-weight:600}
    body[data-dinuba-modern] :is(.x-form-invalid,.x-form-invalid-field) {border-color:#e99b9b!important;background-color:#fff8f8!important}
    body[data-dinuba-modern] .x-form-invalid-msg {color:#c24141!important;font-size:11px!important}
    body[data-dinuba-modern] .x-form-check-label {color:#526780!important;font-size:12px!important}
    body[data-dinuba-modern] .x-grid-editor {border-radius:6px;box-shadow:0 3px 12px #4f46e51f}
    body[data-dinuba-modern] .x-grid-editor input {color:#283b59!important}
    body[data-dinuba-modern] .x-combo-list {
      border-color:#d8deed!important;border-radius:9px;box-shadow:0 16px 42px #1e293b22,0 2px 5px #1e293b0b;
    }
    body[data-dinuba-modern] .x-combo-list-item {font-size:12px!important;color:#4a5c76!important}
    body[data-dinuba-modern] .x-combo-list-item:is(:hover,.x-combo-selected,.x-view-highlightrow) {
      background:#eeedff!important;border-color:#eeedff!important;color:#4f46e5!important;
    }
    body[data-dinuba-modern] :is(.x-menu,.x-date-picker,.x-tip) {
      background:#fff!important;border-color:#dce2ee!important;border-radius:9px;
      box-shadow:0 14px 38px #1e293b22;
    }
    body[data-dinuba-modern] :is(.x-menu-item,.x-menu-item-text,.x-menu-list-item,.x-tip-body) {
      color:#455a77!important;font-size:12px!important;
    }
    body[data-dinuba-modern] .x-menu-item-active {
      background:#eeedff!important;border-color:#e3e0ff!important;border-radius:5px;
    }
    body[data-dinuba-modern] .x-menu-item-active .x-menu-item-text {color:#4f46e5!important}
    body[data-dinuba-modern] .x-menu-sep {border-color:#e5eaf3!important;background:#f0f3f8!important}
    body[data-dinuba-modern] :is(.x-tip-header-text,.x-tip-header) {color:#243751!important;background-image:none!important}
    body[data-dinuba-modern] .x-window {
      background:#fff!important;border-radius:12px;box-shadow:0 24px 80px #101c3040;border-color:#d8dfed!important;
    }
    body[data-dinuba-modern] :is(.x-window-tl,.x-window-tr,.x-window-tc,.x-window-ml,.x-window-mr,.x-window-mc,.x-window-bl,.x-window-br,.x-window-bc) {
      background-image:none!important;background-color:#fff!important;border-color:#e3e8f2!important;
    }
    body[data-dinuba-modern] .x-window-header {background:#fff!important;color:#283b59!important}
    body[data-dinuba-modern] .x-window-header-text {font-size:14px!important;font-weight:700!important;color:#243751!important}
    body[data-dinuba-modern] .x-window-footer {background:#f8faff!important;border-color:#e5eaf3!important}
    body[data-dinuba-modern] .x-message-box .x-window-body {color:#526780!important;font-size:13px!important}
    body[data-dinuba-modern] .ext-el-mask {background-color:#10192b!important}
    body[data-dinuba-modern] :is(.ext-el-mask-msg,.x-mask-loading) {border-color:#dce2ee!important;background-color:#fff!important;color:#536780!important;border-radius:8px}
    body[data-dinuba-modern] .x-date-picker :is(td,th) {color:#60728d!important}
    body[data-dinuba-modern] .x-date-selected a {background:#6366f1!important;color:#fff!important;border-radius:4px}

    /* Shared custom print dialog follows the same indigo design palette. */
    body[data-dinuba-modern] #dinuba-print-dialog {border-color:#e1e5f0;box-shadow:0 35px 110px #101c304d}
    body[data-dinuba-modern] #dinuba-print-dialog :is(.eyebrow,[data-all]) {color:#4f46e5}
    body[data-dinuba-modern] #dinuba-print-dialog .format:has(input:checked) {border-color:#6366f1;background:#f1f0ff;box-shadow:inset 0 0 0 1px #6366f1}
    body[data-dinuba-modern] #dinuba-print-dialog button.primary {background:#4f46e5;border-color:#4f46e5;color:#fff}
    body[data-dinuba-modern] #dinuba-print-dialog button.primary:hover {background:#4338ca}
    body[data-dinuba-modern] #dinuba-print-dialog input {accent-color:#6366f1}
    body[data-dinuba-modern] #dinuba-print-dialog tbody tr:has(input:checked) {background:#f1f0ff}
    body[data-dinuba-modern] *::-webkit-scrollbar-thumb {border-radius:8px}
    @media(prefers-reduced-motion:no-preference) {
      body[data-dinuba-modern] :is(.x-btn,.x-menu-item,.x-combo-list-item) {transition:background-color .12s,box-shadow .12s,color .12s}
    }
  `;
  // Draw crisp icons inside the existing hit areas; retain the original elements.
  const icons = {
    'page-first':'<path d="M6 5v14M18 5l-7 7 7 7"/>',
    'page-prev':'<path d="m15 5-7 7 7 7"/>',
    'page-next':'<path d="m9 5 7 7-7 7"/>',
    'page-last':'<path d="M18 5v14M6 5l7 7-7 7"/>',
    'page-refresh':'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 7a7 7 0 0 1 12-1l2 6M4 12l2 6a7 7 0 0 0 12-1"/>',
    'save':'<path d="M5 3h12l4 4v14H3V3h2ZM7 3v6h10V3M7 21v-8h10v8"/>',
    'plus':'<path d="M12 5v14M5 12h14"/>',
    'add-item':'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M12 8v8M8 12h8"/>',
    'add-group':'<path d="M3 8V5h7l2 3h9v12H3V8ZM12 11v6M9 14h6"/>',
    'run':'<path d="m8 4 12 8-12 8V4Z"/>',
    'close':'<path d="m6 6 12 12M18 6 6 18"/>',
    'left':'<path d="m14 5-7 7 7 7"/>',
    'arrow-down':'<path d="m5 9 7 7 7-7"/>',
    'export_database':'<path d="M5 14v6h14v-6M12 3v12m-5-5 5 5 5-5"/>',
    'insert_table':'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16M15 10v10"/>',
    'gear':'<path d="m9 3-1 3-3 1-2 3 2 2-1 4 3 2 3-1 2 4 3-1 1-3 3-1 2-3-2-2 1-4-3-2-3 1-2-3H9Z"/><circle cx="12" cy="12" r="3"/>',
    'edit':'<path d="m15 4 5 5M4 20l5-1L21 7l-5-5L4 14v6Z"/>',
    'filter':'<path d="M3 4h18l-7 8v7l-4 2v-9L3 4Z"/>',
    'toggle':'<path d="m6 9 6 6 6-6"/>',
    'check':'<path d="m5 12 4 4 10-10"/>',
    'clone':'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
    'phone':'<path d="m6 3 4 5-3 3a15 15 0 0 0 6 6l3-3 5 4-2 3C11 23 1 13 3 6l3-3Z"/>',
    'printer':'<path d="M6 9V3h12v6M6 17H3V9h18v8h-3M6 14h12v7H6v-7Z"/>',
    'laptop':'<path d="M4 4h16v12H4V4ZM2 20h20l-2-4H4l-2 4Z"/>',
    'trash':'<path d="M4 6h16M9 6V3h6v3M6 6l1 15h10l1-15M10 10v7M14 10v7"/>',
    'user':'<circle cx="12" cy="7" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',
    'calendar':'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M7 15h3M14 15h3"/>',
    'history':'<path d="M3 4v6h6M3 10a9 9 0 1 1 1 8M12 7v6l4 2"/>',
    'notes':'<path d="M4 3h16v18H4V3ZM8 8h8M8 12h8M8 16h5"/>',
    'attachment':'<path d="m9 14 7-7a3 3 0 0 1 4 4L10 21a5 5 0 0 1-7-7L14 3"/>',
    'labor':'<path d="M14 6a5 5 0 0 0-6 6L2 18l4 4 6-6a5 5 0 0 0 6-6l-4 3-3-3 3-4Z"/>',
    'purchase':'<path d="M3 3h3l3 13h10l3-9H7M10 21h.01M18 21h.01"/>',
    'columns':'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16M15 4v16"/>'
  };
  for (const [name, drawing] of Object.entries(icons)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${drawing}</svg>`;
    const url = `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    css += `body[data-dinuba-modern] [data-dw-icon="${name}"]{background-image:none!important;background-color:currentColor!important;color:#7283a0;-webkit-mask-image:${url};mask-image:${url};-webkit-mask-size:contain;mask-size:contain;-webkit-mask-position:center;mask-position:center;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;}`;
  }
  css += 'body[data-dinuba-modern] .x-item-disabled [data-dw-icon]{color:#b7c1d0!important}body[data-dinuba-modern] .sl-head [data-dw-icon]{color:#cbd5e8!important}';
  // Quiet light palette: no decorative navigation dots, pills, or gradients.
  css += `
    body[data-dinuba-modern]{--dw-ink:#34434d;--dw-muted:#8a959e;--dw-blue:#4b6f80;--dw-line:#e8ecee;--dw-canvas:#f6f7f8;--dw-nav:#fafbfc;background:#f6f7f8!important}
    body[data-dinuba-modern] .x-viewport{background:#f6f7f8!important}
    body[data-dinuba-modern] .sl-head{background:#fff!important;box-shadow:inset 0 -1px #e7ebee}
    body[data-dinuba-modern] .sl-head .sl-head-image{background-color:#fff!important}
    body[data-dinuba-modern] .sl-head .x-btn .x-btn-text{color:#657580!important;font-weight:550!important}
    body[data-dinuba-modern] .sl-head .x-btn.sl-head-menu-sel{background:#f1f5f6!important;box-shadow:inset 0 -2px #7b98a5!important}
    body[data-dinuba-modern] .sl-head .x-btn.sl-head-menu-sel .x-btn-text{color:#375766!important}
    body[data-dinuba-modern] .sl-head .x-btn:is(:hover,.x-btn-over){background:#f5f7f8!important}
    body[data-dinuba-modern] .sl-head .xtb-text{color:#99a3ab!important}
    body[data-dinuba-modern] .sl-head [data-dw-icon]{color:#82919b!important}
    body[data-dinuba-modern] .sl-head .sl-head-search input{background:#f5f7f8!important;border-color:#e1e7ea!important;color:#566773!important;box-shadow:none}
    body[data-dinuba-modern] #products-list{background:#f6f8f9!important;border-color:#e1e7ea!important;color:#6d7b85!important}
    body[data-dinuba-modern] .sl-top-toolbar{background:#fafbfc!important;box-shadow:inset 0 -1px #e8ecef}
    body[data-dinuba-modern] .sl-top-toolbar .x-btn{background:transparent!important;box-shadow:none!important}
    body[data-dinuba-modern] .sl-top-toolbar .x-btn-text{color:#647985!important}
    body[data-dinuba-modern] .navigation-panel,
    body[data-dinuba-modern] .navigation-panel :is(.x-panel-body,.x-panel-header,.x-view,.x-panel-footer){background:#fafbfc!important;color:#65747f!important;border-color:#e9edf0!important}
    body[data-dinuba-modern] .navigation-panel .x-panel-header{box-shadow:none!important}
    body[data-dinuba-modern] .navigation-panel .x-panel-header-text{color:#9aa4ad!important;font-size:10px!important;letter-spacing:.7px;font-weight:600!important}
    body[data-dinuba-modern] .navigation-panel .x-view-item{margin:3px 10px;padding:9px 7px;border-radius:6px;background:transparent!important;color:#73808b!important;font-weight:400;line-height:1.5;box-shadow:none!important}
    body[data-dinuba-modern] .navigation-panel .x-view-item [qtip]::before{display:none!important}
    body[data-dinuba-modern] .navigation-panel .x-view-item:hover{background:#f0f3f5!important;color:#425964!important}
    body[data-dinuba-modern] .navigation-panel .x-view-item:is(.x-view-highlightrow,.x-view-item-sel,.x-view-item-selected){background:#eaf0f2!important;color:#3d5c6a!important;box-shadow:none!important;font-weight:600}
    body[data-dinuba-modern] .navigation-panel .x-view-item>span>span:last-child:not([qtip]):not([style*="font-weight"]){background:transparent!important;color:#a0aab3!important;border-radius:0;padding:0!important;min-width:0;font-weight:400!important;font-size:10px!important}
    body[data-dinuba-modern] .navigation-panel [data-dw-nav-section]{color:#a1abb3!important;font-size:9px!important;letter-spacing:.7px;font-weight:600!important}
    body[data-dinuba-modern] .navigation-panel .x-view-item:has([data-dw-nav-section]){padding-top:18px;padding-bottom:5px;background:transparent!important}
    body[data-dinuba-modern] .navigation-panel [data-dw-nav-section]{margin-top:0!important}
    body[data-dinuba-modern] #Main{box-shadow:inset 1px 0 #e8ecef}
    body[data-dinuba-modern] #Main .component-panel-with-icon>.x-panel-header:not(.x-hide-display){background:#fff!important}
    body[data-dinuba-modern] .x-panel-header-text{color:#536873!important;letter-spacing:0}
    body[data-dinuba-modern] table.x-btn{background:#fff!important;box-shadow:inset 0 0 0 1px #dce3e7;border-radius:6px}
    body[data-dinuba-modern] .x-btn .x-btn-text{color:#617480!important;font-weight:550!important}
    body[data-dinuba-modern] table.x-btn:is(:hover,.x-btn-over){background:#f5f8f9!important;box-shadow:inset 0 0 0 1px #b9cbd3}
    body[data-dinuba-modern] table.x-btn.x-btn-click{background:#eaf0f3!important}
    body[data-dinuba-modern] table.x-btn[data-dw-action="primary"]{background:#527486!important;box-shadow:inset 0 0 0 1px #527486}
    body[data-dinuba-modern] table.x-btn[data-dw-action="primary"]:is(:hover,.x-btn-over){background:#436475!important}
    body[data-dinuba-modern] table.x-btn[data-dw-action="primary"] .x-btn-text{color:#fff!important}
    body[data-dinuba-modern] table.x-btn[data-dw-action="secondary"]{background:#fff!important;box-shadow:inset 0 0 0 1px #dce3e7}
    body[data-dinuba-modern] table.x-btn[data-dw-action="secondary"] .x-btn-text{color:#627d8b!important}
    body[data-dinuba-modern] table.x-btn.x-item-disabled{background:#f5f6f7!important;box-shadow:inset 0 0 0 1px #eef0f2!important}
    body[data-dinuba-modern] table.x-btn.x-item-disabled .x-btn-text{color:#b0b9c0!important}
    body[data-dinuba-modern] button:not(.x-btn-text):not(#dinuba-print-dialog button):not(#dw-shell button):hover{background:#f3f7f8;border-color:#b9cbd3}
    body[data-dinuba-modern] :is(a.link,a.data-reference,.data-reference){color:#527789!important}
    body[data-dinuba-modern] :is(.x-tab-panel-header,.x-tab-strip-wrap,.x-tab-strip,.x-tab-strip-spacer){background:#f5f7f8!important;border-color:#e5eaed!important}
    body[data-dinuba-modern] .x-tab-strip-active{box-shadow:inset 0 -2px #8ba4af}
    body[data-dinuba-modern] .x-tab-strip-active .x-tab-strip-text{color:#52717f!important}
    body[data-dinuba-modern] .filter-panel,
    body[data-dinuba-modern] .filter-panel :is(.x-panel-body,.x-toolbar,.x-panel-header){background:#fafbfc!important;border-color:#e8ecef!important}
    body[data-dinuba-modern] .x-grid3-header{background:#f6f8f9!important;box-shadow:inset 0 -1px #e4e9ec}
    body[data-dinuba-modern] .x-grid3-hd-inner,
    body[data-dinuba-modern] .x-grid3-hd-inner>span{color:#84929c!important;font-size:11px!important;font-weight:600!important;letter-spacing:0}
    body[data-dinuba-modern] .x-grid3-hd:hover{background:#edf2f4!important}
    body[data-dinuba-modern] .x-grid3-row:nth-child(even){background:#fcfdfd!important}
    body[data-dinuba-modern] .x-grid3-row:is(:hover,.x-grid3-row-over){background:#f4f8f9!important}
    body[data-dinuba-modern] .x-grid3-row.x-grid3-row-selected{background:#edf3f5!important;border-color:#dce7ec!important;box-shadow:none}
    body[data-dinuba-modern] .x-grid3-cell{border-right-color:#f1f3f5!important}
    body[data-dinuba-modern] .x-grid3-cell-selected{background:#e4edf1!important;box-shadow:inset 0 0 0 1px #b9cfd9}
    body[data-dinuba-modern] [class~="x-grid3-col-base.inc_incident.id"]{color:#5a7b8c!important;font-weight:650!important}
    body[data-dinuba-modern] [class~="x-grid3-col-base.inc_incident.assigned_to"]{color:#7b8e9b!important}
    body[data-dinuba-modern] .x-grid3-cell-inner[data-dw-status]{color:#657d89!important;font-weight:500!important}
    body[data-dinuba-modern] .x-grid3-cell-inner[data-dw-status]>span{background:#f0f4f5!important;color:inherit;padding:1px 4px;font-weight:500!important}
    body[data-dinuba-modern] .x-grid3-cell-inner[data-dw-status="complete"]{color:#658775!important}
    body[data-dinuba-modern] .x-grid3-cell-inner:is([data-dw-status="waiting"],[data-dw-status="unassigned"]){color:#9b865c!important}
    body[data-dinuba-modern] .x-grid3-row-body{background:#f8fafb!important}
    body[data-dinuba-modern] :is(input,textarea,select):focus{border-color:#9fb8c4!important;outline-color:#d5e5ec!important}
    body[data-dinuba-modern] :is(input[type=checkbox],input[type=radio]){accent-color:#648596}
    body[data-dinuba-modern] button:focus-visible{outline-color:#a8c4d2!important}
    body[data-dinuba-modern] .x-btn.x-btn-focus{outline-color:#a8c4d2}
    body[data-dinuba-modern] .x-combo-list-item:is(:hover,.x-combo-selected,.x-view-highlightrow),
    body[data-dinuba-modern] .x-menu-item-active{background:#eef4f6!important;border-color:#eef4f6!important;color:#557787!important}
    body[data-dinuba-modern] .x-menu-item-active .x-menu-item-text{color:#557787!important}
    body[data-dinuba-modern] .navigation-panel .x-panel-body::-webkit-scrollbar-thumb{background:#d5dde2;border-color:#fafbfc}
    body[data-dinuba-modern] #dinuba-print-dialog :is(.eyebrow,[data-all]){color:#587b8c}
    body[data-dinuba-modern] #dinuba-print-dialog .format:has(input:checked){border-color:#8faab8;background:#f1f6f8;box-shadow:inset 0 0 0 1px #8faab8}
    body[data-dinuba-modern] #dinuba-print-dialog button.primary{background:#527486;border-color:#527486}
    body[data-dinuba-modern] #dinuba-print-dialog button.primary:hover{background:#436475}
    body[data-dinuba-modern] #dinuba-print-dialog input{accent-color:#648596}
    body[data-dinuba-modern] #dinuba-print-dialog tbody tr:has(input:checked){background:#f1f6f8}
    body[data-dinuba-modern] ::selection{background:#dce9ef;color:#3b5a69}
  `;
  css += `
    body[data-dw-redesign]{--dw-rail:224px;--dw-top:80px;--dw-gap:18px;--dw-grid-height:500px}
    body[data-dw-redesign] .sl-head,
    body[data-dw-redesign] .sl-top-toolbar,
    body[data-dw-redesign] .navigation-panel{visibility:hidden!important;pointer-events:none!important}
    body[data-dw-redesign] #Main{position:fixed!important;left:calc(var(--dw-rail) + var(--dw-gap))!important;top:var(--dw-top)!important;width:calc(100vw - var(--dw-rail) - 2 * var(--dw-gap))!important;height:calc(100vh - var(--dw-top) - var(--dw-gap))!important;background:white!important;border-radius:12px;box-shadow:0 0 0 1px #e8edef,0 6px 28px #34434d04;overflow:auto!important}
    body[data-dw-redesign] #Main [data-dw-fit-width]{width:100%!important;max-width:100%!important}
    body[data-dw-redesign] #Main [data-dw-fit-height]{height:calc(var(--dw-grid-height) + var(--dw-fit-extra,0px))!important}
    body[data-dw-redesign] #Main .x-grid3[data-dw-fitted]{height:var(--dw-grid-height)!important;width:100%!important}
    body[data-dw-redesign] #Main .x-grid3[data-dw-fitted]>.x-grid3-viewport{height:100%!important;width:100%!important}
    body[data-dw-redesign] #Main .x-grid3[data-dw-fitted]>.x-grid3-viewport>.x-grid3-scroller{height:calc(var(--dw-grid-height) - var(--dw-grid-heading,24px))!important;width:100%!important}
    body[data-dw-redesign] #Main .x-grid3[data-dw-fitted]>.x-grid3-viewport>.x-grid3-header,
    body[data-dw-redesign] #Main .x-grid3[data-dw-fitted] .x-grid3-header-inner{width:100%!important}
    body[data-dw-redesign] #Main :is(.x-panel-fbar,.page-toolbar,.x-panel-bbar,.x-panel-footer){width:100%!important;box-sizing:border-box}
    body[data-dw-redesign] #Main .x-panel-header:not(.x-hide-display){background:#fff!important;box-shadow:inset 0 -1px #edf0f2}
    body[data-dw-redesign] #Main .x-panel-header-text{color:#3b525f!important;font-weight:650!important}
    #dw-shell{font:13px/1.5 'Segoe UI',Arial,sans-serif;color:#455b69;position:fixed;inset:0;pointer-events:none;z-index:100}
    #dw-shell *{box-sizing:border-box}
    #dw-shell button,#dw-shell input{font:inherit}
    #dw-shell button{cursor:pointer}
    #dw-shell svg{width:18px;height:18px;flex-shrink:0;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round;pointer-events:none}
    #dw-shell .dw-header{position:absolute;left:var(--dw-rail);right:0;top:0;height:62px;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:0 24px;border-bottom:1px solid #e8edef;background:#fff;pointer-events:auto}
    #dw-shell .dw-breadcrumb{display:flex;align-items:center;gap:12px;color:#87959f;font-size:12px}
    #dw-shell .dw-breadcrumb strong{color:#3f5664;font-weight:600}
    #dw-shell .dw-actions{display:flex;align-items:center;gap:10px}
    #dw-shell .dw-global-search{width:180px;height:33px;padding:0 10px;border:1px solid #e3e9ed;border-radius:7px;background:#f8fafb!important;color:#617784;font-size:11px}
    #dw-shell .dw-products{max-width:120px;height:33px;border:1px solid #e6ecef;border-radius:7px;background:#fff;color:#80919b;font-size:10px}
    #dw-shell .dw-action{border:0;background:transparent;color:#738691;padding:8px;border-radius:7px;display:flex;align-items:center;gap:6px;font-size:12px}
    #dw-shell .dw-action:hover{background:#f3f6f7;color:#3a5969}
    #dw-shell .dw-avatar{width:30px;height:30px;border-radius:50%;display:grid;place-items:center;background:#edf3f5;color:#6c8896;font-size:10px;font-weight:700;margin-left:8px}
    #dw-shell .dw-sidebar{position:absolute;left:0;top:0;bottom:0;width:var(--dw-rail);background:#fafbfc;border-right:1px solid #e8edef;display:flex;flex-direction:column;pointer-events:auto}
    #dw-shell .dw-brand{height:80px;display:flex;align-items:center;gap:11px;padding:0 20px;flex-shrink:0}
    #dw-shell .dw-mark{width:32px;height:32px;border-radius:10px;background:#557b8b;display:grid;place-items:center;color:white;font-weight:700;font-size:16px}
    #dw-shell .dw-brand strong{display:block;font-size:14px;font-weight:650;color:#3c5664;letter-spacing:-.2px}
    #dw-shell .dw-brand small{display:block;color:#99a5ad;font-size:10px;margin-top:1px}
    #dw-shell .dw-search{margin:0 14px 18px;position:relative;flex-shrink:0}
    #dw-shell .dw-search svg{position:absolute;left:10px;top:10px;width:15px;height:15px;color:#a1adb5}
    #dw-shell .dw-search input{height:36px;width:100%;border:1px solid #e5eaed;border-radius:8px;background:#fff!important;padding:0 10px 0 33px;color:#5d7380;font-size:11px}
    #dw-shell .dw-search input::placeholder{color:#a4afb7}
    #dw-shell .dw-navigation{overflow:auto;flex:1;min-height:0;padding:0 12px 20px;scrollbar-width:thin;scrollbar-color:#dce4e8 transparent}
    #dw-shell .dw-section-label{margin:0 10px 8px;font-size:9px;color:#a2aeb6;letter-spacing:1px;text-transform:uppercase;font-weight:650}
    #dw-shell .dw-nav-button{display:flex;width:100%;align-items:center;gap:10px;min-height:38px;margin:3px 0;padding:8px 10px;border:0;border-radius:7px;background:transparent;text-align:left;color:#7c8c98;font-size:11px;font-weight:450}
    #dw-shell .dw-nav-button svg{width:15px;height:15px;color:#9aaab5}
    #dw-shell .dw-nav-label{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
    #dw-shell .dw-nav-count{color:#a2aeb7;font-size:10px;font-variant-numeric:tabular-nums}
    #dw-shell .dw-nav-button:hover{background:#f0f4f6;color:#4b6777}
    #dw-shell .dw-nav-button[aria-current=page]{background:#eaf1f4;color:#456676;font-weight:600}
    #dw-shell .dw-nav-button[aria-current=page] svg{color:#648a9e}
    #dw-shell details{margin-top:22px}
    #dw-shell summary{cursor:pointer;list-style:none;display:flex;align-items:center;justify-content:space-between;padding:0 10px 8px;font-size:9px;color:#98a7b1;text-transform:uppercase;letter-spacing:1px;font-weight:650}
    #dw-shell summary::-webkit-details-marker{display:none}
    #dw-shell summary svg{width:13px;height:13px;transition:transform .15s}
    #dw-shell details[open] summary svg{transform:rotate(90deg)}
    #dw-shell .dw-sidebar-footer{padding:14px 20px;border-top:1px solid #edf0f2;color:#a7b0b8;font-size:10px;flex-shrink:0}
    #dw-shell :is(button,input,summary):focus-visible{outline:2px solid #9ab8c8!important;outline-offset:2px}
    #dw-shell .dw-empty{padding:15px 10px;color:#9aa8b2;font-size:11px}
    @media(max-width:1000px){#dw-shell .dw-global-search{width:130px}#dw-shell .dw-breadcrumb>span{display:none}}
    @media(max-width:800px){#dw-shell .dw-actions{gap:3px}#dw-shell .dw-action span{display:none}#dw-shell .dw-products{max-width:85px}#dw-shell .dw-avatar{display:none}}
    @media(max-width:1000px){body[data-dw-redesign]{--dw-rail:194px;--dw-gap:12px}#dw-shell .dw-brand{padding:0 15px}#dw-shell .dw-header{padding:0 16px}}
    @media(max-width:650px){body[data-dw-redesign]{--dw-rail:64px;--dw-gap:8px}#dw-shell .dw-brand{padding:0 16px}#dw-shell .dw-brand-text,#dw-shell .dw-search,#dw-shell .dw-section-label,#dw-shell .dw-nav-label,#dw-shell .dw-nav-count,#dw-shell .dw-sidebar-footer{display:none}#dw-shell .dw-navigation{padding:0 7px}#dw-shell .dw-nav-button{justify-content:center;padding:11px}#dw-shell summary{font-size:0;padding:0 16px}#dw-shell details{margin-top:12px}#dw-shell details[open] .dw-nav-button{padding:11px}#dw-shell .dw-breadcrumb>span{display:none}#dw-shell .dw-action span{display:none}#dw-shell .dw-header{padding:0 12px}}
    @media print{#dw-shell{display:none!important}body[data-dw-redesign] #Main{position:static!important;left:auto!important;top:auto!important;width:auto!important;height:auto!important;overflow:visible!important}}
  `;
  css += `
    /* Comfortable table density with stronger contrast. Column widths stay native. */
    body[data-dinuba-modern] #Main .x-grid3 {border-radius:0 0 10px 10px;background:#fff!important}
    body[data-dinuba-modern] #Main .x-grid3-header {background:#f1f5f9!important;box-shadow:inset 0 -1px #cbd5e1}
    body[data-dinuba-modern] #Main .x-grid3-hd-inner,
    body[data-dinuba-modern] #Main .x-grid3-hd-inner>span {font-size:12px!important;font-weight:700!important;color:#475569!important;letter-spacing:.1px}
    body[data-dinuba-modern] #Main .x-grid3-hd-inner {height:44px!important;min-height:44px!important;box-sizing:border-box;padding-top:13px!important;padding-bottom:11px!important}
    body[data-dinuba-modern] #Main .x-grid3-hd-inner:not(.x-grid3-hd-checker):not(.x-grid3-hd-editor):not(.x-grid3-hd-expander){padding-left:12px!important;padding-right:10px!important}
    body[data-dinuba-modern] #Main .x-grid3-row {background:#fff!important;border-color:#e8edf3!important}
    body[data-dinuba-modern] #Main .x-grid3-row:nth-child(even){background:#fafcff!important}
    body[data-dinuba-modern] #Main .x-grid3-cell {border-right-color:transparent!important;border-bottom-color:#e8edf3!important;vertical-align:middle!important}
    body[data-dinuba-modern] #Main .x-grid3-cell-inner {font-size:13px!important;line-height:20px!important;color:#334155!important}
    body[data-dinuba-modern] #Main .x-grid3-cell-inner:not(.x-grid3-col-checker):not(.x-grid3-col-editor):not(.x-grid3-col-expander){padding:12px 12px!important;box-sizing:border-box}
    body[data-dinuba-modern] #Main :is(.x-grid3-col-checker,.x-grid3-col-editor,.x-grid3-col-expander){padding-left:0!important;padding-right:0!important;text-align:center}
    body[data-dinuba-modern] #Main .x-grid3-row:is(:hover,.x-grid3-row-over){background:#eff6ff!important}
    body[data-dinuba-modern] #Main .x-grid3-row.x-grid3-row-selected {background:#eaf2ff!important;border-color:#bfdbfe!important;box-shadow:inset 3px 0 #3b82f6}
    body[data-dinuba-modern] #Main .x-grid3-cell-selected {background:#dbeafe!important;box-shadow:inset 0 0 0 1px #93c5fd}
    body[data-dinuba-modern] #Main [class~="x-grid3-col-base.inc_incident.id"] {font-size:13px!important;color:#1d4ed8!important;font-weight:750!important;font-variant-numeric:tabular-nums}
    body[data-dinuba-modern] #Main :is([class~="x-grid3-col-base.inc_incident.id"],[class~="x-grid3-col-base.inc_incident.incident_status"]){padding-left:6px!important;padding-right:6px!important}
    body[data-dinuba-modern] #Main [class~="x-grid3-col-base.inc_incident.description"] {color:#172b46!important;font-size:13px!important;font-weight:550!important}
    body[data-dinuba-modern] #Main [class~="x-grid3-col-base.inc_incident.rte_location"] {color:#334f70!important;font-weight:600!important}
    body[data-dinuba-modern] #Main [class~="x-grid3-col-base.inc_incident.assigned_to"],
    body[data-dinuba-modern] #Main [class~="x-grid3-col-base.inc_incident.requested_by"] {color:#475f80!important;font-size:12px!important;font-weight:500!important}
    body[data-dinuba-modern] #Main :is([class~="x-grid3-col-j_6785.cmn_user.phone"],[class~="x-grid3-col-j_6785.cmn_user.mobile_phone"]) {color:#3f536c!important;font-size:12px!important;font-variant-numeric:tabular-nums}
    body[data-dinuba-modern] #Main :is([class~="x-grid3-col-base.inc_incident.area_room"],[class~="x-grid3-col-base.inc_incident.rte_building"],[class~="x-grid3-col-base.inc_incident.rte_area"]) {color:#475569!important;font-size:12px!important}
    body[data-dinuba-modern] #Main .x-grid3-cell-inner[data-dw-status] {font-weight:650!important;font-size:12px!important}
    body[data-dinuba-modern] #Main .x-grid3-cell-inner[data-dw-status]>span {padding:4px 7px;border-radius:6px;font-size:11px!important;font-weight:650!important;background:#e2e8f0!important}
    body[data-dinuba-modern] #Main .x-grid3-cell-inner[data-dw-status="new"] {color:#1e40af!important}
    body[data-dinuba-modern] #Main .x-grid3-cell-inner[data-dw-status="new"]>span {background:#dbeafe!important}
    body[data-dinuba-modern] #Main .x-grid3-cell-inner[data-dw-status="working"] {color:#6d28d9!important}
    body[data-dinuba-modern] #Main .x-grid3-cell-inner[data-dw-status="working"]>span {background:#ede9fe!important}
    body[data-dinuba-modern] #Main .x-grid3-cell-inner[data-dw-status="complete"] {color:#065f46!important}
    body[data-dinuba-modern] #Main .x-grid3-cell-inner[data-dw-status="complete"]>span {background:#d1fae5!important}
    body[data-dinuba-modern] #Main .x-grid3-cell-inner:is([data-dw-status="waiting"],[data-dw-status="unassigned"]) {color:#92400e!important}
    body[data-dinuba-modern] #Main .x-grid3-cell-inner:is([data-dw-status="waiting"],[data-dw-status="unassigned"])>span {background:#fef3c7!important}
    body[data-dinuba-modern] #Main .x-grid3-scroller {scrollbar-color:#aabbd0 #f5f8fc}
    body[data-dinuba-modern] #Main .x-grid3-scroller::-webkit-scrollbar-thumb {background:#aabbd0;border-color:#f5f8fc}
    body[data-dinuba-modern] #Main .x-panel-header-text {font-size:14px!important;font-weight:700!important;color:#273d56!important}
    body[data-dinuba-modern] #Main .filter-panel :is(.x-form-label,.xtb-text,.x-form-item-label){color:#526780!important}
    body[data-dinuba-modern] #Main [data-dw-icon] {color:#526d91}
    /* Clearly defined controls, without changing each button's action or width. */
    body[data-dinuba-modern] #Main table.x-btn {background:#fff!important;border-radius:7px;box-shadow:inset 0 0 0 1px #b9c8da,0 1px 3px #1e293b09}
    body[data-dinuba-modern] #Main .x-btn .x-btn-text {font-size:13px!important;font-weight:650!important;color:#334c6c!important}
    body[data-dinuba-modern] #Main table.x-btn:is(:hover,.x-btn-over){background:#eff6ff!important;box-shadow:inset 0 0 0 1px #7da6dd,0 2px 5px #2563eb12}
    body[data-dinuba-modern] #Main .x-panel-fbar .x-btn .x-btn-text {height:32px!important;min-height:32px!important}
    body[data-dinuba-modern] #Main table.x-btn[data-dw-action="primary"] {background:#2563eb!important;box-shadow:inset 0 0 0 1px #2563eb,0 2px 5px #2563eb25}
    body[data-dinuba-modern] #Main table.x-btn[data-dw-action="primary"] .x-btn-text {color:white!important}
    body[data-dinuba-modern] #Main table.x-btn[data-dw-action="primary"]:is(:hover,.x-btn-over) {background:#1d4ed8!important}
    body[data-dinuba-modern] #Main table.x-btn[data-dw-action="secondary"] {background:#f0f6ff!important;box-shadow:inset 0 0 0 1px #a7c4e8}
    body[data-dinuba-modern] #Main table.x-btn[data-dw-action="secondary"] .x-btn-text {color:#1e4e8c!important}
    body[data-dinuba-modern] #Main table.x-btn[data-dw-action="danger"] {background:#fff1f2!important;box-shadow:inset 0 0 0 1px #fda4af}
    body[data-dinuba-modern] #Main table.x-btn[data-dw-action="danger"] .x-btn-text {color:#be123c!important}
    body[data-dinuba-modern] #Main table.x-btn.x-item-disabled {background:#f1f5f9!important;box-shadow:inset 0 0 0 1px #e2e8f0!important;opacity:1}
    body[data-dinuba-modern] #Main table.x-btn.x-item-disabled .x-btn-text {color:#94a3b8!important}
    body[data-dinuba-modern] #Main .page-toolbar {background:#f8fafd!important;box-shadow:inset 0 1px #e1e8f0}
    body[data-dinuba-modern] #Main .page-toolbar :is(.my-paging-text,.my-paging-display,.xtb-text){font-size:12px!important;color:#52667f!important}
    body[data-dinuba-modern] #Main .x-panel-fbar {background:#fff!important;box-shadow:inset 0 1px #e2e8f0}
    body[data-dinuba-modern] #Main .x-panel-fbar>.x-toolbar-ct {width:100%!important}
    body[data-dinuba-modern] #Main .x-panel-fbar .x-toolbar-left {text-align:left!important}
    #dw-shell .dw-nav-button {color:#52667d;font-size:12px}
    #dw-shell .dw-nav-button[aria-current=page]{background:#e7effb;color:#254a78}
    #dw-shell .dw-nav-count {color:#718198}
    #dw-shell .dw-action {color:#526b83}
    #dw-shell .dw-section-label,#dw-shell summary {color:#718198}
  `;
  css += `
    /* Ticket detail pages: reflow the original form controls, never clone them. */
    body[data-dinuba-modern] #Main[data-dw-detail] {background:#f6f8fc!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-detail-path] {width:100%!important;max-width:100%!important;height:auto!important;overflow:visible!important;box-sizing:border-box}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-detail-page] {width:100%!important;max-width:100%!important;height:auto!important;box-sizing:border-box}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs] {width:100%!important;max-width:100%!important;height:auto!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs]>.x-tab-panel-header {width:100%!important;position:sticky;top:0;z-index:30;background:#fff!important;box-shadow:0 1px 0 #e2e8f0;border:0!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs]>.x-tab-panel-header .x-tab-strip-wrap {width:100%!important;overflow-x:auto!important;overflow-y:hidden;background:#fff!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs]>.x-tab-panel-header .x-tab-strip {width:max-content!important;min-width:100%;display:flex;align-items:stretch;gap:6px;padding:9px 16px;margin:0;background:#fff!important;border:0!important;box-sizing:border-box}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs]>.x-tab-panel-header .x-tab-strip>li[role=tab] {float:none!important;margin:0!important;border-radius:7px;background:transparent!important;box-shadow:none!important;flex-shrink:0}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs]>.x-tab-panel-header :is(.x-tab-right,.x-tab-left,.x-tab-strip-inner){background:transparent!important;padding:0!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs]>.x-tab-panel-header .x-tab-strip-text {display:block;padding:10px 13px;font-size:12px!important;font-weight:600!important;line-height:18px;color:#64748b!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs]>.x-tab-panel-header li[role=tab]:hover {background:#f1f5f9!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs]>.x-tab-panel-header li.x-tab-strip-active {background:#eaf2ff!important;box-shadow:inset 0 0 0 1px #d3e3fc!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs]>.x-tab-panel-header .x-tab-strip-active .x-tab-strip-text {color:#1d4ed8!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs]>.x-tab-panel-header :is(.x-tab-edge,.x-tab-strip-spacer,.x-clear) {display:none!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs]>.x-tab-panel-body {width:100%!important;height:auto!important;overflow:visible!important;background:#f6f8fc!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-overview] {padding:22px!important;background:#f6f8fc!important}
    body[data-dinuba-modern] #Main[data-dw-detail] fieldset[data-dw-section] {width:100%!important;min-width:0!important;margin:0 0 20px!important;padding:20px!important;border:1px solid #e0e7f0!important;border-radius:12px;background:#fff!important;box-shadow:0 2px 5px #273d5604;box-sizing:border-box}
    body[data-dinuba-modern] #Main[data-dw-detail] fieldset[data-dw-section]>legend {padding:0 9px!important;margin-left:0;color:#304b6b!important;background:#fff;float:none}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-fieldset-header-text {font-size:14px!important;font-weight:700!important;color:#304b6b!important;letter-spacing:-.1px}
    body[data-dinuba-modern] #Main[data-dw-detail] fieldset[data-dw-section] .x-column-inner {display:grid!important;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px 26px;width:100%!important;min-width:0}
    body[data-dinuba-modern] #Main[data-dw-detail] fieldset[data-dw-section] .x-column:not(.x-hide-display) {display:contents!important;float:none!important}
    body[data-dinuba-modern] #Main[data-dw-detail] fieldset[data-dw-section] .x-column-inner>.x-clear {display:none!important}
    body[data-dinuba-modern] #Main[data-dw-detail] fieldset[data-dw-section] :is(.x-form-label-left,.x-column-layout-ct){width:100%!important;max-width:100%!important;min-width:0;box-sizing:border-box}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] {width:100%!important;min-width:0;margin:0!important;padding:0!important;box-sizing:border-box}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field]>.x-form-item-label {float:none!important;position:static!important;display:block;width:auto!important;max-width:none!important;margin:0 0 7px!important;padding:0!important;line-height:18px;font-size:12px!important;font-weight:600!important;color:#526780!important}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field]>.x-form-element {padding-left:0!important;width:100%!important;min-width:0;box-sizing:border-box}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field]>.x-form-clear-left {display:none!important}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item.x-hide-label[data-dw-field]>.x-form-item-label {display:none!important}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] .x-form-element>.x-form-field-wrap {width:100%!important;max-width:100%!important;min-height:40px;position:relative;box-sizing:border-box}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] input.x-form-text {width:100%!important;height:40px!important;padding:9px 11px!important;border:1px solid #ccd8e7!important;border-radius:7px!important;font-size:13px!important;line-height:20px!important;box-sizing:border-box;color:#263e5b!important;background:#fff!important}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] .x-form-field-wrap:has(.x-form-trigger) input {padding-right:30px!important}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] .x-form-trigger {position:absolute!important;right:0!important;top:0!important;left:auto!important;height:40px!important;border-left:1px solid #e2e8f0!important;background-position:center!important;border-radius:0 7px 7px 0}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] .x-form-twin-triggers {position:absolute;right:0;top:0}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] .x-form-twin-triggers .x-form-trigger {position:relative!important;height:20px!important;display:block}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] textarea {width:100%!important;min-height:160px;max-width:100%;padding:12px!important;box-sizing:border-box;font-size:13px!important;line-height:1.7!important;border:1px solid #ccd8e7!important;border-radius:8px!important;color:#263e5b!important;resize:vertical;background:#fff!important}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] .x-form-field-wrap:has(textarea) {height:auto!important}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field]:has(textarea),
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field="resolution"] {grid-column:1/-1}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] .x-form-element>.x-component:not(.x-form-field-wrap):not(.x-toolbar) {width:100%!important;min-height:40px;padding:10px 11px!important;box-sizing:border-box;background:#f8fafc!important;border:1px solid #e7edf4;border-radius:7px;color:#334f70!important;font-size:13px!important;line-height:20px;overflow-wrap:anywhere}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-action-field {width:100%!important;max-width:100%!important;border-radius:7px;border:1px solid #e2e8f0!important;background:#f8fafc!important}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-action-field .x-toolbar {width:100%!important;max-width:100%!important}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-action-field .link {width:auto!important;max-width:100%!important;overflow-wrap:anywhere}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-detail-footer] {position:sticky;bottom:0;z-index:35;background:#fff!important;border-top:1px solid #dce5ef!important;box-shadow:0 -5px 20px #1e293b06}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-panel-fbar {padding:10px 12px!important;box-sizing:border-box}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-detail-page]:not([data-dw-overview])>.x-panel {background:#fff!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs] .x-grid-panel {width:100%!important;max-width:100%!important}
    body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-ticket-tabs] .x-grid3 {width:100%!important}
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] input:focus,
    body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] textarea:focus {border-color:#80a9df!important;outline:2px solid #dbeafe!important}
    @media(max-width:1100px){body[data-dinuba-modern] #Main[data-dw-detail] fieldset[data-dw-section] .x-column-inner{grid-template-columns:minmax(0,1fr)}body[data-dinuba-modern] #Main[data-dw-detail] [data-dw-overview]{padding:14px!important}body[data-dinuba-modern] #Main[data-dw-detail] fieldset[data-dw-section]{padding:16px!important}}
  `;
  for(const [selector,drawing] of [
    ['.x-form-trigger-arrow:not(.x-form-spinner-up):not(.x-form-spinner-down)','<path d="m6 9 6 6 6-6"/>'],
    ['.x-form-date-trigger','<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M8 3v4M16 3v4"/>'],
    ['.x-form-spinner-up','<path d="m6 15 6-6 6 6"/>'],
    ['.x-form-spinner-down','<path d="m6 9 6 6 6-6"/>']
  ]) {
    const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${drawing}</svg>`;
    css+=`body[data-dinuba-modern] #Main[data-dw-detail] .x-form-item[data-dw-field] ${selector}{background-image:url("data:image/svg+xml,${encodeURIComponent(svg)}")!important;background-size:14px 14px!important;background-repeat:no-repeat!important;background-position:center!important;}`;
  }
  css += `
    body[data-dinuba-modern] #Main .x-grid3[data-dw-table-source]{opacity:0!important;pointer-events:none!important}
    body[data-dinuba-modern] #Main .dw-custom-grid{position:absolute;inset:0;z-index:2;display:flex;flex-direction:column;background:#fff;overflow:hidden;color:#334155;font:13px/1.5 'Segoe UI',Arial,sans-serif}
    .dw-custom-grid *{box-sizing:border-box}
    .dw-custom-grid .dw-table-bar{display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px 16px;border-bottom:1px solid #e2e8f0;flex-shrink:0;background:#fff}
    .dw-custom-grid .dw-table-count{font-size:12px;color:#64748b;font-weight:500}
    .dw-custom-grid .dw-table-bar{flex-wrap:wrap}
    .dw-custom-grid .dw-ticket-search{position:relative;flex:1;min-width:240px;max-width:520px}
    .dw-custom-grid .dw-ticket-search svg{position:absolute;left:11px;top:11px;width:16px;height:16px;fill:none;stroke:#7890aa;stroke-width:1.8;stroke-linecap:round;pointer-events:none}
    body[data-dinuba-modern] #Main .dw-ticket-search input{width:100%!important;height:38px!important;padding:8px 36px!important;border:1px solid #cbd8e8!important;border-radius:7px!important;font-size:13px!important;background:#f8fafd!important;box-sizing:border-box}
    .dw-custom-grid .dw-table-count{margin-left:auto}
    .dw-custom-grid .dw-table-scroller{min-height:0;flex:1;overflow:auto;scrollbar-color:#b5c5d8 #f7f9fc}
    body[data-dinuba-modern] #Main .dw-custom-grid table.dw-ticket-table{width:100%;table-layout:fixed;border-collapse:separate;border-spacing:0;font:13px/1.5 'Segoe UI',Arial,sans-serif}
    body[data-dinuba-modern] #Main .dw-ticket-table th{position:sticky;top:0;z-index:3;padding:14px 16px;text-align:left;border-bottom:1px solid #d9e2ef;background:#f3f6fb;color:#475569;font-size:11px;font-weight:700;white-space:normal;vertical-align:middle}
    body[data-dinuba-modern] #Main .dw-ticket-table td{padding:16px;border-bottom:1px solid #e8edf5;vertical-align:middle;color:#334155;font-size:13px;overflow-wrap:anywhere;background:#fff}
    body[data-dinuba-modern] #Main .dw-ticket-table tbody tr:nth-child(even) td{background:#fcfdff}
    body[data-dinuba-modern] #Main .dw-ticket-table tbody tr:hover td{background:#f2f7ff}
    body[data-dinuba-modern] #Main .dw-ticket-table tbody tr[data-selected=true] td{background:#eaf2ff}
    body[data-dinuba-modern] #Main .dw-ticket-table .dw-id-col{position:sticky;left:0;z-index:2;white-space:nowrap!important;overflow:visible!important;box-shadow:1px 0 #e8edf5;background:#fff}
    body[data-dinuba-modern] #Main .dw-ticket-table th.dw-id-col{z-index:4;background:#f3f6fb}
    body[data-dinuba-modern] #Main .dw-ticket-table .dw-id-button{appearance:none;border:0!important;background:transparent!important;box-shadow:none!important;padding:3px 0!important;color:#1d4ed8!important;font-size:13px!important;font-weight:750!important;white-space:nowrap!important;cursor:pointer}
    body[data-dinuba-modern] #Main .dw-ticket-table .dw-id-button:hover{text-decoration:underline;text-underline-offset:3px}
    .dw-custom-grid .dw-summary{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;overflow:hidden;font-size:13px;font-weight:550;line-height:1.6;color:#1e334e;white-space:normal}
    .dw-custom-grid .dw-cell-muted{font-size:12px;color:#526780;line-height:1.6}
    .dw-custom-grid .dw-status-chip{display:inline-block;padding:4px 8px;border-radius:6px;font-size:11px;font-weight:650;line-height:1.5;background:#e9eef5;color:#475569;white-space:normal}
    .dw-custom-grid .dw-status-chip[data-state=new]{background:#dbeafe;color:#1e40af}
    .dw-custom-grid .dw-status-chip[data-state=working]{background:#ede9fe;color:#6d28d9}
    .dw-custom-grid .dw-status-chip[data-state=complete]{background:#d1fae5;color:#065f46}
    .dw-custom-grid .dw-status-chip:is([data-state=waiting],[data-state=unassigned]){background:#fef3c7;color:#92400e}
    body[data-dinuba-modern] #Main .dw-custom-grid .dw-sort{appearance:none;background:transparent!important;border:0!important;box-shadow:none!important;padding:0!important;color:#475569!important;font-size:11px!important;font-weight:700!important;text-align:left;cursor:pointer;display:flex;gap:6px;align-items:center}
    .dw-custom-grid .dw-sort-indicator{color:#94a3b8;font-size:12px}
    .dw-custom-grid input[type=checkbox]{width:16px;height:16px;accent-color:#2563eb;cursor:pointer}
    .dw-custom-grid .dw-columns{position:relative;z-index:6;font-size:12px;color:#526780}
    .dw-custom-grid .dw-columns summary{cursor:pointer;list-style:none;padding:6px 10px;border:1px solid #d7e1ee;border-radius:6px;background:#fff;font-weight:600}
    .dw-custom-grid .dw-columns summary::-webkit-details-marker{display:none}
    .dw-custom-grid .dw-column-options{position:absolute;right:0;top:36px;min-width:210px;padding:8px;background:#fff;border:1px solid #dbe3ee;border-radius:9px;box-shadow:0 10px 30px #1e293b1a}
    .dw-custom-grid .dw-column-options label{display:flex;align-items:center;gap:9px;padding:7px 8px;font-size:12px;cursor:pointer}
    .dw-custom-grid .dw-empty-row{text-align:center;padding:40px!important;color:#64748b!important}
    body[data-dinuba-modern] #Main .dw-custom-grid button:focus-visible{outline:2px solid #93c5fd!important;outline-offset:3px}
  `;
  css += `
    body[data-dw-redesign]{--dw-top:62px;--dw-gap:0px;--dw-action-height:50px;--dw-pager-height:0px}
    body[data-dw-redesign] #Main{left:var(--dw-rail)!important;top:62px!important;width:calc(100vw - var(--dw-rail))!important;height:calc(100vh - 62px)!important;border-radius:0!important;border:0!important;box-shadow:none;overflow-x:hidden!important;box-sizing:border-box;padding-bottom:calc(var(--dw-action-height) + var(--dw-pager-height) + 8px)!important}
    body[data-dw-redesign] #Main:not([data-dw-detail]){overflow:hidden!important;padding-bottom:0!important}
    body[data-dw-redesign] #Main :is(#Header,#Criteria){width:100%!important;max-width:100%!important;box-sizing:border-box}
    body[data-dw-redesign] #Main [data-dw-docked-actions]{position:fixed!important;left:var(--dw-rail)!important;right:0!important;bottom:0!important;top:auto!important;width:auto!important;height:var(--dw-action-height)!important;min-height:0!important;padding:8px 14px!important;box-sizing:border-box;background:#fff!important;border-top:1px solid #e2e8f0!important;box-shadow:none;z-index:140;overflow-x:auto;overflow-y:hidden}
    body[data-dw-redesign] #Main [data-dw-docked-pager]{position:fixed!important;left:var(--dw-rail)!important;right:0!important;bottom:var(--dw-action-height)!important;top:auto!important;width:auto!important;height:44px!important;padding:6px 18px!important;box-sizing:border-box;background:#f8fafd!important;border-top:1px solid #e2e8f0!important;border-bottom:1px solid #e2e8f0!important;box-shadow:none;z-index:139;overflow-x:auto;overflow-y:hidden}
    body[data-dw-redesign] #Main :is([data-dw-docked-actions],[data-dw-docked-pager])>.x-toolbar-ct{width:100%!important}
    body[data-dw-redesign] #Main [data-dw-docked-actions] .x-btn .x-btn-text{width:auto!important;min-width:44px;height:28px!important;min-height:28px!important;padding:0 9px!important;font-size:12px!important;font-weight:600!important;white-space:nowrap;display:inline-flex;align-items:center;justify-content:center;gap:5px;box-sizing:border-box}
    body[data-dw-redesign] #Main [data-dw-docked-actions] .x-btn :is(.x-btn-tl,.x-btn-tc,.x-btn-tr,.x-btn-bl,.x-btn-bc,.x-btn-br){height:1px!important;line-height:1px!important;font-size:0!important;padding:0!important}
    body[data-dw-redesign] #Main [data-dw-docked-actions] .x-btn :is(.x-btn-tl,.x-btn-tc,.x-btn-tr,.x-btn-bl,.x-btn-bc,.x-btn-br)>i{display:block!important;height:1px!important;min-height:0!important;width:1px!important;line-height:1px!important}
    body[data-dw-redesign] #Main [data-dw-docked-actions] .x-btn :is(.x-btn-ml,.x-btn-mr){width:2px!important;padding:0!important}
    body[data-dw-redesign] #Main [data-dw-docked-actions] table.x-btn{border-radius:5px;box-shadow:inset 0 0 0 1px #d3dce8!important}
    body[data-dw-redesign] #Main [data-dw-docked-actions] table.x-btn[data-dw-action="primary"]{box-shadow:inset 0 0 0 1px #2563eb!important}
    body[data-dw-redesign] #Main [data-dw-docked-actions] button[data-dw-action-icon]::before{width:13px;height:13px}
    body[data-dw-redesign] #Main [data-dw-docked-actions] .x-btn-arrow{padding-right:10px}
    body[data-dw-redesign] #Main [data-dw-docked-actions] .x-toolbar-left-row>td{padding-right:6px!important}
    body[data-dw-redesign] #Main [data-dw-docked-actions] .x-toolbar-left-row>td>table.x-btn{margin:0!important}
    body[data-dw-redesign] #Main button[data-dw-action-icon]::before{content:'';display:inline-block;flex-shrink:0;width:15px;height:15px;background:currentColor;mask-image:var(--dw-action-glyph);-webkit-mask-image:var(--dw-action-glyph);mask-size:contain;-webkit-mask-size:contain;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat;mask-position:center;-webkit-mask-position:center;pointer-events:none}
    body[data-dw-redesign] #Main [data-dw-docked-pager] .x-toolbar-left-row>td{padding-right:5px!important;vertical-align:middle}
    body[data-dw-redesign] #Main [data-dw-docked-pager] .xtb-sep{display:none!important}
    body[data-dw-redesign] #Main [data-dw-docked-pager] table.x-btn{margin:0!important;background:#fff!important;box-shadow:inset 0 0 0 1px #dce5ef!important;border-radius:6px}
    body[data-dw-redesign] #Main [data-dw-docked-pager] table.x-btn.x-btn-icon .x-btn-text{width:28px!important;height:28px!important;min-height:28px!important;padding:0!important}
    body[data-dw-redesign] #Main [data-dw-docked-pager] .x-btn-icon .x-btn-image{left:50%!important;top:50%!important;width:15px!important;height:15px!important;transform:translate(-50%,-50%)}
    body[data-dw-redesign] #Main [data-dw-docked-pager] table.x-btn.x-btn-text-icon .x-btn-text{width:auto!important;min-width:84px;height:28px!important;padding:0 10px 0 29px!important;font-size:12px!important}
    body[data-dw-redesign] #Main [data-dw-docked-pager] .x-btn-text-icon .x-btn-image{left:10px!important;top:50%!important;width:14px!important;height:14px!important;transform:translateY(-50%)}
    body[data-dw-redesign] #Main [data-dw-docked-pager] table.x-btn.x-item-disabled{opacity:.45!important}
    body[data-dw-redesign] #Main [data-dw-docked-pager] :is(input.gwt-TextBox,.x-number-field input){width:44px!important;height:28px!important;padding:3px 6px!important;text-align:center;box-sizing:border-box;font-size:12px!important}
    body[data-dw-redesign] #Main [data-dw-docked-pager] .x-number-field{width:44px!important}
    body[data-dw-redesign] #Main [data-dw-docked-pager] :is(.my-paging-text,.my-paging-display){white-space:nowrap;font-size:11px!important;color:#5d718b!important}
    body[data-dw-redesign] #Main #Criteria .x-form-label{font-size:12px!important;line-height:25px;color:#64748b!important}
    body[data-dw-redesign] #Main #Criteria [data-dw-filter-label]{display:inline-flex;align-items:center;gap:6px;line-height:20px;padding:2px 8px;border-radius:5px;background:#eaf2ff!important;color:#28588f!important;font-weight:650}
    body[data-dw-redesign] #Main #Criteria [data-dw-filter-label]::before{content:'';width:12px;height:12px;display:inline-block;background:currentColor;mask-image:var(--dw-action-glyph);-webkit-mask-image:var(--dw-action-glyph);mask-size:contain;-webkit-mask-size:contain;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat}
    body[data-dw-redesign] #Main .filter-panel:not(.x-panel-collapsed){padding:12px;border:1px solid #dce5ef!important;border-radius:8px;background:#f8faff!important;box-sizing:border-box;max-width:100%!important}
    body[data-dw-redesign] #Main .filter-panel .x-tool{width:18px!important;height:18px!important;color:#3e689b}
    body[data-dw-redesign] #Main .filter-panel .x-toolbar{border-radius:6px;max-width:100%!important}
    body[data-dw-redesign] #Main[data-dw-detail] [data-dw-overview]{padding:20px 24px!important}
    body[data-dw-redesign] #Main[data-dw-detail] [data-dw-section]{max-width:100%!important;min-width:0!important;overflow:visible}
    body[data-dw-redesign] #Main[data-dw-detail] [data-dw-section] :is(.x-column-inner,.x-form-element,.x-form-item){min-width:0!important;max-width:100%!important}
    body[data-dw-redesign] #Main[data-dw-detail] .x-form-element>*{max-width:100%!important;box-sizing:border-box}
    body[data-dw-redesign] #Main[data-dw-detail] .x-form-element>.x-toolbar{width:100%!important;overflow-x:auto;overflow-y:hidden}
    body[data-dw-redesign] #Main[data-dw-detail] .x-fieldset-header-text{display:inline-flex;align-items:center;gap:8px}
    body[data-dw-redesign] #Main[data-dw-detail] .x-fieldset-header .x-tool-toggle{width:15px!important;height:15px!important;margin-right:5px;color:#8294aa}
    body[data-dw-redesign] #Main [data-dw-tab-glyph]::before{content:'';display:inline-block;width:14px;height:14px;margin-right:7px;vertical-align:-2px;background:currentColor;mask-image:var(--dw-action-glyph);-webkit-mask-image:var(--dw-action-glyph);mask-size:contain;-webkit-mask-size:contain;mask-repeat:no-repeat;-webkit-mask-repeat:no-repeat}
    body[data-dw-redesign] #Main .x-fieldset-header-text[data-dw-tab-glyph]::before{vertical-align:0;margin-right:0}
    body[data-dw-redesign] #Main [data-dw-detail-footer]{position:static!important;box-shadow:none}
    .dw-custom-grid .dw-columns summary{display:flex;align-items:center;gap:7px}
    body[data-dw-redesign] #Main::-webkit-scrollbar-button,
    .dw-custom-grid .dw-table-scroller::-webkit-scrollbar-button{display:none!important;width:0!important;height:0!important}
    .dw-custom-grid .dw-table-scroller::-webkit-scrollbar{width:10px;height:10px}
    .dw-custom-grid .dw-table-scroller::-webkit-scrollbar-track{background:#f7f9fc}
    .dw-custom-grid .dw-table-scroller::-webkit-scrollbar-thumb{background:#b5c5d8;border:2px solid #f7f9fc;border-radius:8px}
    @media(max-width:800px){body[data-dw-redesign] #Main [data-dw-docked-pager]{padding-left:10px!important;padding-right:10px!important}body[data-dw-redesign] #Main [data-dw-docked-pager] .my-paging-display{display:none}}
    @media print{body[data-dw-redesign] #Main :is([data-dw-docked-actions],[data-dw-docked-pager]){position:static!important}}
  `;
  // Important rules in this layer take precedence over the legacy theme colors.
  css += `
    @layer dw-readability {
      body[data-dinuba-modern] :is(div,span,p,a,li,td,th,label,legend,input,textarea,select,button){color:#243144!important}
      body[data-dinuba-modern] :is(input,textarea)::placeholder{color:#64748b!important;opacity:1!important}
      body[data-dinuba-modern] .dw-cell-muted{color:#334155!important}
      body[data-dinuba-modern] .dw-summary{color:#172b46!important}
      body[data-dinuba-modern] .dw-id-button{color:#174ca4!important}
      body[data-dinuba-modern] #dw-shell .dw-nav-button{color:#334155!important;font-weight:550!important}
      body[data-dinuba-modern] #dw-shell .dw-nav-button svg{color:#526780!important}
      body[data-dinuba-modern] #dw-shell .dw-nav-count{color:#526177!important;font-weight:550!important}
      body[data-dinuba-modern] #dw-shell :is(.dw-section-label,summary,.dw-brand small,.dw-sidebar-footer){color:#526177!important}
      body[data-dinuba-modern] #dw-shell .dw-nav-button[aria-current=page]{background:#dfeafa!important;color:#173b6a!important;font-weight:750!important;box-shadow:inset 3px 0 #3b6daa}
      body[data-dinuba-modern] #dw-shell .dw-nav-button[aria-current=page] .dw-nav-label{color:#173b6a!important;font-weight:750!important}
      body[data-dinuba-modern] .x-tab-strip-active{background:#e2edff!important;box-shadow:inset 0 -3px #3665a0!important}
      body[data-dinuba-modern] .x-tab-strip-active .x-tab-strip-text{color:#173b6a!important;font-weight:750!important}
      body[data-dinuba-modern] .x-grid3-hd-inner,body[data-dinuba-modern] .x-grid3-hd-inner>span{color:#334155!important;font-weight:700!important}
      body[data-dinuba-modern] table.x-btn[data-dw-action="primary"]:not(.x-item-disabled) button:not(:disabled):not([aria-disabled="true"]){color:#fff!important}
      body[data-dinuba-modern] #dinuba-print-dialog button.primary:not(:disabled){color:#fff!important}
      body[data-dinuba-modern] #dw-shell .dw-mark{color:#fff!important}
      body[data-dinuba-modern] :is(button,input,textarea,select):disabled,
      body[data-dinuba-modern] [aria-disabled="true"],
      body[data-dinuba-modern] .x-item-disabled,
      body[data-dinuba-modern] .x-item-disabled :is(button,.x-btn-text,span,div),
      body[data-dinuba-modern] table.x-btn.x-item-disabled :is(button,.x-btn-text,span,div){color:#94a3b8!important}
      body[data-dinuba-modern] .x-item-disabled svg{color:#a3afbf!important}
    }
  `;
  css += `
    .dw-custom-grid .dw-filter-toggle{display:inline-flex;align-items:center;gap:7px;height:36px;padding:0 12px;border:1px solid #cbd8e8;border-radius:7px;background:#fff;font-size:12px;font-weight:650;cursor:pointer}
    .dw-custom-grid .dw-filter-toggle svg{width:15px;height:15px;fill:none;stroke:currentColor;stroke-width:1.8}
    .dw-custom-grid .dw-filter-toggle[aria-expanded=true]{background:#eaf2ff;border-color:#a3c1e7}
    .dw-custom-grid .dw-filter-panel{flex-shrink:0;padding:16px;background:#f8fafd;border-bottom:1px solid #dfe7f2;max-height:40vh;overflow:auto}
    .dw-custom-grid .dw-filter-panel[hidden],.dw-custom-grid .dw-active-filters[hidden]{display:none!important}
    .dw-custom-grid .dw-filter-heading{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:14px}
    .dw-custom-grid .dw-filter-heading strong{font-size:13px;font-weight:700}
    .dw-custom-grid .dw-filter-help{display:block;font-size:11px;line-height:1.6;margin-top:3px}
    .dw-custom-grid .dw-filter-actions{display:flex;gap:8px;flex-shrink:0}
    .dw-custom-grid .dw-filter-actions button{padding:6px 10px;border:1px solid #d7e1ee;border-radius:6px;background:#fff;font-size:11px;font-weight:600;cursor:pointer}
    .dw-custom-grid .dw-filter-rules{display:grid;grid-template-columns:repeat(3,minmax(180px,1fr));gap:14px}
    .dw-custom-grid .dw-filter-rule>span{display:block;font-size:11px;font-weight:650;margin-bottom:6px}
    .dw-custom-grid .dw-rule-controls{display:flex;gap:6px}
    body[data-dinuba-modern] #Main .dw-filter-rule select{height:35px!important;min-width:0;padding:5px 8px!important;border:1px solid #cbd8e8!important;border-radius:6px!important;box-sizing:border-box;font-size:12px!important;background:#fff!important}
    .dw-custom-grid .dw-rule-controls select[data-filter-operator]{width:76px;flex-shrink:0}
    .dw-custom-grid .dw-rule-controls select[data-filter-value]{width:100%;flex:1}
    .dw-custom-grid .dw-active-filters{display:flex;flex-wrap:wrap;gap:7px;padding:10px 16px;border-bottom:1px solid #e4ebf4;background:#fff;flex-shrink:0}
    .dw-custom-grid .dw-active-filters button{display:inline-flex;align-items:center;gap:7px;padding:5px 9px;font-size:11px!important;background:#edf3fc;border:1px solid #d5e2f5;border-radius:20px;cursor:pointer;max-width:100%;overflow-wrap:anywhere}
    .dw-custom-grid .dw-active-filters button:hover{background:#dfeafa}
    .dw-custom-grid .dw-filter-toggle .dw-filter-badge{display:inline-grid;place-items:center;min-width:17px;height:17px;padding:0 4px;background:#dbeafe;border-radius:10px;font-size:10px}
    .dw-custom-grid .dw-filter-badge[hidden]{display:none!important}
    @media(max-width:1200px){.dw-custom-grid .dw-filter-rules{grid-template-columns:repeat(2,minmax(160px,1fr))}}
    @media(max-width:750px){.dw-custom-grid .dw-filter-rules{grid-template-columns:minmax(0,1fr)}.dw-custom-grid .dw-filter-heading{align-items:flex-start;flex-direction:column}.dw-custom-grid .dw-ticket-search{min-width:180px}}
  `;
  css += `
    body[data-dinuba-modern] #Main .dw-activity-heading{display:flex;align-items:flex-start;gap:13px;padding:22px 24px 17px;background:#fff;border-bottom:1px solid #e5ebf3;box-sizing:border-box}
    .dw-activity-heading .dw-activity-icon{width:38px;height:38px;flex-shrink:0;display:grid;place-items:center;border-radius:10px;background:#eaf2ff;color:#3b679e}
    .dw-activity-heading svg,.dw-activity-empty svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.7;stroke-linecap:round;stroke-linejoin:round}
    .dw-activity-heading .dw-activity-title{display:flex;align-items:center;gap:9px;margin:0;font-size:17px;font-weight:700;line-height:1.4}
    .dw-activity-heading .dw-activity-subtitle{margin:5px 0 0;font-size:12px;line-height:1.6}
    .dw-activity-heading .dw-activity-count{padding:3px 8px;background:#edf2f8;border-radius:12px;font-size:10px;font-weight:600;white-space:nowrap}
    .dw-activity-heading .dw-activity-tools{display:flex;align-items:center;gap:8px;margin-left:auto;flex-shrink:0}
    body[data-dinuba-modern] #Main .dw-activity-tools button,
    body[data-dinuba-modern] #Main .dw-activity-empty button{padding:7px 11px!important;font-size:12px!important;border:1px solid #cbd8e8!important;border-radius:6px;background:#fff!important;font-weight:600;cursor:pointer;white-space:nowrap}
    .dw-activity-summary{display:flex;gap:12px;padding:14px 24px;background:#f8fafd;border-bottom:1px solid #e5ebf3;flex-wrap:wrap}
    .dw-activity-metric{min-width:130px;padding:10px 14px;background:#fff;border:1px solid #e1e8f2;border-radius:8px}
    .dw-activity-metric strong{display:block;font-size:18px;font-weight:700;font-variant-numeric:tabular-nums}
    .dw-activity-metric span{display:block;margin-top:3px;font-size:10px;font-weight:600}
    .dw-activity-overview-links{display:flex;gap:7px;flex-wrap:wrap;padding:13px 24px;background:#f8fafd;border-bottom:1px solid #e5ebf3}
    body[data-dinuba-modern] #Main .dw-activity-overview-links button{padding:5px 9px;border:1px solid #dce5f0;border-radius:6px;background:white;font-size:11px;cursor:pointer}
    body[data-dinuba-modern] #Main [data-dw-section]{scroll-margin-top:80px}
    body[data-dinuba-modern] #Main .x-grid3[data-dw-activity-source]{opacity:0!important;pointer-events:none!important}
    .dw-history-view{position:absolute;inset:0;z-index:2;background:#f8fafd;overflow:auto;padding:22px 26px;box-sizing:border-box}
    .dw-history-view[hidden],.dw-activity-empty[hidden],.dw-activity-summary[hidden],.dw-activity-tools button[hidden]{display:none!important}
    .dw-history-event{position:relative;max-width:1100px;margin:0 0 16px 12px;padding:17px 20px;background:white;border:1px solid #dde6f1;border-radius:10px;box-sizing:border-box;box-shadow:0 2px 5px #1e293b03}
    .dw-history-event::before{content:'';position:absolute;left:-19px;top:24px;width:10px;height:10px;border-radius:50%;background:#729bd0;box-shadow:0 0 0 5px #f8fafd}
    .dw-history-event::after{content:'';position:absolute;left:-15px;top:39px;bottom:-23px;width:1px;background:#d5e0ee}
    .dw-history-event:last-child::after{display:none}
    .dw-history-top{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
    .dw-history-top strong{font-size:13px;font-weight:700}.dw-history-top time{font-size:11px;white-space:nowrap}
    .dw-history-change{display:grid;grid-template-columns:minmax(0,1fr) 20px minmax(0,1fr);gap:10px;align-items:center}
    .dw-history-change>div{padding:10px 12px;border-radius:7px;background:#f3f6fb;min-width:0;overflow-wrap:anywhere;font-size:12px}
    .dw-history-change>div:last-child{background:#edf4ff}
    .dw-history-change small{display:block;font-size:9px;font-weight:700;letter-spacing:.4px;text-transform:uppercase;margin-bottom:4px}
    .dw-history-meta{margin:11px 0 0;font-size:11px;line-height:1.6;overflow-wrap:anywhere}
    .dw-activity-empty{position:absolute;top:48px;left:0;right:0;bottom:0;z-index:3;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:11px;padding:24px;background:#fff;text-align:center;box-sizing:border-box}
    .dw-activity-empty .dw-empty-symbol{display:grid;place-items:center;width:50px;height:50px;border-radius:14px;background:#f0f5fc;margin-bottom:2px}
    .dw-activity-empty strong{font-size:15px;font-weight:650}.dw-activity-empty p{margin:0;max-width:380px;font-size:12px;line-height:1.6}
    body[data-dinuba-modern] #Main [data-dw-tab-kind="Notes"] [class~="x-grid3-col-base.inc_note.note"]{white-space:pre-wrap!important;line-height:1.7!important}
    body[data-dinuba-modern] #Main [data-dw-tab-kind="Notes"] .x-grid3-cell-inner{line-height:1.65!important}
    body[data-dinuba-modern] #Main [data-dw-tab-kind="Notes"] [data-dw-long]{white-space:pre-wrap!important}
    body[data-dinuba-modern] #Main [data-dw-tab-grid-frame]{height:var(--dw-activity-height,400px)!important;min-height:0!important;position:relative}
    body[data-dinuba-modern] #Main :is([data-dw-tab-kind="Labor_Transactions"],[data-dw-tab-kind="Purchases"]) [data-dw-numeric]{text-align:right!important;font-variant-numeric:tabular-nums;white-space:nowrap!important}
    body[data-dinuba-modern] #Main [data-dw-tab-kind="Attachments"] .data-reference,
    body[data-dinuba-modern] #Main [data-dw-tab-kind="Attachments"] a{font-weight:600;text-underline-offset:3px}
    @media(max-width:850px){.dw-activity-heading{flex-wrap:wrap}.dw-activity-heading .dw-activity-tools{margin-left:51px}.dw-history-change{grid-template-columns:minmax(0,1fr)}.dw-history-change>span{display:none}.dw-history-top{align-items:flex-start;flex-direction:column}.dw-history-view{padding:16px}.dw-activity-summary{padding:12px}}
  `;
  css += `
    .dw-table-bar > button[data-refresh-search],.dw-table-bar > button[data-stop-search]{height:30px;padding:0 10px;border:1px solid #cbd5e1;border-radius:7px;background:#fff;font:600 12px system-ui;color:#334155;cursor:pointer;white-space:nowrap}
    .dw-table-bar > button:hover{background:#eff6ff;border-color:#93b4ee}
    .dw-table-bar > button:disabled{opacity:.5;cursor:wait}
    .dw-table-bar > button[hidden]{display:none!important}
    .dw-ticket-table input:disabled{opacity:.35;cursor:not-allowed}
  `;
  css += `
    #Main .dw-notes-view{padding:22px 24px!important;background:#f6f8fc;display:flex;flex-direction:column;gap:16px;align-items:stretch}
    #Main .dw-notes-view[hidden]{display:none!important}
    #Main .dw-note-card{width:100%;max-width:1100px;box-sizing:border-box;margin:0 auto;background:#fff;border:1px solid #dce3ed;border-radius:12px;box-shadow:0 2px 6px #172b4d05;flex-shrink:0;overflow:hidden}
    #Main .dw-note-card.dw-note-resolution{border-left:4px solid #15936e}
    #Main .dw-note-card header{display:flex;gap:12px;align-items:center;padding:18px 20px 10px}
    #Main .dw-note-avatar{display:grid;place-items:center;width:36px;height:36px;flex-shrink:0;border-radius:50%;background:#e8effc;font-size:12px;font-weight:750}
    #Main .dw-note-author{min-width:0;flex:1}.dw-note-author strong{display:block;font-size:13px;overflow-wrap:anywhere}.dw-note-author>span{display:block;margin-top:4px;font-size:12px;line-height:1.6}
    #Main .dw-note-content{padding:10px 20px 22px 68px;font-size:14px;line-height:1.8;white-space:pre-wrap;overflow-wrap:anywhere}
    #Main .dw-note-card footer{display:flex;align-items:center;gap:10px;padding:11px 20px;border-top:1px solid #edf0f5;background:#fbfcfe;min-height:28px}
    #Main .dw-note-badge{padding:4px 9px;border:1px solid #b7dfce;background:#e9f7ef;border-radius:6px;font-size:11px;font-weight:700}
    #Main .dw-note-visibility{font-size:12px;font-weight:600}
    #Main .dw-note-card button{display:inline-flex;align-items:center;gap:6px;padding:6px 9px;border:1px solid #d6dfec;border-radius:6px;background:#fff;font:600 12px system-ui;cursor:pointer;white-space:nowrap}
    #Main .dw-note-card button:hover{background:#eff5ff;border-color:#91b4ec}
    #Main .dw-note-card button:focus-visible{outline:2px solid #2563eb;outline-offset:3px}
    #Main .dw-note-card footer button{margin-left:auto}
    #Main [data-dw-tab-kind="Notes"] .dw-activity-summary{display:none!important}
    @media(max-width:650px){#Main .dw-notes-view{padding:12px!important}#Main .dw-note-content{padding:12px 16px 20px}#Main .dw-note-card header{padding:14px;flex-wrap:wrap}#Main .dw-note-card footer{padding:10px 14px}}
  `;
  const style = document.createElement('style');
  style.id = 'dinuba-modern-workspace-theme';
  style.textContent = css;
  document.head.append(style);
  document.body.setAttribute('data-dinuba-modern', '');

  const norm = value => String(value || '').replace(/\s+/g, ' ').trim().toLowerCase();
  function statusFor(value) {
    const text = norm(value);
    if (['unassigned', 'none'].includes(text)) return 'unassigned';
    if (/^(new|new request|open)$/.test(text)) return 'new';
    if (/^(in progress|in process|assigned|working)$/.test(text)) return 'working';
    if (/^(completed?|closed|resolved)$/.test(text)) return 'complete';
    if (/^(waiting|pending|on hold)/.test(text)) return 'waiting';
    return '';
  }
  let shell = null, shellSignature = '', navSources = [];
  const safe = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shellIcon = name => {
    const paths = {
      views:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 10h16M10 10v10"/>',
      today:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 11h18M8 15h3"/>',
      done:'<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
      unassigned:'<circle cx="9" cy="7" r="4"/><path d="M2 21v-2a7 7 0 0 1 12-5M16 9h6M19 6v6"/>',
      archive:'<path d="M3 3h18v5H3V3ZM5 8v13h14V8M9 12h6"/>',
      mine:'<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="9" r="3"/><path d="M7 18a5 5 0 0 1 10 0"/>',
      queue:'<path d="M5 6h14M5 12h14M5 18h14"/>',
      search:'<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>',
      home:'<path d="m3 10 9-7 9 7M5 9v12h14V9M9 21v-8h6v8"/>',
      help:'<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 4 2c-1 .6-1.5 1-1.5 2M12 17h.01"/>',
      arrow:'<path d="m9 5 7 7-7 7"/>'
    };
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${paths[name] || paths.views}</svg>`;
  };
  function activateOriginal(el) {
    if (!el?.isConnected) return;
    for (const type of ['mousedown','mouseup','click']) el.dispatchEvent(new MouseEvent(type,{bubbles:true,cancelable:true,view:window,button:0}));
  }
  function syncShell() {
    const main = document.getElementById('Main');
    const nativeNav = document.querySelector('.navigation-panel');
    if (!main || !nativeNav) {
      document.body.removeAttribute('data-dw-redesign');
      if(shell){shell.remove();shell=null;shellSignature='';}
      return;
    }
    const sourceItems = [...nativeNav.querySelectorAll('.x-view-item')];
    let group = 'views';
    const records = [];
    for (const row of sourceItems) {
      if (norm(row.textContent) === 'work queues') {group='queues';continue;}
      const label = row.querySelector('[qtip]');
      if (!label) continue;
      const text = label.textContent.trim();
      const counter = [...row.querySelectorAll('span')].find(el=>!el.hasAttribute('qtip') && /^\d+$/.test(el.textContent.trim()));
      records.push({label:text,count:counter?.textContent.trim() || '',group,source:label});
    }
    if (!records.length) return;
    navSources = records;
    prepareDetails(main);
    syncDetailTabs(main);
    dockWorkspace(main);
    const headings = [...main.querySelectorAll('.x-panel-header-text[role="heading"]')];
    const idField=main.querySelector('[data-dw-ticket-tabs] [id="base_inc_incident_id"]');
    const ticketId=(idField?.value || idField?.textContent || '').trim();
    const title = main.hasAttribute('data-dw-detail') ? `Ticket${ticketId?' #'+ticketId:''}` : headings.map(el=>el.textContent.trim()).find(Boolean) || 'Tickets';
    document.body.setAttribute('data-dw-redesign','');
    if (!shell) {
      shell = document.createElement('div');
      shell.id = 'dw-shell';
      shell.innerHTML = `<header class="dw-header"><div class="dw-breadcrumb"><span>Service desk</span><span>/</span><strong data-dw-page-title></strong></div><div class="dw-actions"><button type="button" class="dw-action" data-dw-native="Home" title="Home">${shellIcon('home')}<span>Home</span></button><button type="button" class="dw-action" data-dw-native="Help" title="Help">${shellIcon('help')}<span>Help</span></button><button type="button" class="dw-action" data-dw-logout title="Log out">Log out</button><span class="dw-avatar" aria-label="IT workspace">IT</span></div></header><aside class="dw-sidebar" aria-label="Service desk navigation"><div class="dw-brand"><div class="dw-mark">D</div><div class="dw-brand-text"><strong>Service desk</strong><small>Dinuba Unified</small></div></div><div class="dw-search">${shellIcon('search')}<input type="search" aria-label="Search ticket views and work queues" placeholder="Find a view or queue…"></div><nav class="dw-navigation" aria-label="Ticket views"><p class="dw-section-label">Workspace</p><div data-dw-views></div><details><summary>Work queues ${shellIcon('arrow')}</summary><div data-dw-queues></div></details><p class="dw-empty" hidden>No matching views.</p></nav><div class="dw-sidebar-footer">SchoolDude · Dinuba Unified</div></aside>`;
      document.body.append(shell);
      const actions=shell.querySelector('.dw-actions');
      const originalSearch=document.querySelector('.sl-head-search input');
      if(originalSearch){
        const search=document.createElement('input');search.type='search';search.className='dw-global-search';
        search.placeholder='Search SchoolDude…';search.setAttribute('aria-label','Search SchoolDude');
        search.addEventListener('keydown',event=>{
          if(event.key!=='Enter')return;
          const native=document.querySelector('.sl-head-search input');if(!native)return;
          native.value=search.value;
          native.dispatchEvent(new Event('input',{bubbles:true}));
          native.dispatchEvent(new Event('change',{bubbles:true}));
          for(const type of ['keydown','keypress','keyup'])native.dispatchEvent(new KeyboardEvent(type,{key:'Enter',code:'Enter',keyCode:13,charCode:13,which:13,bubbles:true}));
        });
        actions.prepend(search);
      }
      const originalProducts=document.getElementById('products-list');
      if(originalProducts){
        const select=document.createElement('select');select.className='dw-products';select.setAttribute('aria-label','Switch SchoolDude product');
        select.innerHTML=[...originalProducts.options].map(option=>`<option value="${safe(option.value)}">${safe(option.value?option.textContent:'Applications')}</option>`).join('');
        select.value=originalProducts.value;
        select.addEventListener('change',()=>{const original=document.getElementById('products-list');if(original){original.value=select.value;original.dispatchEvent(new Event('change',{bubbles:true}));}});
        actions.append(select);
      }
      shell.addEventListener('click',event=>{
        const nav = event.target.closest('[data-dw-nav-index]');
        if(nav){activateOriginal(navSources[Number(nav.dataset.dwNavIndex)]?.source);return;}
        const native = event.target.closest('[data-dw-native]');
        if(native){activateOriginal([...document.querySelectorAll('.sl-head button')].find(b=>b.id===native.dataset.dwNative));return;}
        if(event.target.closest('[data-dw-logout]')) activateOriginal([...document.querySelectorAll('.sl-head button')].find(b=>norm(b.textContent)==='logout'));
      });
      shell.querySelector('.dw-search input').addEventListener('input',filterNavigation);
    }
    const signature = JSON.stringify([title,records.map(r=>[r.label,r.count,r.group])]);
    if(signature !== shellSignature){
      shellSignature=signature;
      shell.querySelector('[data-dw-page-title]').textContent=title;
      for(const [selector,groupName] of [['[data-dw-views]','views'],['[data-dw-queues]','queues']]) {
        shell.querySelector(selector).innerHTML=records.map((record,index)=>({...record,index})).filter(r=>r.group===groupName).map(r=>{
          const label=norm(r.label);
          const icon=r.group==='queues'?'queue':label==='my tickets'?'mine':label.includes('completed')?'done':label.includes('unassigned')?'unassigned':label.includes('today')?'today':label==='all tickets'?'archive':'views';
          return `<button type="button" class="dw-nav-button" data-dw-nav-index="${r.index}" title="${safe(r.label)}" ${label===norm(title)?'aria-current="page"':''}>${shellIcon(icon)}<span class="dw-nav-label">${safe(r.label)}</span><span class="dw-nav-count">${safe(r.count)}</span></button>`;
        }).join('');
      }
      filterNavigation();
    }
    fitWorkspace(main);
  }
  function prepareDetails(main) {
    const candidates=[...main.querySelectorAll('[id="base_inc_incident_description"], [id="base_inc_incident_id"]')];
    const tabs=candidates.map(field=>field.closest('.x-tab-panel')).find(panel=>panel && panel.getClientRects().length);
    if(!tabs){main.removeAttribute('data-dw-detail');return;}
    main.setAttribute('data-dw-detail','');
    tabs.setAttribute('data-dw-ticket-tabs','');
    for(let el=tabs.parentElement;el && el!==main;el=el.parentElement)el.setAttribute('data-dw-detail-path','');
    for(const el of tabs.querySelectorAll('.x-panel,.x-panel-bwrap,.x-panel-body,.x-tab-panel-body,.x-column-layout-ct')) {
      if(!el.closest('.x-grid-panel'))el.setAttribute('data-dw-detail-path','');
    }
    const body=tabs.querySelector(':scope>.x-tab-panel-body');
    if(body)for(const page of body.children)page.setAttribute('data-dw-detail-page','');
    for(const section of tabs.querySelectorAll('fieldset.x-fieldset')) {
      const title=section.querySelector('.x-fieldset-header-text')?.textContent.trim() || 'Ticket information';
      section.setAttribute('data-dw-section',title);
      const overview=section.parentElement;
      if(overview.classList.contains('x-panel-body'))overview.setAttribute('data-dw-overview','');
      for(const item of section.querySelectorAll('.x-form-item')) {
        const control=item.querySelector('[name^="base.inc_incident."], [id^="base_inc_incident_"], .x-form-element>[id]');
        if(!control)continue;
        const key=(control.getAttribute('name') || control.id).replace(/^base\.inc_incident\.|^base_inc_incident_/,'');
        item.setAttribute('data-dw-field',key);
        const input=item.querySelector('input,textarea,select');
        const label=item.querySelector(':scope>.x-form-item-label');
        if(input?.id && label)label.htmlFor=input.id;
      }
    }
    const apply=[...main.querySelectorAll('button')].find(button=>button.id==='Apply');
    const footer=apply?.closest('.x-panel-fbar')?.closest('.x-panel-footer');
    if(footer)footer.setAttribute('data-dw-detail-footer','');
  }
  function filterNavigation() {
    if(!shell)return;
    const query=norm(shell.querySelector('.dw-search input').value);
    let count=0;
    for(const button of shell.querySelectorAll('[data-dw-nav-index]')) {
      const record=navSources[Number(button.dataset.dwNavIndex)];
      const show=!!record && (!query || norm(record.label).includes(query));
      button.hidden=!show;
      // Author display:flex rules must not override the hidden attribute.
      button.style.display=show?'':'none';
      if(show)count++;
    }
    if(query)shell.querySelector('details').open=true;
    shell.querySelector('.dw-empty').hidden=!!count;
  }
  const detailTabConfig={
    overview:{title:'Ticket overview',icon:'notes',description:'Review the request, assignment, location, and contact details.'},
    Assignment_History:{title:'Assignment history',icon:'user',description:'Follow technician and work-queue changes for this ticket.',history:true,empty:'No assignment changes on this page.'},
    Status_History:{title:'Status history',icon:'history',description:'Review when this ticket moved between statuses.',history:true,empty:'No status changes on this page.'},
    Notes:{title:'Notes',icon:'notes',description:'Review ticket notes, visibility, and resolution markers.',empty:'No notes on this page.',add:'Add note'},
    Labor_Transactions:{title:'Labor transactions',icon:'labor',description:'Review time entries, rates, and recorded labor costs.',empty:'No labor entries on this page.',add:'Add labor entry'},
    Purchases:{title:'Purchases',icon:'purchase',description:'Review purchased items, quantities, and recorded costs.',empty:'No purchases on this page.',add:'Add purchase'},
    Attachments:{title:'Attachments',icon:'attachment',description:'Manage files and supporting documents for this ticket.',empty:'No attachments on this page.',add:'Add attachment'}
  };
  const detailTabRecords=new WeakMap();
  const activityIcon=name=>`<svg viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.notes}</svg>`;
  function readActivityRows(grid){
    const columns=[...grid.querySelectorAll('.x-grid3-hd-inner')].map(header=>{
      const name=[...header.classList].find(c=>/^x-grid3-hd-.+\..+$/.test(c));
      if(/hours|rate|cost|quantity|shipping|tax|total/i.test(header.textContent))header.setAttribute?.('data-dw-numeric','');
      return name?{field:name.slice('x-grid3-hd-'.length),label:header.textContent.trim()}:null;
    }).filter(c=>c?.label);
    const rows=[...grid.querySelectorAll('.x-grid3-row')].map(row=>{
      const values={};
      for(const column of columns){
        const cell=row.querySelector(`[class~="x-grid3-col-${column.field}"]`);
        values[column.label]=cell?.textContent.trim() || (cell?.querySelector('.x-grid3-check-col-on')?'Yes':cell?.querySelector('.x-grid3-check-col')?'No':'');
        if(cell && /hours|rate|cost|quantity|shipping|tax|total/i.test(column.label))cell.setAttribute('data-dw-numeric','');
        if(cell && /^(note|description)$/i.test(column.label))cell.setAttribute('data-dw-long','');
      }
      return {values,selected:!!row.classList?.contains('x-grid3-row-selected')};
    });
    return {columns,rows};
  }
  function activityValue(row,...names){
    for(const name of names){const entry=Object.entries(row.values).find(([label])=>norm(label)===norm(name));if(entry)return entry[1];}
    return '';
  }
  function historyHTML(rows,kind){
    return rows.map(row=>{
      const type=activityValue(row,'Assignment Type') || 'Status';
      const action=activityValue(row,'Action');
      const from=activityValue(row,'Changed From','Status Changed From') || 'Not set';
      const to=activityValue(row,'Changed To','Status Changed To') || 'Not set';
      const who=activityValue(row,'Updated By','Created By');
      const when=activityValue(row,'Updated On','Created On');
      return `<article class="dw-history-event"><div class="dw-history-top"><strong>${safe(kind==='Assignment_History'?type:'Status change')}</strong><time>${safe(when)}</time></div><div class="dw-history-change"><div><small>From</small>${safe(from)}</div><span aria-hidden="true">→</span><div><small>To</small>${safe(to)}</div></div><p class="dw-history-meta">${safe(who)}${action?` · ${safe(action)}`:''}</p></article>`;
    }).join('');
  }
  function isResolutionNote(row){return /^(yes|true|resolution)$/i.test(activityValue(row,'Mark As Resolution').trim());}
  function notesHTML(rows){
    return rows.map((row,index)=>{
      const author=activityValue(row,'Created By') || 'Unknown author';
      const date=activityValue(row,'Created On');
      const visibility=activityValue(row,'Public','Public Note','Is Public');
      const source=activityValue(row,'Source');
      const resolution=isResolutionNote(row);
      const initials=author.split('@')[0].split(/[.\s_-]+/).filter(Boolean).slice(0,2).map(word=>word[0]).join('').toUpperCase() || 'N';
      const text=activityValue(row,'Note','Description') || 'No note text.';
      return `<article class="dw-note-card${resolution?' dw-note-resolution':''}"><header><span class="dw-note-avatar" aria-hidden="true">${safe(initials)}</span><div class="dw-note-author"><strong>${safe(author)}</strong><span>${date?`<time>${safe(date)}</time>`:'Date unavailable'}${source?` · ${safe(source)}`:''}</span></div><button type="button" data-edit-note="${index}" aria-label="Edit note by ${safe(author)}">${activityIcon('edit')}Edit note</button></header><div class="dw-note-content">${safe(text)}</div><footer>${resolution?'<span class="dw-note-badge">✓ Resolution</span>':''}${visibility?`<span class="dw-note-visibility">${/^(yes|true)$/i.test(visibility)?'Public note':/^(no|false)$/i.test(visibility)?'Private note':safe(visibility)}</span>`:''}<button type="button" data-select-note="${index}" aria-pressed="${!!row.selected}">${row.selected?'✓ Selected':'Select note'}</button></footer></article>`;
    }).join('');
  }
  function activityMetrics(rows,kind){
    const metrics=[['Rows on this page',String(rows.length)]];
    const sum=label=>{
      const values=rows.map(row=>activityValue(row,label));
      if(values.some(value=>!value.trim()))return '—';
      const numbers=values.map(value=>Number(value.replace(/[$,\s]/g,'')));
      if(numbers.some(value=>!Number.isFinite(value)))return '—';
      return numbers.reduce((a,b)=>a+b,0).toLocaleString(undefined,{maximumFractionDigits:2});
    };
    if(kind==='Labor_Transactions')metrics.push(['Hours on this page',sum('Hours')]);
    if(kind==='Purchases')metrics.push(['Quantity on this page',sum('Quantity')]);
    if(kind==='Attachments')metrics.push(['With descriptions',String(rows.filter(row=>activityValue(row,'Description').trim()).length)]);
    if(kind==='Notes')metrics.push(['Resolution notes',rows.some(row=>!activityValue(row,'Mark As Resolution'))?'—':String(rows.filter(isResolutionNote).length)]);
    return metrics;
  }
  function syncDetailTabs(main){
    if(!main.hasAttribute('data-dw-detail'))return;
    const tabs=main.querySelector('[data-dw-ticket-tabs]');
    const body=tabs?.querySelector(':scope>.x-tab-panel-body');
    if(!body)return;
    for(const page of body.children){
      const kind=page.id?.replace(/^_p-/,'');
      const config=detailTabConfig[kind];if(!config)continue;
      page.setAttribute('data-dw-tab-kind',kind);
      let record=detailTabRecords.get(page);
      if(!record){
        const heading=document.createElement('section');heading.className='dw-activity-heading';
        heading.innerHTML=`<div class="dw-activity-icon">${activityIcon(config.icon)}</div><div><h2 class="dw-activity-title">${safe(config.title)}<span class="dw-activity-count"></span></h2><p class="dw-activity-subtitle">${safe(config.description)}</p></div><div class="dw-activity-tools"><button type="button" data-activity-native hidden>Table view</button><button type="button" data-activity-add hidden>${safe(config.add || 'New')}</button></div>`;
        const summary=document.createElement('div');summary.className=kind==='overview'?'dw-activity-overview-links':'dw-activity-summary';
        page.prepend(heading,summary);
        record={page,kind,config,heading,summary,grid:null,signature:'',native:false,dismissedEmpty:false};
        detailTabRecords.set(page,record);
        heading.querySelector('[data-activity-native]').addEventListener('click',()=>{
          record.native=!record.native;record.signature='';syncDetailTabs(main);
        });
        const add=()=>{
          const button=[...page.querySelectorAll('.x-panel-fbar button')].find(b=>b.id==='New' && layoutVisible(b));
          if(!button || button.getAttribute('aria-disabled')==='true' || button.closest('.x-item-disabled'))return;
          record.dismissedEmpty=true;if(record.empty)record.empty.hidden=true;
          activateOriginal(button);
        };
        record.add=add;heading.querySelector('[data-activity-add]').addEventListener('click',add);
      }
      if(kind==='overview'){
        const sections=[...page.querySelectorAll('fieldset[data-dw-section]')];
        const labels=sections.map(section=>section.getAttribute('data-dw-section'));
        const key=JSON.stringify(labels);
        if(key!==record.signature){
          record.signature=key;record.heading.querySelector('.dw-activity-count').textContent=`${sections.length} sections`;
          record.summary.innerHTML=labels.map((label,index)=>`<button type="button" data-jump-section="${index}">${safe(label)}</button>`).join('');
          record.summary.onclick=event=>{const button=event.target.closest('[data-jump-section]');if(button)sections[Number(button.dataset.jumpSection)]?.scrollIntoView({block:'start',behavior:'auto'});};
        }
        continue;
      }
      const grid=page.querySelector('.x-grid3');if(!grid)continue;
      if(record.grid!==grid){
        record.empty?.remove();record.timeline?.remove();record.dismissedEmpty=false;
        record.grid=grid;record.signature='';
        const empty=document.createElement('div');empty.className='dw-activity-empty';empty.hidden=true;
        empty.innerHTML=`<div class="dw-empty-symbol">${activityIcon(config.icon)}</div><strong>${safe(config.empty)}</strong><p>Records for this ticket will appear here.</p>${config.add?`<button type="button">${safe(config.add)}</button>`:''}`;
        empty.querySelector('button')?.addEventListener('click',record.add);
        grid.parentElement.append(empty);record.empty=empty;
        if(config.history || kind==='Notes'){
          const timeline=document.createElement('section');timeline.className=kind==='Notes'?'dw-history-view dw-notes-view':'dw-history-view';timeline.setAttribute('aria-label',config.title);
          grid.parentElement.append(timeline);record.timeline=timeline;
          if(kind==='Notes')timeline.addEventListener('click',event=>{
            const edit=event.target.closest('[data-edit-note]'),select=event.target.closest('[data-select-note]');
            if(!edit && !select)return;
            const row=[...grid.querySelectorAll('.x-grid3-row')][Number(edit?.dataset.editNote ?? select.dataset.selectNote)];
            const control=edit?(row?.querySelector('.icon-edit') || row?.querySelector('[class~="x-grid3-col-editor"] a')):row?.querySelector('.x-grid3-row-checker');
            if(control){activateOriginal(control);record.signature='';setTimeout(()=>syncDetailTabs(main),100);}
            else if(edit){record.native=true;record.signature='';syncDetailTabs(main);alert('Use the original table’s edit control for this note.');}
          });
        }
      }
      const {rows}=readActivityRows(grid);
      const signature=JSON.stringify([rows,record.native]);
      if(signature!==record.signature){
        record.signature=signature;
        record.heading.querySelector('.dw-activity-count').textContent=`${rows.length} on this page`;
        record.summary.innerHTML=activityMetrics(rows,kind).map(([label,value])=>`<div class="dw-activity-metric"><strong>${safe(value)}</strong><span>${safe(label)}</span></div>`).join('');
        if(record.timeline)record.timeline.innerHTML=kind==='Notes'?notesHTML(rows):historyHTML(rows,kind);
      }
      const newButton=[...page.querySelectorAll('.x-panel-fbar button')].find(b=>b.id==='New');
      const add=record.heading.querySelector('[data-activity-add]');
      add.hidden=!config.add || !newButton;add.disabled=!newButton || newButton.getAttribute('aria-disabled')==='true' || !!newButton.closest('.x-item-disabled');
      const view=record.heading.querySelector('[data-activity-native]');view.hidden=!config.history && kind!=='Notes';
      const viewLabel=record.native?(kind==='Notes'?'Card view':'Timeline view'):'Table view';if(view.textContent!==viewLabel)view.textContent=viewLabel;
      if(record.timeline){
        record.timeline.hidden=record.native;
        if(record.native){grid.removeAttribute('data-dw-activity-source');grid.removeAttribute('aria-hidden');}
        else{grid.setAttribute('data-dw-activity-source','');if(!grid.contains(document.activeElement))grid.setAttribute('aria-hidden','true');}
      }
      if(rows.length)record.dismissedEmpty=false;
      const loading=[...page.querySelectorAll('.x-mask-loading,.ext-el-mask')].some(layoutVisible);
      record.empty.hidden=!!rows.length || loading || record.dismissedEmpty;
      record.empty.style.top=(config.history || kind==='Notes') && !record.native?'0px':'44px';
    }
  }
  const glyphs=new Map();
  function setGlyph(el,name,attribute='data-dw-action-icon') {
    if(!el || !icons[name])return;
    if(!glyphs.has(name)){
      const svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name]}</svg>`;
      glyphs.set(name,`url("data:image/svg+xml,${encodeURIComponent(svg)}")`);
    }
    el.setAttribute(attribute,name);el.style.setProperty('--dw-action-glyph',glyphs.get(name));
  }
  const layoutVisible=el=>el.getClientRects().length>0 && getComputedStyle(el).visibility!=='hidden';
  function dockWorkspace(main) {
    const footers=[...main.querySelectorAll('.x-panel-fbar')].filter(layoutVisible);
    const footer=footers.find(el=>!el.closest('[data-dw-ticket-tabs]')) || footers.at(-1);
    const pagers=[...main.querySelectorAll('.page-toolbar')].filter(layoutVisible);
    const pager=pagers.at(-1);
    for(const el of main.querySelectorAll('[data-dw-docked-actions]'))if(el!==footer)el.removeAttribute('data-dw-docked-actions');
    for(const el of main.querySelectorAll('[data-dw-docked-pager]'))if(el!==pager)el.removeAttribute('data-dw-docked-pager');
    if(footer)footer.setAttribute('data-dw-docked-actions','');
    if(pager)pager.setAttribute('data-dw-docked-pager','');
    main.setAttribute('data-dw-docked','');
    document.body.style.setProperty('--dw-action-height',footer?'50px':'0px');
    document.body.style.setProperty('--dw-pager-height',pager?'44px':'0px');
    main.setAttribute('data-dw-dock-space',String((footer?50:0)+(pager?44:0)));
    const actions={new:'plus',apply:'check',save:'save','clone ticket':'clone',reset:'page-refresh',close:'close',discard:'trash','order parts':'purchase','log call':'phone','print tickets':'printer','print ticket':'printer','add chromebooks':'laptop','assign tickets':'user',personalizations:'gear'};
    for(const button of footer?.querySelectorAll('button') || []){
      const icon=actions[norm(button.textContent)];if(icon)setGlyph(button,icon);
    }
    for(const label of main.querySelectorAll('.x-tab-strip-text,.x-fieldset-header-text')){
      const text=norm(label.textContent);
      const icon=text.startsWith('overview')?'notes':text.startsWith('assignment')?'user':text.startsWith('status')?'history':text.startsWith('notes')?'notes':text.startsWith('labor')?'labor':text.startsWith('purchases')?'purchase':text.startsWith('attachments')?'attachment':text==='ticket summary'?'notes':text==='ticket details'?'edit':text==='contact information'?'user':text==='budget information'?'purchase':text==='outage tracking'?'history':text==='deferral tracking'?'calendar':null;
      if(icon)setGlyph(label,icon,'data-dw-tab-glyph');
    }
    for(const label of main.querySelectorAll('#Criteria .link')){
      if(norm(label.textContent)==='filter')setGlyph(label,'filter','data-dw-filter-label');
    }
    for(const label of main.querySelectorAll('.x-panel-header-text[role="heading"]')){
      if(label.textContent.trim() && !label.closest('[data-dw-ticket-tabs]'))setGlyph(label,'notes','data-dw-tab-glyph');
    }
  }
  function availableGridHeight(main,grid,fallback) {
    if(!main.hasAttribute('data-dw-docked') || !Number.isFinite(window.innerHeight))return fallback;
    const dock=Number(main.getAttribute('data-dw-dock-space')) || 0;
    return Math.max(120,Math.floor(window.innerHeight-grid.getBoundingClientRect().top-dock-8));
  }
  function fitWorkspace(main) {
    if(main.hasAttribute('data-dw-detail')) {
      // Each tab may instantiate its grid lazily. Fit visible tab grids independently.
      for(const grid of main.querySelectorAll('[data-dw-ticket-tabs] .x-grid3')) {
        if(!grid.getClientRects().length)continue;
        grid.setAttribute('data-dw-fitted','');
        const header=grid.querySelector('.x-grid3-viewport>.x-grid3-header');
        const height=availableGridHeight(main,grid,Math.max(240,main.getBoundingClientRect().height-230));
        grid.style.setProperty('--dw-grid-height',`${height}px`);
        grid.parentElement.setAttribute('data-dw-tab-grid-frame','');
        grid.parentElement.style.setProperty('--dw-activity-height',`${height}px`);
        grid.style.setProperty('--dw-grid-heading',`${header?.getBoundingClientRect().height || 44}px`);
        for(let el=grid.parentElement;el && !el.hasAttribute('data-dw-ticket-tabs');el=el.parentElement)el.setAttribute('data-dw-fit-width','');
      }
      return;
    }
    const grid=[...main.querySelectorAll('.x-grid3')].find(el=>el.getClientRects().length && getComputedStyle(el).display!=='none');
    if(!grid){
      for(const el of main.querySelectorAll('[data-dw-fit-width],[data-dw-fit-height],[data-dw-fitted]')){
        el.removeAttribute('data-dw-fit-width');el.removeAttribute('data-dw-fit-height');el.removeAttribute('data-dw-fitted');
      }
      return;
    }
    const mainRect=main.getBoundingClientRect();
    // Read native inline dimensions, not our previously fitted computed sizes.
    const nativeGridHeight=parseFloat(grid.style.height) || 500;
    let nativeMainHeight=0;
    const chain=[];
    for(let el=grid.parentElement;el && el!==main;el=el.parentElement){
      const height=parseFloat(el.style.height);
      chain.push({el,height});
      if(Number.isFinite(height))nativeMainHeight=Math.max(nativeMainHeight,height);
    }
    const overhead=Math.max(90,nativeMainHeight-nativeGridHeight);
    const height=availableGridHeight(main,grid,Math.max(100,mainRect.height-overhead-4));
    document.body.style.setProperty('--dw-grid-height',`${height}px`);
    for(const {el,height:h} of chain){
      el.setAttribute('data-dw-fit-width','');
      if(Number.isFinite(h) && h>=nativeGridHeight){
        el.style.setProperty('--dw-fit-extra',`${h-nativeGridHeight}px`);
        el.setAttribute('data-dw-fit-height','');
      }
    }
    grid.setAttribute('data-dw-fitted','');
    const gridHeader=grid.querySelector('.x-grid3-viewport>.x-grid3-header');
    grid.style.setProperty('--dw-grid-heading',`${gridHeader?.getBoundingClientRect().height || 24}px`);
  }
  const tableColumns = [
    {key:'id',label:'ID',width:96},
    {key:'description',label:'Description',width:380},
    {key:'incident_status',label:'Status',width:140},
    {key:'assigned_to',label:'Assigned to',width:235},
    {key:'rte_location',label:'Location',width:210},
    {key:'area_room',label:'Room',width:140},
    {key:'rte_building',label:'Building',width:130},
    {key:'requested_by',label:'Reported by',width:235},
    {key:'reporter_phone',label:'Business phone',width:170}
  ];
  const ticketFilters=[
    {key:'incident_status',label:'Status'},
    {key:'assigned_to',label:'Technician'},
    {key:'rte_location',label:'Location'},
    {key:'work_type',label:'Work type'},
    {key:'incident_priority',label:'Priority'},
    {key:'requested_by',label:'Reported by'}
  ];
  let shownColumns = tableColumns.map(column=>column.key);
  try {
    const saved=JSON.parse(localStorage.getItem('dw-ticket-columns') || 'null');
    if(Array.isArray(saved)) shownColumns=tableColumns.filter(c=>c.key==='id' || saved.includes(c.key)).map(c=>c.key);
  } catch {}
  const customTables=new Map();
  function readCustomRows(grid) {
    const header=[...grid.querySelectorAll('.x-grid3-hd-inner')].find(el=>norm(el.textContent)==='reported by business phone');
    const phoneField=(header && [...header.classList].find(c=>/^x-grid3-hd-.+\.cmn_user\.phone$/.test(c))?.replace(/^x-grid3-hd-/,'')) || 'j_6785.cmn_user.phone';
    return [...grid.querySelectorAll('.x-grid3-row')].map(row=>{
      const ticket={};
      for(const key of new Set([...tableColumns,...ticketFilters].map(column=>column.key))){
        const field=key==='reporter_phone'?phoneField:`base.inc_incident.${key}`;
        ticket[key]=row.querySelector(`[class~="x-grid3-col-${field}"]`)?.textContent?.trim() || '';
      }
      ticket.selected=row.classList.contains('x-grid3-row-selected') || row.getAttribute('aria-selected')==='true';
      return ticket;
    }).filter(ticket=>ticket.id);
  }
  function sourceRow(grid,id) {
    return [...grid.querySelectorAll('.x-grid3-row')].find(row=>row.querySelector('[class~="x-grid3-col-base.inc_incident.id"]')?.textContent.trim()===id);
  }
  function filterTicketRows(rows,query,filters={}) {
    const terms=norm(query).split(' ').filter(Boolean);
    return rows.filter(ticket=>{
      const text=norm([...new Set([...tableColumns,...ticketFilters].map(column=>column.key))].map(key=>ticket[key] || '').join(' '));
      if(!terms.every(term=>text.includes(term)))return false;
      return ticketFilters.every(({key})=>{
        const rule=filters[key];
        if(!rule?.value)return true;
        const value=norm(ticket[key]);
        const same=rule.value==='__dw_empty__'?!value:rule.value==='__dw_unassigned__'?['unassigned','none'].includes(value):value===norm(rule.value);
        return rule.operator==='not'?!same:same;
      });
    });
  }
  // Search uses the application's own pager; no private endpoints or copied credentials.
  function searchViewKey(record){
    const main=document.getElementById('Main');
    return (main?.querySelector('#Criteria')?.textContent || '')+'|'+(shell?.querySelector('.dw-breadcrumb')?.textContent || '');
  }
  function searchPage(record){
    const main=document.getElementById('Main');
    const bars=[...(main?.querySelectorAll('.page-toolbar') || [])].filter(layoutVisible);
    if(bars.length!==1)throw new Error('Cannot identify this view’s page toolbar.');
    const bar=bars[0], match=(bar.querySelector('.my-paging-display')?.textContent || '').replace(/,/g,'').match(/Displaying\s+(\d+)\s*[-–]\s*(\d+)\s+of\s+(\d+)/i);
    if(!match)throw new Error('Cannot read the ticket page count.');
    return {start:+match[1],end:+match[2],total:+match[3],first:bar.querySelector('.x-tool-page-first')?.closest('button'),next:bar.querySelector('.x-tool-page-next')?.closest('button')};
  }
  function assertSearchIdle(record){
    if(!record.grid.isConnected || !layoutVisible(record.grid) || document.getElementById('Main')?.hasAttribute('data-dw-detail'))throw new Error('The ticket view changed.');
    if(record.viewKey!==searchViewKey(record))throw new Error('The view’s filters changed. Search again.');
    const main=document.getElementById('Main');
    if(main.querySelector('.x-grid3-dirty-cell') || [...main.querySelectorAll('.x-panel-fbar button')].some(b=>norm(b.textContent)==='save' && !b.disabled && !b.closest('.x-item-disabled')))throw new Error('Save or reset your ticket edits before searching all pages.');
  }
  async function searchTurn(record,direction){
    assertSearchIdle(record);
    const before=searchPage(record);
    if(direction==='first' && before.start<=1)return;
    const button=before[direction];
    if(!button || button.disabled || button.getAttribute('aria-disabled')==='true' || button.closest('.x-item-disabled'))throw new Error('The page control is unavailable.');
    const ids=readCustomRows(record.grid).map(row=>row.id).join(',');
    activateOriginal(button);
    const deadline=Date.now()+20000;
    let fingerprint='',stable=0;
    while(Date.now()<deadline){
      await new Promise(resolve=>setTimeout(resolve,150));
      assertSearchIdle(record);
      const page=searchPage(record), rows=readCustomRows(record.grid);
      const moved=direction==='first'?page.start===1:page.start>before.start;
      const loading=[...document.getElementById('Main').querySelectorAll('.x-mask-loading,.ext-el-mask')].some(layoutVisible);
      if(!moved || loading || rows.map(row=>row.id).join(',')===ids){stable=0;continue;}
      const current=JSON.stringify(rows);
      if(!stable || current!==fingerprint){fingerprint=current;stable=Date.now();}
      if(Date.now()-stable>=700)return;
    }
    throw new Error('The ticket page took too long to load.');
  }
  async function searchGoTo(record,start){
    if(searchPage(record).start===start)return;
    await searchTurn(record,'first');
    while(searchPage(record).start<start)await searchTurn(record,'next');
    if(searchPage(record).start!==start)throw new Error('Page sizes changed. Refresh the search.');
  }
  async function collectSearchPages(adapter){
    const original=adapter.page().start, total=adapter.page().total, tickets=new Map(),visited=new Set();
    try{
      await adapter.turn('first');
      while(true){
        if(adapter.cancelled())throw new Error('Search stopped.');
        const page=adapter.page();
        if(page.total!==total || visited.has(page.start))throw new Error('The ticket list changed. Refresh the search.');
        visited.add(page.start);
        for(const row of adapter.rows())tickets.set(row.id,{...row,selected:false,pageStart:page.start});
        adapter.progress([...tickets.values()],total);
        if(page.end>=total)break;
        await adapter.turn('next');
      }
      if(tickets.size!==total)throw new Error('Some tickets could not be loaded. Refresh the search.');
      return [...tickets.values()];
    }finally{await adapter.restore(original);}
  }
  function queueTicketSearch(record){
    clearTimeout(record.searchTimer);
    if(!record.query.trim())return;
    record.searchTimer=setTimeout(()=>loadTicketSearch(record),450);
  }
  async function loadTicketSearch(record,refresh=false){
    if(record.searchBusy || (!refresh && record.index && record.indexKey===searchViewKey(record)))return;
    if(window.__dinubaTicketPrintBusy || window.__dinubaAssignmentBusy){record.searchNotice='Finish printing or assigning tickets, then click Refresh search.';record.signature='';paintCustomTable(record);return;}
    record.searchBusy=true;record.cancelSearch=false;record.index=null;record.searchRows=[];record.viewKey=searchViewKey(record);
    window.__dinubaTicketPrintBusy=true;
    record.searchNotice='Searching all pages…';record.signature='';paintCustomTable(record);
    try{
      assertSearchIdle(record);
      record.index=await collectSearchPages({page:()=>searchPage(record),rows:()=>readCustomRows(record.grid),turn:direction=>searchTurn(record,direction),cancelled:()=>record.cancelSearch || !record.host.isConnected,
        restore:start=>searchGoTo(record,start),progress:(rows,total)=>{record.searchRows=rows;record.searchNotice=`Searching all pages · ${rows.length} of ${total} loaded…`;record.signature='';paintCustomTable(record);}});
      record.indexKey=record.viewKey;record.searchNotice='';
    }catch(error){record.index=null;record.searchRows=[];record.searchNotice=error.message+' Click Refresh search to try again.';}
    finally{record.searchBusy=false;window.__dinubaTicketPrintBusy=false;record.signature='';if(record.host.isConnected)paintCustomTable(record);}
  }
  async function openSearchTicket(record,id){
    if(record.searchBusy){alert('Wait for the all-pages search to finish.');return;}
    const ticket=record.index?.find(row=>row.id===id);
    if(ticket && !sourceRow(record.grid,id)){
      if(window.__dinubaTicketPrintBusy || window.__dinubaAssignmentBusy){alert('Finish printing or assigning tickets first.');return;}
      window.__dinubaTicketPrintBusy=true;record.searchBusy=true;
      try{record.viewKey=record.indexKey;await searchGoTo(record,ticket.pageStart);}
      catch(error){alert(error.message);return;}
      finally{record.searchBusy=false;window.__dinubaTicketPrintBusy=false;}
    }
    const row=sourceRow(record.grid,id), edit=row?.querySelector('.icon-edit') || row?.querySelector('[class~="x-grid3-col-editor"] a');
    if(edit)activateOriginal(edit);else alert('This ticket moved or left the view. Refresh the search.');
  }
  function syncTicketFilters(record,rows){
    const {host}=record;
    record.filters ||= {};
    for(const config of ticketFilters){
      const select=host.querySelector(`[data-filter-value="${config.key}"]`);
      const rule=record.filters[config.key] || {value:'',operator:'is'};
      const values=[...new Set(rows.map(row=>row[config.key]).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
      const options=[{value:'',label:'Any value'}];
      if(config.key==='assigned_to')options.push({value:'__dw_unassigned__',label:'Unassigned'});
      options.push(...values.filter(value=>config.key!=='assigned_to' || !['unassigned','none'].includes(norm(value))).map(value=>({value,label:value})));
      if(rows.some(row=>!norm(row[config.key])))options.push({value:'__dw_empty__',label:'No value'});
      if(rule.value && !options.some(option=>option.value===rule.value))options.push({value:rule.value,label:rule.value==='__dw_empty__'?'No value':rule.value==='__dw_unassigned__'?'Unassigned':rule.value});
      const html=options.map(option=>`<option value="${safe(option.value)}">${safe(option.label)}</option>`).join('');
      if(select.dataset.options!==html){select.innerHTML=html;select.dataset.options=html;}
      select.value=rule.value;
      host.querySelector(`[data-filter-operator="${config.key}"]`).value=rule.operator;
    }
    const active=ticketFilters.filter(({key})=>record.filters[key]?.value);
    const chips=active.map(config=>{
      const rule=record.filters[config.key];
      const value=rule.value==='__dw_empty__'?'No value':rule.value==='__dw_unassigned__'?'Unassigned':rule.value;
      return `<button type="button" data-remove-filter="${config.key}" aria-label="Remove ${safe(config.label)} filter">${safe(config.label)} ${rule.operator==='not'?'is not':'is'} ${safe(value)}<span aria-hidden="true">×</span></button>`;
    });
    if(record.query)chips.unshift(`<button type="button" data-clear-search aria-label="Clear ticket search">Search: ${safe(record.query)}<span aria-hidden="true">×</span></button>`);
    const area=host.querySelector('.dw-active-filters');
    const html=chips.join('');if(area.innerHTML!==html)area.innerHTML=html;
    area.hidden=!chips.length;
    const badge=host.querySelector('.dw-filter-badge');badge.textContent=String(active.length);badge.hidden=!active.length;
  }
  function customTableHTML(rows,columns,grid,emptyMessage='No tickets on this page.',currentIds=null) {
    const headings=columns.map(column=>{
      const native=grid?.querySelector(`[class~="x-grid3-hd-base.inc_incident.${column.key}"]`);
      const sort=native?.getAttribute('aria-sort');
      const icon=sort==='ascending'?'↑':sort==='descending'?'↓':'↕';
      const label=native?`<button type="button" class="dw-sort" data-sort="${column.key}" aria-label="Sort by ${safe(column.label)}">${safe(column.label)}<span class="dw-sort-indicator" aria-hidden="true">${icon}</span></button>`:safe(column.label);
      return `<th scope="col" ${column.key==='id'?'class="dw-id-col"':''} ${sort && sort!=='none'?`aria-sort="${safe(sort)}"`:''}>${label}</th>`;
    }).join('');
    const body=rows.map(ticket=>`<tr data-selected="${ticket.selected}">${columns.map(column=>{
      const value=ticket[column.key] || '';
      if(column.key==='id')return `<td class="dw-id-col"><button type="button" class="dw-id-button" data-open-ticket="${safe(value)}" aria-label="Open ticket ${safe(value)}">${safe(value)}</button></td>`;
      if(column.key==='description')return `<td><div class="dw-summary" title="${safe(value)}">${safe(value)}</div></td>`;
      if(column.key==='incident_status')return `<td><span class="dw-status-chip" data-state="${statusFor(value)}">${safe(value)}</span></td>`;
      return `<td><span class="dw-cell-muted">${safe(value)}</span></td>`;
    }).join('')}<td><input type="checkbox" data-select-ticket="${safe(ticket.id)}" aria-label="Select ticket ${safe(ticket.id)}" ${ticket.selected?'checked':''} ${currentIds && !currentIds.has(ticket.id)?'disabled title="Open this ticket to select it on its page"':''}></td></tr>`).join('');
    const width=columns.reduce((sum,c)=>sum+c.width,0)+74;
    return `<table class="dw-ticket-table" style="min-width:${width}px" aria-label="Tickets"><colgroup>${columns.map(c=>`<col style="width:${c.width}px">`).join('')}<col style="width:74px"></colgroup><thead><tr>${headings}<th scope="col"><input type="checkbox" data-select-all aria-label="Select matching tickets on the loaded page"></th></tr></thead><tbody>${body || `<tr><td colspan="${columns.length+1}" class="dw-empty-row">${safe(emptyMessage)}</td></tr>`}</tbody></table>`;
  }
  function paintCustomTable(record) {
    const {grid,host}=record;
    const currentRows=readCustomRows(grid);
    if(record.index && record.indexKey!==searchViewKey(record)){record.index=null;record.searchNotice='';queueTicketSearch(record);}
    const indexed=!!record.query.trim() && !!record.index;
    const allRows=indexed?record.index.map(row=>({...row,selected:currentRows.find(item=>item.id===row.id)?.selected || false})):record.searchBusy && record.query.trim()?record.searchRows:currentRows;
    let rows=filterTicketRows(allRows,record.query || '',record.filters || {});
    if(record.localSort){const {key,direction}=record.localSort;rows.sort((a,b)=>direction*String(a[key] || '').localeCompare(String(b[key] || ''),undefined,{numeric:true}));}
    const columns=tableColumns.filter(c=>shownColumns.includes(c.key));
    const sorts=[...grid.querySelectorAll('.x-grid3-hd-inner')].map(el=>el.getAttribute('aria-sort'));
    const signature=JSON.stringify([allRows,shownColumns,sorts,record.query || '',record.filters || {},record.searchNotice,record.searchBusy,record.localSort]);
    if(signature===record.signature)return;
    record.signature=signature;
    syncTicketFilters(record,allRows);
    const scroller=host.querySelector('.dw-table-scroller');
    const x=scroller.scrollLeft,y=scroller.scrollTop;
    const focused=document.activeElement;
    const focusId=host.contains(focused)?focused.getAttribute('data-open-ticket') || focused.getAttribute('data-select-ticket'):null;
    const filtered=!!record.query || Object.values(record.filters || {}).some(rule=>rule?.value);
    scroller.innerHTML=customTableHTML(rows,columns,grid,record.searchBusy?'Searching remaining pages…':filtered?'No tickets match these filters.':'No tickets on this page.',new Set(currentRows.map(row=>row.id)));
    const selectable=rows.filter(row=>currentRows.some(item=>item.id===row.id));
    const selectAll=host.querySelector('[data-select-all]');
    selectAll.checked=selectable.length>0 && selectable.every(row=>row.selected);
    selectAll.indeterminate=selectable.some(row=>row.selected) && !selectAll.checked;
    selectAll.disabled=!selectable.length || record.searchBusy;
    scroller.scrollLeft=x;scroller.scrollTop=y;
    host.querySelector('[data-refresh-search]').disabled=!!record.searchBusy;
    const stop=host.querySelector('[data-stop-search]');stop.hidden=!record.searchBusy;
    host.querySelector('.dw-table-count').textContent=record.searchNotice || (indexed?`${rows.length} of ${allRows.length} tickets · All pages`:filtered?`${rows.length} of ${allRows.length} tickets · Current page`:`${allRows.length} ticket${allRows.length===1?'':'s'} on this page`);
    if(focusId){
      const target=[...host.querySelectorAll('[data-open-ticket],[data-select-ticket]')].find(el=>el.getAttribute('data-open-ticket')===focusId || el.getAttribute('data-select-ticket')===focusId);
      target?.focus({preventScroll:true});
    }
    for(const option of host.querySelectorAll('[data-column]'))option.checked=shownColumns.includes(option.dataset.column);
  }
  function syncCustomTables() {
    const main=document.getElementById('Main');
    const eligible=new Set();
    if(main && !main.hasAttribute('data-dw-detail')) {
      for(const grid of main.querySelectorAll('.x-grid3')) {
        if(!grid.getClientRects().length || !grid.querySelector('[class~="x-grid3-hd-base.inc_incident.id"]'))continue;
        eligible.add(grid);
        if(!customTables.has(grid)) {
          const host=document.createElement('section');host.className='dw-custom-grid';host.setAttribute('aria-label','Ticket workspace');
          host.innerHTML=`<div class="dw-table-bar"><div class="dw-ticket-search">${shellIcon('search')}<input type="search" data-ticket-search aria-label="Search tickets across all pages" placeholder="Search ticket ID, description, location…" title="Searches all pages of this view, including full descriptions and hidden columns"></div><button type="button" data-refresh-search title="Reload all pages for this search">Refresh search</button><button type="button" data-stop-search hidden>Stop search</button><span class="dw-table-count" role="status" aria-live="polite"></span><details class="dw-columns"><summary>Columns</summary><div class="dw-column-options">${tableColumns.map(c=>`<label><input type="checkbox" data-column="${c.key}" ${shownColumns.includes(c.key)?'checked':''} ${c.key==='id'?'disabled':''}>${safe(c.label)}</label>`).join('')}</div></details></div><div class="dw-table-scroller"></div>`;
          const toggle=document.createElement('button');
          toggle.type='button';toggle.className='dw-filter-toggle';toggle.setAttribute('data-toggle-ticket-filters','');
          toggle.setAttribute('aria-expanded','false');
          toggle.innerHTML='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h18l-7 8v7l-4 2v-9L3 4Z"/></svg>Filters <span class="dw-filter-badge" hidden></span>';
          host.querySelector('.dw-table-count').before(toggle);
          const filterPanel=document.createElement('div');filterPanel.className='dw-filter-panel';filterPanel.hidden=true;
          filterPanel.id=`dw-ticket-filters-${customTables.size}`;
          toggle.setAttribute('aria-controls',filterPanel.id);
          filterPanel.innerHTML=`<div class="dw-filter-heading"><div><strong>Refine tickets</strong><span class="dw-filter-help">With a search, these filters refine results across all pages. Without a search, they refine the loaded page. Use all-page filters to change the underlying view.</span></div><div class="dw-filter-actions"><button type="button" data-native-ticket-filters>All-page filters</button><button type="button" data-clear-ticket-filters>Clear all</button></div></div><div class="dw-filter-rules">${ticketFilters.map(config=>`<label class="dw-filter-rule"><span>${safe(config.label)}</span><span class="dw-rule-controls"><select data-filter-operator="${config.key}" aria-label="${safe(config.label)} comparison"><option value="is">is</option><option value="not">is not</option></select><select data-filter-value="${config.key}" aria-label="Filter ${safe(config.label)}"><option value="">Any value</option></select></span></label>`).join('')}</div>`;
          const chips=document.createElement('div');chips.className='dw-active-filters';chips.hidden=true;
          host.querySelector('.dw-table-scroller').before(filterPanel,chips);
          const record={grid,host,signature:'',query:'',filters:{},searchRows:[],oldAria:grid.getAttribute('aria-hidden')};
          grid.parentElement.append(host);
          customTables.set(grid,record);
          const search=host.querySelector('[data-ticket-search]');
          search.addEventListener('input',()=>{
            record.query=search.value;record.signature='';if(!record.query.trim())record.cancelSearch=true;queueTicketSearch(record);
            host.querySelector('.dw-table-scroller').scrollTop=0;
            paintCustomTable(record);
          });
          search.addEventListener('keydown',event=>{
            if(event.key==='Escape'){
              search.value='';record.query='';record.cancelSearch=true;clearTimeout(record.searchTimer);record.signature='';paintCustomTable(record);
              event.preventDefault();
            }
          });
          host.addEventListener('click',event=>{
            if(event.target.closest('[data-refresh-search]')){loadTicketSearch(record,true);return;}
            if(event.target.closest('[data-stop-search]')){record.cancelSearch=true;return;}
            if(event.target.closest('[data-toggle-ticket-filters]')){
              filterPanel.hidden=!filterPanel.hidden;toggle.setAttribute('aria-expanded',String(!filterPanel.hidden));return;
            }
            if(event.target.closest('[data-clear-ticket-filters]')){
              record.filters={};record.query='';record.cancelSearch=true;clearTimeout(record.searchTimer);search.value='';record.signature='';paintCustomTable(record);return;
            }
            const remove=event.target.closest('[data-remove-filter]');
            if(remove){delete record.filters[remove.dataset.removeFilter];record.signature='';paintCustomTable(record);return;}
            if(event.target.closest('[data-clear-search]')){
              record.query='';record.cancelSearch=true;clearTimeout(record.searchTimer);search.value='';record.signature='';paintCustomTable(record);return;
            }
            if(event.target.closest('[data-native-ticket-filters]')){
              const main=grid.closest('[id="Main"]');
              const panel=main?.querySelector('.filter-panel');
              const control=main?.querySelector('#Criteria .x-tool-plus') || [...(main?.querySelectorAll('#Criteria .link') || [])].find(el=>norm(el.textContent)==='filter');
              if(control){
                filterPanel.hidden=true;toggle.setAttribute('aria-expanded','false');
                if(!panel || panel.classList.contains('x-panel-collapsed'))activateOriginal(control);
                else panel.scrollIntoView({block:'nearest'});
              }else alert('The native all-page filter control is not available in this view.');
              return;
            }
            const open=event.target.closest('[data-open-ticket]');
            if(open){
              openSearchTicket(record,open.dataset.openTicket);
              return;
            }
            const sort=event.target.closest('[data-sort]');
            if(sort && (record.index || record.searchBusy)){const key=sort.dataset.sort;record.localSort={key,direction:record.localSort?.key===key?-record.localSort.direction:1};record.signature='';paintCustomTable(record);return;}
            if(sort){const header=grid.querySelector(`[class~="x-grid3-hd-base.inc_incident.${sort.dataset.sort}"]`);if(header)activateOriginal(header.querySelector('span') || header);}
          });
          host.addEventListener('change',event=>{
            const filterValue=event.target.closest('[data-filter-value]');
            const filterOperator=event.target.closest('[data-filter-operator]');
            if(filterValue || filterOperator){
              const key=filterValue?.dataset.filterValue || filterOperator.dataset.filterOperator;
              record.filters[key]={value:host.querySelector(`[data-filter-value="${key}"]`).value,operator:host.querySelector(`[data-filter-operator="${key}"]`).value};
              record.signature='';host.querySelector('.dw-table-scroller').scrollTop=0;paintCustomTable(record);return;
            }
            if(record.searchBusy && event.target.matches('[data-select-all],[data-select-ticket]')){paintCustomTable(record);return;}
            if(event.target.matches('[data-select-all]')){
              const wanted=event.target.checked;
              for(const ticket of filterTicketRows(readCustomRows(grid),record.query,record.filters)){
                const row=sourceRow(grid,ticket.id);
                if(row && row.classList.contains('x-grid3-row-selected')!==wanted)activateOriginal(row.querySelector('.x-grid3-row-checker') || row);
              }
              record.signature='';setTimeout(()=>paintCustomTable(record),100);
              return;
            }
            const select=event.target.closest('[data-select-ticket]');
            if(select){
              const row=sourceRow(grid,select.dataset.selectTicket);
              const checked=!!row?.classList.contains('x-grid3-row-selected');
              if(row && checked!==select.checked)activateOriginal(row.querySelector('.x-grid3-row-checker') || row);
              record.signature='';setTimeout(()=>paintCustomTable(record),100);
              return;
            }
            const option=event.target.closest('[data-column]');
            if(option){
              const selected=[...host.querySelectorAll('[data-column]')].filter(el=>el.checked).map(el=>el.dataset.column);
              shownColumns=tableColumns.filter(c=>c.key==='id' || selected.includes(c.key)).map(c=>c.key);
              try{localStorage.setItem('dw-ticket-columns',JSON.stringify(shownColumns));}catch{}
              for(const item of customTables.values()){item.signature='';paintCustomTable(item);}
            }
          });
        }
        grid.setAttribute('data-dw-table-source','');
        if(grid.contains(document.activeElement))grid.removeAttribute('aria-hidden');
        else grid.setAttribute('aria-hidden','true');
        paintCustomTable(customTables.get(grid));
      }
    }
    for(const [grid,record] of customTables){
      if(eligible.has(grid))continue;
      record.cancelSearch=true;clearTimeout(record.searchTimer);record.host.remove();grid.removeAttribute('data-dw-table-source');
      if(record.oldAria===null)grid.removeAttribute('aria-hidden');else grid.setAttribute('aria-hidden',record.oldAria);
      customTables.delete(grid);
    }
  }
  function decorate() {
    for (const toolbar of document.querySelectorAll('.x-panel-fbar .x-toolbar-left-row')) {
      toolbar.setAttribute('data-dw-footer', '');
    }
    for (const button of document.querySelectorAll('.x-btn button')) {
      const frame = button.closest('table.x-btn');
      if (!frame || button.closest('.sl-head')) continue;
      const text = norm(button.textContent);
      const primary = ['new','save','assign tickets'].includes(text);
      const secondary = ['print tickets','print ticket','add chromebooks','export'].includes(text);
      const danger = ['delete','remove','delete ticket'].includes(text);
      if (primary) frame.setAttribute('data-dw-action', 'primary');
      else if (secondary) frame.setAttribute('data-dw-action', 'secondary');
      else if (danger) frame.setAttribute('data-dw-action', 'danger');
      else frame.removeAttribute('data-dw-action');
    }
    for (const el of document.querySelectorAll('.x-tool,.icon-edit,.icon-funnel_2')) {
      let name = el.classList.contains('icon-edit') ? 'edit' :
        el.classList.contains('icon-funnel_2') ? 'filter' : '';
      if (!name) name = [...el.classList].find(c => c.startsWith('x-tool-') && icons[c.slice(7)])?.slice(7) || '';
      if (name) el.setAttribute('data-dw-icon', name);
    }
    for (const el of document.querySelectorAll('.navigation-panel .x-view-item>span>span')) {
      if (el.textContent.trim() === 'Work Queues' && !el.hasAttribute('qtip')) el.setAttribute('data-dw-nav-section','');
    }
    for (const cell of document.querySelectorAll(
      '[class~="x-grid3-col-base.inc_incident.incident_status"],'+
      '[class~="x-grid3-col-base.inc_incident.assigned_to"]')) {
      const status = statusFor(cell.textContent);
      if (status) cell.setAttribute('data-dw-status', status);
      else cell.removeAttribute('data-dw-status');
    }
    syncShell();
    syncCustomTables();
  }
  let pending = false;
  new MutationObserver(() => {
    if (pending) return;
    pending = true;
    setTimeout(() => {pending = false; decorate();}, 150);
  }).observe(document.body, {childList:true, subtree:true, characterData:true,attributes:true,attributeFilter:['class']});
  window.addEventListener('resize',()=>{const main=document.getElementById('Main');if(main && shell)fitWorkspace(main);});
  decorate();
})();
