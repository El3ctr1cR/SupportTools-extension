// Autotask Tabs - local flags
(function () {
    'use strict';

    const root = typeof globalThis !== 'undefined' ? globalThis : window;
    root.__AUTOTASKTABS_LOCAL_FLAGS__ = Object.assign({}, root.__AUTOTASKTABS_LOCAL_FLAGS__ || {}, {
        umbrellaContractFrameExperiment: true,
    });
})();


// Autotask Tabs - route registry
(function () {
    'use strict';

    const root = typeof globalThis !== 'undefined' ? globalThis : window;

    if (root.__AUTOTASKTABS_ROUTE_REGISTRY__) {
        return;
    }

    // AUTOTASKTABS route compatibility registry.
    //
    // This is the single source of truth for routes that AUTOTASKTABS may intercept and
    // render inside its own tab/Peek system. Keep behavioral metadata and icon
    // extraction in the shell/iframe modules, but put route eligibility here so
    // the page bridge, shared helpers, and background script cannot drift.
    const HANDLED_PATHS = [
        '/mvc/servicedesk/ticketdetail.mvc',
        '/mvc/servicedesk/ticketdetail.mvc/ticketbyticketnumber',
        '/mvc/servicedesk/ticketedit.mvc',
        '/mvc/servicedesk/ticketnew.mvc',
        '/mvc/servicedesk/ticketnew.mvc/create',
        '/mvc/servicedesk/timeentry.mvc/timeentrypopoutfromdialog',
        '/mvc/servicedesk/note.mvc/notepopoutfromdialog',
        '/mvc/servicedesk/timeentry.mvc/newtickettimeentrypage',
        '/mvc/servicedesk/timeentry.mvc/edittickettimeentrypage',
        '/mvc/servicedesk/note.mvc/newticketnotepage',
        '/autotask/popups/techscheduling/service_call.aspx',
        '/mvc/knowledgebase/articlenew.mvc/article',
        '/mvc/projects/projectnote.mvc/newprojectnote',
        '/projects/calendar/prjcalendar.asp',
        '/mvc/file/attachment.mvc/projectattachment',
        '/mvc/projects/teammember.mvc/add',
        '/autotask/views/projects/project_cost.aspx',
        '/mvc/timesheets/expense.mvc/createnewprojectexpense',
        '/projects/wizards/transformations/copyattributes/popwiz_frames.asp',
        '/mvc/crm/accountnew.mvc',
        '/mvc/crm/accountdetail.mvc',
        '/mvc/crm/contactdetail.mvc',
        '/mvc/crm/contactnewpage.mvc/create',
        '/mvc/crm/editcrmnote.mvc/createforaccount',
        '/mvc/crm/installedproductdetail.mvc',
        '/mvc/crm/note.mvc/view',
        '/mvc/crm/opportunitydetail.mvc',
        '/mvc/crm/wonopportunitywizard.mvc/wonopportunitywizard',
        '/mvc/administrationsetup/resourcedetail.mvc',
        '/mvc/administration/resourcedetail.mvc',
        '/mvc/administrationsetup/resource.mvc/resourcedetail',
        '/mvc/administrationsetup/persondetail.mvc',
        '/autotask35/grapevine/profile.aspx',
        '/opportunity/contacts/contact.asp',
        '/opportunity/wizards/lostopp/popwiz_frames.asp',
        '/opportunity/wizards/cancelacc/popwiz_frames.asp',
        '/autotask35/crm/salesorder/salesorderdetail.aspx',
        '/opportunity/quotes/quote.asp',
        '/opportunity/quotes/newquote.asp',
        '/mvc/crm/quotetemplate.mvc/editproperties',
        '/autotask/popups/tickets/recurring_ticket.aspx',
        '/autotask/autotaskextend/livelinks/livelinkeditor.aspx',
        '/autotask/autotaskextend/directory_view.aspx',
        '/autotask/views/crm/contact_group_management.aspx',
        '/autotask35/crm/contactgroupmanager.aspx',
        '/home/timeentry/wrkentryframes.asp',
        '/reports/time_and_attendance/report/rptallmisstime.asp',
        '/timesheets/views/readonly/tmsreadonly_100.asp',
        '/autotask/views/servicedesk/servicedeskticket/service_ticket_panel_edit.aspx',
        '/mvc/crm/contractbillingruleassociation.mvc/editcontact',
        '/mvc/projects/projectdetail.mvc/projectdetail',
        '/mvc/projects/taskdetail.mvc',
        '/mvc/contracts/newcontractwizard.mvc/newcontractwizard',
        '/contracts/views/contractview.asp',
        '/contracts/views/contractsummary.asp',
        '/autotask35/dataselectorhandlers/ticketdataselectorpopup.aspx',
        '/mvc/projects/importticket.mvc/copytickettoproject',
        '/servicedesk/popups/forward/svcforward.asp',
        '/servicedesk/reports/togoreportframe.asp',
        '/mvc/servicedesk/tickethistory.mvc/servicetickethistory',
        '/popups/work/svcdetail.asp',
        '/autotask/views/dispatcherworkshop/dispatcherworkshopcontainer.aspx',
        '/autotask/views/administration/companysetup/neweditallocationcode.aspx',
        '/autotask/views/administration/companysetup/location_new_edit.aspx',
        '/autotask/popups/administration/departmentdetails.aspx',
        '/autotask/popups/administration/workflow_rule.aspx',
        '/autotask/views/administration/resources/resource.aspx',
        '/mvc/administrationsetup/apiuser.mvc/newapiuser',
        '/mvc/administrationsetup/apiuser.mvc/editapiuser',
        '/administrator/roles/tabroleview.asp',
        '/mvc/administrationsetup/formtemplates.mvc/newformtemplatepage',
        '/mvc/administrationsetup/invoicetemplate.mvc/editinvoicetemplate',
        '/mvc/administrationsetup/invoicetemplate.mvc/editproperties',
        '/mvc/contracts/invoiceemailtemplate.mvc/editinvoiceemailtemplate',
        '/mvc/contracts/invoiceviewer.mvc',
        '/mvc/contracts/invoiceviewer.mvc/invoicebatchviewer',
        '/mvc/contracts/invoiceviewer.mvc/invoicepreviewviewer',
        '/autotask/views/template/customizenotificationtemplate.aspx',
        '/autotask/views/administration/products/product.aspx',
        '/mvc/inventory/inventoryproduct.mvc/create',
        '/mvc/inventory/inventoryproduct.mvc/edit',
        '/autotask/inventory/inventory_edit_order.aspx',
        '/mvc/inventory/receipthistory.mvc',
        '/mvc/inventory/emailpurchaseorder.mvc/emailpurchaseorder',
        '/mvc/security/authorization.mvc/failure'
    ];

    // Native home surfaces are allowed to load, but AUTOTASKTABS should not intercept
    // their navigation into its own tab model.
    const NATIVE_HOME_PATHS = [
        '/mvc/user/preferences.mvc/index',
        '/mvc/contracts/billingproductmapping.mvc/installedproductmapping',
        '/mvc/contracts/billingproductmapping.mvc/contactmapping',
        '/mvc/inventory/costitem.mvc/shipping'
    ];

    const HANDLED_PATH_INCLUDES = [
        '/ticketprintview.mvc',
        '/picklistdetailforshippinggrid',
        '/packinglistdetailforshippinggrid',
        '/inventory/inventory_edit_order.aspx',
        '/projects/reports/',
        '/billingproduct',
        '/billingproducts',
        '/billing_product',
        '/billing_products',
        '/billingrule',
        '/billingrules',
        '/billing_rule',
        '/billing_rules',
        '/billingassociation',
        '/billingassociations',
        '/billingproductassociation',
        '/billingruleassociation'
    ];

    // Pages where AUTOTASKTABS must stay completely hands-off after navigation.
    const EXCLUDED_PATHS = [
        '/mvc/servicedesk/ticketprintview.mvc',
        '/mvc/framework/authentication.mvc/authenticate'
    ];

    const EXCLUDED_PATH_INCLUDES = [
        '/help/content/',
        '/ticketprintview.mvc',
        '/picklistdetailforshippinggrid',
        '/packinglistdetailforshippinggrid'
    ];

    const DYNAMIC_PATH_FRAGMENTS = [
        '/contactdetail',
        '/resourcedetail',
        '/persondetail'
    ];

    const DYNAMIC_EXACT_PATHS = [
        '/autotask35/grapevine/profile.aspx'
    ];

    function unique(values) {
        const seen = new Set();
        const result = [];

        values.forEach((value) => {
            const normalized = normalizePath(value);
            if (!normalized || seen.has(normalized)) {
                return;
            }
            seen.add(normalized);
            result.push(normalized);
        });

        return result;
    }

    function normalizePath(pathname) {
        return String(pathname || '').toLowerCase().replace(/\/index$/, '');
    }

    function includesAny(pathname, fragments) {
        return fragments.some((fragment) => pathname.includes(fragment));
    }

    const routes = {
        HANDLED_PATHS: unique(HANDLED_PATHS),
        NATIVE_HOME_PATHS: unique(NATIVE_HOME_PATHS),
        HANDLED_PATH_INCLUDES: unique(HANDLED_PATH_INCLUDES),
        EXCLUDED_PATHS: unique(EXCLUDED_PATHS),
        EXCLUDED_PATH_INCLUDES: unique(EXCLUDED_PATH_INCLUDES),
        DYNAMIC_PATH_FRAGMENTS: unique(DYNAMIC_PATH_FRAGMENTS),
        DYNAMIC_EXACT_PATHS: unique(DYNAMIC_EXACT_PATHS),
        normalizePath,
        includesAny,
        isNativeHomePath(pathname) {
            const path = normalizePath(pathname);
            return routes.NATIVE_HOME_PATHS.includes(path);
        },
        isExcludedPath(pathname) {
            const path = normalizePath(pathname);
            return routes.EXCLUDED_PATHS.includes(path) || includesAny(path, routes.EXCLUDED_PATH_INCLUDES);
        },
        isHandledPath(pathname) {
            const path = normalizePath(pathname);

            if (!path || routes.isNativeHomePath(path)) {
                return false;
            }

            return routes.HANDLED_PATHS.includes(path)
                || includesAny(path, routes.HANDLED_PATH_INCLUDES)
                || routes.DYNAMIC_EXACT_PATHS.includes(path)
                || includesAny(path, routes.DYNAMIC_PATH_FRAGMENTS);
        }
    };

    root.__AUTOTASKTABS_ROUTE_REGISTRY__ = routes;
})();


// Autotask Tabs - shared helpers
(function () {
    'use strict';

    const AUTOTASKTABS = window.__AUTOTASKTABS__ = window.__AUTOTASKTABS__ || {};
    if (AUTOTASKTABS.sharedInitialized) return;
    AUTOTASKTABS.sharedInitialized = true;

    AUTOTASKTABS.version = '0.6.0';
    AUTOTASKTABS.isTop = window.top === window.self;
    AUTOTASKTABS.MSG_NS = 'autotask-tabs-v1';
    const ROUTES = globalThis.__AUTOTASKTABS_ROUTE_REGISTRY__ || {};

    AUTOTASKTABS.ROUTES = ROUTES;
    AUTOTASKTABS.HANDLED_PATHS = ROUTES.HANDLED_PATHS || [];
    AUTOTASKTABS.NATIVE_HOME_PATHS = ROUTES.NATIVE_HOME_PATHS || [];
    AUTOTASKTABS.HANDLED_PATH_INCLUDES = ROUTES.HANDLED_PATH_INCLUDES || [];
    AUTOTASKTABS.EXCLUDED_PATHS = ROUTES.EXCLUDED_PATHS || [];
    AUTOTASKTABS.EXCLUDED_PATH_INCLUDES = ROUTES.EXCLUDED_PATH_INCLUDES || [];
    AUTOTASKTABS.BAR_H = 65;
    AUTOTASKTABS.BAR_W = 240;
    AUTOTASKTABS.BAR_W_MIN = 56;
    AUTOTASKTABS.BAR_W_MAX = 420;
    AUTOTASKTABS.BAR_W_COMPACT = 96;
    AUTOTASKTABS.STORAGE_KEY = 'autotask-tabs-v1';
    AUTOTASKTABS.SETTINGS_STORAGE_KEY = 'autotask-tabs-settings-v1';

    AUTOTASKTABS.isRegionalAutotaskHost = function isRegionalAutotaskHost(hostname) {
        return /^ww\d+\.autotask\.net$/i.test(String(hostname || ''));
    };

    AUTOTASKTABS.isAllowedHost = function isAllowedHost(url) {
        try {
            const parsed = new URL(url || location.href, location.origin);
            return AUTOTASKTABS.isRegionalAutotaskHost(parsed.hostname);
        } catch (e) {
            return AUTOTASKTABS.isRegionalAutotaskHost(location.hostname);
        }
    };

    AUTOTASKTABS.featuresEnabled = function featuresEnabled() {
        return AUTOTASKTABS.state && AUTOTASKTABS.state.extensionEnabled !== false;
    };

    AUTOTASKTABS.pathOf = function pathOf(url) {
        try { return new URL(url, location.origin).pathname.toLowerCase(); }
        catch (e) { return ''; }
    };

    AUTOTASKTABS.normalizeHandledPath = function normalizeHandledPath(pathname) {
        if (ROUTES.normalizePath) {
            return ROUTES.normalizePath(pathname);
        }
        return String(pathname || '').toLowerCase().replace(/\/index$/, '');
    };

    AUTOTASKTABS.extractInnerUrlFromLandingPageUrl = function extractInnerUrlFromLandingPageUrl(url) {
        try {
            const landingUrl = new URL(url, location.origin);
            if (landingUrl.pathname.toLowerCase() !== '/autotaskonyx/landingpage') return null;

            const rawViewData = landingUrl.searchParams.get('view-data');
            if (!rawViewData) return null;

            const json = atob(rawViewData);
            const parsed = JSON.parse(json);
            const innerUrl = parsed && typeof parsed.url === 'string' ? parsed.url : '';
            return innerUrl ? AUTOTASKTABS.toAbsoluteUrl(innerUrl) : null;
        } catch (e) {
            return null;
        }
    };

    AUTOTASKTABS.isNativeOnyxUrl = function isNativeOnyxUrl(url) {
        try {
            const onyxUrl = new URL(url, location.origin);
            const path = onyxUrl.pathname.toLowerCase();
            if (path !== '/autotaskonyx' && !path.startsWith('/autotaskonyx/')) return false;
            if (path === '/autotaskonyx/landingpage' && AUTOTASKTABS.extractInnerUrlFromLandingPageUrl(url)) {
                return false;
            }
            return true;
        } catch (e) {
            return false;
        }
    };

    AUTOTASKTABS.isExcludedUrl = function isExcludedUrl(url) {
        const path = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(url));
        if (ROUTES.isExcludedPath && ROUTES.isExcludedPath(path)) return true;
        if (!ROUTES.isExcludedPath) {
            if (AUTOTASKTABS.EXCLUDED_PATHS.includes(path)) return true;
            if (AUTOTASKTABS.EXCLUDED_PATH_INCLUDES.some(fragment => path.includes(fragment))) return true;
        }

        const innerUrl = AUTOTASKTABS.extractInnerUrlFromLandingPageUrl(url);
        return !!innerUrl && AUTOTASKTABS.isExcludedUrl(innerUrl);
    };

    AUTOTASKTABS.isNativeHomeUrl = function isNativeHomeUrl(url) {
        if (AUTOTASKTABS.isNativeOnyxUrl(url)) return true;

        const path = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(url));
        if (ROUTES.isNativeHomePath && ROUTES.isNativeHomePath(path)) return true;
        if (!ROUTES.isNativeHomePath && AUTOTASKTABS.NATIVE_HOME_PATHS.includes(path)) return true;

        const innerUrl = AUTOTASKTABS.extractInnerUrlFromLandingPageUrl(url);
        return !!innerUrl && AUTOTASKTABS.isNativeHomeUrl(innerUrl);
    };

    AUTOTASKTABS.isDialogPopOutFromDialogUrl = function isDialogPopOutFromDialogUrl(url) {
        const path = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(url));
        return path === '/mvc/servicedesk/timeentry.mvc/timeentrypopoutfromdialog' ||
            path === '/mvc/servicedesk/note.mvc/notepopoutfromdialog';
    };

    AUTOTASKTABS.isHandledUrl = function isHandledUrl(url) {
        if (AUTOTASKTABS.isNativeHomeUrl(url)) return false;
        if (AUTOTASKTABS.isDialogPopOutFromDialogUrl(url)) return false;

        const innerUrl = AUTOTASKTABS.extractInnerUrlFromLandingPageUrl(url);
        if (innerUrl) return AUTOTASKTABS.isHandledUrl(innerUrl);

        const path = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(url));
        if (ROUTES.isHandledPath) {
            return ROUTES.isHandledPath(path);
        }
        return AUTOTASKTABS.HANDLED_PATHS.includes(path) ||
            AUTOTASKTABS.HANDLED_PATH_INCLUDES.some(fragment => path.includes(fragment));
    };

    AUTOTASKTABS.toAbsoluteUrl = function toAbsoluteUrl(url) {
        return new URL(url, location.origin).href;
    };

    AUTOTASKTABS.extractHandledUrlFromLandingPageUrl = function extractHandledUrlFromLandingPageUrl(url) {
        if (AUTOTASKTABS.isNativeOnyxUrl(url)) return null;
        const innerUrl = AUTOTASKTABS.extractInnerUrlFromLandingPageUrl(url);
        return innerUrl && AUTOTASKTABS.isHandledUrl(innerUrl) ? innerUrl : null;
    };

    // Detect when our extension context becomes invalid (Chrome auto-
    // update, manual reload, disable) so the still-running OLD
    // content scripts in this tab can gracefully clean up. Without
    // this, every chrome.runtime.* call from the orphaned scripts
    // throws "Extension context invalidated", the AUTOTASKTABS tab bar stays
    // visible but unresponsive, and the user sees the extension as
    // "broken" until they refresh manually.
    //
    // On detection we strip AUTOTASKTABS-injected DOM and (top frame only)
    // show a small toast asking the user to refresh.
    if (!AUTOTASKTABS.lifecycleWatchInstalled) {
        AUTOTASKTABS.lifecycleWatchInstalled = true;

        let invalidated = false;

        function isExtensionContextValid() {
            try {
                return !!(chrome && chrome.runtime && chrome.runtime.id);
            } catch (e) {
                return false;
            }
        }

        function removeAutotaskTabsDomElements() {
            try {
                const selectors = [
                    '.at-tabs-bar',
                    '.at-tabs-peek-wrapper',
                    '.at-tabs-modal',
                    '.at-tabs-modal-backdrop',
                    '.at-tabs-settings-backdrop',
                    '.at-tabs-context-menu',
                    '.at-tabs-map-modal',
                    '.at-tabs-split-buttons',
                    '.at-tabs-viewport',
                    '.at-tabs-home-cover',
                ];
                document.querySelectorAll(selectors.join(','))
                    .forEach(function (el) { try { el.remove(); } catch (e) {} });
            } catch (e) {}
            try {
                if (document.body && document.body.style) {
                    document.body.style.paddingTop = '';
                }
                if (document.documentElement && document.documentElement.classList) {
                    document.documentElement.classList.remove(
                        'autotasktabs-dark', 'autotasktabs-shell-active'
                    );
                }
            } catch (e) {}
        }

        function showRefreshToast() {
            if (document.getElementById('autotasktabs-update-toast')) return;
            const host = document.body || document.documentElement;
            if (!host) return;
            const toast = document.createElement('div');
            toast.id = 'autotasktabs-update-toast';
            toast.setAttribute('role', 'status');
            toast.style.cssText = [
                'position:fixed', 'z-index:2147483647', 'left:50%',
                'bottom:24px', 'transform:translateX(-50%)',
                'background:#1f2937', 'color:#f9fafb',
                'font:500 13px/1.4 system-ui,-apple-system,Segoe UI,Roboto,sans-serif',
                'padding:12px 16px', 'border-radius:8px',
                'box-shadow:0 8px 24px rgba(0,0,0,0.3)',
                'display:flex', 'align-items:center', 'gap:12px',
                'max-width:90vw',
            ].join(';') + ';';
            const text = document.createElement('span');
            text.textContent = 'AUTOTASKTABS has been updated. Please refresh to continue.';
            const button = document.createElement('button');
            button.textContent = 'Refresh';
            button.style.cssText = [
                'background:#3b82f6', 'color:#ffffff', 'border:0',
                'padding:6px 12px', 'border-radius:6px',
                'font:600 12px/1 system-ui,-apple-system,sans-serif',
                'cursor:pointer',
            ].join(';') + ';';
            button.addEventListener('click', function () {
                try { location.reload(); } catch (e) {}
            });
            toast.appendChild(text);
            toast.appendChild(button);
            host.appendChild(toast);
        }

        function handleExtensionContextInvalidated() {
            if (invalidated) return;
            invalidated = true;
            removeAutotaskTabsDomElements();
            if (window === window.top) {
                try { showRefreshToast(); } catch (e) {}
            }
        }

        const intervalId = setInterval(function () {
            if (isExtensionContextValid()) return;
            try { clearInterval(intervalId); } catch (e) {}
            handleExtensionContextInvalidated();
        }, 3000);
    }
})();


// Autotask Tabs - storage helpers
(function () {
    'use strict';

    const AUTOTASKTABS = window.__AUTOTASKTABS__;
    if (!AUTOTASKTABS || AUTOTASKTABS.storageInitialized) return;
    AUTOTASKTABS.storageInitialized = true;

    AUTOTASKTABS.state = AUTOTASKTABS.state || {};
    if (typeof AUTOTASKTABS.state.extensionEnabled !== 'boolean') {
        AUTOTASKTABS.state.extensionEnabled = true;
    }
    if (typeof AUTOTASKTABS.state.rememberTabsAfterClose !== 'boolean') {
        AUTOTASKTABS.state.rememberTabsAfterClose = true;
    }
    if (typeof AUTOTASKTABS.state.openNewTabsAtStart !== 'boolean') {
        AUTOTASKTABS.state.openNewTabsAtStart = false;
    }
    if (typeof AUTOTASKTABS.state.phoneLinksEnabled !== 'boolean') {
        AUTOTASKTABS.state.phoneLinksEnabled = true;
    }
    if (typeof AUTOTASKTABS.state.ticketLinksEnabled !== 'boolean') {
        AUTOTASKTABS.state.ticketLinksEnabled = true;
    }
    if (typeof AUTOTASKTABS.state.themePreference !== 'string'
        || !['auto', 'light', 'dark'].includes(AUTOTASKTABS.state.themePreference)) {
        AUTOTASKTABS.state.themePreference = 'auto';
    }
    if (typeof AUTOTASKTABS.state.barOrientation !== 'string'
        || !['horizontal', 'vertical'].includes(AUTOTASKTABS.state.barOrientation)) {
        AUTOTASKTABS.state.barOrientation = 'horizontal';
    }
    if (typeof AUTOTASKTABS.state.showTabBarOnNonIframePages !== 'boolean') {
        AUTOTASKTABS.state.showTabBarOnNonIframePages = true;
    }
    if (typeof AUTOTASKTABS.state.resizableTabBarEnabled !== 'boolean') {
        AUTOTASKTABS.state.resizableTabBarEnabled = true;
    }
    if (typeof AUTOTASKTABS.state.horizontalCompactTabsEnabled !== 'boolean') {
        AUTOTASKTABS.state.horizontalCompactTabsEnabled = false;
    }
    if (typeof AUTOTASKTABS.state.roundedPageFramesEnabled !== 'boolean') {
        AUTOTASKTABS.state.roundedPageFramesEnabled = false;
    }
    if (typeof AUTOTASKTABS.state.experimentalUmbrellaContractFrameTabs !== 'boolean') {
        AUTOTASKTABS.state.experimentalUmbrellaContractFrameTabs = false;
    }
    if (!AUTOTASKTABS.state.managedSettings || typeof AUTOTASKTABS.state.managedSettings !== 'object') {
        AUTOTASKTABS.state.managedSettings = {};
    }
    if (typeof AUTOTASKTABS.state.improvedScrollbarsEnabled !== 'boolean') {
        AUTOTASKTABS.state.improvedScrollbarsEnabled = true;
    }
    if (typeof AUTOTASKTABS.state.skipPeekBackdropCloseWarning !== 'boolean') {
        AUTOTASKTABS.state.skipPeekBackdropCloseWarning = false;
    }
    if (typeof AUTOTASKTABS.state.peekMoveResizeEnabled !== 'boolean') {
        AUTOTASKTABS.state.peekMoveResizeEnabled = false;
    }
    if (typeof AUTOTASKTABS.state.tabBarWidth !== 'number') {
        AUTOTASKTABS.state.tabBarWidth = AUTOTASKTABS.BAR_W || 240;
    }
    if (!AUTOTASKTABS.state.tabLine2Fields || typeof AUTOTASKTABS.state.tabLine2Fields !== 'object') {
        AUTOTASKTABS.state.tabLine2Fields = {};
    }
    if (!AUTOTASKTABS.state.tabLine3Fields || typeof AUTOTASKTABS.state.tabLine3Fields !== 'object') {
        AUTOTASKTABS.state.tabLine3Fields = {};
    }
    AUTOTASKTABS.settingsLoaded = false;
    AUTOTASKTABS.settingsLoadFailed = false;
    AUTOTASKTABS.lastChromeStorageError = null;

    AUTOTASKTABS.hasChromeStorage = function hasChromeStorage() {
        try {
            return !!(
                typeof chrome !== 'undefined' &&
                chrome &&
                chrome.storage &&
                chrome.storage.local
            );
        } catch (e) {
            AUTOTASKTABS.lastChromeStorageError = e;
            return false;
        }
    };

    AUTOTASKTABS.readSessionTabsPayload = function readSessionTabsPayload() {
        try {
            const raw = sessionStorage.getItem(AUTOTASKTABS.STORAGE_KEY);
            return raw ? JSON.parse(raw) : null;
        } catch (e) {
            return null;
        }
    };

    AUTOTASKTABS.writeSessionTabsPayload = function writeSessionTabsPayload(payload) {
        try {
            sessionStorage.setItem(AUTOTASKTABS.STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {}
    };

    AUTOTASKTABS.clearSessionTabsPayload = function clearSessionTabsPayload() {
        try {
            sessionStorage.removeItem(AUTOTASKTABS.STORAGE_KEY);
        } catch (e) {}
    };

    AUTOTASKTABS.getChromeLocal = function getChromeLocal(keys) {
        return new Promise(function (resolve) {
            try {
                chrome.storage.local.get(keys, function (result) {
                    try {
                        if (chrome.runtime && chrome.runtime.lastError) {
                            AUTOTASKTABS.lastChromeStorageError = chrome.runtime.lastError;
                            resolve({});
                            return;
                        }
                    } catch (e) {
                        AUTOTASKTABS.lastChromeStorageError = e;
                        resolve({});
                        return;
                    }
                    resolve(result);
                });
            } catch (e) {
                AUTOTASKTABS.lastChromeStorageError = e;
                resolve({});
            }
        });
    };

    AUTOTASKTABS.hasChromeManagedStorage = function hasChromeManagedStorage() {
        try {
            return !!(
                typeof chrome !== 'undefined' &&
                chrome &&
                chrome.storage &&
                chrome.storage.managed
            );
        } catch (e) {
            return false;
        }
    };

    AUTOTASKTABS.getChromeManaged = function getChromeManaged(keys) {
        return new Promise(function (resolve) {
            if (!AUTOTASKTABS.hasChromeManagedStorage()) {
                resolve({});
                return;
            }
            try {
                chrome.storage.managed.get(keys || null, function (result) {
                    try {
                        if (chrome.runtime && chrome.runtime.lastError) {
                            resolve({});
                            return;
                        }
                    } catch (e) {
                        resolve({});
                        return;
                    }
                    resolve(result || {});
                });
            } catch (e) {
                resolve({});
            }
        });
    };

    AUTOTASKTABS.setChromeLocal = function setChromeLocal(values) {
        return new Promise(function (resolve) {
            try {
                chrome.storage.local.set(values, resolve);
            } catch (e) {
                resolve();
            }
        });
    };

    AUTOTASKTABS.removeChromeLocal = function removeChromeLocal(keys) {
        return new Promise(function (resolve) {
            try {
                chrome.storage.local.remove(keys, resolve);
            } catch (e) {
                resolve();
            }
        });
    };

    AUTOTASKTABS.getChromeSync = function getChromeSync(keys) {
        return new Promise(function (resolve) {
            try {
                chrome.storage.sync.get(keys, function (result) {
                    try {
                        if (chrome.runtime && chrome.runtime.lastError) {
                            resolve({});
                            return;
                        }
                    } catch (e) {
                        resolve({});
                        return;
                    }
                    resolve(result);
                });
            } catch (e) {
                resolve({});
            }
        });
    };

    AUTOTASKTABS.setChromeSync = function setChromeSync(values) {
        return new Promise(function (resolve) {
            try {
                chrome.storage.sync.set(values, resolve);
            } catch (e) {
                resolve();
            }
        });
    };

    function readThemePreference(settings) {
        const value = settings && settings.themePreference;
        return ['auto', 'light', 'dark'].includes(value) ? value : 'auto';
    }

    function readBarOrientation(settings) {
        const value = settings && settings.barOrientation;
        return ['horizontal', 'vertical'].includes(value) ? value : 'horizontal';
    }

    function readTabBarWidth(settings) {
        const value = settings && Number(settings.tabBarWidth);
        const min = AUTOTASKTABS.BAR_W_MIN || 56;
        const max = AUTOTASKTABS.BAR_W_MAX || 420;
        const fallback = AUTOTASKTABS.BAR_W || 240;
        if (!Number.isFinite(value)) return fallback;
        return Math.max(min, Math.min(max, Math.round(value)));
    }


    AUTOTASKTABS.loadSettings = async function loadSettings() {
        AUTOTASKTABS.settingsLoaded = false;
        AUTOTASKTABS.settingsLoadFailed = false;
        if (AUTOTASKTABS.hasChromeStorage()) {
            AUTOTASKTABS.lastChromeStorageError = null;
            // First check local storage for migration (old location)
            const localStored = await AUTOTASKTABS.getChromeLocal(AUTOTASKTABS.SETTINGS_STORAGE_KEY);
            let settings = localStored && localStored[AUTOTASKTABS.SETTINGS_STORAGE_KEY];

            // If settings found in local storage, migrate to sync storage
            if (settings) {
                await AUTOTASKTABS.setChromeSync({ [AUTOTASKTABS.SETTINGS_STORAGE_KEY]: settings });
                await AUTOTASKTABS.removeChromeLocal(AUTOTASKTABS.SETTINGS_STORAGE_KEY);
            } else {
                // Otherwise load from sync storage (new location)
                const syncStored = await AUTOTASKTABS.getChromeSync(AUTOTASKTABS.SETTINGS_STORAGE_KEY);
                settings = syncStored && syncStored[AUTOTASKTABS.SETTINGS_STORAGE_KEY];
            }

            if (!settings) {
                AUTOTASKTABS.settingsLoadFailed = true;
                return;
            }
            AUTOTASKTABS.state.extensionEnabled = settings && typeof settings.extensionEnabled === 'boolean'
                ? settings.extensionEnabled
                : true;
            AUTOTASKTABS.state.rememberTabsAfterClose = settings && typeof settings.rememberTabsAfterClose === 'boolean'
                ? settings.rememberTabsAfterClose
                : true;
            AUTOTASKTABS.state.openNewTabsAtStart = !!(settings && settings.openNewTabsAtStart);
            AUTOTASKTABS.state.phoneLinksEnabled = settings && typeof settings.phoneLinksEnabled === 'boolean'
                ? settings.phoneLinksEnabled
                : true;
            AUTOTASKTABS.state.ticketLinksEnabled = settings && typeof settings.ticketLinksEnabled === 'boolean'
                ? settings.ticketLinksEnabled
                : true;
            AUTOTASKTABS.state.themePreference = readThemePreference(settings);
            AUTOTASKTABS.state.barOrientation = readBarOrientation(settings);
            AUTOTASKTABS.state.showTabBarOnNonIframePages = settings && typeof settings.showTabBarOnNonIframePages === 'boolean'
                ? settings.showTabBarOnNonIframePages
                : true;
            AUTOTASKTABS.state.resizableTabBarEnabled = settings && typeof settings.resizableTabBarEnabled === 'boolean'
                ? settings.resizableTabBarEnabled
                : true;
            AUTOTASKTABS.state.horizontalCompactTabsEnabled = !!(settings && settings.horizontalCompactTabsEnabled);
            AUTOTASKTABS.state.roundedPageFramesEnabled = settings && typeof settings.roundedPageFramesEnabled === 'boolean'
                ? settings.roundedPageFramesEnabled
                : true;
            AUTOTASKTABS.state.experimentalUmbrellaContractFrameTabs = settings && typeof settings.experimentalUmbrellaContractFrameTabs === 'boolean'
                ? settings.experimentalUmbrellaContractFrameTabs
                : false;
            AUTOTASKTABS.state.improvedScrollbarsEnabled = settings && typeof settings.improvedScrollbarsEnabled === 'boolean'
                ? settings.improvedScrollbarsEnabled
                : true;
            AUTOTASKTABS.state.skipPeekBackdropCloseWarning = settings && typeof settings.skipPeekBackdropCloseWarning === 'boolean'
                ? settings.skipPeekBackdropCloseWarning
                : false;
            AUTOTASKTABS.state.peekMoveResizeEnabled = settings && typeof settings.peekMoveResizeEnabled === 'boolean'
                ? settings.peekMoveResizeEnabled
                : true;
            AUTOTASKTABS.state.defaultEnabledSettingsMigration = typeof (settings && settings.defaultEnabledSettingsMigration) === 'string'
                ? settings.defaultEnabledSettingsMigration
                : '';
            AUTOTASKTABS.state.tabBarWidth = readTabBarWidth(settings);
            AUTOTASKTABS.state.tabLine2Fields = settings && typeof settings.tabLine2Fields === 'object' ? settings.tabLine2Fields : {};
            AUTOTASKTABS.state.tabLine3Fields = settings && typeof settings.tabLine3Fields === 'object' ? settings.tabLine3Fields : {};
            AUTOTASKTABS.settingsLoaded = true;
            return;
        }

        try {
            const raw = localStorage.getItem(AUTOTASKTABS.SETTINGS_STORAGE_KEY);
            const settings = raw ? JSON.parse(raw) : null;
            AUTOTASKTABS.state.extensionEnabled = settings && typeof settings.extensionEnabled === 'boolean'
                ? settings.extensionEnabled
                : true;
            AUTOTASKTABS.state.rememberTabsAfterClose = settings && typeof settings.rememberTabsAfterClose === 'boolean'
                ? settings.rememberTabsAfterClose
                : true;
            AUTOTASKTABS.state.openNewTabsAtStart = !!(settings && settings.openNewTabsAtStart);
            AUTOTASKTABS.state.phoneLinksEnabled = settings && typeof settings.phoneLinksEnabled === 'boolean'
                ? settings.phoneLinksEnabled
                : true;
            AUTOTASKTABS.state.ticketLinksEnabled = settings && typeof settings.ticketLinksEnabled === 'boolean'
                ? settings.ticketLinksEnabled
                : true;
            AUTOTASKTABS.state.themePreference = readThemePreference(settings);
            AUTOTASKTABS.state.barOrientation = readBarOrientation(settings);
            AUTOTASKTABS.state.showTabBarOnNonIframePages = settings && typeof settings.showTabBarOnNonIframePages === 'boolean'
                ? settings.showTabBarOnNonIframePages
                : true;
            AUTOTASKTABS.state.resizableTabBarEnabled = settings && typeof settings.resizableTabBarEnabled === 'boolean'
                ? settings.resizableTabBarEnabled
                : true;
            AUTOTASKTABS.state.horizontalCompactTabsEnabled = !!(settings && settings.horizontalCompactTabsEnabled);
            AUTOTASKTABS.state.roundedPageFramesEnabled = settings && typeof settings.roundedPageFramesEnabled === 'boolean'
                ? settings.roundedPageFramesEnabled
                : true;
            AUTOTASKTABS.state.experimentalUmbrellaContractFrameTabs = settings && typeof settings.experimentalUmbrellaContractFrameTabs === 'boolean'
                ? settings.experimentalUmbrellaContractFrameTabs
                : false;
            AUTOTASKTABS.state.improvedScrollbarsEnabled = settings && typeof settings.improvedScrollbarsEnabled === 'boolean'
                ? settings.improvedScrollbarsEnabled
                : true;
            AUTOTASKTABS.state.skipPeekBackdropCloseWarning = settings && typeof settings.skipPeekBackdropCloseWarning === 'boolean'
                ? settings.skipPeekBackdropCloseWarning
                : false;
            AUTOTASKTABS.state.peekMoveResizeEnabled = settings && typeof settings.peekMoveResizeEnabled === 'boolean'
                ? settings.peekMoveResizeEnabled
                : true;
            AUTOTASKTABS.state.defaultEnabledSettingsMigration = typeof (settings && settings.defaultEnabledSettingsMigration) === 'string'
                ? settings.defaultEnabledSettingsMigration
                : '';
            AUTOTASKTABS.state.tabBarWidth = readTabBarWidth(settings);
            AUTOTASKTABS.state.tabLine2Fields = settings && typeof settings.tabLine2Fields === 'object' ? settings.tabLine2Fields : {};
            AUTOTASKTABS.state.tabLine3Fields = settings && typeof settings.tabLine3Fields === 'object' ? settings.tabLine3Fields : {};
            AUTOTASKTABS.settingsLoaded = true;
        } catch (e) {
            AUTOTASKTABS.settingsLoadFailed = true;
        }
    };

    AUTOTASKTABS.saveSettings = async function saveSettings() {
        if (AUTOTASKTABS.settingsLoadFailed || !AUTOTASKTABS.settingsLoaded) return;
        const payload = {
            extensionEnabled: AUTOTASKTABS.state.extensionEnabled !== false,
            rememberTabsAfterClose: !!AUTOTASKTABS.state.rememberTabsAfterClose,
            openNewTabsAtStart: !!AUTOTASKTABS.state.openNewTabsAtStart,
            phoneLinksEnabled: !!AUTOTASKTABS.state.phoneLinksEnabled,
            ticketLinksEnabled: !!AUTOTASKTABS.state.ticketLinksEnabled,
            themePreference: readThemePreference(AUTOTASKTABS.state),
            barOrientation: readBarOrientation(AUTOTASKTABS.state),
            showTabBarOnNonIframePages: !!AUTOTASKTABS.state.showTabBarOnNonIframePages,
            resizableTabBarEnabled: !!AUTOTASKTABS.state.resizableTabBarEnabled,
            horizontalCompactTabsEnabled: !!AUTOTASKTABS.state.horizontalCompactTabsEnabled,
            roundedPageFramesEnabled: !!AUTOTASKTABS.state.roundedPageFramesEnabled,
            experimentalUmbrellaContractFrameTabs: !!AUTOTASKTABS.state.experimentalUmbrellaContractFrameTabs,
            improvedScrollbarsEnabled: !!AUTOTASKTABS.state.improvedScrollbarsEnabled,
            skipPeekBackdropCloseWarning: !!AUTOTASKTABS.state.skipPeekBackdropCloseWarning,
            peekMoveResizeEnabled: !!AUTOTASKTABS.state.peekMoveResizeEnabled,
            defaultEnabledSettingsMigration: typeof AUTOTASKTABS.state.defaultEnabledSettingsMigration === 'string'
                ? AUTOTASKTABS.state.defaultEnabledSettingsMigration
                : '',
            tabBarWidth: readTabBarWidth(AUTOTASKTABS.state),
            tabLine2Fields: AUTOTASKTABS.state.tabLine2Fields || {},
            tabLine3Fields: AUTOTASKTABS.state.tabLine3Fields || {},
        };
        if (AUTOTASKTABS.hasChromeStorage()) {
            await AUTOTASKTABS.setChromeSync({ [AUTOTASKTABS.SETTINGS_STORAGE_KEY]: payload });
            return;
        }

        try {
            localStorage.setItem(AUTOTASKTABS.SETTINGS_STORAGE_KEY, JSON.stringify(payload));
        } catch (e) {}
    };

    AUTOTASKTABS.shouldPersistTabs = function shouldPersistTabs() {
        return AUTOTASKTABS.state && AUTOTASKTABS.state.rememberTabsAfterClose !== false;
    };

    AUTOTASKTABS.readTabsPayload = async function readTabsPayload() {
        if (!AUTOTASKTABS.shouldPersistTabs()) {
            return AUTOTASKTABS.readSessionTabsPayload();
        }
        if (AUTOTASKTABS.hasChromeStorage()) {
            const stored = await AUTOTASKTABS.getChromeLocal(AUTOTASKTABS.STORAGE_KEY);
            if (stored && stored[AUTOTASKTABS.STORAGE_KEY]) return stored[AUTOTASKTABS.STORAGE_KEY];
        }
        return AUTOTASKTABS.readSessionTabsPayload();
    };

    AUTOTASKTABS.writeTabsPayload = async function writeTabsPayload(payload) {
        if (AUTOTASKTABS.hasChromeStorage() && AUTOTASKTABS.shouldPersistTabs()) {
            await AUTOTASKTABS.setChromeLocal({ [AUTOTASKTABS.STORAGE_KEY]: payload });
            AUTOTASKTABS.clearSessionTabsPayload();
            return;
        }

        AUTOTASKTABS.writeSessionTabsPayload(payload);
        if (AUTOTASKTABS.hasChromeStorage()) {
            await AUTOTASKTABS.removeChromeLocal(AUTOTASKTABS.STORAGE_KEY);
        }
    };

    AUTOTASKTABS.syncTabsPersistenceMode = async function syncTabsPersistenceMode(payload) {
        if (AUTOTASKTABS.shouldPersistTabs()) {
            await AUTOTASKTABS.writeTabsPayload(payload);
            return;
        }

        AUTOTASKTABS.writeSessionTabsPayload(payload);
        if (AUTOTASKTABS.hasChromeStorage()) {
            await AUTOTASKTABS.removeChromeLocal(AUTOTASKTABS.STORAGE_KEY);
        }
    };

    AUTOTASKTABS.clearPersistedTabs = async function clearPersistedTabs() {
        AUTOTASKTABS.clearSessionTabsPayload();
        if (AUTOTASKTABS.hasChromeStorage()) {
            await AUTOTASKTABS.removeChromeLocal(AUTOTASKTABS.STORAGE_KEY);
        }
    };
})();


// Autotask Tabs - phone link detection and click handling
(function () {
    'use strict';

    const AUTOTASKTABS = window.__AUTOTASKTABS__;
    if (!AUTOTASKTABS || AUTOTASKTABS.phoneLinksInitialized) return;
    AUTOTASKTABS.phoneLinksInitialized = true;

    const PHONE_LINK_CLASS = 'autotasktabs-phone-link';
    const SCANNED_ATTR = 'data-autotasktabs-phone-scanned';
    const DASH_CHARS = '\\-\\u2010\\u2011\\u2012\\u2013\\u2014\\u2015\\u2212';
    const PHONE_PATTERN = new RegExp('(?:\\+|00)?\\d(?:[\\d().' + DASH_CHARS + ']|\\s+(?=\\d)|\\s*[' + DASH_CHARS + '/]\\s*){5,}\\d', 'g');
    const SKIP_SELECTOR = [
        'a',
        'script',
        'style',
        'textarea',
        'input',
        'select',
        'option',
        'button',
        '[contenteditable="true"]',
        '.at-tabs-bar',
        '.at-tabs-viewport',
        '.at-tabs-settings-modal',
    ].join(',');

    let observer = null;
    let scanTimer = 0;
    let styleInjected = false;

    document.addEventListener('click', function (event) {
        const phoneLink = event.target.closest && event.target.closest('a.' + PHONE_LINK_CLASS);
        if (!phoneLink) return;
        event.stopPropagation();
        event.stopImmediatePropagation();
    }, true);

    function injectStyle() {
        if (styleInjected || document.getElementById('autotasktabs-phone-link-style')) return;
        styleInjected = true;
        const style = document.createElement('style');
        style.id = 'autotasktabs-phone-link-style';
        style.textContent = `
            a.${PHONE_LINK_CLASS} {
                color: inherit;
                text-decoration: underline;
                text-decoration-style: dotted;
                text-underline-offset: 2px;
                cursor: pointer;
            }
            a.${PHONE_LINK_CLASS}:hover {
                color: var(--autotasktabs-accent-link-color, #1d4ed8);
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    function shouldSkipNode(node) {
        const parent = node && node.parentElement;
        if (!parent) return true;
        if (parent.closest(SKIP_SELECTOR)) return true;
        return !node.nodeValue || !/\d/.test(node.nodeValue);
    }

    function normalizePhone(raw) {
        let value = (raw || '').trim();
        if (!value) return '';

        value = value.replace(/[\u2010-\u2015\u2212]/g, '-');
        value = value.replace(/\(0\)/g, '');
        const hasPlus = /^\s*\+/.test(value);
        const startsInternational = /^\s*00/.test(value);
        let digits = value.replace(/\D/g, '');

        if (startsInternational) digits = digits.replace(/^00/, '');
        if (digits.length < 7 || digits.length > 15) return '';
        if (/^0+$/.test(digits)) return '';

        return (hasPlus || startsInternational ? '+' : '') + digits;
    }

    function isProbablyPhone(raw) {
        const normalized = normalizePhone(raw);
        if (!normalized) return false;

        const digits = normalized.replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 15) return false;

        const trimmed = raw.trim();
        if (/^\d{1,2}[/-]\d{1,2}[/-]\d{2,4}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?$/.test(trimmed)) return false;
        if (/^\d{4}[/-]\d{1,2}[/-]\d{1,2}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?$/.test(trimmed)) return false;
        if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(trimmed)) return false;
        if (/^\d+(?:[.,]\d+)?$/.test(trimmed) && digits.length < 10) return false;

        return true;
    }

    function hasSafeBoundary(text, start, end) {
        const before = start > 0 ? text[start - 1] : '';
        const after = end < text.length ? text[end] : '';
        if (before && /[A-Za-z0-9]/.test(before)) return false;
        if (after && /[A-Za-z0-9]/.test(after)) return false;
        if (after === ':') return false;
        return true;
    }

    function buildFragment(text) {
        PHONE_PATTERN.lastIndex = 0;
        let match;
        let lastIndex = 0;
        let changed = false;
        const fragment = document.createDocumentFragment();

        while ((match = PHONE_PATTERN.exec(text)) !== null) {
            const raw = match[0];
            if (!hasSafeBoundary(text, match.index, match.index + raw.length)) continue;
            if (!isProbablyPhone(raw)) continue;

            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }

            const link = document.createElement('a');
            link.className = PHONE_LINK_CLASS;
            link.href = 'tel:' + normalizePhone(raw);
            link.textContent = raw;
            link.title = 'Call ' + raw.trim();
            fragment.appendChild(link);

            lastIndex = match.index + raw.length;
            changed = true;
        }

        if (!changed) return null;
        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        return fragment;
    }

    function linkTextNode(node) {
        if (shouldSkipNode(node)) return;
        const fragment = buildFragment(node.nodeValue);
        if (!fragment) return;
        node.parentNode.replaceChild(fragment, node);
    }

    function scan(root) {
        if (!AUTOTASKTABS.state.phoneLinksEnabled) return;
        const scanRoot = root && root.nodeType === Node.ELEMENT_NODE ? root : document.body;
        if (!scanRoot || scanRoot.getAttribute(SCANNED_ATTR) === 'true') return;

        injectStyle();
        const walker = document.createTreeWalker(scanRoot, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                return shouldSkipNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            },
        });

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(linkTextNode);

        if (scanRoot !== document.body) {
            scanRoot.setAttribute(SCANNED_ATTR, 'true');
        }
    }

    function scheduleScan(root) {
        if (!AUTOTASKTABS.state.phoneLinksEnabled) return;
        clearTimeout(scanTimer);
        scanTimer = setTimeout(function () {
            scan(root || document.body);
        }, 120);
    }

    function unlinkPhoneLinks() {
        document.querySelectorAll('a.' + PHONE_LINK_CLASS).forEach(function (link) {
            link.replaceWith(document.createTextNode(link.textContent || ''));
        });
        document.querySelectorAll('[' + SCANNED_ATTR + ']').forEach(function (el) {
            el.removeAttribute(SCANNED_ATTR);
        });
    }

    function startObserver() {
        if (observer || !document.body) return;
        observer = new MutationObserver(function (mutations) {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        linkTextNode(node);
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        scheduleScan(node);
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function stopObserver() {
        if (!observer) return;
        observer.disconnect();
        observer = null;
    }

    AUTOTASKTABS.setPhoneLinksEnabled = function setPhoneLinksEnabled(enabled) {
        AUTOTASKTABS.state.phoneLinksEnabled = !!enabled;
        if (AUTOTASKTABS.state.phoneLinksEnabled) {
            scheduleScan(document.body);
            startObserver();
        } else {
            stopObserver();
            unlinkPhoneLinks();
        }
    };

    AUTOTASKTABS.initPhoneLinks = function initPhoneLinks() {
        if (AUTOTASKTABS.featuresEnabled && !AUTOTASKTABS.featuresEnabled()) {
            AUTOTASKTABS.setPhoneLinksEnabled(false);
            return;
        }
        if (!AUTOTASKTABS.state.phoneLinksEnabled) return;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                AUTOTASKTABS.setPhoneLinksEnabled(true);
            }, { once: true });
            return;
        }
        AUTOTASKTABS.setPhoneLinksEnabled(true);
    };

})();


// Autotask Tabs - ticket link detection and click handling
(function () {
    'use strict';

    const AUTOTASKTABS = window.__AUTOTASKTABS__;
    if (!AUTOTASKTABS || AUTOTASKTABS.ticketLinksInitialized) return;
    AUTOTASKTABS.ticketLinksInitialized = true;

    const TICKET_LINK_CLASS = 'autotasktabs-ticket-link';
    const SCANNED_ATTR = 'data-autotasktabs-ticket-scanned';
    // Autotask default ticket number format: T<6-10 digit date-like
    // prefix>.<1-8 digit sequence>. The leading "T" and the dot
    // separator are the universal markers across regional hosts.
    const TICKET_PATTERN = /T\d{6,10}\.\d{1,8}/g;
    const SKIP_SELECTOR = [
        'a',
        'script',
        'style',
        'textarea',
        'input',
        'select',
        'option',
        'button',
        '[contenteditable="true"]',
        '.at-tabs-bar',
        '.at-tabs-viewport',
        '.at-tabs-settings-modal',
    ].join(',');
    const TICKET_HREF_PATH = '/Mvc/ServiceDesk/TicketDetail.mvc/TicketByTicketNumber?ticketNumber=';

    let observer = null;
    let scanTimer = 0;
    let styleInjected = false;

    // Bubble-phase listener: capture-phase handlers (notably the AUTOTASKTABS
    // iframe-bridge's anchor-click interceptor) have already had
    // their shot, so the ticket has been routed into an AUTOTASKTABS tab.
    // Stopping bubble propagation here keeps the click from also
    // triggering the surrounding row/cell's onclick (e.g. opening a
    // different ticket in a list view).
    document.addEventListener('click', function (event) {
        const ticketLink = event.target.closest && event.target.closest('a.' + TICKET_LINK_CLASS);
        if (!ticketLink) return;
        event.stopPropagation();
    }, false);

    function injectStyle() {
        if (styleInjected || document.getElementById('autotasktabs-ticket-link-style')) return;
        styleInjected = true;
        const style = document.createElement('style');
        style.id = 'autotasktabs-ticket-link-style';
        style.textContent = `
            a.${TICKET_LINK_CLASS} {
                color: inherit;
                text-decoration: underline;
                text-decoration-style: dotted;
                text-underline-offset: 2px;
                cursor: pointer;
            }
            a.${TICKET_LINK_CLASS}:hover {
                color: var(--autotasktabs-accent-link-color, #1d4ed8);
            }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    function shouldSkipNode(node) {
        const parent = node && node.parentElement;
        if (!parent) return true;
        if (parent.closest(SKIP_SELECTOR)) return true;
        // Quick reject: text without a "T<digit>" sequence can't
        // contain a ticket number, so don't waste a regex scan.
        return !node.nodeValue || !/T\d/.test(node.nodeValue);
    }

    function hasSafeBoundary(text, start, end) {
        const before = start > 0 ? text[start - 1] : '';
        const after = end < text.length ? text[end] : '';
        if (before && /[A-Za-z0-9]/.test(before)) return false;
        if (after && /[A-Za-z0-9.]/.test(after)) return false;
        return true;
    }

    function buildFragment(text) {
        TICKET_PATTERN.lastIndex = 0;
        let match;
        let lastIndex = 0;
        let changed = false;
        const fragment = document.createDocumentFragment();

        while ((match = TICKET_PATTERN.exec(text)) !== null) {
            const raw = match[0];
            if (!hasSafeBoundary(text, match.index, match.index + raw.length)) continue;

            if (match.index > lastIndex) {
                fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            }

            const link = document.createElement('a');
            link.className = TICKET_LINK_CLASS;
            link.href = TICKET_HREF_PATH + encodeURIComponent(raw);
            link.textContent = raw;
            link.title = 'Open ticket ' + raw;
            fragment.appendChild(link);

            lastIndex = match.index + raw.length;
            changed = true;
        }

        if (!changed) return null;
        if (lastIndex < text.length) {
            fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
        }
        return fragment;
    }

    function linkTextNode(node) {
        if (shouldSkipNode(node)) return;
        const fragment = buildFragment(node.nodeValue);
        if (!fragment) return;
        node.parentNode.replaceChild(fragment, node);
    }

    function scan(root) {
        if (!AUTOTASKTABS.state.ticketLinksEnabled) return;
        const scanRoot = root && root.nodeType === Node.ELEMENT_NODE ? root : document.body;
        if (!scanRoot || scanRoot.getAttribute(SCANNED_ATTR) === 'true') return;

        injectStyle();
        const walker = document.createTreeWalker(scanRoot, NodeFilter.SHOW_TEXT, {
            acceptNode: function (node) {
                return shouldSkipNode(node) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
            },
        });

        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);
        nodes.forEach(linkTextNode);

        if (scanRoot !== document.body) {
            scanRoot.setAttribute(SCANNED_ATTR, 'true');
        }
    }

    function scheduleScan(root) {
        if (!AUTOTASKTABS.state.ticketLinksEnabled) return;
        clearTimeout(scanTimer);
        scanTimer = setTimeout(function () {
            scan(root || document.body);
        }, 120);
    }

    function unlinkTicketLinks() {
        document.querySelectorAll('a.' + TICKET_LINK_CLASS).forEach(function (link) {
            link.replaceWith(document.createTextNode(link.textContent || ''));
        });
        document.querySelectorAll('[' + SCANNED_ATTR + ']').forEach(function (el) {
            el.removeAttribute(SCANNED_ATTR);
        });
    }

    function startObserver() {
        if (observer || !document.body) return;
        observer = new MutationObserver(function (mutations) {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === Node.TEXT_NODE) {
                        linkTextNode(node);
                    } else if (node.nodeType === Node.ELEMENT_NODE) {
                        scheduleScan(node);
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function stopObserver() {
        if (!observer) return;
        observer.disconnect();
        observer = null;
    }

    AUTOTASKTABS.setTicketLinksEnabled = function setTicketLinksEnabled(enabled) {
        AUTOTASKTABS.state.ticketLinksEnabled = !!enabled;
        if (AUTOTASKTABS.state.ticketLinksEnabled) {
            scheduleScan(document.body);
            startObserver();
        } else {
            stopObserver();
            unlinkTicketLinks();
        }
    };

    AUTOTASKTABS.initTicketLinks = function initTicketLinks() {
        if (AUTOTASKTABS.featuresEnabled && !AUTOTASKTABS.featuresEnabled()) {
            AUTOTASKTABS.setTicketLinksEnabled(false);
            return;
        }
        if (!AUTOTASKTABS.state.ticketLinksEnabled) return;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                AUTOTASKTABS.setTicketLinksEnabled(true);
            }, { once: true });
            return;
        }
        AUTOTASKTABS.setTicketLinksEnabled(true);
    };

})();


// Autotask Tabs - shared shell module registry
(function () {
    'use strict';

    const AUTOTASKTABS = window.__AUTOTASKTABS__;
    if (!AUTOTASKTABS) return;

    /**
     * Purpose: shared shell module registry for the no-build AUTOTASKTABS runtime.
     * Owns: cross-file shell runtime state containers and module registration.
     * Must not own: tab behavior, settings UI, route metadata, or DOM rendering.
     * Companion files: autotasktabs-shell-config.js, autotasktabs-shell-styles.js, autotasktabs-shell.js.
     * Verify: scripts/verify-extension-sources.sh after changing loaded runtime files.
     */
    const runtime = AUTOTASKTABS.ShellRuntime || (AUTOTASKTABS.ShellRuntime = {});
    runtime.modules = runtime.modules || [];

    AUTOTASKTABS.registerShellModule = function registerShellModule(name, factory) {
        if (typeof factory !== 'function') return;
        runtime.modules.push({ name: String(name || 'anonymous-shell-module'), factory });
    };

    AUTOTASKTABS.runShellModules = function runShellModules(context) {
        runtime.modules.forEach(function (module) {
            try { module.factory(context || runtime); }
            catch (e) { console.warn('AUTOTASKTABS shell module failed:', module.name, e); }
        });
    };
})();


// Autotask Tabs - tab metadata customization constants
(function () {
    'use strict';

    const AUTOTASKTABS = window.__AUTOTASKTABS__;
    if (!AUTOTASKTABS) return;

    /**
     * Purpose: tab metadata customization constants for the AUTOTASKTABS shell.
     * Owns: customizable tab types, line field options, defaults, labels, and icons.
     * Must not own: extraction logic, settings modal layout, storage, or rendering.
     * Companion files: autotasktabs-shell.js and autotasktabs-iframe-bridge.js when adding tab metadata.
     * Verify: scripts/verify-extension-sources.sh after changing tab types or metadata fields.
     */
    const runtime = AUTOTASKTABS.ShellRuntime || (AUTOTASKTABS.ShellRuntime = {});

const CUSTOMIZABLE_TAB_TYPES = [
    'ticket', 'ticketactivity', 'servicecall', 'knowledgebase', 'account', 'person', 'device', 'note', 'opportunity',
    'salesorder', 'quote', 'contract', 'umbrellacontract', 'invoice', 'product', 'project', 'projecttask', 'timesheet',
    'inventory', 'purchaseorder', 'charge', 'group', 'unknown',
];
const CUSTOM_FIELD_OPTIONS = [
    { value: 'type', label: 'Type' },
    { value: 'secondaryTitle', label: 'Secondary title' },
    { value: 'id', label: 'ID' },
    { value: 'number', label: 'Number' },
    { value: 'ticketTitle', label: 'Ticket title' },
    { value: 'project', label: 'Project' },
    { value: 'organization', label: 'Organization' },
    { value: 'vendor', label: 'Vendor' },
    { value: 'externalPoNumber', label: 'External P.O. #' },
    { value: 'accountManager', label: 'Account Manager' },
    { value: 'contact', label: 'Contact' },
    { value: 'status', label: 'Status' },
    { value: 'priority', label: 'Priority' },
    { value: 'lastActivity', label: 'Last activity' },
    { value: 'serialNumber', label: 'Serial number' },
    { value: 'opportunity', label: 'Opportunity' },
    { value: 'quoteName', label: 'Quote name' },
    { value: 'date', label: 'Date' },
    { value: 'primaryResource', label: 'Primary resource' },
    { value: 'contractType', label: 'Contract Type' },
    { value: 'contractCategory', label: 'Contract Category' },
    { value: 'purchaseOrderNumber', label: 'Purchase Order Number' },
    { value: 'purchaseOrder', label: 'Purchase Order' },
    { value: 'productCategory', label: 'Product category' },
    { value: 'deviceType', label: 'Device type' },
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'model', label: 'Model' },
    { value: 'internalIp', label: 'Internal IP' },
    { value: 'antivirusStatus', label: 'Antivirus status' },
    { value: 'patchStatus', label: 'Patch status' },
    { value: 'none', label: 'Nothing' },
];
function getCustomizationFieldOptionLabel(type, value) {
    if (type === 'account' && value === 'organization') return 'Classification';
    const option = CUSTOM_FIELD_OPTIONS.find(function (fieldOption) { return fieldOption.value === value; });
    return option ? option.label : value;
}
const TAB_LINE_OPTIONS_BY_TYPE = {
    ticket: ['type', 'number', 'organization', 'contact', 'status', 'priority', 'lastActivity', 'primaryResource', 'none'],
    ticketactivity: ['type', 'number', 'ticketTitle', 'organization', 'none'],
    servicecall: ['type', 'id', 'organization', 'contact', 'primaryResource', 'none'],
    knowledgebase: ['type', 'id', 'number', 'organization', 'none'],
    account: ['type', 'id', 'organization', 'none'],
    person: ['type', 'id', 'organization', 'none'],
    device: ['type', 'organization', 'serialNumber', 'deviceType', 'manufacturer', 'model', 'internalIp', 'antivirusStatus', 'patchStatus', 'none'],
    note: ['type', 'opportunity', 'organization', 'none'],
    opportunity: ['type', 'id', 'organization', 'primaryResource', 'none'],
    salesorder: ['type', 'id', 'organization', 'none'],
    purchaseorder: ['type', 'id', 'externalPoNumber', 'vendor', 'organization', 'none'],
    quote: ['type', 'id', 'quoteName', 'organization', 'none'],
    contract: ['type', 'id', 'contractType', 'contractCategory', 'purchaseOrderNumber', 'organization', 'none'],
    umbrellacontract: ['type', 'organization', 'accountManager', 'contact', 'none'],
    invoice: ['type', 'id', 'purchaseOrder', 'organization', 'none'],
    product: ['type', 'productCategory', 'none'],
    project: ['type', 'id', 'organization', 'none'],
    projecttask: ['type', 'number', 'project', 'organization', 'contact', 'status', 'priority', 'lastActivity', 'primaryResource', 'none'],
    calendar: ['type', 'none'],
    administration: ['type', 'id', 'none'],
    unknown: ['type', 'secondaryTitle', 'none'],
    timesheet: ['type', 'date', 'contact', 'none'],
    inventory: ['type', 'number', 'id', 'organization', 'none'],
    charge: ['type', 'id', 'number', 'organization', 'contact', 'primaryResource', 'none'],
    group: ['type', 'id', 'none'],
    authorizationfailure: ['type', 'none'],
};
const TAB_LINE_DEFAULT_BY_TYPE = {
    ticket: { line2: 'organization', line3: 'contact' },
    ticketactivity: { line2: 'ticketTitle', line3: 'organization' },
    servicecall: { line2: 'id', line3: 'organization' },
    knowledgebase: { line2: 'number', line3: 'type' },
    account: { line2: 'organization', line3: 'none' },
    person: { line2: 'id', line3: 'organization' },
    device: { line2: 'model', line3: 'organization' },
    note: { line2: 'organization', line3: 'none' },
    opportunity: { line2: 'id', line3: 'organization' },
    salesorder: { line2: 'id', line3: 'organization' },
    purchaseorder: { line2: 'vendor', line3: 'externalPoNumber' },
    quote: { line2: 'id', line3: 'quoteName' },
    contract: { line2: 'contractType', line3: 'organization' },
    umbrellacontract: { line2: 'type', line3: 'organization' },
    invoice: { line2: 'purchaseOrder', line3: 'organization' },
    product: { line2: 'productCategory', line3: 'type' },
    project: { line2: 'id', line3: 'organization' },
    projecttask: { line2: 'project', line3: 'contact' },
    calendar: { line2: 'none', line3: 'none' },
    administration: { line2: 'id', line3: 'type' },
    unknown: { line2: 'secondaryTitle', line3: 'type' },
    timesheet: { line2: 'date', line3: 'contact' },
    inventory: { line2: 'id', line3: 'organization' },
    charge: { line2: 'id', line3: 'organization' },
    group: { line2: 'none', line3: 'none' },
    authorizationfailure: { line2: 'none', line3: 'none' },
};
const TAB_LINE_RECOMMENDED_BY_TYPE = {
    ticket: { line2: 'organization', line3: 'contact' },
    ticketactivity: { line2: 'ticketTitle', line3: 'organization' },
    servicecall: { line2: 'id', line3: 'organization' },
    knowledgebase: { line2: 'number', line3: 'type' },
    account: { line2: 'organization', line3: 'none' },
    person: { line2: 'id', line3: 'organization' },
    device: { line2: 'model', line3: 'organization' },
    note: { line2: 'organization', line3: 'none' },
    opportunity: { line2: 'id', line3: 'organization' },
    salesorder: { line2: 'id', line3: 'organization' },
    purchaseorder: { line2: 'vendor', line3: 'externalPoNumber' },
    quote: { line2: 'id', line3: 'quoteName' },
    contract: { line2: 'contractType', line3: 'organization' },
    umbrellacontract: { line2: 'type', line3: 'organization' },
    invoice: { line2: 'purchaseOrder', line3: 'organization' },
    product: { line2: 'productCategory', line3: 'type' },
    project: { line2: 'id', line3: 'organization' },
    projecttask: { line2: 'project', line3: 'contact' },
    calendar: { line2: 'none', line3: 'none' },
    administration: { line2: 'id', line3: 'type' },
    unknown: { line2: 'secondaryTitle', line3: 'type' },
    timesheet: { line2: 'date', line3: 'contact' },
    inventory: { line2: 'id', line3: 'organization' },
    charge: { line2: 'id', line3: 'organization' },
    group: { line2: 'none', line3: 'none' },
    authorizationfailure: { line2: 'none', line3: 'none' },
};
const TAB_TYPE_LABELS = {
    ticket: 'Ticket',
    ticketactivity: 'Notes and Time Entries',
    servicecall: 'Service Call',
    knowledgebase: 'Knowledge Base',
    account: 'Organization',
    person: 'Person',
    device: 'Device',
    note: 'Note',
    opportunity: 'Opportunity',
    salesorder: 'Sales Order',
    purchaseorder: 'Purchase Order',
    quote: 'Quote',
    contract: 'Contract',
    umbrellacontract: 'Umbrella Contracts',
    invoice: 'Invoice',
    product: 'Inventory Product',
    project: 'Project',
    projecttask: 'Task',
    calendar: 'Calendar',
    administration: 'Admin',
    unknown: 'Unknown',
    timesheet: 'Timesheet',
    inventory: 'Inventory',
    charge: 'Charge',
    group: 'Group',
    authorizationfailure: 'Access Denied',
};
const CUSTOMIZATION_TAB_TYPE_ICONS = {
    ticket: '<span class="fa-ticket fa-regular" aria-hidden="true"></span>',
    ticketactivity: '<span class="fa-note-sticky fa-regular" aria-hidden="true"></span>',
    servicecall: '<span class="fa-headset fa-regular" aria-hidden="true"></span>',
    knowledgebase: '<span class="fa-book fa-regular" aria-hidden="true"></span>',
    account: '<span class="fa-building fa-regular" aria-hidden="true"></span>',
    person: '<span class="fa-address-book fa-regular" aria-hidden="true"></span>',
    device: '<span class="fa-laptop-mobile fa-regular" aria-hidden="true"></span>',
    note: '<span class="fa-laptop-mobile fa-regular" aria-hidden="true"></span>',
    opportunity: '<span class="fa-lightbulb fa-regular" aria-hidden="true"></span>',
    salesorder: '<span class="fa-cash-register fa-regular" aria-hidden="true"></span>',
    purchaseorder: '<span class="fa-receipt fa-regular flex justify-center items-center flex-shrink-0 w-1rem h-1rem override-$icon-override-font-size:font-size-3 line-height-5 override-$icon-override-color:color-icon-primary" aria-hidden="true"></span>',
    quote: '<span class="fa-file-invoice-dollar fa-regular" aria-hidden="true"></span>',
    contract: '<span class="fa-file-contract fa-regular" aria-hidden="true"></span>',
    umbrellacontract: '<span class="fa-umbrella fa-regular" aria-hidden="true"></span>',
    invoice: '<span class="fa-file-invoice fa-regular" aria-hidden="true"></span>',
    product: '<span class="fa-box-open fa-regular" aria-hidden="true"></span>',
    project: '<span class="fa-folder fa-regular" aria-hidden="true"></span>',
    projecttask: '<span class="fa-folder-tree fa-regular" aria-hidden="true"></span>',
    calendar: '<span class="fa-calendar-lines fa-regular" aria-hidden="true"></span>',
    administration: '<span class="fa-gear fa-regular" aria-hidden="true"></span>',
    timesheet: '<span class="fa-clock-five fa-regular" aria-hidden="true"></span>',
    inventory: '<span class="fa-boxes-stacked fa-regular" aria-hidden="true"></span>',
    charge: '<span class="fa-file-plus-minus fa-regular" aria-hidden="true"></span>',
    group: '<span class="fa-users fa-regular" aria-hidden="true"></span>',
    authorizationfailure: '<span class="fa-lock fa-regular" aria-hidden="true"></span>',
};

    runtime.config = {
        CUSTOMIZABLE_TAB_TYPES,
        CUSTOM_FIELD_OPTIONS,
        getCustomizationFieldOptionLabel,
        TAB_LINE_OPTIONS_BY_TYPE,
        TAB_LINE_DEFAULT_BY_TYPE,
        TAB_LINE_RECOMMENDED_BY_TYPE,
        TAB_TYPE_LABELS,
        CUSTOMIZATION_TAB_TYPE_ICONS,
    };
})();


// Autotask Tabs - shell CSS payload
(function () {
    'use strict';

    const AUTOTASKTABS = window.__AUTOTASKTABS__;
    if (!AUTOTASKTABS) return;

    /**
     * Purpose: CSS payload for the AUTOTASKTABS top-level shell.
     * Owns: tab bar, settings modal, Peek, split view, hover card, and frame styling CSS.
     * Must not own: JavaScript behavior, settings state, or metadata extraction.
     * Companion files: autotasktabs-shell.js for selectors and DOM structure.
     * Verify: smoke test Chrome/Safari styling after changing selectors here.
     */
    const runtime = AUTOTASKTABS.ShellRuntime || (AUTOTASKTABS.ShellRuntime = {});
    runtime.styles = runtime.styles || {};
    runtime.styles.shell = `
            :root {
                /* Concrete fallback so removing the inline override on
                   <html> (when the user clicks the locked default preset)
                   doesn't leave var(--autotasktabs-accent-color) as the
                   guaranteed-invalid value, which made shell rules using
                   it collapse to transparent / initial. Visually that
                   was harmless in dark mode but in light mode showed up
                   as full-white blocks where there used to be branded
                   chips. */
                --autotasktabs-accent-color: #376A94;
                --autotasktabs-accent-color-muted: rgba(55, 106, 148, 0.58);
                --autotasktabs-accent-color-strong: rgba(55, 106, 148, 0.72);
                --autotasktabs-accent-color-soft: rgba(125, 167, 201, 0.5);
                --autotasktabs-accent-link-color: var(--autotasktabs-accent-color);
                --autotasktabs-accent-active-bg: rgba(55, 106, 148, 0.15);
                --autotasktabs-accent-scrollbar: rgba(125, 167, 201, 0.5);
                --autotasktabs-accent-scrollbar-hover: rgba(125, 167, 201, 0.75);
                --autotasktabs-accent-scrollbar-dark: rgba(125, 167, 201, 0.58);
                --autotasktabs-accent-scrollbar-dark-hover: rgba(125, 167, 201, 0.82);
                --autotasktabs-native-font-family: Roboto, Arial, Helvetica, Tahoma, sans-serif;
                --autotasktabs-native-bg-primary: #ffffff;
                --autotasktabs-native-bg-hover: #f8fafc;
                --autotasktabs-native-active-bg: var(--autotasktabs-accent-active-bg);
                --autotasktabs-native-border-primary: #e2e8f0;
                --autotasktabs-native-text-primary: #0f172a;
                --autotasktabs-native-text-secondary: #64748b;
            }
            html.autotasktabs-dark {
                --autotasktabs-native-bg-primary: oklab(0.250993 -0.00167877 -0.0103094);
                --autotasktabs-native-bg-hover: #232d37;
                --autotasktabs-native-active-bg: var(--autotasktabs-accent-active-bg);
                --autotasktabs-native-border-primary: oklab(0.427889 -0.00534959 -0.0187726);
                --autotasktabs-native-text-primary: oklab(0.96395 -0.000229597 -0.00284386);
                --autotasktabs-native-text-secondary: #cbd5e1;
            }
            .at-tabs-bar {
                position: fixed;
                top: 56px;
                left: 240px;
                width: 686px;
                height: 65px;
                display: flex;
                align-items: stretch;
                padding: 0;
                background: var(--autotasktabs-native-bg-primary);
                border-bottom: 1px solid var(--autotasktabs-native-border-primary);
                overflow: hidden;
                z-index: 220;
                font-family: var(--autotasktabs-native-font-family);
                box-sizing: border-box;
            }
            .at-tabs-bar.compact.hover-expanded {
                width: var(--autotasktabs-expanded-bar-width, 240px) !important;
                box-shadow: 8px 0 24px rgba(15, 23, 42, 0.16);
            }
            html.autotasktabs-bar-vertical.autotasktabs-resizable-tabs .at-tabs-bar.compact {
                transition: width 180ms ease, box-shadow 180ms ease;
            }
            .at-tabs-resize-handle {
                position: absolute;
                top: 0;
                right: 0;
                bottom: 0;
                width: 18px;
                display: none;
                cursor: ew-resize;
                z-index: 8;
                background: transparent;
            }
            .at-tabs-resize-handle::after {
                content: "";
                position: absolute;
                top: 10px;
                right: 2px;
                bottom: 10px;
                width: 2px;
                border-radius: 999px;
                background: transparent;
            }
            .at-tabs-resize-handle:hover::after,
            .at-tabs-bar.resizing .at-tabs-resize-handle::after {
                background: var(--autotasktabs-accent-color-muted);
            }
            html.autotasktabs-bar-vertical.autotasktabs-resizable-tabs .at-tabs-resize-handle {
                display: block;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar.compact.hover-expanded .at-tabs-resize-handle,
            html.autotasktabs-bar-vertical .at-tabs-bar.compact.resizing .at-tabs-resize-handle {
                right: 0;
                width: 18px;
            }
            .at-tabs-scroll-wrap {
                position: relative;
                min-width: 0;
                flex: 1 1 auto;
                height: 100%;
            }
            .at-tabs-scroll {
                height: 100%;
                width: 100%;
                overflow-x: auto;
                overflow-y: hidden;
                -ms-overflow-style: none;
                scrollbar-color: transparent transparent;
                scrollbar-width: none;
                scroll-behavior: smooth;
            }
            .at-tabs-scroll::-webkit-scrollbar {
                width: 0;
                height: 0;
                display: none;
            }
            .at-tabs-scroll::-webkit-scrollbar-track {
                background: transparent;
            }
            .at-tabs-scroll::-webkit-scrollbar-thumb {
                background: rgba(71, 85, 105, 0.34);
                border-radius: 999px;
            }
            .at-tabs-scroll::-webkit-scrollbar-thumb:hover {
                background: var(--autotasktabs-accent-color-muted);
            }
            .at-tabs-bar-inner {
                display: flex;
                align-items: stretch;
                min-width: max-content;
                height: 100%;
                padding-right: 34px;
            }
            .at-tabs-scroll-button {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 28px;
                height: 32px;
                border: 1px solid #dbe3ec;
                border-radius: 16px;
                background: rgba(255, 255, 255, 0.94);
                color: #475569;
                display: none;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                z-index: 2;
                box-shadow: 0 6px 16px rgba(15, 23, 42, 0.12);
            }
            .at-tabs-scroll-button.visible {
                display: inline-flex;
            }
            .at-tabs-scroll-button:hover {
                background: #f8fafc;
                color: #0f172a;
            }
            .at-tabs-scroll-button.left {
                left: 6px;
            }
            .at-tabs-scroll-button.right {
                right: 6px;
            }
            .at-tabs-scroll-button svg {
                width: 15px;
                height: 15px;
                display: block;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tabs-scroll-button {
                width: 22px;
                height: 24px;
                border-radius: 12px;
                box-shadow: 0 4px 10px rgba(15, 23, 42, 0.14);
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tabs-scroll-button.left {
                left: 4px;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tabs-scroll-button.right {
                right: 4px;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tabs-scroll-button svg {
                width: 12px;
                height: 12px;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tabs-bar-inner {
                padding-right: 28px;
            }
            .at-tabs-viewport {
                position: fixed;
                top: 93px;
                left: 240px;
                width: 686px;
                bottom: 0;
                background: #fff;
                z-index: 219;
            }
            .at-tabs-home-cover {
                position: fixed;
                top: 56px;
                left: 240px;
                width: 686px;
                height: 65px;
                background: #ffffff;
                border-bottom: 1px solid #e2e8f0;
                z-index: 218;
                pointer-events: auto;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tabs-bar,
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tabs-home-cover {
                height: 32px;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tab {
                padding-top: 4px;
                padding-bottom: 4px;
                min-height: 32px;
            }
            html.autotasktabs-compact-tabs .at-tab {
                align-items: center;
            }
            html.autotasktabs-compact-tabs .at-tab .meta {
                gap: 0;
            }
            html.autotasktabs-compact-tabs .at-tab .line.number,
            html.autotasktabs-compact-tabs .at-tab .line.contact {
                display: none !important;
            }
            html.autotasktabs-compact-tabs .at-tab .line.title {
                font-weight: 400;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tab .icon {
                width: 16px;
                height: 16px;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tab .icon :is(svg, span, i) {
                width: 16px;
                height: 16px;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tab .tab-actions {
                flex-direction: row;
                align-items: center;
                justify-content: center;
                gap: 4px;
                padding-top: 0;
            }
            html.autotasktabs-compact-tabs .at-tab .tab-actions {
                flex-direction: row;
                align-items: center;
                justify-content: center;
                gap: 4px;
                padding-top: 0;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tab .line.title {
                -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 18px), transparent);
                mask-image: linear-gradient(to right, #000 calc(100% - 18px), transparent);
            }
            html.autotasktabs-compact-tabs .at-tab .tab-actions .resource-badge,
            html.autotasktabs-compact-tabs .at-tab .tab-actions .tab-warning-badge {
                order: 1;
            }
            html.autotasktabs-compact-tabs .at-tab .tab-actions .close {
                order: 2;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tab .resource-badge,
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tab .tab-warning-badge {
                width: 20px;
                height: 20px;
                min-width: 20px;
                min-height: 20px;
                flex: 0 0 20px;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tab .tab-warning-badge svg {
                width: 12px;
                height: 12px;
            }
            .at-tabs-viewport.empty { display: none; }
            .at-tabs-shell-hidden .at-tabs-bar,
            .at-tabs-shell-hidden .at-tabs-viewport,
            .at-tabs-shell-hidden .at-tabs-home-cover {
                display: none !important;
            }
            .at-tabs-viewport > iframe {
                position: absolute;
                inset: 0;
                width: 100%;
                height: 100%;
                border: 0;
            }
            .at-tabs-pane-loader {
                position: absolute;
                inset: 0;
                z-index: 3;
                display: none;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.72);
                border-radius: 10px;
                pointer-events: none;
            }
            .at-tabs-pane-loader.show { display: flex; }
            html.autotasktabs-safari-webkit .at-tabs-viewport,
            html.autotasktabs-safari-webkit .at-tabs-viewport > iframe {
                transform: none !important;
            }
            .at-tabs-viewport > iframe.hidden {
                visibility: hidden;
                pointer-events: auto;
            }
            .at-tabs-viewport.rounded-pages:not(.split) > iframe.hidden {
                inset: 8px;
                width: calc(100% - 16px);
                height: calc(100% - 16px);
            }
            .at-tabs-pane-loader.hidden {
                display: none !important;
            }
            .at-tabs-viewport.rounded-pages:not(.split) > iframe:not(.hidden),
            .at-tabs-viewport.rounded-pages:not(.split) > .at-tabs-pane-loader:not(.hidden) {
                inset: 8px;
                width: calc(100% - 16px);
                height: calc(100% - 16px);
                border-radius: 10px;
                box-sizing: border-box;
            }
            .at-tabs-viewport.rounded-pages:not(.split) > iframe:not(.hidden) {
                border: 1px solid rgba(55, 106, 148, 0.24);
                box-shadow: 0 14px 34px rgba(15, 23, 42, 0.22);
                background: #ffffff;
                color-scheme: light;
            }
            .at-tabs-viewport.rounded-pages:not(.split) {
                background: #f6f7f8;
            }
            .at-tabs-viewport.split {
                --at-tabs-split-gap: 26px;
                --at-tabs-split-left: 50%;
                --at-tabs-split-b1: 33.33%;
                --at-tabs-split-b2: 66.67%;
                --at-tabs-split-b3: 75%;
                background: #f6f7f8;
            }
            .at-tabs-viewport.split > iframe,
            .at-tabs-viewport.split > .at-tabs-pane-loader {
                inset: auto;
                top: 8px;
                bottom: 8px;
                height: calc(100% - 16px);
            }
            .at-tabs-viewport.split > iframe {
                border: 1px solid rgba(55, 106, 148, 0.24);
                border-radius: 10px;
                box-shadow: 0 14px 34px rgba(15, 23, 42, 0.22);
                background: #ffffff;
                color-scheme: light;
                box-sizing: border-box;
                overflow: hidden;
            }
            .at-tabs-viewport.split > iframe.left-pane,
            .at-tabs-viewport.split > .at-tabs-pane-loader.left-pane {
                left: 8px;
                right: auto;
                width: calc(var(--at-tabs-split-left) - (var(--at-tabs-split-gap) / 2) - 8px);
            }
            .at-tabs-viewport.split > iframe.right-pane,
            .at-tabs-viewport.split > .at-tabs-pane-loader.right-pane {
                left: auto;
                right: 8px;
                width: calc(100% - var(--at-tabs-split-left) - (var(--at-tabs-split-gap) / 2) - 8px);
            }
            .at-tabs-viewport.split.split-count-3 > iframe,
            .at-tabs-viewport.split.split-count-4 > iframe,
            .at-tabs-viewport.split.split-count-3 > .at-tabs-pane-loader,
            .at-tabs-viewport.split.split-count-4 > .at-tabs-pane-loader {
                top: 8px;
                bottom: 8px;
                height: calc(100% - 16px);
            }
            .at-tabs-viewport.split.split-count-3 > iframe.split-pane-index-0,
            .at-tabs-viewport.split.split-count-3 > .at-tabs-pane-loader.split-pane-index-0,
            .at-tabs-viewport.split.split-count-4 > iframe.split-pane-index-0,
            .at-tabs-viewport.split.split-count-4 > .at-tabs-pane-loader.split-pane-index-0 {
                left: 8px;
                right: auto;
            }
            .at-tabs-viewport.split.split-count-3 > iframe.split-pane-index-1,
            .at-tabs-viewport.split.split-count-3 > .at-tabs-pane-loader.split-pane-index-1 {
                left: calc(var(--at-tabs-split-b1) + (var(--at-tabs-split-gap) / 2));
                right: auto;
            }
            .at-tabs-viewport.split.split-count-3 > iframe.split-pane-index-2,
            .at-tabs-viewport.split.split-count-3 > .at-tabs-pane-loader.split-pane-index-2 {
                left: calc(var(--at-tabs-split-b2) + (var(--at-tabs-split-gap) / 2));
                right: 8px;
            }
            .at-tabs-viewport.split.split-count-3 > iframe.split-pane-index-0,
            .at-tabs-viewport.split.split-count-3 > .at-tabs-pane-loader.split-pane-index-0 {
                width: calc(var(--at-tabs-split-b1) - (var(--at-tabs-split-gap) / 2) - 8px);
            }
            .at-tabs-viewport.split.split-count-3 > iframe.split-pane-index-1,
            .at-tabs-viewport.split.split-count-3 > .at-tabs-pane-loader.split-pane-index-1 {
                width: calc(var(--at-tabs-split-b2) - var(--at-tabs-split-b1) - var(--at-tabs-split-gap));
            }
            .at-tabs-viewport.split.split-count-3 > iframe.split-pane-index-2,
            .at-tabs-viewport.split.split-count-3 > .at-tabs-pane-loader.split-pane-index-2 {
                width: calc(100% - var(--at-tabs-split-b2) - (var(--at-tabs-split-gap) / 2) - 8px);
            }
            .at-tabs-viewport.split.split-count-4 > iframe.split-pane-index-1,
            .at-tabs-viewport.split.split-count-4 > .at-tabs-pane-loader.split-pane-index-1 {
                left: calc(var(--at-tabs-split-b1) + (var(--at-tabs-split-gap) / 2));
                right: auto;
            }
            .at-tabs-viewport.split.split-count-4 > iframe.split-pane-index-2,
            .at-tabs-viewport.split.split-count-4 > .at-tabs-pane-loader.split-pane-index-2 {
                left: calc(var(--at-tabs-split-b2) + (var(--at-tabs-split-gap) / 2));
                right: auto;
            }
            .at-tabs-viewport.split.split-count-4 > iframe.split-pane-index-3,
            .at-tabs-viewport.split.split-count-4 > .at-tabs-pane-loader.split-pane-index-3 {
                left: calc(var(--at-tabs-split-b3) + (var(--at-tabs-split-gap) / 2));
                right: 8px;
            }
            .at-tabs-viewport.split.split-count-4 > iframe.split-pane-index-0,
            .at-tabs-viewport.split.split-count-4 > .at-tabs-pane-loader.split-pane-index-0 {
                width: calc(var(--at-tabs-split-b1) - (var(--at-tabs-split-gap) / 2) - 8px);
            }
            .at-tabs-viewport.split.split-count-4 > iframe.split-pane-index-1,
            .at-tabs-viewport.split.split-count-4 > .at-tabs-pane-loader.split-pane-index-1 {
                width: calc(var(--at-tabs-split-b2) - var(--at-tabs-split-b1) - var(--at-tabs-split-gap));
            }
            .at-tabs-viewport.split.split-count-4 > iframe.split-pane-index-2,
            .at-tabs-viewport.split.split-count-4 > .at-tabs-pane-loader.split-pane-index-2 {
                width: calc(var(--at-tabs-split-b3) - var(--at-tabs-split-b2) - var(--at-tabs-split-gap));
            }
            .at-tabs-viewport.split.split-count-4 > iframe.split-pane-index-3,
            .at-tabs-viewport.split.split-count-4 > .at-tabs-pane-loader.split-pane-index-3 {
                width: calc(100% - var(--at-tabs-split-b3) - (var(--at-tabs-split-gap) / 2) - 8px);
            }
            .at-tabs-split-resize-handle {
                display: none;
                position: absolute;
                top: 8px;
                bottom: 8px;
                left: calc(var(--at-tabs-split-left, 50%) - 17px);
                width: 34px;
                z-index: 4;
                align-items: center;
                justify-content: center;
                border-radius: 999px;
                pointer-events: none;
            }
            .at-tabs-split-resize-grip {
                width: 17px;
                height: 68px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 999px;
                cursor: col-resize;
                touch-action: none;
                pointer-events: auto;
            }
            .at-tabs-viewport.split.split-count-2 > .at-tabs-split-resize-handle[data-split-handle="0"] {
                display: flex;
            }
            .at-tabs-viewport.split.split-count-3 > .at-tabs-split-resize-handle[data-split-handle="0"],
            .at-tabs-viewport.split.split-count-4 > .at-tabs-split-resize-handle[data-split-handle="0"] {
                display: flex;
                left: calc(var(--at-tabs-split-b1) - 17px);
            }
            .at-tabs-viewport.split.split-count-3 > .at-tabs-split-resize-handle[data-split-handle="1"],
            .at-tabs-viewport.split.split-count-4 > .at-tabs-split-resize-handle[data-split-handle="1"] {
                display: flex;
                left: calc(var(--at-tabs-split-b2) - 17px);
            }
            .at-tabs-viewport.split.split-count-4 > .at-tabs-split-resize-handle[data-split-handle="2"] {
                display: flex;
                left: calc(var(--at-tabs-split-b3) - 17px);
            }
            .at-tabs-split-resize-grip::before {
                content: "";
                width: 5px;
                height: 56px;
                border-radius: 999px;
                background: var(--autotasktabs-accent-color-strong);
                box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.72), 0 8px 22px rgba(15, 23, 42, 0.22);
                transition: width 0.16s ease, background 0.16s ease;
            }
            .at-tabs-split-resize-grip:hover::before,
            .at-tabs-viewport.split-resizing .at-tabs-split-resize-grip::before {
                width: 7px;
                background: var(--autotasktabs-accent-color);
            }
            .at-tabs-viewport.split-resizing {
                cursor: col-resize;
                user-select: none;
            }
            .at-tabs-viewport.split-resizing::after {
                content: "";
                position: absolute;
                inset: 0;
                z-index: 3;
                cursor: col-resize;
                background: transparent;
            }
            .at-tabs-viewport.split > iframe.primary-pane {
                border-color: color-mix(in srgb, var(--autotasktabs-accent-color) 68%, white 32%);
                box-shadow:
                    0 0 0 2px color-mix(in srgb, var(--autotasktabs-accent-color) 30%, transparent),
                    0 14px 34px rgba(15, 23, 42, 0.18);
            }
            .at-tabs-split-frame-controls {
                position: absolute;
                top: 30px;
                z-index: 7;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                opacity: 0;
                transform: translate(3px, -4px);
                pointer-events: none;
                transition: opacity 160ms ease, transform 160ms ease;
            }
            .at-tabs-split-frame-controls.hidden {
                display: none;
            }
            .at-tabs-viewport.split > iframe.split-pane-index-0:hover ~ .at-tabs-split-frame-controls.split-controls-index-0,
            .at-tabs-viewport.split > iframe.split-pane-index-1:hover ~ .at-tabs-split-frame-controls.split-controls-index-1,
            .at-tabs-viewport.split > iframe.split-pane-index-2:hover ~ .at-tabs-split-frame-controls.split-controls-index-2,
            .at-tabs-viewport.split > iframe.split-pane-index-3:hover ~ .at-tabs-split-frame-controls.split-controls-index-3,
            .at-tabs-viewport.split > .at-tabs-pane-loader.split-pane-index-0:hover ~ .at-tabs-split-frame-controls.split-controls-index-0,
            .at-tabs-viewport.split > .at-tabs-pane-loader.split-pane-index-1:hover ~ .at-tabs-split-frame-controls.split-controls-index-1,
            .at-tabs-viewport.split > .at-tabs-pane-loader.split-pane-index-2:hover ~ .at-tabs-split-frame-controls.split-controls-index-2,
            .at-tabs-viewport.split > .at-tabs-pane-loader.split-pane-index-3:hover ~ .at-tabs-split-frame-controls.split-controls-index-3,
            .at-tabs-split-frame-controls:hover,
            .at-tabs-split-frame-controls:focus-within {
                opacity: 1;
                transform: translate(3px, 0);
                pointer-events: auto;
            }
            .at-tabs-split-frame-controls.split-controls-count-2.split-controls-index-0 {
                right: calc(100% - var(--at-tabs-split-left, 50%) + (var(--at-tabs-split-gap) / 2) - 12px);
            }
            .at-tabs-split-frame-controls.split-controls-count-2.split-controls-index-1,
            .at-tabs-split-frame-controls.split-controls-count-3.split-controls-index-2,
            .at-tabs-split-frame-controls.split-controls-count-4.split-controls-index-3 {
                right: 2px;
            }
            .at-tabs-split-frame-controls.split-controls-count-3.split-controls-index-0,
            .at-tabs-split-frame-controls.split-controls-count-4.split-controls-index-0 {
                right: calc(100% - var(--at-tabs-split-b1) + (var(--at-tabs-split-gap) / 2) - 12px);
            }
            .at-tabs-split-frame-controls.split-controls-count-3.split-controls-index-1,
            .at-tabs-split-frame-controls.split-controls-count-4.split-controls-index-1 {
                right: calc(100% - var(--at-tabs-split-b2) + (var(--at-tabs-split-gap) / 2) - 12px);
            }
            .at-tabs-split-frame-controls.split-controls-count-4.split-controls-index-2 {
                right: calc(100% - var(--at-tabs-split-b3) + (var(--at-tabs-split-gap) / 2) - 12px);
            }
            .at-tabs-split-frame-button {
                width: 28px;
                height: 28px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                border: 0;
                border-radius: 999px;
                background: rgba(255, 255, 255, 0.94);
                color: #0f172a;
                cursor: pointer;
                box-shadow: 0 4px 14px rgba(15, 23, 42, 0.22);
                transition: background 120ms ease, color 120ms ease, transform 80ms ease;
            }
            .at-tabs-split-frame-button:hover,
            .at-tabs-split-frame-button:focus-visible {
                background: #ffffff;
                color: #0f172a;
                transform: translateY(-1px);
                outline: none;
            }
            .at-tabs-split-frame-button.close:hover,
            .at-tabs-split-frame-button.close:focus-visible {
                color: #dc2626;
            }
            .at-tabs-split-frame-close-icon::before,
            .at-tabs-split-frame-close-icon::after {
                content: "";
                position: absolute;
                left: 1px;
                top: 6px;
                width: 12px;
                height: 2px;
                border-radius: 999px;
                background: currentColor;
            }
            .at-tabs-split-frame-close-icon,
            .at-tabs-split-frame-detach-icon {
                position: relative;
                width: 14px;
                height: 14px;
                display: block;
            }
            .at-tabs-split-frame-close-icon::before {
                transform: rotate(45deg);
            }
            .at-tabs-split-frame-close-icon::after {
                transform: rotate(-45deg);
            }
            .at-tabs-split-frame-detach-icon::before {
                content: "";
                position: absolute;
                left: 1px;
                bottom: 1px;
                width: 9px;
                height: 9px;
                border: 2px solid currentColor;
                border-radius: 2px;
            }
            .at-tabs-split-frame-detach-icon::after {
                content: "";
                position: absolute;
                right: 0;
                top: 0;
                width: 7px;
                height: 7px;
                border-top: 2px solid currentColor;
                border-right: 2px solid currentColor;
            }
            .at-tabs-viewport:not(.split-resizing) > iframe,
            .at-tabs-viewport:not(.split-resizing) > .at-tabs-pane-loader {
                transition:
                    left 180ms ease,
                    right 180ms ease,
                    width 180ms ease,
                    top 180ms ease,
                    bottom 180ms ease,
                    transform 180ms ease,
                    opacity 160ms ease;
            }
            .at-tabs-drag-split-indicator {
                position: absolute;
                inset: 0;
                z-index: 8;
                opacity: 0;
                pointer-events: none;
                transition: opacity 160ms ease;
            }
            .at-tabs-drag-split-indicator.is-armed {
                pointer-events: auto;
            }
            .at-tabs-drag-split-indicator.is-visible {
                opacity: 1;
            }
            .at-tabs-drag-split-indicator::before {
                content: "";
                position: absolute;
                inset: 0;
                background: rgba(15, 23, 42, 0.08);
                pointer-events: none;
            }
            .at-tabs-viewport.drag-split-preview > iframe.drag-split-preview-member,
            .at-tabs-viewport.drag-split-preview > .at-tabs-pane-loader.drag-split-preview-member,
            .at-tabs-drag-split-pane {
                position: absolute !important;
                top: 8px !important;
                bottom: 8px !important;
                left: var(--autotasktabs-drag-preview-left, 8px) !important;
                right: auto !important;
                width: var(--autotasktabs-drag-preview-width, calc(50% - 14px)) !important;
                height: calc(100% - 16px) !important;
            }
            .at-tabs-drag-split-pane {
                border: 2px solid color-mix(in srgb, var(--autotasktabs-accent-color) 82%, white 18%);
                border-radius: 14px;
                background:
                    linear-gradient(135deg, color-mix(in srgb, var(--autotasktabs-accent-color) 18%, transparent), color-mix(in srgb, var(--autotasktabs-accent-color) 8%, transparent)),
                    rgba(255, 255, 255, 0.58);
                box-shadow:
                    0 16px 38px rgba(15, 23, 42, 0.18),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.55);
                opacity: 0.96;
                transform: scale(0.985);
                transition:
                    left 180ms ease,
                    width 180ms ease,
                    transform 180ms ease,
                    opacity 160ms ease;
                pointer-events: none;
            }
            .at-tabs-drag-split-indicator.is-visible .at-tabs-drag-split-pane {
                transform: scale(1);
            }
            .at-tabs-viewport.drag-split-preview-count-2 > iframe.drag-split-preview-index-0,
            .at-tabs-viewport.drag-split-preview-count-2 > .at-tabs-pane-loader.drag-split-preview-index-0,
            .at-tabs-viewport.drag-split-preview-count-2 .at-tabs-drag-split-pane.drag-split-preview-index-0 {
                left: 8px;
                width: calc(50% - (var(--at-tabs-split-gap) / 2) - 8px);
            }
            .at-tabs-viewport.drag-split-preview-count-2 > iframe.drag-split-preview-index-1,
            .at-tabs-viewport.drag-split-preview-count-2 > .at-tabs-pane-loader.drag-split-preview-index-1,
            .at-tabs-viewport.drag-split-preview-count-2 .at-tabs-drag-split-pane.drag-split-preview-index-1 {
                left: calc(50% + (var(--at-tabs-split-gap) / 2));
                width: calc(50% - (var(--at-tabs-split-gap) / 2) - 8px);
            }
            .at-tabs-viewport.drag-split-preview-count-3 > iframe.drag-split-preview-index-0,
            .at-tabs-viewport.drag-split-preview-count-3 > .at-tabs-pane-loader.drag-split-preview-index-0,
            .at-tabs-viewport.drag-split-preview-count-3 .at-tabs-drag-split-pane.drag-split-preview-index-0 {
                left: 8px;
                width: calc(33.333% - (var(--at-tabs-split-gap) / 2) - 8px);
            }
            .at-tabs-viewport.drag-split-preview-count-3 > iframe.drag-split-preview-index-1,
            .at-tabs-viewport.drag-split-preview-count-3 > .at-tabs-pane-loader.drag-split-preview-index-1,
            .at-tabs-viewport.drag-split-preview-count-3 .at-tabs-drag-split-pane.drag-split-preview-index-1 {
                left: calc(33.333% + (var(--at-tabs-split-gap) / 2));
                width: calc(33.334% - var(--at-tabs-split-gap));
            }
            .at-tabs-viewport.drag-split-preview-count-3 > iframe.drag-split-preview-index-2,
            .at-tabs-viewport.drag-split-preview-count-3 > .at-tabs-pane-loader.drag-split-preview-index-2,
            .at-tabs-viewport.drag-split-preview-count-3 .at-tabs-drag-split-pane.drag-split-preview-index-2 {
                left: calc(66.667% + (var(--at-tabs-split-gap) / 2));
                width: calc(33.333% - (var(--at-tabs-split-gap) / 2) - 8px);
            }
            .at-tabs-viewport.drag-split-preview-count-4 > iframe.drag-split-preview-index-0,
            .at-tabs-viewport.drag-split-preview-count-4 > .at-tabs-pane-loader.drag-split-preview-index-0,
            .at-tabs-viewport.drag-split-preview-count-4 .at-tabs-drag-split-pane.drag-split-preview-index-0 {
                left: 8px;
                width: calc(25% - (var(--at-tabs-split-gap) / 2) - 8px);
            }
            .at-tabs-viewport.drag-split-preview-count-4 > iframe.drag-split-preview-index-1,
            .at-tabs-viewport.drag-split-preview-count-4 > .at-tabs-pane-loader.drag-split-preview-index-1,
            .at-tabs-viewport.drag-split-preview-count-4 .at-tabs-drag-split-pane.drag-split-preview-index-1 {
                left: calc(25% + (var(--at-tabs-split-gap) / 2));
                width: calc(25% - var(--at-tabs-split-gap));
            }
            .at-tabs-viewport.drag-split-preview-count-4 > iframe.drag-split-preview-index-2,
            .at-tabs-viewport.drag-split-preview-count-4 > .at-tabs-pane-loader.drag-split-preview-index-2,
            .at-tabs-viewport.drag-split-preview-count-4 .at-tabs-drag-split-pane.drag-split-preview-index-2 {
                left: calc(50% + (var(--at-tabs-split-gap) / 2));
                width: calc(25% - var(--at-tabs-split-gap));
            }
            .at-tabs-viewport.drag-split-preview-count-4 > iframe.drag-split-preview-index-3,
            .at-tabs-viewport.drag-split-preview-count-4 > .at-tabs-pane-loader.drag-split-preview-index-3,
            .at-tabs-viewport.drag-split-preview-count-4 .at-tabs-drag-split-pane.drag-split-preview-index-3 {
                left: calc(75% + (var(--at-tabs-split-gap) / 2));
                width: calc(25% - (var(--at-tabs-split-gap) / 2) - 8px);
            }
            .at-tabs-drag-split-pane::after {
                content: attr(data-label);
                position: absolute;
                top: 14px;
                left: 14px;
                padding: 5px 10px;
                border-radius: 999px;
                background: var(--autotasktabs-accent-color);
                color: #fff;
                font-size: 12px;
                font-weight: 800;
                letter-spacing: 0.02em;
                box-shadow: 0 8px 20px color-mix(in srgb, var(--autotasktabs-accent-color) 28%, transparent);
            }
            .at-tabs-loader {
                position: absolute;
                inset: 0;
                z-index: 2;
                display: none;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.85);
                pointer-events: none;
            }
            .at-tabs-loader.show { display: flex; }
            .at-tabs-loader::before,
            .at-tabs-pane-loader::before {
                content: "";
                width: 36px;
                height: 36px;
                border: 3px solid #cbd5e1;
                border-top-color: var(--autotasktabs-accent-color);
                border-radius: 50%;
                animation: at-tabs-spin 0.8s linear infinite;
            }
            @keyframes at-tabs-spin { to { transform: rotate(360deg); } }
            @keyframes autotasktabs-backdrop-in {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes autotasktabs-backdrop-out {
                from { opacity: 1; }
                to { opacity: 0; }
            }
            @keyframes autotasktabs-settings-in {
                from {
                    opacity: 0;
                    transform: translate(-50%, calc(-50% + 14px)) scale(0.975);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            @keyframes autotasktabs-settings-out {
                from {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, calc(-50% + 12px)) scale(0.982);
                }
            }
            @keyframes autotasktabs-peek-wrapper-in {
                from {
                    opacity: 0;
                    transform: translate(-50%, calc(-50% + 18px)) scale(0.976);
                }
                to {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
            }
            @keyframes autotasktabs-peek-wrapper-out {
                from {
                    opacity: 1;
                    transform: translate(-50%, -50%) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translate(-50%, calc(-50% + 14px)) scale(0.982);
                }
            }
            @keyframes autotasktabs-peek-live-in {
                from {
                    opacity: 0;
                    transform: translateY(18px) scale(0.976);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }
            @keyframes autotasktabs-peek-live-out {
                from {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
                to {
                    opacity: 0;
                    transform: translateY(14px) scale(0.982);
                }
            }
            @media (prefers-reduced-motion: reduce) {
                .at-tabs-settings-backdrop,
                .at-tabs-settings-modal,
                .at-tabs-peek-backdrop,
                .at-tabs-peek-wrapper,
                .at-tabs-drag-split-indicator,
                .at-tabs-drag-split-pane,
                .at-tabs-viewport.peek-active {
                    animation: none !important;
                    transition: none !important;
                }
            }

            /* ============================================================
               Custom scrollbars for Autotask documents and injected frames.
               These intentionally use normal specificity + !important so
               legacy Autotask grids and nested pages do not bring back the
               oversized native scrollbars. ================================
            */
            html.autotasktabs-improved-scrollbars,
            html.autotasktabs-improved-scrollbars body,
            html.autotasktabs-improved-scrollbars * {
                scrollbar-color: var(--autotasktabs-accent-scrollbar) transparent !important;
                scrollbar-width: thin !important;
                scrollbar-gutter: auto !important;
            }
            html.autotasktabs-improved-scrollbars::-webkit-scrollbar,
            html.autotasktabs-improved-scrollbars body::-webkit-scrollbar,
            html.autotasktabs-improved-scrollbars *::-webkit-scrollbar {
                background: transparent !important;
                background-color: transparent !important;
                width: 4px !important;
                height: 4px !important;
            }
            html.autotasktabs-improved-scrollbars::-webkit-scrollbar-track,
            html.autotasktabs-improved-scrollbars body::-webkit-scrollbar-track,
            html.autotasktabs-improved-scrollbars *::-webkit-scrollbar-track {
                background: transparent !important;
                background-color: transparent !important;
                border: 0 !important;
                box-shadow: none !important;
            }
            html.autotasktabs-improved-scrollbars::-webkit-scrollbar-track-piece,
            html.autotasktabs-improved-scrollbars body::-webkit-scrollbar-track-piece,
            html.autotasktabs-improved-scrollbars *::-webkit-scrollbar-track-piece {
                background: transparent !important;
                background-color: transparent !important;
                border: 0 !important;
                box-shadow: none !important;
            }
            html.autotasktabs-improved-scrollbars::-webkit-scrollbar-thumb,
            html.autotasktabs-improved-scrollbars body::-webkit-scrollbar-thumb,
            html.autotasktabs-improved-scrollbars *::-webkit-scrollbar-thumb {
                background-color: var(--autotasktabs-accent-scrollbar) !important;
                border-radius: 999px !important;
                border: 1px solid transparent !important;
                background-clip: content-box !important;
            }
            html.autotasktabs-improved-scrollbars::-webkit-scrollbar-thumb:hover,
            html.autotasktabs-improved-scrollbars body::-webkit-scrollbar-thumb:hover,
            html.autotasktabs-improved-scrollbars *::-webkit-scrollbar-thumb:hover {
                background-color: var(--autotasktabs-accent-scrollbar-hover) !important;
                background-clip: content-box !important;
            }
            html.autotasktabs-improved-scrollbars::-webkit-scrollbar-corner,
            html.autotasktabs-improved-scrollbars body::-webkit-scrollbar-corner,
            html.autotasktabs-improved-scrollbars *::-webkit-scrollbar-corner {
                background: transparent !important;
                background-color: transparent !important;
            }
            html.autotasktabs-improved-scrollbars::-webkit-scrollbar-button,
            html.autotasktabs-improved-scrollbars body::-webkit-scrollbar-button,
            html.autotasktabs-improved-scrollbars *::-webkit-scrollbar-button,
            html.autotasktabs-improved-scrollbars::-webkit-resizer,
            html.autotasktabs-improved-scrollbars body::-webkit-resizer,
            html.autotasktabs-improved-scrollbars *::-webkit-resizer {
                display: none !important;
                background: transparent !important;
                background-color: transparent !important;
                width: 0 !important;
                height: 0 !important;
            }
            html.autotasktabs-improved-scrollbars .at-tabs-scroll {
                scrollbar-color: transparent transparent !important;
                scrollbar-width: none !important;
            }
            html.autotasktabs-improved-scrollbars.autotasktabs-dark {
                scrollbar-color: var(--autotasktabs-accent-scrollbar-dark) #11161c !important;
            }
            html.autotasktabs-improved-scrollbars.autotasktabs-dark::-webkit-scrollbar-track,
            html.autotasktabs-improved-scrollbars.autotasktabs-dark body::-webkit-scrollbar-track,
            html.autotasktabs-improved-scrollbars.autotasktabs-dark *::-webkit-scrollbar-track {
                background: transparent !important;
            }
            html.autotasktabs-improved-scrollbars.autotasktabs-dark::-webkit-scrollbar-thumb,
            html.autotasktabs-improved-scrollbars.autotasktabs-dark body::-webkit-scrollbar-thumb,
            html.autotasktabs-improved-scrollbars.autotasktabs-dark *::-webkit-scrollbar-thumb {
                background-color: var(--autotasktabs-accent-scrollbar-dark) !important;
                border-color: #11161c !important;
            }
            html.autotasktabs-improved-scrollbars.autotasktabs-dark::-webkit-scrollbar-thumb:hover,
            html.autotasktabs-improved-scrollbars.autotasktabs-dark body::-webkit-scrollbar-thumb:hover,
            html.autotasktabs-improved-scrollbars.autotasktabs-dark *::-webkit-scrollbar-thumb:hover {
                background-color: var(--autotasktabs-accent-scrollbar-dark-hover) !important;
            }
            html.autotasktabs-improved-scrollbars.autotasktabs-dark::-webkit-scrollbar-corner,
            html.autotasktabs-improved-scrollbars.autotasktabs-dark body::-webkit-scrollbar-corner,
            html.autotasktabs-improved-scrollbars.autotasktabs-dark *::-webkit-scrollbar-corner {
                background: transparent !important;
            }
            .at-tab {
                display: inline-flex;
                align-items: stretch;
                gap: 8px;
                width: 230px;
                padding: 6px 10px;
                background: transparent;
                border: none;
                border-bottom: 3px solid transparent;
                color: var(--autotasktabs-native-text-primary);
                cursor: pointer;
                user-select: none;
                position: relative;
                flex: 0 0 auto;
                box-sizing: border-box;
                font-size: 11px;
                line-height: 1.25;
                --autotasktabs-tab-border: transparent;
                --autotasktabs-tab-bg-idle: transparent;
                --autotasktabs-tab-bg-hover: var(--autotasktabs-native-bg-hover);
                --autotasktabs-tab-bg-active: var(--autotasktabs-native-active-bg);
                --autotasktabs-tab-separator: var(--autotasktabs-native-border-primary);
            }
            .at-tab:hover { background: var(--autotasktabs-tab-bg-hover); }
            html:not(.autotasktabs-bar-vertical) .at-tab + .at-tab::before {
                content: "";
                position: absolute;
                left: 0;
                top: 14px;
                bottom: 14px;
                width: 1px;
                background: var(--autotasktabs-tab-separator);
                z-index: 4;
                pointer-events: none;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tab + .at-tab::before {
                top: 8px;
                bottom: 8px;
            }
            .at-tab.active::before,
            .at-tab.active + .at-tab::before {
                display: none;
            }
            .at-tab.active {
                background: var(--autotasktabs-tab-bg-active);
                border-bottom-color: var(--autotasktabs-accent-color);
                color: var(--autotasktabs-native-text-primary);
            }
            .at-tab.active:not([data-autotasktabs-colored="true"]),
            .at-tab[data-autotasktabs-colored="false"].active {
                color: var(--autotasktabs-native-text-primary);
            }
            .at-tab[data-autotasktabs-colored="true"] {
                background: var(--autotasktabs-tab-bg-idle);
                border-bottom-color: transparent;
            }
            .at-tab[data-autotasktabs-colored="true"]:hover {
                background: var(--autotasktabs-tab-bg-hover);
            }
            .at-tab[data-autotasktabs-colored="true"].active {
                background: var(--autotasktabs-tab-bg-active);
                border-bottom-color: var(--autotasktabs-tab-border);
            }
            .at-tab.split-target {
                box-shadow: inset 0 -3px 0 var(--autotasktabs-accent-color-soft);
            }
            .at-tab.split-member + .at-tab.split-member::before {
                display: none;
            }
            .at-tab.dragging {
                opacity: 0.46;
            }
            .at-tab.drop-before::after,
            .at-tab.drop-after::after {
                content: "";
                position: absolute;
                top: 8px;
                bottom: 8px;
                width: 3px;
                border-radius: 999px;
                background: var(--autotasktabs-accent-color);
                z-index: 2;
            }
            .at-tab.drop-before::after {
                left: -1px;
            }
            .at-tab.drop-after::after {
                right: -1px;
            }
            .at-tab .icon {
                flex: 0 0 auto;
                width: 18px;
                height: 18px;
                align-self: center;
                color: #475569;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            .at-tab.active .icon { color: #0f172a; }
            .at-tab.active:not([data-autotasktabs-colored="true"]) .icon,
            .at-tab[data-autotasktabs-colored="false"].active .icon {
                color: #0f172a;
            }
            .at-tab .icon :is(svg, span, i) {
                width: 18px;
                height: 18px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            .at-tab .meta {
                display: flex;
                flex-direction: column;
                justify-content: center;
                min-width: 0;
                flex: 1 1 auto;
                gap: 1px;
                padding-right: 0;
                transition: padding-right 120ms ease;
            }
            .at-tab:not(.home):hover .meta,
            .at-tab:not(.home):focus-within .meta,
            .at-tab:not(.home).active .meta,
            .at-tab:not(.home):has(.resource-badge.visible) .meta,
            .at-tab:not(.home):has(.tab-warning-badge.visible) .meta {
                padding-right: 28px;
            }
            .at-tab:not(.home):hover:has(.resource-badge.visible) .meta,
            .at-tab:not(.home):focus-within:has(.resource-badge.visible) .meta,
            .at-tab:not(.home).active:has(.resource-badge.visible) .meta,
            .at-tab:not(.home):hover:has(.tab-warning-badge.visible) .meta,
            .at-tab:not(.home):focus-within:has(.tab-warning-badge.visible) .meta,
            .at-tab:not(.home).active:has(.tab-warning-badge.visible) .meta {
                padding-right: 54px;
            }
            .at-tab .line {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .at-tab .line.title {
                font-weight: 600;
                font-size: 12px;
                color: inherit;
                text-overflow: clip;
                -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 18px), transparent);
                mask-image: linear-gradient(to right, #000 calc(100% - 18px), transparent);
            }
            .at-tab:not(.home):hover .line.title,
            .at-tab:not(.home):focus-within .line.title,
            .at-tab:not(.home).active .line.title,
            .at-tab:not(.home):has(.resource-badge.visible) .line.title,
            .at-tab:not(.home):has(.tab-warning-badge.visible) .line.title {
                -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 38px), transparent);
                mask-image: linear-gradient(to right, #000 calc(100% - 38px), transparent);
            }
            .at-tab:not(.home):hover:has(.resource-badge.visible) .line.title,
            .at-tab:not(.home):focus-within:has(.resource-badge.visible) .line.title,
            .at-tab:not(.home).active:has(.resource-badge.visible) .line.title,
            .at-tab:not(.home):hover:has(.tab-warning-badge.visible) .line.title,
            .at-tab:not(.home):focus-within:has(.tab-warning-badge.visible) .line.title,
            .at-tab:not(.home).active:has(.tab-warning-badge.visible) .line.title {
                -webkit-mask-image: linear-gradient(to right, #000 calc(100% - 38px), transparent);
                mask-image: linear-gradient(to right, #000 calc(100% - 38px), transparent);
            }
            .at-tab .line.title.loading {
                display: inline-flex;
                align-items: center;
                min-height: 16px;
                -webkit-mask-image: none;
                mask-image: none;
            }
            .at-tab-title-spinner {
                width: 14px;
                height: 14px;
                border: 2px solid #cbd5e1;
                border-top-color: var(--autotasktabs-accent-color);
                border-radius: 50%;
                animation: at-tabs-spin 0.8s linear infinite;
                flex: 0 0 auto;
            }
            .at-tab .line.number,
            .at-tab .line.contact {
                color: var(--autotasktabs-native-text-secondary);
                font-size: 10.5px;
            }
            .at-tab .line.number {
                font-variant-numeric: tabular-nums;
            }
            .at-tab.active .line.title { color: #0f172a; }
            .at-tab.active:not([data-autotasktabs-colored="true"]) .line.title,
            .at-tab[data-autotasktabs-colored="false"].active .line.title,
            .at-tab.active:not([data-autotasktabs-colored="true"]) .line.number,
            .at-tab[data-autotasktabs-colored="false"].active .line.number,
            .at-tab.active:not([data-autotasktabs-colored="true"]) .line.contact,
            .at-tab[data-autotasktabs-colored="false"].active .line.contact {
                color: #0f172a;
            }
            .at-tab .pin-badge {
                position: absolute;
                top: 5px;
                left: 6px;
                width: 11px;
                height: 11px;
                color: var(--autotasktabs-accent-color);
                display: none;
                pointer-events: none;
                z-index: 1;
            }
            .at-tab .pin-badge :is(svg, span, i) {
                width: 11px;
                height: 11px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            .at-tab.pinned .pin-badge {
                display: block;
            }
            .at-tab.active .pin-badge {
                color: #64748b;
            }
            .at-tab[data-autotasktabs-colored="true"].active,
            .at-tab[data-autotasktabs-colored="true"].active .icon,
            .at-tab[data-autotasktabs-colored="true"].active .line.title,
            .at-tab[data-autotasktabs-colored="true"].active .line.number,
            .at-tab[data-autotasktabs-colored="true"].active .line.contact,
            .at-tab[data-autotasktabs-colored="true"].active .pin-badge {
                color: #0f172a;
            }
            .at-tab .close {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 18px;
                height: 18px;
                border-radius: 4px;
                color: #64748b;
                font-size: 14px;
                line-height: 1;
                flex: 0 0 auto;
                opacity: 0;
                visibility: hidden;
                pointer-events: none;
                transition: opacity 120ms ease, background-color 120ms ease, color 120ms ease;
            }
            .at-tab:hover .close,
            .at-tab:focus-within .close,
            .at-tab.active .close {
                opacity: 1;
                visibility: visible;
                pointer-events: auto;
            }
            .at-tab .close:hover { background: #e2e8f0; color: #0f172a; }
            .at-tab .tab-actions {
                display: flex;
                position: absolute;
                top: 50%;
                right: 7px;
                transform: translateY(-50%);
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 5px;
                padding-top: 0;
                box-sizing: border-box;
                z-index: 3;
                pointer-events: none;
            }
            .at-tab .tab-actions > * {
                pointer-events: auto;
            }
            .at-tab .resource-badge {
                display: none;
                align-items: center;
                justify-content: center;
                width: 22px;
                height: 22px;
                min-width: 22px;
                min-height: 22px;
                border-radius: 50%;
                border: 1px solid rgba(15, 23, 42, 0.16);
                background: #64748b;
                color: #ffffff;
                box-sizing: border-box;
                font-size: 9px;
                font-weight: 700;
                letter-spacing: 0.01em;
                line-height: 1;
                overflow: hidden;
                text-transform: uppercase;
                white-space: nowrap;
            }
            .at-tab .resource-badge.visible {
                display: inline-flex;
            }
            .at-tab .resource-badge.has-photo {
                background-position: center;
                background-size: cover;
                color: transparent;
                text-shadow: none;
            }
            .at-tab .tab-warning-badge {
                display: none;
                align-items: center;
                justify-content: center;
                width: 22px;
                height: 22px;
                min-width: 22px;
                min-height: 22px;
                border-radius: 50%;
                border: 1px solid rgba(127, 29, 29, 0.22);
                background: #dc2626;
                color: #ffffff;
                box-sizing: border-box;
                box-shadow: 0 2px 6px rgba(127, 29, 29, 0.24);
                line-height: 1;
            }
            .at-tab .tab-warning-badge.contract-warning {
                color: #b7791f !important;
                background: rgba(245, 158, 11, 0.1) !important;
                border-color: rgba(245, 158, 11, 0.2) !important;
                box-shadow: inset 0 0 0 1px rgba(245, 158, 11, 0.1) !important;
            }
            .at-tab .tab-warning-badge.product-inactive-warning {
                color: #64748b !important;
                background: rgba(100, 116, 139, 0.10) !important;
                border-color: rgba(100, 116, 139, 0.24) !important;
                box-shadow: inset 0 0 0 1px rgba(100, 116, 139, 0.10) !important;
            }
            .at-tab .tab-warning-badge.visible {
                display: inline-flex;
            }
            .at-tab .tab-warning-badge svg {
                width: 13px;
                height: 13px;
                display: block;
            }
            .at-tab.home {
                width: 230px;
                padding: 6px 10px;
                gap: 8px;
                align-items: center;
                font-size: 12px;
                font-weight: 500;
            }
            html.autotasktabs-compact-tabs:not(.autotasktabs-bar-vertical) .at-tab.home {
                padding-top: 4px;
                padding-bottom: 4px;
                min-height: 32px;
            }
            .at-tab.home .close { display: none; }
            .at-tab.home .home-umbrella-info {
                display: none;
                width: 18px;
                height: 18px;
                align-items: center;
                justify-content: center;
                flex: 0 0 auto;
                align-self: flex-start;
                margin-top: 2px;
                border-radius: 4px;
                color: #f59e0b;
                font-size: 13px;
                line-height: 1;
                cursor: help;
                pointer-events: auto;
            }
            .at-tab.home .home-umbrella-info:hover {
                background: rgba(245, 158, 11, 0.14);
                color: #d97706;
            }
            .at-tab.home.umbrella-contract .home-umbrella-info {
                display: inline-flex;
            }
            .at-tabs-umbrella-info-tooltip {
                position: fixed;
                z-index: 1460;
                max-width: 320px;
                padding: 9px 11px;
                border: 1px solid #fdba74;
                border-radius: 9px;
                background: #fff7ed;
                color: #7c2d12;
                box-shadow: 0 12px 28px rgba(15, 23, 42, 0.2);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
                font-size: 12px;
                font-weight: 500;
                line-height: 1.4;
                pointer-events: none;
                opacity: 0;
                transform: translateY(-2px);
                transition: opacity 90ms ease, transform 90ms ease;
            }
            .at-tabs-umbrella-info-tooltip.visible {
                opacity: 1;
                transform: translateY(0);
            }
            .at-tab.home .home-spinner {
                display: none;
                width: 14px;
                height: 14px;
                border: 2px solid #cbd5e1;
                border-top-color: var(--autotasktabs-accent-color);
                border-radius: 50%;
                animation: at-tabs-spin 0.8s linear infinite;
                flex: 0 0 auto;
                align-self: center;
            }
            .at-tab.home.loading .icon { display: none; }
            .at-tab.home.loading .home-spinner { display: inline-block; }
            .at-tab.home.loading .home-meta { display: none; }
            .at-tabs-spacer {
                flex: 1 1 auto;
                min-width: 18px;
            }
            .at-tabs-settings-button {
                display: grid;
                place-items: center;
                width: 52px;
                height: 100%;
                border: none;
                border-left: 1px solid #e2e8f0;
                border-right: 1px solid #e2e8f0;
                background: #ffffff;
                color: #475569;
                cursor: pointer;
                flex: 0 0 auto;
                padding: 0;
                appearance: none;
                -webkit-appearance: none;
            }
            .at-tabs-settings-button:hover {
                background: #f8fafc;
                color: #0f172a;
            }
            .at-tabs-settings-button :is(svg, span, i) {
                width: 18px;
                height: 18px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                margin: 0;
            }
            .at-tabs-bar-actions {
                display: flex;
                align-items: center;
                justify-content: center;
                flex: 0 0 auto;
                z-index: 12;
            }
            .at-tabs-collapse-button,
            .at-tabs-reopen-button {
                display: none;
                align-items: center;
                justify-content: center;
                border: none;
                background: var(--autotasktabs-native-bg-primary);
                color: var(--autotasktabs-native-text-secondary);
                cursor: pointer;
                padding: 0;
                appearance: none;
                -webkit-appearance: none;
                flex: 0 0 auto;
            }
            .at-tabs-collapse-button:hover,
            .at-tabs-reopen-button:hover:not(:disabled) {
                background: var(--autotasktabs-native-bg-hover);
                color: var(--autotasktabs-native-text-primary);
            }
            .at-tabs-reopen-button:disabled {
                cursor: default;
                opacity: 0.42;
            }
            .at-tabs-collapse-button :is(svg, span, i),
            .at-tabs-reopen-button :is(svg, span, i) {
                width: 16px;
                height: 16px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                transition: transform 160ms ease;
            }
            .at-tabs-collapse-button.collapsed :is(svg, span, i) {
                transform: rotate(180deg);
            }
            html:not(.autotasktabs-bar-vertical) .at-tabs-bar-actions {
                position: relative;
                width: 44px;
                height: 100%;
                border-left: 1px solid var(--autotasktabs-native-border-primary);
                background: var(--autotasktabs-native-bg-primary);
            }
            html:not(.autotasktabs-bar-vertical) .at-tabs-scroll-wrap {
                box-sizing: border-box;
            }
            html:not(.autotasktabs-bar-vertical) .at-tabs-reopen-button {
                display: flex;
                width: 100%;
                height: 100%;
                border-radius: 0;
                border: none;
                box-shadow: none;
            }
            .at-tabs-context-menu {
                position: fixed;
                min-width: 232px;
                padding: 6px;
                border: 1px solid #dbe3ec;
                border-radius: 12px;
                background: #ffffff;
                box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
                color: #0f172a;
                z-index: 1500;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
                box-sizing: border-box;
            }
            .at-tabs-closed-tabs-menu {
                width: min(360px, calc(100vw - 16px));
                max-height: min(420px, calc(100vh - 16px));
                overflow: auto;
            }
            .at-tabs-context-divider {
                height: 1px;
                margin: 6px 4px;
                background: #e2e8f0;
            }
            .at-tabs-context-item {
                width: 100%;
                display: flex;
                align-items: center;
                gap: 9px;
                padding: 9px 10px;
                border: 0;
                border-radius: 9px;
                background: transparent;
                color: inherit;
                cursor: pointer;
                text-align: left;
                font: inherit;
                font-size: 12px;
                font-weight: 600;
                line-height: 1.25;
                position: relative;
            }
            .at-tabs-context-item:hover {
                background: color-mix(in srgb, var(--autotasktabs-accent-color) 14%, transparent);
                color: var(--autotasktabs-accent-color);
            }
            .at-tabs-context-label {
                flex: 1 1 auto;
                min-width: 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .at-tabs-context-submenu-arrow {
                color: var(--autotasktabs-accent-color);
                flex: 0 0 auto;
                font-size: 15px;
                line-height: 1;
                margin-left: 12px;
            }
            .at-tabs-context-submenu-trigger {
                position: relative;
            }
            .at-tabs-context-submenu {
                position: absolute;
                top: -6px;
                left: calc(100% + 6px);
                display: none;
                width: 188px;
                padding: 8px;
                border: 1px solid #dbe3ec;
                border-radius: 12px;
                background: #ffffff;
                box-shadow: 0 16px 40px rgba(15, 23, 42, 0.18);
                color: #0f172a;
                box-sizing: border-box;
            }
            .at-tabs-context-submenu.open-left {
                left: auto;
                right: calc(100% + 6px);
            }
            .at-tabs-context-submenu-trigger:hover > .at-tabs-context-submenu,
            .at-tabs-context-submenu-trigger:focus-within > .at-tabs-context-submenu {
                display: block;
            }
            .at-tabs-context-item:disabled {
                cursor: not-allowed;
                color: #94a3b8;
                background: transparent;
            }
            .at-tabs-context-icon {
                width: 16px;
                height: 16px;
                flex: 0 0 auto;
                color: var(--autotasktabs-accent-color);
            }
            .at-tabs-context-item:disabled .at-tabs-context-icon {
                color: #94a3b8;
            }
            .at-tabs-context-icon :is(svg, span, i) {
                width: 16px;
                height: 16px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
            }
            .at-tabs-context-colors {
                display: grid;
                grid-template-columns: repeat(4, minmax(0, 1fr));
                gap: 8px;
                padding: 0;
            }
            .at-tabs-color-swatch {
                width: 100%;
                aspect-ratio: 1;
                border-radius: 10px;
                border: 2px solid rgba(15, 23, 42, 0.08);
                background: var(--autotasktabs-swatch);
                cursor: pointer;
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.28);
            }
            .at-tabs-color-swatch:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18), inset 0 0 0 1px rgba(255, 255, 255, 0.34);
            }
            .at-tabs-color-swatch.selected {
                border-color: #0f172a;
                box-shadow: 0 0 0 2px rgba(15, 23, 42, 0.08), inset 0 0 0 1px rgba(255, 255, 255, 0.45);
            }
            .at-tabs-settings-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(15, 23, 42, 0.16);
                z-index: 1300;
                animation: autotasktabs-backdrop-in 260ms ease-out both;
            }
            .at-tabs-settings-backdrop.closing {
                animation: autotasktabs-backdrop-out 220ms ease-in both;
            }
            .at-tabs-map-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(15, 23, 42, 0.28);
                z-index: 1400;
            }
            .at-tabs-map-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: min(980px, calc(100vw - 48px));
                height: min(680px, calc(100vh - 48px));
                background: #ffffff;
                border: 1px solid #dbe2ea;
                border-radius: 14px;
                box-shadow: 0 22px 60px rgba(15, 23, 42, 0.28);
                z-index: 1401;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
            }
            .at-tabs-map-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 12px 14px;
                border-bottom: 1px solid #e2e8f0;
                color: #0f172a;
                font-size: 14px;
                font-weight: 650;
            }
            .at-tabs-map-actions {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                flex: 0 0 auto;
            }
            .at-tabs-map-open {
                border: 1px solid #dbe3ec;
                border-radius: 8px;
                padding: 6px 10px;
                color: #25577d;
                background: #f8fafc;
                text-decoration: none;
                font-size: 12px;
                font-weight: 600;
            }
            .at-tabs-map-open:hover {
                background: #edf4fb;
                color: #12344f;
            }
            .at-tabs-map-close {
                width: 30px;
                height: 30px;
                border: 0;
                border-radius: 8px;
                background: transparent;
                color: #64748b;
                cursor: pointer;
                font-size: 22px;
                line-height: 1;
            }
            .at-tabs-map-close:hover {
                background: #f1f5f9;
                color: #0f172a;
            }
            .at-tabs-map-frame {
                width: 100%;
                height: 100%;
                border: 0;
                flex: 1 1 auto;
            }
            /* --- Peek modal: a tab's iframe shown in a centered overlay
               with a vertical button column floating to the right. --- */
            .at-tabs-peek-backdrop {
                position: fixed;
                inset: 0;
                background: rgba(15, 23, 42, 0.42);
                z-index: 1500;
                animation: autotasktabs-backdrop-in 280ms ease-out both;
            }
            .at-tabs-peek-backdrop.closing {
                animation: autotasktabs-backdrop-out 240ms ease-in both;
            }
            .at-tabs-peek-wrapper {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                display: flex;
                align-items: center;
                gap: 12px;
                z-index: 1501;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
                animation: autotasktabs-peek-wrapper-in 340ms cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            .at-tabs-peek-wrapper.closing {
                animation: autotasktabs-peek-wrapper-out 240ms cubic-bezier(0.4, 0, 1, 1) both;
            }
            .at-tabs-peek-wrapper.at-tabs-peek-positioned {
                transform: none;
                animation: none;
                align-items: stretch;
            }
            html.autotasktabs-safari-webkit .at-tabs-peek-wrapper,
            html.autotasktabs-safari-webkit .at-tabs-peek-wrapper.closing {
                animation: none !important;
                transform: translate(-50%, -50%) !important;
            }
            html.autotasktabs-safari-webkit .at-tabs-peek-wrapper.at-tabs-peek-positioned,
            html.autotasktabs-safari-webkit .at-tabs-peek-wrapper.at-tabs-peek-positioned.closing {
                animation: none !important;
                transform: none !important;
            }
            .at-tabs-peek-modal {
                position: relative;
                width: min(1430px, calc(100vw - 96px));
                height: min(1014px, calc(100vh - 48px));
                background: #ffffff;
                border: 1px solid #dbe2ea;
                border-radius: 14px;
                box-shadow: 0 30px 80px rgba(15, 23, 42, 0.42);
                overflow: hidden;
                display: flex;
                flex-direction: column;
            }
            .at-tabs-peek-drag-handle {
                position: absolute;
                top: 8px;
                left: 50%;
                transform: translateX(-50%);
                width: 112px;
                height: 22px;
                border: 1px solid rgba(148, 163, 184, 0.46);
                border-radius: 999px;
                background: rgba(248, 250, 252, 0.82);
                box-shadow: 0 8px 22px rgba(15, 23, 42, 0.14);
                cursor: move;
                z-index: 5;
                display: flex;
                align-items: center;
                justify-content: center;
                touch-action: none;
                -webkit-backdrop-filter: blur(10px);
                backdrop-filter: blur(10px);
            }
            .at-tabs-peek-drag-handle::before {
                content: "";
                width: 42px;
                height: 4px;
                border-radius: 999px;
                background: currentColor;
                color: rgba(71, 85, 105, 0.58);
                box-shadow: 0 7px 0 rgba(71, 85, 105, 0.34);
                transform: translateY(-3.5px);
            }
            .at-tabs-peek-drag-handle:hover,
            .at-tabs-peek-drag-handle:focus-visible {
                background: #ffffff;
                border-color: rgba(55, 106, 148, 0.5);
                outline: none;
            }
            .at-tabs-peek-resize-handle {
                position: absolute;
                right: 5px;
                bottom: 5px;
                width: 24px;
                height: 24px;
                border-radius: 8px;
                cursor: nwse-resize;
                z-index: 5;
                touch-action: none;
            }
            .at-tabs-peek-resize-handle::before {
                content: "";
                position: absolute;
                right: 6px;
                bottom: 6px;
                width: 11px;
                height: 11px;
                border-right: 2px solid rgba(71, 85, 105, 0.55);
                border-bottom: 2px solid rgba(71, 85, 105, 0.55);
                box-shadow: 4px 4px 0 -2px rgba(71, 85, 105, 0.32);
            }
            .at-tabs-peek-resize-handle:hover::before {
                border-color: var(--autotasktabs-brand-primary-color, #376A94);
            }
            html.autotasktabs-peek-interacting,
            html.autotasktabs-peek-interacting * {
                cursor: grabbing !important;
                user-select: none !important;
            }
            .at-tabs-peek-modal.live-reuse {
                background: transparent;
                border-color: transparent;
            }
            .at-tabs-peek-frame-wrap {
                position: relative;
                flex: 1 1 auto;
                min-width: 0;
                min-height: 0;
                overflow: hidden;
                background: #ffffff;
            }
            .at-tabs-peek-frame {
                width: 100%;
                height: 100%;
                border: 0;
                display: block;
                background: #ffffff;
            }
            .at-tabs-viewport.peek-active {
                position: fixed !important;
                display: block !important;
                overflow: hidden !important;
                background: transparent !important;
                border: 0 !important;
                border-radius: 14px !important;
                box-shadow: none !important;
                z-index: 1502 !important;
                scrollbar-gutter: auto !important;
                transform-origin: center center !important;
                animation: autotasktabs-peek-live-in 340ms cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            .at-tabs-viewport.peek-closing {
                animation: autotasktabs-peek-live-out 240ms cubic-bezier(0.4, 0, 1, 1) both !important;
            }
            html.autotasktabs-safari-webkit .at-tabs-viewport.peek-active,
            html.autotasktabs-safari-webkit .at-tabs-viewport.peek-closing {
                animation: none !important;
                transform: none !important;
            }
            .at-tabs-viewport.peek-active > iframe {
                position: absolute !important;
                inset: 0 !important;
                width: 100% !important;
                height: 100% !important;
                margin: 0 !important;
                border: 0 !important;
                background: transparent !important;
                scrollbar-gutter: auto !important;
            }
            .at-tabs-viewport.peek-active > iframe.at-tab-peeking {
                display: block !important;
                visibility: visible !important;
                opacity: 1 !important;
                pointer-events: auto !important;
                z-index: 1 !important;
            }
            .at-tabs-peek-loader {
                position: absolute;
                inset: 0;
                z-index: 2;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.85);
                pointer-events: none;
            }
            .at-tabs-peek-loader.hidden {
                display: none;
            }
            .at-tabs-peek-loader::before {
                content: "";
                width: 36px;
                height: 36px;
                border: 3px solid #cbd5e1;
                border-top-color: var(--autotasktabs-accent-color);
                border-radius: 50%;
                animation: at-tabs-spin 0.8s linear infinite;
            }
            .at-tabs-peek-actions {
                display: flex;
                flex-direction: column;
                gap: 10px;
                flex: 0 0 auto;
            }
            .at-tabs-peek-action {
                width: 44px;
                height: 44px;
                border-radius: 10px;
                border: 0;
                background: rgba(255, 255, 255, 0.92);
                color: #0f172a;
                cursor: pointer;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 14px rgba(15, 23, 42, 0.22);
                transition: background 120ms ease, color 120ms ease, transform 80ms ease;
            }
            .at-tabs-peek-action:hover {
                background: #ffffff;
                transform: translateY(-1px);
            }
            .at-tabs-peek-action:active {
                transform: translateY(0);
            }
            .at-tabs-peek-action[disabled] {
                opacity: 0.45;
                cursor: not-allowed;
                box-shadow: 0 2px 6px rgba(15, 23, 42, 0.18);
            }
            .at-tabs-peek-action.reset-position-action {
                width: 44px;
                min-width: 44px;
                padding-inline: 0;
            }
            .at-tabs-peek-action svg {
                width: 20px;
                height: 20px;
                display: block;
            }
            .at-tabs-peek-action :is(span, i) {
                width: 20px;
                height: 20px;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: 16px;
                line-height: 1;
            }
            .at-tabs-peek-action.close-action {
                font-size: 24px;
                line-height: 1;
                color: #475569;
            }
            .at-tabs-peek-action.close-action:hover {
                color: #0f172a;
            }
            .at-tabs-peek-confirm-shade {
                position: fixed;
                inset: 0;
                z-index: 1509;
                background: rgba(2, 6, 23, 0.36);
            }
            .at-tabs-peek-confirm {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                z-index: 1510;
                width: 360px;
                max-width: calc(100vw - 32px);
                padding: 18px;
                border: 1px solid #dbe2ea;
                border-radius: 14px;
                background: #ffffff;
                color: #0f172a;
                box-shadow: 0 24px 70px rgba(15, 23, 42, 0.35);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
            }
            .at-tabs-peek-confirm-title {
                margin: 0 0 14px;
                font-size: 15px;
                line-height: 1.4;
                font-weight: 700;
            }
            .at-tabs-peek-confirm-check {
                display: flex;
                align-items: center;
                gap: 9px;
                margin-bottom: 16px;
                color: #475569;
                font-size: 13px;
                user-select: none;
            }
            .at-tabs-peek-confirm-check input {
                appearance: none;
                -webkit-appearance: none;
                width: 16px;
                height: 16px;
                flex: 0 0 16px;
                margin: 0;
                border: 1.5px solid #94a3b8;
                border-radius: 4px;
                background: #ffffff;
                display: inline-grid;
                place-content: center;
                cursor: pointer;
            }
            .at-tabs-peek-confirm-check input::after {
                content: "";
                width: 8px;
                height: 5px;
                border-left: 2px solid #ffffff;
                border-bottom: 2px solid #ffffff;
                transform: rotate(-45deg) translateY(-1px);
                opacity: 0;
            }
            .at-tabs-peek-confirm-check input:checked {
                border-color: var(--autotasktabs-accent-color);
                background: var(--autotasktabs-accent-color);
            }
            .at-tabs-peek-confirm-check input:checked::after {
                opacity: 1;
            }
            .at-tabs-peek-confirm-check input:focus-visible {
                outline: 2px solid rgba(55, 106, 148, 0.35);
                outline-offset: 2px;
            }
            .at-tabs-peek-confirm-actions {
                display: flex;
                justify-content: flex-end;
                gap: 8px;
            }
            .at-tabs-peek-confirm-button {
                min-height: 34px;
                padding: 7px 12px;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                background: #ffffff;
                color: #334155;
                cursor: pointer;
                font: inherit;
                font-size: 13px;
                font-weight: 650;
            }
            .at-tabs-peek-confirm-button:hover {
                background: #f8fafc;
                color: #0f172a;
            }
            .at-tabs-peek-confirm-button.primary {
                border-color: var(--autotasktabs-accent-color);
                background: var(--autotasktabs-accent-color);
                color: #ffffff;
            }
            .at-tabs-peek-confirm-button.primary:hover {
                background: #2f5f85;
            }
            /* --- Tab hover preview card: shows tab metadata on hover-intent. --- */
            .at-tabs-hover-card {
                position: fixed;
                z-index: 1450;
                min-width: 240px;
                max-width: 360px;
                padding: 10px 12px;
                background: #ffffff;
                color: #0f172a;
                border: 1px solid #dbe2ea;
                border-radius: 10px;
                box-shadow: 0 12px 32px rgba(15, 23, 42, 0.22);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
                font-size: 12px;
                line-height: 1.45;
                pointer-events: none;
                opacity: 0;
                transform: translateY(-2px);
                transition: opacity 90ms ease, transform 90ms ease;
            }
            .at-tabs-hover-card.visible {
                pointer-events: auto;
                opacity: 1;
                transform: translateY(0);
            }
            .at-tabs-hover-card .hc-title {
                font-size: 13px;
                font-weight: 650;
                color: #0f172a;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .at-tabs-hover-card .hc-number {
                margin-top: 2px;
                font-size: 11px;
                color: #475569;
                font-variant-numeric: tabular-nums;
            }
            .at-tabs-hover-card .hc-row {
                margin-top: 6px;
                display: grid;
                grid-template-columns: minmax(92px, 112px) minmax(0, 1fr) 22px;
                align-items: center;
                column-gap: 8px;
                color: #334155;
            }
            .at-tabs-hover-card .hc-row .hc-label {
                color: #64748b;
                min-width: 0;
            }
            .at-tabs-hover-card .hc-row .hc-value {
                color: #0f172a;
                min-width: 0;
                overflow-wrap: anywhere;
                line-height: 1.35;
            }
            .at-tabs-hover-card .hc-copy {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 20px;
                height: 20px;
                border: 0;
                border-radius: 6px;
                background: transparent !important;
                color: var(--autotasktabs-accent-color) !important;
                cursor: pointer;
                justify-self: end;
                padding: 0;
                box-shadow: none;
            }
            .at-tabs-hover-card .hc-copy-placeholder {
                visibility: hidden;
                pointer-events: none;
            }
            .at-tabs-hover-card .hc-copy:hover {
                background: color-mix(in srgb, var(--autotasktabs-accent-color) 14%, transparent) !important;
                color: color-mix(in srgb, var(--autotasktabs-accent-color) 82%, #000000 18%) !important;
            }
            .at-tabs-hover-card .hc-copy .hc-copy-icon,
            .at-tabs-hover-card .hc-copy .hc-copy-icon::before,
            .at-tabs-hover-card .hc-copy i,
            .at-tabs-hover-card .hc-copy i::before,
            .at-tabs-hover-card .hc-copy svg,
            .at-tabs-hover-card .hc-copy svg * {
                font-size: 11px;
                line-height: 1;
                color: var(--autotasktabs-accent-color) !important;
                fill: currentColor !important;
                stroke: currentColor !important;
            }
            .at-tabs-hover-card .hc-copy:hover .hc-copy-icon,
            .at-tabs-hover-card .hc-copy:hover .hc-copy-icon::before,
            .at-tabs-hover-card .hc-copy:hover i,
            .at-tabs-hover-card .hc-copy:hover i::before,
            .at-tabs-hover-card .hc-copy:hover svg,
            .at-tabs-hover-card .hc-copy:hover svg * {
                color: color-mix(in srgb, var(--autotasktabs-accent-color) 82%, #000000 18%) !important;
                fill: currentColor !important;
                stroke: currentColor !important;
            }
            .at-tabs-settings-modal {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: min(1120px, calc(100vw - 40px));
                height: min(820px, calc(100vh - 40px));
                background: #ffffff;
                border: 1px solid #dbe2ea;
                border-radius: 14px;
                box-shadow: 0 18px 48px rgba(15, 23, 42, 0.18);
                z-index: 1301;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
                animation: autotasktabs-settings-in 320ms cubic-bezier(0.16, 1, 0.3, 1) both;
            }
            .at-tabs-settings-modal.closing {
                animation: autotasktabs-settings-out 220ms cubic-bezier(0.4, 0, 1, 1) both;
            }
            .at-tabs-settings-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 14px 16px;
                border-bottom: 1px solid #e2e8f0;
            }
            .at-tabs-settings-title {
                font-size: 14px;
                font-weight: 600;
                color: #0f172a;
                line-height: 1.3;
            }
            .at-tabs-settings-close {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                border: none;
                border-radius: 8px;
                background: transparent;
                color: #64748b;
                cursor: pointer;
                font-size: 18px;
                line-height: 1;
            }
            .at-tabs-settings-close:hover {
                background: #f1f5f9;
                color: #0f172a;
            }
            .at-tabs-settings-body {
                padding: 0;
                display: grid;
                grid-template-columns: 240px minmax(0, 1fr);
                min-height: 0;
                flex: 1 1 auto;
                overflow: hidden;
            }
            .at-tabs-settings-nav {
                padding: 14px;
                border-right: 1px solid #e2e8f0;
                background: #f8fafc;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }
            .at-tabs-settings-nav-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                width: 100%;
                min-height: 42px;
                padding: 10px 12px;
                border: 1px solid transparent;
                border-radius: 12px;
                background: transparent;
                color: #334155;
                cursor: pointer;
                font: inherit;
                text-align: left;
            }
            .at-tabs-settings-nav-item:hover {
                background: #ffffff;
                border-color: #e2e8f0;
                color: #0f172a;
            }
            .at-tabs-settings-nav-item.active {
                background: color-mix(in srgb, var(--autotasktabs-accent-color) 12%, var(--autotasktabs-native-bg-primary));
                border-color: color-mix(in srgb, var(--autotasktabs-accent-color) 28%, var(--autotasktabs-native-border-primary));
                color: #0f172a;
                box-shadow: inset 3px 0 0 var(--autotasktabs-accent-color);
            }
            .at-tabs-settings-nav-name {
                font-size: 13px;
                font-weight: 650;
            }
            .at-tabs-settings-nav-arrow {
                color: #94a3b8;
                font-size: 16px;
                line-height: 1;
            }
            .at-tabs-settings-pages {
                padding: 16px 18px 20px;
                min-width: 0;
                overflow: auto;
            }
            .at-tabs-settings-page {
                display: none;
                flex-direction: column;
                gap: 10px;
            }
            .at-tabs-settings-page.active {
                display: flex;
            }
            .at-tabs-settings-footer {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 12px 16px 14px;
                border-top: 1px solid #e2e8f0;
                font-size: 11px;
                line-height: 1.4;
                color: #64748b;
                text-align: left;
            }
            .at-tabs-settings-footer-actions {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: 10px;
                flex: 0 0 auto;
                flex-wrap: wrap;
            }
            .at-tabs-settings-reset {
                appearance: none;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                background: #ffffff;
                color: #334155;
                cursor: pointer;
                flex: 0 0 auto;
                font: 700 11px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
                padding: 8px 10px;
                transition: background 0.16s ease, border-color 0.16s ease, color 0.16s ease;
            }
            .at-tabs-settings-reset:hover {
                background: #f1f5f9;
                border-color: #94a3b8;
                color: #0f172a;
            }
            .at-tabs-settings-section {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            .at-tabs-settings-warning {
                padding: 11px 14px;
                border: 1px solid var(--autotasktabs-native-border-primary);
                border-left: 4px solid var(--autotasktabs-accent-color);
                border-radius: 12px;
                background: color-mix(in srgb, var(--autotasktabs-accent-color) 8%, var(--autotasktabs-native-bg-primary));
                color: var(--autotasktabs-native-text-primary);
                font-size: 12px;
                font-weight: 650;
                line-height: 1.45;
            }
            .at-tabs-settings-page-title {
                display: flex;
                flex-direction: column;
                gap: 3px;
                margin-bottom: 4px;
            }
            .at-tabs-settings-page-title.with-action {
                display: grid;
                grid-template-columns: minmax(0, 1fr) auto;
                align-items: start;
                column-gap: 14px;
            }
            .at-tabs-settings-page-title-copy {
                display: flex;
                min-width: 0;
                flex-direction: column;
                gap: 3px;
            }
            .at-tabs-settings-page-title strong {
                font-size: 16px;
                color: #0f172a;
            }
            .at-tabs-settings-page-title span {
                font-size: 12px;
                line-height: 1.4;
                color: #64748b;
            }
            .at-tabs-settings-page-action {
                appearance: none;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                background: #ffffff;
                color: #334155;
                cursor: pointer;
                font: 700 12px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
                padding: 9px 11px;
                white-space: nowrap;
            }
            .at-tabs-settings-page-action:hover {
                background: #f1f5f9;
                border-color: #94a3b8;
                color: #0f172a;
            }
            .at-tabs-settings-section-title {
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.04em;
                text-transform: uppercase;
                color: #64748b;
                padding: 2px 2px 0;
            }
            .at-tabs-setting-row {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 14px 14px;
                border-radius: 12px;
                border: 1px solid #e2e8f0;
                background: #ffffff;
            }
            .at-tabs-setting-row:hover {
                background: #f8fafc;
            }
            .at-tabs-setting-note {
                margin: -4px 4px 0;
                font-size: 11px;
                line-height: 1.4;
                color: #64748b;
            }
            .at-tabs-setting-reload-note {
                display: none;
                align-items: center;
                justify-content: space-between;
                gap: 10px;
                margin: -4px 4px 4px;
                padding: 10px 12px;
                border: 1px solid #bfdbfe;
                border-radius: 10px;
                background: #eff6ff;
                color: #1e3a5f;
                font-size: 12px;
                font-weight: 600;
                line-height: 1.4;
            }
            .at-tabs-setting-reload-note.visible {
                display: flex;
            }
            .at-tabs-settings-section > .at-tabs-setting-reload-note {
                margin: 0;
                padding: 10px 12px;
                border-radius: 12px;
                background: color-mix(in srgb, var(--autotasktabs-accent-color) 7%, var(--autotasktabs-native-bg-primary));
                border-color: color-mix(in srgb, var(--autotasktabs-accent-color) 28%, var(--autotasktabs-native-border-primary));
                color: var(--autotasktabs-native-text-primary);
            }
            .at-tabs-setting-reload-button {
                appearance: none;
                border: 1px solid var(--autotasktabs-accent-color);
                border-radius: 8px;
                background: var(--autotasktabs-accent-color);
                color: #ffffff;
                cursor: pointer;
                flex: 0 0 auto;
                font: 700 11px/1 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
                padding: 8px 10px;
            }
            .at-tabs-setting-reload-button:hover {
                background: var(--autotasktabs-accent-color-strong);
                border-color: var(--autotasktabs-accent-color-strong);
            }
            html.autotasktabs-dark .at-tabs-setting-note {
                color: #94a3b8;
            }
            html.autotasktabs-dark .at-tabs-setting-reload-note {
                background: #142333;
                border-color: #31506A;
                color: #dbeafe;
            }
            .at-tabs-setting-label {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 6px;
                min-width: 0;
            }
            .at-tabs-setting-label.has-description {
                flex-direction: column;
                align-items: flex-start;
                gap: 4px;
            }
            .at-tabs-setting-title-row {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                min-width: 0;
            }
            .at-tabs-setting-info {
                display: none !important;
                align-items: center;
                justify-content: center;
                width: 16px;
                height: 16px;
                color: #94a3b8;
                cursor: help;
                flex: 0 0 auto;
            }
            .at-tabs-setting-info:hover {
                color: #475569;
            }
            .at-tabs-setting-info svg {
                width: 14px;
                height: 14px;
                display: block;
            }
            html.autotasktabs-dark .at-tabs-setting-info {
                color: #94a3b8;
            }
            html.autotasktabs-dark .at-tabs-setting-info:hover {
                color: #f1f5f9;
            }
            .at-tabs-setting-name {
                font-size: 13px;
                font-weight: 600;
                color: #0f172a;
            }
            .at-tabs-setting-description {
                color: #64748b;
                font-size: 12px;
                line-height: 1.4;
                max-width: 34rem;
            }
            .at-tabs-setting-warning-inline {
                color: #b45309;
                font-weight: 750;
            }
            .at-tabs-setting-toggle {
                position: relative;
                display: inline-flex;
                align-items: center;
                width: 46px;
                height: 28px;
                flex: 0 0 auto;
            }
            .at-tabs-setting-toggle input {
                position: absolute;
                inset: 0;
                opacity: 0;
                margin: 0;
                cursor: pointer;
            }
            .at-tabs-setting-toggle-ui {
                position: relative;
                width: 46px;
                height: 28px;
                border-radius: 999px;
                background: #cbd5e1;
                transition: background 0.18s ease;
                box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.06);
            }
            .at-tabs-setting-toggle-ui::after {
                content: "";
                position: absolute;
                top: 3px;
                left: 3px;
                width: 22px;
                height: 22px;
                border-radius: 50%;
                background: #ffffff;
                box-shadow: 0 1px 3px rgba(15, 23, 42, 0.18);
                transition: transform 0.18s ease;
            }
            .at-tabs-setting-toggle input:checked + .at-tabs-setting-toggle-ui {
                background: var(--autotasktabs-accent-color);
            }
            .at-tabs-setting-toggle input:checked + .at-tabs-setting-toggle-ui::after {
                transform: translateX(18px);
            }
            .at-tabs-setting-toggle input:focus-visible + .at-tabs-setting-toggle-ui {
                outline: 2px solid #93c5fd;
                outline-offset: 2px;
            }
            .at-tabs-setting-color-controls {
                display: inline-flex;
                align-items: center;
                gap: 10px;
                flex: 0 0 auto;
                flex-wrap: wrap;
                justify-content: flex-end;
            }
            .at-tabs-setting-color-input {
                width: 42px;
                height: 30px;
                padding: 2px;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                background: #ffffff;
                cursor: pointer;
            }
            .at-tabs-setting-color-input:disabled {
                opacity: 0.42;
                cursor: not-allowed;
            }
            .at-tabs-setting-file-controls {
                display: inline-flex;
                align-items: center;
                justify-content: flex-end;
                gap: 10px;
                min-width: 0;
                flex: 0 1 auto;
                flex-wrap: wrap;
            }
            .at-tabs-setting-file-status {
                max-width: 150px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                color: #64748b;
                font-size: 11px;
                font-weight: 600;
            }
            .at-tabs-setting-file-input {
                position: absolute;
                width: 1px;
                height: 1px;
                opacity: 0;
                pointer-events: none;
                max-width: 1px;
                color: #334155;
                font: 600 11px/1.2 var(--autotasktabs-native-font-family);
            }
            .at-tabs-setting-small-button {
                appearance: none;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                background: #ffffff;
                color: #334155;
                cursor: pointer;
                font: 700 11px/1 var(--autotasktabs-native-font-family);
                padding: 8px 10px;
            }
            .at-tabs-setting-small-button:hover:not(:disabled) {
                border-color: var(--autotasktabs-accent-color);
                color: var(--autotasktabs-accent-color);
            }
            .at-tabs-setting-small-button:disabled {
                opacity: 0.45;
                cursor: not-allowed;
            }
            .at-tabs-settings-note {
                font-size: 12px;
                color: #64748b;
                padding: 2px 2px 0;
            }
            .at-tabs-setting-select-wrap {
                position: relative;
                display: inline-flex;
                align-items: center;
                flex: 0 0 auto;
                min-width: 140px;
            }
            .at-tabs-setting-select-wrap::after {
                content: "";
                position: absolute;
                top: 50%;
                right: 12px;
                width: 7px;
                height: 7px;
                border-right: 2px solid #64748b;
                border-bottom: 2px solid #64748b;
                transform: translateY(-65%) rotate(45deg);
                pointer-events: none;
            }
            .at-tabs-setting-select {
                appearance: none;
                -webkit-appearance: none;
                background: #ffffff;
                color: #0f172a;
                border: 1px solid #cbd5e1;
                border-radius: 8px;
                padding: 6px 30px 6px 10px;
                font: 600 12px/1.2 -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif;
                cursor: pointer;
                min-width: 140px;
                background-image: none !important;
            }
            .at-tabs-setting-select option {
                background-image: none !important;
            }
            .at-tabs-setting-select:focus-visible {
                outline: 2px solid #93c5fd;
                outline-offset: 2px;
            }
            .at-tabs-setting-line-controls {
                display: inline-flex;
                align-items: center;
                gap: 8px;
                flex: 0 0 auto;
            }
            .at-tabs-customization-row {
                display: grid;
                grid-template-columns: minmax(180px, 1fr) minmax(0, 460px);
                align-items: center;
                gap: 16px;
            }
            .at-tabs-customization-row .at-tabs-setting-line-controls {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                justify-content: stretch;
                min-width: 0;
                width: 100%;
            }
            .at-tabs-setting-line-controls .at-tabs-setting-select {
                min-width: 0;
                width: 100%;
                max-width: none;
            }
            .at-tabs-setting-line-controls .at-tabs-setting-select-wrap {
                min-width: 0;
                width: 100%;
            }
            .at-tabs-setting-line-controls.line3-disabled select[data-tab-line="2"],
            .at-tabs-setting-line-controls.line3-disabled select[data-tab-line="3"] {
                opacity: 0.48;
                cursor: not-allowed;
                background-color: #eef2f6;
            }
            .at-tabs-customization-header-lines .line3-disabled {
                opacity: 0.48;
            }
            .at-tabs-customization-header {
                display: grid;
                grid-template-columns: minmax(180px, 1fr) minmax(0, 460px);
                gap: 16px;
                padding: 0 14px 2px;
                color: #64748b;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 0.03em;
                text-transform: uppercase;
            }
            .at-tabs-customization-header-lines {
                display: grid;
                grid-template-columns: repeat(2, minmax(0, 1fr));
                gap: 8px;
            }
            .at-tabs-setting-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                color: #64748b;
                font-size: 14px;
                width: 16px;
                text-align: center;
                flex: 0 0 auto;
            }
            /* Autotask's absolutely-positioned back-chevron button. Restored,
               but lifted above the AUTOTASKTABS tab bar (z-index 220) so it floats over
               the shell instead of being obscured by it. The side-panel
               wrapper has 'position: relative; z-index: 1', which forms a
               stacking context that traps the button below the tab bar — so
               we also drop that wrapper's stacking context, but only on the
               wrappers that actually host the chevron button. */
            div.relative.z-1:has(button.absolute.border-border-primary > span.fa-chevron-left) {
                z-index: auto !important;
            }
            div.relative:has(> button.absolute.border-border-primary > span.fa-chevron-left) {
                isolation: auto !important;
            }
            button.absolute.border-border-primary:has(> span.fa-chevron-left) {
                z-index: 230 !important;
                transform: translate(-15px, -4px) !important;
            }
            .o-dropdown-container,
            .o-dropdown-panel,
            .o-popper,
            .o-popover,
            .o-menu,
            .o-menu-panel,
            .ContextOverlayContainer,
            .ContextOverlay,
            .DropDownButtonOverlay2,
            .GridContextMenu,
            .MenuColumnSet1 {
                z-index: 1302 !important;
            }

            /* ============================================================
               Dark mode — toggled via html.autotasktabs-dark when Autotask sets
               --is-theme-dark: 1 on body. User-specified palette:
                 - Tab bar background:        #1F2227
                 - Active tab background:     #232D37
                 - Active tab bottom border:  #376A94
               Other shades are derived to match. ===========================
            */
            html.autotasktabs-dark .at-tabs-bar {
                background: #1F2227;
                border-bottom-color: #2a2e34;
            }
            html.autotasktabs-dark .at-tabs-home-cover {
                background: #1F2227;
                border-bottom-color: #2a2e34;
            }
            html.autotasktabs-dark.autotasktabs-bar-vertical .at-tabs-bar {
                border-right-color: #2a2e34;
                border-bottom-color: transparent;
            }
            html.autotasktabs-dark.autotasktabs-bar-vertical .at-tabs-home-cover {
                border-right-color: #2a2e34;
                border-bottom-color: transparent;
            }
            html.autotasktabs-dark .at-tabs-viewport {
                background: #1F2227;
            }
            html.autotasktabs-dark .at-tabs-viewport.split {
                background: #11161c;
            }
            html.autotasktabs-dark .at-tabs-viewport.rounded-pages:not(.split) {
                background: #11161c;
            }
            html.autotasktabs-dark .at-tabs-viewport.split > iframe {
                border-color: rgba(125, 167, 201, 0.26);
                box-shadow: 0 10px 28px rgba(0, 0, 0, 0.34);
                background: #0f141a;
                color-scheme: light;
            }
            html.autotasktabs-dark .at-tabs-viewport.rounded-pages:not(.split) > iframe:not(.hidden) {
                border-color: rgba(125, 167, 201, 0.26);
                box-shadow: 0 10px 28px rgba(0, 0, 0, 0.34);
                background: #0f141a;
                color-scheme: light;
            }
            html.autotasktabs-dark .at-tabs-split-resize-grip::before {
                background: rgba(125, 167, 201, 0.78);
                box-shadow: 0 0 0 4px rgba(17, 22, 28, 0.8), 0 8px 22px rgba(0, 0, 0, 0.36);
            }
            html.autotasktabs-dark .at-tabs-split-resize-grip:hover::before,
            html.autotasktabs-dark .at-tabs-viewport.split-resizing .at-tabs-split-resize-grip::before {
                background: #7da7c9;
            }
            html.autotasktabs-dark .at-tabs-viewport.split > iframe.primary-pane {
                border-color: color-mix(in srgb, var(--autotasktabs-accent-color) 72%, #dbeafe 28%);
                box-shadow:
                    0 0 0 2px color-mix(in srgb, var(--autotasktabs-accent-color) 38%, transparent),
                    0 16px 36px rgba(0, 0, 0, 0.36);
            }
            html.autotasktabs-dark .at-tabs-split-frame-button {
                background: rgba(24, 31, 39, 0.94);
                border-color: rgba(125, 167, 201, 0.36);
                color: #dbeafe;
                box-shadow: 0 8px 22px rgba(0, 0, 0, 0.34);
            }
            html.autotasktabs-dark .at-tabs-drag-split-indicator::before {
                background: rgba(2, 6, 23, 0.26);
            }
            html.autotasktabs-dark .at-tabs-drag-split-pane {
                background:
                    linear-gradient(135deg, color-mix(in srgb, var(--autotasktabs-accent-color) 28%, transparent), color-mix(in srgb, var(--autotasktabs-accent-color) 12%, transparent)),
                    rgba(15, 23, 42, 0.66);
                box-shadow:
                    0 18px 42px rgba(0, 0, 0, 0.32),
                    inset 0 0 0 1px rgba(255, 255, 255, 0.12);
            }
            html.autotasktabs-dark .at-tabs-loader {
                background: rgba(31, 34, 39, 0.85);
            }
            html.autotasktabs-dark .at-tabs-pane-loader {
                background: rgba(31, 34, 39, 0.68);
            }
            html.autotasktabs-dark .at-tabs-loader::before,
            html.autotasktabs-dark .at-tabs-pane-loader::before {
                border-color: #475569;
                border-top-color: var(--autotasktabs-accent-color);
            }

            html.autotasktabs-dark .at-tab {
                color: #cbd5e1;
                --autotasktabs-tab-bg-idle: transparent;
                --autotasktabs-tab-bg-hover: #262A30;
                --autotasktabs-tab-bg-active: #232D37;
                --autotasktabs-tab-separator: #2a2e34;
            }
            html.autotasktabs-dark .at-tab:hover {
                background: var(--autotasktabs-tab-bg-hover, #262A30);
            }
            html.autotasktabs-dark .at-tab.active {
                background: var(--autotasktabs-tab-bg-active, #232D37);
                border-bottom-color: var(--autotasktabs-accent-color);
                color: #f8fafc;
            }
            html.autotasktabs-dark .at-tab[data-autotasktabs-colored="true"] {
                background: var(--autotasktabs-tab-bg-idle);
                border-bottom-color: transparent;
            }
            html.autotasktabs-dark .at-tab[data-autotasktabs-colored="true"]:hover {
                background: var(--autotasktabs-tab-bg-hover);
            }
            html.autotasktabs-dark .at-tab[data-autotasktabs-colored="true"].active {
                background: var(--autotasktabs-tab-bg-active);
                border-bottom-color: var(--autotasktabs-tab-border);
            }
            html.autotasktabs-dark .at-tab .icon {
                color: #cbd5e1;
            }
            html.autotasktabs-dark .at-tab.active .icon,
            html.autotasktabs-dark .at-tab.active .line.title {
                color: #f8fafc;
            }
            html.autotasktabs-dark .at-tab.active .line.number,
            html.autotasktabs-dark .at-tab.active .line.contact {
                color: rgba(248, 250, 252, 0.82);
            }
            html.autotasktabs-dark .at-tab .line.number,
            html.autotasktabs-dark .at-tab .line.contact {
                color: #94a3b8;
            }
            html.autotasktabs-dark .at-tab .close {
                color: #94a3b8;
            }
            html.autotasktabs-dark .at-tab .close:hover {
                background: #2a2e34;
                color: #f1f5f9;
            }
            html.autotasktabs-dark:not(.autotasktabs-bar-vertical) .at-tab + .at-tab::before {
                background: var(--autotasktabs-tab-separator);
            }
            html.autotasktabs-dark .at-tab .resource-badge {
                border-color: rgba(241, 245, 249, 0.18);
            }
            html.autotasktabs-dark .at-tab .tab-warning-badge.contract-warning {
                color: #f6c453 !important;
                background: rgba(246, 196, 83, 0.12) !important;
                border-color: rgba(246, 196, 83, 0.24) !important;
                box-shadow: inset 0 0 0 1px rgba(246, 196, 83, 0.08) !important;
            }
            html.autotasktabs-dark .at-tab .tab-warning-badge.product-inactive-warning {
                color: #94a3b8 !important;
                background: rgba(148, 163, 184, 0.12) !important;
                border-color: rgba(148, 163, 184, 0.22) !important;
                box-shadow: inset 0 0 0 1px rgba(148, 163, 184, 0.08) !important;
            }
            html.autotasktabs-dark .at-tab .tab-warning-badge {
                border-color: rgba(254, 202, 202, 0.24);
                box-shadow: 0 2px 8px rgba(127, 29, 29, 0.34);
            }
            html.autotasktabs-dark .at-tab-title-spinner,
            html.autotasktabs-dark .at-tab.home .home-spinner {
                border-color: #475569;
                border-top-color: var(--autotasktabs-accent-color);
            }

            html.autotasktabs-dark .at-tabs-settings-button {
                background: #1F2227;
                color: #cbd5e1;
                border-left-color: #2a2e34;
                border-right-color: #2a2e34;
            }
            html.autotasktabs-dark.autotasktabs-bar-vertical .at-tabs-settings-button {
                border-top-color: #2a2e34;
                border-left-color: transparent;
                border-right-color: transparent;
            }
            html.autotasktabs-dark .at-tabs-settings-button:hover {
                background: color-mix(in srgb, var(--autotasktabs-accent-color) 18%, transparent);
                color: var(--autotasktabs-accent-color);
            }
            html.autotasktabs-dark .at-tabs-scroll-button {
                background: rgba(31, 34, 39, 0.94);
                border-color: #2a2e34;
                color: #cbd5e1;
                box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
            }
            html.autotasktabs-dark .at-tabs-scroll-button:hover {
                background: #262A30;
                color: #f1f5f9;
            }
            html.autotasktabs-dark .at-tabs-scroll {
                scrollbar-color: transparent transparent;
            }
            html.autotasktabs-dark .at-tabs-scroll::-webkit-scrollbar-thumb {
                background: rgba(203, 213, 225, 0.34);
            }
            html.autotasktabs-dark .at-tabs-scroll::-webkit-scrollbar-thumb:hover {
                background: rgba(125, 167, 201, 0.6);
            }

            html.autotasktabs-dark .at-tabs-context-menu {
                background: #1F2227;
                border-color: #2a2e34;
                color: #f1f5f9;
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
            }
            html.autotasktabs-dark .at-tabs-context-divider {
                background: #2a2e34;
            }
            html.autotasktabs-dark .at-tabs-context-item:hover {
                background: #262A30;
                color: #ffffff;
            }
            html.autotasktabs-dark .at-tabs-context-submenu {
                background: #1F2227;
                border-color: #2a2e34;
                color: #f1f5f9;
                box-shadow: 0 16px 40px rgba(0, 0, 0, 0.5);
            }
            html.autotasktabs-dark .at-tabs-context-item:disabled {
                color: #64748b;
            }
            html.autotasktabs-dark .at-tabs-context-item:disabled .at-tabs-context-icon {
                color: #64748b;
            }
            html.autotasktabs-dark .at-tabs-color-swatch {
                border-color: rgba(241, 245, 249, 0.12);
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.16);
            }
            html.autotasktabs-dark .at-tabs-color-swatch.selected {
                border-color: #f8fafc;
                box-shadow: 0 0 0 2px rgba(241, 245, 249, 0.1), inset 0 0 0 1px rgba(255, 255, 255, 0.22);
            }

            html.autotasktabs-dark .at-tabs-settings-backdrop,
            html.autotasktabs-dark .at-tabs-map-backdrop {
                background: rgba(0, 0, 0, 0.55);
            }
            html.autotasktabs-dark .at-tabs-settings-modal,
            html.autotasktabs-dark .at-tabs-map-modal {
                background: #1F2227;
                border-color: #2a2e34;
                color: #f1f5f9;
                box-shadow: 0 22px 60px rgba(0, 0, 0, 0.6);
            }
            html.autotasktabs-dark .at-tabs-settings-header,
            html.autotasktabs-dark .at-tabs-map-header {
                border-bottom-color: #2a2e34;
            }
            html.autotasktabs-dark .at-tabs-settings-nav {
                background: #1A1D22;
                border-right-color: #2a2e34;
            }
            html.autotasktabs-dark .at-tabs-settings-nav-item {
                color: #cbd5e1;
            }
            html.autotasktabs-dark .at-tabs-settings-nav-item:hover {
                background: #232D37;
                border-color: #2a2e34;
                color: #f1f5f9;
            }
            html.autotasktabs-dark .at-tabs-settings-nav-item.active {
                background: color-mix(in srgb, var(--autotasktabs-accent-color) 18%, var(--autotasktabs-native-bg-primary));
                border-color: color-mix(in srgb, var(--autotasktabs-accent-color) 34%, var(--autotasktabs-native-border-primary));
                color: #f1f5f9;
                box-shadow: inset 3px 0 0 var(--autotasktabs-accent-color);
            }
            html.autotasktabs-dark .at-tabs-settings-nav-arrow {
                color: #64748b;
            }
            html.autotasktabs-dark .at-tabs-settings-footer {
                border-top-color: #2a2e34;
                color: #94a3b8;
            }
            html.autotasktabs-dark .at-tabs-settings-reset {
                background: #1f2937;
                border-color: #334155;
                color: #e2e8f0;
            }
            html.autotasktabs-dark .at-tabs-settings-reset:hover {
                background: #263244;
                border-color: #475569;
                color: #ffffff;
            }
            html.autotasktabs-dark .at-tabs-settings-title,
            html.autotasktabs-dark .at-tabs-settings-section-title,
            html.autotasktabs-dark .at-tabs-settings-page-title strong {
                color: #f1f5f9;
            }
            html.autotasktabs-dark .at-tabs-settings-page-title span {
                color: #94a3b8;
            }
            html.autotasktabs-dark .at-tabs-settings-page-action {
                background: #1f2937;
                border-color: #334155;
                color: #e2e8f0;
            }
            html.autotasktabs-dark .at-tabs-settings-page-action:hover {
                background: #263244;
                border-color: #475569;
                color: #ffffff;
            }
            html.autotasktabs-dark .at-tabs-settings-close:hover {
                background: #262A30;
                color: #f1f5f9;
            }
            html.autotasktabs-dark .at-tabs-settings-note {
                color: #94a3b8;
            }

            /* Settings modal interior in dark mode */
            html.autotasktabs-dark .at-tabs-settings-close {
                color: #94a3b8;
            }
            html.autotasktabs-dark .at-tabs-setting-row {
                background: #232D37;
                border-color: #2a2e34;
            }
            html.autotasktabs-dark .at-tabs-setting-row:hover {
                background: #262A30;
            }
            html.autotasktabs-dark .at-tabs-setting-name {
                color: #f1f5f9;
            }
            html.autotasktabs-dark .at-tabs-setting-description {
                color: #94a3b8;
            }
            html.autotasktabs-dark .at-tabs-setting-warning-inline {
                color: #fbbf24;
            }
            html.autotasktabs-dark .at-tabs-setting-toggle-ui {
                background: #475569;
                box-shadow: inset 0 0 0 1px rgba(241, 245, 249, 0.06);
            }
            html.autotasktabs-dark .at-tabs-setting-toggle-ui::after {
                background: #e2e8f0;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
            }
            html.autotasktabs-dark .at-tabs-setting-toggle input:checked + .at-tabs-setting-toggle-ui {
                background: var(--autotasktabs-accent-color);
            }
            html.autotasktabs-dark .at-tabs-setting-color-input {
                background: #111827;
                border-color: #475569;
            }
            html.autotasktabs-dark .at-tabs-setting-file-status,
            html.autotasktabs-dark .at-tabs-setting-file-input {
                color: #cbd5e1;
            }
            html.autotasktabs-dark .at-tabs-setting-small-button {
                background: #232D37;
                border-color: #475569;
                color: #e2e8f0;
            }

            /* Map modal interior in dark mode */
            html.autotasktabs-dark .at-tabs-map-header {
                color: #f1f5f9;
            }
            html.autotasktabs-dark .at-tabs-map-open {
                background: #232D37;
                border-color: #2a2e34;
                color: #cbd5e1;
            }
            html.autotasktabs-dark .at-tabs-map-open:hover {
                background: #262A30;
                color: #f1f5f9;
            }
            html.autotasktabs-dark .at-tabs-map-close {
                color: #94a3b8;
            }
            html.autotasktabs-dark .at-tabs-map-close:hover {
                background: #262A30;
                color: #f1f5f9;
            }
            /* Peek modal + hover card in dark mode */
            html.autotasktabs-dark .at-tabs-peek-backdrop {
                background: rgba(0, 0, 0, 0.6);
            }
            html.autotasktabs-dark .at-tabs-peek-modal {
                background: #1F2227;
                border-color: #2a2e34;
                box-shadow: 0 30px 80px rgba(0, 0, 0, 0.7);
            }
            html.autotasktabs-dark .at-tabs-peek-frame {
                background: #1F2227;
            }
            html.autotasktabs-dark .at-tabs-peek-drag-handle {
                background: rgba(35, 45, 55, 0.88);
                border-color: rgba(71, 85, 105, 0.72);
                color: rgba(226, 232, 240, 0.76);
                box-shadow: 0 8px 22px rgba(0, 0, 0, 0.38);
            }
            html.autotasktabs-dark .at-tabs-peek-drag-handle:hover,
            html.autotasktabs-dark .at-tabs-peek-drag-handle:focus-visible {
                background: #2a3641;
                border-color: rgba(125, 167, 201, 0.62);
            }
            html.autotasktabs-dark .at-tabs-peek-resize-handle::before {
                border-color: rgba(226, 232, 240, 0.58);
                box-shadow: 4px 4px 0 -2px rgba(226, 232, 240, 0.3);
            }
            html.autotasktabs-dark .at-tabs-peek-loader {
                background: rgba(31, 34, 39, 0.85);
            }
            html.autotasktabs-dark .at-tabs-peek-loader::before {
                border-color: #475569;
                border-top-color: var(--autotasktabs-accent-color);
            }
            html.autotasktabs-dark .at-tabs-peek-action {
                background: #232D37;
                color: #f1f5f9;
                box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
            }
            html.autotasktabs-dark .at-tabs-peek-action:hover {
                background: #2a3641;
            }
            html.autotasktabs-dark .at-tabs-peek-action.close-action {
                color: #cbd5e1;
            }
            html.autotasktabs-dark .at-tabs-peek-action.close-action:hover {
                color: #f1f5f9;
            }
            html.autotasktabs-dark .at-tabs-peek-confirm {
                background: #1F2227;
                color: #f1f5f9;
                border-color: #2a2e34;
                box-shadow: 0 24px 70px rgba(0, 0, 0, 0.65);
            }
            html.autotasktabs-dark .at-tabs-peek-confirm-check {
                color: #cbd5e1;
            }
            html.autotasktabs-dark .at-tabs-peek-confirm-check input {
                background: #111827;
                border-color: #64748b;
            }
            html.autotasktabs-dark .at-tabs-peek-confirm-check input:checked {
                background: var(--autotasktabs-accent-color);
                border-color: var(--autotasktabs-accent-color);
            }
            html.autotasktabs-dark .at-tabs-peek-confirm-button {
                background: #232D37;
                border-color: #334155;
                color: #e2e8f0;
            }
            html.autotasktabs-dark .at-tabs-peek-confirm-button:hover {
                background: #2a3641;
                color: #ffffff;
            }
            html.autotasktabs-dark .at-tabs-peek-confirm-button.primary {
                background: var(--autotasktabs-accent-color);
                border-color: var(--autotasktabs-accent-color);
                color: #ffffff;
            }
            html.autotasktabs-dark .at-tabs-hover-card {
                background: #1F2227;
                border-color: #2a2e34;
                color: #f1f5f9;
                box-shadow: 0 12px 32px rgba(0, 0, 0, 0.55);
            }
            html.autotasktabs-dark .at-tabs-hover-card .hc-title {
                color: #f1f5f9;
            }
            html.autotasktabs-dark .at-tabs-hover-card .hc-number {
                color: #94a3b8;
            }
            html.autotasktabs-dark .at-tabs-hover-card .hc-row {
                color: #cbd5e1;
            }
            html.autotasktabs-dark .at-tabs-hover-card .hc-row .hc-label {
                color: #94a3b8;
            }
            html.autotasktabs-dark .at-tabs-hover-card .hc-row .hc-value {
                color: #f1f5f9;
            }
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy {
                background: transparent !important;
                color: var(--autotasktabs-accent-color) !important;
            }
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy:hover {
                background: color-mix(in srgb, var(--autotasktabs-accent-color) 18%, transparent) !important;
                color: color-mix(in srgb, var(--autotasktabs-accent-color) 78%, #ffffff 22%) !important;
            }
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy .hc-copy-icon,
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy .hc-copy-icon::before,
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy i,
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy i::before,
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy svg,
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy svg * {
                color: var(--autotasktabs-accent-color) !important;
                fill: currentColor !important;
                stroke: currentColor !important;
            }
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy:hover .hc-copy-icon,
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy:hover .hc-copy-icon::before,
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy:hover i,
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy:hover i::before,
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy:hover svg,
            html.autotasktabs-dark .at-tabs-hover-card .hc-copy:hover svg * {
                color: color-mix(in srgb, var(--autotasktabs-accent-color) 78%, #ffffff 22%) !important;
                fill: currentColor !important;
                stroke: currentColor !important;
            }
            html.autotasktabs-dark .at-tabs-setting-select {
                background-color: #1F2227;
                border-color: #2a2e34;
                color: #f1f5f9;
                background-image: none !important;
            }
            html.autotasktabs-dark .at-tabs-setting-select-wrap::after {
                border-color: #94a3b8;
            }
            html.autotasktabs-dark .at-tabs-setting-select option {
                background: #1F2227;
                color: #f1f5f9;
                background-image: none !important;
            }
            html.autotasktabs-dark .at-tabs-setting-line-controls.line3-disabled select[data-tab-line="2"],
            html.autotasktabs-dark .at-tabs-setting-line-controls.line3-disabled select[data-tab-line="3"] {
                background-color: #1F2227;
                border-color: #334155;
                color: #64748b;
            }

            /* Home tab label ellipsis (was static "Home", now mirrors document.title). */
            .at-tab.home .home-label {
                display: inline-block;
                max-width: 240px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                vertical-align: middle;
            }

            /* ============================================================
               Vertical tab bar mode — toggled via html.autotasktabs-bar-vertical when
               settings → Appearance → Tab bar position = Vertical. The bar
               sits to the LEFT of the native iframe instead of above it; the
               iframe's parent container reserves padding-left instead of
               padding-top. ===============================================
            */
            html.autotasktabs-bar-vertical .at-tabs-bar {
                flex-direction: column;
                border-bottom: none;
                border-right: 1px solid #e2e8f0;
            }
            html.autotasktabs-bar-vertical .at-tabs-home-cover {
                border-bottom: none;
                border-right: 1px solid #e2e8f0;
            }
            html.autotasktabs-bar-vertical .at-tabs-scroll-wrap {
                width: 100%;
                height: auto;
                min-height: 0;
                flex: 1 1 auto;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar-inner {
                flex-direction: column;
                min-width: 0;
                min-height: max-content;
                padding-right: 0;
                padding-bottom: 12px;
            }
            html.autotasktabs-bar-vertical .at-tabs-scroll {
                overflow-y: auto;
                overflow-x: hidden;
            }
            html.autotasktabs-bar-vertical .at-tab {
                width: auto;
                align-self: stretch;
                min-height: calc(32px * var(--autotasktabs-tab-rows, 1));
                padding: 4px 16px;
                border-bottom: none;
                border-left: 4px solid transparent;
            }
            html.autotasktabs-compact-tabs.autotasktabs-bar-vertical .at-tab {
                align-items: center;
                min-height: 32px;
                padding-top: 4px;
                padding-bottom: 4px;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tabs-bar-inner {
                align-items: stretch;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tab {
                justify-content: center;
                gap: 0;
                padding-left: 0;
                padding-right: 0;
                min-height: 44px;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tab.home {
                min-height: 32px;
            }
            html.autotasktabs-compact-tabs.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tab {
                min-height: 32px;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tab .meta,
            html.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tab .tab-actions,
            html.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tab.home .home-label {
                display: none;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tab .icon {
                width: 20px;
                height: 20px;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tab .icon :is(svg, span, i) {
                width: 20px;
                height: 20px;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tab.pinned .pin-badge {
                left: 8px;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tabs-settings-button {
                width: 100%;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar-actions {
                display: flex;
                width: 100%;
                border-top: 1px solid var(--autotasktabs-native-border-primary);
                transform: none;
            }
            html.autotasktabs-bar-vertical .at-tabs-reopen-button {
                display: flex;
                width: 50%;
                height: 32px;
                border-right: 1px solid var(--autotasktabs-native-border-primary);
            }
            html.autotasktabs-bar-vertical .at-tabs-collapse-button {
                display: flex;
                width: 50%;
                height: 32px;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tabs-reopen-button,
            html.autotasktabs-bar-vertical .at-tabs-bar.compact:not(.hover-expanded) .at-tabs-collapse-button {
                height: 32px;
            }
            html.autotasktabs-bar-vertical .at-tabs-bar.compact.hover-expanded .at-tab {
                padding-left: 16px;
                padding-right: 16px;
            }
            html.autotasktabs-bar-vertical .at-tab.home {
                padding: 4px 16px;
            }
            html.autotasktabs-bar-vertical .at-tab .tab-actions {
                right: 10px;
                justify-content: flex-start;
                padding-top: 4px;
            }
            html.autotasktabs-bar-vertical .at-tab .resource-badge {
                margin-top: 2px;
            }
            html.autotasktabs-compact-tabs.autotasktabs-bar-vertical .at-tab .tab-actions {
                align-self: center;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                gap: 4px;
                padding-top: 0;
                min-height: 22px;
            }
            html.autotasktabs-compact-tabs.autotasktabs-bar-vertical .at-tab .close,
            html.autotasktabs-compact-tabs.autotasktabs-bar-vertical .at-tab .resource-badge,
            html.autotasktabs-compact-tabs.autotasktabs-bar-vertical .at-tab .tab-warning-badge {
                margin-top: 0;
                align-self: center;
            }
            html.autotasktabs-compact-tabs.autotasktabs-bar-vertical .at-tab .tab-warning-badge svg {
                display: block;
            }
            html.autotasktabs-bar-vertical .at-tab.active {
                border-bottom-color: transparent;
                border-left-color: var(--autotasktabs-accent-color);
            }
            html.autotasktabs-bar-vertical .at-tab[data-autotasktabs-colored="true"] {
                border-left-color: transparent;
                border-bottom-color: transparent;
            }
            html.autotasktabs-bar-vertical .at-tab[data-autotasktabs-colored="true"].active {
                border-left-color: var(--autotasktabs-tab-border);
            }
            html.autotasktabs-bar-vertical .at-tab.split-target {
                box-shadow: inset 3px 0 0 var(--autotasktabs-accent-color-soft);
            }
            html.autotasktabs-bar-vertical .at-tab.drop-before::after,
            html.autotasktabs-bar-vertical .at-tab.drop-after::after {
                left: 10px;
                right: 10px;
                top: auto;
                bottom: auto;
                width: auto;
                height: 3px;
            }
            html.autotasktabs-bar-vertical .at-tab.drop-before::after {
                top: -1px;
            }
            html.autotasktabs-bar-vertical .at-tab.drop-after::after {
                bottom: -1px;
            }
            html.autotasktabs-bar-vertical .at-tab + .at-tab::before {
                content: "";
                position: absolute;
                left: 14px;
                right: 14px;
                top: 0;
                bottom: auto;
                width: auto;
                height: 1px;
                background: var(--autotasktabs-tab-separator);
                z-index: 4;
                pointer-events: none;
            }
            html.autotasktabs-bar-vertical .at-tabs-settings-button {
                width: 100%;
                height: 52px;
                border: none;
                border-top: 1px solid #e2e8f0;
            }
            html.autotasktabs-bar-vertical .at-tabs-scroll-button {
                width: 32px;
                height: 28px;
            }
            html.autotasktabs-bar-vertical .at-tabs-scroll-button.left {
                left: 50%;
                right: auto;
                top: 6px;
                transform: translate(-50%, 0);
            }
            html.autotasktabs-bar-vertical .at-tabs-scroll-button.right {
                left: 50%;
                right: auto;
                top: auto;
                bottom: 6px;
                transform: translate(-50%, 0);
            }
            html.autotasktabs-bar-vertical .at-tabs-scroll-button svg {
                transform: rotate(90deg);
            }
            html.autotasktabs-dark .at-tab.active:not([data-autotasktabs-colored="true"]),
            html.autotasktabs-dark .at-tab[data-autotasktabs-colored="false"].active,
            html.autotasktabs-dark .at-tab.home.active {
                background: var(--autotasktabs-native-active-bg) !important;
                color: var(--autotasktabs-native-text-primary) !important;
            }
            html.autotasktabs-dark.autotasktabs-bar-vertical .at-tab.active:not([data-autotasktabs-colored="true"]),
            html.autotasktabs-dark.autotasktabs-bar-vertical .at-tab[data-autotasktabs-colored="false"].active,
            html.autotasktabs-dark.autotasktabs-bar-vertical .at-tab.home.active {
                border-left-color: var(--autotasktabs-accent-color) !important;
                border-bottom-color: transparent !important;
            }
            .at-tabs-settings-modal {
                background: var(--autotasktabs-native-bg-primary);
                border-color: var(--autotasktabs-native-border-primary);
                color: var(--autotasktabs-native-text-primary);
                font-family: var(--autotasktabs-native-font-family);
            }
            .at-tabs-settings-header,
            .at-tabs-settings-footer {
                border-color: var(--autotasktabs-native-border-primary);
            }
            .at-tabs-settings-title,
            .at-tabs-settings-page-title strong,
            .at-tabs-setting-name {
                color: var(--autotasktabs-native-text-primary);
            }
            .at-tabs-settings-page-title span,
            .at-tabs-settings-footer,
            .at-tabs-settings-note,
            .at-tabs-setting-description,
            .at-tabs-setting-file-status {
                color: var(--autotasktabs-native-text-secondary);
            }
            .at-tabs-settings-nav {
                background: var(--autotasktabs-native-bg-primary);
                border-right-color: var(--autotasktabs-native-border-primary);
            }
            .at-tabs-settings-nav-item {
                color: var(--autotasktabs-native-text-primary);
            }
            .at-tabs-settings-nav-item:hover {
                background: var(--autotasktabs-native-bg-hover);
                border-color: var(--autotasktabs-native-border-primary);
                color: var(--autotasktabs-native-text-primary);
            }
            .at-tabs-settings-nav-item.active {
                background: var(--autotasktabs-native-active-bg);
                border-color: transparent;
                color: var(--autotasktabs-native-text-primary);
                box-shadow: inset 3px 0 0 var(--autotasktabs-accent-color);
            }
            .at-tabs-settings-pages {
                background: var(--autotasktabs-native-bg-primary);
            }
            .at-tabs-setting-row {
                background: var(--autotasktabs-native-bg-primary);
                border-color: var(--autotasktabs-native-border-primary);
            }
            .at-tabs-setting-row:hover {
                background: var(--autotasktabs-native-bg-hover);
            }
            .at-tabs-settings-reset,
            .at-tabs-settings-page-action,
            .at-tabs-setting-small-button {
                background: var(--autotasktabs-native-bg-primary);
                border-color: var(--autotasktabs-native-border-primary);
                color: var(--autotasktabs-native-text-primary);
                font-family: var(--autotasktabs-native-font-family);
            }
            .at-tabs-settings-reset:hover,
            .at-tabs-settings-page-action:hover,
            .at-tabs-setting-small-button:hover:not(:disabled),
            .at-tabs-settings-close:hover {
                background: var(--autotasktabs-native-bg-hover);
                border-color: var(--autotasktabs-accent-color);
                color: var(--autotasktabs-native-text-primary);
            }
            .at-tabs-setting-select,
            .at-tabs-setting-color-input {
                background: var(--autotasktabs-native-bg-primary);
                border-color: var(--autotasktabs-native-border-primary);
                color: var(--autotasktabs-native-text-primary);
            }
            body.EntityPage>.MessageBarContainer {
                padding: 25px 8px 0 8px;
            }
        `;
})();


// Autotask Tabs -- iframe runtime module registry
(function () {
    'use strict';

    const AUTOTASKTABS = window.__AUTOTASKTABS__;
    if (!AUTOTASKTABS) return;

    /**
     * Purpose: shared iframe module registry for the no-build AUTOTASKTABS runtime.
     * Owns: cross-file iframe runtime state containers and module registration.
     * Must not own: shell tab behavior, settings UI, or top-frame geometry.
     * Companion files: autotasktabs-iframe-bridge.js and route allowlist files.
     * Verify: scripts/verify-extension-sources.sh after changing loaded runtime files.
     */
    const runtime = AUTOTASKTABS.IframeRuntime || (AUTOTASKTABS.IframeRuntime = {});
    runtime.modules = runtime.modules || [];

    AUTOTASKTABS.registerIframeModule = function registerIframeModule(name, factory) {
        if (typeof factory !== 'function') return;
        runtime.modules.push({ name: String(name || 'anonymous-iframe-module'), factory });
    };

    AUTOTASKTABS.runIframeModules = function runIframeModules(context) {
        runtime.modules.forEach(function (module) {
            try { module.factory(context || runtime); }
            catch (e) { console.warn('AUTOTASKTABS iframe module failed:', module.name, e); }
        });
    };
})();


// Autotask Tabs - iframe runtime core
(function () {
    'use strict';

    const AUTOTASKTABS = window.__AUTOTASKTABS__;
    if (!AUTOTASKTABS || AUTOTASKTABS.isTop || AUTOTASKTABS.iframeBridgeInitialized) return;

    /**
     * Purpose: iframe-side AUTOTASKTABS bridge and behavior core.
     * Owns: iframe URL forwarding, metadata extraction, iframe UI interception, and state requests.
     * Must not own: top-level tab rendering, settings modal UI, or shell geometry.
     * Companion files: autotasktabs-iframe-runtime.js, autotasktabs-page-bridge.js, autotasktabs-shared.js.
     */
    const iframeRuntime = AUTOTASKTABS.IframeRuntime || (AUTOTASKTABS.IframeRuntime = {});
    if (AUTOTASKTABS.isAllowedHost && !AUTOTASKTABS.isAllowedHost(location.href)) return;
    AUTOTASKTABS.iframeBridgeInitialized = true;
    iframeRuntime.initialized = true;
    let featureEnabled = !(AUTOTASKTABS.featuresEnabled && !AUTOTASKTABS.featuresEnabled());
    let improvedScrollbarsEnabled = false;
    let mapButtonEnhancementStarted = false;
    function hexToRgb(hex) {
        const normalized = String(hex || '').trim().replace('#', '');
        if (!/^[0-9a-f]{6}$/i.test(normalized)) return null;
        return {
            r: parseInt(normalized.slice(0, 2), 16),
            g: parseInt(normalized.slice(2, 4), 16),
            b: parseInt(normalized.slice(4, 6), 16)
        };
    }

    function colorToRgba(hex, alpha) {
        const rgb = hexToRgb(hex);
        if (!rgb) return '';
        return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + alpha + ')';
    }

    function colorToSpriteFilter(hex) {
        const rgb = hexToRgb(hex);
        if (!rgb) return 'none';
        const max = Math.max(rgb.r, rgb.g, rgb.b);
        const min = Math.min(rgb.r, rgb.g, rgb.b);
        const lightness = (max + min) / 510;
        let hue = 0;
        const delta = max - min;
        if (delta) {
            if (max === rgb.r) hue = ((rgb.g - rgb.b) / delta) % 6;
            else if (max === rgb.g) hue = (rgb.b - rgb.r) / delta + 2;
            else hue = (rgb.r - rgb.g) / delta + 4;
            hue *= 60;
            if (hue < 0) hue += 360;
        }
        const saturation = max === min
            ? 0
            : delta / (255 - Math.abs((max + min) - 255));
        const brightness = Math.max(0.35, Math.min(1.65, 0.72 + lightness));
        const saturate = Math.max(0, Math.min(6, 0.55 + saturation * 4.2));
        return 'sepia(1) saturate(' + saturate.toFixed(2) + ') hue-rotate(' + (hue - 45).toFixed(0) + 'deg) brightness(' + brightness.toFixed(2) + ')';
    }

    function colorNeedsLightForeground(hex) {
        const rgb = hexToRgb(hex);
        if (!rgb) return false;
        const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
        return luminance < 0.54;
    }

    function colorToTitlebarIconFilter(hex) {
        return colorNeedsLightForeground(hex) ? 'brightness(0) invert(1)' : 'none';
    }

    function isAutotaskTabsPeekFrame() {
        try {
            const fe = window.frameElement;
            return !!(fe && fe.classList && (
                fe.classList.contains('at-tabs-peek-frame') ||
                (fe.closest && fe.closest('.at-tabs-peek-wrapper'))
            ));
        } catch (e) {
            return false;
        }
    }

    function decodeUrl(url) {
        return (url || '').replace(/\\u0026/g, '&').replace(/&amp;/g, '&');
    }

    function extractWindowOpenUrl(onclickText) {
        if (!onclickText) return null;
        const match = onclickText.match(/window\.open\s*\(\s*['"]([^'"]+)['"]/i);
        if (!match) return null;

        const rawUrl = decodeUrl(match[1] || '');
        const absoluteUrl = AUTOTASKTABS.toAbsoluteUrl(rawUrl);
        return AUTOTASKTABS.isHandledUrl(absoluteUrl) ? absoluteUrl : null;
    }

    function extractAnchorUrl(anchor) {
        if (!anchor) return null;
        const href = anchor.getAttribute('href') || '';
        if (!href || href === '#') return null;
        const contactMatch = href.match(/OpenContactDetail\s*\(\s*(\d+)\s*\)/i);
        if (contactMatch) {
            return AUTOTASKTABS.toAbsoluteUrl('/opportunity/contacts/Contact.asp?contactID=' + encodeURIComponent(contactMatch[1]));
        }

        const absoluteUrl = AUTOTASKTABS.toAbsoluteUrl(decodeUrl(href));
        return AUTOTASKTABS.isHandledUrl(absoluteUrl) ? absoluteUrl : null;
    }

    function extractUrlFromOnclick(onclickText) {
        if (!onclickText) return null;
        const m = onclickText.match(
            /NewWindowPage\s*\(\s*'[^']*'\s*,\s*'([^']+)'\s*,\s*(?:true|false)\s*,\s*'([^']+)'\s*,\s*'([^']+)'/
        );
        if (!m) return null;
        const baseUrl = decodeUrl(m[1] || '');
        const path = baseUrl.split('?')[0];
        if (!AUTOTASKTABS.isHandledUrl(path)) return null;
        const sep = baseUrl.includes('?') ? '&' : '?';
        return baseUrl + sep + encodeURIComponent(m[2]) + '=' + encodeURIComponent(m[3]);
    }

    function postToTop(payload) {
        if (!featureEnabled
            && payload.type !== 'all-state-request'
            && payload.type !== 'feature-enabled-request'
            && payload.type !== 'improved-scrollbars-request') return;
        try { window.top.postMessage({ __ns: AUTOTASKTABS.MSG_NS, ...payload }, '*'); }
        catch (e) {}
    }

    function isPeekPopupUrl(url) {
        // Second Peek routing gate. autotasktabs-page-bridge.js can prevent the native
        // popup and post "open-peek", but this iframe bridge must also allow
        // the URL or the request is intentionally dropped before reaching shell.
        const targetUrl = AUTOTASKTABS.toAbsoluteUrl(url || '');
        if (!targetUrl) return false;
        try {
            const parsed = new URL(targetUrl);
            const path = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(parsed.href));
            if ((path === '/mvc/inventory/receipthistory.mvc' ||
                path === '/mvc/inventory/emailpurchaseorder.mvc/emailpurchaseorder') &&
                parsed.searchParams.has('purchaseOrderId')) return true;
            if (path === '/autotask/column_chooser.aspx') return true;
            if (path.includes('contract') && (
                path.includes('service') ||
                path.includes('discount') ||
                path.includes('exclusion') ||
                path.includes('selector') ||
                path.includes('installedproduct') ||
                path.includes('contract_products')
            )) return true;
            return path === '/mvc/servicedesk/timeentry.mvc/newtickettimeentrypage' ||
                path === '/mvc/servicedesk/timeentry.mvc/newtickettimeentryfromservicecall' ||
                path === '/autotask/popups/tickets/contractorallocationcodechanged.aspx' ||
                path === '/mvc/servicedesk/note.mvc/newticketnotepage' ||
                path === '/billing/invoices/popups/wrkdetails.asp' ||
                path === '/opportunity/wizards/reassignlead/popwiz_frames.asp' ||
                path === '/mvc/projects/projectnote.mvc/newprojectnote' ||
                path === '/projects/calendar/prjcalendar.asp' ||
                path === '/mvc/file/attachment.mvc/projectattachment' ||
                path === '/mvc/file/attachment.mvc/ticketattachment' ||
                path === '/autotask/inventory/inventory_order_receive.aspx' ||
                path === '/mvc/projects/teammember.mvc/add' ||
                path === '/autotask/views/contracts/cost.aspx' ||
                path === '/autotask/views/projects/project_cost.aspx' ||
                path === '/mvc/timesheets/expense.mvc/createnewprojectexpense' ||
                path === '/projects/wizards/transformations/copyattributes/popwiz_frames.asp' ||
                path === '/projects/reports' ||
                path.startsWith('/projects/reports/') ||
                path === '/autotask35/dataselectorhandlers/ticketdataselectorpopup.aspx' ||
                path === '/mvc/projects/importticket.mvc/copytickettoproject' ||
                path === '/servicedesk/popups/forward/svcforward.asp' ||
                path === '/servicedesk/reports/togoreportframe.asp' ||
                path === '/mvc/servicedesk/tickethistory.mvc/servicetickethistory' ||
                path === '/mvc/crm/accounthistory.mvc/entitychangehistory' ||
                path === '/mvc/crm/documentmerge.mvc/accountdocumentmerge' ||
                path === '/mvc/crm/security.mvc/whocanviewaccount' ||
                path === '/popups/work/svcdetail.asp' ||
                path === '/popups/searches/srcclient.asp' ||
                path === '/administrator/roles/tabroleview.asp' ||
                path === '/mvc/administrationsetup/privacy.mvc/redactresource' ||
                path === '/autotask/views/administration/companysetup/neweditallocationcode.aspx' ||
                path === '/mvc/contracts/contract.mvc/edit' ||
                path === '/mvc/contracts/newcontractwizard.mvc/renewcontractwizard' ||
                path === '/mvc/contracts/contractnote.mvc/newcontractnote' ||
                path === '/mvc/contracts/contracthistory.mvc/entitychangehistory' ||
                (path === '/popups/journals/jrnpop.asp' && parsed.searchParams.get('action') === 'showCompliance');
        } catch (e) {
            return false;
        }
    }

    function extractHandledNavigationUrlFromEventTarget(target) {
        const anchor = target && target.closest ? target.closest('a[href]') : null;
        const anchorTargetUrl = extractAnchorUrl(anchor);
        if (anchorTargetUrl) return anchorTargetUrl;

        const el = target && target.closest ? target.closest('td[onclick], a[onclick], div[onclick], span[onclick]') : null;
        if (!el) return null;
        const onclickText = el.getAttribute('onclick') || '';
        const ticketByNumberMatch = onclickText.match(/openTicketByTicketNumber\s*\(\s*['"]([^'"]+)['"]/i);
        if (ticketByNumberMatch) {
            return AUTOTASKTABS.toAbsoluteUrl('/Mvc/ServiceDesk/TicketDetail.mvc/TicketByTicketNumber?ticketNumber=' + encodeURIComponent(ticketByNumberMatch[1]));
        }
        if (!onclickText.includes('NewWindowPage') && !onclickText.includes('window.open')) return null;

        const targetUrl = extractUrlFromOnclick(onclickText) || extractWindowOpenUrl(onclickText);
        return targetUrl ? AUTOTASKTABS.toAbsoluteUrl(targetUrl) : null;
    }

    // Replace native OS scrollbars in the iframe's document with a thin
    // translucent styled scrollbar when the shell setting is enabled.
    function injectScrollbarStyles() {
        const STYLE_ID = 'autotasktabs-custom-scrollbar-style';
        if (document.getElementById(STYLE_ID)) return;
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.textContent = [
            'html {',
            '    --autotasktabs-accent-link-color: #376A94;',
            '    --autotasktabs-accent-icon-filter: none;',
            '    --autotasktabs-titlebar-icon-filter: none;',
            '    --autotasktabs-accent-scrollbar: rgba(125, 167, 201, 0.5);',
            '    --autotasktabs-accent-scrollbar-hover: rgba(125, 167, 201, 0.75);',
            '    --autotasktabs-accent-scrollbar-dark: rgba(125, 167, 201, 0.58);',
            '    --autotasktabs-accent-scrollbar-dark-hover: rgba(125, 167, 201, 0.82);',
            '}',
            'html.autotasktabs-improved-scrollbars,',
            'html.autotasktabs-improved-scrollbars body,',
            'html.autotasktabs-improved-scrollbars * {',
            '    scrollbar-color: var(--autotasktabs-accent-scrollbar) transparent !important;',
            '    scrollbar-width: thin !important;',
            '    scrollbar-gutter: auto !important;',
            '}',
            'html.autotasktabs-improved-scrollbars::-webkit-scrollbar,',
            'html.autotasktabs-improved-scrollbars body::-webkit-scrollbar,',
            'html.autotasktabs-improved-scrollbars *::-webkit-scrollbar {',
            '    background: transparent !important;',
            '    background-color: transparent !important;',
            '    width: 4px !important;',
            '    height: 4px !important;',
            '}',
            'html.autotasktabs-improved-scrollbars::-webkit-scrollbar-track,',
            'html.autotasktabs-improved-scrollbars body::-webkit-scrollbar-track,',
            'html.autotasktabs-improved-scrollbars *::-webkit-scrollbar-track {',
            '    background: transparent !important;',
            '    background-color: transparent !important;',
            '    border: 0 !important;',
            '    box-shadow: none !important;',
            '}',
            'html.autotasktabs-improved-scrollbars::-webkit-scrollbar-track-piece,',
            'html.autotasktabs-improved-scrollbars body::-webkit-scrollbar-track-piece,',
            'html.autotasktabs-improved-scrollbars *::-webkit-scrollbar-track-piece {',
            '    background: transparent !important;',
            '    background-color: transparent !important;',
            '    border: 0 !important;',
            '    box-shadow: none !important;',
            '}',
            'html.autotasktabs-improved-scrollbars::-webkit-scrollbar-thumb,',
            'html.autotasktabs-improved-scrollbars body::-webkit-scrollbar-thumb,',
            'html.autotasktabs-improved-scrollbars *::-webkit-scrollbar-thumb {',
            '    background-color: var(--autotasktabs-accent-scrollbar) !important;',
            '    border-radius: 999px !important;',
            '    border: 1px solid transparent !important;',
            '    background-clip: content-box !important;',
            '}',
            'html.autotasktabs-improved-scrollbars::-webkit-scrollbar-thumb:hover,',
            'html.autotasktabs-improved-scrollbars body::-webkit-scrollbar-thumb:hover,',
            'html.autotasktabs-improved-scrollbars *::-webkit-scrollbar-thumb:hover {',
            '    background-color: var(--autotasktabs-accent-scrollbar-hover) !important;',
            '    background-clip: content-box !important;',
            '}',
            'html.autotasktabs-improved-scrollbars::-webkit-scrollbar-corner,',
            'html.autotasktabs-improved-scrollbars body::-webkit-scrollbar-corner,',
            'html.autotasktabs-improved-scrollbars *::-webkit-scrollbar-corner {',
            '    background: transparent !important;',
            '    background-color: transparent !important;',
            '}',
            'html.autotasktabs-improved-scrollbars::-webkit-scrollbar-button,',
            'html.autotasktabs-improved-scrollbars body::-webkit-scrollbar-button,',
            'html.autotasktabs-improved-scrollbars *::-webkit-scrollbar-button,',
            'html.autotasktabs-improved-scrollbars::-webkit-resizer,',
            'html.autotasktabs-improved-scrollbars body::-webkit-resizer,',
            'html.autotasktabs-improved-scrollbars *::-webkit-resizer {',
            '    display: none !important;',
            '    background: transparent !important;',
            '    background-color: transparent !important;',
            '    width: 0 !important;',
            '    height: 0 !important;',
            '}',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme {',
            '    scrollbar-color: var(--autotasktabs-accent-scrollbar-dark) #0f141a !important;',
            '}',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme::-webkit-scrollbar-track,',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme body::-webkit-scrollbar-track,',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme *::-webkit-scrollbar-track {',
            '    background: transparent !important;',
            '}',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme::-webkit-scrollbar-thumb,',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme body::-webkit-scrollbar-thumb,',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme *::-webkit-scrollbar-thumb {',
            '    background-color: var(--autotasktabs-accent-scrollbar-dark) !important;',
            '    border-color: #0f141a !important;',
            '}',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme::-webkit-scrollbar-thumb:hover,',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme body::-webkit-scrollbar-thumb:hover,',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme *::-webkit-scrollbar-thumb:hover {',
            '    background-color: var(--autotasktabs-accent-scrollbar-dark-hover) !important;',
            '}',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme::-webkit-scrollbar-corner,',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme body::-webkit-scrollbar-corner,',
            'html.autotasktabs-improved-scrollbars.autotasktabs-autotask-dark-theme *::-webkit-scrollbar-corner {',
            '    background: transparent !important;',
            '}',
            'html.autotasktabs-improved-scrollbars body::-webkit-scrollbar {',
        ].join('\n');
        function attach() {
            (document.head || document.documentElement).appendChild(style);
        }
        if (document.head || document.documentElement) attach();
        else document.addEventListener('DOMContentLoaded', attach, { once: true });
    }

    // Push this iframe's own content down by BAR_H so the shell bar in the
    // top document never visually overlaps what's inside. Runs from INSIDE
    // each iframe so it works regardless of whether the shell's
    // findContentIframe identified this iframe.
    //
    // Three-step strategy, tried in order, one of them wins:
    //   1. If <body> is a <frameset> (legacy ASP pages) → pad <html>.
    //   2. Else if <body> already has >= BAR_H of padding-top (Autotask's
    //      own layout, e.g. MVC pages with a fixed PageHeadingContainer)
    //      → do nothing. Content is already below where our bar sits.
    //   3. Otherwise try padding <body>. After layout settles, re-measure.
    //      If body's padding-top still computed to < BAR_H (Autotask's CSS
    //      won specificity, or body layout ignores padding), fall back to
    //      <html> padding.
    //
    // <html> padding with box-sizing: border-box + height: 100vh is the
    // strongest mechanism: it reduces the containing block for everything
    // inside, including absolutely-positioned root fills and frameset docs.
    //
    // Skipped when: this iframe lives inside the shell's tab viewport, or
    // is nested more than one level deep (outer wrapper already pushed).
    function applyShellBarBodyPadding() {
        if (isAutotaskTabsPeekFrame()) return;
        try {
            const fe = window.frameElement;
            if (fe && fe.closest && fe.closest('.at-tabs-viewport')) return;
        } catch (e) {
            return;
        }
        try { if (window.parent !== window.top) return; } catch (e) { return; }

        const doc = document;
        const STYLE_ID = 'autotasktabs-native-body-shell-padding-style';
        const BODY_CLASS = 'autotasktabs-native-body-shell-padding';
        const HTML_CLASS = 'autotasktabs-native-html-shell-padding';

        // 0.3.22: content-inside-iframe padding could not reliably move
        // Autotask pages with absolute/fixed root containers. The shell now
        // offsets the native iframe itself, which is layout-agnostic. Keep this
        // bridge path as cleanup only so previous spacer classes do not stack.
        const staleStyle = doc.getElementById(STYLE_ID);
        if (staleStyle) staleStyle.remove();
        if (doc.documentElement) doc.documentElement.classList.remove(HTML_CLASS);
        if (doc.body) doc.body.classList.remove(BODY_CLASS);
        return;

        function ensureStyle() {
            if (doc.getElementById(STYLE_ID)) return;
            const style = doc.createElement('style');
            style.id = STYLE_ID;
            style.textContent = `
                /* Body padding + position:relative makes <body> the containing
                   block for its absolutely-positioned descendants, so absolute
                   children with top:0 (e.g. Autotask's .PageContentContainer)
                   resolve to body's padding box top — 65px below body's top —
                   instead of the viewport top. Trying to establish containing
                   block on <html> via position:relative / transform does NOT
                   work reliably on root elements in Chromium. Body does. */
                body.${BODY_CLASS} {
                    padding-top: ${AUTOTASKTABS.BAR_H}px !important;
                    box-sizing: border-box !important;
                    position: relative !important;
                }
                /* Frameset-only fallback. <frameset> doesn't respect any body
                   technique, so we pad <html> and size it to the viewport. */
                html.${HTML_CLASS} {
                    padding-top: ${AUTOTASKTABS.BAR_H}px !important;
                    box-sizing: border-box !important;
                    height: 100vh !important;
                }
            `;
            (doc.head || doc.documentElement).appendChild(style);
        }

        function padHtml() {
            if (doc.documentElement) {
                doc.documentElement.classList.add(HTML_CLASS);
            }
        }

        function currentBodyPaddingTop() {
            try {
                const cs = window.getComputedStyle(doc.body);
                return parseFloat(cs.paddingTop) || 0;
            } catch (e) { return 0; }
        }

        function apply() {
            ensureStyle();

            const body = doc.body;
            if (!body) return; // wait for body — apply will run again at DOMContentLoaded

            // Case 1: frameset doc — body ignores padding, pad html.
            if (body.tagName === 'FRAMESET') {
                padHtml();
                return;
            }

            // Case 2: Autotask already offsets body enough. Leave alone.
            if (currentBodyPaddingTop() >= AUTOTASKTABS.BAR_H) {
                return;
            }

            // Case 3: apply body padding + position:relative. This covers:
            //   - Normal flow content (padding shifts it down)
            //   - Absolute root containers with top:0 (body becomes their
            //     containing block, so padding-box top — below bar — applies)
            body.classList.add(BODY_CLASS);

            // Verify after layout settles. If body's computed padding-top is
            // still < BAR_H, our class lost a specificity fight (rare); fall
            // back to html padding.
            window.requestAnimationFrame(function () {
                window.requestAnimationFrame(function () {
                    if (currentBodyPaddingTop() < AUTOTASKTABS.BAR_H) {
                        body.classList.remove(BODY_CLASS);
                        padHtml();
                    }
                });
            });
        }

        if (doc.body) {
            apply();
        } else if (doc.readyState === 'loading') {
            doc.addEventListener('DOMContentLoaded', apply, { once: true });
        } else {
            // Past loading but body is still null — keep polling briefly.
            apply();
        }
    }

    let pendingMapOpenUntil = 0;

    function isPendingMapOpen() {
        return pendingMapOpenUntil && Date.now() < pendingMapOpenUntil;
    }

    function isMapUrl(url) {
        const targetUrl = AUTOTASKTABS.toAbsoluteUrl(decodeUrl(String(url || '')));
        if (!targetUrl) return false;
        try {
            const parsed = new URL(targetUrl);
            return /(^|\.)maps\.google\./i.test(parsed.hostname) ||
                /(^|\.)google\.[^/]+$/i.test(parsed.hostname) && parsed.pathname.toLowerCase().includes('/maps') ||
                /(^|\.)openstreetmap\.org$/i.test(parsed.hostname);
        } catch (e) {
            return /\bmaps\.google\.|openstreetmap\.org/i.test(targetUrl);
        }
    }

    function createMapWindow(url) {
        const targetUrl = AUTOTASKTABS.toAbsoluteUrl(decodeUrl(String(url || '')));
        return {
            closed: false,
            opener: window,
            focus: function () {
                if (targetUrl) postToTop({ type: 'map', url: targetUrl });
            },
            blur: function () {},
            close: function () { this.closed = true; },
        };
    }

    function createHandledWindow(url) {
        const targetUrl = AUTOTASKTABS.toAbsoluteUrl(decodeUrl(String(url || '')));
        return {
            closed: false,
            opener: window,
            location: { href: targetUrl || '' },
            focus: function () {},
            blur: function () {},
            close: function () { this.closed = true; },
        };
    }

    function injectPageBridge() {
        if (document.documentElement.dataset.autotasktabsPageBridgeInjected === 'true') return;
        document.documentElement.dataset.autotasktabsPageBridgeInjected = 'true';

        const mount = document.documentElement || document.head;
        const routesScript = document.createElement('script');
        const bridgeScript = document.createElement('script');

        routesScript.src = chrome.runtime.getURL('functions/autotask/tabs/autotaskTabsRoutes.js');
        bridgeScript.src = chrome.runtime.getURL('functions/autotask/tabs/autotaskTabsPageBridge.js');
        routesScript.onload = function () {
            routesScript.remove();
            mount.appendChild(bridgeScript);
        };
        routesScript.onerror = function () {
            routesScript.remove();
            mount.appendChild(bridgeScript);
        };
        bridgeScript.onload = function () { bridgeScript.remove(); };
        mount.appendChild(routesScript);
    }

    function cleanText(s) {
        return (s || '').replace(/\s+/g, ' ').trim();
    }

    function isUmbrellaContractFrameUrl(url) {
        try {
            const parsed = new URL(url || location.href, location.origin);
            return parsed.pathname.toLowerCase() === '/autotaskonyx/landingpage' &&
                parsed.searchParams.get('view') === 'umbrella-contract-details';
        } catch (e) {
            return false;
        }
    }

    function isReportableFrameUrl(url) {
        return AUTOTASKTABS.isHandledUrl(url) || isUmbrellaContractFrameUrl(url);
    }

    function isLegacyContractViewUrl(url) {
        return AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(url || '')) === '/contracts/views/contractview.asp';
    }

    function isDialogPopOutFromDialogUrl(url) {
        const path = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(url || ''));
        return path === '/mvc/servicedesk/timeentry.mvc/timeentrypopoutfromdialog' ||
            path === '/mvc/servicedesk/note.mvc/notepopoutfromdialog';
    }

    function umbrellaContractIdFromFrameUrl(url) {
        try {
            const parsed = new URL(url || location.href, location.origin);
            const rawViewData = parsed.searchParams.get('view-data') || '';
            if (!rawViewData) return '';
            const data = JSON.parse(atob(rawViewData));
            const contractId = data && data.contractId;
            return contractId === undefined || contractId === null ? '' : String(contractId);
        } catch (e) {
            return '';
        }
    }

    function findOnyxFieldValue(labelText) {
        const wanted = cleanText(labelText).toLowerCase();
        if (!wanted) return '';
        const labelsToReject = [
            'account',
            'organization',
            'account manager',
            'contact',
            'contact name',
            'contract type',
            'category',
            'contract category',
            'start date',
            'end date',
            'exclusions',
            'coverage',
            'activity',
        ];
        const isSaneFieldValue = function (value) {
            const text = cleanText(value);
            if (!text || text.toLowerCase() === wanted || text.length > 140) return false;
            const lower = text.toLowerCase();
            let labelHits = 0;
            labelsToReject.forEach(function (label) {
                if (lower.includes(label)) labelHits += 1;
            });
            return labelHits < 2;
        };
        const readPreferredValue = function (root) {
            if (!root) return '';
            const selectors = [
                '.LinkButton2 .Text2',
                '.LinkButton2',
                '.ReadOnlyValueContainer .Value > .Text2',
                '.ReadOnlyValueContainer .Value',
                '.Value > .Text2',
                '.Value > .Text',
                '.Value',
                'a',
                '[role="link"]',
                'input',
                'textarea',
                'select',
            ];
            for (const selector of selectors) {
                const el = root.matches && root.matches(selector) ? root : root.querySelector(selector);
                if (!el) continue;
                let value = '';
                if (el.matches && el.matches('input, textarea, select')) {
                    if (el.matches('select')) {
                        value = cleanText(el.selectedOptions && el.selectedOptions[0] && el.selectedOptions[0].textContent);
                    } else {
                        value = cleanText(el.value);
                    }
                } else {
                    value = cleanText(el.textContent);
                }
                if (isSaneFieldValue(value)) return value.slice(0, 120);
            }
            const clone = root.cloneNode(true);
            clone.querySelectorAll('button, svg, img, script, style, .WalkMeIconPlaceholder, [aria-hidden="true"]').forEach(function (el) {
                el.remove();
            });
            const value = cleanText(clone.textContent);
            return isSaneFieldValue(value) ? value.slice(0, 120) : '';
        };

        for (const row of document.querySelectorAll('.ReadOnlyData')) {
            const label = row.querySelector('.ReadOnlyLabelContainer .PrimaryText, .ReadOnlyLabelContainer .Text');
            if (!label || cleanText(label.textContent).toLowerCase() !== wanted) continue;
            const value = row.querySelector('.ReadOnlyValueContainer');
            const extracted = readPreferredValue(value);
            if (extracted) return extracted;
        }

        const candidates = Array.from(document.querySelectorAll('.o-label__text, label.o-label__text, label, .PrimaryText'))
            .filter(function (el) {
                return cleanText(el.textContent).toLowerCase() === wanted;
            });
        for (const label of candidates) {
            const labelCell = label.closest('.ReadOnlyLabelContainer, .o-flex-child, [class*="LabelContainer"]') || label.parentElement;
            const valueCell = labelCell && labelCell.nextElementSibling;
            const extracted = readPreferredValue(valueCell);
            if (extracted) return extracted;
        }
        return '';
    }

    function extractUmbrellaContractInfo() {
        const contractId = umbrellaContractIdFromFrameUrl(location.href);
        const titleEl = document.querySelector(
            '.o-view-layout__header h1, .o-font--page-title-bold, [class*="page-title"], h1'
        );
        const rawTitle = cleanText(titleEl && titleEl.textContent);
        const documentTitle = cleanText(document.title).replace(/^Autotask\s*[-–]\s*/i, '');
        const title = (rawTitle && rawTitle.length <= 140 ? rawTitle : '') ||
            (documentTitle && documentTitle.length <= 140 ? documentTitle : '') ||
            'Umbrella Contract';
        const account = findOnyxFieldValue('Account') || findOnyxFieldValue('Organization');
        const accountManager = findOnyxFieldValue('Account Manager');
        const contactName = findOnyxFieldValue('Contact Name') || findOnyxFieldValue('Contact');
        const contractType = findOnyxFieldValue('Contract Type');
        const category = findOnyxFieldValue('Category') || findOnyxFieldValue('Contract Category');
        const startDate = findOnyxFieldValue('Start date') || findOnyxFieldValue('Start Date');
        const endDate = findOnyxFieldValue('End date') || findOnyxFieldValue('End Date');
        const hoverFields = [
            { label: 'Account', value: account },
            { label: 'Account Manager', value: accountManager },
            { label: 'Contact Name', value: contactName },
            { label: 'Contract Type', value: contractType },
            { label: 'Category', value: category },
            { label: 'Start date', value: startDate },
            { label: 'End date', value: endDate },
        ].filter(field => field.value);

        return {
            title: title.slice(0, 120),
            number: contractId ? ('ID ' + contractId).slice(0, 40) : 'Umbrella Contract',
            contact: account.slice(0, 80),
            hoverFields: hoverFields,
            metadataFields: {
                type: 'Umbrella Contract',
                id: contractId ? ('ID ' + contractId).slice(0, 40) : '',
                organization: account.slice(0, 80),
                accountManager: accountManager.slice(0, 80),
                contactName: contactName.slice(0, 80),
                contractType: contractType.slice(0, 80),
                contractCategory: category.slice(0, 80),
                startDate: startDate.slice(0, 80),
                endDate: endDate.slice(0, 80),
            },
        };
    }

    let embeddedUmbrellaContractObserver = null;
    function applyEmbeddedUmbrellaContractChrome() {
        if (!isUmbrellaContractFrameUrl(location.href)) return;
        document.documentElement.classList.add('autotasktabs-embedded-umbrella-contract');
        if (document.body) document.body.classList.add('autotasktabs-embedded-umbrella-contract-body');

        let shell = null;
        try {
            shell = document.body && document.body.querySelector(':scope > .relative.w-full.h-full > .h-screen.flex.flex-col.bg-background-secondary');
        } catch (e) {}
        if (!shell) return;

        const topBar = shell.children && shell.children[0];
        if (topBar && topBar.style) topBar.style.setProperty('display', 'none', 'important');

        const contentRow = shell.children && shell.children[1];
        if (contentRow && contentRow.style) {
            contentRow.style.setProperty('height', '100vh', 'important');
            contentRow.style.setProperty('min-height', '0', 'important');
        }

        let sideNav = null;
        let content = null;
        try {
            sideNav = contentRow && contentRow.querySelector(':scope > .relative.z-1');
            content = contentRow && contentRow.querySelector(':scope > .min-w-0.flex-1');
        } catch (e) {}
        if (sideNav && sideNav.style) sideNav.style.setProperty('display', 'none', 'important');
        if (content && content.style) {
            content.style.setProperty('width', '100%', 'important');
            content.style.setProperty('height', '100%', 'important');
            content.style.setProperty('border-radius', '0', 'important');
            content.style.setProperty('box-shadow', 'none', 'important');
        }
    }

    function installEmbeddedUmbrellaContractChrome() {
        if (!isUmbrellaContractFrameUrl(location.href)) return;
        if (!document.getElementById('autotasktabs-embedded-umbrella-contract-style')) {
            const style = document.createElement('style');
            style.id = 'autotasktabs-embedded-umbrella-contract-style';
            style.textContent = `
html.autotasktabs-embedded-umbrella-contract,
html.autotasktabs-embedded-umbrella-contract body {
  width: 100% !important;
  height: 100% !important;
  overflow: hidden !important;
}
html.autotasktabs-embedded-umbrella-contract body > .relative.w-full.h-full,
html.autotasktabs-embedded-umbrella-contract body > .relative.w-full.h-full > .h-screen.flex.flex-col.bg-background-secondary {
  height: 100vh !important;
  min-height: 0 !important;
}
html.autotasktabs-embedded-umbrella-contract body > .relative.w-full.h-full > .h-screen.flex.flex-col.bg-background-secondary > div:first-child {
  display: none !important;
}
html.autotasktabs-embedded-umbrella-contract body > .relative.w-full.h-full > .h-screen.flex.flex-col.bg-background-secondary > .relative.min-h-0.flex-1.flex {
  height: 100vh !important;
  min-height: 0 !important;
}
html.autotasktabs-embedded-umbrella-contract body > .relative.w-full.h-full > .h-screen.flex.flex-col.bg-background-secondary > .relative.min-h-0.flex-1.flex > .relative.z-1 {
  display: none !important;
}
html.autotasktabs-embedded-umbrella-contract body > .relative.w-full.h-full > .h-screen.flex.flex-col.bg-background-secondary > .relative.min-h-0.flex-1.flex > .min-w-0.flex-1,
html.autotasktabs-embedded-umbrella-contract .o-view-layout {
  width: 100% !important;
  height: 100% !important;
  min-height: 0 !important;
  border-radius: 0 !important;
  box-shadow: none !important;
}`;
            (document.head || document.documentElement).appendChild(style);
        }
        applyEmbeddedUmbrellaContractChrome();
        [100, 300, 800, 1600, 3000].forEach(function (delay) {
            window.setTimeout(applyEmbeddedUmbrellaContractChrome, delay);
        });
        if (embeddedUmbrellaContractObserver || !document.documentElement) return;
        embeddedUmbrellaContractObserver = new MutationObserver(applyEmbeddedUmbrellaContractChrome);
        embeddedUmbrellaContractObserver.observe(document.documentElement, {
            childList: true,
            subtree: true,
        });
    }

    function collectAccessibleDocuments(rootDoc, maxDepth) {
        const docs = [];
        const seen = new Set();

        function walk(doc, depth) {
            if (!doc || seen.has(doc)) return;
            seen.add(doc);
            docs.push(doc);
            if (depth >= maxDepth) return;

            for (const frame of doc.querySelectorAll('iframe, frame')) {
                try {
                    const childDoc = frame.contentDocument;
                    if (childDoc) walk(childDoc, depth + 1);
                } catch (e) {}
            }
        }

        walk(rootDoc, 0);
        return docs;
    }

    function queryAcrossAccessibleDocuments(selector, maxDepth) {
        const docs = collectAccessibleDocuments(document, maxDepth || 2);
        for (const doc of docs) {
            try {
                const el = doc.querySelector(selector);
                if (el) return el;
            } catch (e) {}
        }
        return null;
    }

    function findFieldValue(labelText) {
        const rows = document.querySelectorAll('.ReadOnlyData');
        const wanted = labelText.toLowerCase();
        for (const row of rows) {
            const primary = row.querySelector('.ReadOnlyLabelContainer .PrimaryText');
            if (!primary) continue;
            if (cleanText(primary.textContent).toLowerCase() !== wanted) continue;
            const valueEl = row.querySelector('.ReadOnlyValueContainer, .ValueContainer, .DataContainer, .Value');
            if (valueEl) {
                const link = valueEl.querySelector('a');
                return cleanText((link || valueEl).textContent);
            }
            const clone = row.cloneNode(true);
            const lbl = clone.querySelector('.ReadOnlyLabelContainer');
            if (lbl) lbl.remove();
            return cleanText(clone.textContent);
        }
        return '';
    }

    // Read the value of a `.ReadOnlyData` quick-edit field whose label matches
    // any of the given names. Used to pull Priority / Status from ticket pages.
    function findReadOnlyValueByLabel(labelNames) {
        const wanted = labelNames.map(function (n) { return n.toLowerCase(); });
        const labels = document.querySelectorAll(
            '.ReadOnlyData .ReadOnlyLabelContainer .PrimaryText'
        );
        for (const label of labels) {
            const text = (label.textContent || '').trim().toLowerCase();
            if (wanted.indexOf(text) === -1) continue;
            const data = label.closest('.ReadOnlyData');
            if (!data) continue;
            // The visible value sits in `.ReadOnlyValueContainer .Value`. The
            // colored ColorBand layout puts the readable label in
            // `.Text.ColorSample`, but plainer fields just have a `.Value` text
            // node; cover both by querying the value container's textContent.
            const valueContainer = data.querySelector('.ReadOnlyValueContainer .Value');
            if (!valueContainer) continue;
            const colorSample = valueContainer.querySelector('.Right .Text.ColorSample');
            const raw = colorSample ? colorSample.textContent : valueContainer.textContent;
            const value = cleanText(raw);
            if (value) return value;
        }
        return '';
    }

    function findReadOnlyColorFieldByLabel(labelNames) {
        const wanted = labelNames.map(function (n) { return n.toLowerCase(); });
        const labels = document.querySelectorAll(
            '.ReadOnlyData .ReadOnlyLabelContainer .PrimaryText'
        );
        for (const label of labels) {
            const text = (label.textContent || '').trim().toLowerCase();
            if (wanted.indexOf(text) === -1) continue;
            const data = label.closest('.ReadOnlyData');
            if (!data) continue;
            const valueContainer = data.querySelector('.ReadOnlyValueContainer .Value');
            if (!valueContainer) continue;
            const colorSample = valueContainer.querySelector('.Right .Text.ColorSample');
            const value = cleanText(colorSample ? colorSample.textContent : valueContainer.textContent);
            if (!value) continue;
            const colorSource = valueContainer.querySelector('.Left.ColorSample, .BackgroundPatch.ColorSample, .ColorBand.ColorSwatch, .ColorSample');
            const color = colorSource ? window.getComputedStyle(colorSource).backgroundColor : '';
            return { value: value, color: color };
        }
        return { value: '', color: '' };
    }

    function isGenericOpportunityTitle(value) {
        const text = cleanText(value).toLowerCase();
        return !text ||
            text === 'opportunity' ||
            text === 'view opportunity' ||
            text === 'edit opportunity';
    }

    function findOpportunityTitle() {
        const copyButton = document.querySelector(
            '.CopyTextButton[title*="opportunity ID"], .CopyTextButton[title*="opportunity URL"]'
        );
        const copyTitle = copyButton && copyButton.closest('.Title');
        const copyTitleText = copyTitle && copyTitle.querySelector(':scope > .Text, .Text');
        const copyCandidate = cleanText(copyTitleText && copyTitleText.textContent);
        if (!isGenericOpportunityTitle(copyCandidate)) return copyCandidate;

        const candidates = document.querySelectorAll(
            '.EntityHeadingContainer .Title > .Text, ' +
            '.PageHeadingContainer .Title > .Text, ' +
            '.TitleBarItem.Title > .Text, ' +
            '.Title > .Text'
        );
        for (const candidate of candidates) {
            const text = cleanText(candidate.textContent);
            if (!isGenericOpportunityTitle(text)) return text;
        }
        return '';
    }

    // The ticket activity feed renders newest-first. The first
    // `.ConversationChunk .ConversationItem .Footer .Timestamp` is therefore
    // the most-recent activity timestamp (notes, time entries, attachments).
    function extractTicketLastActivity() {
        const ts = document.querySelector(
            '.ConversationChunk .ConversationItem .Footer .Timestamp'
        );
        return cleanText(ts && ts.textContent);
    }

    function extractTicketTitlebarInfo() {
        const secondaryEl = document.querySelector('.TitleBarItem.Title .SecondaryText, .Title .SecondaryText');
        const secondary = cleanText(secondaryEl && secondaryEl.textContent);
        const numberMatch = secondary.match(/\bT\d{8}\.\d{3,5}\b/);
        const organizationMatch = secondary.match(/\(([^()]*)\)\s*$/);
        const number = numberMatch ? numberMatch[0] : '';
        let title = secondary;
        if (number) title = title.replace(number, '');
        title = title
            .replace(/^\s*[-–]\s*/, '')
            .replace(/\s*\([^)]*\)\s*$/, '')
            .trim();
        return {
            number: number,
            title: title,
            organization: organizationMatch ? cleanText(organizationMatch[1]) : '',
        };
    }

    function extractTicketInfo() {
        const isTicketEditPage = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(location.href)) === '/mvc/servicedesk/ticketedit.mvc';
        const heading = document.querySelector('.EntityHeadingContainer');
        let number = '';
        let title = '';

        if (heading) {
            const idEl = heading.querySelector('.IdentificationText');
            if (idEl) number = cleanText(idEl.textContent);

            const titleEl = heading.querySelector('.Title > .Text');
            if (titleEl) title = cleanText(titleEl.textContent);
        }

        if (!number) {
            const m = document.title.match(/\bT\d{8}\.\d{3,5}\b/);
            if (m) number = m[0];
        }
        if (!title) {
            title = cleanText(document.title)
                .replace(/^Ticket\s*[-–]\s*/i, '')
                .replace(number, '')
                .replace(/^\s*[-–]\s*/, '');
        }

        const titlebarInfo = extractTicketTitlebarInfo();
        if (!number) number = titlebarInfo.number;
        if (isTicketEditPage || !title || /^edit ticket\s*[-–]?$/i.test(title)) title = titlebarInfo.title || title;

        const organization = findFieldValue('Organization') || titlebarInfo.organization;
        const contactName = findReadOnlyValueByLabel(['Contact', 'Contact Name']) ||
            findFieldValue('Contact') ||
            findFieldValue('Contact Name');
        const priorityField = findReadOnlyColorFieldByLabel(['Priority']);
        const statusField = findReadOnlyColorFieldByLabel(['Status']);
        const priority = priorityField.value || findReadOnlyValueByLabel(['Priority']);
        const status = statusField.value || findReadOnlyValueByLabel(['Status']);
        const lastActivity = extractTicketLastActivity();
        const primaryResource = extractPrimaryResourceInfo();
        const hoverFields = [
            { label: 'Ticket number', value: number.slice(0, 40) },
            { label: 'Status', value: status.slice(0, 40) },
            { label: 'Priority', value: priority.slice(0, 40) },
            { label: 'Last activity', value: lastActivity.slice(0, 40) },
        ].filter(field => field.value);

        return {
            title: title || 'Ticket',
            number: 'Ticket',
            contact: organization.slice(0, 80),
            primaryResource: primaryResource,
            priority: priority.slice(0, 40),
            status: status.slice(0, 40),
            lastActivity: lastActivity.slice(0, 40),
            hoverFields: hoverFields,
            metadataFields: {
                type: 'Ticket',
                number: number.slice(0, 40),
                organization: organization.slice(0, 80),
                contact: contactName.slice(0, 80),
                status: status.slice(0, 40),
                statusColor: statusField.color,
                priority: priority.slice(0, 40),
                priorityColor: priorityField.color,
                lastActivity: lastActivity.slice(0, 40),
                primaryResource: primaryResource && primaryResource.name || '',
            },
        };
    }

    function extractTaskInfo() {
        const heading = document.querySelector('.EntityHeadingContainer');
        let number = '';
        let title = '';

        if (heading) {
            const idEl = heading.querySelector('.IdentificationText');
            if (idEl) number = cleanText(idEl.textContent);

            const titleEl = heading.querySelector('.Title > .Text');
            if (titleEl) title = cleanText(titleEl.textContent);
        }

        if (!title) {
            title = cleanText(document.title)
                .replace(/^Task\s*[-–]\s*/i, '')
                .replace(number, '')
                .replace(/^\s*[-–]\s*/, '');
        }

        const project = findReadOnlyValueByLabel(['Project']) || findFieldValue('Project');
        const organization = findFieldValue('Organization') || findReadOnlyValueByLabel(['Organization']);
        const contactName = findReadOnlyValueByLabel(['Contact', 'Contact Name']) ||
            findFieldValue('Contact') ||
            findFieldValue('Contact Name');
        const priorityField = findReadOnlyColorFieldByLabel(['Priority']);
        const statusField = findReadOnlyColorFieldByLabel(['Status']);
        const priority = priorityField.value || findReadOnlyValueByLabel(['Priority']);
        const status = statusField.value || findReadOnlyValueByLabel(['Status']);
        const lastActivity = extractTicketLastActivity();
        const primaryResource = extractPrimaryResourceInfo();
        const hoverFields = [
            { label: 'Task ID', value: number.slice(0, 40) },
            { label: 'Project', value: project.slice(0, 120) },
            { label: 'Status', value: status.slice(0, 40) },
            { label: 'Priority', value: priority.slice(0, 40) },
            { label: 'Last activity', value: lastActivity.slice(0, 40) },
        ].filter(field => field.value);

        return {
            title: title || 'Task',
            number: 'Task',
            contact: organization.slice(0, 80),
            primaryResource: primaryResource,
            priority: priority.slice(0, 40),
            status: status.slice(0, 40),
            lastActivity: lastActivity.slice(0, 40),
            hoverFields: hoverFields,
            metadataFields: {
                type: 'Task',
                number: number.slice(0, 40),
                project: project.slice(0, 120),
                organization: organization.slice(0, 80),
                contact: contactName.slice(0, 80),
                status: status.slice(0, 40),
                statusColor: statusField.color,
                priority: priority.slice(0, 40),
                priorityColor: priorityField.color,
                lastActivity: lastActivity.slice(0, 40),
                primaryResource: primaryResource && primaryResource.name || '',
            },
        };
    }

    function extractRecurringTicketInfo() {
        const params = new URLSearchParams(location.search);
        const id = (params.get('recurring_ticket_id') || params.get('recurringTicketId') || '').trim();
        const heading = document.querySelector('.EntityHeadingContainer, .PageHeadingContainer, .TitleBar');
        let title = '';

        if (heading) {
            const titleEl = heading.querySelector('.Title > .Text, .TitleBarItem.Title .Text, .Text');
            if (titleEl) title = cleanText(titleEl.textContent);
        }

        if (!title) {
            title = cleanText(document.title)
                .replace(/^Autotask\s*[-–]\s*/i, '')
                .replace(/^Recurring\s+Ticket\s*[-–]?\s*/i, '');
        }

        return {
            title: title || 'Recurring Ticket',
            number: id ? ('ID ' + id).slice(0, 40) : 'Recurring Ticket',
            contact: '',
            primaryResource: null,
            metadataFields: {
                type: 'Ticket',
                id: id ? ('ID ' + id).slice(0, 40) : '',
            },
        };
    }

    function extractPrimaryResourceInfo() {
        try {
            const root = document.querySelector('.PrimaryResource');
            if (!root) return null;

            const nameEl = root.querySelector('.Name .Text2') || root.querySelector('.Name');
            const imgEl = root.querySelector('.Left img[src], img[src]');
            const photoUrl = imgEl ? AUTOTASKTABS.toAbsoluteUrl(decodeUrl(imgEl.getAttribute('src') || '')) : '';
            const initialsEl = root.querySelector('.Initials');
            const initials = cleanText(initialsEl && initialsEl.textContent).slice(0, 4);
            if (!initials && !photoUrl) return null;

            const className = initialsEl ? String(initialsEl.className || '') : '';
            const colorClassMatch = className.match(/\bColor\d+\b/);
            let bgColor = '';
            let textColor = '';
            let borderColor = '';

            if (initialsEl) try {
                const styles = window.getComputedStyle(initialsEl);
                bgColor = styles.backgroundColor || '';
                textColor = styles.color || '';
                borderColor = styles.borderColor || '';
            } catch (e) {}

            return {
                initials: initials,
                name: cleanText(nameEl && nameEl.textContent).slice(0, 80),
                photoUrl: photoUrl,
                colorClass: colorClassMatch ? colorClassMatch[0] : '',
                bgColor: bgColor,
                textColor: textColor,
                borderColor: borderColor,
            };
        } catch (e) {
            console.warn('AUTOTASKTABS: primary resource metadata extraction failed', e);
            return null;
        }
    }

    function extractContractInfo() {
        const params = new URLSearchParams(location.search);
        const urlName = (params.get('ContractName') || '').trim();
        const urlId = (params.get('contractID') || '').trim();
        const urlOrg = (params.get('ClientName') || '').trim();

        let name = urlName;
        let id = urlId;
        let org = urlOrg;

        const secondary = document.querySelector('.SecondaryTitle');
        if (secondary) {
            const txt = cleanText(secondary.textContent);
            if (!id) {
                const m = txt.match(/ID:\s*(\d+)/i);
                if (m) id = m[1];
            }
            if (!name) {
                const m = txt.match(/^(.+?)\s*\(ID:/i);
                if (m) name = m[1].trim();
            }
        }

        if (!org) {
            for (const td of document.querySelectorAll('td.FieldLabels')) {
                const label = cleanText(td.textContent).toLowerCase();
                if (label === 'organization name') {
                    const valueTd = td.nextElementSibling;
                    if (valueTd) org = cleanText(valueTd.textContent);
                    break;
                }
            }
        }

        function findContractField(labelText) {
            const wanted = String(labelText || '').toLowerCase();
            for (const td of document.querySelectorAll('td.FieldLabels')) {
                const label = cleanText(td.textContent).toLowerCase();
                if (label !== wanted) continue;
                const valueTd = td.nextElementSibling;
                return valueTd ? cleanText(valueTd.textContent) : '';
            }
            return '';
        }

        const contractType = findContractField('Contract Type');
        const contractCategory = findContractField('Contract Category');
        const purchaseOrderNumber = findContractField('Purchase Order Number');
        const accountManager = findContractField('Account Manager');
        const contactName = findContractField('Contact Name');
        const serviceLevelAgreement = findContractField('Service Level Agreement');
        const opportunity = findContractField('Opportunity');
        const defaultServiceDeskContract = findContractField('Default Service Desk Contract');
        const startDate = findContractField('Start Date');
        const endDate = findContractField('End Date');
        const period = findContractField('Contract Period Type');
        const hoverFields = [
            { label: 'Account Manager', value: accountManager },
            { label: 'Contact Name', value: contactName },
            { label: 'Service Level Agreement', value: serviceLevelAgreement },
            { label: 'Opportunity', value: opportunity },
            { label: 'Default SD Contract', value: defaultServiceDeskContract },
            { label: 'Contract Type', value: contractType },
            { label: 'Category', value: contractCategory },
            { label: 'Start date', value: startDate },
            { label: 'End date', value: endDate },
            { label: 'Period', value: period },
        ].filter(field => field.value);

        return {
            title: name || 'Contract',
            number: id ? ('ID ' + id).slice(0, 40) : 'Contract',
            contact: org.slice(0, 80),
            hoverFields: hoverFields,
            metadataFields: {
                type: 'Contract',
                id: id ? ('ID ' + id).slice(0, 40) : '',
                organization: org.slice(0, 80),
                contractType: contractType.slice(0, 80),
                contractCategory: contractCategory.slice(0, 80),
                purchaseOrderNumber: purchaseOrderNumber.slice(0, 80),
                accountManager: accountManager.slice(0, 80),
                contactName: contactName.slice(0, 80),
                serviceLevelAgreement: serviceLevelAgreement.slice(0, 80),
                opportunity: opportunity.slice(0, 120),
                defaultServiceDeskContract: defaultServiceDeskContract.slice(0, 80),
                startDate: startDate.slice(0, 80),
                endDate: endDate.slice(0, 80),
                period: period.slice(0, 80),
            },
        };
    }

    function extractNewContractWizardInfo() {
        const info = extractGenericInfo('Contract');
        const titleEl = document.querySelector('.TitleBarItem.Title > .Text, .PageHeadingContainer .Title .Text, .Title .Text');
        const secondaryEl = document.querySelector('.TitleBarItem.Title .SecondaryText, .Title .SecondaryText, .SecondaryTitle');
        let title = cleanText(titleEl && titleEl.textContent) || info.title || 'New Contract Wizard';
        let secondaryTitle = cleanSecondaryTitleText(secondaryEl && secondaryEl.textContent) || info.number || '';

        if (!secondaryTitle && /\s+-\s+/.test(title)) {
            const parts = title.split(/\s+-\s+/);
            title = cleanText(parts.shift()) || title;
            secondaryTitle = cleanText(parts.join(' - '));
        } else if (secondaryTitle) {
            const suffix = new RegExp('\\s+-\\s+' + secondaryTitle.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i');
            title = cleanText(title.replace(suffix, '')) || title;
        }

        return {
            title: title,
            number: secondaryTitle,
            contact: '',
            hoverFields: secondaryTitle ? [{ label: 'Contract type', value: secondaryTitle }] : [],
            metadataFields: Object.assign({}, info.metadataFields || {}, {
                type: 'Contract',
                secondaryTitle: secondaryTitle.slice(0, 120),
                contractType: secondaryTitle.slice(0, 80),
            }),
        };
    }

    function extractAccountInfo() {
        const heading = document.querySelector('.EntityHeadingContainer');
        let number = '', title = '';
        if (heading) {
            const idEl = heading.querySelector('.IdentificationText');
            if (idEl) number = cleanText(idEl.textContent).replace(/^ID\b\s*:?\s*/i, '');
            const titleEl = heading.querySelector('.Title > .Text');
            if (titleEl) title = cleanText(titleEl.textContent);
        }
        const classification = findFieldValue('Classification');
        return {
            title: title || 'Organization',
            number: number ? ('ID ' + number).slice(0, 40) : 'Organization',
            contact: classification.slice(0, 80),
            metadataFields: {
                type: 'Organization',
                id: number ? ('ID ' + number).slice(0, 40) : '',
            },
        };
    }

    function extractPersonInfo() {
        const heading = document.querySelector('.EntityHeadingContainer');
        let number = '', title = '';
        if (heading) {
            const idEl = heading.querySelector('.IdentificationText');
            if (idEl) number = cleanText(idEl.textContent).replace(/^ID\b\s*:?\s*/i, '');
            const titleEl = heading.querySelector('.Title > .Text');
            if (titleEl) title = cleanText(titleEl.textContent);
        }
        const organization = findFieldValue('Organization') ||
            findFieldValue('Organization Name') ||
            findFieldValue('Company') ||
            findFieldValue('Company Name') ||
            findFieldValue('Account') ||
            findFieldValue('Account Name') ||
            findFieldValue('Customer') ||
            findFieldValue('Client');
        return {
            title: title || cleanText(document.title) || 'Person',
            number: number ? ('ID ' + number).slice(0, 40) : 'Person',
            contact: organization.slice(0, 80),
            metadataFields: {
                type: 'Person',
                id: number ? ('ID ' + number).slice(0, 40) : '',
                organization: organization.slice(0, 80),
            },
        };
    }

    function extractProjectInfo() {
        const heading = document.querySelector('.EntityHeadingContainer');
        let number = '', title = '';
        if (heading) {
            const idEl = heading.querySelector('.IdentificationText');
            if (idEl) number = cleanText(idEl.textContent).replace(/^ID\b\s*:?\s*/i, '');
            const titleEl = heading.querySelector('.Title > .Text');
            if (titleEl) title = cleanText(titleEl.textContent);
        }
        const organization = findFieldValue('Organization') ||
            findFieldValue('Organization Name') ||
            findFieldValue('Account') ||
            findFieldValue('Account Name') ||
            findFieldValue('Customer');
        return {
            title: title || cleanText(document.title) || 'Project',
            number: number ? ('ID ' + number).slice(0, 40) : 'Project',
            contact: organization.slice(0, 80),
            metadataFields: {
                type: 'Project',
                id: number ? ('ID ' + number).slice(0, 40) : '',
                organization: organization.slice(0, 80),
            },
        };
    }

    function extractInstalledProductInfo() {
        const hostname = findReadOnlyValueByLabel(['Hostname']) ||
            findFieldValue('Hostname');
        const deviceTitle = cleanText(document.querySelector('.Title > .Text')?.textContent);
        const serialNumber = findReadOnlyValueByLabel(['Serial Number']) ||
            findFieldValue('Serial Number');
        const organization = findReadOnlyValueByLabel(['Organization']) ||
            findFieldValue('Organization') ||
            findFieldValue('Organization Name') ||
            findFieldValue('Account') ||
            findFieldValue('Account Name');
        const deviceType = findReadOnlyValueByLabel(['Type']) || findFieldValue('Type');
        const manufacturer = findReadOnlyValueByLabel(['Manufacturer']) || findFieldValue('Manufacturer');
        const model = findReadOnlyValueByLabel(['Model']) || findFieldValue('Model');
        const internalIp = findReadOnlyValueByLabel(['Internal IP Address']) || findFieldValue('Internal IP Address');
        const antivirusStatus = findReadOnlyValueByLabel(['Antivirus Status']) || findFieldValue('Antivirus Status');
        const patchStatus = findReadOnlyValueByLabel(['Patch Status']) || findFieldValue('Patch Status');
        const hoverFields = [
            { label: 'Serial Number', value: serialNumber },
            { label: 'Device type', value: deviceType },
            { label: 'Manufacturer', value: manufacturer },
            { label: 'Model', value: model },
            { label: 'Internal IP', value: internalIp },
            { label: 'Antivirus', value: antivirusStatus },
            { label: 'Patch status', value: patchStatus },
        ].map(field => ({
            label: field.label,
            value: cleanText(field.value).slice(0, 120),
        })).filter(field => field.value);
        return {
            title: hostname || deviceTitle || cleanText(document.title) || 'Device',
            number: 'Device',
            contact: organization.slice(0, 80),
            hoverFields: hoverFields,
            metadataFields: {
                type: 'Device',
                serialNumber: serialNumber.slice(0, 80),
                organization: organization.slice(0, 80),
                deviceType: cleanText(deviceType).slice(0, 80),
                manufacturer: cleanText(manufacturer).slice(0, 80),
                model: cleanText(model).slice(0, 120),
                internalIp: cleanText(internalIp).slice(0, 80),
                antivirusStatus: cleanText(antivirusStatus).slice(0, 80),
                patchStatus: cleanText(patchStatus).slice(0, 80),
            },
        };
    }

    function extractNoteInfo() {
        const secondaryEl = document.querySelector('.TitleBarItem.Title .SecondaryText, .Title .SecondaryText');
        const secondary = cleanText(secondaryEl && secondaryEl.textContent);
        let title = '';
        let organization = '';

        if (secondary) {
            const titleMatch = secondary.match(/^-\s*(.+?)\s*\(/);
            if (titleMatch) title = titleMatch[1].trim();
            const orgMatch = secondary.match(/\(([^()]*)\)\s*$/);
            if (orgMatch) organization = orgMatch[1].trim();
        }

        const opportunity = findReadOnlyValueByLabel(['Opportunity']) ||
            findFieldValue('Opportunity');

        return {
            title: title || cleanText(document.title).replace(/^View Note\s*[-–]?\s*/i, '') || 'Note',
            number: 'Note',
            contact: organization.slice(0, 80),
            hoverFields: opportunity ? [{ label: 'Opportunity', value: opportunity.slice(0, 120) }] : [],
            metadataFields: {
                type: 'Note',
                opportunity: opportunity.slice(0, 120),
                organization: organization.slice(0, 80),
            },
        };
    }

    function cleanSecondaryTitleText(text) {
        return cleanText(text)
            .replace(/^[-–]\s*/, '')
            .replace(/\s*\([^)]*\)\s*$/, '')
            .trim();
    }

    function firstVisibleTextFallback() {
        const candidates = document.querySelectorAll('h1, h2, h3, [role="heading"], header, div, span');
        for (const el of candidates) {
            const tagName = String(el.tagName || '').toLowerCase();
            if (tagName === 'script' || tagName === 'style' || tagName === 'noscript') continue;
            const text = cleanText(el.textContent);
            if (!text || text.length < 2) continue;
            const style = window.getComputedStyle ? window.getComputedStyle(el) : null;
            if (style && (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0')) continue;
            const rects = typeof el.getClientRects === 'function' ? el.getClientRects() : [];
            if (!rects || rects.length === 0) continue;
            return text.slice(0, 120);
        }
        return '';
    }

    function extractInvoiceTemplateInfo() {
        const titleEl = document.querySelector('.TitleBarItem.Title .Text, .Title .Text');
        const secondaryEl = document.querySelector('.TitleBarItem.Title .SecondaryText, .Title .SecondaryText');
        const section = cleanText(titleEl && titleEl.textContent) ||
            cleanText(document.title).replace(/^Autotask\s*[-–]\s*/i, '') ||
            'Invoice Template';
        const stableSection = 'Invoice Template';
        const entityName = cleanSecondaryTitleText(secondaryEl && secondaryEl.textContent);
        const params = new URLSearchParams(location.search);
        const templateId = params.get('invoiceTemplateId') ||
            params.get('invoiceTemplateID') ||
            params.get('invoicetemplateid') ||
            '';
        const fallbackId = templateId ? ('ID ' + templateId).slice(0, 40) : '';

        return {
            title: entityName.slice(0, 120) || fallbackId || 'Invoice Template',
            number: stableSection,
            contact: '',
            metadataFields: {
                type: 'Administration',
                id: stableSection,
                secondaryTitle: stableSection,
            },
        };
    }

    function extractInvoiceViewerInfo() {
        const params = new URLSearchParams(location.search);
        const invoiceId = params.get('invoiceId') || params.get('invoiceID') || params.get('invoiceid') || '';
        const batchId = params.get('batchId') || params.get('batchID') || params.get('batchid') || '';
        const titleEl = document.querySelector('.TitleBarItem.Title .Text, .Title .Text');
        const titleFromPage = cleanText(titleEl && titleEl.textContent);
        const selectedInvoiceOption = document.querySelector('.ToolBarItem.Pager select option[selected], .ToolBarItem.Pager select option:checked, .ToolBarItem.Pager select');
        const optionText = cleanText(selectedInvoiceOption && (selectedInvoiceOption.selectedOptions && selectedInvoiceOption.selectedOptions[0]
            ? selectedInvoiceOption.selectedOptions[0].textContent
            : selectedInvoiceOption.textContent));
        let organization = '';
        let purchaseOrder = '';
        const poMatch = optionText.match(/^(.*?)\s*\(PO:\s*(.*?)\)\s*$/i);
        if (poMatch) {
            organization = cleanText(poMatch[1]);
            purchaseOrder = cleanText(poMatch[2]);
        } else {
            organization = optionText;
        }
        const title = titleFromPage || organization || (invoiceId ? 'Invoice ' + invoiceId : batchId ? 'Invoice Batch ' + batchId : 'Invoice');
        return {
            title: title.slice(0, 120),
            number: purchaseOrder || (invoiceId ? 'ID ' + invoiceId : batchId ? 'Batch ' + batchId : 'Invoice'),
            contact: organization,
            metadataFields: {
                type: 'Invoice',
                id: invoiceId ? 'ID ' + invoiceId : '',
                purchaseOrder: purchaseOrder,
                organization: organization,
            },
        };
    }

    function extractAdminTitlebarPageInfo(entityFallback, sectionFallback) {
        const titleEl = document.querySelector('.TitleBarItem.Title .Text, .Title .Text');
        const secondaryEl = document.querySelector('.TitleBarItem.Title .SecondaryText, .Title .SecondaryText, .SecondaryTitle');
        const section = cleanText(titleEl && titleEl.textContent) || sectionFallback || 'Administration';
        const entityName = cleanSecondaryTitleText(secondaryEl && secondaryEl.textContent) || entityFallback || section;

        return {
            title: entityName.slice(0, 120),
            number: section.slice(0, 120),
            contact: '',
            metadataFields: {
                type: 'Administration',
                id: section.slice(0, 120),
                secondaryTitle: section.slice(0, 120),
            },
        };
    }

    function extractAdminNamePageInfo(newTitle, editTitle, inputSelector) {
        const params = new URLSearchParams(location.search);
        const objectId = params.get('objectid') || params.get('objectId') || params.get('ObjectId') || '';
        const isEdit = !!objectId && objectId !== '0';
        const input = document.querySelector(inputSelector);
        const name = cleanText(input && input.value).slice(0, 120);

        return {
            title: isEdit ? editTitle : newTitle,
            number: isEdit ? name : '',
            contact: '',
            metadataFields: {
                type: 'Administration',
                id: isEdit ? name : '',
                secondaryTitle: isEdit ? name : '',
            },
        };
    }

    function extractResourceManagementInfo() {
        const params = new URLSearchParams(location.search);
        const webId = params.get('webID') || params.get('webId') || params.get('webid') || '';
        const secondary = cleanSecondaryTitleText(document.querySelector('.SecondaryTitle') && document.querySelector('.SecondaryTitle').textContent);
        const primary = webId ? secondary.slice(0, 120) : 'New User';

        return {
            title: primary,
            number: 'Resource Management',
            contact: '',
            metadataFields: {
                type: 'Administration',
                id: 'Resource Management',
                secondaryTitle: 'Resource Management',
            },
        };
    }

    function extractApiUserInfo() {
        const p = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(location.href));
        const isEdit = p === '/mvc/administrationsetup/apiuser.mvc/editapiuser';
        const titleBar = document.querySelector('.TitleBarItem.Title, .Title');
        const titleEl = titleBar && titleBar.querySelector('.Text');
        const secondaryEl = titleBar && titleBar.querySelector('.SecondaryText');
        let secondary = cleanSecondaryTitleText(secondaryEl && secondaryEl.textContent);
        if (!secondary && titleBar) {
            const titleText = cleanText(titleEl && titleEl.textContent);
            secondary = cleanSecondaryTitleText(cleanText(titleBar.textContent).replace(titleText, ''));
        }
        const primary = isEdit ? (secondary.slice(0, 120) || 'API User') : 'New API User';

        return {
            title: primary,
            number: 'Resource Management',
            contact: '',
            metadataFields: {
                type: 'Administration',
                id: 'Resource Management',
                secondaryTitle: 'Resource Management',
            },
        };
    }

    function extractOpportunityInfo() {
        const heading = document.querySelector('.EntityHeadingContainer, .PageHeadingContainer');
        let title = findOpportunityTitle();
        let id = '';

        if (heading) {
            const idEl = heading.querySelector('.IdentificationText');
            if (idEl) id = cleanText(idEl.textContent);
        }

        if (!id) {
            const params = new URLSearchParams(location.search);
            const opportunityId = params.get('opportunityId') || params.get('opportunityid');
            if (opportunityId) id = 'ID ' + opportunityId;
        }

        const organization = findReadOnlyValueByLabel(['Organization']) ||
            findFieldValue('Organization') ||
            findFieldValue('Organization Name') ||
            findFieldValue('Account') ||
            findFieldValue('Account Name');

        return {
            title: title || (!isGenericOpportunityTitle(document.title) ? cleanText(document.title) : '') || 'Opportunity',
            number: id.slice(0, 40),
            contact: organization.slice(0, 80),
            primaryResource: extractPrimaryResourceInfo(),
            metadataFields: {
                type: 'Opportunity',
                id: id.slice(0, 40),
                organization: organization.slice(0, 80),
            },
        };
    }

    function extractSalesOrderInfo() {
        const secondaryEl = document.querySelector('#PageHeaderSecondaryLabel, .SecondaryTitle');
        const secondary = cleanText(secondaryEl && secondaryEl.textContent);
        let title = '';
        let id = '';
        let organization = '';

        if (secondary) {
            const match = secondary.match(/^-\s*(.+?)\s*\(ID:\s*([^)]+)\)\s*\|\s*(.+)$/i);
            if (match) {
                title = match[1].trim();
                id = 'ID ' + match[2].trim();
                organization = match[3].trim();
            }
        }

        if (!id) {
            const params = new URLSearchParams(location.search);
            const salesOrderId = params.get('salesorderid') || params.get('salesOrderId');
            if (salesOrderId) id = 'ID ' + salesOrderId;
        }

        return {
            title: title || cleanText(document.title) || 'Sales Order',
            number: id.slice(0, 40),
            contact: organization.slice(0, 80),
            metadataFields: {
                type: 'Sales Order',
                id: id.slice(0, 40),
                organization: organization.slice(0, 80),
            },
        };
    }

    function parsePurchaseOrderIdFromTitle(rawTitle) {
        const match = cleanText(rawTitle || '').match(/\(ID:\s*([^)]+)\)/i);
        if (!match || !match[1]) return '';
        return cleanText(match[1]).replace(/^ID\s*[:#-]?\s*/i, '');
    }

    function findLegacyPurchaseOrderValueByLabel(labelText) {
        const wanted = cleanText(labelText).toLowerCase();
        for (const label of document.querySelectorAll('td span.lblNormalClass')) {
            if (cleanText(label.textContent).toLowerCase() !== wanted) continue;
            const valueCell = label.closest('td')?.nextElementSibling;
            const input = valueCell && valueCell.querySelector('input');
            if (input) return cleanText(input.value);
            return cleanText(valueCell && valueCell.textContent);
        }
        return '';
    }

    function extractPurchaseOrderInfo() {
        const params = new URLSearchParams(location.search);
        const id = (
            params.get('id') ||
            params.get('ID') ||
            params.get('purchaseOrderId') ||
            params.get('purchaseorderid') ||
            params.get('purchaseOrderID') ||
            parsePurchaseOrderIdFromTitle(document.querySelector('.TitleContainer')?.textContent) ||
            parsePurchaseOrderIdFromTitle(document.title)
        ).trim();
        const vendor = cleanText(
            (document.getElementById('dataSelectorVendor_ATTextEdit') || {}).value
        ).slice(0, 120);
        const organization = cleanText(
            (document.getElementById('dataSelectorAccount_ATTextEdit') || {}).value
        ).slice(0, 120);
        const externalPoNumber = findLegacyPurchaseOrderValueByLabel('External P.O. #').slice(0, 120);

        const normalizedId = id ? ('ID ' + id) : '';
        return {
            title: 'Purchase Order',
            number: normalizedId,
            contact: organization.slice(0, 80),
            hoverFields: externalPoNumber ? [{ label: 'External P.O. #', value: externalPoNumber }] : [],
            metadataFields: {
                type: 'Purchase Order',
                id: normalizedId,
                externalPoNumber: externalPoNumber,
                organization: organization,
                vendor: vendor,
            },
        };
    }

    function findLegacyFieldLabelValue(labelText) {
        const wanted = labelText.toLowerCase();
        for (const cell of document.querySelectorAll('td.FieldLabels')) {
            const clone = cell.cloneNode(true);
            const div = clone.querySelector('div');
            if (div) div.remove();
            if (cleanText(clone.textContent).toLowerCase() !== wanted) continue;

            const valueDiv = cell.querySelector('div');
            if (!valueDiv) return '';
            const selected = valueDiv.querySelector('select option:checked');
            if (selected && cleanText(selected.textContent) && selected.value) {
                return cleanText(selected.textContent);
            }
            const input = valueDiv.querySelector('input');
            if (input) return cleanText(input.value);
            return cleanText(valueDiv.textContent);
        }
        return '';
    }

    function extractQuoteInfo() {
        const params = new URLSearchParams(location.search);
        const path = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(location.href));
        const quoteId = params.get('QuoteID') ||
            params.get('quoteID') ||
            params.get('quoteId') ||
            params.get('objectID') ||
            findLegacyFieldLabelValue('Quote Number');
        let quoteName = '';
        let organization = '';

        if (path === '/opportunity/quotes/quote.asp') {
            const secondary = cleanText(document.querySelector('.SecondaryTitle')?.textContent);
            const match = secondary.match(/^-\s*(.+?)\s*\(\d+\)\s*$/);
            if (match) quoteName = match[1].trim();
        } else {
            quoteName = findLegacyFieldLabelValue('Opportunity Name');
            organization = findLegacyFieldLabelValue('Organization Name') ||
                findLegacyFieldLabelValue('Organization') ||
                findLegacyFieldLabelValue('Account Name') ||
                findLegacyFieldLabelValue('Account');
        }

        return {
            title: quoteId ? 'Quote ' + quoteId : 'Quote',
            number: 'Quote',
            contact: organization.slice(0, 80),
            hoverFields: quoteName ? [{ label: 'Quote name', value: quoteName.slice(0, 120) }] : [],
            metadataFields: {
                type: 'Quote',
                id: quoteId ? ('ID ' + quoteId).slice(0, 40) : '',
                quoteName: quoteName.slice(0, 120),
                organization: organization.slice(0, 80),
            },
        };
    }

    function extractContactGroupInfo() {
        const params = new URLSearchParams(location.search);
        const groupId = params.get('groupid') || params.get('groupId');
        const secondary = cleanText(document.querySelector('.SecondaryTitle')?.textContent)
            .replace(/^[-–]\s*/, '');
        const heading = cleanText(document.querySelector('.EntityHeadingContainer .Title > .Text, .PageHeadingContainer .Title .Text, h1, .Title')?.textContent);

        return {
            title: secondary || heading || (groupId && groupId !== '0' ? 'Contact Group' : 'New Contact Group'),
            number: groupId && groupId !== '0' ? ('ID ' + groupId).slice(0, 40) : 'Group',
            contact: '',
            metadataFields: {
                type: 'Group',
                id: groupId && groupId !== '0' ? ('ID ' + groupId).slice(0, 40) : '',
            },
        };
    }

    function extractInventoryProductInfo() {
        const params = new URLSearchParams(location.search);
        const productMode = String(params.get('cmd') || '').toLowerCase();
        const titleEl = document.querySelector('.TitleBarItem.Title > .Text, .PageHeadingContainer .Title .Text, .Title .Text, h1');
        const chipText = cleanText(document.querySelector('.ChipList.SingleDataSelection .Chip .Text, .ChipList .Chip .Text')?.textContent);
        const legacyProductInput = document.getElementById('txtProductName_ATTextEdit');
        const legacyCategoryInput = document.getElementById('txtProductCategory_ATTextEdit');
        const activeCheckbox = document.getElementById('chkActive_ATCheckBox');
        const categoryText = cleanText(document.querySelector('.SelectionDisplay .Item[data-item-type="SingleText"] .Text, .SelectionDisplay .Item .Text')?.textContent) ||
            cleanText(legacyCategoryInput && legacyCategoryInput.value);
        const isInactiveChip = /\(\s*inactive\s*\)\s*$/i.test(chipText);
        const productName = cleanText(chipText.replace(/\(\s*inactive\s*\)\s*$/i, '')) ||
            cleanText(legacyProductInput && legacyProductInput.value);
        const isInactive = isInactiveChip || !!(activeCheckbox && !activeCheckbox.checked);
        const title = productName || cleanText(titleEl && titleEl.textContent) || 'New Inventory Product';
        const isNew = !productName;
        const isLegacyNew = productMode === 'new' || String(params.get('productID') || params.get('productId') || '').trim() === '0';
        return {
            title: isNew || isLegacyNew ? 'New Inventory Product' : title,
            number: categoryText,
            contact: '',
            primaryResource: null,
            hoverFields: categoryText ? [{ label: 'Category', value: categoryText.slice(0, 120) }] : [],
            metadataFields: {
                type: 'Inventory Product',
                productCategory: categoryText.slice(0, 120),
                productInactive: isInactive ? 'true' : '',
                productIsNew: isNew || isLegacyNew ? 'true' : '',
            },
        };
    }

    function extractGenericInfo(fallbackTitle) {
        const heading = document.querySelector('.TitleBarItem.Title > .Text, .EntityHeadingContainer .Title > .Text, .PageHeadingContainer .Title .Text, h1, .Title');
        const secondaryEl = document.querySelector('.TitleBarItem.Title .SecondaryText, .Title .SecondaryText, .SecondaryTitle');
        const title = cleanText(heading && heading.textContent) ||
            cleanText(document.title).replace(/^Autotask\s*[-–]\s*/i, '');
        const secondaryTitle = cleanSecondaryTitleText(secondaryEl && secondaryEl.textContent);
        const visibleFallback = title || secondaryTitle ? '' : firstVisibleTextFallback();
        return {
            title: title || visibleFallback || fallbackTitle || 'Autotask page',
            number: secondaryTitle || fallbackTitle || '',
            contact: '',
            primaryResource: null,
            metadataFields: {
                type: fallbackTitle || 'Unknown',
                secondaryTitle: secondaryTitle.slice(0, 120),
            },
        };
    }


    function extractTicketActivityInfo() {
        const info = extractGenericInfo('Notes and Time Entries');
        const ticketNumber = cleanText(document.querySelector('.Left .IdentificationTextContainer .IdentificationText, .IdentificationText')?.textContent);
        const ticketTitle = cleanText(document.querySelector('.Left > .Title .Text, .IdentificationTextContainer + .Title .Text')?.textContent);
        const organizationMatch = ticketTitle.match(/\(([^()]*)\)\s*$/);
        const organization = cleanText(organizationMatch && organizationMatch[1]);

        info.number = ticketNumber || info.number || '';
        info.contact = organization || info.contact || '';
        info.hoverFields = ticketNumber ? [{ label: 'Ticket number', value: ticketNumber.slice(0, 40) }] : [];
        info.metadataFields = Object.assign({}, info.metadataFields || {}, {
            type: 'Notes and Time Entries',
            number: info.number,
            ticketTitle: ticketTitle,
            organization: organization,
        });
        return info;
    }

    function extractSecondaryName(text) {
        const txt = cleanText(text);
        if (!txt) return '';

        const dashMatch = txt.match(/^(?:[-\u2010-\u2015\u2212])\s*(.+?)(?:\s*\(|$)/);
        if (dashMatch) {
            return dashMatch[1].trim().slice(0, 80);
        }

        const parenMatch = txt.match(/^(.+?)\s*\(/);
        if (parenMatch) {
            return parenMatch[1].trim().slice(0, 80);
        }

        return txt.slice(0, 80);
    }

    function extractSecondaryDate(text) {
        const txt = cleanText(text);
        if (!txt) return '';
        const match = txt.match(/\b(\d{2}\/\d{2}\/\d{4})\b/);
        return match ? match[1] : '';
    }

    function extractTimesheetInfo() {
        const info = extractGenericInfo('Timesheet');
        const secondary = queryAcrossAccessibleDocuments('.SecondaryTitle', 3);
        if (!secondary) {
            info.number = 'Timesheet';
            return info;
        }

        const date = extractSecondaryDate(secondary.textContent).slice(0, 40);
        info.number = 'Timesheet';
        info.contact = extractSecondaryName(secondary.textContent);
        info.hoverFields = date ? [{ label: 'Date', value: date }] : [];
        info.metadataFields = {
            type: 'Timesheet',
            date: date,
            contact: info.contact,
        };
        return info;
    }

    function extractInfo() {
        if (isUmbrellaContractFrameUrl(location.href)) {
            return extractUmbrellaContractInfo();
        }
        const p = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(location.href));
        if (p === '/mvc/inventory/costitem.mvc/shipping') {
            return extractGenericInfo('Shipping');
        }
        if (p === '/home/timeentry/wrkentryframes.asp' ||
            p === '/timesheets/views/readonly/tmsreadonly_100.asp') {
            return extractTimesheetInfo();
        }
        if (p === '/mvc/contracts/newcontractwizard.mvc/newcontractwizard') {
            return extractNewContractWizardInfo();
        }
        if (p === '/contracts/views/contractview.asp' || p === '/contracts/views/contractsummary.asp') {
            return extractContractInfo();
        }
        if (p === '/autotask/popups/tickets/recurring_ticket.aspx') {
            return extractRecurringTicketInfo();
        }
        if (p === '/mvc/crm/accountdetail.mvc') {
            return extractAccountInfo();
        }
        if (p === '/mvc/crm/installedproductdetail.mvc') {
            return extractInstalledProductInfo();
        }
        if (p === '/mvc/crm/note.mvc/view') {
            return extractNoteInfo();
        }
        if (p === '/mvc/servicedesk/ticketdetail.mvc' || p === '/mvc/servicedesk/ticketedit.mvc') {
            return extractTicketInfo();
        }
        if (p === '/mvc/servicedesk/timeentry.mvc/newtickettimeentrypage' ||
            p === '/mvc/servicedesk/note.mvc/newticketnotepage') {
            return extractTicketActivityInfo();
        }
        if (p === '/mvc/administrationsetup/invoicetemplate.mvc/editinvoicetemplate') {
            return extractInvoiceTemplateInfo();
        }
        if (p === '/mvc/administrationsetup/invoicetemplate.mvc/editproperties') {
            return extractAdminTitlebarPageInfo('Invoice Template', 'Invoice Template Properties');
        }
        if (p === '/mvc/contracts/invoiceemailtemplate.mvc/editinvoiceemailtemplate') {
            return extractAdminTitlebarPageInfo('Invoice Email Template', 'Invoice Email Template');
        }
        if (p === '/mvc/contracts/invoiceviewer.mvc' ||
            p === '/mvc/contracts/invoiceviewer.mvc/invoicebatchviewer' ||
            p === '/mvc/contracts/invoiceviewer.mvc/invoicepreviewviewer') {
            return extractInvoiceViewerInfo();
        }
        if (p === '/autotask/views/administration/products/product.aspx' ||
            p === '/mvc/inventory/inventoryproduct.mvc/create' ||
            p === '/mvc/inventory/inventoryproduct.mvc/edit') {
            return extractInventoryProductInfo();
        }
        if (p === '/autotask/views/template/customizenotificationtemplate.aspx') {
            const info = extractAdminTitlebarPageInfo('Notification Template', 'Notification Templates');
            const legacyTitleContainer = document.querySelector('.TitleContainer');
            const legacySectionRaw = cleanText(legacyTitleContainer && Array.prototype.reduce.call(
                legacyTitleContainer.childNodes || [],
                function (text, node) {
                    return node && node.nodeType === Node.TEXT_NODE ? text + ' ' + node.textContent : text;
                },
                ''
            ));
            const legacySection = /^customize\s+notification\s+template$/i.test(legacySectionRaw)
                ? 'Notification Template'
                : legacySectionRaw || 'Notification Template';
            const nameInput = document.querySelector('#EmailTemplateHeaderUserControl_NameTextBox_ATTextEdit');
            const initialName = cleanText(nameInput && (
                nameInput.getAttribute('value') ||
                nameInput.defaultValue ||
                nameInput.value
            ));
            info.number = legacySection.slice(0, 120);
            info.metadataFields = Object.assign({}, info.metadataFields || {}, {
                id: info.number,
                secondaryTitle: info.number,
            });
            const extractedTitle = cleanText(info.title);
            const normalizedTitle = /^customize\s+notification\s+template$/i.test(extractedTitle)
                ? 'Notification Templates'
                : extractedTitle;
            info.title = (initialName || normalizedTitle || 'Notification Templates').slice(0, 120);
            info.metadataFields = Object.assign({}, info.metadataFields || {}, {
                entityName: info.title,
            });
            return info;
        }
        if (p === '/autotask/views/administration/companysetup/location_new_edit.aspx') {
            return extractAdminNamePageInfo('New Internal Location', 'Edit Internal Location', '#_ctl17_txt_location_name_ATTextEdit');
        }
        if (p === '/autotask/popups/administration/departmentdetails.aspx') {
            return extractAdminNamePageInfo('New Department', 'Edit Department', '#Summary_txtName_ATTextEdit');
        }
        if (p === '/autotask/views/administration/resources/resource.aspx') {
            return extractResourceManagementInfo();
        }
        if (p === '/mvc/administrationsetup/apiuser.mvc/newapiuser' || p === '/mvc/administrationsetup/apiuser.mvc/editapiuser') {
            return extractApiUserInfo();
        }
        if (p === '/mvc/crm/opportunitydetail.mvc') {
            return extractOpportunityInfo();
        }
        if (p === '/autotask35/crm/salesorder/salesorderdetail.aspx') {
            return extractSalesOrderInfo();
        }
        if (p === '/autotask/inventory/inventory_edit_order.aspx') {
            return extractPurchaseOrderInfo();
        }
        if (p === '/opportunity/quotes/quote.asp' || p === '/opportunity/quotes/newquote.asp') {
            return extractQuoteInfo();
        }
        if (p === '/mvc/crm/quotetemplate.mvc/editproperties') {
            return {
                title: 'Quote Template',
                number: '',
                contact: '',
            };
        }
        if (p === '/autotask/views/crm/contact_group_management.aspx' ||
            p === '/autotask35/crm/contactgroupmanager.aspx') {
            return extractContactGroupInfo();
        }
        if (p === '/mvc/projects/projectdetail.mvc/projectdetail') {
            return extractProjectInfo();
        }
        if (p === '/mvc/projects/taskdetail.mvc') {
            return extractTaskInfo();
        }
        if (p.includes('/contactdetail') || p.includes('/resourcedetail') || p.includes('/persondetail') || p === '/autotask35/grapevine/profile.aspx') {
            return extractPersonInfo();
        }
        return extractGenericInfo('');
    }

    let lastSent = '';
    function hasPageLevelWarning() {
        const warning = document.querySelector('table.PageLevelInstructions #errorSmall');
        return !!(warning && cleanText(warning.textContent));
    }

    // Autotask renders an Access Denied state when the user lacks
    // permission to view the requested entity. This is intentionally
    // STRICT — earlier heuristics (substring class/id match, body
    // text scans) false-positived on innocent pages and broke tabs.
    // Only two signals trigger the override:
    //   1. URL pathname exactly equals the Authorization Failure
    //      endpoint Autotask redirects to.
    //   2. document.title begins with "Access Denied" (allowing
    //      trailing " - Autotask" style suffixes). This catches the
    //      inline render case where the URL stays on the entity.
    function isAccessDeniedPage() {
        try {
            const path = AUTOTASKTABS.normalizeHandledPath(location.pathname);
            if (path === '/mvc/security/authorization.mvc/failure') return true;
            const titleText = String(document.title || '').trim();
            if (/^access\s*denied\b/i.test(titleText)) return true;
        } catch (e) {}
        return false;
    }

    function reportSelf() {
        if (!isReportableFrameUrl(location.href)) return;
        let info;
        try {
            info = extractInfo();
        } catch (e) {
            console.warn('AUTOTASKTABS: tab metadata extraction failed', e);
            info = {
                title: cleanText(document.title) || 'Autotask page',
                number: '',
                contact: '',
                primaryResource: null,
                hoverFields: [],
            };
        }
        if (isAccessDeniedPage()) {
            info.title = 'Access Denied';
            info.number = '';
            info.contact = '';
            info.primaryResource = null;
            info.priority = '';
            info.status = '';
            info.lastActivity = '';
            info.hoverFields = [];
            info.metadataFields = Object.assign({}, info.metadataFields || {}, {
                type: 'access denied',
            });
        }
        const pageWarning = hasPageLevelWarning();
        const primaryResource = info.primaryResource || null;
        const priority = info.priority || '';
        const status = info.status || '';
        const lastActivity = info.lastActivity || '';
        const hoverFields = Array.isArray(info.hoverFields)
            ? info.hoverFields
                .map(field => ({
                    label: cleanText(field && field.label).slice(0, 40),
                    value: cleanText(field && field.value).slice(0, 160),
                }))
                .filter(field => field.label && field.value)
            : [];
        const metadataFields = {};
        if (info.metadataFields && typeof info.metadataFields === 'object') {
            Object.keys(info.metadataFields).forEach(key => {
                const value = cleanText(info.metadataFields[key]).slice(0, 160);
                if (value) metadataFields[key] = value;
            });
        }
        const browserTitle = cleanText(document.title);
        const sig = [
            info.title, info.number, info.contact,
            browserTitle,
            JSON.stringify(primaryResource),
            priority, status, lastActivity,
            pageWarning ? 'warning' : '',
            JSON.stringify(hoverFields),
            JSON.stringify(metadataFields),
        ].join('|');
        if (sig === lastSent) return;
        lastSent = sig;
        postToTop({
            type: 'nav',
            url: location.href,
            title: info.title,
            browserTitle: browserTitle,
            number: info.number,
            contact: info.contact,
            primaryResource: primaryResource,
            priority: priority,
            status: status,
            lastActivity: lastActivity,
            pageWarning: pageWarning,
            hoverFields: hoverFields,
            metadataFields: metadataFields,
        });
    }

    function startWatching() {
        if (!isReportableFrameUrl(location.href)) return;
        reportSelf();
        [250, 1000, 2500, 5000].forEach(delay => {
            setTimeout(reportSelf, delay);
        });
        const obs = new MutationObserver(() => reportSelf());
        obs.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true,
            characterData: true,
        });
        setTimeout(() => obs.disconnect(), 15000);
    }

    function handleImprovedScrollbarsMessage(data) {
        improvedScrollbarsEnabled = featureEnabled && !!data.enabled;
        const root = document.documentElement;
        if (data.accentColor) root.style.setProperty('--autotasktabs-accent-link-color', data.accentColor);
        if (data.iconFilter) root.style.setProperty('--autotasktabs-accent-icon-filter', data.iconFilter);
        if (data.titlebarIconFilter) root.style.setProperty('--autotasktabs-titlebar-icon-filter', data.titlebarIconFilter);
        if (data.scrollbar) root.style.setProperty('--autotasktabs-accent-scrollbar', data.scrollbar);
        if (data.scrollbarHover) root.style.setProperty('--autotasktabs-accent-scrollbar-hover', data.scrollbarHover);
        if (data.scrollbarDark) root.style.setProperty('--autotasktabs-accent-scrollbar-dark', data.scrollbarDark);
        if (data.scrollbarDarkHover) root.style.setProperty('--autotasktabs-accent-scrollbar-dark-hover', data.scrollbarDarkHover);
        document.documentElement.classList.toggle('autotasktabs-improved-scrollbars', improvedScrollbarsEnabled);
    }

    function requestImprovedScrollbarsState() {
        postToTop({ type: 'improved-scrollbars-request' });
    }

    AUTOTASKTABS.initIframeBridge = function initIframeBridge() {
        installEmbeddedUmbrellaContractChrome();
        document.documentElement.classList.toggle(
            'autotasktabs-ticket-detail-page',
            AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(location.href)) === '/mvc/servicedesk/ticketdetail.mvc' ||
            AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(location.href)) === '/mvc/servicedesk/ticketedit.mvc'
        );

        window.addEventListener('message', function (event) {
            const data = event.data;

            if (data && data.__ns === AUTOTASKTABS.MSG_NS && data.type === 'improved-scrollbars') {
                handleImprovedScrollbarsMessage(data);
                return;
            }
            if (data && data.__ns === AUTOTASKTABS.MSG_NS && data.type === 'metadata-refresh') {
                reportSelf();
                return;
            }
            if (data && data.__ns === AUTOTASKTABS.MSG_NS && data.type === 'feature-enabled') {
                featureEnabled = data.enabled !== false;
                if (!featureEnabled) {
                    handleImprovedScrollbarsMessage({ enabled: false });
                }
                return;
            }

            if (event.source !== window) return;
            if (event.origin !== location.origin) return;
            if (!data || data.__ns !== AUTOTASKTABS.MSG_NS) return;
            if (!featureEnabled) return;
            if (data.type === 'contract-open' && data.url) {
                postToTop({ type: 'contract-open', url: data.url });
                return;
            }
            if (data.type === 'contract-open-duplicate' && data.url) {
                postToTop({ type: 'contract-open-duplicate', url: data.url });
                return;
            }
            if (data.type === 'umbrella-open' && data.url) {
                postToTop({ type: 'umbrella-open', url: data.url });
                return;
            }
            if (data.type === 'umbrella-open-duplicate' && data.url) {
                postToTop({ type: 'umbrella-open-duplicate', url: data.url });
                return;
            }
            if (data.type === 'open' && data.url && AUTOTASKTABS.isHandledUrl(data.url)) {
                postToTop({ type: isPeekPopupUrl(data.url) ? 'open-peek' : 'open', url: data.url });
            }
            if (data.type === 'open-peek' && data.url && isPeekPopupUrl(data.url)) {
                postToTop({ type: 'open-peek', url: data.url });
            }
            if (data.type === 'native-open' && data.url && AUTOTASKTABS.isNativeHomeUrl(data.url)) {
                postToTop({ type: 'native-open', url: data.url });
            }
            if (data.type === 'map' && data.url) {
                postToTop({ type: 'map', url: data.url });
            }
            if (data.type === 'close-frame' || data.type === 'close-peek') {
                postToTop({ type: 'close-frame', target: data.target || '' });
            }
            if (data.type === 'open-dialog-popout' && data.url && Array.isArray(data.fields)) {
                // The page-bridge caught a dialog PopOut form.submit() and
                // sent the payload our way. Forward it to the top shell
                // which will spin up an AUTOTASKTABS tab and re-POST the form
                // into it.
                postToTop({
                    type: 'open-dialog-popout',
                    url: data.url,
                    method: data.method || 'post',
                    fields: data.fields,
                });
            }
        }, true);

        function requestAllShellStates() {
            postToTop({ type: 'all-state-request' });
        }

        injectPageBridge();
        applyShellBarBodyPadding();
        injectScrollbarStyles();
        requestAllShellStates();
        window.setTimeout(requestAllShellStates, 500);
        window.setTimeout(requestAllShellStates, 1500);

        function armMapOpenFromEvent(event) {
            if (!featureEnabled) return;
            if (event.target.closest('.InlineIconButton.Map, .InlineIcon.Map')) {
                pendingMapOpenUntil = Date.now() + 5000;
            }
        }

        function postHandledNavigation(targetUrl) {
            postToTop({
                type: isPeekPopupUrl(targetUrl)
                    ? 'open-peek'
                    : isLegacyContractViewUrl(targetUrl) ? 'contract-open' : 'open',
                url: targetUrl,
            });
        }

        document.addEventListener('pointerdown', armMapOpenFromEvent, true);
        document.addEventListener('mousedown', armMapOpenFromEvent, true);
        document.addEventListener('mousedown', function (event) {
            if (!featureEnabled) return;
            if (event.button !== 1) return;
            const targetUrl = extractHandledNavigationUrlFromEventTarget(event.target);
            if (!targetUrl) return;
            event.preventDefault();
        }, true);

        document.addEventListener('click', function (event) {
            if (!featureEnabled) return;
            armMapOpenFromEvent(event);

            const targetUrl = extractHandledNavigationUrlFromEventTarget(event.target);
            if (!targetUrl) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            postHandledNavigation(targetUrl);
        }, true);

        let lastPeekSaveCloseClickAt = 0;
        function textFromElement(el) {
            return cleanText(el && (
                el.innerText ||
                el.textContent ||
                el.value ||
                el.getAttribute && (el.getAttribute('title') || el.getAttribute('aria-label')) ||
                ''
            ));
        }
        function isSaveCloseTrigger(target) {
            const el = target && target.closest
                ? target.closest('button,a,input,[role="button"],.Button,.Button2,.LinkButton2,[onclick]')
                : null;
            if (!el) return false;
            const text = textFromElement(el);
            return /\bsave\s*(?:&|and)\s*(?:close|quit)\b/i.test(text);
        }
        document.addEventListener('click', function (event) {
            if (!featureEnabled) return;
            if (!isPeekPopupUrl(location.href)) return;
            if (isSaveCloseTrigger(event.target)) {
                lastPeekSaveCloseClickAt = Date.now();
            }
        }, true);

        document.addEventListener('auxclick', function (event) {
            if (!featureEnabled) return;
            if (event.button !== 1) return;

            const targetUrl = extractHandledNavigationUrlFromEventTarget(event.target);
            if (!targetUrl) return;

            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();

            postToTop({ type: 'open-duplicate', url: targetUrl });
        }, true);

        // Autotask's PopOut button on note / time-entry dialogs submits a
        // hidden POST form with target="_blank" — the response is what
        // becomes the standalone popout window. The endpoint can't be
        // opened with a bare GET because it depends on the form's
        // payload (session token, ticket id, dialog state). Cancel the
        // native submit and forward the full payload to the top shell,
        // which re-submits the same form into a fresh AUTOTASKTABS-tab iframe.
        document.addEventListener('submit', function (event) {
            if (!featureEnabled) return;
            const form = event.target;
            if (!form || form.tagName !== 'FORM') return;
            let actionUrl = '';
            try { actionUrl = new URL(form.action, location.href).href; }
            catch (e) { return; }
            if (!isDialogPopOutFromDialogUrl(actionUrl)) return;
            const target = (form.target || '').toLowerCase();
            if (target !== '_blank' && target !== 'new') return;
            event.preventDefault();
            event.stopPropagation();
            const fields = [];
            Array.prototype.forEach.call(form.elements, function (el) {
                if (!el || !el.name) return;
                if (el.disabled) return;
                const elType = (el.type || '').toLowerCase();
                if (elType === 'submit' || elType === 'button' || elType === 'reset'
                    || elType === 'image' || elType === 'file') return;
                if ((elType === 'checkbox' || elType === 'radio') && !el.checked) return;
                fields.push({
                    name: el.name,
                    value: typeof el.value === 'string' ? el.value : '',
                });
            });
            postToTop({
                type: 'open-dialog-popout',
                url: actionUrl,
                method: (form.method || 'post').toLowerCase(),
                fields: fields,
            });
        }, true);

        if (!window.__AUTOTASKTABSWindowOpenInterceptInstalled) {
            window.__AUTOTASKTABSWindowOpenInterceptInstalled = true;
            const originalOpen = window.open;
            window.open = function (url, target, features) {
                if (!featureEnabled) return originalOpen.call(window, url, target, features);
                const targetUrl = url ? AUTOTASKTABS.toAbsoluteUrl(decodeUrl(String(url))) : '';
                if (targetUrl && (isPendingMapOpen() || isMapUrl(targetUrl))) {
                    pendingMapOpenUntil = 0;
                    postToTop({ type: 'map', url: targetUrl });
                    return createMapWindow(targetUrl);
                }
                if (targetUrl && isDialogPopOutFromDialogUrl(targetUrl)) {
                    // Same reasoning as the page-bridge override:
                    // don't let popout URLs spawn a real browser tab
                    // here. The form.submit intercept in the
                    // page-bridge has already pushed the right POST
                    // payload to the shell so an AUTOTASKTABS tab is being
                    // created — opening a browser tab in parallel
                    // would just produce an Autotask error page.
                    return createHandledWindow(targetUrl);
                }
                if (targetUrl && (AUTOTASKTABS.isHandledUrl(targetUrl) || isPeekPopupUrl(targetUrl))) {
                    postHandledNavigation(targetUrl);
                    return createHandledWindow(targetUrl);
                }
                return originalOpen.call(window, url, target, features);
            };
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startWatching, { once: true });
        } else {
            startWatching();
        }
        window.addEventListener('load', reportSelf);

        // Let the top shell know this iframe is about to navigate away, so it
        // can show a loader on the Home tab until the new native page finishes
        // loading. The shell filters these out for our own tab iframes and
        // only surfaces the loader when the source is native Autotask chrome.
        window.addEventListener('beforeunload', function () {
            if (isPeekPopupUrl(location.href) && lastPeekSaveCloseClickAt && Date.now() - lastPeekSaveCloseClickAt < 8000) {
                postToTop({ type: 'close-frame', target: 'peek' });
            }
            postToTop({ type: 'nav-start' });
        });

        function reportFrameInteraction() {
            postToTop({ type: 'frame-interaction' });
        }
        document.addEventListener('pointerdown', reportFrameInteraction, true);
        document.addEventListener('mousedown', reportFrameInteraction, true);
        document.addEventListener('focusin', reportFrameInteraction, true);

        // Report this iframe's <title> to the top shell. The shell uses it
        // for the Home-tab label when this is the native (non-tab) iframe;
        // for tab iframes the shell ignores the message and relies on the
        // existing 'nav' metadata path. We re-report on title mutations so
        // the Home label tracks the current page's title live.
        let lastReportedTitle = '';
        function postNativeTitle() {
            const title = (document.title || '').trim();
            if (title === lastReportedTitle) return;
            lastReportedTitle = title;
            postToTop({ type: 'native-title', title: title });
        }
        function startNativeTitleWatcher() {
            postNativeTitle();
            const head = document.head;
            if (!head) return;
            const obs = new MutationObserver(postNativeTitle);
            obs.observe(head, { childList: true, subtree: true, characterData: true });
        }
        if (document.head) {
            startNativeTitleWatcher();
        } else {
            document.addEventListener('DOMContentLoaded', startNativeTitleWatcher, { once: true });
        }
        window.addEventListener('load', postNativeTitle);
    };
})();


// Autotask Tabs -- Settings UI Builders
(function () {
    'use strict';

    const AUTOTASKTABS = window.__AUTOTASKTABS__;
    if (!AUTOTASKTABS) return;

    /**
     * Purpose: reusable, data-driven builders for AUTOTASKTABS settings modal controls.
     * Owns: generic settings row DOM structure only.
     * Must not own: persisted setting keys, shell state mutations, tab behavior, or storage calls.
     * Companion files: autotasktabs-shell.js for modal composition and settings behavior.
     * Verify: settings modal smoke test after changing row structure or CSS classes.
     */
    const settingsUi = AUTOTASKTABS.SettingsUi || (AUTOTASKTABS.SettingsUi = {});

    function appendName(label, config) {
        const titleRow = document.createElement('span');
        titleRow.className = 'at-tabs-setting-title-row';
        label.appendChild(titleRow);

        if (config.info && typeof config.createInfo === 'function') {
            titleRow.appendChild(config.createInfo(config.info));
        }

        const name = document.createElement('span');
        name.className = 'at-tabs-setting-name';
        name.textContent = config.name || '';
        titleRow.appendChild(name);
        const descriptionText = String(config.subtitle || config.description || config.info || '').trim();
        if (descriptionText) {
            label.classList.add('has-description');
            const description = document.createElement('span');
            description.className = 'at-tabs-setting-description';
            description.textContent = descriptionText;
            label.appendChild(description);
        }
        return name;
    }

    function createBaseRow(config) {
        config = config || {};
        const row = document.createElement(config.rowTag || 'label');
        row.className = 'at-tabs-setting-row' + (config.extraClass ? ' ' + config.extraClass : '');

        const label = document.createElement('span');
        label.className = 'at-tabs-setting-label';
        const name = appendName(label, config);

        row.appendChild(label);
        return { row, label, name };
    }

    settingsUi.createToggleRow = function createToggleRow(config) {
        config = config || {};
        const parts = createBaseRow(config);
        const toggle = document.createElement('span');
        toggle.className = 'at-tabs-setting-toggle';

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.checked = !!config.checked;
        input.disabled = !!config.disabled;
        if (config.title) input.title = config.title;
        input.addEventListener('change', function (event) {
            if (typeof config.onChange === 'function') {
                config.onChange(input, event);
            }
        });

        const toggleUi = document.createElement('span');
        toggleUi.className = 'at-tabs-setting-toggle-ui';
        toggle.appendChild(input);
        toggle.appendChild(toggleUi);
        parts.row.appendChild(toggle);

        return Object.assign(parts, { input, toggle, toggleUi });
    };

    settingsUi.createSelectRow = function createSelectRow(config) {
        config = config || {};
        const parts = createBaseRow(config);
        const selectWrap = document.createElement('span');
        selectWrap.className = 'at-tabs-setting-select-wrap';
        const select = document.createElement('select');
        select.className = 'at-tabs-setting-select';
        if (config.title) select.title = config.title;

        (config.options || []).forEach(function (option) {
            const optionEl = document.createElement('option');
            optionEl.value = option.value;
            optionEl.textContent = option.label || option.value;
            if (option.disabled) optionEl.disabled = true;
            if (config.value === option.value) optionEl.selected = true;
            select.appendChild(optionEl);
        });

        select.addEventListener('change', function (event) {
            if (typeof config.onChange === 'function') {
                config.onChange(select, event);
            }
        });

        selectWrap.appendChild(select);
        parts.row.appendChild(selectWrap);
        return Object.assign(parts, { select, selectWrap });
    };

    settingsUi.createFooterButton = function createFooterButton(config) {
        config = config || {};
        const button = document.createElement('button');
        button.type = 'button';
        button.className = config.className || 'at-tabs-settings-reset';
        button.textContent = config.text || '';
        if (config.title) button.title = config.title;
        if (typeof config.onClick === 'function') {
            button.addEventListener('click', config.onClick);
        }
        return button;
    };
})();


// Autotask Tabs -- Shell Runtime Bootstrap
(function () {
    'use strict';

    const AUTOTASKTABS = window.__AUTOTASKTABS__;
    if (!AUTOTASKTABS || !AUTOTASKTABS.isTop) return;

    /**
     * Purpose: AUTOTASKTABS shell bootstrap and behavior core.
     * Owns: tab lifecycle, layout, Peek, settings wiring, metadata display, and shell messages.
     * Must not own: static metadata option tables or the shell CSS payload.
     * Companion files: autotasktabs-shell-runtime.js, autotasktabs-shell-config.js, autotasktabs-shell-styles.js.
     */
    if (AUTOTASKTABS.isAllowedHost && !AUTOTASKTABS.isAllowedHost(location.href)) return;
    if (document.contentType === 'image/svg+xml' ||
        document.documentElement && String(document.documentElement.tagName || '').toLowerCase() === 'svg' ||
        /\.svg(?:[?#]|$)/i.test(location.pathname || '')) return;
    const AUTOTASKTABS_RUNTIME_BUILD_ID = '0.8.0-stable-1';
    const AUTOTASKTABS_RUNTIME_BUILD_STORAGE_KEY = 'autotasktabs-runtime-build-id';
    const AUTOTASKTABS_RUNTIME_BUILD_RELOAD_KEY = 'autotasktabs-runtime-build-reload-id';
    const DIRECT_HANDLED_OPEN_STORAGE_KEY = 'autotask-tabs-direct-handled-open-url-v1';

    function readRuntimeBuildStorage(storage, key) {
        try { return storage.getItem(key) || ''; }
        catch (e) { return ''; }
    }

    function writeRuntimeBuildStorage(storage, key, value) {
        try { storage.setItem(key, value); }
        catch (e) {}
    }

    function requestRuntimeBuildReload(reason) {
        const alreadyReloaded = readRuntimeBuildStorage(sessionStorage, AUTOTASKTABS_RUNTIME_BUILD_RELOAD_KEY) === AUTOTASKTABS_RUNTIME_BUILD_ID;
        writeRuntimeBuildStorage(localStorage, AUTOTASKTABS_RUNTIME_BUILD_STORAGE_KEY, AUTOTASKTABS_RUNTIME_BUILD_ID);
        if (alreadyReloaded) return true;

        writeRuntimeBuildStorage(sessionStorage, AUTOTASKTABS_RUNTIME_BUILD_RELOAD_KEY, AUTOTASKTABS_RUNTIME_BUILD_ID);
        writeRuntimeBuildStorage(sessionStorage, AUTOTASKTABS_RUNTIME_BUILD_RELOAD_KEY + '-reason', reason || 'runtime-build-change');
        try { location.reload(); }
        catch (e) {}
        return false;
    }

    if (AUTOTASKTABS.shellInitialized) {
        if (AUTOTASKTABS.runtimeBuildId !== AUTOTASKTABS_RUNTIME_BUILD_ID) {
            requestRuntimeBuildReload('stale-shell-runtime');
        }
        return;
    }

    const previousRuntimeBuildId = readRuntimeBuildStorage(localStorage, AUTOTASKTABS_RUNTIME_BUILD_STORAGE_KEY);
    if (previousRuntimeBuildId && previousRuntimeBuildId !== AUTOTASKTABS_RUNTIME_BUILD_ID) {
        if (!requestRuntimeBuildReload('updated-runtime-build')) return;
    }

    writeRuntimeBuildStorage(localStorage, AUTOTASKTABS_RUNTIME_BUILD_STORAGE_KEY, AUTOTASKTABS_RUNTIME_BUILD_ID);
    AUTOTASKTABS.runtimeBuildId = AUTOTASKTABS_RUNTIME_BUILD_ID;
    AUTOTASKTABS.shellInitialized = true;

    const shellRuntime = AUTOTASKTABS.ShellRuntime || (AUTOTASKTABS.ShellRuntime = {});
    const shellConfig = shellRuntime.config || {};
    const CUSTOMIZABLE_TAB_TYPES = shellConfig.CUSTOMIZABLE_TAB_TYPES || [];
    const CUSTOM_FIELD_OPTIONS = shellConfig.CUSTOM_FIELD_OPTIONS || [];
    const getCustomizationFieldOptionLabel = shellConfig.getCustomizationFieldOptionLabel || function (_type, value) { return value; };
    const TAB_LINE_OPTIONS_BY_TYPE = shellConfig.TAB_LINE_OPTIONS_BY_TYPE || {};
    const TAB_LINE_DEFAULT_BY_TYPE = shellConfig.TAB_LINE_DEFAULT_BY_TYPE || {};
    const TAB_LINE_RECOMMENDED_BY_TYPE = shellConfig.TAB_LINE_RECOMMENDED_BY_TYPE || {};
    const TAB_TYPE_LABELS = shellConfig.TAB_TYPE_LABELS || {};
    const CUSTOMIZATION_TAB_TYPE_ICONS = shellConfig.CUSTOMIZATION_TAB_TYPE_ICONS || {};
    function normalizeTabType(type) {
        return typeof type === 'string' ? type.toLowerCase() : '';
    }

    function createRandomId(prefix) {
        try {
            if (window.crypto && typeof window.crypto.randomUUID === 'function') {
                return prefix + window.crypto.randomUUID();
            }
        } catch (e) {}
        return prefix + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    }

    const state = AUTOTASKTABS.state = Object.assign(AUTOTASKTABS.state || {}, {
        tabs: [],
        activeId: null,
        splitId: null,
        splitPairIds: Array.isArray(AUTOTASKTABS.state && AUTOTASKTABS.state.splitPairIds)
            ? AUTOTASKTABS.state.splitPairIds
            : null,
        splitPairColor: AUTOTASKTABS.state && typeof AUTOTASKTABS.state.splitPairColor === 'string'
            ? AUTOTASKTABS.state.splitPairColor
            : '',
        splitRatio: AUTOTASKTABS.state && typeof AUTOTASKTABS.state.splitRatio === 'number'
            ? AUTOTASKTABS.state.splitRatio
            : 0.5,
        splitRatios: Array.isArray(AUTOTASKTABS.state && AUTOTASKTABS.state.splitRatios)
            ? AUTOTASKTABS.state.splitRatios
            : [],
        activationHistory: [],
        restoreLoadTimers: [],
        tabsSyncClientId: createRandomId('client-'),
        tabsSyncApplyingRemote: false,
        tabsSyncLastSeenAt: 0,
        tabsSyncHasOwnedTabs: false,
        tabsSyncWatcherInstalled: false,
        tabsRestored: false,
        nextId: 1,
        bar: null,
        viewport: null,
        loader: null,
        homeCover: null,
        tabBarCollapseButton: null,
        closedTabs: [],
        closedTabsButton: null,
        topLevelRouteWatchInstalled: false,
        tabScroll: null,
        scrollLeftButton: null,
        scrollRightButton: null,
        tabContextMenu: null,
        draggingTabId: null,
        dragOverTabId: null,
        dragInsertAfter: false,
        dragSplitIndicator: null,
        dragSplitPane: null,
        dragSplitSide: '',
        dragSplitInsertionIndex: 0,
        dragSplitHideTimer: 0,
        nativeReservedContainer: null,
        nonIframeReservedContainer: null,
        settingsModal: null,
        settingsBackdrop: null,
        settingsClosing: false,
        mapModal: null,
        mapBackdrop: null,
        peekBackdrop: null,
        peekWrapper: null,
        peekModal: null,
        peekClosing: false,
        peekCloseConfirmShade: null,
        peekCloseConfirm: null,
        peekTabId: null,
        peekOriginTabId: null,
        peekPrewarm: null,
        peekReuseIframe: null,
        peekReusePrevStyle: '',
        peekViewportPrevStyle: '',
        peekSyncOverlay: null,
        peekResizeObserver: null,
        peekMoveResizeCleanup: null,
        hoverCard: null,
        hoverTabId: null,
        hoverCardHovered: false,
        hoverAnchorHovered: false,
        hoverAnchorEl: null,
        hoverShowTimer: 0,
        hoverHideTimer: 0,
        umbrellaInfoTooltip: null,
        umbrellaInfoTooltipHideTimer: 0,
        homeTabEl: null,
        homeMetadataType: '',
        homeMetadataFields: {},
        nativeFrame: null,
        nativeLastUrl: '',
        nativeShellSuppressUrl: '',
        homePersistedUrl: '',
        homePersistedTitle: '',
        lastObservedTopHref: '',
        lastObservedTopHandledUrl: '',
        homeLoadingAwaitingNativeLoad: false,
        homeLoadingClearTimer: 0,
        homeLoadingUrl: '',
        nativeFrameSrcObserver: null,
        nativeFrameObservedSrc: '',
        nonIframeTitleObserver: null,
        nonIframeTitleRaf: 0,
        lastGeometryHadNativeFrame: false,
        geometryRaf: 0,
        geometryPollId: 0,
        rootResizeObserver: null,
        geometryBurstUntil: 0,
        geometryBurstTimerId: 0,
        geometryResizeFinalizeTimerId: 0,
        lastGeometryViewportWidth: 0,
        lastGeometryViewportHeight: 0,
        rootMutationObserver: null,
        themeObserver: null,
        shellHidden: false,
        mountTime: 0,
        homeLoading: false,
        rememberTabsAfterClose: !!(AUTOTASKTABS.state && AUTOTASKTABS.state.rememberTabsAfterClose),
        openNewTabsAtStart: !!(AUTOTASKTABS.state && AUTOTASKTABS.state.openNewTabsAtStart),
        phoneLinksEnabled: AUTOTASKTABS.state && typeof AUTOTASKTABS.state.phoneLinksEnabled === 'boolean'
            ? AUTOTASKTABS.state.phoneLinksEnabled
            : true,
        ticketLinksEnabled: AUTOTASKTABS.state && typeof AUTOTASKTABS.state.ticketLinksEnabled === 'boolean'
            ? AUTOTASKTABS.state.ticketLinksEnabled
            : true,
        improvedScrollbarsEnabled: AUTOTASKTABS.state && typeof AUTOTASKTABS.state.improvedScrollbarsEnabled === 'boolean'
            ? AUTOTASKTABS.state.improvedScrollbarsEnabled
            : true,
        themePreference: 'auto',
        extensionEnabled: !(AUTOTASKTABS.state && AUTOTASKTABS.state.extensionEnabled === false),
        barOrientation: AUTOTASKTABS.state && ['horizontal', 'vertical'].includes(AUTOTASKTABS.state.barOrientation)
            ? AUTOTASKTABS.state.barOrientation
            : 'horizontal',
        homeTitle: 'Home',
        showTabBarOnNonIframePages: !!(AUTOTASKTABS.state && AUTOTASKTABS.state.showTabBarOnNonIframePages),
        resizableTabBarEnabled: !!(AUTOTASKTABS.state && AUTOTASKTABS.state.resizableTabBarEnabled),
        horizontalCompactTabsEnabled: !!(AUTOTASKTABS.state && AUTOTASKTABS.state.horizontalCompactTabsEnabled),
        roundedPageFramesEnabled: !!(AUTOTASKTABS.state && AUTOTASKTABS.state.roundedPageFramesEnabled),
        skipPeekBackdropCloseWarning: !!(AUTOTASKTABS.state && AUTOTASKTABS.state.skipPeekBackdropCloseWarning),
        peekMoveResizeEnabled: !!(AUTOTASKTABS.state && AUTOTASKTABS.state.peekMoveResizeEnabled),
        experimentalUmbrellaContractFrameTabs: !!(AUTOTASKTABS.state && AUTOTASKTABS.state.experimentalUmbrellaContractFrameTabs),
        tabLine2Fields: normalizeTabLineSettings(AUTOTASKTABS.state && AUTOTASKTABS.state.tabLine2Fields, 2),
        tabLine3Fields: normalizeTabLineSettings(AUTOTASKTABS.state && AUTOTASKTABS.state.tabLine3Fields, 3),
        tabBarWidth: AUTOTASKTABS.state && typeof AUTOTASKTABS.state.tabBarWidth === 'number' ? AUTOTASKTABS.state.tabBarWidth : AUTOTASKTABS.BAR_W,
        tabBarHoverExpanded: false,
        tabBarExpandTimer: 0,
        tabBarCollapseTimer: 0,
        tabBarLastExpandedWidth: AUTOTASKTABS.BAR_W || 240,
        tabBarResizeHandleHovered: false,
        tabBarResizing: false,
        splitResizeHandle: null,
        splitResizeHandles: [],
        splitResizeHandleIndex: 0,
        splitResizing: false,
        metadataRefreshTimerId: 0,
    });
    const METADATA_REFRESH_INTERVAL_MS = 7000;
    const METADATA_BACKGROUND_REFRESH_INTERVAL_MS = 60000;
    const IS_SAFARI_WEBKIT = navigator.vendor === 'Apple Computer, Inc.' &&
        /Safari/i.test(navigator.userAgent || '') &&
        !/(Chrome|Chromium|CriOS|FxiOS|Edg|OPR)\//i.test(navigator.userAgent || '');
    const IS_FIREFOX_BROWSER = /Firefox\/\d+/i.test(navigator.userAgent || '') ||
        /FxiOS\/\d+/i.test(navigator.userAgent || '');
    const DEFAULT_ROUNDED_PAGE_FRAMES_ENABLED = !IS_FIREFOX_BROWSER;

    function getRuntimeApi() {
        try {
            if (typeof browser !== 'undefined' && browser && browser.runtime) return browser.runtime;
        } catch (e) {}
        try {
            if (typeof chrome !== 'undefined' && chrome.runtime) return chrome.runtime;
        } catch (e) {}
        return null;
    }

    function getExtensionVersion() {
        const runtime = getRuntimeApi();
        try {
            if (!runtime || typeof runtime.getManifest !== 'function') return '';
        } catch (e) {
            return '';
        }
        try {
            return String(runtime.getManifest().version || '');
        } catch (e) {
            return '';
        }
    }

    function sendRuntimeMessage(message) {
        const runtime = getRuntimeApi();
        try {
            if (!runtime || typeof runtime.sendMessage !== 'function') return Promise.resolve(null);
        } catch (e) {
            return Promise.resolve(null);
        }
        try {
            const sending = runtime.sendMessage(message);
            if (sending && typeof sending.then === 'function') {
                return sending.catch(function () { return null; });
            }
        } catch (e) {}
        return Promise.resolve(null);
    }

    function versionParts(version) {
        return String(version || '')
            .replace(/^v/i, '')
            .split('-')[0]
            .split('.')
            .map(function (part) {
                const parsed = parseInt(part, 10);
                return Number.isFinite(parsed) ? parsed : 0;
            });
    }

    function compareVersions(left, right) {
        const a = versionParts(left);
        const b = versionParts(right);
        const length = Math.max(a.length, b.length, 3);
        for (let i = 0; i < length; i += 1) {
            const av = a[i] || 0;
            const bv = b[i] || 0;
            if (av > bv) return 1;
            if (av < bv) return -1;
        }
        return 0;
    }

    function readLocalStorageNumber(key) {
        const value = parseInt(readRuntimeBuildStorage(window.localStorage, key), 10);
        return Number.isFinite(value) ? value : 0;
    }

    function writeLocalStorageValue(key, value) {
        writeRuntimeBuildStorage(window.localStorage, key, String(value || ''));
    }

    function faIcon(className) {
        return '<span class="' + className + ' flex justify-center items-center flex-shrink-0 w-1rem h-1rem override-$icon-override-font-size:font-size-3 line-height-5 override-$icon-override-color:color-icon-primary" aria-hidden="true"></span>';
    }

    function clearChildren(element) {
        if (!element) return;
        while (element.firstChild) element.removeChild(element.firstChild);
    }

    function createSvg(pathData, options) {
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        const opts = options || {};
        svg.setAttribute('viewBox', opts.viewBox || '0 0 24 24');
        if (opts.ariaHidden !== false) svg.setAttribute('aria-hidden', 'true');
        svg.setAttribute('fill', opts.fill || 'none');
        svg.setAttribute('stroke', opts.stroke || 'currentColor');
        svg.setAttribute('stroke-width', opts.strokeWidth || '2');
        svg.setAttribute('stroke-linecap', 'round');
        svg.setAttribute('stroke-linejoin', 'round');
        (Array.isArray(pathData) ? pathData : [pathData]).forEach(function (entry) {
            const node = document.createElementNS('http://www.w3.org/2000/svg', entry.circle ? 'circle' : entry.line ? 'line' : entry.rect ? 'rect' : 'path');
            Object.keys(entry).forEach(function (key) {
                if (key !== 'circle' && key !== 'line' && key !== 'rect') node.setAttribute(key, entry[key]);
            });
            svg.appendChild(node);
        });
        return svg;
    }

    function appendIconMarkup(element, html) {
        clearChildren(element);
        const value = String(html || '');
        const faMatch = value.match(/<span class="([^"]+)"/);
        if (faMatch) {
            const span = document.createElement('span');
            span.className = faMatch[1];
            span.setAttribute('aria-hidden', 'true');
            element.appendChild(span);
            return;
        }
        if (value.includes('M15 18l-6-6 6-6')) {
            element.appendChild(createSvg([{ d: 'M15 18l-6-6 6-6' }], { strokeWidth: '2.4', ariaHidden: false }));
            return;
        }
        if (value.includes('M9 18l6-6-6-6')) {
            element.appendChild(createSvg([{ d: 'M9 18l6-6-6-6' }], { strokeWidth: '2.4', ariaHidden: false }));
            return;
        }
        if (value.includes('M12 7.8v5.2')) {
            element.appendChild(createSvg([{ circle: true, cx: '12', cy: '12', r: '8.5' }, { d: 'M12 7.8v5.2' }, { d: 'M12 16.8h.01' }], { strokeWidth: '2.15' }));
            return;
        }
        if (value.includes('M10.3 3.9')) {
            element.appendChild(createSvg([{ d: 'M12 9v4' }, { d: 'M12 17h.01' }, { d: 'M10.3 3.9 1.8 18.4A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.6L13.7 3.9a2 2 0 0 0-3.4 0Z' }], { strokeWidth: '2.6' }));
            return;
        }
        if (value.includes('circle cx="12" cy="12" r="10"')) {
            element.appendChild(createSvg([{ circle: true, cx: '12', cy: '12', r: '10' }, { line: true, x1: '12', y1: '16', x2: '12', y2: '12' }, { line: true, x1: '12', y1: '8', x2: '12.01', y2: '8' }]));
            return;
        }
        if (value.includes('rect x="3" y="4"')) {
            element.appendChild(createSvg([{ rect: true, x: '3', y: '4', width: '18', height: '16', rx: '2' }, { d: 'M12 4v16' }], { strokeWidth: '2.1', ariaHidden: false }));
            return;
        }
        if (value.includes('at-tabs-settings-nav-name')) {
            const name = document.createElement('span');
            name.className = 'at-tabs-settings-nav-name';
            const arrow = document.createElement('span');
            arrow.className = 'at-tabs-settings-nav-arrow';
            arrow.textContent = '›';
            element.append(name, arrow);
            return;
        }
        element.textContent = '';
    }

    const ICONS = {
        home: faIcon('fa-house fa-regular'),
        umbrellacontract: faIcon('fa-umbrella fa-regular'),
        ticket: faIcon('fa-ticket fa-regular'),
        ticketnote: faIcon('fa-note-sticky fa-regular'),
        tickettimeentry: faIcon('fa-clock fa-regular'),
        authorizationfailure: faIcon('fa-lock fa-regular'),
        servicecall: faIcon('fa-headset fa-regular'),
        knowledgebase: faIcon('fa-book fa-regular'),
        contract: faIcon('fa-file-contract fa-regular'),
        invoice: faIcon('fa-file-invoice fa-regular'),
        product: faIcon('fa-box-open fa-regular'),
        account: faIcon('fa-building fa-regular'),
        device: faIcon('fa-laptop-mobile fa-regular'),
        note: faIcon('fa-note-sticky fa-regular'),
        opportunity: faIcon('fa-lightbulb fa-regular'),
        salesorder: faIcon('fa-cash-register fa-regular'),
        purchaseorder: faIcon('fa-receipt fa-regular'),
        quote: faIcon('fa-file-invoice-dollar fa-regular'),
        inventory: faIcon('fa-boxes-stacked fa-regular'),
        charge: faIcon('fa-file-plus-minus fa-regular'),
        timesheet: faIcon('fa-clock-five fa-regular'),
        livelink: faIcon('fa-link fa-regular'),
        person: faIcon('fa-address-book fa-regular'),
        group: faIcon('fa-users fa-regular'),
        project: faIcon('fa-folder fa-regular'),
        projectTask: faIcon('fa-folder-tree fa-regular'),
        calendar: faIcon('fa-calendar-lines fa-regular'),
        administration: faIcon('fa-gear fa-regular'),
        resourceManagement: faIcon('fa-user-gear fa-regular'),
        notificationTemplate: faIcon('fa-bell fa-regular'),
        workflowRule: faIcon('fa-diagram-project fa-regular'),
        pin: faIcon('fa-thumbtack fa-regular'),
        settings: faIcon('fa-puzzle-piece fa-regular'),
        refresh: faIcon('fa-arrows-rotate fa-regular'),
        split: faIcon('fa-table-columns fa-regular'),
        clearColor: faIcon('fa-border-none fa-regular'),
        colorTab: faIcon('fa-paintbrush fa-regular'),
        duplicate: faIcon('fa-clone fa-regular'),
        peek: faIcon('fa-eye fa-regular'),
        copy: faIcon('fa-clipboard fa-regular'),
        restoreClosed: faIcon('fa-clock-rotate-left fa-regular'),
    };

    const TAB_COLOR_PRESETS = [
        '#EF4444', '#F97316', '#F59E0B', '#EAB308',
        '#84CC16', '#22C55E', '#10B981', '#14B8A6',
        '#06B6D4', '#6366F1', '#8B5CF6', '#A16207',
        '#A855F7', '#EC4899', '#F43F5E', '#64748B',
    ];

    function createTabIframe(url, options) {
        const opts = options || {};
        const iframeEl = document.createElement('iframe');
        iframeEl.dataset.autotasktabsLoadStarted = opts.deferLoad ? 'false' : 'true';
        if (opts.deferLoad) {
            iframeEl.dataset.autotasktabsDeferredSrc = url;
        } else {
            iframeEl.src = url;
        }
        iframeEl.addEventListener('load', function () {
            const tab = state.tabs.find(t => t.iframeEl === iframeEl);
            if (!tab) return;
            if (tab.loadStarted === false || iframeEl.dataset.autotasktabsLoadStarted === 'false') return;
            const loadedUrl = currentFrameUrl(iframeEl);
            if (shouldMoveLegacyContractRedirectToHome(tab, loadedUrl)) {
                openUrlOnHome(loadedUrl);
                closeTab(tab.id);
                return;
            }
            tab.loading = false;
            const fallback = fallbackTabMetadataForUrl(tab.url);
            if (!tab.title && fallback.title) tab.title = fallback.title;
            if (!tab.number && fallback.number) tab.number = fallback.number;
            if (!tab.contact && fallback.contact) tab.contact = fallback.contact;
            updateTabEl(tab);
            updateLoaderVisibility();
            requestSyncGeometry();
            saveTabs();
        });
        return iframeEl;
    }

    function currentFrameUrl(frame) {
        if (!frame) return '';
        try { return frame.contentWindow.location.href || frame.getAttribute('src') || ''; }
        catch (e) { return frame.getAttribute('src') || ''; }
    }

    function isLegacyContractViewUrl(url) {
        return AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(url || '')) === '/contracts/views/contractview.asp';
    }

    function isContractEditUrl(url) {
        return AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(url || '')) === '/mvc/contracts/contract.mvc/edit';
    }

    function shouldMoveLegacyContractRedirectToHome(tab, loadedUrl) {
        if (!tab || !loadedUrl) return false;
        if (useExperimentalUmbrellaContractFrameTabs() && isUmbrellaContractHomeUrl(loadedUrl)) return false;
        return isLegacyContractViewUrl(tab.url)
            && AUTOTASKTABS.isNativeHomeUrl
            && AUTOTASKTABS.isNativeHomeUrl(loadedUrl);
    }

    function contractIdFromLegacyContractUrl(url) {
        try {
            const parsed = new URL(url || '', location.origin);
            return parsed.searchParams.get('contractID') || parsed.searchParams.get('contractId') || '';
        } catch (e) {
            return '';
        }
    }

    function buildOnyxContractDetailsUrl(url) {
        try {
            const parsed = new URL(url || '', location.origin);
            const contractId = contractIdFromLegacyContractUrl(parsed.href);
            if (!/^\d+$/.test(contractId || '')) return '';
            const viewData = btoa(JSON.stringify({ contractId: Number(contractId) }));
            const onyxUrl = new URL('/AutotaskOnyx/LandingPage', parsed.origin);
            onyxUrl.searchParams.set('view', 'umbrella-contract-details');
            onyxUrl.searchParams.set('view-data', viewData);
            return onyxUrl.href;
        } catch (e) {
            return '';
        }
    }

    function extractOnyxContractDetailsUrlFromHtml(html, sourceUrl) {
        const text = String(html || '');
        if (!/umbrella-contract-details/i.test(text)) return '';

        const directMatch = text
            .replace(/&amp;/g, '&')
            .match(/\/AutotaskOnyx\/LandingPage\?[^"'<>\\\s]*view=umbrella-contract-details[^"'<>\\\s]*/i);
        if (directMatch && directMatch[0]) {
            try { return new URL(directMatch[0], location.origin).href; }
            catch (e) {}
        }

        return buildOnyxContractDetailsUrl(sourceUrl);
    }

    function showContractProbeOverlay() {
        state.contractProbeLoading = true;
        if (!state.contractProbeLoader) {
            const loader = document.createElement('div');
            loader.className = 'at-tabs-loader at-tabs-contract-probe-loader';
            loader.setAttribute('aria-label', 'Loading');
            loader.style.position = 'fixed';
            loader.style.inset = 'auto';
            loader.style.zIndex = '2147483000';
            loader.style.pointerEvents = 'auto';
            document.body.appendChild(loader);
            state.contractProbeLoader = loader;
        }
        positionContractProbeLoader();
        state.contractProbeLoader.classList.add('show');
        updateLoaderVisibility();
    }

    function hideContractProbeOverlay() {
        state.contractProbeLoading = false;
        if (state.contractProbeLoader) {
            state.contractProbeLoader.classList.remove('show');
        }
        updateLoaderVisibility();
    }

    function positionContractProbeLoader() {
        const loader = state.contractProbeLoader;
        if (!loader) return;
        const candidates = [
            state.activeId === null ? (state.nativeFrame || findContentIframe()) : null,
            state.activeId === null ? state.homeCover : null,
            state.viewport,
        ];
        const target = candidates.find(function (el) {
            if (!el || !el.getBoundingClientRect) return false;
            const rect = el.getBoundingClientRect();
            return rect.width > 24 && rect.height > 24;
        });
        let rect = target && target.getBoundingClientRect
            ? target.getBoundingClientRect()
            : { left: 0, top: 0, width: window.innerWidth, height: window.innerHeight };

        if (state.bar && state.bar.getBoundingClientRect) {
            const barRect = state.bar.getBoundingClientRect();
            const verticalOverlap = Math.max(0, Math.min(rect.bottom || (rect.top + rect.height), barRect.bottom) - Math.max(rect.top, barRect.top));
            const horizontalOverlap = Math.max(0, Math.min(rect.right || (rect.left + rect.width), barRect.right) - Math.max(rect.left, barRect.left));
            if (verticalOverlap > 0 && horizontalOverlap > 0) {
                if (barRect.right <= rect.left + rect.width / 2) {
                    const delta = Math.max(0, barRect.right - rect.left);
                    rect = { left: rect.left + delta, top: rect.top, width: Math.max(0, rect.width - delta), height: rect.height };
                } else if (barRect.left >= rect.left + rect.width / 2) {
                    const width = Math.max(0, barRect.left - rect.left);
                    rect = { left: rect.left, top: rect.top, width: width, height: rect.height };
                } else if (barRect.bottom <= rect.top + rect.height / 2) {
                    const delta = Math.max(0, barRect.bottom - rect.top);
                    rect = { left: rect.left, top: rect.top + delta, width: rect.width, height: Math.max(0, rect.height - delta) };
                } else if (barRect.top >= rect.top + rect.height / 2) {
                    const height = Math.max(0, barRect.top - rect.top);
                    rect = { left: rect.left, top: rect.top, width: rect.width, height: height };
                }
            }
        }

        loader.style.left = rect.left + 'px';
        loader.style.top = rect.top + 'px';
        loader.style.width = Math.max(0, rect.width) + 'px';
        loader.style.height = Math.max(0, rect.height) + 'px';
    }

    function createTabPaneLoader() {
        const loaderEl = document.createElement('div');
        loaderEl.className = 'at-tabs-pane-loader hidden';
        loaderEl.setAttribute('aria-label', 'Loading');
        return loaderEl;
    }

    function removeTabRuntimeElements(tab) {
        if (!tab) return;
        try { if (tab.iframeEl) tab.iframeEl.remove(); } catch (e) {}
        try { if (tab.loaderEl) tab.loaderEl.remove(); } catch (e) {}
        tab.iframeEl = null;
        tab.loaderEl = null;
    }

    function ensureTabRuntimeForUrl(tab, options) {
        if (!tab) return tab;
        const opts = options || {};
        const nativeShell = isNativeShellTabUrl(tab.url);
        tab.nativeShell = nativeShell;
        if (nativeShell) {
            removeTabRuntimeElements(tab);
            tab.loading = false;
            tab.loadStarted = true;
            return tab;
        }
        if (!tab.iframeEl && state.viewport) {
            const iframeEl = createTabIframe(tab.url, { deferLoad: !!opts.deferLoad });
            const loaderEl = createTabPaneLoader();
            state.viewport.appendChild(iframeEl);
            state.viewport.appendChild(loaderEl);
            tab.iframeEl = iframeEl;
            tab.loaderEl = loaderEl;
            tab.loading = opts.deferLoad ? false : true;
            tab.loadStarted = !opts.deferLoad;
        }
        return tab;
    }

    function requestTabMetadataRefresh(tab) {
        if (!tab || !tab.iframeEl || !tab.iframeEl.contentWindow) return;
        try {
            tab.iframeEl.contentWindow.postMessage({
                __ns: AUTOTASKTABS.MSG_NS,
                type: 'metadata-refresh',
            }, '*');
        } catch (e) {
            // Cross-frame refresh requests are best-effort; the next iframe
            // navigation/load will still update metadata through the bridge.
        }
    }

    function requestAllTabMetadataRefresh() {
        if (!featuresEnabled()) return;
        const now = Date.now();
        const refreshBackgroundTabs = now - (state.lastBackgroundMetadataRefreshAt || 0) >= METADATA_BACKGROUND_REFRESH_INTERVAL_MS;
        if (refreshBackgroundTabs) state.lastBackgroundMetadataRefreshAt = now;
        for (const tab of state.tabs) {
            if (!tab || tab.loading || !tab.iframeEl) continue;
            const isVisiblePane = !tab.iframeEl.classList.contains('hidden');
            if (!isVisiblePane && !refreshBackgroundTabs) continue;
            requestTabMetadataRefresh(tab);
        }
    }

    function startMetadataRefreshTimer() {
        if (state.metadataRefreshTimerId) return;
        state.metadataRefreshTimerId = window.setInterval(
            requestAllTabMetadataRefresh,
            METADATA_REFRESH_INTERVAL_MS
        );
        window.setTimeout(requestAllTabMetadataRefresh, 1000);
    }

    function refreshTabIframe(tab) {
        if (!tab || !tab.iframeEl) return;
        preserveTabMetadataForRefresh(tab);
        tab.loading = true;
        updateTabEl(tab);
        updateLoaderVisibility();
        try {
            tab.iframeEl.contentWindow.location.reload();
        } catch (e) {
            tab.iframeEl.src = tab.iframeEl.src || tab.url;
        }
    }

    function snapshotTabMetadata(tab) {
        if (!tab) return null;
        return {
            title: String(tab.title || ''),
            number: String(tab.number || ''),
            contact: String(tab.contact || ''),
            primaryResource: tab.primaryResource ? Object.assign({}, tab.primaryResource) : null,
            priority: String(tab.priority || ''),
            status: String(tab.status || ''),
            lastActivity: String(tab.lastActivity || ''),
            pageWarning: !!tab.pageWarning,
            hoverFields: normalizeHoverFields(tab.hoverFields),
            metadataFields: normalizeMetadataFields(tab.metadataFields),
        };
    }

    function preserveTabMetadataForRefresh(tab) {
        const snapshot = snapshotTabMetadata(tab);
        if (!snapshot) return;
        tab.preservedRefreshMetadata = snapshot;
    }

    function restoreTabMetadataSnapshot(tab, snapshot) {
        if (!tab || !snapshot) return;
        tab.title = snapshot.title || tab.title;
        tab.number = snapshot.number || tab.number;
        tab.contact = snapshot.contact || tab.contact;
        tab.primaryResource = snapshot.primaryResource || tab.primaryResource || null;
        tab.priority = snapshot.priority || tab.priority || '';
        tab.status = snapshot.status || tab.status || '';
        tab.lastActivity = snapshot.lastActivity || tab.lastActivity || '';
        tab.pageWarning = snapshot.pageWarning || tab.pageWarning;
        tab.hoverFields = normalizeHoverFields(snapshot.hoverFields);
        tab.metadataFields = normalizeMetadataFields(snapshot.metadataFields);
    }

    function hasMeaningfulMetadataFields(fields) {
        const normalized = normalizeMetadataFields(fields);
        return Object.keys(normalized).some(function (key) {
            if (key === 'type' || key === 'secondaryTitle') return false;
            return !!String(normalized[key] || '').trim();
        });
    }

    function hasRichNavMetadata(data) {
        if (!data) return false;
        return hasMeaningfulMetadataFields(data.metadataFields) ||
            !!String(data.contact || '').trim() ||
            !!String(data.number || '').trim() ||
            !!(data.hoverFields && normalizeHoverFields(data.hoverFields).length);
    }

    function mergeMetadataFieldsPreservingExisting(existingFields, incomingFields) {
        const existing = normalizeMetadataFields(existingFields);
        const incoming = normalizeMetadataFields(incomingFields);
        const merged = Object.assign({}, existing);
        Object.keys(incoming).forEach(function (key) {
            const value = String(incoming[key] || '').trim();
            if (key === 'type' && String(existing.type || '').trim() &&
                /^(unknown|tab|autotask page)$/i.test(value)) {
                return;
            }
            if (value) merged[key] = incoming[key];
        });
        return normalizeMetadataFields(merged);
    }

    function mergeMetadataFields(existingFields, incomingFields) {
        return mergeMetadataFieldsPreservingExisting(existingFields, incomingFields);
    }

    const UMBRELLA_CONTRACT_FRAME_RELOAD_KEY = 'autotasktabs-umbrella-contract-frame-reload';
    const UMBRELLA_CONTRACT_DISCLAIMER = 'Experimental native AUTOTASKTABS tab: Umbrella Contracts are rendered by Autotask Onyx directly on the page, so AUTOTASKTABS keeps the page native while giving it a tab identity.';

    function isUmbrellaContractHomeUrl(url) {
        try {
            const parsed = new URL(url || '', location.origin);
            return parsed.pathname.toLowerCase() === '/autotaskonyx/landingpage' &&
                parsed.searchParams.get('view') === 'umbrella-contract-details';
        } catch (e) {
            return false;
        }
    }

    function localUmbrellaContractFrameExperimentAvailable() {
        return !!(
            globalThis.__AUTOTASKTABS_LOCAL_FLAGS__ &&
            globalThis.__AUTOTASKTABS_LOCAL_FLAGS__.umbrellaContractFrameExperiment
        );
    }

    function useExperimentalUmbrellaContractFrameTabs() {
        return localUmbrellaContractFrameExperimentAvailable() && !!state.experimentalUmbrellaContractFrameTabs;
    }

    function syncUmbrellaContractFrameRules(enabled) {
        if (!localUmbrellaContractFrameExperimentAvailable()) enabled = false;
        return sendRuntimeMessage({
            __autotasktabsUmbrellaContractFrameRules: true,
            type: 'set-enabled',
            enabled: !!enabled,
        });
    }

    function isNativeShellTabUrl(url) {
        return false;
    }

    function isNativeShellTab(tab) {
        return !!(tab && isNativeShellTabUrl(tab.url));
    }

    function activeUsesNonIframeContent() {
        return state.activeId === null || isNativeShellTab(tabById(state.activeId));
    }

    function umbrellaContractIdFromUrl(url) {
        try {
            const parsed = new URL(url || '', location.origin);
            const rawViewData = parsed.searchParams.get('view-data') || '';
            if (!rawViewData) return '';
            const data = JSON.parse(atob(rawViewData));
            const contractId = data && data.contractId;
            return contractId === undefined || contractId === null ? '' : String(contractId);
        } catch (e) {
            return '';
        }
    }

    function markUmbrellaContractFrameReload() {
        try {
            sessionStorage.setItem(UMBRELLA_CONTRACT_FRAME_RELOAD_KEY, String(Date.now()));
        } catch (e) {}
    }

    function hasPendingUmbrellaContractFrameReload() {
        try {
            const raw = sessionStorage.getItem(UMBRELLA_CONTRACT_FRAME_RELOAD_KEY);
            const timestamp = Number(raw || 0);
            return !!(timestamp && Date.now() - timestamp < 30000);
        } catch (e) {
            return false;
        }
    }

    function clearUmbrellaContractFrameReload() {
        try {
            sessionStorage.removeItem(UMBRELLA_CONTRACT_FRAME_RELOAD_KEY);
        } catch (e) {}
    }

    function reloadLoadedFramesAfterUmbrellaContract() {
        if (!state.tabs || !state.tabs.length) return false;
        // Returns true only after every entry has been visited and its iframe
        // has a non-empty src; that's the contract the caller relies on to
        // decide whether the pending flag may be cleared.
        let allTabsHandled = true;
        state.tabs.forEach(function (tab) {
            if (!tab) return;
            if (isNativeShellTab(tab)) {
                tab.autotasktabsReloadAfterUmbrellaContract = false;
                return;
            }
            if (!tab.iframeEl) {
                allTabsHandled = false;
                return;
            }
            const wasDeferred = tab.loadStarted === false
                || tab.iframeEl.dataset.autotasktabsLoadStarted === 'false';
            tab.autotasktabsReloadAfterUmbrellaContract = false;
            tab.loading = true;
            tab.loadStarted = true;
            tab.iframeEl.dataset.autotasktabsLoadStarted = 'true';
            tab.iframeEl.removeAttribute('data-autotasktabs-deferred-src');
            updateTabEl(tab);
            const currentSrc = tab.iframeEl.src || '';
            try {
                if (wasDeferred || !currentSrc || currentSrc === 'about:blank') {
                    // Lazy iframe — kick off the initial navigation. Don't
                    // try contentWindow.location.reload(): it will throw on
                    // an unattached document and give us nothing useful.
                    tab.iframeEl.src = tab.url;
                } else {
                    tab.iframeEl.contentWindow.location.reload();
                }
            } catch (e) {
                tab.iframeEl.src = tab.url;
            }
            // Final safety: if anything above left the iframe without a real
            // src, force one so the tab actually starts navigating instead
            // of staying invisibly deferred.
            if (!tab.iframeEl.src || tab.iframeEl.src === 'about:blank') {
                tab.iframeEl.src = tab.url;
                if (!tab.iframeEl.src || tab.iframeEl.src === 'about:blank') {
                    allTabsHandled = false;
                }
            }
        });
        updateLoaderVisibility();
        saveTabs();
        return allTabsHandled;
    }

    function reloadLoadedFramesAfterUmbrellaContractWhenReady() {
        if (!hasPendingUmbrellaContractFrameReload()) return;
        if (reloadLoadedFramesAfterUmbrellaContract()) {
            clearUmbrellaContractFrameReload();
            return;
        }
        window.setTimeout(reloadLoadedFramesAfterUmbrellaContractWhenReady, 250);
    }

    function updateLoaderVisibility() {
        if (!state.loader) return;
        const active = state.tabs.find(t => t.id === state.activeId);
        const group = getSplitGroupIds();
        const activeMemberId = active ? active.id : null;
        const splitVisible = !!(group.includes(activeMemberId) && group.length >= 2);
        const roundedSingleVisible = !!(state.roundedPageFramesEnabled && active && !splitVisible);
        const visibleSplitLoading = group.includes(activeMemberId)
            ? group.some(function (id) {
                const tab = tabById(id);
                return !!(tab && tab.id !== state.activeId && tab.loading);
            })
            : false;
        state.loader.classList.toggle('show', !!(
            state.contractProbeLoading ||
            (!splitVisible && !roundedSingleVisible && ((active && active.loading) || visibleSplitLoading))
        ));
        for (const tab of state.tabs) {
            if (!tab.loaderEl) continue;
            const show = !!tab.loading && (
                (splitVisible && group.includes(tab.id)) ||
                (roundedSingleVisible && tab.id === state.activeId)
            );
            tab.loaderEl.classList.toggle('show', show);
        }
    }

    function injectStyles() {
        if (document.getElementById('at-tabs-style')) return;
        const style = document.createElement('style');
        style.id = 'at-tabs-style';
        style.textContent = (shellRuntime.styles && shellRuntime.styles.shell) || '';
        (document.head || document.documentElement).appendChild(style);
    }

    function findContentIframe() {
        let best = null;
        let bestArea = 0;
        for (const f of document.querySelectorAll('iframe')) {
            if (state.viewport && state.viewport.contains(f)) continue;
            if (f.classList && f.classList.contains('at-tabs-peek-frame')) continue;
            if (f.closest && f.closest('.at-tabs-peek-wrapper')) continue;
            const src = f.getAttribute('src') || '';
            if (/dialogiframeoverlay/i.test(src)) continue;
            const r = f.getBoundingClientRect();
            if (r.width < 300 || r.height < 300) continue;
            const area = r.width * r.height;
            if (area > bestArea) {
                bestArea = area;
                best = f;
            }
        }
        return best;
    }

    function normalizeTabState(tab) {
        if (!tab) return tab;
        if (!tab.syncKey || typeof tab.syncKey !== 'string') {
            tab.syncKey = createRandomId('tab-');
        }
        tab.url = canonicalTabUrl(tab.url);
        tab.nativeShell = isNativeShellTabUrl(tab.url);
        tab.pinned = !!tab.pinned;
        tab.color = TAB_COLOR_PRESETS.includes(tab.color) ? tab.color : '';
        tab.pageWarning = !!tab.pageWarning;
        tab.hoverFields = normalizeHoverFields(tab.hoverFields);
        tab.metadataFields = normalizeMetadataFields(tab.metadataFields);
        return tab;
    }

    function canonicalTabUrl(url) {
        try {
            const parsed = new URL(url || '', location.origin);
            const path = parsed.pathname.toLowerCase();
            if (/\/contracts\/views\/contract(summary|side)\.asp$/i.test(path)) {
                const contractId = parsed.searchParams.get('contractID') || parsed.searchParams.get('contractId');
                if (contractId) {
                    const canonical = new URL('/contracts/views/contractView.asp', parsed.origin);
                    canonical.searchParams.set('contractID', contractId);
                    return canonical.href;
                }
            }
            return parsed.href;
        } catch (e) {
            return url || '';
        }
    }

    function getLineOptionsForType(type) {
        const normalizedType = normalizeTabType(type);
        const options = TAB_LINE_OPTIONS_BY_TYPE[normalizedType];
        if (Array.isArray(options) && options.length > 0) return options.slice();
        return CUSTOM_FIELD_OPTIONS.map(function (option) { return option.value; });
    }

    function getDefaultLineField(type, line) {
        const normalizedType = normalizeTabType(type);
        const defaultsByType = TAB_LINE_DEFAULT_BY_TYPE[normalizedType] || {};
        const lineKey = line === 2 || line === 'line2' ? 'line2' : 'line3';
        const fallback = defaultsByType[lineKey];
        const options = getLineOptionsForType(type);
        const optionSet = new Set(options);
        if (optionSet.has(fallback)) return fallback;
        if (optionSet.has('none')) return 'none';
        return options[0] || 'none';
    }

    function defaultTabLineSettings(line) {
        const settings = {};
        const target = line === 2 ? 'line2' : 'line3';
        CUSTOMIZABLE_TAB_TYPES.forEach(function (type) {
            settings[type] = getDefaultLineField(type, target);
        });
        return settings;
    }

    function normalizeTabLineSettings(settings, line) {
        const defaults = defaultTabLineSettings(line);
        CUSTOMIZABLE_TAB_TYPES.forEach(function (type) {
            const value = settings && settings[type];
            const options = getLineOptionsForType(type);
            if (options.includes(value)) defaults[type] = value;
        });
        return defaults;
    }

    function normalizeRepeatedIdPrefix(value) {
        return String(value || '').trim().replace(/^(?:ID\b\s*:?\s*){2,}/i, 'ID ');
    }

    function normalizeMetadataFields(fields) {
        if (!fields || typeof fields !== 'object') return {};
        const normalized = {};
        Object.keys(fields).forEach(function (key) {
            let value = String(fields[key] || '').trim();
            if (key === 'id' || key === 'number') value = normalizeRepeatedIdPrefix(value);
            if (value) normalized[key] = value.slice(0, 160);
        });
        return normalized;
    }

    function normalizeHoverFields(fields) {
        if (!Array.isArray(fields)) return [];
        return fields
            .map(function (field) {
                return {
                    label: String(field && field.label || '').trim().slice(0, 40),
                    value: String(field && field.value || '').trim().slice(0, 160),
                };
            })
            .filter(function (field) { return field.label; });
    }

    function clearRestoreLoadTimers() {
        for (const timerId of state.restoreLoadTimers || []) {
            window.clearTimeout(timerId);
        }
        state.restoreLoadTimers = [];
    }

    function ensureTabIframeLoaded(tab) {
        if (!tab || !tab.iframeEl || tab.loadStarted !== false) return;
        tab.loadStarted = true;
        tab.loading = true;
        tab.iframeEl.dataset.autotasktabsLoadStarted = 'true';
        tab.iframeEl.removeAttribute('data-autotasktabs-deferred-src');
        tab.iframeEl.src = tab.url;
        updateTabEl(tab);
        updateLoaderVisibility();
    }

    function scheduleRestoredTabsLoading(priorityTab) {
        clearRestoreLoadTimers();
        const priorityId = priorityTab && priorityTab.id;
        const orderedTabs = state.tabs.slice().sort(function (a, b) {
            if (priorityId && a.id === priorityId) return -1;
            if (priorityId && b.id === priorityId) return 1;
            return 0;
        });
        orderedTabs.forEach(function (tab, index) {
            if (!tab || tab.loadStarted !== false) return;
            const load = function () {
                ensureTabIframeLoaded(tab);
            };
            if (index === 0) {
                load();
                return;
            }
            const timerId = window.setTimeout(load, 200 + (index * 180));
            state.restoreLoadTimers.push(timerId);
        });
    }

    function ensureTabFreshAfterUmbrellaContract(tab) {
        if (!tab || !tab.autotasktabsReloadAfterUmbrellaContract) return;
        tab.autotasktabsReloadAfterUmbrellaContract = false;
        if (tab.loadStarted === false || (tab.iframeEl && tab.iframeEl.dataset.autotasktabsLoadStarted === 'false')) return;
        refreshTabIframe(tab);
    }

    function hexToRgb(hex) {
        const normalized = String(hex || '').trim().replace('#', '');
        if (!/^[0-9a-f]{6}$/i.test(normalized)) return null;
        return {
            r: parseInt(normalized.slice(0, 2), 16),
            g: parseInt(normalized.slice(2, 4), 16),
            b: parseInt(normalized.slice(4, 6), 16),
        };
    }


    function colorToRgba(hex, alpha) {
        const rgb = hexToRgb(hex);
        if (!rgb) return '';
        return 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', ' + alpha + ')';
    }

    function colorToSpriteFilter(hex) {
        const rgb = hexToRgb(hex);
        if (!rgb) return 'none';
        const max = Math.max(rgb.r, rgb.g, rgb.b);
        const min = Math.min(rgb.r, rgb.g, rgb.b);
        const lightness = (max + min) / 510;
        let hue = 0;
        const delta = max - min;
        if (delta) {
            if (max === rgb.r) hue = ((rgb.g - rgb.b) / delta) % 6;
            else if (max === rgb.g) hue = (rgb.b - rgb.r) / delta + 2;
            else hue = (rgb.r - rgb.g) / delta + 4;
            hue *= 60;
            if (hue < 0) hue += 360;
        }
        const saturation = max === min
            ? 0
            : delta / (255 - Math.abs((max + min) - 255));
        const brightness = Math.max(0.35, Math.min(1.65, 0.72 + lightness));
        const saturate = Math.max(0, Math.min(6, 0.55 + saturation * 4.2));
        return 'sepia(1) saturate(' + saturate.toFixed(2) + ') hue-rotate(' + (hue - 45).toFixed(0) + 'deg) brightness(' + brightness.toFixed(2) + ')';
    }

    function colorNeedsLightForeground(hex) {
        const rgb = hexToRgb(hex);
        if (!rgb) return false;
        const luminance = (0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b) / 255;
        return luminance < 0.54;
    }

    function buildTabsPayload() {
        const updatedAt = Date.now();
        // Dialog PopOut tabs (Note / Time Entry) cannot be restored:
        // their endpoints require a session-bound POST with form
        // fields that go stale immediately. A plain GET on refresh
        // hits Autotask's native error page. Exclude them from
        // persistence so refreshing simply drops the popout tab,
        // matching how a real browser-tab popout would behave.
        const persistableTabs = state.tabs.filter(function (t) {
            return !AUTOTASKTABS.isDialogPopOutFromDialogUrl(t.url);
        });
        return {
            updatedAt: updatedAt,
            clientId: state.tabsSyncClientId,
            tabs: persistableTabs.map(t => ({
                syncKey: t.syncKey || (t.syncKey = createRandomId('tab-')),
                url: canonicalTabUrl(t.url),
                title: t.title,
                browserTitle: t.browserTitle || '',
                number: t.number,
                contact: t.contact,
                primaryResource: t.primaryResource || null,
                pinned: !!t.pinned,
                color: t.color || '',
                priority: t.priority || '',
                status: t.status || '',
                lastActivity: t.lastActivity || '',
                pageWarning: !!t.pageWarning,
                hoverFields: normalizeHoverFields(t.hoverFields),
                metadataFields: normalizeMetadataFields(t.metadataFields),
            })),
            activeIndex: state.activeId === null
                ? null
                : persistableTabs.findIndex(t => t.id === state.activeId),
            splitIndex: state.splitId === null
                ? null
                : persistableTabs.findIndex(t => t.id === state.splitId),
            splitPairIndexes: getSplitPairIndexes(),
            splitPairColor: TAB_COLOR_PRESETS.includes(state.splitPairColor) ? state.splitPairColor : '',
            splitRatio: normalizeSplitRatio(state.splitRatio),
            splitRatios: normalizeSplitRatios(state.splitRatios, getSplitGroupIds().length),
            home: {
                url: getPersistableHomeUrl(),
                title: state.activeId === null && hasResolvedHomeTitle()
                    ? state.homeTitle
                    : (state.homePersistedTitle || ''),
            },
        };
    }

    function getSplitPairIndexes() {
        const pair = normalizeSplitPairIds(state.splitPairIds);
        if (!pair) return null;
        const indexes = pair.map(id => state.tabs.findIndex(tab => tab.id === id));
        return indexes.every(index => index >= 0) ? indexes : null;
    }

    function normalizeSplitRatio(value) {
        const numeric = typeof value === 'number' && Number.isFinite(value) ? value : 0.5;
        return Math.min(0.8, Math.max(0.2, numeric));
    }

    function defaultSplitRatios(count) {
        if (count === 3) return [1 / 3, 2 / 3];
        if (count === 4) return [0.25, 0.5, 0.75];
        return [normalizeSplitRatio(state.splitRatio)];
    }

    function normalizeSplitRatios(values, count) {
        const expected = Math.max(1, Math.min(3, Number(count || 2) - 1));
        const defaults = defaultSplitRatios(count);
        const ratios = [];
        for (let i = 0; i < expected; i++) {
            const fallback = defaults[i] || ((i + 1) / (expected + 1));
            const raw = Array.isArray(values) && typeof values[i] === 'number' && Number.isFinite(values[i])
                ? values[i]
                : fallback;
            const min = i === 0 ? 0.12 : ratios[i - 1] + 0.12;
            const max = i === expected - 1 ? 0.88 : 1 - ((expected - i) * 0.12);
            ratios.push(Math.min(max, Math.max(min, raw)));
        }
        return ratios;
    }

    function applySplitRatio() {
        state.splitRatio = normalizeSplitRatio(state.splitRatio);
        if (state.viewport) {
            state.viewport.style.setProperty('--at-tabs-split-left', (state.splitRatio * 100).toFixed(2) + '%');
            const count = getSplitGroupIds().length || 2;
            state.splitRatios = normalizeSplitRatios(state.splitRatios, count);
            state.splitRatios.forEach(function (ratio, index) {
                state.viewport.style.setProperty('--at-tabs-split-b' + (index + 1), (ratio * 100).toFixed(2) + '%');
            });
        }
    }

    function getPersistableHomeUrl() {
        const url = state.activeId === null ? currentNativeFrameUrl() : state.homePersistedUrl;
        if (!url || url === 'about:blank') return '';
        return url;
    }

    function handleNativeFrameLoad(event) {
        const frame = event.currentTarget;
        // New native page finished loading — clear the Home-tab spinner.
        clearHomeLoading();
        let url = '';
        try { url = frame.contentWindow.location.href; }
        catch (e) { url = frame.getAttribute('src') || ''; }
        if (!url || url === 'about:blank') return;
        syncHomeStateForNativeUrl(url, frame);

        if (state.activeId === null && AUTOTASKTABS.isHandledUrl(url)) {
            if (url !== state.nativeLastUrl) {
                openTab(url);
            }
            state.nativeLastUrl = url;
            return;
        }

        if (state.activeId === null) {
            state.nativeLastUrl = url;
            state.homePersistedUrl = url;
            if (hasResolvedHomeTitle()) state.homePersistedTitle = state.homeTitle;
            saveTabs();
            return;
        }

        const active = state.tabs.find(t => t.id === state.activeId);
        if (active && url !== active.url) {
            // On a parent-page refresh, Autotask always paints its own default
            // iframe (dashboard / last visited list / etc.). That load fires
            // shortly after mount and would otherwise evict the restored active
            // tab. Give the initial page load a grace window before treating
            // native loads as user-driven navigation.
            const INITIAL_LOAD_GRACE_MS = 4000;
            if (Date.now() - state.mountTime < INITIAL_LOAD_GRACE_MS) {
                state.nativeLastUrl = url;
                return;
            }
            activateHome();
        }
        state.nativeLastUrl = url;
    }

    function syncHomeStateForNativeUrl(url, frame) {
        if (!url || url === 'about:blank') return;
        if (isUmbrellaContractHomeUrl(url)) {
            syncUmbrellaContractHomeMetadata(url, frame);
            scheduleUmbrellaContractHomeMetadataSync(url, frame);
            if (hasPendingUmbrellaContractFrameReload()) {
                window.setTimeout(reloadLoadedFramesAfterUmbrellaContractWhenReady, 0);
            }
        } else {
            clearHomeMetadata();
            const nativeTitle = homeTitleForNativeUrl(url);
            if (nativeTitle) setHomeTitle(nativeTitle);
            else {
                const doc = nativeDocumentFromFrame(frame);
                const title = extractPageTitle(doc);
                if (title) setHomeTitle(title);
            }
        }
    }

    function syncNativeHomeRouteFromCurrentFrame() {
        if (state.activeId !== null) return;
        const frame = state.nativeFrame || findContentIframe();
        if (!frame) return;
        const url = currentNativeFrameUrl();
        if (!url || url === 'about:blank' || url === state.nativeLastUrl) return;
        syncHomeStateForNativeUrl(url, frame);
        state.nativeLastUrl = url;
        state.homePersistedUrl = url;
        if (hasResolvedHomeTitle()) state.homePersistedTitle = state.homeTitle;
        saveTabs();
    }

    function currentNativeFrameUrl() {
        const frame = state.nativeFrame || findContentIframe();
        if (!frame) return '';
        try { return frame.contentWindow.location.href || frame.getAttribute('src') || ''; }
        catch (e) { return frame.getAttribute('src') || ''; }
    }

    function hasResolvedHomeTitle() {
        const title = (state.homeTitle || '').trim();
        return !!title && title !== 'Home' && !/dialogiframeoverlaypage/i.test(title);
    }

    function clearHomeLoading() {
        state.homeLoadingAwaitingNativeLoad = false;
        state.homeLoadingUrl = '';
        if (state.homeLoadingClearTimer) {
            window.clearTimeout(state.homeLoadingClearTimer);
            state.homeLoadingClearTimer = 0;
        }
        setHomeLoading(false);
    }

    function scheduleHomeLoadingFailsafe() {
        if (state.homeLoadingClearTimer) window.clearTimeout(state.homeLoadingClearTimer);
        state.homeLoadingClearTimer = window.setTimeout(function () {
            state.homeLoadingClearTimer = 0;
            if (!state.homeLoadingAwaitingNativeLoad) return;
            if (hasResolvedHomeTitle()) clearHomeLoading();
        }, 8000);
    }

    function startNativeHomeLoading() {
        if (state.activeId !== null) return;
        const currentUrl = currentNativeFrameUrl();
        if (!currentUrl && !findContentIframe() && state.showTabBarOnNonIframePages) {
            clearHomeLoading();
            scheduleNonIframeTitleUpdate();
            return;
        }
        if (hasResolvedHomeTitle() && currentUrl && currentUrl === state.nativeLastUrl) return;
        state.homeLoadingAwaitingNativeLoad = true;
        state.homeLoadingUrl = currentUrl || '';
        setHomeLoading(true);
        scheduleHomeLoadingFailsafe();
    }

    function isShellOwnedMutationTarget(target) {
        return !!(target && (
            target === state.viewport ||
            target === state.bar ||
            target === state.homeCover ||
            (state.viewport && state.viewport.contains(target)) ||
            (state.bar && state.bar.contains(target)) ||
            (state.homeCover && state.homeCover.contains(target))
        ));
    }

    function trackNativeFrame(frame) {
        if (state.nativeFrame === frame) return;
        if (state.nativeFrame) {
            state.nativeFrame.removeEventListener('load', handleNativeFrameLoad);
        }
        if (state.nativeFrameSrcObserver) {
            state.nativeFrameSrcObserver.disconnect();
            state.nativeFrameSrcObserver = null;
        }
        state.nativeFrame = frame;
        state.nativeFrameObservedSrc = frame ? (frame.getAttribute('src') || '') : '';
        if (frame) {
            frame.addEventListener('load', handleNativeFrameLoad);
            if (state.activeId === null && state.nativeFrameObservedSrc && state.nativeFrameObservedSrc !== state.nativeLastUrl) {
                startNativeHomeLoading();
            }
            state.nativeFrameSrcObserver = new MutationObserver(function () {
                const nextSrc = frame.getAttribute('src') || '';
                if (nextSrc === state.nativeFrameObservedSrc) return;
                state.nativeFrameObservedSrc = nextSrc;
                if (state.activeId === null) startNativeHomeLoading();
            });
            state.nativeFrameSrcObserver.observe(frame, { attributes: true, attributeFilter: ['src'] });
        }
    }

    function saveTabs() {
        if (state.tabsSyncApplyingRemote) return;
        if (!state.tabs.length && !state.tabsSyncHasOwnedTabs && !getPersistableHomeUrl()) return;
        const payload = buildTabsPayload();
        state.tabsSyncLastSeenAt = payload.updatedAt || Date.now();
        void AUTOTASKTABS.writeTabsPayload(payload);
    }

    function addTabToList(tab) {
        const normalized = normalizeTabState(tab);
        state.tabsSyncHasOwnedTabs = true;
        if (!state.openNewTabsAtStart || normalized.pinned) {
            state.tabs.push(normalized);
            return normalized;
        }

        const firstUnpinnedIndex = state.tabs.findIndex(function (candidate) {
            return !candidate.pinned;
        });
        const insertIndex = firstUnpinnedIndex === -1 ? state.tabs.length : firstUnpinnedIndex;
        state.tabs.splice(insertIndex, 0, normalized);
        return normalized;
    }

    async function restoreTabs() {
        let payload;
        try {
            payload = await AUTOTASKTABS.readTabsPayload();
        } catch (e) { return; }
        if (!payload || !Array.isArray(payload.tabs)) return;

        const savedHome = payload.home && typeof payload.home === 'object' ? payload.home : null;
        if (savedHome && savedHome.url) {
            state.nativeLastUrl = savedHome.url;
            state.homePersistedUrl = savedHome.url;
            state.homePersistedTitle = savedHome.title || '';
            if (savedHome.title) setHomeTitle(savedHome.title);
        }

        for (const saved of payload.tabs) {
            if (!saved.url) continue;
            const savedUrl = canonicalTabUrl(saved.url);
            const nativeShell = isNativeShellTabUrl(savedUrl);
            const iframeEl = nativeShell ? null : createTabIframe(savedUrl, { deferLoad: true });
            const loaderEl = nativeShell ? null : createTabPaneLoader();
            if (iframeEl) state.viewport.appendChild(iframeEl);
            if (loaderEl) state.viewport.appendChild(loaderEl);
            state.tabs.push(normalizeTabState({
                id: state.nextId++,
                syncKey: saved.syncKey || '',
                url: savedUrl,
                title: saved.title || '',
                browserTitle: saved.browserTitle || '',
                number: saved.number || '',
                contact: saved.contact || '',
                primaryResource: saved.primaryResource || null,
                pinned: !!saved.pinned,
                color: saved.color || '',
                priority: saved.priority || '',
                status: saved.status || '',
                lastActivity: saved.lastActivity || '',
                pageWarning: !!saved.pageWarning,
                hoverFields: normalizeHoverFields(saved.hoverFields),
                metadataFields: normalizeMetadataFields(saved.metadataFields),
                iframeEl,
                loaderEl,
                tabEl: null,
                nativeShell: nativeShell,
                loading: !nativeShell,
                loadStarted: nativeShell ? true : false,
            }));
        }
        state.tabsSyncHasOwnedTabs = state.tabs.length > 0;
        state.tabsSyncLastSeenAt = Number(payload.updatedAt) || Date.now();
        renderTabs();
        if (typeof payload.splitRatio === 'number') {
            state.splitRatio = normalizeSplitRatio(payload.splitRatio);
        }
        if (Array.isArray(payload.splitRatios)) {
            state.splitRatios = normalizeSplitRatios(payload.splitRatios, payload.splitPairIndexes && payload.splitPairIndexes.length || 2);
        }
        state.splitPairColor = TAB_COLOR_PRESETS.includes(payload.splitPairColor) ? payload.splitPairColor : '';
        const idx = payload.activeIndex;
        const splitIdx = payload.splitIndex;
        if (Array.isArray(payload.splitPairIndexes)
            && payload.splitPairIndexes.length >= 2) {
            const restoredSplitIds = [];
            payload.splitPairIndexes.slice(0, 4).forEach(function (splitIndex) {
                if (typeof splitIndex !== 'number' || !state.tabs[splitIndex]) return;
                const id = state.tabs[splitIndex].id;
                if (!restoredSplitIds.includes(id)) restoredSplitIds.push(id);
            });
            state.splitPairIds = restoredSplitIds.length >= 2 ? restoredSplitIds : null;
            state.splitId = state.splitPairIds ? state.splitPairIds.find(id => typeof idx !== 'number' || !state.tabs[idx] || id !== state.tabs[idx].id) || null : null;
        } else if (typeof idx === 'number' && idx >= 0 && state.tabs[idx]
            && typeof splitIdx === 'number' && splitIdx >= 0 && state.tabs[splitIdx]
            && idx !== splitIdx) {
            state.splitPairIds = [state.tabs[idx].id, state.tabs[splitIdx].id];
            state.splitId = state.tabs[splitIdx].id;
        } else {
            state.splitPairIds = null;
            state.splitId = null;
        }
        if (typeof idx === 'number' && idx >= 0 && state.tabs[idx]) {
            // Browser refresh should restore the selected tab as a live page, not
            // just a selected deferred iframe. `activateTab()` defaults to loading
            // the active tab, and if it belongs to a split group it also loads the
            // visible split partner(s). Background restored tabs remain lazy.
            activateTab(state.tabs[idx].id, { recordPrevious: false });
            clearHomeLoading();
            scheduleRestoredTabsLoading(state.tabs[idx]);
        } else {
            activateHome();
            if (savedHome && savedHome.url) {
                const frame = state.nativeFrame || findContentIframe();
                if (frame) {
                    try {
                        if ((frame.getAttribute('src') || '') !== savedHome.url) frame.src = savedHome.url;
                    } catch (e) {}
                }
            }
            scheduleRestoredTabsLoading(null);
        }
    }

    function createLazyTabFromSaved(saved) {
        const savedUrl = canonicalTabUrl(saved.url);
        const nativeShell = isNativeShellTabUrl(savedUrl);
        const iframeEl = nativeShell ? null : createTabIframe(savedUrl, { deferLoad: true });
        const loaderEl = nativeShell ? null : createTabPaneLoader();
        if (iframeEl) state.viewport.appendChild(iframeEl);
        if (loaderEl) state.viewport.appendChild(loaderEl);
        return normalizeTabState({
            id: state.nextId++,
            syncKey: saved.syncKey || '',
            url: savedUrl,
            title: saved.title || '',
            browserTitle: saved.browserTitle || '',
            number: saved.number || '',
            contact: saved.contact || '',
            primaryResource: saved.primaryResource || null,
            pinned: !!saved.pinned,
            color: saved.color || '',
            priority: saved.priority || '',
            status: saved.status || '',
            lastActivity: saved.lastActivity || '',
            pageWarning: !!saved.pageWarning,
            hoverFields: normalizeHoverFields(saved.hoverFields),
            metadataFields: normalizeMetadataFields(saved.metadataFields),
            iframeEl: iframeEl,
            loaderEl: loaderEl,
            tabEl: null,
            nativeShell: nativeShell,
            loading: false,
            loadStarted: nativeShell ? true : false,
        });
    }

    function applySavedMetadataToTab(tab, saved) {
        tab.syncKey = saved.syncKey || tab.syncKey || createRandomId('tab-');
        tab.url = canonicalTabUrl(saved.url || tab.url);
        tab.title = saved.title || '';
        tab.browserTitle = saved.browserTitle || '';
        tab.number = saved.number || '';
        tab.contact = saved.contact || '';
        tab.primaryResource = saved.primaryResource || null;
        tab.pinned = !!saved.pinned;
        tab.color = saved.color || '';
        tab.priority = saved.priority || '';
        tab.status = saved.status || '';
        tab.lastActivity = saved.lastActivity || '';
        tab.pageWarning = !!saved.pageWarning;
        tab.hoverFields = normalizeHoverFields(saved.hoverFields);
        tab.metadataFields = normalizeMetadataFields(saved.metadataFields);
        normalizeTabState(tab);
        ensureTabRuntimeForUrl(tab, { deferLoad: true });
        return tab;
    }

    function takeReusableTab(saved, pools) {
        if (saved.syncKey && pools.byKey.has(saved.syncKey)) {
            const tab = pools.byKey.get(saved.syncKey);
            pools.byKey.delete(saved.syncKey);
            const urlPool = pools.byUrl.get(tab.url) || [];
            const urlIndex = urlPool.indexOf(tab);
            if (urlIndex >= 0) urlPool.splice(urlIndex, 1);
            return tab;
        }
        const candidates = pools.byUrl.get(saved.url) || [];
        return candidates.shift() || null;
    }

    function buildTabReusePools() {
        const byKey = new Map();
        const byUrl = new Map();
        state.tabs.forEach(function (tab) {
            if (tab.syncKey) byKey.set(tab.syncKey, tab);
            const list = byUrl.get(tab.url) || [];
            list.push(tab);
            byUrl.set(tab.url, list);
        });
        return { byKey, byUrl };
    }

    function applyRemoteTabsPayload(payload) {
        if (!featuresEnabled()) return;
        if (!payload || !Array.isArray(payload.tabs)) return;
        if (payload.clientId && payload.clientId === state.tabsSyncClientId) return;
        const updatedAt = Number(payload.updatedAt) || Date.now();
        if (updatedAt < state.tabsSyncLastSeenAt) return;
        state.tabsSyncLastSeenAt = updatedAt;
        state.tabsSyncApplyingRemote = true;
        clearRestoreLoadTimers();

        const previousActiveId = state.activeId;
        const reusable = buildTabReusePools();
        const nextTabs = [];
        const reused = new Set();
        payload.tabs.forEach(function (saved) {
            if (!saved || !saved.url) return;
            const existing = takeReusableTab(saved, reusable);
            const tab = existing
                ? applySavedMetadataToTab(existing, saved)
                : createLazyTabFromSaved(saved);
            reused.add(tab);
            nextTabs.push(tab);
        });

        state.tabs.forEach(function (tab) {
            if (reused.has(tab)) return;
            try { if (tab.iframeEl) tab.iframeEl.remove(); } catch (e) {}
            try { if (tab.loaderEl) tab.loaderEl.remove(); } catch (e) {}
        });

        state.tabs = nextTabs;
        state.tabsSyncHasOwnedTabs = state.tabs.length > 0;
        const maxId = state.tabs.reduce(function (max, tab) { return Math.max(max, tab.id || 0); }, 0);
        state.nextId = Math.max(state.nextId, maxId + 1);
        if (previousActiveId !== null && tabById(previousActiveId)) {
            state.activeId = previousActiveId;
        } else {
            state.activeId = null;
            state.splitId = null;
            state.splitPairIds = null;
        }
        if (state.splitPairIds) {
            const validSplitIds = state.splitPairIds.filter(function (id) { return !!tabById(id); });
            state.splitPairIds = validSplitIds.length >= 2 ? validSplitIds : null;
            if (!state.splitPairIds) {
                state.splitId = null;
                state.splitPairColor = '';
            }
        }
        state.activationHistory = state.activationHistory.filter(function (id) {
            return id === null || !!tabById(id);
        });

        renderTabs();
        syncTabPaneState();
        updateHomeTabActive();
        updateLoaderVisibility();
        requestSyncGeometry();
        ensureActiveTabVisible();
        updateTabScrollButtons();
        state.tabsSyncApplyingRemote = false;
    }

    function installTabsMetadataSyncWatcher() {
        if (state.tabsSyncWatcherInstalled) return;
        if (!AUTOTASKTABS.hasChromeStorage()) return;
        try {
            if (!chrome.storage || !chrome.storage.onChanged) return;
            chrome.storage.onChanged.addListener(function (changes, areaName) {
                if (areaName !== 'local') return;
                const change = changes && changes[AUTOTASKTABS.STORAGE_KEY];
                if (!change || !change.newValue) return;
                applyRemoteTabsPayload(change.newValue);
            });
            state.tabsSyncWatcherInstalled = true;
        } catch (e) {}
    }

    // The native Home iframe is shifted by syncGeometry itself. Keep this as a
    // cleanup path for older internal/external spacer attempts so stale classes
    // do not double-offset content after an extension reload.
    function ensureNativeFrameSpacer(frame) {
        if (!frame) return;

        let doc;
        try {
            doc = frame.contentDocument;
        } catch (e) {
            return;
        }
        if (!doc) return;

        const style = doc.getElementById('at-native-frame-shell-style');
        if (style) style.remove();
        const bridgeStyle = doc.getElementById('autotasktabs-native-body-shell-padding-style');
        if (bridgeStyle) bridgeStyle.remove();
        if (doc.documentElement) doc.documentElement.classList.remove('at-native-frame-shell-offset');
        if (doc.documentElement) doc.documentElement.classList.remove('autotasktabs-native-html-shell-padding');
        if (doc.body) {
            doc.body.classList.remove('at-native-frame-shell-offset');
            doc.body.classList.remove('autotasktabs-native-body-shell-padding');
        }
    }

    function rememberInlineStyle(el, prop, key) {
        if (!el || Object.prototype.hasOwnProperty.call(el.dataset, key)) return;
        el.dataset[key] = el.style.getPropertyValue(prop) || '';
        el.dataset[key + 'Priority'] = el.style.getPropertyPriority(prop) || '';
    }

    function restoreInlineStyle(el, prop, key) {
        if (!el || !Object.prototype.hasOwnProperty.call(el.dataset, key)) return;
        const value = el.dataset[key] || '';
        const priority = el.dataset[key + 'Priority'] || '';
        if (value) el.style.setProperty(prop, value, priority);
        else el.style.removeProperty(prop);
        delete el.dataset[key];
        delete el.dataset[key + 'Priority'];
    }

    function clearLegacyNativeFrameOffset(frame) {
        if (!frame) return;
        if (frame.dataset.autotasktabsNativeFrameOffset === 'true') {
            frame.style.removeProperty('margin-top');
            frame.style.removeProperty('translate');
            frame.style.removeProperty('height');
            frame.style.removeProperty('display');
            delete frame.dataset.autotasktabsNativeFrameOffset;
            return;
        }

        const marginTop = parseFloat(frame.style.getPropertyValue('margin-top')) || 0;
        if (Math.abs(marginTop - currentHorizontalBarHeight()) < 0.5 || Math.abs(marginTop - AUTOTASKTABS.BAR_H) < 0.5) frame.style.removeProperty('margin-top');
        if (frame.style.getPropertyValue('translate')) frame.style.removeProperty('translate');
    }

    function isVerticalBar() {
        return state.barOrientation === 'vertical';
    }

    function horizontalCompactTabsActive() {
        return !!state.horizontalCompactTabsEnabled && !isVerticalBar();
    }

    function currentHorizontalBarHeight() {
        return horizontalCompactTabsActive() ? 32 : AUTOTASKTABS.BAR_H;
    }

    function normalizedTabBarWidth(value) {
        const raw = Number(value);
        const fallback = AUTOTASKTABS.BAR_W || 240;
        const min = AUTOTASKTABS.BAR_W_MIN || 56;
        const max = AUTOTASKTABS.BAR_W_MAX || 420;
        if (!Number.isFinite(raw)) return fallback;
        return Math.max(min, Math.min(max, Math.round(raw)));
    }

    function currentVerticalBarWidth() {
        if (!state.resizableTabBarEnabled) return AUTOTASKTABS.BAR_W;
        return normalizedTabBarWidth(state.tabBarWidth);
    }

    function isCompactVerticalBar() {
        return state.resizableTabBarEnabled && isVerticalBar() && currentVerticalBarWidth() <= (AUTOTASKTABS.BAR_W_COMPACT || 96);
    }

    function updateResizableBarClasses() {
        document.documentElement.classList.toggle('autotasktabs-resizable-tabs', !!state.resizableTabBarEnabled);
        document.documentElement.classList.toggle('autotasktabs-compact-tabs', !!state.horizontalCompactTabsEnabled);
        document.documentElement.classList.toggle('autotasktabs-horizontal-compact-tabs', !!state.horizontalCompactTabsEnabled);
        if (!state.bar) return;
        state.bar.classList.toggle('compact', isCompactVerticalBar());
        state.bar.classList.toggle('hover-expanded', isCompactVerticalBar() && !!state.tabBarHoverExpanded);
        state.bar.classList.toggle('resizing', !!state.tabBarResizing);
        state.bar.style.setProperty('--autotasktabs-expanded-bar-width', AUTOTASKTABS.BAR_W + 'px');
        state.bar.style.setProperty('--autotasktabs-collapsed-bar-width', currentVerticalBarWidth() + 'px');
        updateTabBarCollapseButton();
    }

    function updateTabBarCollapseButton() {
        if (!state.tabBarCollapseButton) return;
        const collapsed = isCompactVerticalBar();
        state.tabBarCollapseButton.classList.toggle('collapsed', collapsed);
        state.tabBarCollapseButton.title = collapsed ? 'Expand tab bar' : 'Collapse tab bar';
        state.tabBarCollapseButton.setAttribute('aria-label', collapsed ? 'Expand tab bar' : 'Collapse tab bar');
    }

    function updateClosedTabsButton() {
        if (!state.closedTabsButton) return;
        const latest = state.closedTabs && state.closedTabs.length ? state.closedTabs[0] : null;
        const title = latest && (latest.title || latest.number || latest.url)
            ? 'Reopen closed tab: ' + (latest.title || latest.number || latest.url)
            : 'Reopen closed tab';
        state.closedTabsButton.disabled = !latest;
        state.closedTabsButton.title = title;
        state.closedTabsButton.setAttribute('aria-label', title);
    }

    function toggleVerticalTabBarCollapse(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        if (!isVerticalBar()) return;
        const compactThreshold = AUTOTASKTABS.BAR_W_COMPACT || 96;
        const collapsedWidth = AUTOTASKTABS.BAR_W_MIN || 56;
        const expandedWidth = normalizedTabBarWidth(state.tabBarLastExpandedWidth || AUTOTASKTABS.BAR_W || 240);
        const currentWidth = currentVerticalBarWidth();
        const collapsed = currentWidth <= compactThreshold;
        state.resizableTabBarEnabled = true;
        AUTOTASKTABS.state.resizableTabBarEnabled = true;
        if (collapsed) {
            state.tabBarWidth = expandedWidth;
        } else {
            state.tabBarLastExpandedWidth = currentWidth;
            state.tabBarWidth = collapsedWidth;
        }
        AUTOTASKTABS.state.tabBarWidth = state.tabBarWidth;
        state.tabBarHoverExpanded = false;
        cancelTabBarExpandTimer();
        updateResizableBarClasses();
        requestSyncGeometry();
        void AUTOTASKTABS.saveSettings();
    }

    function cancelTabBarExpandTimer() {
        if (!state.tabBarExpandTimer) return;
        window.clearTimeout(state.tabBarExpandTimer);
        state.tabBarExpandTimer = 0;
    }

    function cancelTabBarCollapseTimer() {
        if (!state.tabBarCollapseTimer) return;
        window.clearTimeout(state.tabBarCollapseTimer);
        state.tabBarCollapseTimer = 0;
    }

    function isResizeHandleEvent(event) {
        return !!(event && event.target && event.target.closest && event.target.closest('.at-tabs-resize-handle'));
    }

    function isTabBarHoverExpandControlEvent(event) {
        if (!event || typeof document.elementFromPoint !== 'function') return false;
        const target = event.target && event.target.closest ? event.target : null;
        const hovered = document.elementFromPoint(event.clientX, event.clientY);
        return !!(
            (target && target.closest('.at-tabs-collapse-button, .at-tabs-reopen-button')) ||
            (hovered && hovered.closest && hovered.closest('.at-tabs-collapse-button, .at-tabs-reopen-button'))
        );
    }

    function scheduleTabBarHoverExpand(event) {
        if (!isCompactVerticalBar() || state.tabBarResizing) return;
        if (isResizeHandleEvent(event)) return;
        if (isTabBarHoverExpandControlEvent(event)) {
            cancelTabBarExpandTimer();
            return;
        }
        cancelTabBarCollapseTimer();
        if (state.tabBarResizeHandleHovered) return;
        if (state.tabBarHoverExpanded || state.tabBarExpandTimer) return;
        state.tabBarExpandTimer = window.setTimeout(function () {
            state.tabBarExpandTimer = 0;
            if (!isCompactVerticalBar() || state.tabBarResizing) return;
            state.tabBarHoverExpanded = true;
            updateResizableBarClasses();
        }, 300);
    }

    function collapseTabBarHoverExpand() {
        cancelTabBarExpandTimer();
        cancelTabBarCollapseTimer();
        if (!state.tabBarHoverExpanded || state.tabBarResizing) return;
        state.tabBarHoverExpanded = false;
        updateResizableBarClasses();
    }

    function scheduleTabBarHoverCollapse() {
        cancelTabBarExpandTimer();
        if (!state.tabBarHoverExpanded || state.tabBarResizing) return;
        cancelTabBarCollapseTimer();
        state.tabBarCollapseTimer = window.setTimeout(function () {
            state.tabBarCollapseTimer = 0;
            if (state.bar && state.bar.matches(':hover')) return;
            if (!isCompactVerticalBar() || state.tabBarResizing) return;
            state.tabBarHoverExpanded = false;
            updateResizableBarClasses();
        }, 1000);
    }

    function reservationAxis(el) {
        // Returns the axis that's currently reserved on the given element via
        // our dataset markers, even if state.barOrientation has since changed.
        // 'horizontal' = padding-top reservation, 'vertical' = padding-left.
        if (!el || !el.dataset) return null;
        if (el.dataset.autotasktabsNativeChromeReservedAxis === 'vertical') return 'vertical';
        if (el.dataset.autotasktabsNativeChromeReservedAxis === 'horizontal') return 'horizontal';
        if (el.dataset.autotasktabsNativeChromeReserved === 'true') return 'horizontal';
        return null;
    }

    function nativeFrameReservationAmount(frame) {
        const container = frame && frame.parentElement;
        const axis = reservationAxis(container) || reservationAxis(frame);
        if (!axis) return { top: 0, left: 0 };
        const roundedInset = frame && frame.dataset && frame.dataset.autotasktabsNativeRoundedFrame === 'true' ? 8 : 0;
        if (axis === 'vertical') {
            return {
                top: roundedInset,
                left: currentVerticalBarWidth() + roundedInset,
                right: roundedInset,
                bottom: roundedInset,
            };
        }
        return {
            top: currentHorizontalBarHeight() + roundedInset,
            left: roundedInset,
            right: roundedInset,
            bottom: roundedInset,
        };
    }

    function nonIframeReservationAxis(el) {
        if (!el || !el.dataset) return null;
        if (el.dataset.autotasktabsNonIframeReservedAxis === 'vertical') return 'vertical';
        if (el.dataset.autotasktabsNonIframeReservedAxis === 'horizontal') return 'horizontal';
        if (el.dataset.autotasktabsNonIframeReserved === 'true') return 'horizontal';
        return null;
    }

    function findNonIframeContentContainer() {
        return document.querySelector('main') ||
            document.querySelector('[role="main"]') ||
            document.querySelector('.min-w-0.flex-1') ||
            null;
    }

    function findNonIframeContentSurface(container) {
        if (!container) return null;
        const children = Array.prototype.slice.call(container.children || []);
        let best = null;
        let bestArea = 0;
        children.forEach(function (child) {
            if (child.classList && Array.prototype.some.call(child.classList, function (className) {
                return className.indexOf('at-tabs-') === 0 || className.indexOf('autotasktabs-') === 0;
            })) return;
            const rect = child.getBoundingClientRect();
            const area = Math.max(0, rect.width) * Math.max(0, rect.height);
            if (area > bestArea) {
                best = child;
                bestArea = area;
            }
        });
        return best || null;
    }

    function applyNonIframeRoundedSurfaceStyles() {
        // Always start by clearing styles from anything we marked on a
        // previous run. Two reasons:
        //   1. The toggle-off path used to leave styles stranded on the
        //      page until refresh.
        //   2. If our selector incidentally picks up something it
        //      shouldn't (e.g. the Onyx left side panel), narrowing the
        //      filter later only helps after we strip the old hits.
        Array.prototype.forEach.call(
            document.querySelectorAll('[data-autotasktabs-non-iframe-rounded-surface="true"]'),
            function (el) {
                el.style.removeProperty('border-radius');
                el.style.removeProperty('clip-path');
                el.style.removeProperty('overflow');
                delete el.dataset.autotasktabsNonIframeRoundedSurface;
            }
        );

        if (!state.roundedPageFramesEnabled || !state.nonIframeReservedContainer || !activeUsesNonIframeContent()) return;
        const clippingEnabled = state.roundedPageFramesEnabled;
        const selectors = [
            '[class~="bg-background-primary"][class~="h-full"][class~="flex"]',
            '[class~="bg-background-primary"][class~="flex-grow"][class~="h-full"]',
            '[class~="bg-background-primary"][class~="height:100%"]',
            '.o-view-layout',
        ];
        // Main content panels span most of the viewport; side panels,
        // tooltips, and similar chrome don't. Use both an absolute floor
        // and a viewport-relative floor so narrow chrome can't sneak past.
        const minSurfaceWidth = Math.max(420, Math.round(window.innerWidth * 0.5));
        const candidates = [];
        selectors.forEach(function (selector) {
            Array.prototype.forEach.call(document.querySelectorAll(selector), function (el) {
                if (!el || el === document.body || el === document.documentElement || el === state.nonIframeReservedContainer) return;
                if (el.classList && Array.prototype.some.call(el.classList, function (className) {
                    return className.indexOf('at-tabs-') === 0 || className.indexOf('autotasktabs-') === 0;
                })) return;
                // Skip elements that explicitly fix themselves to a narrow
                // width — Onyx uses Tailwind arbitrary-value classes like
                // `w-[15rem]` / `max-w-[15rem]` for the left side panel
                // and similar chrome. Main content surfaces don't have
                // hard-pinned narrow widths.
                const cls = typeof el.className === 'string' ? el.className : '';
                if (/\b(?:w|max-w|min-w)-\[\s*(?:[0-9]{1,2}(?:\.[0-9]+)?\s*rem|[0-9]{1,3}\s*px)\s*\]/i.test(cls)) return;
                if (/\b(?:side-?panel|sidebar|drawer|popover|tooltip)\b/i.test(cls)) return;
                candidates.push(el);
            });
        });
        candidates.forEach(function (surface) {
            const rect = surface.getBoundingClientRect();
            if (rect.width < minSurfaceWidth || rect.height < 200) return;
            surface.dataset.autotasktabsNonIframeRoundedSurface = 'true';
            surface.style.setProperty('border-radius', '10px', 'important');
            if (clippingEnabled) {
                surface.style.setProperty('clip-path', 'inset(0 round 10px)', 'important');
                surface.style.setProperty('overflow', 'hidden', 'important');
            } else {
                surface.style.removeProperty('clip-path');
            }
        });
    }

    function scheduleNonIframeRoundedSurfaceStyles() {
        if (state.nonIframeRoundedSurfaceRaf) return;
        state.nonIframeRoundedSurfaceRaf = window.requestAnimationFrame(function () {
            state.nonIframeRoundedSurfaceRaf = 0;
            applyNonIframeRoundedSurfaceStyles();
        });
    }

    function readNoIframeBase(container) {
        const target = container || findNonIframeContentContainer();
        if (target) {
            const rect = target.getBoundingClientRect();
            return {
                top: rect.top,
                left: rect.left,
                width: rect.width,
                height: rect.height,
            };
        }
        const left = 240;
        const top = 56;
        return {
            top: top,
            left: left,
            width: Math.max(0, window.innerWidth - left),
            height: Math.max(0, window.innerHeight - top),
        };
    }

    function readNativeFrameBase(frame) {
        const rect = frame.getBoundingClientRect();
        const off = nativeFrameReservationAmount(frame);
        return {
            top: rect.top - off.top,
            left: rect.left - off.left,
            width: rect.width + off.left + (off.right || 0),
            height: rect.height + off.top + (off.bottom || 0),
        };
    }

    function snapCssPixel(value) {
        const n = Number(value);
        if (!Number.isFinite(n)) return 0;
        const dpr = window.devicePixelRatio || 1;
        return Math.round(n * dpr) / dpr;
    }

    function cssPx(value) {
        return snapCssPixel(value) + 'px';
    }

    function setCssPx(el, property, value) {
        if (!el) return;
        el.style[property] = cssPx(value);
    }

    function clearNativeChromeReservation(frame) {
        const container = state.nativeReservedContainer ||
            (frame && frame.parentElement && reservationAxis(frame.parentElement)
                ? frame.parentElement
                : null);

        if (container) {
            restoreInlineStyle(container, 'padding-top', 'autotasktabsPrevPaddingTop');
            restoreInlineStyle(container, 'padding-left', 'autotasktabsPrevPaddingLeft');
            restoreInlineStyle(container, 'box-sizing', 'autotasktabsPrevBoxSizing');
            restoreInlineStyle(container, 'overflow', 'autotasktabsPrevOverflow');
            restoreInlineStyle(container, 'background', 'autotasktabsPrevBackground');
            restoreInlineStyle(container, 'width', 'autotasktabsPrevNativeSplitWidth');
            delete container.dataset.autotasktabsNativeChromeReserved;
            delete container.dataset.autotasktabsNativeChromeReservedAxis;
        }
        state.nativeReservedContainer = null;

        if (!frame) return;
        restoreInlineStyle(frame, 'margin-top', 'autotasktabsPrevMarginTop');
        restoreInlineStyle(frame, 'margin-left', 'autotasktabsPrevMarginLeft');
        restoreInlineStyle(frame, 'height', 'autotasktabsPrevHeight');
        restoreInlineStyle(frame, 'width', 'autotasktabsPrevWidth');
        restoreInlineStyle(frame, 'display', 'autotasktabsPrevDisplay');
        restoreInlineStyle(frame, 'border-radius', 'autotasktabsPrevBorderRadius');
        restoreInlineStyle(frame, 'border', 'autotasktabsPrevBorder');
        restoreInlineStyle(frame, 'box-shadow', 'autotasktabsPrevBoxShadow');
        restoreInlineStyle(frame, 'box-sizing', 'autotasktabsPrevFrameBoxSizing');
        restoreInlineStyle(frame, 'max-width', 'autotasktabsPrevNativeSplitMaxWidth');
        restoreInlineStyle(frame, 'clip-path', 'autotasktabsPrevNativeSplitClipPath');
        delete frame.dataset.autotasktabsNativeChromeReserved;
        delete frame.dataset.autotasktabsNativeChromeReservedAxis;
        delete frame.dataset.autotasktabsNativeRoundedFrame;
        clearLegacyNativeFrameOffset(frame);
    }

    function clearNonIframeReservation() {
        const container = state.nonIframeReservedContainer ||
            (findNonIframeContentContainer() && nonIframeReservationAxis(findNonIframeContentContainer())
                ? findNonIframeContentContainer()
                : null);
        const surface = state.nonIframeReservedSurface ||
            (container ? findNonIframeContentSurface(container) : null);
        if (surface) {
            restoreInlineStyle(surface, 'border-radius', 'autotasktabsPrevNonIframeSurfaceBorderRadius');
            restoreInlineStyle(surface, 'border', 'autotasktabsPrevNonIframeSurfaceBorder');
            restoreInlineStyle(surface, 'box-shadow', 'autotasktabsPrevNonIframeSurfaceBoxShadow');
            restoreInlineStyle(surface, 'box-sizing', 'autotasktabsPrevNonIframeSurfaceBoxSizing');
            restoreInlineStyle(surface, 'overflow', 'autotasktabsPrevNonIframeSurfaceOverflow');
            restoreInlineStyle(surface, 'clip-path', 'autotasktabsPrevNonIframeSurfaceClipPath');
        }
        state.nonIframeReservedSurface = null;
        if (!container) return;
        restoreInlineStyle(container, 'padding-top', 'autotasktabsPrevNonIframePaddingTop');
        restoreInlineStyle(container, 'padding-left', 'autotasktabsPrevNonIframePaddingLeft');
        restoreInlineStyle(container, 'padding-right', 'autotasktabsPrevNonIframePaddingRight');
        restoreInlineStyle(container, 'padding-bottom', 'autotasktabsPrevNonIframePaddingBottom');
        restoreInlineStyle(container, 'box-sizing', 'autotasktabsPrevNonIframeBoxSizing');
        restoreInlineStyle(container, 'overflow', 'autotasktabsPrevNonIframeOverflow');
        restoreInlineStyle(container, 'background', 'autotasktabsPrevNonIframeBackground');
        restoreInlineStyle(container, 'border', 'autotasktabsPrevNonIframeBorder');
        restoreInlineStyle(container, 'border-radius', 'autotasktabsPrevNonIframeBorderRadius');
        restoreInlineStyle(container, 'box-shadow', 'autotasktabsPrevNonIframeBoxShadow');
        restoreInlineStyle(container, 'clip-path', 'autotasktabsPrevNonIframeClipPath');
        restoreInlineStyle(container, 'position', 'autotasktabsPrevNonIframePosition');
        container.classList.remove('autotasktabs-non-iframe-rounded-frame');
        delete container.dataset.autotasktabsNonIframeReserved;
        delete container.dataset.autotasktabsNonIframeReservedAxis;
        state.nonIframeReservedContainer = null;
    }

    function applyNonIframeReservation(container) {
        if (!container) {
            clearNonIframeReservation();
            return;
        }
        if (state.shellHidden || !state.showTabBarOnNonIframePages || !activeUsesNonIframeContent()) {
            clearNonIframeReservation();
            return;
        }

        const targetAxis = isVerticalBar() ? 'vertical' : 'horizontal';
        const existingAxis = nonIframeReservationAxis(container);
        if (existingAxis && existingAxis !== targetAxis) {
            clearNonIframeReservation();
        }
        if (state.nonIframeReservedContainer && state.nonIframeReservedContainer !== container) {
            clearNonIframeReservation();
        }

        const surface = findNonIframeContentSurface(container);
        if (state.nonIframeReservedSurface && state.nonIframeReservedSurface !== surface) {
            clearNonIframeReservation();
        }
        const roundedFramesEnabled = state.roundedPageFramesEnabled;

        rememberInlineStyle(container, 'padding-top', 'autotasktabsPrevNonIframePaddingTop');
        rememberInlineStyle(container, 'padding-left', 'autotasktabsPrevNonIframePaddingLeft');
        rememberInlineStyle(container, 'padding-right', 'autotasktabsPrevNonIframePaddingRight');
        rememberInlineStyle(container, 'padding-bottom', 'autotasktabsPrevNonIframePaddingBottom');
        rememberInlineStyle(container, 'box-sizing', 'autotasktabsPrevNonIframeBoxSizing');
        rememberInlineStyle(container, 'overflow', 'autotasktabsPrevNonIframeOverflow');
        rememberInlineStyle(container, 'background', 'autotasktabsPrevNonIframeBackground');
        rememberInlineStyle(container, 'border', 'autotasktabsPrevNonIframeBorder');
        rememberInlineStyle(container, 'border-radius', 'autotasktabsPrevNonIframeBorderRadius');
        rememberInlineStyle(container, 'box-shadow', 'autotasktabsPrevNonIframeBoxShadow');
        rememberInlineStyle(container, 'clip-path', 'autotasktabsPrevNonIframeClipPath');
        rememberInlineStyle(container, 'position', 'autotasktabsPrevNonIframePosition');
        container.style.setProperty('box-sizing', 'border-box', 'important');
            container.style.setProperty('overflow', 'hidden', 'important');
        if (getComputedStyle(container).position === 'static') {
            container.style.setProperty('position', 'relative', 'important');
        }
        if (roundedFramesEnabled) {
            container.classList.add('autotasktabs-non-iframe-rounded-frame');
            container.style.setProperty('background', effectiveDarkMode() ? '#11161c' : '#f6f7f8', 'important');
            container.style.setProperty('padding-right', '8px', 'important');
            container.style.setProperty('padding-bottom', '8px', 'important');
            container.style.setProperty('border', '1px solid rgba(55, 106, 148, 0.24)', 'important');
            container.style.setProperty('border-radius', '10px', 'important');
            container.style.setProperty('box-shadow', effectiveDarkMode() ? '0 10px 28px rgba(0, 0, 0, 0.34)' : '0 14px 34px rgba(15, 23, 42, 0.22)', 'important');
            container.style.setProperty('clip-path', 'inset(0 round 10px)', 'important');
        } else {
            container.classList.remove('autotasktabs-non-iframe-rounded-frame');
            container.style.removeProperty('background');
            container.style.removeProperty('padding-right');
            container.style.removeProperty('padding-bottom');
            container.style.removeProperty('border');
            container.style.removeProperty('border-radius');
            container.style.removeProperty('box-shadow');
            container.style.removeProperty('clip-path');
        }

        if (surface) {
            rememberInlineStyle(surface, 'border-radius', 'autotasktabsPrevNonIframeSurfaceBorderRadius');
            rememberInlineStyle(surface, 'border', 'autotasktabsPrevNonIframeSurfaceBorder');
            rememberInlineStyle(surface, 'box-shadow', 'autotasktabsPrevNonIframeSurfaceBoxShadow');
            rememberInlineStyle(surface, 'box-sizing', 'autotasktabsPrevNonIframeSurfaceBoxSizing');
            rememberInlineStyle(surface, 'overflow', 'autotasktabsPrevNonIframeSurfaceOverflow');
            rememberInlineStyle(surface, 'clip-path', 'autotasktabsPrevNonIframeSurfaceClipPath');
            if (roundedFramesEnabled) {
                surface.style.setProperty('border-radius', '10px', 'important');
                surface.style.setProperty('border', '1px solid rgba(55, 106, 148, 0.24)', 'important');
                surface.style.setProperty('box-shadow', effectiveDarkMode() ? '0 10px 28px rgba(0, 0, 0, 0.34)' : '0 14px 34px rgba(15, 23, 42, 0.22)', 'important');
                surface.style.setProperty('box-sizing', 'border-box', 'important');
                surface.style.setProperty('overflow', 'hidden', 'important');
                surface.style.setProperty('clip-path', 'inset(0 round 10px)', 'important');
            } else {
                surface.style.removeProperty('border-radius');
                surface.style.removeProperty('border');
                surface.style.removeProperty('box-shadow');
                surface.style.removeProperty('box-sizing');
                surface.style.removeProperty('overflow');
                surface.style.removeProperty('clip-path');
            }
            state.nonIframeReservedSurface = surface;
        }

        if (targetAxis === 'vertical') {
            container.style.setProperty('padding-top', roundedFramesEnabled ? '8px' : '0', 'important');
            container.style.setProperty('padding-left', (currentVerticalBarWidth() + (roundedFramesEnabled ? 8 : 0)) + 'px', 'important');
        } else {
            container.style.setProperty('padding-left', roundedFramesEnabled ? '8px' : '0', 'important');
            container.style.setProperty('padding-top', (currentHorizontalBarHeight() + (roundedFramesEnabled ? 8 : 0)) + 'px', 'important');
        }

        container.dataset.autotasktabsNonIframeReserved = 'true';
        container.dataset.autotasktabsNonIframeReservedAxis = targetAxis;
        state.nonIframeReservedContainer = container;
        scheduleNonIframeRoundedSurfaceStyles();
    }

    function applyNativeChromeReservation(frame) {
        if (!frame) return;
        clearNonIframeReservation();
        if (state.shellHidden || state.activeId !== null) {
            clearNativeChromeReservation(frame);
            return;
        }

        const container = frame.parentElement;
        if (!container || container === document.body || container === document.documentElement) {
            clearNativeChromeReservation(frame);
            return;
        }

        // If orientation changed, the wrong axis may already be reserved.
        // Bail out and re-reserve from scratch on the next call.
        const targetAxis = isVerticalBar() ? 'vertical' : 'horizontal';
        const existingAxis = reservationAxis(container);
        if (existingAxis && existingAxis !== targetAxis) {
            clearNativeChromeReservation(frame);
        }
        if (state.nativeReservedContainer && state.nativeReservedContainer !== container) {
            clearNativeChromeReservation(frame);
        }
        const roundedFramesEnabled = state.roundedPageFramesEnabled;

        clearLegacyNativeFrameOffset(frame);

        rememberInlineStyle(container, 'padding-top', 'autotasktabsPrevPaddingTop');
        rememberInlineStyle(container, 'padding-left', 'autotasktabsPrevPaddingLeft');
        rememberInlineStyle(container, 'box-sizing', 'autotasktabsPrevBoxSizing');
        rememberInlineStyle(container, 'overflow', 'autotasktabsPrevOverflow');
        rememberInlineStyle(container, 'background', 'autotasktabsPrevBackground');
        rememberInlineStyle(container, 'width', 'autotasktabsPrevNativeSplitWidth');
        rememberInlineStyle(frame, 'margin-top', 'autotasktabsPrevMarginTop');
        rememberInlineStyle(frame, 'margin-left', 'autotasktabsPrevMarginLeft');
        rememberInlineStyle(frame, 'height', 'autotasktabsPrevHeight');
        rememberInlineStyle(frame, 'width', 'autotasktabsPrevWidth');
        rememberInlineStyle(frame, 'display', 'autotasktabsPrevDisplay');
        rememberInlineStyle(frame, 'border-radius', 'autotasktabsPrevBorderRadius');
        rememberInlineStyle(frame, 'border', 'autotasktabsPrevBorder');
        rememberInlineStyle(frame, 'box-shadow', 'autotasktabsPrevBoxShadow');
        rememberInlineStyle(frame, 'box-sizing', 'autotasktabsPrevFrameBoxSizing');
        rememberInlineStyle(frame, 'max-width', 'autotasktabsPrevNativeSplitMaxWidth');
        rememberInlineStyle(frame, 'clip-path', 'autotasktabsPrevNativeSplitClipPath');

        container.style.setProperty('box-sizing', 'border-box', 'important');
        container.style.setProperty('overflow', 'hidden', 'important');
        if (roundedFramesEnabled) {
            container.style.setProperty('background', effectiveDarkMode() ? '#11161c' : '#f6f7f8', 'important');
        } else {
            container.style.removeProperty('background');
        }
        frame.style.removeProperty('translate');
        frame.style.removeProperty('margin-top');
        frame.style.removeProperty('margin-left');
        frame.style.setProperty('display', 'block', 'important');

        if (targetAxis === 'vertical') {
            container.style.setProperty('padding-top', '0', 'important');
            container.style.setProperty('padding-left', currentVerticalBarWidth() + 'px', 'important');
        } else {
            container.style.setProperty('padding-left', '0', 'important');
            container.style.setProperty('padding-top', currentHorizontalBarHeight() + 'px', 'important');
        }

        container.style.removeProperty('width');

        if (roundedFramesEnabled) {
            frame.style.setProperty('margin-top', '8px', 'important');
            frame.style.setProperty('margin-left', '8px', 'important');
            frame.style.setProperty('width', 'calc(100% - 16px)', 'important');
            frame.style.setProperty('height', 'calc(100% - 16px)', 'important');
            frame.style.setProperty('border-radius', '10px', 'important');
            frame.style.setProperty('border', '1px solid rgba(55, 106, 148, 0.24)', 'important');
            frame.style.setProperty('box-shadow', effectiveDarkMode() ? '0 10px 28px rgba(0, 0, 0, 0.34)' : '0 14px 34px rgba(15, 23, 42, 0.22)', 'important');
            frame.style.setProperty('box-sizing', 'border-box', 'important');
            frame.dataset.autotasktabsNativeRoundedFrame = 'true';
        } else {
            frame.style.removeProperty('margin-top');
            frame.style.removeProperty('margin-left');
            frame.style.setProperty('width', '100%', 'important');
            frame.style.setProperty('height', '100%', 'important');
            frame.style.removeProperty('border-radius');
            frame.style.removeProperty('border');
            frame.style.removeProperty('box-shadow');
            frame.style.removeProperty('box-sizing');
            delete frame.dataset.autotasktabsNativeRoundedFrame;
        }

        frame.style.removeProperty('max-width');
        frame.style.removeProperty('clip-path');

        container.dataset.autotasktabsNativeChromeReserved = 'true';
        container.dataset.autotasktabsNativeChromeReservedAxis = targetAxis;
        frame.dataset.autotasktabsNativeChromeReserved = 'true';
        frame.dataset.autotasktabsNativeChromeReservedAxis = targetAxis;
        state.nativeReservedContainer = container;
    }

    function syncGeometry() {
        state.geometryRaf = 0;
        if (!state.bar) return;
        if (state.peekReuseIframe && state.peekSyncOverlay) {
            state.peekSyncOverlay();
            return;
        }
        const frame = findContentIframe();
        state.lastGeometryHadNativeFrame = !!frame;
        updateResizableBarClasses();
        if (!featuresEnabled()) {
            if (frame) clearNativeChromeReservation(frame);
            clearNonIframeReservation();
            state.bar.style.display = 'none';
            state.viewport.style.display = 'none';
            if (state.homeCover) state.homeCover.style.display = 'none';
            return;
        }
        if (!frame) {
            trackNativeFrame(null);
            if (state.shellHidden || !state.showTabBarOnNonIframePages) {
                stopNonIframeTitleWatcher();
                clearNonIframeReservation();
                state.bar.style.display = 'none';
                state.viewport.style.display = 'none';
                if (state.homeCover) state.homeCover.style.display = 'none';
                return;
            }

            const container = findNonIframeContentContainer();
            applyNonIframeReservation(container);
            const base = readNoIframeBase(container);
            const activeNativeShell = isNativeShellTab(tabById(state.activeId));
            state.bar.style.display = '';
            state.viewport.style.display = activeUsesNonIframeContent() ? 'none' : '';
            if (state.homeCover) state.homeCover.style.display = 'none';
            if (state.activeId === null) {
                ensureNonIframeTitleWatcher();
                updateHomeTitleFromTopLevelPage(true);
            } else if (activeNativeShell) {
                stopNonIframeTitleWatcher();
                syncActiveNativeShellTabMetadata();
            } else {
                stopNonIframeTitleWatcher();
            }

            if (isVerticalBar()) {
                const barWidth = currentVerticalBarWidth();
                setCssPx(state.bar, 'left', base.left);
                setCssPx(state.bar, 'top', base.top);
                setCssPx(state.bar, 'width', barWidth);
                setCssPx(state.bar, 'height', base.height);
                setCssPx(state.viewport, 'left', base.left + barWidth);
                setCssPx(state.viewport, 'top', base.top);
                setCssPx(state.viewport, 'width', Math.max(0, base.width - barWidth));
                setCssPx(state.viewport, 'height', base.height);
                state.viewport.style.bottom = 'auto';
            } else {
                setCssPx(state.bar, 'left', base.left);
                setCssPx(state.bar, 'top', base.top);
                setCssPx(state.bar, 'width', base.width);
                const barHeight = currentHorizontalBarHeight();
                setCssPx(state.bar, 'height', barHeight);
                setCssPx(state.viewport, 'left', base.left);
                setCssPx(state.viewport, 'top', base.top + barHeight);
                setCssPx(state.viewport, 'width', base.width);
                setCssPx(state.viewport, 'height', Math.max(0, base.height - barHeight));
                state.viewport.style.bottom = 'auto';
            }
            updateTabScrollButtons();
            return;
        }
        stopNonIframeTitleWatcher();
        clearNonIframeReservation();
        trackNativeFrame(frame);
        const base = readNativeFrameBase(frame);

        if (state.shellHidden) {
            ensureNativeFrameSpacer(frame);
            applyNativeChromeReservation(frame);
            state.bar.style.display = 'none';
            state.viewport.style.display = 'none';
            if (state.homeCover) state.homeCover.style.display = 'none';
            return;
        }

        ensureNativeFrameSpacer(frame);
        applyNativeChromeReservation(frame);

        state.bar.style.display = '';
        state.viewport.style.display = '';
        const barTop = base.top;
        if (isVerticalBar()) {
            const barWidth = currentVerticalBarWidth();
            if (state.homeCover) {
                state.homeCover.style.display = state.activeId === null ? '' : 'none';
                setCssPx(state.homeCover, 'left', base.left);
                setCssPx(state.homeCover, 'top', barTop);
                setCssPx(state.homeCover, 'width', barWidth);
                setCssPx(state.homeCover, 'height', Math.max(0, base.height - 1));
            }
            setCssPx(state.bar, 'left', base.left);
            setCssPx(state.bar, 'top', barTop);
            setCssPx(state.bar, 'width', barWidth);
            setCssPx(state.bar, 'height', Math.max(0, base.height - 1));
            setCssPx(state.viewport, 'left', base.left + barWidth);
            setCssPx(state.viewport, 'top', base.top);
            setCssPx(state.viewport, 'width', Math.max(0, base.width - barWidth));
            setCssPx(state.viewport, 'height', base.height);
            state.viewport.style.bottom = 'auto';
        } else {
            if (state.homeCover) {
                state.homeCover.style.display = state.activeId === null ? '' : 'none';
                setCssPx(state.homeCover, 'left', base.left);
                setCssPx(state.homeCover, 'top', barTop);
                setCssPx(state.homeCover, 'width', base.width);
                const barHeight = currentHorizontalBarHeight();
                setCssPx(state.homeCover, 'height', barHeight);
            }
            setCssPx(state.bar, 'left', base.left);
            setCssPx(state.bar, 'top', barTop);
            setCssPx(state.bar, 'width', base.width);
            const barHeight = currentHorizontalBarHeight();
            setCssPx(state.bar, 'height', barHeight);
            setCssPx(state.viewport, 'left', base.left);
            setCssPx(state.viewport, 'top', base.top + barHeight);
            setCssPx(state.viewport, 'width', base.width);
            setCssPx(state.viewport, 'height', Math.max(0, base.height - barHeight));
            state.viewport.style.bottom = 'auto';
        }
        updateTabScrollButtons();
    }

    function requestSyncGeometry() {
        if (state.geometryRaf) return;
        state.geometryRaf = window.requestAnimationFrame(syncGeometry);
    }

    function requestResizeSyncGeometry() {
        const width = window.innerWidth || document.documentElement.clientWidth || 0;
        const height = window.innerHeight || document.documentElement.clientHeight || 0;
        if (
            Math.abs(width - state.lastGeometryViewportWidth) < 2 &&
            Math.abs(height - state.lastGeometryViewportHeight) < 2
        ) {
            return;
        }
        state.lastGeometryViewportWidth = width;
        state.lastGeometryViewportHeight = height;
        if (state.geometryResizeFinalizeTimerId) {
            window.clearTimeout(state.geometryResizeFinalizeTimerId);
        }
        state.geometryResizeFinalizeTimerId = window.setTimeout(function () {
            state.geometryResizeFinalizeTimerId = 0;
            requestSyncGeometry();
        }, 90);
    }

    function startGeometryBurst(durationMs) {
        const until = Date.now() + durationMs;
        if (until > state.geometryBurstUntil) state.geometryBurstUntil = until;
        if (state.geometryBurstTimerId) return;

        state.geometryBurstTimerId = window.setInterval(function () {
            requestSyncGeometry();
            if (Date.now() >= state.geometryBurstUntil) {
                window.clearInterval(state.geometryBurstTimerId);
                state.geometryBurstTimerId = 0;
                state.geometryBurstUntil = 0;
            }
        }, 80);
    }

    function installGeometrySync() {
        window.addEventListener('resize', requestResizeSyncGeometry, { passive: true });
        window.addEventListener('transitionrun', function () { startGeometryBurst(450); }, true);
        window.addEventListener('transitionstart', function () { startGeometryBurst(450); }, true);
        window.addEventListener('transitionend', requestSyncGeometry, true);

        if ('ResizeObserver' in window && !state.rootResizeObserver) {
            state.rootResizeObserver = new ResizeObserver(requestResizeSyncGeometry);
            state.rootResizeObserver.observe(document.documentElement);
            if (document.body) state.rootResizeObserver.observe(document.body);
        }

        if (!state.rootMutationObserver) {
            state.rootMutationObserver = new MutationObserver(function (mutations) {
                const noIframeTestMode = state.showTabBarOnNonIframePages && !state.lastGeometryHadNativeFrame;
                function nodeContainsFrame(node) {
                    return !!(node && (
                        node.nodeName === 'IFRAME' ||
                        node.nodeName === 'FRAME' ||
                        (node.querySelector && node.querySelector('iframe, frame'))
                    ));
                }

                for (const mutation of mutations) {
                    if (isShellOwnedMutationTarget(mutation.target)) continue;
                    if (mutation.type === 'childList') {
                        if (state.roundedPageFramesEnabled && state.nonIframeReservedContainer && activeUsesNonIframeContent()) {
                            scheduleNonIframeRoundedSurfaceStyles();
                        }
                        const nodes = [...mutation.addedNodes, ...mutation.removedNodes];
                        if (nodes.some(nodeContainsFrame)) {
                            if (state.activeId === null) startNativeHomeLoading();
                            startGeometryBurst(300);
                            return;
                        }
                        continue;
                    }
                    if (mutation.type === 'attributes') {
                        if (state.roundedPageFramesEnabled && state.nonIframeReservedContainer && activeUsesNonIframeContent()) {
                            scheduleNonIframeRoundedSurfaceStyles();
                        }
                        if (noIframeTestMode) continue;
                        const target = mutation.target;
                        const targetIsFrame = target && (target.nodeName === 'IFRAME' || target.nodeName === 'FRAME');
                        const targetIsRoot = target === document.body || target === document.documentElement;
                        const targetIsReservedSurface = state.nonIframeReservedContainer && target === state.nonIframeReservedContainer;
                        if (!targetIsFrame && !targetIsRoot && !targetIsReservedSurface) continue;
                        startGeometryBurst(300);
                        return;
                    }
                }
            });
            state.rootMutationObserver.observe(document.body || document.documentElement, {
                attributes: true,
                childList: true,
                subtree: true,
                attributeFilter: ['class', 'style'],
            });
        }

        if (!state.geometryPollId) {
            state.geometryPollId = window.setInterval(requestSyncGeometry, 5000);
        }
    }

    function updateShellVisibility() {
        document.documentElement.classList.toggle('at-tabs-shell-hidden', state.shellHidden || !state.extensionEnabled);
        requestSyncGeometry();
    }

    function featuresEnabled() {
        return state.extensionEnabled !== false;
    }

    function broadcastFeatureEnabledState() {
        const payload = { __ns: AUTOTASKTABS.MSG_NS, type: 'feature-enabled', enabled: featuresEnabled() };
        try { window.postMessage(payload, location.origin); } catch (e) {}
        try {
            for (let i = 0; i < window.frames.length; i++) {
                try { window.frames[i].postMessage(payload, '*'); } catch (e) {}
            }
        } catch (e) {}
    }

    function applyExtensionEnabledState(restoreOnEnable) {
        if (restoreOnEnable === undefined) restoreOnEnable = true;
        AUTOTASKTABS.state.extensionEnabled = featuresEnabled();
        if (!featuresEnabled()) {
            hideHoverCard(true);
            closeTabContextMenu();
            if (state.nativeFrame) clearNativeChromeReservation(state.nativeFrame);
            clearNonIframeReservation();
            stopNonIframeTitleWatcher();
            if (AUTOTASKTABS.setPhoneLinksEnabled) AUTOTASKTABS.setPhoneLinksEnabled(false);
            if (AUTOTASKTABS.setTicketLinksEnabled) AUTOTASKTABS.setTicketLinksEnabled(false);
            syncImprovedScrollbarsState();
        } else {
            if (AUTOTASKTABS.initPhoneLinks) AUTOTASKTABS.initPhoneLinks();
            if (AUTOTASKTABS.initTicketLinks) AUTOTASKTABS.initTicketLinks();
            injectTopLevelPageBridgeFromShell();
            if (AUTOTASKTABS.installTopLevelNavigationInterception) AUTOTASKTABS.installTopLevelNavigationInterception();
            installTopLevelRouteWatchers();
            if (restoreOnEnable && !state.tabs.length) {
                void restoreTabs().then(function () {
                    if (!state.tabs.length) activateHome();
                    requestSyncGeometry();
                });
            }
            syncImprovedScrollbarsState();
        }
        broadcastFeatureEnabledState();
        updateShellVisibility();
    }

    function tabById(id) {
        return state.tabs.find(t => t.id === id) || null;
    }

    function normalizeSplitPairIds(pair) {
        if (!Array.isArray(pair)) return null;
        const ids = [];
        for (const id of pair) {
            if (ids.includes(id)) continue;
            if (!tabById(id)) continue;
            ids.push(id);
            if (ids.length >= 4) break;
        }
        return ids.length >= 2 ? ids : null;
    }

    function ensureSplitFrameControls(tab) {
        if (!tab || !state.viewport) return null;
        if (tab.splitControlsEl && tab.splitControlsEl.isConnected) return tab.splitControlsEl;

        const controls = document.createElement('div');
        controls.className = 'at-tabs-split-frame-controls hidden';
        controls.setAttribute('aria-hidden', 'true');

        const detachButton = document.createElement('button');
        detachButton.type = 'button';
        detachButton.className = 'at-tabs-split-frame-button detach';
        detachButton.title = 'Detach this tab from split view';
        detachButton.setAttribute('aria-label', 'Detach this tab from split view');
        const detachIcon = document.createElement('span');
        detachIcon.className = 'at-tabs-split-frame-detach-icon';
        detachIcon.setAttribute('aria-hidden', 'true');
        detachButton.appendChild(detachIcon);
        detachButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            detachTabFromSplit(tab.id);
        });

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'at-tabs-split-frame-button close';
        closeButton.title = 'Close this tab';
        closeButton.setAttribute('aria-label', 'Close this tab');
        const closeIcon = document.createElement('span');
        closeIcon.className = 'at-tabs-split-frame-close-icon';
        closeIcon.setAttribute('aria-hidden', 'true');
        closeButton.appendChild(closeIcon);
        closeButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            closeTab(tab.id);
        });

        controls.appendChild(closeButton);
        controls.appendChild(detachButton);
        state.viewport.appendChild(controls);
        tab.splitControlsEl = controls;
        return controls;
    }

    function syncSplitFrameControls(tab, visible, paneIndex, paneCount) {
        const controls = tab && (tab.splitControlsEl || (visible ? ensureSplitFrameControls(tab) : null));
        if (!controls) return;

        controls.classList.toggle('hidden', !visible);
        controls.setAttribute('aria-hidden', visible ? 'false' : 'true');
        for (let i = 0; i < 4; i++) {
            controls.classList.toggle('split-controls-index-' + i, visible && paneIndex === i);
        }
        for (let count = 2; count <= 4; count++) {
            controls.classList.toggle('split-controls-count-' + count, visible && paneCount === count);
        }
    }

    function detachTabFromSplit(tabId) {
        const group = getSplitGroupIds();
        if (!group.includes(tabId)) return false;

        const remaining = group.filter(function (id) { return id !== tabId; });
        state.splitResizing = false;

        if (remaining.length >= 2 && remaining.includes(state.activeId)) {
            state.splitPairIds = remaining.slice(0, 4);
            state.splitRatios = normalizeSplitRatios([], state.splitPairIds.length);
            state.splitId = state.splitPairIds.find(function (id) { return id !== state.activeId; }) || null;
            syncTabPaneState();
            updateLoaderVisibility();
            ensureActiveTabVisible();
            updateTabScrollButtons();
            saveTabs();
            return true;
        }

        state.splitPairIds = null;
        state.splitId = null;
        state.splitPairColor = '';
        state.splitRatios = [];
        if (state.activeId === tabId) {
            activateTab(tabId, { recordPrevious: false });
        } else {
            syncTabPaneState();
            updateLoaderVisibility();
            ensureActiveTabVisible();
            updateTabScrollButtons();
            saveTabs();
        }
        return true;
    }

    function syncTabPaneState() {
        if (!state.viewport) return;

        const active = tabById(state.activeId);
        let pair = normalizeSplitPairIds(state.splitPairIds);
        const activeMemberId = active ? active.id : null;
        let visibleSplitIds = pair && pair.includes(activeMemberId) ? pair.slice(0, 4) : [];
        if (visibleSplitIds.length) {
            state.splitPairIds = pair;
            state.splitId = visibleSplitIds.find(id => id !== activeMemberId) || null;
        } else {
            state.splitId = null;
            if (state.splitPairIds && !pair) {
                state.splitPairIds = null;
                pair = null;
            }
        }

        let splitSharedColor = '';
        if (pair) {
            const activePairTab = active && pair.includes(active.id) ? active : null;
            const firstPairTab = tabById(pair[0]);
            const secondPairTab = tabById(pair.find(id => !firstPairTab || id !== firstPairTab.id));
            splitSharedColor = TAB_COLOR_PRESETS.includes(state.splitPairColor)
                ? state.splitPairColor
                : activePairTab && TAB_COLOR_PRESETS.includes(activePairTab.color)
                ? activePairTab.color
                : (firstPairTab && TAB_COLOR_PRESETS.includes(firstPairTab.color)
                    ? firstPairTab.color
                    : (secondPairTab && TAB_COLOR_PRESETS.includes(secondPairTab.color) ? secondPairTab.color : ''));
            state.splitPairColor = splitSharedColor;
        } else {
            state.splitPairColor = '';
        }

        const splitActive = visibleSplitIds.length >= 2;
        state.viewport.classList.toggle('empty', !active);
        state.viewport.classList.toggle('split', splitActive);
        state.viewport.classList.toggle('split-count-2', splitActive && visibleSplitIds.length === 2);
        state.viewport.classList.toggle('split-count-3', splitActive && visibleSplitIds.length === 3);
        state.viewport.classList.toggle('split-count-4', splitActive && visibleSplitIds.length === 4);
        state.viewport.classList.toggle('split-resizing', splitActive && state.splitResizing);
        applySplitRatio();

        const visibleSet = new Set(visibleSplitIds);
        if (state.homeTabEl) state.homeTabEl.classList.toggle('split-target', false);

        for (const tab of state.tabs) {
            const isPrimary = !!(active && tab.id === active.id);
            const splitPaneIndex = splitActive ? visibleSplitIds.indexOf(tab.id) : -1;
            const isSplitMember = !!(pair && pair.includes(tab.id));
            const isVisibleSplitPane = splitPaneIndex >= 0;
            const isSplit = !!(splitActive && isVisibleSplitPane && !isPrimary);
            const isLeftPane = !!(splitActive && visibleSplitIds.length === 2 && splitPaneIndex === 0);
            const isRightPane = !!(splitActive && visibleSplitIds.length === 2 && splitPaneIndex === 1);

            tab.splitSharedColor = isSplitMember ? splitSharedColor : '';
            if (tab.tabEl) {
                tab.tabEl.classList.toggle('active', isPrimary);
                tab.tabEl.classList.toggle('split-member', isSplitMember);
                tab.tabEl.classList.toggle('split-target', isSplit);
                applyTabColorStyle(tab);
            }

            if (tab.iframeEl) {
                tab.iframeEl.classList.toggle('primary-pane', splitActive && isPrimary);
                tab.iframeEl.classList.toggle('split-pane', isSplit);
                tab.iframeEl.classList.toggle('left-pane', isLeftPane);
                tab.iframeEl.classList.toggle('right-pane', isRightPane);
                for (let i = 0; i < 4; i++) {
                    tab.iframeEl.classList.toggle('split-pane-index-' + i, splitPaneIndex === i);
                }
                tab.iframeEl.classList.toggle('hidden', splitActive ? !visibleSet.has(tab.id) : !isPrimary);
            }
            if (tab.loaderEl) {
                tab.loaderEl.classList.toggle('left-pane', isLeftPane);
                tab.loaderEl.classList.toggle('right-pane', isRightPane);
                for (let i = 0; i < 4; i++) {
                    tab.loaderEl.classList.toggle('split-pane-index-' + i, splitPaneIndex === i);
                }
            tab.loaderEl.classList.toggle('hidden', splitActive ? !visibleSet.has(tab.id) : !(state.roundedPageFramesEnabled && isPrimary));
            }
            syncSplitFrameControls(tab, !!(tab.iframeEl && splitActive && isVisibleSplitPane), splitPaneIndex, visibleSplitIds.length);
        }
    }

    function getSplitPaneIds() {
        const pair = normalizeSplitPairIds(state.splitPairIds);
        const activeMemberId = state.activeId;
        if (!pair || !pair.includes(activeMemberId) || pair.length !== 2) return null;
        const left = tabById(pair[0]);
        const right = tabById(pair[1]);
        if (!left || !right) return null;
        return { left: pair[0], right: pair[1] };
    }

    function getSplitGroupIds() {
        return normalizeSplitPairIds(state.splitPairIds) || [];
    }

    function splitGroupIncludesActive(group) {
        return state.activeId !== null && Array.isArray(group) && group.includes(state.activeId);
    }

    function canAddTabToSplit(tabId) {
        if (isNativeShellTab(tabById(tabId)) || isNativeShellTab(tabById(state.activeId))) return false;
        if (state.activeId === null || state.activeId === tabId || !tabById(tabId)) return false;
        const group = getSplitGroupIds();
        if (!group.length) return true;
        if (!splitGroupIncludesActive(group)) return true;
        return !group.includes(tabId) && group.length < 4;
    }

    function getDragSplitBaseIds(draggedId) {
        const active = tabById(state.activeId);
        if (!active) return [];
        const group = getSplitGroupIds();
        if (splitGroupIncludesActive(group)) {
            return group.filter(function (id) { return id !== draggedId; }).slice(0, 3);
        }
        return [active.id];
    }

    function dragSplitInsertionIndexFromEvent(event, baseIds) {
        if (!state.viewport || !Array.isArray(baseIds) || !baseIds.length) return 0;
        const rect = state.viewport.getBoundingClientRect();
        if (!rect.width) return baseIds.length;
        const slotCount = Math.min(baseIds.length + 1, 4);
        if (slotCount <= 2) {
            return event.clientX < rect.left + (rect.width / 2) ? 0 : 1;
        }
        const ratio = Math.max(0, Math.min(0.999, (event.clientX - rect.left) / rect.width));
        return Math.max(0, Math.min(slotCount - 1, Math.floor(ratio * slotCount)));
    }

    function dragSplitSideFromInsertionIndex(insertionIndex, previewCount) {
        if (insertionIndex <= 0) return 'left';
        if (insertionIndex >= previewCount - 1) return 'right';
        return 'middle';
    }

    function dragSplitLabelForSlot(insertionIndex, previewCount) {
        const side = dragSplitSideFromInsertionIndex(insertionIndex, previewCount);
        if (side === 'left') return 'Split left';
        if (side === 'right') return 'Split right';
        return 'Split between';
    }

    function removeDragSplitIndexClasses(el) {
        if (!el) return;
        for (let i = 0; i < 4; i++) {
            el.classList.remove('drag-split-preview-index-' + i);
        }
    }

    function dragSplitPreviewPercent(value) {
        const rounded = Math.round(value * 10000) / 10000;
        if (Number.isInteger(rounded)) return String(rounded);
        return String(rounded).replace(/0+$/, '').replace(/\.$/, '');
    }

    function dragSplitSlotMetrics(index, count) {
        const slotCount = Math.max(2, Math.min(4, count || 2));
        const slotWidth = 100 / slotCount;
        const left = index <= 0
            ? '8px'
            : 'calc(' + dragSplitPreviewPercent(slotWidth * index) + '% + 6px)';
        const isEdge = index <= 0 || index >= slotCount - 1;
        const width = 'calc(' + dragSplitPreviewPercent(slotWidth) + '% - ' + (isEdge ? '14px' : '12px') + ')';
        return { left: left, width: width };
    }

    function setDragSplitSlotMetrics(el, index, count) {
        if (!el) return;
        const metrics = dragSplitSlotMetrics(index, count);
        el.style.setProperty('--autotasktabs-drag-preview-left', metrics.left);
        el.style.setProperty('--autotasktabs-drag-preview-width', metrics.width);
    }

    function clearDragSplitSlotMetrics(el) {
        if (!el) return;
        el.style.removeProperty('--autotasktabs-drag-preview-left');
        el.style.removeProperty('--autotasktabs-drag-preview-width');
    }

    function clearDragSplitLayoutPreview() {
        if (state.viewport) {
            state.viewport.classList.remove(
                'drag-split-preview',
                'drag-split-preview-count-2',
                'drag-split-preview-count-3',
                'drag-split-preview-count-4',
                'drag-split-slot-left',
                'drag-split-slot-middle',
                'drag-split-slot-right'
            );
        }
        if (state.dragSplitPane) {
            removeDragSplitIndexClasses(state.dragSplitPane);
            clearDragSplitSlotMetrics(state.dragSplitPane);
            state.dragSplitPane.removeAttribute('data-label');
        }
        for (const tab of state.tabs) {
            if (tab.iframeEl) {
                tab.iframeEl.classList.remove('drag-split-preview-member');
                removeDragSplitIndexClasses(tab.iframeEl);
                clearDragSplitSlotMetrics(tab.iframeEl);
            }
            if (tab.loaderEl) {
                tab.loaderEl.classList.remove('drag-split-preview-member');
                removeDragSplitIndexClasses(tab.loaderEl);
                clearDragSplitSlotMetrics(tab.loaderEl);
            }
        }
        state.dragSplitInsertionIndex = 0;
    }

    function applyDragSplitLayoutPreview(baseIds, insertionIndex) {
        clearDragSplitLayoutPreview();
        if (!state.viewport || !state.dragSplitPane || !Array.isArray(baseIds) || !baseIds.length) return 0;

        const previewCount = Math.min(baseIds.length + 1, 4);
        const slotIndex = Math.max(0, Math.min(previewCount - 1, insertionIndex));
        const side = dragSplitSideFromInsertionIndex(slotIndex, previewCount);
        state.dragSplitInsertionIndex = slotIndex;
        state.dragSplitSide = side;

        state.viewport.classList.add(
            'drag-split-preview',
            'drag-split-preview-count-' + previewCount,
            'drag-split-slot-' + side
        );

        state.dragSplitPane.classList.add('drag-split-preview-index-' + slotIndex);
        setDragSplitSlotMetrics(state.dragSplitPane, slotIndex, previewCount);
        state.dragSplitPane.setAttribute('data-label', dragSplitLabelForSlot(slotIndex, previewCount));

        baseIds.forEach(function (id, index) {
            const tab = tabById(id);
            const previewIndex = index >= slotIndex ? index + 1 : index;
            if (!tab || previewIndex >= previewCount) return;
            if (tab.iframeEl) {
                tab.iframeEl.classList.add('drag-split-preview-member', 'drag-split-preview-index-' + previewIndex);
                setDragSplitSlotMetrics(tab.iframeEl, previewIndex, previewCount);
            }
            if (tab.loaderEl) {
                tab.loaderEl.classList.add('drag-split-preview-member', 'drag-split-preview-index-' + previewIndex);
                setDragSplitSlotMetrics(tab.loaderEl, previewIndex, previewCount);
            }
        });

        return slotIndex;
    }

    function hideDragSplitPreview() {
        if (state.dragSplitHideTimer) {
            clearTimeout(state.dragSplitHideTimer);
            state.dragSplitHideTimer = 0;
        }
        clearDragSplitLayoutPreview();
        if (!state.dragSplitIndicator) return;
        state.dragSplitIndicator.classList.remove('is-visible', 'side-left', 'side-right');
        state.dragSplitSide = '';
    }

    function disarmDragSplitIndicator() {
        hideDragSplitPreview();
        if (state.dragSplitIndicator) {
            state.dragSplitIndicator.classList.remove('is-armed');
        }
        if (state.viewport) {
            state.viewport.classList.remove('drag-split-armed');
        }
    }

    function armDragSplitIndicator(tabId) {
        if (!state.dragSplitIndicator || !state.viewport || !canAddTabToSplit(tabId)) {
            disarmDragSplitIndicator();
            return;
        }
        state.dragSplitIndicator.classList.add('is-armed');
        state.viewport.classList.add('drag-split-armed');
    }

    function updateDragSplitIndicator(event) {
        const draggedId = state.draggingTabId;
        if (draggedId === null || !state.dragSplitIndicator || !canAddTabToSplit(draggedId)) {
            disarmDragSplitIndicator();
            return false;
        }
        const baseIds = getDragSplitBaseIds(draggedId);
        if (!baseIds.length) {
            disarmDragSplitIndicator();
            return false;
        }

        if (state.dragSplitHideTimer) {
            clearTimeout(state.dragSplitHideTimer);
            state.dragSplitHideTimer = 0;
        }

        const insertionIndex = dragSplitInsertionIndexFromEvent(event, baseIds);
        const slotIndex = applyDragSplitLayoutPreview(baseIds, insertionIndex);
        const previewCount = Math.min(baseIds.length + 1, 4);
        const side = dragSplitSideFromInsertionIndex(slotIndex, previewCount);
        state.dragSplitIndicator.classList.add('is-visible');
        state.dragSplitIndicator.classList.toggle('side-left', side === 'left');
        state.dragSplitIndicator.classList.toggle('side-right', side === 'right');
        state.dragOverTabId = null;
        state.dragInsertAfter = false;
        for (const tab of state.tabs) {
            if (!tab.tabEl) continue;
            tab.tabEl.classList.remove('drop-before', 'drop-after');
        }
        return true;
    }

    function handleDragSplitOver(event) {
        if (!updateDragSplitIndicator(event)) return;
        event.preventDefault();
        event.stopPropagation();
        if (event.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
        }
    }

    function handleDragSplitLeave(event) {
        if (!state.dragSplitIndicator || event.currentTarget.contains(event.relatedTarget)) return;
        if (state.dragSplitHideTimer) clearTimeout(state.dragSplitHideTimer);
        state.dragSplitHideTimer = setTimeout(function () {
            hideDragSplitPreview();
        }, 90);
    }

    function enableSplitScreenFromDrag(tabId, insertionIndex) {
        if (!canAddTabToSplit(tabId)) return false;
        const active = tabById(state.activeId);
        const split = tabById(tabId);
        if (!active || !split) return false;

        const baseGroup = getDragSplitBaseIds(tabId);
        const nextGroup = baseGroup.slice(0, 3);
        const slotIndex = Math.max(0, Math.min(nextGroup.length, Number.isFinite(insertionIndex) ? insertionIndex : nextGroup.length));
        nextGroup.splice(slotIndex, 0, tabId);
        state.splitPairIds = nextGroup.slice(0, 4);

        state.splitRatios = normalizeSplitRatios([], state.splitPairIds.length);
        state.splitId = state.splitPairIds.find(function (id) { return id !== active.id; }) || tabId;
        state.splitPairColor = TAB_COLOR_PRESETS.includes(state.splitPairColor)
            ? state.splitPairColor
            : TAB_COLOR_PRESETS.includes(active && active.color)
            ? active.color
            : (TAB_COLOR_PRESETS.includes(split && split.color) ? split.color : '');
        state.splitRatio = normalizeSplitRatio(state.splitRatio);
        activateTab(active.id, { recordPrevious: false });
        return true;
    }

    function handleDragSplitDrop(event) {
        const draggedId = state.draggingTabId;
        if (draggedId === null || !state.dragSplitIndicator) return;
        event.preventDefault();
        event.stopPropagation();
        const baseIds = getDragSplitBaseIds(draggedId);
        const insertionIndex = Number.isFinite(state.dragSplitInsertionIndex)
            ? state.dragSplitInsertionIndex
            : dragSplitInsertionIndexFromEvent(event, baseIds);
        state.draggingTabId = null;
        clearTabDragIndicators();
        disarmDragSplitIndicator();
        enableSplitScreenFromDrag(draggedId, insertionIndex);
    }

    function enableSplitScreen(tabId) {
        if (!canAddTabToSplit(tabId)) return false;
        const active = tabById(state.activeId);
        const split = tabById(tabId);
        const group = getSplitGroupIds();
        state.splitPairIds = splitGroupIncludesActive(group)
            ? group.concat(tabId).slice(0, 4)
            : [active.id, tabId];
        state.splitRatios = normalizeSplitRatios(state.splitRatios, state.splitPairIds.length);
        state.splitId = tabId;
        state.splitPairColor = TAB_COLOR_PRESETS.includes(state.splitPairColor)
            ? state.splitPairColor
            : TAB_COLOR_PRESETS.includes(active && active.color)
            ? active.color
            : (TAB_COLOR_PRESETS.includes(split && split.color) ? split.color : '');
        state.splitRatio = normalizeSplitRatio(state.splitRatio);
        ensureTabIframeLoaded(active);
        ensureTabIframeLoaded(split);
        syncTabPaneState();
        updateLoaderVisibility();
        updateTabScrollButtons();
        saveTabs();
        return true;
    }

    function disableSplitScreen() {
        if (state.splitId === null && !state.splitPairIds) return;
        state.splitId = null;
        state.splitPairIds = null;
        state.splitPairColor = '';
        state.splitResizing = false;
        syncTabPaneState();
        updateLoaderVisibility();
        updateTabScrollButtons();
        saveTabs();
    }

    function swapSplitTabs() {
        const panes = getSplitPaneIds();
        if (!panes) return;
        const leftIndex = state.tabs.findIndex(tab => tab.id === panes.left);
        const rightIndex = state.tabs.findIndex(tab => tab.id === panes.right);
        if (leftIndex < 0 || rightIndex < 0) return;
        const tmp = state.tabs[leftIndex];
        state.tabs[leftIndex] = state.tabs[rightIndex];
        state.tabs[rightIndex] = tmp;
        state.splitPairIds = [panes.right, panes.left];
        renderTabs();
        syncTabPaneState();
        updateLoaderVisibility();
        ensureActiveTabVisible();
        updateTabScrollButtons();
        saveTabs();
    }

    function detachSplitPane(side) {
        const panes = getSplitPaneIds();
        if (!panes) return;
        const tabId = side === 'left' ? panes.left : panes.right;
        detachSplitTab(tabId);
    }

    function detachSplitTab(tabId) {
        const group = getSplitGroupIds();
        if (!group.includes(tabId)) return;
        const nextGroup = group.filter(id => id !== tabId);
        const activeMemberId = state.activeId;
        const remainingId = nextGroup.includes(activeMemberId) ? activeMemberId : nextGroup[0];
        if (!remainingId) return;
        state.activeId = remainingId;
        state.splitId = null;
        state.splitPairIds = nextGroup.length >= 2 ? nextGroup : null;
        state.splitRatios = state.splitPairIds ? normalizeSplitRatios(state.splitRatios, state.splitPairIds.length) : [];
        if (!state.splitPairIds) state.splitPairColor = '';
        state.splitResizing = false;
        syncTabPaneState();
        updateHomeTabActive();
        updateLoaderVisibility();
        ensureActiveTabVisible();
        updateTabScrollButtons();
        saveTabs();
    }

    function openSplitHandleContextMenu(x, y) {
        if (!getSplitPaneIds()) return;
        closeTabContextMenu();

        const menu = document.createElement('div');
        menu.className = 'at-tabs-context-menu';
        menu.setAttribute('role', 'menu');
        menu.appendChild(createContextMenuItem(
            'Swap tabs',
            ICONS.split,
            function () {
                closeTabContextMenu();
                swapSplitTabs();
            }
        ));
        menu.appendChild(createContextMenuDivider());
        menu.appendChild(createContextMenuItem(
            'Detach left tab',
            '',
            function () {
                closeTabContextMenu();
                detachSplitPane('left');
            }
        ));
        menu.appendChild(createContextMenuItem(
            'Detach right tab',
            '',
            function () {
                closeTabContextMenu();
                detachSplitPane('right');
            }
        ));

        document.body.appendChild(menu);
        state.tabContextMenu = menu;
        positionContextMenu(menu, x, y);
    }

    function legacyRemovedSplitFunctionsAnchor() {
        return null;
    }

    function updateSplitRatioFromPointer(event) {
        if (!state.viewport) return;
        const rect = state.viewport.getBoundingClientRect();
        if (!rect.width) return;
        const ratio = (event.clientX - rect.left) / rect.width;
        const count = getSplitGroupIds().length || 2;
        if (count <= 2) {
            state.splitRatio = normalizeSplitRatio(ratio);
        } else {
            const index = Math.max(0, Math.min(count - 2, Number(state.splitResizeHandleIndex) || 0));
            const ratios = normalizeSplitRatios(state.splitRatios, count);
            const min = index === 0 ? 0.12 : ratios[index - 1] + 0.12;
            const max = index === ratios.length - 1 ? 0.88 : ratios[index + 1] - 0.12;
            ratios[index] = Math.min(max, Math.max(min, ratio));
            state.splitRatios = ratios;
        }
        applySplitRatio();
    }

    function stopSplitResize(event) {
        if (!state.splitResizing) return;
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        state.splitResizing = false;
        state.splitResizeHandleIndex = 0;
        if (state.viewport) state.viewport.classList.remove('split-resizing');
        document.removeEventListener('pointermove', updateSplitRatioFromPointer, true);
        document.removeEventListener('pointerup', stopSplitResize, true);
        document.removeEventListener('pointercancel', stopSplitResize, true);
        saveTabs();
    }

    function startSplitResize(event) {
        if (event.button !== 0) return;
        const count = getSplitGroupIds().length || 0;
        if (!state.viewport || count < 2 || count > 4) return;
        event.preventDefault();
        event.stopPropagation();
        state.splitResizeHandleIndex = Number(event.currentTarget && event.currentTarget.dataset && event.currentTarget.dataset.splitHandle) || 0;
        state.splitResizing = true;
        state.viewport.classList.add('split-resizing');
        try {
            if (event.currentTarget && event.currentTarget.setPointerCapture) {
                event.currentTarget.setPointerCapture(event.pointerId);
            }
        } catch (e) { /* Pointer capture is best-effort. */ }
        updateSplitRatioFromPointer(event);
        document.addEventListener('pointermove', updateSplitRatioFromPointer, true);
        document.addEventListener('pointerup', stopSplitResize, true);
        document.addEventListener('pointercancel', stopSplitResize, true);
    }

    function activateHome() {
        if (state.activeId !== null && tabById(state.activeId)) {
            state.activationHistory = state.activationHistory.filter(id => id !== state.activeId);
            state.activationHistory.push(state.activeId);
        } else {
            state.activationHistory.push(null);
        }
        state.activeId = null;
        state.splitId = null;
        if (state.homeLoadingAwaitingNativeLoad && !findContentIframe() && state.showTabBarOnNonIframePages) {
            clearHomeLoading();
            scheduleNonIframeTitleUpdate();
        }
        if (!state.homeLoadingAwaitingNativeLoad) setHomeLoading(false);
        syncTabPaneState();
        updateHomeTabActive();
        updateLoaderVisibility();
        requestSyncGeometry();
        ensureActiveTabVisible();
        updateTabScrollButtons();
        saveTabs();
    }

    function openUrlOnHome(url) {
        let href = '';
        try { href = new URL(url, window.location.origin).href; }
        catch (e) { return; }
        if (isNativeShellTabUrl(href)) {
            openNativeShellTab(href);
            return;
        }
        if (isUmbrellaContractHomeUrl(href)) {
            if (useExperimentalUmbrellaContractFrameTabs()) {
                openTabDirect(href);
                return;
            }
            markUmbrellaContractFrameReload();
        }
        activateHome();
        state.homePersistedUrl = href;
        state.homePersistedTitle = '';
        setHomeLoading(true);
        const frame = state.nativeFrame || findContentIframe();
        if (frame) {
            try {
                if (frame.getAttribute('src') !== href) frame.setAttribute('src', href);
            } catch (e) {}
        } else {
            try { window.location.assign(href); }
            catch (e) {}
        }
        saveTabs();
    }

    function activateTab(id, options) {
        const opts = options || {};
        const previousId = state.activeId;
        state.activeId = id;
        const pair = normalizeSplitPairIds(state.splitPairIds);
        state.splitId = pair && pair.includes(id)
            ? pair.find(candidateId => candidateId !== id) || null
            : null;
        if (previousId === null) {
            state.activationHistory = state.activationHistory.filter(historyId => historyId !== null);
            state.activationHistory.push(null);
        }
        if (opts.recordPrevious !== false && previousId !== null && previousId !== id && tabById(previousId)) {
            state.activationHistory = state.activationHistory.filter(candidateId => candidateId !== previousId);
            state.activationHistory.push(previousId);
        }
        if (opts.load !== false) {
            const activeSplitPair = pair && pair.includes(id) ? pair : null;
            const activeTab = tabById(id);
            if (isNativeShellTab(activeTab)) {
                ensureNativeShellTabVisible(activeTab);
            } else if (activeSplitPair) {
                activeSplitPair.forEach(function (splitId) {
                    const splitTab = tabById(splitId);
                    ensureTabIframeLoaded(splitTab);
                    ensureTabFreshAfterUmbrellaContract(splitTab);
                });
            } else {
                ensureTabIframeLoaded(activeTab);
                ensureTabFreshAfterUmbrellaContract(activeTab);
            }
        }
        syncTabPaneState();
        state.viewport.style.display = isNativeShellTab(tabById(id)) ? 'none' : '';
        updateHomeTabActive();
        updateLoaderVisibility();
        requestSyncGeometry();
        ensureActiveTabVisible();
        updateTabScrollButtons();
        saveTabs();
    }

    function closeTab(id) {
        const idx = state.tabs.findIndex(t => t.id === id);
        if (idx === -1) return;
        const splitGroupBeforeClose = state.splitPairIds && state.splitPairIds.includes(id)
            ? state.splitPairIds.filter(candidateId => candidateId !== id && tabById(candidateId))
            : [];
        const splitGroupIndexBeforeClose = state.splitPairIds && state.splitPairIds.includes(id)
            ? state.splitPairIds.indexOf(id)
            : -1;
        const removed = state.tabs.splice(idx, 1)[0];
        rememberClosedTab(removed);
        if (isNativeShellTab(removed)) state.nativeShellSuppressUrl = canonicalTabUrl(removed.url);
        try { if (removed.iframeEl) removed.iframeEl.remove(); } catch (e) {}
        try { if (removed.loaderEl) removed.loaderEl.remove(); } catch (e) {}
        try { if (removed.splitControlsEl) removed.splitControlsEl.remove(); } catch (e) {}
        if (state.splitId === id) state.splitId = null;
        if (state.splitPairIds && state.splitPairIds.includes(id)) {
            const nextGroup = state.splitPairIds.filter(candidateId => candidateId !== id);
            state.splitPairIds = nextGroup.length >= 2 ? nextGroup : null;
            state.splitRatios = state.splitPairIds ? normalizeSplitRatios(state.splitRatios, state.splitPairIds.length) : [];
            state.splitId = null;
            if (!state.splitPairIds) state.splitPairColor = '';
        }
        state.activationHistory = state.activationHistory.filter(candidateId => candidateId !== id);
        if (state.activeId === id) {
            const fallbackSplitId = splitGroupBeforeClose.length
                ? splitGroupBeforeClose[Math.min(Math.max(splitGroupIndexBeforeClose, 0), splitGroupBeforeClose.length - 1)]
                : null;
            if (fallbackSplitId && tabById(fallbackSplitId)) {
                activateTab(fallbackSplitId, { recordPrevious: false });
            } else {
                const previousId = state.activationHistory.pop();
                if (previousId === null) {
                    activateHome();
                } else {
                    const previous = previousId ? tabById(previousId) : null;
                    const next = previous || state.tabs[Math.min(idx, state.tabs.length - 1)];
                    if (next) activateTab(next.id, { recordPrevious: false });
                    else activateHome();
                }
            }
        } else {
            syncTabPaneState();
        }
        renderTabs();
        syncTabPaneState();
        updateLoaderVisibility();
        updateClosedTabsButton();
        saveTabs();
    }

    function closeAllTabs() {
        if (!state.tabs.length) return;
        closeTabContextMenu();
        const ids = state.tabs.map(function (tab) { return tab.id; });
        ids.forEach(closeTab);
        activateHome();
    }

    function closedTabSnapshot(tab) {
        if (!tab || !tab.url) return null;
        return {
            url: canonicalTabUrl(tab.url),
            title: tab.title || '',
            browserTitle: tab.browserTitle || '',
            number: tab.number || '',
            contact: tab.contact || '',
            primaryResource: tab.primaryResource || null,
            pinned: !!tab.pinned,
            color: tab.color || '',
            priority: tab.priority || '',
            status: tab.status || '',
            lastActivity: tab.lastActivity || '',
            pageWarning: !!tab.pageWarning,
            hoverFields: normalizeHoverFields(tab.hoverFields),
            metadataFields: normalizeMetadataFields(tab.metadataFields),
            closedAt: Date.now(),
        };
    }

    function rememberClosedTab(tab) {
        const snapshot = closedTabSnapshot(tab);
        if (!snapshot || !snapshot.url) return;
        // Dialog PopOut tabs (Note / Time Entry) can't be restored —
        // their endpoints require a session-bound POST that's gone the
        // moment the tab closes. Skip them so they don't clutter
        // Recently Closed with un-restorable entries.
        if (AUTOTASKTABS.isDialogPopOutFromDialogUrl(snapshot.url)) return;
        state.closedTabs.unshift(snapshot);
        state.closedTabs = state.closedTabs.slice(0, 10);
        updateClosedTabsButton();
    }

    function reopenClosedTab(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        openClosedTabsMenu(state.closedTabsButton);
    }

    function restoreClosedTabSnapshot(snapshot) {
        updateClosedTabsButton();
        if (!snapshot || !snapshot.url) return;
        const restored = createAndAddTab(snapshot.url, snapshot);
        if (restored) {
            restored.pinned = !!snapshot.pinned;
            updateTabEl(restored);
            renderTabs();
            activateTab(restored.id);
        }
        updateClosedTabsButton();
    }

    function reopenClosedTabAt(index) {
        const snapshot = state.closedTabs.splice(index, 1)[0];
        restoreClosedTabSnapshot(snapshot);
    }

    function closedTabMenuLabel(snapshot) {
        if (!snapshot) return 'Closed tab';
        const preferredTitle = state.horizontalCompactTabsEnabled
            ? (snapshot.browserTitle || snapshot.title)
            : (snapshot.title || snapshot.browserTitle);
        const title = String(preferredTitle || snapshot.number || snapshot.url || 'Closed tab').trim();
        const secondary = String(snapshot.number || snapshot.contact || '').trim();
        if (secondary && !title.includes(secondary)) return title + ' - ' + secondary;
        return title || 'Closed tab';
    }

    function closedTabMenuIcon(snapshot) {
        return ICONS[tabIconKey(snapshot)] || ICONS.restoreClosed;
    }

    function openClosedTabsMenu(button) {
        closeTabContextMenu();
        if (!state.closedTabs || !state.closedTabs.length || !button) return;
        const menu = document.createElement('div');
        menu.className = 'at-tabs-context-menu at-tabs-closed-tabs-menu';
        menu.setAttribute('role', 'menu');

        state.closedTabs.slice(0, 10).forEach(function (snapshot, index) {
            const item = createContextMenuItem(
                closedTabMenuLabel(snapshot),
                closedTabMenuIcon(snapshot),
                function () {
                    closeTabContextMenu();
                    reopenClosedTabAt(index);
                }
            );
            item.title = snapshot.url || '';
            menu.appendChild(item);
        });

        document.body.appendChild(menu);
        state.tabContextMenu = menu;
        const rect = button.getBoundingClientRect();
        positionContextMenu(menu, rect.right + 6, rect.bottom + 6);
    }

    function findTabFromWindow(win) {
        for (const tab of state.tabs) {
            if (!tab.iframeEl || !tab.iframeEl.contentWindow) continue;
            let w = win;
            try {
                while (w) {
                    if (w === tab.iframeEl.contentWindow) return tab;
                    if (w.parent === w) break;
                    w = w.parent;
                }
            } catch (e) {}
        }
        return null;
    }

    function windowBelongsToIframe(win, iframeEl) {
        if (!win || !iframeEl || !iframeEl.contentWindow) return false;
        let w = win;
        try {
            while (w) {
                if (w === iframeEl.contentWindow) return true;
                if (w.parent === w) break;
                w = w.parent;
            }
        } catch (e) {}
        return false;
    }

    function windowBelongsToPeek(win) {
        if (!state.peekWrapper) return false;
        const frames = state.peekWrapper.querySelectorAll('iframe');
        for (const frame of frames) {
            if (windowBelongsToIframe(win, frame)) return true;
        }
        return false;
    }

    function findNativeFrameFromWindow(win) {
        if (windowBelongsToIframe(win, state.nativeFrame)) return state.nativeFrame;
        const currentNativeFrame = findContentIframe();
        if (windowBelongsToIframe(win, currentNativeFrame)) return currentNativeFrame;
        return null;
    }

    function tabTypeForUrl(url) {
        if (isUmbrellaContractHomeUrl(url) || isNativeShellTabUrl(url)) return 'umbrellacontract';
        const innerUrl = AUTOTASKTABS.extractInnerUrlFromLandingPageUrl && AUTOTASKTABS.extractInnerUrlFromLandingPageUrl(url);
        if (innerUrl && innerUrl !== url) return tabTypeForUrl(innerUrl);
        const p = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(url));
        if (p === '/mvc/servicedesk/ticketdetail.mvc') return 'ticket';
        if (p === '/mvc/servicedesk/ticketdetail.mvc/ticketbyticketnumber') return 'ticket';
        if (p === '/mvc/servicedesk/ticketedit.mvc') return 'ticket';
        if (p === '/mvc/servicedesk/ticketnew.mvc') return 'ticket';
        if (p === '/mvc/servicedesk/timeentry.mvc/timeentrypopoutfromdialog' ||
            p === '/mvc/servicedesk/timeentry.mvc/newtickettimeentrypage') return 'tickettimeentry';
        if (p === '/mvc/servicedesk/note.mvc/notepopoutfromdialog' ||
            p === '/mvc/servicedesk/note.mvc/newticketnotepage') return 'ticketnote';
        if (p === '/mvc/security/authorization.mvc/failure') return 'authorizationfailure';
        if (p === '/autotask/popups/techscheduling/service_call.aspx') return 'servicecall';
        if (p === '/mvc/knowledgebase/articlenew.mvc/article') return 'knowledgebase';
        if (p === '/mvc/crm/accountnew.mvc' || p === '/mvc/crm/accountdetail.mvc') return 'account';
        if (p === '/mvc/crm/installedproductdetail.mvc') return 'device';
        if (p === '/mvc/crm/note.mvc/view' ||
            p === '/mvc/crm/editcrmnote.mvc/createforaccount') return 'note';
        if (p === '/mvc/crm/opportunitydetail.mvc' ||
            p === '/mvc/crm/wonopportunitywizard.mvc/wonopportunitywizard' ||
            p === '/opportunity/wizards/lostopp/popwiz_frames.asp' ||
            p === '/opportunity/wizards/cancelacc/popwiz_frames.asp' ||
            p === '/opportunity/wizards/reassignlead/popwiz_frames.asp') return 'opportunity';
        if (p === '/autotask35/crm/salesorder/salesorderdetail.aspx') return 'salesorder';
        if (/\/inventory\/inventory_edit_order\.aspx$/i.test(p || '')) return 'purchaseorder';
        if (p === '/opportunity/quotes/quote.asp' ||
            p === '/opportunity/quotes/newquote.asp' ||
            p === '/mvc/crm/quotetemplate.mvc/editproperties') return 'quote';
        if (p === '/mvc/crm/contactnewpage.mvc/create' ||
            p.includes('/contactdetail') ||
            p.includes('/resourcedetail') ||
            p.includes('/persondetail') ||
            p === '/autotask35/grapevine/profile.aspx') return 'person';
        if (p === '/autotask/views/crm/contact_group_management.aspx' ||
            p === '/autotask35/crm/contactgroupmanager.aspx') return 'group';
        if (isUnsubmittedTimesheetsReportUrl(url) ||
            p === '/home/timeentry/wrkentryframes.asp' ||
            p === '/timesheets/views/readonly/tmsreadonly_100.asp') return 'timesheet';
        if (p === '/mvc/inventory/costitem.mvc/shipping' ||
            p === '/mvc/inventory/receipthistory.mvc' ||
            p === '/mvc/inventory/emailpurchaseorder.mvc/emailpurchaseorder' ||
            p.includes('/picklistdetailforshippinggrid') ||
            p.includes('/packinglistdetailforshippinggrid')) return 'inventory';
        if (p === '/autotask/views/servicedesk/servicedeskticket/service_ticket_panel_edit.aspx') return 'charge';
        if (p === '/autotask35/dataselectorhandlers/ticketdataselectorpopup.aspx' ||
            p === '/mvc/projects/importticket.mvc/copytickettoproject' ||
            p === '/servicedesk/popups/forward/svcforward.asp' ||
            p === '/servicedesk/reports/togoreportframe.asp' ||
            p === '/mvc/servicedesk/tickethistory.mvc/servicetickethistory' ||
            p === '/popups/work/svcdetail.asp') return 'ticket';
        if (p === '/mvc/crm/contractbillingruleassociation.mvc/editcontact') return 'charge';
        if (p.includes('/billingproduct') ||
            p.includes('/billing_product') ||
            p.includes('/billingrule') ||
            p.includes('/billing_rule') ||
            p.includes('/billingassociation') ||
            p.includes('/billingproductassociation') ||
            p.includes('/billingruleassociation')) return 'charge';
        if (p === '/mvc/contracts/newcontractwizard.mvc/newcontractwizard' ||
            p.startsWith('/contracts/views/contract')) return 'contract';
        if (p === '/mvc/contracts/invoiceviewer.mvc' ||
            p === '/mvc/contracts/invoiceviewer.mvc/invoicebatchviewer' ||
            p === '/mvc/contracts/invoiceviewer.mvc/invoicepreviewviewer') return 'invoice';
        if (p === '/autotask/views/administration/products/product.aspx' ||
            p === '/mvc/inventory/inventoryproduct.mvc/create' ||
            p === '/mvc/inventory/inventoryproduct.mvc/edit') return 'product';
        if (p === '/mvc/projects/projectdetail.mvc/projectdetail') return 'project';
        if (p === '/mvc/projects/taskdetail.mvc') return 'projecttask';
        if (p === '/autotask/views/dispatcherworkshop/dispatcherworkshopcontainer.aspx') return 'calendar';
        if (p === '/autotask/views/administration/companysetup/neweditallocationcode.aspx') return 'administration';
        if (p === '/autotask/views/administration/companysetup/location_new_edit.aspx') return 'administration';
        if (p === '/autotask/popups/administration/departmentdetails.aspx') return 'administration';
        if (p === '/autotask/views/administration/resources/resource.aspx') return 'administration';
        if (p === '/mvc/administrationsetup/apiuser.mvc/newapiuser') return 'administration';
        if (p === '/mvc/administrationsetup/apiuser.mvc/editapiuser') return 'administration';
        if (p === '/administrator/roles/tabroleview.asp') return 'administration';
        if (p === '/mvc/administrationsetup/invoicetemplate.mvc/editinvoicetemplate') return 'administration';
        if (p === '/mvc/administrationsetup/invoicetemplate.mvc/editproperties') return 'administration';
        if (p === '/mvc/contracts/invoiceemailtemplate.mvc/editinvoiceemailtemplate') return 'administration';
        if (p === '/autotask/views/template/customizenotificationtemplate.aspx') return 'administration';
        return 'unknown';
    }

    function isUnsubmittedTimesheetsReportUrl(url) {
        return AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(url)) === '/reports/time_and_attendance/report/rptallmisstime.asp';
    }

    function unsubmittedTimesheetsMetadata() {
        return {
            title: 'Unsubmitted Timesheets',
            number: '',
            contact: '',
            date: '',
            secondaryTitle: '',
        };
    }

    function tabTypeLabel(tabOrType) {
        const type = normalizeTabType(typeof tabOrType === 'string' ? tabOrType : tabTypeForUrl(tabOrType && tabOrType.url || ''));
        return TAB_TYPE_LABELS[type] || 'Tab';
    }

    function tabEffectiveType(tab) {
        const metadataType = String(tab && tab.metadataFields && tab.metadataFields.type || '').trim().toLowerCase();
        // Access Denied wins over any URL-based type — even when the
        // iframe URL stays on the original entity (e.g. a Contract
        // the user can't view), the page itself is showing the
        // Access Denied state and the lock icon should reflect that.
        if (metadataType === 'access denied') return 'authorizationfailure';
        const urlType = tabTypeForUrl(tab && tab.url || '');
        if (urlType !== 'unknown') return urlType;
        if (metadataType === 'admin' || metadataType === 'administration') return 'administration';
        if (metadataType === 'contract') return 'contract';
        if (metadataType === 'umbrella contract' || metadataType === 'umbrella contracts') return 'umbrellacontract';
        if (metadataType === 'inventory product' || metadataType === 'product') return 'product';
        if (metadataType === 'organization') return 'account';
        if (metadataType === 'ticket') return 'ticket';
        if (metadataType === 'service call') return 'servicecall';
        if (metadataType === 'knowledge base') return 'knowledgebase';
        if (metadataType === 'opportunity') return 'opportunity';
        if (metadataType === 'device') return 'device';
        if (metadataType === 'invoice') return 'invoice';
        if (metadataType === 'project') return 'project';
        if (metadataType === 'task') return 'projecttask';
        return urlType;
    }

    function tabMetadataFields(tab) {
        const type = tabEffectiveType(tab);
        const fields = Object.assign({}, normalizeMetadataFields(tab && tab.metadataFields));
        fields.type = tabTypeLabel(type);
        fields.secondaryTitle = fields.secondaryTitle || '';
        fields.number = fields.number || String(tab && tab.number || '').trim();
        fields.id = fields.id || (/^ID\b/i.test(fields.number) ? fields.number : '');
        fields.organization = fields.organization || String(tab && tab.contact || '').trim();
        fields.primaryResource = fields.primaryResource || String(tab && tab.primaryResource && tab.primaryResource.name || '').trim();
        if (type === 'administration') {
            fields.id = fields.id || fields.number || fields.secondaryTitle || '';
            fields.secondaryTitle = fields.secondaryTitle || fields.number || fields.id || '';
        }
        return fields;
    }

    // When the user has selected a metadata field for line 2 or 3
    // and the value is empty, fall back to "No <field>" instead of
    // the tab type label. Keeps the user's chosen field visible as
    // a clear "this is empty" hint instead of a generic "Ticket".
    const EMPTY_LINE_FALLBACKS = {
        contact: 'No contact',
        organization: 'No organization',
        contractType: 'No contract type',
        date: 'No date',
        id: 'No ID',
        model: 'No model',
        number: 'No number',
        productCategory: 'No category',
        project: 'No project',
        purchaseOrder: 'No purchase order',
        secondaryTitle: 'No subtitle',
        ticketTitle: 'No title',
        vendor: 'No vendor',
        externalPoNumber: 'No PO number',
        quoteName: 'No quote name',
    };

    function tabLineValue(tab, line) {
        if (!tab) return '';
        if (line === 3 && horizontalCompactTabsActive()) return '';
        const type = tabEffectiveType(tab);
        const settings = line === 2 ? state.tabLine2Fields : state.tabLine3Fields;
        const options = getLineOptionsForType(type);
        let key = settings && settings[type] || (line === 2 ? 'organization' : 'contact');
        if (!options.includes(key)) key = getDefaultLineField(type, line);
        const fields = tabMetadataFields(tab);
        if (type === 'invoice') {
            if (line === 2 && key === 'id' && !String(fields.id || '').trim() && String(fields.purchaseOrder || '').trim()) {
                return fields.purchaseOrder;
            }
            if (line === 3 && key === 'none' && String(fields.organization || '').trim()) {
                return fields.organization;
            }
        }
        if (type === 'product') {
            if (String(fields.productIsNew || '').trim() === 'true') return '';
            if (key === 'productCategory' && !String(fields.productCategory || '').trim()) return '';
        }
        if (type === 'administration' && line === 3 && (key === 'none' || key === 'type')) {
            const line2Settings = state.tabLine2Fields;
            const line2Options = getLineOptionsForType(type);
            let line2Key = line2Settings && line2Settings[type] || 'id';
            if (!line2Options.includes(line2Key)) line2Key = getDefaultLineField(type, 2);
            const line2Value = line2Key !== 'none' && line2Key !== 'type'
                ? String(fields[line2Key] || '').trim()
                : '';
            return line2Value ? fields.type : '';
        }
        if (key === 'none') return '';
        const value = String(fields[key] || '').trim();
        if (value) return value;
        if (EMPTY_LINE_FALLBACKS[key]) return EMPTY_LINE_FALLBACKS[key];
        return line === 2 && type !== 'unknown' ? fields.type : '';
    }

    function homeMetadataLineValue(line) {
        if (line === 3 && horizontalCompactTabsActive()) return '';
        const type = normalizeTabType(state.homeMetadataType || '');
        if (!type) return '';
        const settings = line === 2 ? state.tabLine2Fields : state.tabLine3Fields;
        const options = getLineOptionsForType(type);
        let key = settings && settings[type] || getDefaultLineField(type, line);
        if (!options.includes(key)) key = getDefaultLineField(type, line);
        if (key === 'none') return '';
        const fields = Object.assign({}, normalizeMetadataFields(state.homeMetadataFields));
        fields.type = fields.type || tabTypeLabel(type);
        const value = String(fields[key] || '').trim();
        if (value) return value;
        if (EMPTY_LINE_FALLBACKS[key]) return EMPTY_LINE_FALLBACKS[key];
        return line === 2 ? fields.type : '';
    }

    function homeTabRowCount() {
        if (state.horizontalCompactTabsEnabled) return 1;
        let rows = 1;
        if (homeMetadataLineValue(2)) rows += 1;
        if (homeMetadataLineValue(3)) rows += 1;
        return Math.max(1, Math.min(2, rows));
    }

    function tabLineFieldKey(tab, line) {
        if (!tab) return '';
        const type = tabEffectiveType(tab);
        const settings = line === 2 ? state.tabLine2Fields : state.tabLine3Fields;
        const options = getLineOptionsForType(type);
        let key = settings && settings[type] || (line === 2 ? 'organization' : 'contact');
        if (type === 'projecttask' && line === 2 && key === 'organization') {
            const fields = tabMetadataFields(tab);
            if (fields.project) key = 'project';
        }
        if (!options.includes(key)) key = getDefaultLineField(type, line);
        return key;
    }

    function applyTabLineStyle(el, tab, line) {
        if (!el) return;
        el.style.removeProperty('color');
        if (!tab) return;
        const key = tabLineFieldKey(tab, line);
        if (key !== 'status' && key !== 'priority') return;
        const fields = tabMetadataFields(tab);
        const color = String(fields[key + 'Color'] || '').trim();
        if (/^rgba?\(\s*0\s*,\s*0\s*,\s*0\s*(?:,\s*0\s*)?\)$/i.test(color)) return;
        if (/^transparent$/i.test(color)) return;
        if (color) el.style.setProperty('color', color);
    }

    function fallbackMetadataFields(type, fallback) {
        return {
            type: tabTypeLabel(type),
            secondaryTitle: fallback.secondaryTitle || '',
            id: /^ID\b/i.test(fallback.number || '') ? fallback.number : '',
            number: fallback.number || '',
            organization: fallback.contact || '',
            date: fallback.date || '',
        };
    }

    function fallbackTabMetadataForUrl(url) {
        const innerUrl = AUTOTASKTABS.extractInnerUrlFromLandingPageUrl && AUTOTASKTABS.extractInnerUrlFromLandingPageUrl(url);
        if (innerUrl && innerUrl !== url) return fallbackTabMetadataForUrl(innerUrl);
        const path = AUTOTASKTABS.pathOf(url);
        let parsed = null;
        try { parsed = new URL(url, location.origin); } catch (e) {}
        const params = parsed ? parsed.searchParams : new URLSearchParams();

        if (isUmbrellaContractHomeUrl(url)) {
            const contractId = umbrellaContractIdFromUrl(url);
            return {
                title: 'Umbrella Contract',
                number: contractId ? 'ID ' + contractId : '',
                contact: '',
                secondaryTitle: 'Umbrella Contract',
            };
        }

        if (isUnsubmittedTimesheetsReportUrl(url)) {
            return unsubmittedTimesheetsMetadata();
        }

        if (path === '/mvc/servicedesk/timeentry.mvc/newtickettimeentrypage') {
            return {
                title: 'New Ticket Time Entry',
                number: '',
                contact: '',
            };
        }
        if (path === '/mvc/servicedesk/timeentry.mvc/timeentrypopoutfromdialog') {
            return {
                title: 'New Time Entry',
                number: '',
                contact: '',
            };
        }
        if (path === '/mvc/servicedesk/note.mvc/notepopoutfromdialog') {
            return {
                title: 'New Note',
                number: '',
                contact: '',
            };
        }
        if (path === '/mvc/security/authorization.mvc/failure') {
            return {
                title: 'Access Denied',
                number: '',
                contact: '',
            };
        }
        if (path === '/mvc/servicedesk/note.mvc/newticketnotepage') {
            return {
                title: 'New Ticket Note',
                number: '',
                contact: '',
            };
        }
        if (path === '/mvc/servicedesk/ticketnew.mvc') {
            const ticketType = params.get('ticketType') || params.get('tickettype') || '';
            const typeLabel = ticketType === '2' ? 'Incident Ticket'
                : ticketType === '3' ? 'Problem Ticket'
                    : ticketType === '4' ? 'Change Request Ticket'
                        : ticketType ? 'Ticket Type ' + ticketType
                            : 'Ticket';
            return {
                title: 'New Ticket',
                number: typeLabel,
                contact: '',
            };
        }
        if (path === '/mvc/servicedesk/ticketedit.mvc') {
            return {
                title: 'Ticket',
                number: 'Ticket',
                contact: '',
            };
        }
        if (path === '/mvc/servicedesk/ticketdetail.mvc/ticketbyticketnumber') {
            const ticketNumber = params.get('ticketNumber') || params.get('ticketnumber') || '';
            return {
                title: 'Ticket',
                number: ticketNumber,
                contact: '',
            };
        }
        if (AUTOTASKTABS.normalizeHandledPath(path) === '/autotask/popups/techscheduling/service_call.aspx') {
            const serviceCallId = params.get('serviceCallID') || params.get('serviceCallId') || params.get('servicecallid') || params.get('id') || params.get('ID');
            return {
                title: 'Service Call',
                number: serviceCallId ? `ID ${serviceCallId}` : '',
                contact: '',
            };
        }
        if (AUTOTASKTABS.normalizeHandledPath(path) === '/mvc/knowledgebase/articlenew.mvc/article') {
            return {
                title: 'Knowledge Base',
                number: 'New Article',
                contact: '',
            };
        }
        if (AUTOTASKTABS.normalizeHandledPath(path) === '/home/timeentry/wrkentryframes.asp') {
            const date = params.get('forDate') || params.get('fordate') || '';
            return {
                title: 'Timesheet',
                number: 'Timesheet',
                contact: '',
                date: date,
            };
        }
        if (AUTOTASKTABS.normalizeHandledPath(path) === '/autotask/views/administration/companysetup/neweditallocationcode.aspx') {
            const allocationCodeId = params.get('allocationCodeID') || params.get('allocationCodeId') || params.get('allocationcodeid');
            return {
                title: 'Allocation Code',
                number: allocationCodeId ? `ID ${allocationCodeId}` : 'Administration',
                contact: ''
            };
        }
        if (AUTOTASKTABS.normalizeHandledPath(path) === '/administrator/roles/tabroleview.asp') {
            const roleId = params.get('ObjectId') || params.get('objectId') || params.get('objectid');
            return {
                title: 'Role',
                number: roleId ? `ID ${roleId}` : 'Administration',
                contact: ''
            };
        }
        if (AUTOTASKTABS.normalizeHandledPath(path) === '/mvc/administrationsetup/invoicetemplate.mvc/editinvoicetemplate') {
            const templateId = params.get('invoiceTemplateId') || params.get('invoiceTemplateID') || params.get('invoicetemplateid');
            return {
                title: 'Invoice Template',
                number: templateId ? `ID ${templateId}` : 'Design Invoice Template',
                contact: ''
            };
        }
        if (AUTOTASKTABS.normalizeHandledPath(path) === '/mvc/administrationsetup/invoicetemplate.mvc/editproperties') {
            const templateId = params.get('invoiceTemplateId') || params.get('invoiceTemplateID') || params.get('invoicetemplateid');
            return {
                title: 'Invoice Template Properties',
                number: templateId ? `ID ${templateId}` : 'Administration',
                contact: ''
            };
        }
        if (AUTOTASKTABS.normalizeHandledPath(path) === '/mvc/contracts/invoiceemailtemplate.mvc/editinvoiceemailtemplate') {
            const templateId = params.get('invoiceEmailTemplateId') || params.get('invoiceEmailTemplateID') || params.get('invoiceemailtemplateid');
            return {
                title: 'Invoice Email Template',
                number: templateId ? `ID ${templateId}` : 'Invoice Email Template',
                contact: ''
            };
        }
        if (AUTOTASKTABS.normalizeHandledPath(path) === '/mvc/contracts/invoiceviewer.mvc' ||
            AUTOTASKTABS.normalizeHandledPath(path) === '/mvc/contracts/invoiceviewer.mvc/invoicebatchviewer' ||
            AUTOTASKTABS.normalizeHandledPath(path) === '/mvc/contracts/invoiceviewer.mvc/invoicepreviewviewer') {
            const invoiceId = params.get('invoiceId') || params.get('invoiceID') || params.get('invoiceid');
            const batchId = params.get('batchId') || params.get('batchID') || params.get('batchid');
            return {
                title: invoiceId ? `Invoice ${invoiceId}` : batchId ? `Invoice Batch ${batchId}` : 'Invoice',
                number: invoiceId ? `ID ${invoiceId}` : batchId ? `Batch ${batchId}` : 'Invoice',
                contact: ''
            };
        }
        if (AUTOTASKTABS.normalizeHandledPath(path) === '/autotask/views/administration/products/product.aspx') {
            const productMode = String(params.get('cmd') || '').toLowerCase();
            return {
                title: productMode === 'new' ? 'New Inventory Product' : 'Inventory Product',
                number: '',
                contact: ''
            };
        }
        if (AUTOTASKTABS.normalizeHandledPath(path) === '/autotask/views/dispatcherworkshop/dispatcherworkshopcontainer.aspx') {
            return {
                title: 'Dispatcher Workshop',
                number: 'Calendar',
                contact: '',
            };
        }
        if (path.includes('/ticketprintview.mvc')) {
            return {
                title: 'Ticket Print View',
                number: params.get('ticketId') ? 'Ticket ID ' + params.get('ticketId') : '',
                contact: '',
            };
        }
        if (path.includes('/picklistdetailforshippinggrid')) {
            return {
                title: 'Pick List',
                number: 'Inventory',
                contact: params.get('accountId') ? 'Account ID ' + params.get('accountId') : '',
            };
        }
        if (path.includes('/packinglistdetailforshippinggrid')) {
            const account = params.get('accountIdWithIndex') || '';
            return {
                title: 'Packing List',
                number: 'Inventory',
                contact: account ? 'Account ' + account.split(':')[0] : '',
            };
        }
        if (path === '/autotask35/dataselectorhandlers/ticketdataselectorpopup.aspx') {
            const action = (params.get('selectionAction') || '').toLowerCase();
            const excludedTicketId = params.get('excludedTicketIds') || '';
            return {
                title: action === 'selectticketstomergeto'
                    ? 'Merge Ticket'
                    : action === 'selectticketstoabsorb'
                        ? 'Absorb Tickets'
                        : 'Select Tickets',
                number: excludedTicketId ? 'Ticket ' + excludedTicketId : '',
                contact: '',
            };
        }
        if (path === '/mvc/projects/importticket.mvc/copytickettoproject') {
            const taskId = params.get('taskIDs') || params.get('taskids') || '';
            return {
                title: 'Copy Ticket to Project',
                number: taskId ? 'Ticket ' + taskId : '',
                contact: '',
            };
        }
        if (path === '/servicedesk/popups/forward/svcforward.asp') {
            const taskId = params.get('taskIDs') || params.get('taskids') || '';
            return {
                title: 'Forward Ticket',
                number: taskId ? 'Ticket ' + taskId : '',
                contact: '',
            };
        }
        if (path === '/servicedesk/reports/togoreportframe.asp') {
            const ticketId = params.get('taskObjectID') || params.get('taskobjectid') || '';
            return {
                title: 'Ticket Report',
                number: ticketId ? 'Ticket ' + ticketId : '',
                contact: '',
            };
        }
        if (path === '/mvc/servicedesk/tickethistory.mvc/servicetickethistory') {
            const ticketId = params.get('ticketId') || params.get('ticketid') || '';
            return {
                title: params.get('slaTabSelected') ? 'SLA History' : 'Ticket History',
                number: ticketId ? 'Ticket ' + ticketId : '',
                contact: '',
            };
        }
        if (path === '/popups/work/svcdetail.asp') {
            const clientId = params.get('clientID') || params.get('clientid') || '';
            return {
                title: 'Work Detail',
                number: clientId ? 'Client ' + clientId : '',
                contact: '',
            };
        }
        if (path === '/mvc/crm/installedproductdetail.mvc') {
            const installedProductId = params.get('installedProductId') || params.get('installedproductid');
            return {
                title: 'Device',
                number: installedProductId ? 'ID ' + installedProductId : '',
                contact: '',
            };
        }
        if (path === '/mvc/crm/note.mvc/view') {
            const id = params.get('id') || params.get('ID');
            return {
                title: 'Note',
                number: id ? 'ID ' + id : '',
                contact: '',
            };
        }
        if (path === '/mvc/crm/opportunitydetail.mvc') {
            const opportunityId = params.get('opportunityId') || params.get('opportunityid');
            return {
                title: 'Opportunity',
                number: opportunityId ? 'ID ' + opportunityId : '',
                contact: '',
            };
        }
        if (path === '/autotask35/crm/salesorder/salesorderdetail.aspx') {
            const salesOrderId = params.get('salesorderid') || params.get('salesOrderId');
            return {
                title: 'Sales Order',
                number: salesOrderId ? 'ID ' + salesOrderId : '',
                contact: '',
            };
        }
        if (/\/inventory\/inventory_edit_order\.aspx/i.test(path || '')) {
            const purchaseOrderId = params.get('id') || params.get('ID') ||
                params.get('purchaseOrderId') || params.get('purchaseorderid') || params.get('purchaseOrderID');
            return {
                title: 'Purchase Order',
                number: purchaseOrderId ? 'ID ' + purchaseOrderId : 'Purchase Order',
                contact: '',
            };
        }
        if (path === '/mvc/inventory/receipthistory.mvc') {
            const purchaseOrderId = params.get('purchaseOrderId') || params.get('purchaseorderid') || params.get('purchaseOrderID');
            return {
                title: 'Vendor Invoice',
                number: purchaseOrderId ? 'Purchase Order ' + purchaseOrderId : 'Purchase Order',
                contact: '',
            };
        }
        if (path === '/mvc/inventory/emailpurchaseorder.mvc/emailpurchaseorder') {
            const purchaseOrderId = params.get('purchaseOrderId') || params.get('purchaseorderid') || params.get('purchaseOrderID');
            return {
                title: 'Email Purchase Order',
                number: purchaseOrderId ? 'Purchase Order ' + purchaseOrderId : 'Purchase Order',
                contact: '',
            };
        }
        if (path === '/opportunity/quotes/quote.asp' || path === '/opportunity/quotes/newquote.asp') {
            const quoteId = params.get('QuoteID') || params.get('quoteID') || params.get('quoteId') || params.get('objectID');
            return {
                title: quoteId ? 'Quote ' + quoteId : 'Quote',
                number: 'Quote',
                contact: '',
            };
        }
        if (path === '/mvc/crm/quotetemplate.mvc/editproperties') {
            return {
                title: 'Quote Template',
                number: 'Quote',
                contact: '',
            };
        }
        if (path === '/autotask/views/crm/contact_group_management.aspx' ||
            path === '/autotask35/crm/contactgroupmanager.aspx') {
            const groupId = params.get('groupid') || params.get('groupId');
            return {
                title: groupId && groupId !== '0' ? 'Contact Group' : 'New Contact Group',
                number: groupId && groupId !== '0' ? 'ID ' + groupId : 'Group',
                contact: '',
            };
        }
        if (path === '/mvc/inventory/costitem.mvc/shipping') {
            return {
                title: 'Shipping',
                number: 'Inventory',
                contact: '',
            };
        }
        if (path === '/autotask/views/servicedesk/servicedeskticket/service_ticket_panel_edit.aspx') {
            const ticketId = params.get('ticketID') || params.get('ticketId') || params.get('ticketid');
            const genericId = params.get('genericId') || params.get('genericid');
            return {
                title: 'Ticket Charge',
                number: ticketId ? 'Ticket ID ' + ticketId : (genericId ? 'Charge ID ' + genericId : ''),
                contact: '',
            };
        }
        if (path === '/mvc/crm/contractbillingruleassociation.mvc/editcontact') {
            return {
                title: 'Billing Products',
                number: 'Charge',
                contact: '',
            };
        }
        if (path.includes('/billingproduct') ||
            path.includes('/billing_product') ||
            path.includes('/billingrule') ||
            path.includes('/billing_rule') ||
            path.includes('/billingassociation') ||
            path.includes('/billingproductassociation') ||
            path.includes('/billingruleassociation')) {
            return {
                title: 'Billing Products',
                number: 'Charge',
                contact: '',
            };
        }
        if (path === '/mvc/projects/projectdetail.mvc/projectdetail') {
            const projectId = params.get('projectId') || params.get('projectid');
            return {
                title: 'Project',
                number: projectId ? 'ID ' + projectId : '',
                contact: '',
            };
        }
        if (path === '/mvc/projects/taskdetail.mvc') {
            const taskId = params.get('taskId') || params.get('taskid');
            return {
                title: 'Task',
                number: taskId ? 'ID ' + taskId : '',
                contact: '',
            };
        }
        return {
            title: '',
            number: '',
            contact: '',
        };
    }

    function tabIconKey(tab) {
        if (isNativeShellTab(tab)) return 'umbrellacontract';
        if (isUmbrellaContractHomeUrl(tab?.url || '')) return 'umbrellacontract';
        const title = typeof tab?.title === 'string' ? tab.title.toLowerCase() : '';
        if (title.includes('livelink')) return 'livelink';
        const path = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(tab?.url || ''));
        if (path === '/mvc/projects/taskdetail.mvc') return 'projectTask';
        if (path === '/autotask/views/administration/resources/resource.aspx' ||
            path === '/mvc/administrationsetup/apiuser.mvc/newapiuser' ||
            path === '/mvc/administrationsetup/apiuser.mvc/editapiuser') return 'resourceManagement';
        if (path === '/autotask/views/template/customizenotificationtemplate.aspx') return 'notificationTemplate';
        if (path === '/autotask/popups/administration/workflow_rule.aspx') return 'workflowRule';
        return tabTypeForUrl(tab?.url || '');
    }

    function renderHomeTab() {
        const el = document.createElement('div');
        el.className = 'at-tab home active';
        if (state.homeLoading && state.activeId === null) el.classList.add('loading');

        const icon = document.createElement('span');
        icon.className = 'icon';
        appendIconMarkup(icon, ICONS.home);

        const spinner = document.createElement('span');
        spinner.className = 'home-spinner';
        spinner.setAttribute('aria-hidden', 'true');

        const meta = document.createElement('div');
        meta.className = 'meta home-meta';

        const label = document.createElement('span');
        label.className = 'line title home-label';
        label.textContent = state.homeTitle || 'Home';

        const line2 = document.createElement('div');
        line2.className = 'line number home-line-2';

        const line3 = document.createElement('div');
        line3.className = 'line contact home-line-3';

        const umbrellaInfo = document.createElement('span');
        umbrellaInfo.className = 'home-umbrella-info fa-circle-info fa-regular';
        umbrellaInfo.tabIndex = 0;
        umbrellaInfo.setAttribute('aria-label', UMBRELLA_CONTRACT_DISCLAIMER);
        umbrellaInfo.setAttribute('role', 'img');
        umbrellaInfo.addEventListener('pointerenter', function () {
            showUmbrellaInfoTooltip(umbrellaInfo);
        });
        umbrellaInfo.addEventListener('pointerleave', function () {
            hideUmbrellaInfoTooltip(false);
        });
        umbrellaInfo.addEventListener('focus', function () {
            showUmbrellaInfoTooltip(umbrellaInfo);
        });
        umbrellaInfo.addEventListener('blur', function () {
            hideUmbrellaInfoTooltip(false);
        });

        meta.appendChild(label);
        meta.appendChild(line2);
        meta.appendChild(line3);

        el.appendChild(icon);
        el.appendChild(spinner);
        el.appendChild(meta);
        el.appendChild(umbrellaInfo);
        el.addEventListener('click', activateHome);
        state.homeTabEl = el;
        updateHomeTabMetadata();
    }

    function tabRowCount(tab) {
        if (state.horizontalCompactTabsEnabled) return 1;
        let rows = 1;
        if (tab && tabLineValue(tab, 2)) rows += 1;
        if (tab && tabLineValue(tab, 3)) rows += 1;
        return Math.max(1, Math.min(2, rows));
    }

    function updateTabRowCount(tab) {
        if (!tab || !tab.tabEl) return;
        tab.tabEl.style.setProperty('--autotasktabs-tab-rows', String(tabRowCount(tab)));
    }

    function setHomeTitle(rawTitle) {
        const next = (rawTitle || '').trim() || 'Home';
        if (/dialogiframeoverlaypage/i.test(next)) {
            const current = (state.homeTitle || '').trim();
            const hasResolvedRealTitle = !!current &&
                current !== 'Home' &&
                !/dialogiframeoverlaypage/i.test(current);
            if (hasResolvedRealTitle) {
                clearHomeLoading();
                return;
            }
            if (state.homeLoadingAwaitingNativeLoad) {
                setHomeLoading(true);
            }
            return;
        }
        state.homeTitle = next;
        updateHomeTabMetadata();
        // A real native title means the Home tab has meaningful metadata again.
        // Let that win over late/stale nav-start messages so the tab cannot
        // get stuck showing only the spinner.
        if (state.activeId === null) {
            state.homePersistedTitle = next;
            if (!state.homePersistedUrl) state.homePersistedUrl = getPersistableHomeUrl();
            if (state.homePersistedUrl) saveTabs();
        }
        clearHomeLoading();
    }

    function updateHomeTabMetadata() {
        if (!state.homeTabEl) return;
        const title = state.homeTitle || 'Home';
        const line2Value = homeMetadataLineValue(2);
        const line3Value = homeMetadataLineValue(3);
        const label = state.homeTabEl.querySelector('.home-label');
        const line2 = state.homeTabEl.querySelector('.home-line-2');
        const line3 = state.homeTabEl.querySelector('.home-line-3');
        const icon = state.homeTabEl.querySelector('.icon');
        const isUmbrellaContract = state.homeMetadataType === 'umbrellacontract';
        state.homeTabEl.classList.toggle('umbrella-contract', isUmbrellaContract);
        if (!isUmbrellaContract) hideUmbrellaInfoTooltip(true);
        if (icon) appendIconMarkup(icon, isUmbrellaContract ? ICONS.umbrellacontract : ICONS.home);
        if (label) label.textContent = title;
        if (line2) {
            line2.textContent = line2Value;
            line2.style.display = line2Value ? '' : 'none';
        }
        if (line3) {
            line3.textContent = line3Value;
            line3.style.display = line3Value ? '' : 'none';
        }
        if (isUmbrellaContract) {
            state.homeTabEl.removeAttribute('title');
        } else {
            state.homeTabEl.title = [title, line2Value, line3Value].filter(Boolean).join('\n') || title;
        }
        state.homeTabEl.style.setProperty('--autotasktabs-tab-rows', String(state.homeMetadataType ? homeTabRowCount() : 1));
    }

    function clearHomeMetadata() {
        if (!state.homeMetadataType && !Object.keys(state.homeMetadataFields || {}).length) return;
        state.homeMetadataType = '';
        state.homeMetadataFields = {};
        updateHomeTabMetadata();
    }

    function normalizeHomeMetadataText(value) {
        return String(value || '').replace(/\s+/g, ' ').trim();
    }

    function nativeDocumentFromFrame(frame) {
        if (!frame) return null;
        try {
            return frame.contentDocument || frame.contentWindow.document || null;
        } catch (e) {
            return null;
        }
    }

    function umbrellaMetadataValueForLabel(doc, labelText) {
        if (!doc) return '';
        const wanted = normalizeHomeMetadataText(labelText).toLowerCase();
        const labels = doc.querySelectorAll('.o-label__text, label.o-label__text, label');
        for (const label of labels) {
            if (normalizeHomeMetadataText(label.textContent).toLowerCase() !== wanted) continue;
            const labelCell = label.closest('.o-flex-child') || label.parentElement;
            const valueCell = labelCell ? labelCell.nextElementSibling : null;
            if (!valueCell) return '';
            const preferred = valueCell.querySelector('.c-avatar ~ .c-text, a.c-link, .c-link, .c-editable-data__data-content .c-text, .c-text.o-font--body-regular');
            const value = normalizeHomeMetadataText(preferred ? preferred.textContent : valueCell.textContent);
            return value;
        }
        return '';
    }

    function extractUmbrellaContractHomeMetadata(doc) {
        if (!doc) return {};
        const titleEl = doc.querySelector('.c-text.o-font--page-title-bold.c-text--primary-color, .o-font--page-title-bold');
        return {
            title: normalizeHomeMetadataText(titleEl && titleEl.textContent),
            organization: umbrellaMetadataValueForLabel(doc, 'Organization'),
            accountManager: umbrellaMetadataValueForLabel(doc, 'Account Manager'),
            contact: umbrellaMetadataValueForLabel(doc, 'Contact'),
        };
    }

    function syncUmbrellaContractHomeMetadata(url, source) {
        if (!isUmbrellaContractHomeUrl(url)) return false;
        const doc = source && source.nodeType === 9 ? source : nativeDocumentFromFrame(source || state.nativeFrame || findContentIframe()) || document;
        const metadata = extractUmbrellaContractHomeMetadata(doc);
        const documentTitle = normalizeHomeMetadataText(doc && doc.title);
        const existingTitle = normalizeHomeMetadataText(state.homeTitle);
        const looksLikeContractSearch = /^contract search$/i.test(metadata.title || '') ||
            /^contract search$/i.test(documentTitle || '') ||
            /^contract search$/i.test(existingTitle || '');
        const hasUmbrellaDetailMetadata = !!(metadata.title || metadata.organization || metadata.accountManager || metadata.contact);
        if (looksLikeContractSearch && !hasUmbrellaDetailMetadata) {
            clearHomeMetadata();
            setHomeTitle('Contract Search');
            return false;
        }
        const title = metadata.title || (existingTitle && existingTitle !== 'Home' ? existingTitle : 'Umbrella Contract');
        state.homeMetadataType = 'umbrellacontract';
        state.homeMetadataFields = {
            type: 'Umbrella Contract',
            organization: metadata.organization || '',
            accountManager: metadata.accountManager || '',
            contact: metadata.contact || '',
        };
        setHomeTitle(title);
        return !!(metadata.title || metadata.organization || metadata.accountManager || metadata.contact);
    }

    function syncNativeShellTabMetadata(tab, source) {
        if (!isNativeShellTab(tab)) return false;
        const doc = source && source.nodeType === 9 ? source : document;
        if (!isUmbrellaContractHomeUrl(tab.url)) return false;
        const metadata = extractUmbrellaContractHomeMetadata(doc);
        const fallback = fallbackTabMetadataForUrl(tab.url);
        const title = metadata.title || tab.title || fallback.title || 'Umbrella Contract';
        const contractId = umbrellaContractIdFromUrl(tab.url);
        tab.title = title;
        tab.number = tab.number || (contractId ? 'ID ' + contractId : '');
        tab.contact = metadata.organization || tab.contact || '';
        tab.metadataFields = mergeMetadataFieldsPreservingExisting(tab.metadataFields, {
            type: 'Umbrella Contract',
            secondaryTitle: title,
            id: contractId ? 'ID ' + contractId : '',
            number: contractId ? 'ID ' + contractId : '',
            organization: metadata.organization || '',
            accountManager: metadata.accountManager || '',
            contact: metadata.contact || '',
        });
        tab.loading = false;
        updateTabEl(tab);
        updateLoaderVisibility();
        saveTabs();
        return !!(metadata.title || metadata.organization || metadata.accountManager || metadata.contact);
    }

    function syncActiveNativeShellTabMetadata() {
        const active = tabById(state.activeId);
        if (!isNativeShellTab(active)) return false;
        return syncNativeShellTabMetadata(active, document);
    }

    function scheduleNativeShellTabMetadataSync(tab) {
        if (!isNativeShellTab(tab)) return;
        [100, 400, 1000, 2200].forEach(function (delay) {
            window.setTimeout(function () {
                if (tabById(tab.id) !== tab) return;
                syncNativeShellTabMetadata(tab, document);
            }, delay);
        });
    }

    function ensureNativeShellTabVisible(tab) {
        if (!isNativeShellTab(tab)) return false;
        const targetUrl = canonicalTabUrl(tab.url);
        tab.nativeShell = true;
        if (isUmbrellaContractHomeUrl(targetUrl)) markUmbrellaContractFrameReload();
        if (canonicalTabUrl(location.href) !== targetUrl) {
            tab.loading = true;
            updateTabEl(tab);
            updateLoaderVisibility();
            try { window.location.assign(targetUrl); } catch (e) {}
            return true;
        }
        syncNativeShellTabMetadata(tab, document);
        scheduleNativeShellTabMetadataSync(tab);
        if (hasPendingUmbrellaContractFrameReload()) {
            window.setTimeout(reloadLoadedFramesAfterUmbrellaContractWhenReady, 0);
        }
        return true;
    }

    function ensureUmbrellaInfoTooltip() {
        if (state.umbrellaInfoTooltip) return state.umbrellaInfoTooltip;
        const tooltip = document.createElement('div');
        tooltip.className = 'at-tabs-umbrella-info-tooltip';
        tooltip.setAttribute('role', 'tooltip');
        tooltip.textContent = UMBRELLA_CONTRACT_DISCLAIMER;
        document.body.appendChild(tooltip);
        state.umbrellaInfoTooltip = tooltip;
        return tooltip;
    }

    function positionUmbrellaInfoTooltip(tooltip, anchorEl) {
        if (!tooltip || !anchorEl) return;
        const rect = anchorEl.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const margin = 8;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let top = rect.bottom + margin;
        let left = rect.left - tooltipRect.width + rect.width;
        if (isVerticalBar()) {
            top = rect.top;
            left = rect.right + margin;
        }
        if (left + tooltipRect.width + margin > vw) left = vw - tooltipRect.width - margin;
        if (left < margin) left = margin;
        if (top + tooltipRect.height + margin > vh) top = rect.top - tooltipRect.height - margin;
        if (top < margin) top = margin;
        tooltip.style.left = left + 'px';
        tooltip.style.top = top + 'px';
    }

    function showUmbrellaInfoTooltip(anchorEl) {
        if (!anchorEl || hoverCardSuppressed()) return;
        if (state.umbrellaInfoTooltipHideTimer) {
            window.clearTimeout(state.umbrellaInfoTooltipHideTimer);
            state.umbrellaInfoTooltipHideTimer = 0;
        }
        const tooltip = ensureUmbrellaInfoTooltip();
        tooltip.style.left = '-9999px';
        tooltip.style.top = '0px';
        tooltip.classList.add('visible');
        window.requestAnimationFrame(function () {
            if (!state.umbrellaInfoTooltip || !anchorEl.isConnected) return;
            positionUmbrellaInfoTooltip(tooltip, anchorEl);
        });
    }

    function hideUmbrellaInfoTooltip(immediate) {
        if (state.umbrellaInfoTooltipHideTimer) {
            window.clearTimeout(state.umbrellaInfoTooltipHideTimer);
            state.umbrellaInfoTooltipHideTimer = 0;
        }
        const hide = function () {
            if (state.umbrellaInfoTooltip) state.umbrellaInfoTooltip.classList.remove('visible');
        };
        if (immediate) {
            hide();
            return;
        }
        state.umbrellaInfoTooltipHideTimer = window.setTimeout(function () {
            state.umbrellaInfoTooltipHideTimer = 0;
            hide();
        }, 90);
    }

    function scheduleUmbrellaContractHomeMetadataSync(url, source) {
        if (!isUmbrellaContractHomeUrl(url)) return;
        [150, 500, 1200, 2500].forEach(function (delay) {
            window.setTimeout(function () {
                syncUmbrellaContractHomeMetadata(url, source);
            }, delay);
        });
    }

    function homeTitleForNativeUrl(url) {
        try {
            const parsed = new URL(url || '', location.origin);
            if (parsed.pathname.toLowerCase() === '/autotaskonyx/landingpage' &&
                parsed.searchParams.get('view') === 'umbrella-contract-details') {
                return 'Umbrella Contract';
            }
        } catch (e) {}
        return '';
    }

    function setHomeLoading(loading) {
        const next = !!loading;
        state.homeLoading = next;
        updateHomeLoadingIndicator();
    }

    function updateHomeLoadingIndicator() {
        if (!state.homeTabEl) return;
        state.homeTabEl.classList.toggle('loading', !!(state.homeLoading && state.activeId === null));
    }

    function extractPageTitle(root) {
        const scope = root || document;
        const selectors = [
            'span.text-page-title',
            '.c-text.o-font--page-title-bold.c-text--primary-color',
            '.c-text.o-font--page-title-medium.c-text--primary-color',
            '.PageHeadingContainer .Title .Text',
            '.EntityHeadingContainer .Title > .Text',
            'h1',
        ];
        for (const selector of selectors) {
            const el = scope.querySelector ? scope.querySelector(selector) : null;
            const text = (el && el.textContent ? el.textContent : '').replace(/\s+/g, ' ').trim();
            if (text) return text;
        }
        return '';
    }

    function extractTopLevelPageTitle() {
        return extractPageTitle(document);
    }

    function updateHomeTitleFromTopLevelPage(skipFrameCheck) {
        if (!state.showTabBarOnNonIframePages) return;
        if (!skipFrameCheck && findContentIframe()) return;
        const nativeTitle = homeTitleForNativeUrl(location.href);
        if (nativeTitle) {
            clearHomeLoading();
            syncUmbrellaContractHomeMetadata(location.href, document);
            scheduleUmbrellaContractHomeMetadataSync(location.href, document);
            if (hasPendingUmbrellaContractFrameReload()) {
                window.setTimeout(reloadLoadedFramesAfterUmbrellaContractWhenReady, 0);
            }
            return;
        }
        clearHomeMetadata();
        const title = extractTopLevelPageTitle();
        if (!title) return;
        clearHomeLoading();
        setHomeTitle(title);
    }

    function scheduleNonIframeTitleUpdate() {
        if (!state.showTabBarOnNonIframePages || state.nonIframeTitleRaf) return;
        state.nonIframeTitleRaf = window.requestAnimationFrame(function () {
            state.nonIframeTitleRaf = 0;
            updateHomeTitleFromTopLevelPage(true);
        });
    }

    function stopNonIframeTitleWatcher() {
        if (state.nonIframeTitleObserver) {
            state.nonIframeTitleObserver.disconnect();
            state.nonIframeTitleObserver = null;
        }
        if (state.nonIframeTitleRaf) {
            window.cancelAnimationFrame(state.nonIframeTitleRaf);
            state.nonIframeTitleRaf = 0;
        }
    }

    function ensureNonIframeTitleWatcher() {
        if (!state.showTabBarOnNonIframePages) {
            stopNonIframeTitleWatcher();
            return;
        }
        if (state.nonIframeTitleObserver) return;
        const root = findNonIframeContentContainer() || document.body || document.documentElement;
        if (!root) return;
        const observer = new MutationObserver(scheduleNonIframeTitleUpdate);
        observer.observe(root, {
            childList: true,
            subtree: true,
            characterData: true,
        });
        state.nonIframeTitleObserver = observer;
        scheduleNonIframeTitleUpdate();
    }

    function closeTabContextMenu() {
        if (!state.tabContextMenu) return;
        state.tabContextMenu.remove();
        state.tabContextMenu = null;
    }

    function clearTabDragIndicators() {
        state.dragOverTabId = null;
        state.dragInsertAfter = false;
        for (const tab of state.tabs) {
            if (!tab.tabEl) continue;
            tab.tabEl.classList.remove('drop-before', 'drop-after', 'dragging');
        }
    }

    function positionContextMenu(menu, x, y) {
        const margin = 8;
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';

        const rect = menu.getBoundingClientRect();
        const left = Math.min(Math.max(margin, x), window.innerWidth - rect.width - margin);
        const top = Math.min(Math.max(margin, y), window.innerHeight - rect.height - margin);
        menu.style.left = left + 'px';
        menu.style.top = top + 'px';
    }

    function createContextMenuIcon(svg) {
        const icon = document.createElement('span');
        icon.className = 'at-tabs-context-icon';
        appendIconMarkup(icon, svg);
        return icon;
    }

    function createContextMenuItem(labelText, svg, onClick) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'at-tabs-context-item';
        button.setAttribute('role', 'menuitem');
        button.appendChild(createContextMenuIcon(svg));
        const label = document.createElement('span');
        label.className = 'at-tabs-context-label';
        label.textContent = labelText;
        button.appendChild(label);
        if (typeof onClick === 'function') {
            button.addEventListener('click', function () {
                onClick();
            });
        }
        return button;
    }

    function createContextMenuDivider() {
        const divider = document.createElement('div');
        divider.className = 'at-tabs-context-divider';
        return divider;
    }

    function createTabColorSubmenu(tab) {
        const trigger = document.createElement('div');
        trigger.className = 'at-tabs-context-item at-tabs-context-submenu-trigger';
        trigger.setAttribute('role', 'menuitem');
        trigger.setAttribute('aria-haspopup', 'menu');
        trigger.tabIndex = 0;
        trigger.appendChild(createContextMenuIcon(ICONS.colorTab));

        const label = document.createElement('span');
        label.className = 'at-tabs-context-label';
        label.textContent = 'Color tab';
        trigger.appendChild(label);

        const arrow = document.createElement('span');
        arrow.className = 'at-tabs-context-submenu-arrow';
        arrow.textContent = '›';
        trigger.appendChild(arrow);

        const submenu = document.createElement('div');
        submenu.className = 'at-tabs-context-submenu';
        submenu.setAttribute('role', 'menu');

        const palette = document.createElement('div');
        palette.className = 'at-tabs-context-colors';
        for (const color of TAB_COLOR_PRESETS) {
            const swatch = document.createElement('button');
            swatch.type = 'button';
            swatch.className = 'at-tabs-color-swatch' + (tab.color === color ? ' selected' : '');
            swatch.title = color;
            swatch.style.setProperty('--autotasktabs-swatch', color);
            swatch.setAttribute('aria-label', 'Set tab color ' + color);
            swatch.addEventListener('click', function (event) {
                event.stopPropagation();
                closeTabContextMenu();
                setTabColor(tab.id, color);
            });
            palette.appendChild(swatch);
        }
        submenu.appendChild(palette);
        submenu.appendChild(createContextMenuDivider());
        submenu.appendChild(createContextMenuItem(
            'Clear tab color',
            ICONS.clearColor,
            function () {
                closeTabContextMenu();
                setTabColor(tab.id, '');
            }
        ));

        trigger.appendChild(submenu);
        return trigger;
    }

    function positionContextSubmenus(menu) {
        const submenus = menu.querySelectorAll('.at-tabs-context-submenu');
        submenus.forEach(function (submenu) {
            submenu.classList.remove('open-left');
            const parent = submenu.parentElement;
            if (!parent) return;
            const parentRect = parent.getBoundingClientRect();
            const submenuWidth = submenu.offsetWidth || 188;
            if (parentRect.right + submenuWidth + 14 > window.innerWidth) {
                submenu.classList.add('open-left');
            }
        });
    }

    function pinTab(tabId, pinned) {
        const tab = tabById(tabId);
        if (!tab || tab.pinned === !!pinned) return;
        tab.pinned = !!pinned;

        const without = state.tabs.filter(function (candidate) {
            return candidate.id !== tab.id;
        });
        if (tab.pinned) {
            const firstUnpinnedIndex = without.findIndex(function (candidate) {
                return !candidate.pinned;
            });
            const insertIndex = firstUnpinnedIndex === -1 ? without.length : firstUnpinnedIndex;
            without.splice(insertIndex, 0, tab);
        } else {
            without.push(tab);
        }
        state.tabs = without;
        renderTabs();
        syncTabPaneState();
        updateLoaderVisibility();
        ensureActiveTabVisible();
        updateTabScrollButtons();
        saveTabs();
    }

    function setTabColor(tabId, color) {
        const tab = tabById(tabId);
        if (!tab) return;
        const nextColor = TAB_COLOR_PRESETS.includes(color) ? color : '';
        const pair = normalizeSplitPairIds(state.splitPairIds);
        if (pair && pair.includes(tabId)) {
            state.splitPairColor = nextColor;
            for (const pairId of pair) {
                const pairTab = tabById(pairId);
                if (!pairTab) continue;
                pairTab.color = nextColor;
                updateTabEl(pairTab);
            }
            syncTabPaneState();
            saveTabs();
            return;
        }
        tab.color = nextColor;
        updateTabEl(tab);
        saveTabs();
    }

    function reorderTabs(draggedId, targetId, insertAfter) {
        if (draggedId === targetId) return false;
        const dragged = tabById(draggedId);
        const target = tabById(targetId);
        if (!dragged || !target) return false;

        const withoutDragged = state.tabs.filter(function (tab) {
            return tab.id !== draggedId;
        });

        let insertIndex = withoutDragged.length;
        if (dragged.pinned) {
            if (target.pinned) {
                insertIndex = withoutDragged.findIndex(function (tab) { return tab.id === targetId; });
                if (insertIndex === -1) insertIndex = withoutDragged.length;
                if (insertAfter) insertIndex += 1;
            } else {
                const lastPinnedIndex = withoutDragged.reduce(function (acc, tab, index) {
                    return tab.pinned ? index : acc;
                }, -1);
                insertIndex = lastPinnedIndex + 1;
            }
        } else {
            const firstUnpinnedIndex = withoutDragged.findIndex(function (tab) { return !tab.pinned; });
            if (!target.pinned) {
                insertIndex = withoutDragged.findIndex(function (tab) { return tab.id === targetId; });
                if (insertIndex === -1) {
                    insertIndex = firstUnpinnedIndex === -1 ? withoutDragged.length : firstUnpinnedIndex;
                } else if (insertAfter) {
                    insertIndex += 1;
                }
            } else {
                insertIndex = firstUnpinnedIndex === -1 ? withoutDragged.length : firstUnpinnedIndex;
            }
        }

        if (insertIndex < 0) insertIndex = 0;
        if (insertIndex > withoutDragged.length) insertIndex = withoutDragged.length;
        withoutDragged.splice(insertIndex, 0, dragged);
        state.tabs = withoutDragged;
        const splitPair = normalizeSplitPairIds(state.splitPairIds);
        if (splitPair) {
            const orderedSplitPair = state.tabs
                .map(function (tab) { return tab.id; })
                .filter(function (id) { return splitPair.includes(id); });
            state.splitPairIds = orderedSplitPair.length >= 2 ? orderedSplitPair : null;
            if (!state.splitPairIds) {
                state.splitId = null;
                state.splitPairColor = '';
            } else if (state.activeId !== null && state.splitPairIds.includes(state.activeId)) {
                state.splitId = state.splitPairIds.find(function (id) { return id !== state.activeId; }) || null;
            }
            state.splitRatios = state.splitPairIds ? normalizeSplitRatios(state.splitRatios, state.splitPairIds.length) : [];
        }
        renderTabs();
        syncTabPaneState();
        updateLoaderVisibility();
        ensureActiveTabVisible();
        updateTabScrollButtons();
        saveTabs();
        return true;
    }

    function openTabContextMenu(tab, x, y) {
        closeTabContextMenu();
        prewarmPeek(tab);

        const menu = document.createElement('div');
        menu.className = 'at-tabs-context-menu';
        menu.setAttribute('role', 'menu');

        const refreshButton = createContextMenuItem(
            'Refresh tab',
            ICONS.refresh,
            function () {
                closeTabContextMenu();
                refreshTabIframe(tab);
            }
        );

        const splitButton = createContextMenuItem(
            '',
            ICONS.split
        );
        const label = splitButton.querySelector('.at-tabs-context-label');

        const currentSplitGroup = getSplitGroupIds();
        if (currentSplitGroup.includes(tab.id)) {
            label.textContent = 'Close split screen';
            splitButton.addEventListener('click', function () {
                closeTabContextMenu();
                disableSplitScreen();
            });
        } else if (state.splitId !== null && tab.id === state.activeId) {
            label.textContent = 'Close split screen';
            splitButton.addEventListener('click', function () {
                closeTabContextMenu();
                disableSplitScreen();
            });
        } else {
            const group = getSplitGroupIds();
            const addingToExistingSplit = splitGroupIncludesActive(group) && group.length >= 2;
            label.textContent = addingToExistingSplit ? 'Add tab to split' : 'Open in split screen';
            const canSplit = canAddTabToSplit(tab.id);
            splitButton.disabled = !canSplit;
            splitButton.title = canSplit
                ? ''
                : (addingToExistingSplit && group.length >= 4
                    ? 'A split can contain up to 4 tabs.'
                    : 'Open another custom tab first, then split this tab beside it.');
            splitButton.addEventListener('click', function () {
                if (splitButton.disabled) return;
                closeTabContextMenu();
                enableSplitScreen(tab.id);
            });
        }

        const pinButton = createContextMenuItem(
            tab.pinned ? 'Unpin tab' : 'Pin tab',
            ICONS.pin,
            function () {
                closeTabContextMenu();
                pinTab(tab.id, !tab.pinned);
            }
        );

        menu.appendChild(refreshButton);
        menu.appendChild(splitButton);
        if (normalizeSplitPairIds(state.splitPairIds) && state.splitPairIds.includes(tab.id)) {
            menu.appendChild(createContextMenuItem(
                'Detach tab',
                ICONS.split,
                function () {
                    closeTabContextMenu();
                    detachSplitTab(tab.id);
                }
            ));
        }
        menu.appendChild(pinButton);
        menu.appendChild(createContextMenuDivider());
        menu.appendChild(createTabColorSubmenu(tab));

        // --- Tab actions: duplicate (any tab) + copy helpers (ticket tabs) ---
        menu.appendChild(createContextMenuDivider());

        const duplicateButton = createContextMenuItem(
            'Duplicate tab',
            ICONS.duplicate,
            function () {
                closeTabContextMenu();
                duplicateTab(tab);
            }
        );
        menu.appendChild(duplicateButton);
        menu.appendChild(createContextMenuItem(
            'Copy link',
            ICONS.copy,
            function () {
                closeTabContextMenu();
                copyTabLink(tab);
            }
        ));

        const peekButton = createContextMenuItem(
            'Peek',
            ICONS.peek,
            function () {
                closeTabContextMenu();
                openPeekModal(tab, { allowOpenInTab: true });
            }
        );
        menu.appendChild(peekButton);

        document.body.appendChild(menu);
        state.tabContextMenu = menu;
        positionContextMenu(menu, x, y);
        positionContextSubmenus(menu);
    }

    function installTabContextMenuDismissal() {
        document.addEventListener('pointerdown', function (event) {
            if (!state.tabContextMenu || state.tabContextMenu.contains(event.target)) return;
            closeTabContextMenu();
        }, true);
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                closeTabContextMenu();
                if (state.peekBackdrop) closePeekModal();
                hideHoverCard(true);
            }
        }, true);
        window.addEventListener('resize', function () {
            closeTabContextMenu();
            hideHoverCard(true);
        }, { passive: true });
        window.addEventListener('blur', function () {
            closeTabContextMenu();
            hideHoverCard(true);
        });
    }

    function buildTabEl(tab) {
        const el = document.createElement('div');
        el.className = 'at-tab' + (tab.id === state.activeId ? ' active' : '') + (tab.pinned ? ' pinned' : '');
        // No `title` attribute — the custom hover preview card replaces the
        // native browser tooltip (which was double-rendering on top of it).
        el.draggable = true;
        el.dataset.tabId = String(tab.id);

        const pinBadge = document.createElement('span');
        pinBadge.className = 'pin-badge';
        appendIconMarkup(pinBadge, ICONS.pin);
        el.appendChild(pinBadge);

        const icon = document.createElement('span');
        icon.className = 'icon';
        appendIconMarkup(icon, ICONS[tabIconKey(tab)] || ICONS.ticket);
        el.appendChild(icon);

        const meta = document.createElement('div');
        meta.className = 'meta';

        const title = document.createElement('div');
        title.className = 'line title';
        updateTabTitleEl(title, tab);

        const number = document.createElement('div');
        number.className = 'line number';
        number.textContent = tabLineValue(tab, 2);
        applyTabLineStyle(number, tab, 2);

        const contact = document.createElement('div');
        contact.className = 'line contact';
        contact.textContent = tabLineValue(tab, 3);
        applyTabLineStyle(contact, tab, 3);

        function closeTabOnMiddleClick(ev) {
            if (!ev || ev.button !== 1) return;
            ev.preventDefault();
            ev.stopPropagation();
            hideHoverCard(true);
            closeTab(tab.id);
        }

        meta.appendChild(title);
        meta.appendChild(number);
        meta.appendChild(contact);

        const close = document.createElement('span');
        close.className = 'close';
        close.textContent = '×';
        close.title = 'Close tab';
        close.addEventListener('click', function (ev) {
            ev.stopPropagation();
            closeTab(tab.id);
        });

        const resource = document.createElement('span');
        resource.className = 'resource-badge';
        updateTabResourceEl(resource, tab);

        const warning = document.createElement('span');
        warning.className = 'tab-warning-badge';
        updateTabWarningEl(warning, tab);

        const actions = document.createElement('div');
        actions.className = 'tab-actions';
        actions.appendChild(close);
        actions.appendChild(resource);
        actions.appendChild(warning);

        el.appendChild(meta);
        el.appendChild(actions);
        el.addEventListener('mousedown', closeTabOnMiddleClick);
        el.addEventListener('click', function () { activateTab(tab.id); });
        el.addEventListener('contextmenu', function (ev) {
            ev.preventDefault();
            ev.stopPropagation();
            hideHoverCard(true);
            openTabContextMenu(tab, ev.clientX, ev.clientY);
        });
        el.addEventListener('mouseenter', function () {
            state.hoverAnchorHovered = true;
            scheduleHoverCard(tab, el);
            prewarmPeek(tab);
        });
        el.addEventListener('mouseleave', function () {
            state.hoverAnchorHovered = false;
            hideHoverCard(false);
        });
        el.addEventListener('dragstart', function (ev) {
            state.draggingTabId = tab.id;
            clearTabDragIndicators();
            hideHoverCard(true);
            el.classList.add('dragging');
            armDragSplitIndicator(tab.id);
            if (ev.dataTransfer) {
                ev.dataTransfer.effectAllowed = 'move';
                try { ev.dataTransfer.setData('text/plain', String(tab.id)); } catch (e) {}
            }
        });
        el.addEventListener('dragover', function (ev) {
            if (state.draggingTabId === null || state.draggingTabId === tab.id) return;
            ev.preventDefault();
            hideDragSplitPreview();
            if (ev.dataTransfer) ev.dataTransfer.dropEffect = 'move';
            const rect = el.getBoundingClientRect();
            const after = isVerticalBar()
                ? ev.clientY > rect.top + (rect.height / 2)
                : ev.clientX > rect.left + (rect.width / 2);
            state.dragOverTabId = tab.id;
            state.dragInsertAfter = after;
            for (const candidate of state.tabs) {
                if (!candidate.tabEl) continue;
                candidate.tabEl.classList.toggle('drop-before', candidate.id === tab.id && !after);
                candidate.tabEl.classList.toggle('drop-after', candidate.id === tab.id && after);
            }
        });
        el.addEventListener('drop', function (ev) {
            if (state.draggingTabId === null || state.draggingTabId === tab.id) return;
            ev.preventDefault();
            const draggedId = state.draggingTabId;
            const targetId = tab.id;
            const insertAfter = state.dragInsertAfter;
            state.draggingTabId = null;
            clearTabDragIndicators();
            disarmDragSplitIndicator();
            reorderTabs(draggedId, targetId, insertAfter);
        });
        el.addEventListener('dragend', function () {
            state.draggingTabId = null;
            clearTabDragIndicators();
            disarmDragSplitIndicator();
        });
        el.addEventListener('auxclick', closeTabOnMiddleClick);

        tab.tabEl = el;
        updateTabRowCount(tab);
        applyTabColorStyle(tab);
        return el;
    }

    function renderTabs() {
        state.bar.replaceChildren();
        state.tabScroll = null;
        clearTabDragIndicators();

        const scrollWrap = document.createElement('div');
        scrollWrap.className = 'at-tabs-scroll-wrap';

        const scroll = document.createElement('div');
        scroll.className = 'at-tabs-scroll';
        state.tabScroll = scroll;

        const inner = document.createElement('div');
        inner.className = 'at-tabs-bar-inner';
        inner.appendChild(state.homeTabEl);
        for (const tab of state.tabs) {
            tab.tabEl = buildTabEl(tab);
            inner.appendChild(tab.tabEl);
        }
        scroll.appendChild(inner);

        const leftButton = createScrollButton('left');
        const rightButton = createScrollButton('right');
        state.scrollLeftButton = leftButton;
        state.scrollRightButton = rightButton;

        scroll.addEventListener('scroll', updateTabScrollButtons, { passive: true });
        scrollWrap.appendChild(scroll);
        scrollWrap.appendChild(leftButton);
        scrollWrap.appendChild(rightButton);

        state.bar.appendChild(scrollWrap);
        state.closedTabsButton = createClosedTabsButton();
        state.tabBarCollapseButton = createTabBarCollapseButton();
        const actionBar = document.createElement('div');
        actionBar.className = 'at-tabs-bar-actions';
        actionBar.appendChild(state.closedTabsButton);
        actionBar.appendChild(state.tabBarCollapseButton);
        state.bar.appendChild(actionBar);
        state.bar.appendChild(createResizeHandle());
        updateClosedTabsButton();
        syncTabPaneState();
        updateHomeTabActive();
        updateResizableBarClasses();
        window.requestAnimationFrame(function () {
            ensureActiveTabVisible();
            updateTabScrollButtons();
        });
    }

    function createResizeHandle() {
        const handle = document.createElement('div');
        handle.className = 'at-tabs-resize-handle';
        handle.title = 'Resize tab bar';
        handle.addEventListener('mousedown', startTabBarResize);
        handle.addEventListener('pointerdown', startTabBarResize);
        handle.addEventListener('mouseenter', function () {
            state.tabBarResizeHandleHovered = true;
            cancelTabBarExpandTimer();
        });
        handle.addEventListener('mouseleave', function () {
            state.tabBarResizeHandleHovered = false;
            if (state.bar && state.bar.matches(':hover')) {
                scheduleTabBarHoverExpand();
            }
        });
        handle.addEventListener('click', function (event) {
            event.stopPropagation();
        });
        return handle;
    }

    function createTabBarCollapseButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'at-tabs-collapse-button';
        appendIconMarkup(button, faIcon('fa-chevron-left fa-solid'));
        button.addEventListener('click', toggleVerticalTabBarCollapse);
        return button;
    }

    function createClosedTabsButton() {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'at-tabs-reopen-button';
        appendIconMarkup(button, ICONS.restoreClosed);
        button.addEventListener('click', reopenClosedTab);
        return button;
    }

    function startTabBarResize(event) {
        if (!state.resizableTabBarEnabled || !isVerticalBar() || !state.bar) return;
        if (state.tabBarResizing) return;
        if (event.type === 'mousedown' && event.button !== 0) return;
        if (event.type === 'pointerdown' && event.button !== 0) return;
        event.preventDefault();
        event.stopPropagation();
        if (event.stopImmediatePropagation) event.stopImmediatePropagation();
        hideHoverCard(true);
        cancelTabBarExpandTimer();
        state.tabBarResizing = true;
        state.tabBarHoverExpanded = false;
        updateResizableBarClasses();

        const barRect = state.bar.getBoundingClientRect();
        const pointerId = event.pointerId;
        if (event.type === 'pointerdown' && event.currentTarget.setPointerCapture && pointerId !== undefined) {
            try { event.currentTarget.setPointerCapture(pointerId); } catch (e) {}
        }
        const move = function (moveEvent) {
            const nextWidth = normalizedTabBarWidth(moveEvent.clientX - barRect.left);
            state.tabBarWidth = nextWidth;
            AUTOTASKTABS.state.tabBarWidth = nextWidth;
            updateResizableBarClasses();
            requestSyncGeometry();
        };
        const stop = function () {
            document.removeEventListener('mousemove', move, true);
            document.removeEventListener('mouseup', stop, true);
            document.removeEventListener('pointermove', move, true);
            document.removeEventListener('pointerup', stop, true);
            document.removeEventListener('pointercancel', stop, true);
            state.tabBarResizing = false;
            state.tabBarHoverExpanded = false;
            cancelTabBarExpandTimer();
            updateResizableBarClasses();
            void AUTOTASKTABS.saveSettings();
        };
        if (event.type === 'pointerdown') {
            document.addEventListener('pointermove', move, true);
            document.addEventListener('pointerup', stop, true);
            document.addEventListener('pointercancel', stop, true);
        } else {
            document.addEventListener('mousemove', move, true);
            document.addEventListener('mouseup', stop, true);
        }
    }

    function createScrollButton(direction) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'at-tabs-scroll-button ' + direction;
        button.title = direction === 'left' ? 'Scroll tabs left' : 'Scroll tabs right';
        appendIconMarkup(button, direction === 'left'
            ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>'
            : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>');
        button.addEventListener('click', function (event) {
            event.stopPropagation();
            scrollTabs(direction === 'left' ? -1 : 1);
        });
        return button;
    }

    function scrollTabs(direction) {
        if (!state.tabScroll) return;
        if (isVerticalBar()) {
            const distance = Math.max(120, Math.floor(state.tabScroll.clientHeight * 0.65));
            state.tabScroll.scrollBy({ top: direction * distance, behavior: 'smooth' });
        } else {
            const distance = Math.max(180, Math.floor(state.tabScroll.clientWidth * 0.65));
            state.tabScroll.scrollBy({ left: direction * distance, behavior: 'smooth' });
        }
    }

    function updateTabScrollButtons() {
        if (!state.tabScroll || !state.scrollLeftButton || !state.scrollRightButton) return;
        if (isVerticalBar()) {
            const maxScroll = state.tabScroll.scrollHeight - state.tabScroll.clientHeight;
            const hasOverflow = maxScroll > 2;
            state.scrollLeftButton.classList.toggle('visible', hasOverflow && state.tabScroll.scrollTop > 2);
            state.scrollRightButton.classList.toggle('visible', hasOverflow && state.tabScroll.scrollTop < maxScroll - 2);
        } else {
            const maxScroll = state.tabScroll.scrollWidth - state.tabScroll.clientWidth;
            const hasOverflow = maxScroll > 2;
            state.scrollLeftButton.classList.toggle('visible', hasOverflow && state.tabScroll.scrollLeft > 2);
            state.scrollRightButton.classList.toggle('visible', hasOverflow && state.tabScroll.scrollLeft < maxScroll - 2);
        }
    }

    function ensureActiveTabVisible() {
        if (!state.tabScroll) return;
        const activeEl = state.activeId === null
            ? state.homeTabEl
            : state.tabs.find(tab => tab.id === state.activeId)?.tabEl;
        if (!activeEl) return;

        const scrollRect = state.tabScroll.getBoundingClientRect();
        const activeRect = activeEl.getBoundingClientRect();
        if (isVerticalBar()) {
            if (activeRect.top < scrollRect.top + 36) {
                state.tabScroll.scrollBy({ top: activeRect.top - scrollRect.top - 48, behavior: 'smooth' });
            } else if (activeRect.bottom > scrollRect.bottom - 36) {
                state.tabScroll.scrollBy({ top: activeRect.bottom - scrollRect.bottom + 48, behavior: 'smooth' });
            }
        } else {
            if (activeRect.left < scrollRect.left + 36) {
                state.tabScroll.scrollBy({ left: activeRect.left - scrollRect.left - 48, behavior: 'smooth' });
            } else if (activeRect.right > scrollRect.right - 36) {
                state.tabScroll.scrollBy({ left: activeRect.right - scrollRect.right + 48, behavior: 'smooth' });
            }
        }
    }

    function frameBrowserTitle(tab) {
        try {
            const doc = tab && tab.iframeEl && tab.iframeEl.contentDocument;
            const title = doc && typeof doc.title === 'string' ? doc.title.trim() : '';
            return title || '';
        } catch (e) {
            return '';
        }
    }

    function browserLikeTitleForTab(tab) {
        const liveTitle = frameBrowserTitle(tab);
        if (liveTitle) {
            tab.browserTitle = liveTitle;
            return liveTitle;
        }
        const savedTitle = String(tab && tab.browserTitle || '').trim();
        if (savedTitle) return savedTitle;
        const fallback = fallbackTabMetadataForUrl(tab && tab.url || '');
        return String(fallback && fallback.title || '').trim();
    }

    function refreshBrowserLikeTitlesFromFrames() {
        state.tabs.forEach(function (tab) {
            const liveTitle = frameBrowserTitle(tab);
            if (liveTitle) tab.browserTitle = liveTitle;
            updateTabEl(tab);
        });
    }

    function updateTabTitleEl(titleEl, tab) {
        titleEl.textContent = '';
        const browserTitle = browserLikeTitleForTab(tab);
        const enhancedTitle = String(tab.title || '').trim();
        const displayTitle = state.horizontalCompactTabsEnabled
            ? browserTitle
            : enhancedTitle;
        titleEl.classList.toggle('loading', !!tab.loading && !displayTitle);
        if (displayTitle) {
            titleEl.textContent = displayTitle;
            return;
        }

        if (tab.loading) {
            const spinner = document.createElement('span');
            spinner.className = 'at-tab-title-spinner';
            spinner.setAttribute('aria-label', 'Loading');
            titleEl.appendChild(spinner);
        }
    }

    function applyTabColorStyle(tab) {
        if (!tab || !tab.tabEl) return;
        tab.tabEl.classList.toggle('pinned', !!tab.pinned);
        const ownColor = TAB_COLOR_PRESETS.includes(tab.color) ? tab.color : '';
        const sharedColor = TAB_COLOR_PRESETS.includes(tab.splitSharedColor) ? tab.splitSharedColor : '';
        const color = ownColor || sharedColor;
        if (!color) {
            tab.tabEl.dataset.autotasktabsColored = 'false';
            tab.tabEl.style.removeProperty('--autotasktabs-tab-border');
            tab.tabEl.style.removeProperty('--autotasktabs-tab-bg-idle');
            tab.tabEl.style.removeProperty('--autotasktabs-tab-bg-hover');
            tab.tabEl.style.removeProperty('--autotasktabs-tab-bg-active');
            tab.tabEl.style.removeProperty('--autotasktabs-tab-split-bg');
            tab.tabEl.style.removeProperty('--autotasktabs-tab-split-border');
            tab.tabEl.style.removeProperty('--autotasktabs-tab-split-ring');
            return;
        }

        const dark = document.documentElement.classList.contains('autotasktabs-dark');
        const splitColor = sharedColor || color;
        tab.tabEl.dataset.autotasktabsColored = 'true';
        tab.tabEl.style.setProperty('--autotasktabs-tab-border', splitColor);
        tab.tabEl.style.setProperty('--autotasktabs-tab-bg-idle', colorToRgba(splitColor, dark ? 0.18 : 0.14));
        tab.tabEl.style.setProperty('--autotasktabs-tab-bg-hover', colorToRgba(splitColor, dark ? 0.26 : 0.2));
        tab.tabEl.style.setProperty('--autotasktabs-tab-bg-active', colorToRgba(splitColor, dark ? 0.34 : 0.28));
        tab.tabEl.style.setProperty('--autotasktabs-tab-split-bg', colorToRgba(splitColor, dark ? 0.22 : 0.18));
        tab.tabEl.style.setProperty('--autotasktabs-tab-split-border', colorToRgba(splitColor, dark ? 0.7 : 0.62));
        tab.tabEl.style.setProperty('--autotasktabs-tab-split-ring', colorToRgba(splitColor, dark ? 0.34 : 0.28));
    }

    function isTransparentColor(value) {
        return !value ||
            value === 'transparent' ||
            /^rgba\([^)]*,\s*0(?:\.0+)?\)$/i.test(String(value).trim());
    }

    function updateTabResourceEl(resourceEl, tab) {
        if (!resourceEl) return;

        const resource = tab.primaryResource || null;
        const photoUrl = resource && typeof resource.photoUrl === 'string'
            ? resource.photoUrl.trim()
            : '';
        const initials = resource && typeof resource.initials === 'string'
            ? resource.initials.trim().slice(0, 4)
            : '';
        const tabType = tabTypeForUrl(tab.url);
        const shouldShow = (tabType === 'ticket' || tabType === 'opportunity') && !!(initials || photoUrl);

        resourceEl.className = 'resource-badge';
        resourceEl.textContent = shouldShow && !photoUrl ? initials : '';
        resourceEl.title = shouldShow
            ? (resource.name ? 'Primary resource: ' + resource.name : 'Primary resource')
            : '';
        resourceEl.dataset.colorClass = shouldShow && resource.colorClass ? resource.colorClass : '';
        resourceEl.style.removeProperty('background-image');
        resourceEl.style.removeProperty('background-color');
        resourceEl.style.removeProperty('color');
        resourceEl.style.removeProperty('border-color');

        if (!shouldShow) return;

        resourceEl.classList.add('visible');
        if (photoUrl) {
            resourceEl.classList.add('has-photo');
            resourceEl.style.backgroundImage = 'url("' + photoUrl.replace(/"/g, '\\"') + '")';
            return;
        }
        if (!isTransparentColor(resource.bgColor)) {
            resourceEl.style.backgroundColor = resource.bgColor;
        }
        if (!isTransparentColor(resource.textColor)) {
            resourceEl.style.color = resource.textColor;
        }
        if (!isTransparentColor(resource.borderColor)) {
            resourceEl.style.borderColor = resource.borderColor;
        }
    }

    function updateTabWarningEl(warningEl, tab) {
        if (!warningEl) return;
        warningEl.className = 'tab-warning-badge';
        warningEl.replaceChildren();
        warningEl.title = '';
        const tabType = tab ? tabTypeForUrl(tab.url) : '';
        const isInactiveProduct = !!(tab && tabType === 'product' &&
            String(tab.metadataFields && tab.metadataFields.productInactive || '').trim() === 'true');
        if (!tab || (!tab.pageWarning && !isInactiveProduct)) return;
        warningEl.classList.add('visible');
        if (isInactiveProduct) {
            warningEl.classList.add('product-inactive-warning');
            warningEl.title = 'Inactive product';
            appendIconMarkup(warningEl, '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18.4A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.6L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>');
        } else if (tabType === 'contract') {
            warningEl.classList.add('contract-warning');
            warningEl.title = 'Contract needs attention';
            appendIconMarkup(warningEl, '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.15" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.8v5.2"/><path d="M12 16.8h.01"/></svg>');
        } else {
            warningEl.title = 'Page warning';
            appendIconMarkup(warningEl, '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 9v4"/><path d="M12 17h.01"/><path d="M10.3 3.9 1.8 18.4A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.6L13.7 3.9a2 2 0 0 0-3.4 0Z"/></svg>');
        }
    }

    function updateTabEl(tab) {
        if (!tab.tabEl) return;
        const t = tab.tabEl.querySelector('.line.title');
        const n = tab.tabEl.querySelector('.line.number');
        const c = tab.tabEl.querySelector('.line.contact');
        const r = tab.tabEl.querySelector('.resource-badge');
        const w = tab.tabEl.querySelector('.tab-warning-badge');
        if (t) updateTabTitleEl(t, tab);
        if (n) {
            n.textContent = tabLineValue(tab, 2);
            applyTabLineStyle(n, tab, 2);
        }
        if (c) {
            c.textContent = tabLineValue(tab, 3);
            applyTabLineStyle(c, tab, 3);
        }
        if (r) updateTabResourceEl(r, tab);
        if (w) updateTabWarningEl(w, tab);
        updateTabRowCount(tab);
        applyTabColorStyle(tab);
    }

    function updateHomeTabActive() {
        if (!state.homeTabEl) return;
        state.homeTabEl.classList.toggle('active', state.activeId === null);
        state.homeTabEl.classList.toggle('split-member', false);
        updateHomeLoadingIndicator();
        ensureActiveTabVisible();
        updateTabScrollButtons();
    }

    const AUTOTASKTABS_MODAL_EXIT_MS = 260;

    function prefersReducedMotion() {
        return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }

    function closeSettingsModal(immediate) {
        if (state.settingsClosing) return;
        if (immediate || prefersReducedMotion()) {
            if (state.settingsModal) {
                state.settingsModal.remove();
                state.settingsModal = null;
            }
            if (state.settingsBackdrop) {
                state.settingsBackdrop.remove();
                state.settingsBackdrop = null;
            }
            state.settingsClosing = false;
            return;
        }
        if (!state.settingsModal && !state.settingsBackdrop) return;
        state.settingsClosing = true;
        if (state.settingsModal) state.settingsModal.classList.add('closing');
        if (state.settingsBackdrop) state.settingsBackdrop.classList.add('closing');
        window.setTimeout(function () {
            if (state.settingsModal) {
                state.settingsModal.remove();
                state.settingsModal = null;
            }
            if (state.settingsBackdrop) {
                state.settingsBackdrop.remove();
                state.settingsBackdrop = null;
            }
            state.settingsClosing = false;
        }, AUTOTASKTABS_MODAL_EXIT_MS);
    }

    const SETTING_INFO_SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';

    function createSettingInfo(text) {
        const span = document.createElement('span');
        span.className = 'at-tabs-setting-info';
        span.title = text;
        span.setAttribute('aria-label', text);
        span.setAttribute('role', 'img');
        appendIconMarkup(span, SETTING_INFO_SVG);
        return span;
    }

    const settingsUi = AUTOTASKTABS.SettingsUi || {};

    function createSettingsToggleRow(config) {
        return settingsUi.createToggleRow(Object.assign({ createInfo: createSettingInfo }, config));
    }

    function createSettingsSelectRow(config) {
        return settingsUi.createSelectRow(Object.assign({ createInfo: createSettingInfo }, config));
    }

    function createSettingsFooterButton(config) {
        return settingsUi.createFooterButton(config);
    }

    function defaultSettingsState() {
        return {
            extensionEnabled: true,
            rememberTabsAfterClose: true,
            openNewTabsAtStart: false,
            phoneLinksEnabled: true,
            ticketLinksEnabled: true,
            themePreference: 'auto',
            barOrientation: 'horizontal',
            showTabBarOnNonIframePages: true,
            resizableTabBarEnabled: true,
            horizontalCompactTabsEnabled: false,
            roundedPageFramesEnabled: DEFAULT_ROUNDED_PAGE_FRAMES_ENABLED,
            experimentalUmbrellaContractFrameTabs: false,
            improvedScrollbarsEnabled: true,
            skipPeekBackdropCloseWarning: false,
            peekMoveResizeEnabled: true,
            tabLine2Fields: defaultTabLineSettings(2),
            tabLine3Fields: defaultTabLineSettings(3),
            tabBarWidth: AUTOTASKTABS.BAR_W || 240,
        };
    }

    function openSettingsModal() {
        if (state.settingsModal || state.settingsClosing) return;

        const backdrop = document.createElement('div');
        backdrop.className = 'at-tabs-settings-backdrop';
        backdrop.addEventListener('click', closeSettingsModal);

        const modal = document.createElement('div');
        modal.className = 'at-tabs-settings-modal';

        const header = document.createElement('div');
        header.className = 'at-tabs-settings-header';

        const title = document.createElement('div');
        title.className = 'at-tabs-settings-title';
        title.textContent = 'AUTOTASKTABS: Tabs for Autotask - Settings';

        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'at-tabs-settings-close';
        close.textContent = '×';
        close.title = 'Close settings';
        close.addEventListener('click', closeSettingsModal);

        header.appendChild(title);
        header.appendChild(close);

        const body = document.createElement('div');
        body.className = 'at-tabs-settings-body';

        const generalSection = document.createElement('div');
        generalSection.className = 'at-tabs-settings-section';

        const enabledReloadNote = document.createElement('div');
        enabledReloadNote.className = 'at-tabs-setting-reload-note';
        const enabledReloadText = document.createElement('span');
        enabledReloadText.textContent = 'Refresh this browser tab to fully apply the extension enable/disable change.';
        const enabledReloadButton = document.createElement('button');
        enabledReloadButton.type = 'button';
        enabledReloadButton.className = 'at-tabs-setting-reload-button';
        enabledReloadButton.textContent = 'Refresh now';
        enabledReloadButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            void AUTOTASKTABS.saveSettings().then(function () {
                window.location.reload();
            });
        });
        enabledReloadNote.appendChild(enabledReloadText);
        enabledReloadNote.appendChild(enabledReloadButton);

        const enabledControl = createSettingsToggleRow({
            name: 'Enable AUTOTASKTABS: Tabs for Autotask',
            info: 'Turn AUTOTASKTABS features on or off. Refresh Autotask after changing this.',
            checked: featuresEnabled(),
            onChange: function (input) {
                state.extensionEnabled = input.checked;
                applyExtensionEnabledState();
                enabledReloadNote.classList.add('visible');
                void AUTOTASKTABS.saveSettings();
            }
        });
        const enabledRow = enabledControl.row;
        const enabledInput = enabledControl.input;

        const roundedPageFramesControl = createSettingsToggleRow({
            name: 'Rounded page frames',
            info: 'Give Autotask pages softer rounded corners inside AUTOTASKTABS.',
            checked: !!state.roundedPageFramesEnabled,
            onChange: function (input) {
                state.roundedPageFramesEnabled = input.checked;
                AUTOTASKTABS.state.roundedPageFramesEnabled = input.checked;
                applyPageFrameClass();
                requestSyncGeometry();
                void AUTOTASKTABS.saveSettings();
            }
        });
        const roundedPageFramesRow = roundedPageFramesControl.row;
        const roundedPageFramesInput = roundedPageFramesControl.input;
        if (IS_FIREFOX_BROWSER) {
            const roundedPageFramesWarning = document.createElement('span');
            roundedPageFramesWarning.className = 'at-tabs-setting-description at-tabs-setting-warning-inline';
            roundedPageFramesWarning.textContent = 'Firefox only: This setting may cause content to appear blurry on ultrawide screens.';
            roundedPageFramesControl.label.classList.add('has-description');
            roundedPageFramesControl.label.appendChild(roundedPageFramesWarning);
        }

        const improvedScrollbarsControl = createSettingsToggleRow({
            name: 'Improved scrollbars',
            info: 'Use thinner scrollbars.',
            checked: !!state.improvedScrollbarsEnabled,
            onChange: function (input) {
                state.improvedScrollbarsEnabled = input.checked;
                AUTOTASKTABS.state.improvedScrollbarsEnabled = input.checked;
                syncImprovedScrollbarsState();
                void AUTOTASKTABS.saveSettings();
            }
        });
        const improvedScrollbarsRow = improvedScrollbarsControl.row;
        const improvedScrollbarsInput = improvedScrollbarsControl.input;

        const phoneControl = createSettingsToggleRow({
            name: 'Clickable phone numbers',
            info: 'Turn detected phone numbers into clickable call links.',
            checked: !!state.phoneLinksEnabled,
            onChange: function (input) {
                state.phoneLinksEnabled = input.checked;
                AUTOTASKTABS.state.phoneLinksEnabled = input.checked;
                if (AUTOTASKTABS.setPhoneLinksEnabled) AUTOTASKTABS.setPhoneLinksEnabled(input.checked);
                void AUTOTASKTABS.saveSettings();
            }
        });
        const phoneRow = phoneControl.row;
        const phoneInput = phoneControl.input;

        const ticketControl = createSettingsToggleRow({
            name: 'Clickable ticket numbers',
            info: 'Turn ticket numbers (e.g. T20240501.0001) into links that open the ticket in an AUTOTASKTABS tab.',
            checked: !!state.ticketLinksEnabled,
            onChange: function (input) {
                state.ticketLinksEnabled = input.checked;
                AUTOTASKTABS.state.ticketLinksEnabled = input.checked;
                if (AUTOTASKTABS.setTicketLinksEnabled) AUTOTASKTABS.setTicketLinksEnabled(input.checked);
                void AUTOTASKTABS.saveSettings();
            }
        });
        const ticketRow = ticketControl.row;
        const ticketInput = ticketControl.input;

        // Tabbar section --------------------------------------------------
        const section = document.createElement('div');
        section.className = 'at-tabs-settings-section';

        // Tab bar location row (horizontal/vertical).
        function currentTabBarLocationValue() {
            if (state.barOrientation === 'vertical') return 'vertical-left';
            return 'horizontal';
        }

        const orientationControl = createSettingsSelectRow({
            name: 'Tab bar location',
            info: 'Choose whether tabs appear above Autotask or in a side bar.',
            value: currentTabBarLocationValue(),
            options: [
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical-left', label: 'Vertical (Left)' },
                { value: 'vertical-right', label: 'Vertical (Right, coming soon)', disabled: true },
            ],
            onChange: function (select) {
                if (select.value === 'vertical-right') {
                    select.value = currentTabBarLocationValue();
                    return;
                }
                const nextOrientation = select.value === 'vertical-left' ? 'vertical' : 'horizontal';
                setBarOrientation(nextOrientation);
                updateResizableBarClasses();
                state.tabs.forEach(updateTabEl);
                updateHomeTabMetadata();
                updateCustomizationCompactState();
                requestSyncGeometry();
                saveTabs();
                void AUTOTASKTABS.saveSettings();
            }
        });
        const orientationRow = orientationControl.row;
        const orientationSelect = orientationControl.select;

        const sizeControl = createSettingsSelectRow({
            name: 'Tab size',
            info: 'Use Enhanced tabs for AUTOTASKTABS metadata or Browser-like tabs for slim page-title tabs.',
            value: state.horizontalCompactTabsEnabled ? 'compact' : 'default',
            options: [
                { value: 'default', label: 'Enhanced tabs' },
                { value: 'compact', label: 'Browser-like' },
            ],
            onChange: function (select) {
                const compact = select.value === 'compact';
                state.horizontalCompactTabsEnabled = compact;
                AUTOTASKTABS.state.horizontalCompactTabsEnabled = compact;
                updateResizableBarClasses();
                if (compact) refreshBrowserLikeTitlesFromFrames();
                else state.tabs.forEach(updateTabEl);
                updateHomeTabMetadata();
                updateCustomizationCompactState();
                tabSizeReloadNote.classList.add('visible');
                requestSyncGeometry();
                saveTabs();
                void AUTOTASKTABS.saveSettings();
            }
        });
        const sizeRow = sizeControl.row;
        const sizeSelect = sizeControl.select;
        const tabSizeReloadNote = document.createElement('div');
        tabSizeReloadNote.className = 'at-tabs-setting-reload-note';
        const tabSizeReloadText = document.createElement('span');
        tabSizeReloadText.textContent = 'Refresh this browser tab to apply the new tab size everywhere.';
        const tabSizeReloadButton = document.createElement('button');
        tabSizeReloadButton.type = 'button';
        tabSizeReloadButton.className = 'at-tabs-setting-reload-button';
        tabSizeReloadButton.textContent = 'Refresh now';
        tabSizeReloadButton.addEventListener('click', function (event) {
            event.preventDefault();
            event.stopPropagation();
            void AUTOTASKTABS.saveSettings().then(function () {
                window.location.reload();
            });
        });
        tabSizeReloadNote.appendChild(tabSizeReloadText);
        tabSizeReloadNote.appendChild(tabSizeReloadButton);

        const resizeControl = createSettingsToggleRow({
            name: 'Allow resizing of the vertical tab bar',
            info: 'Drag the edge of the vertical tab bar to change its width.',
            checked: !!state.resizableTabBarEnabled,
            onChange: function (input) {
                state.resizableTabBarEnabled = input.checked;
                AUTOTASKTABS.state.resizableTabBarEnabled = input.checked;
                updateResizableBarClasses();
                requestSyncGeometry();
                void AUTOTASKTABS.saveSettings();
            }
        });
        const resizeRow = resizeControl.row;
        const resizeInput = resizeControl.input;

        const hideControl = createSettingsToggleRow({
            name: 'Enable tab bar',
            info: 'Show or hide the AUTOTASKTABS tab bar.',
            checked: !state.shellHidden,
            onChange: function (input) {
                state.shellHidden = !input.checked;
                updateShellVisibility();
            }
        });
        const hideRow = hideControl.row;
        const hideInput = hideControl.input;

        const persistControl = createSettingsToggleRow({
            name: 'Remember tabs after closing browser',
            info: 'Reopen your AUTOTASKTABS tabs after closing and reopening the browser.',
            checked: state.rememberTabsAfterClose,
            onChange: function (input) {
                state.rememberTabsAfterClose = input.checked;
                void AUTOTASKTABS.saveSettings().then(function () {
                    return AUTOTASKTABS.syncTabsPersistenceMode(buildTabsPayload());
                });
            }
        });
        const persistRow = persistControl.row;
        const persistInput = persistControl.input;

        const openAtStartControl = createSettingsToggleRow({
            name: 'Open new tabs at the start',
            info: 'Place new tabs before existing unpinned tabs.',
            checked: !!state.openNewTabsAtStart,
            onChange: function (input) {
                state.openNewTabsAtStart = input.checked;
                AUTOTASKTABS.state.openNewTabsAtStart = input.checked;
                void AUTOTASKTABS.saveSettings();
            }
        });
        const openAtStartRow = openAtStartControl.row;
        const openAtStartInput = openAtStartControl.input;

        const everywhereControl = createSettingsToggleRow({
            name: 'Show tab bar on all Autotask pages',
            info: 'Keep the AUTOTASKTABS tab bar visible on pages Autotask opens outside frames.',
            checked: !!state.showTabBarOnNonIframePages,
            onChange: function (input) {
                state.showTabBarOnNonIframePages = input.checked;
                AUTOTASKTABS.state.showTabBarOnNonIframePages = input.checked;
                if (state.showTabBarOnNonIframePages) {
                    ensureNonIframeTitleWatcher();
                    scheduleNonIframeTitleUpdate();
                } else {
                    stopNonIframeTitleWatcher();
                }
                requestSyncGeometry();
                void AUTOTASKTABS.saveSettings();
            }
        });
        const everywhereRow = everywhereControl.row;
        const everywhereInput = everywhereControl.input;

        const peekConfirmControl = createSettingsToggleRow({
            name: 'Confirm before closing Peek by outside click',
            info: 'Ask before closing Peek by clicking outside the window.',
            checked: !state.skipPeekBackdropCloseWarning,
            onChange: function (input) {
                state.skipPeekBackdropCloseWarning = !input.checked;
                AUTOTASKTABS.state.skipPeekBackdropCloseWarning = state.skipPeekBackdropCloseWarning;
                void AUTOTASKTABS.saveSettings();
            }
        });
        const peekConfirmRow = peekConfirmControl.row;
        const peekConfirmInput = peekConfirmControl.input;

        const peekMoveResizeControl = createSettingsToggleRow({
            name: 'Allow resizing and moving of Peek windows',
            info: 'Let Peek windows be dragged and resized.',
            checked: !!state.peekMoveResizeEnabled,
            onChange: function (input) {
                state.peekMoveResizeEnabled = input.checked;
                AUTOTASKTABS.state.peekMoveResizeEnabled = input.checked;
                void AUTOTASKTABS.saveSettings();
            }
        });
        const peekMoveResizeRow = peekMoveResizeControl.row;
        const peekMoveResizeInput = peekMoveResizeControl.input;

        const showLocalUmbrellaContractExperiment = localUmbrellaContractFrameExperimentAvailable();
        let experimentalUmbrellaContractsRow = null;
        let experimentalUmbrellaContractsInput = null;
        if (showLocalUmbrellaContractExperiment) {
            const experimentalUmbrellaContractsControl = createSettingsToggleRow({
                name: 'Umbrella Contract iframe experiment',
                info: 'Local-only experiment: try opening Umbrella Contracts as AUTOTASKTABS tabs by removing Autotask frame-blocking headers only for that Umbrella Contract sub-frame route.',
                checked: !!state.experimentalUmbrellaContractFrameTabs,
                onChange: function (input) {
                    state.experimentalUmbrellaContractFrameTabs = input.checked;
                    AUTOTASKTABS.state.experimentalUmbrellaContractFrameTabs = input.checked;
                    void syncUmbrellaContractFrameRules(input.checked);
                    void AUTOTASKTABS.saveSettings();
                }
            });
            experimentalUmbrellaContractsRow = experimentalUmbrellaContractsControl.row;
            experimentalUmbrellaContractsInput = experimentalUmbrellaContractsControl.input;
        }

        const customizationSection = document.createElement('div');
        customizationSection.className = 'at-tabs-settings-section';

        const customizationHeader = document.createElement('div');
        customizationHeader.className = 'at-tabs-customization-header';
        customizationHeader.appendChild(document.createElement('span'));
        const customizationHeaderLines = document.createElement('span');
        customizationHeaderLines.className = 'at-tabs-customization-header-lines';
        ['Line 2', 'Line 3'].forEach(function (labelText, index) {
            const label = document.createElement('span');
            label.textContent = labelText;
            label.dataset.tabLineHeader = String(index + 2);
            customizationHeaderLines.appendChild(label);
        });
        customizationHeader.appendChild(customizationHeaderLines);
        customizationSection.appendChild(customizationHeader);

        function createLineSelect(type, line) {
            const select = document.createElement('select');
            select.className = 'at-tabs-setting-select';
            select.dataset.tabType = type;
            select.dataset.tabLine = String(line);
            const settings = line === 2 ? state.tabLine2Fields : state.tabLine3Fields;
            const lineOptions = getLineOptionsForType(type);
            const fallback = line === 2 ? getDefaultLineField(type, 'line2') : getDefaultLineField(type, 'line3');
            const currentValue = lineOptions.includes(settings[type]) ? settings[type] : fallback;
            lineOptions.forEach(function (value) {
                const optionEl = document.createElement('option');
                optionEl.value = value;
                optionEl.textContent = getCustomizationFieldOptionLabel(type, value);
                if (currentValue === value) optionEl.selected = true;
                select.appendChild(optionEl);
            });
            select.addEventListener('change', function () {
                if (line === 2) {
                    state.tabLine2Fields[type] = select.value;
                    AUTOTASKTABS.state.tabLine2Fields = state.tabLine2Fields;
                } else {
                    state.tabLine3Fields[type] = select.value;
                    AUTOTASKTABS.state.tabLine3Fields = state.tabLine3Fields;
                }
                state.tabs.forEach(updateTabEl);
                saveTabs();
                void AUTOTASKTABS.saveSettings();
            });
            return select;
        }

        function wrapSettingsSelect(select) {
            const selectWrap = document.createElement('span');
            selectWrap.className = 'at-tabs-setting-select-wrap';
            selectWrap.appendChild(select);
            return selectWrap;
        }

        function setCustomizationSelectValues(line2Fields, line3Fields) {
            customizationSection.querySelectorAll('select[data-tab-type][data-tab-line]').forEach(function (select) {
                const type = select.dataset.tabType;
                const line = select.dataset.tabLine === '2' ? 2 : 3;
                const fields = line === 2 ? line2Fields : line3Fields;
                const value = fields && fields[type];
                const fallback = getDefaultLineField(type, line);
                select.value = getLineOptionsForType(type).includes(value) ? value : fallback;
            });
        }

        function applyRecommendedCustomization() {
            const line2Fields = defaultTabLineSettings(2);
            const line3Fields = defaultTabLineSettings(3);
            CUSTOMIZABLE_TAB_TYPES.forEach(function (type) {
                const recommendation = TAB_LINE_RECOMMENDED_BY_TYPE[type] || {};
                if (getLineOptionsForType(type).includes(recommendation.line2)) {
                    line2Fields[type] = recommendation.line2;
                }
                if (getLineOptionsForType(type).includes(recommendation.line3)) {
                    line3Fields[type] = recommendation.line3;
                }
            });
            state.tabLine2Fields = line2Fields;
            state.tabLine3Fields = line3Fields;
            AUTOTASKTABS.state.tabLine2Fields = line2Fields;
            AUTOTASKTABS.state.tabLine3Fields = line3Fields;
            setCustomizationSelectValues(line2Fields, line3Fields);
            state.tabs.forEach(updateTabEl);
            saveTabs();
            void AUTOTASKTABS.saveSettings();
        }

        CUSTOMIZABLE_TAB_TYPES.forEach(function (type) {
            const row = document.createElement('div');
            row.className = 'at-tabs-setting-row at-tabs-customization-row';
            const label = document.createElement('span');
            label.className = 'at-tabs-setting-label';
            const tabIcon = document.createElement('span');
            tabIcon.className = 'at-tabs-setting-icon';
            appendIconMarkup(tabIcon, CUSTOMIZATION_TAB_TYPE_ICONS[type] || '');
            label.appendChild(tabIcon);
            const name = document.createElement('span');
            name.className = 'at-tabs-setting-name';
            name.textContent = TAB_TYPE_LABELS[type] || type;
            label.appendChild(name);

            const controls = document.createElement('span');
            controls.className = 'at-tabs-setting-line-controls';
            const line2 = createLineSelect(type, 2);
            const line3 = createLineSelect(type, 3);
            line2.title = 'Line 2';
            line3.title = 'Line 3';
            controls.appendChild(wrapSettingsSelect(line2));
            controls.appendChild(wrapSettingsSelect(line3));
            row.appendChild(label);
            row.appendChild(controls);
            customizationSection.appendChild(row);
        });

        function updateCustomizationCompactState() {
            const disabled = !!state.horizontalCompactTabsEnabled;
            customizationSection.querySelectorAll('select[data-tab-line="2"], select[data-tab-line="3"]').forEach(function (select) {
                select.disabled = disabled;
                select.title = disabled ? 'Metadata lines are hidden when Browser-like tab size is enabled' : ('Line ' + select.dataset.tabLine);
            });
            customizationSection.querySelectorAll('.at-tabs-setting-line-controls').forEach(function (controls) {
                controls.classList.toggle('line3-disabled', disabled);
            });
            customizationSection.querySelectorAll('[data-tab-line-header]').forEach(function (label) {
                label.classList.toggle('line3-disabled', disabled);
                label.title = disabled ? 'Metadata lines are hidden when Browser-like tab size is enabled' : '';
            });
        }
        updateCustomizationCompactState();

        const uiSection = document.createElement('div');
        uiSection.className = 'at-tabs-settings-section';
        const peekSection = document.createElement('div');
        peekSection.className = 'at-tabs-settings-section';
        const experimentalSection = document.createElement('div');
        experimentalSection.className = 'at-tabs-settings-section';
        section.appendChild(hideRow);
        section.appendChild(orientationRow);
        section.appendChild(sizeRow);
        section.appendChild(tabSizeReloadNote);
        section.appendChild(resizeRow);
        section.appendChild(everywhereRow);
        section.appendChild(openAtStartRow);
        section.appendChild(persistRow);
        generalSection.appendChild(enabledRow);
        generalSection.appendChild(enabledReloadNote);
        uiSection.appendChild(roundedPageFramesRow);
        uiSection.appendChild(improvedScrollbarsRow);
        uiSection.appendChild(phoneRow);
        uiSection.appendChild(ticketRow);
        peekSection.appendChild(peekConfirmRow);
        peekSection.appendChild(peekMoveResizeRow);
        if (experimentalUmbrellaContractsRow) experimentalSection.appendChild(experimentalUmbrellaContractsRow);

        const nav = document.createElement('div');
        nav.className = 'at-tabs-settings-nav';
        const pages = document.createElement('div');
        pages.className = 'at-tabs-settings-pages';
        const pageDefs = [
            { id: 'general', label: 'General', description: 'Core extension controls.', section: generalSection },
            { id: 'tabbar', label: 'Tab Bar', description: 'Position, persistence, and visibility.', section: section },
            { id: 'peek', label: 'Peek', description: 'Overlay behavior for previewing Autotask pages.', section: peekSection },
            { id: 'ui', label: 'Enhancements', description: 'Visual tweaks for Autotask and native navigation cleanup.', section: uiSection },
            { id: 'customization', label: 'Metadata', description: 'Choose what metadata appears on each tab line.', section: customizationSection },
        ];
        if (experimentalUmbrellaContractsRow) {
            pageDefs.splice(4, 0, {
                id: 'experimental',
                label: 'Experimental',
                description: 'Local-only compatibility experiments with extra guardrails.',
                section: experimentalSection,
            });
        }
        const navButtons = [];
        const pageEls = [];
        function activateSettingsPage(id) {
            navButtons.forEach(function (button) {
                button.classList.toggle('active', button.dataset.pageId === id);
            });
            pageEls.forEach(function (page) {
                page.classList.toggle('active', page.dataset.pageId === id);
            });
        }
        pageDefs.forEach(function (def, index) {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'at-tabs-settings-nav-item' + (index === 0 ? ' active' : '');
            button.dataset.pageId = def.id;
            appendIconMarkup(button, '<span class="at-tabs-settings-nav-name"></span><span class="at-tabs-settings-nav-arrow">›</span>');
            button.querySelector('.at-tabs-settings-nav-name').textContent = def.label;
            button.addEventListener('click', function () { activateSettingsPage(def.id); });
            navButtons.push(button);
            nav.appendChild(button);

            const page = document.createElement('div');
            page.className = 'at-tabs-settings-page' + (index === 0 ? ' active' : '');
            page.dataset.pageId = def.id;
            const pageTitle = document.createElement('div');
            pageTitle.className = 'at-tabs-settings-page-title';
            if (def.id === 'customization') pageTitle.classList.add('with-action');
            const pageTitleCopy = document.createElement('div');
            pageTitleCopy.className = 'at-tabs-settings-page-title-copy';
            const titleText = document.createElement('strong');
            titleText.textContent = def.label;
            const subtitle = document.createElement('span');
            subtitle.textContent = def.description;
            pageTitleCopy.appendChild(titleText);
            pageTitleCopy.appendChild(subtitle);
            pageTitle.appendChild(pageTitleCopy);
            if (def.id === 'customization') {
                const recommendedButton = document.createElement('button');
                recommendedButton.type = 'button';
                recommendedButton.className = 'at-tabs-settings-page-action';
                recommendedButton.textContent = 'Set to recommended';
                recommendedButton.addEventListener('click', applyRecommendedCustomization);
                pageTitle.appendChild(recommendedButton);
            }
            page.appendChild(pageTitle);
            page.appendChild(def.section);
            pageEls.push(page);
            pages.appendChild(page);
        });
        body.appendChild(nav);
        body.appendChild(pages);

        function resetSettingsToDefaults() {
            if (!window.confirm('Reset AUTOTASKTABS settings to their defaults? Open tabs will stay open.')) return;

            const defaults = defaultSettingsState();
            Object.assign(state, defaults);
            Object.assign(AUTOTASKTABS.state, defaults);
            state.shellHidden = false;

            enabledInput.checked = defaults.extensionEnabled;
            enabledReloadNote.classList.remove('visible');
            tabSizeReloadNote.classList.remove('visible');
            roundedPageFramesInput.checked = defaults.roundedPageFramesEnabled;
            orientationSelect.value = defaults.barOrientation === 'vertical' ? 'vertical-left' : 'horizontal';
            sizeSelect.value = defaults.horizontalCompactTabsEnabled ? 'compact' : 'default';
            resizeInput.checked = defaults.resizableTabBarEnabled;
            hideInput.checked = !state.shellHidden;
            openAtStartInput.checked = defaults.openNewTabsAtStart;
            persistInput.checked = defaults.rememberTabsAfterClose;
            everywhereInput.checked = defaults.showTabBarOnNonIframePages;
            peekConfirmInput.checked = !defaults.skipPeekBackdropCloseWarning;
            peekMoveResizeInput.checked = defaults.peekMoveResizeEnabled;
            if (experimentalUmbrellaContractsInput) {
                experimentalUmbrellaContractsInput.checked = defaults.experimentalUmbrellaContractFrameTabs;
            }
            void syncUmbrellaContractFrameRules(defaults.experimentalUmbrellaContractFrameTabs);
            improvedScrollbarsInput.checked = defaults.improvedScrollbarsEnabled;
            phoneInput.checked = defaults.phoneLinksEnabled;
            ticketInput.checked = defaults.ticketLinksEnabled;
            setCustomizationSelectValues(defaults.tabLine2Fields, defaults.tabLine3Fields);
            updateCustomizationCompactState();

            applyAutotaskTheme();
            applyBarOrientationClass();
            applyPageFrameClass();
            syncImprovedScrollbarsState();
            updateResizableBarClasses();
            updateShellVisibility();
            applyExtensionEnabledState();
            if (AUTOTASKTABS.setPhoneLinksEnabled) AUTOTASKTABS.setPhoneLinksEnabled(defaults.phoneLinksEnabled);
            if (AUTOTASKTABS.setTicketLinksEnabled) AUTOTASKTABS.setTicketLinksEnabled(defaults.ticketLinksEnabled);
            if (state.showTabBarOnNonIframePages) ensureNonIframeTitleWatcher();
            else stopNonIframeTitleWatcher();
            state.tabs.forEach(updateTabEl);
            requestSyncGeometry();

            void AUTOTASKTABS.saveSettings().then(function () {
                if (AUTOTASKTABS.syncTabsPersistenceMode) {
                    return AUTOTASKTABS.syncTabsPersistenceMode(buildTabsPayload());
                }
                return null;
            });
        }

        const footer = document.createElement('div');
        footer.className = 'at-tabs-settings-footer';
        const footerText = document.createElement('span');
        footerText.style.fontSize = '10.5px';
        footerText.style.lineHeight = '1.35';
        footerText.style.maxWidth = '520px';
        footerText.textContent = 'Autotask is a registered trademark of Kaseya. AUTOTASKTABS: Tabs for Autotask is an independent open-source project developed by qntn-dev and is not affiliated with, sponsored by, endorsed by, or partnered with Kaseya or Datto.';
        const resetButton = createSettingsFooterButton({
            text: 'Reset settings',
            title: 'Reset AUTOTASKTABS settings to defaults',
            onClick: resetSettingsToDefaults,
        });
        const feedbackButton = createSettingsFooterButton({
            text: 'Provide feedback',
            title: 'Create a GitHub issue for AUTOTASKTABS feedback',
            onClick: function () {
                window.open(FEEDBACK_URL, '_blank', 'noopener,noreferrer');
            },
        });
        const footerActions = document.createElement('span');
        footerActions.className = 'at-tabs-settings-footer-actions';
        footerActions.appendChild(feedbackButton);
        footerActions.appendChild(resetButton);
        footer.appendChild(footerText);
        footer.appendChild(footerActions);

        modal.appendChild(header);
        modal.appendChild(body);
        modal.appendChild(footer);

        document.body.appendChild(backdrop);
        document.body.appendChild(modal);
        state.settingsBackdrop = backdrop;
        state.settingsModal = modal;
    }

    function toggleSettingsModal() {
        if (state.settingsModal) closeSettingsModal();
        else openSettingsModal();
    }

    function closeMapModal() {
        if (state.mapModal) {
            state.mapModal.remove();
            state.mapModal = null;
        }
        if (state.mapBackdrop) {
            state.mapBackdrop.remove();
            state.mapBackdrop = null;
        }
    }

    function mapEmbedUrl(url) {
        try {
            const parsed = new URL(url, location.origin);
            const query = parsed.searchParams.get('q') ||
                parsed.searchParams.get('query') ||
                parsed.searchParams.get('daddr') ||
                parsed.searchParams.get('destination') ||
                parsed.searchParams.get('address');
            if (/google\.[^/]+$/i.test(parsed.hostname) || /(^|\.)google\.[^/]+$/i.test(parsed.hostname)) {
                if (query) {
                    return 'https://maps.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
                }
                parsed.searchParams.set('output', 'embed');
                return parsed.href;
            }
            if (/(^|\.)googleapis\.com$/i.test(parsed.hostname) || /(^|\.)gstatic\.com$/i.test(parsed.hostname)) {
                return parsed.href;
            }
            if (query) {
                return 'https://maps.google.com/maps?q=' + encodeURIComponent(query) + '&output=embed';
            }
            return parsed.href;
        } catch (e) {
            return url;
        }
    }

    function openMapModal(url) {
        if (!url) return;
        closeMapModal();

        const backdrop = document.createElement('div');
        backdrop.className = 'at-tabs-map-backdrop';
        backdrop.addEventListener('click', closeMapModal);

        const modal = document.createElement('div');
        modal.className = 'at-tabs-map-modal';

        const header = document.createElement('div');
        header.className = 'at-tabs-map-header';

        const title = document.createElement('div');
        title.textContent = 'Organization location';

        const actions = document.createElement('div');
        actions.className = 'at-tabs-map-actions';

        const openExternal = document.createElement('a');
        openExternal.className = 'at-tabs-map-open';
        openExternal.href = url;
        openExternal.target = '_blank';
        openExternal.rel = 'noopener noreferrer';
        openExternal.textContent = 'Open in maps';

        const close = document.createElement('button');
        close.type = 'button';
        close.className = 'at-tabs-map-close';
        close.textContent = '×';
        close.title = 'Close map';
        close.addEventListener('click', closeMapModal);

        actions.appendChild(openExternal);
        actions.appendChild(close);
        header.appendChild(title);
        header.appendChild(actions);

        const iframe = document.createElement('iframe');
        iframe.className = 'at-tabs-map-frame';
        iframe.src = mapEmbedUrl(url);
        iframe.loading = 'lazy';
        iframe.referrerPolicy = 'no-referrer-when-downgrade';

        modal.appendChild(header);
        modal.appendChild(iframe);
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        state.mapBackdrop = backdrop;
        state.mapModal = modal;
    }

    // --- Peek modal ----------------------------------------------------------
    // Shows a tab's URL inside a modal overlay (Arc-style "peek") with a
    // vertical button column floating to the right: Close + Split-with-current.
    function clearPeekPrewarm(keepUrl) {
        if (!state.peekPrewarm) return null;
        const prewarm = state.peekPrewarm;
        if (keepUrl && prewarm.url === keepUrl) return prewarm;
        try { prewarm.iframe.remove(); } catch (e) {}
        state.peekPrewarm = null;
        return null;
    }

    function prewarmPeek(tab) {
        if (!tab || !tab.url || state.peekBackdrop) return;
        if (state.peekPrewarm && state.peekPrewarm.url === tab.url) return;
        clearPeekPrewarm();

        const iframe = document.createElement('iframe');
        iframe.className = 'at-tabs-peek-frame';
        iframe.src = tab.url;
        iframe.referrerPolicy = 'no-referrer-when-downgrade';
        iframe.setAttribute('aria-hidden', 'true');
        iframe.style.position = 'fixed';
        iframe.style.left = '-10000px';
        iframe.style.top = '0';
        iframe.style.width = '1px';
        iframe.style.height = '1px';
        iframe.style.opacity = '0';
        iframe.style.pointerEvents = 'none';
        const prewarm = { url: tab.url, iframe: iframe, loaded: false };
        iframe.addEventListener('load', function () {
            prewarm.loaded = true;
        }, { once: true });
        document.body.appendChild(iframe);
        state.peekPrewarm = prewarm;
    }

    function stopPeekLiveReuse() {
        if (state.peekResizeObserver) {
            try { state.peekResizeObserver.disconnect(); } catch (e) {}
            state.peekResizeObserver = null;
        }
        window.removeEventListener('resize', requestSyncGeometry);
        const iframe = state.peekReuseIframe;
        if (iframe) {
            iframe.classList.remove('at-tab-peeking');
            iframe.style.cssText = state.peekReusePrevStyle || '';
            state.peekReuseIframe = null;
            state.peekReusePrevStyle = '';
        }
        if (state.viewport) {
            state.viewport.classList.remove('peek-closing');
            state.viewport.classList.remove('peek-active');
            state.viewport.style.cssText = state.peekViewportPrevStyle || '';
        }
        state.peekViewportPrevStyle = '';
        state.peekSyncOverlay = null;
        requestSyncGeometry();
    }

    function startPeekLiveReuse(tab, modal) {
        // Safari/WebKit can rasterize transformed iframe layers during live
        // reuse, leaving the tab content blurry after resize/Peek animations.
        if (IS_SAFARI_WEBKIT) return false;
        const iframe = tab && tab.iframeEl;
        if (!iframe || !iframe.isConnected || !state.viewport) return false;

        clearPeekPrewarm();
        state.peekReuseIframe = iframe;
        state.peekReusePrevStyle = iframe.style.cssText || '';
        state.peekViewportPrevStyle = state.viewport.style.cssText || '';

        const syncOverlay = function () {
            if (!state.viewport || !modal || !modal.isConnected) return;
            const rect = modal.getBoundingClientRect();
            state.viewport.classList.add('peek-active');
            setCssPx(state.viewport, 'left', rect.left);
            setCssPx(state.viewport, 'top', rect.top);
            setCssPx(state.viewport, 'width', rect.width);
            setCssPx(state.viewport, 'height', rect.height);
            state.viewport.style.right = 'auto';
            state.viewport.style.bottom = 'auto';
        };

        state.peekSyncOverlay = syncOverlay;
        state.viewport.classList.add('peek-active');
        iframe.classList.add('at-tab-peeking');
        iframe.style.cssText = '';
        iframe.style.position = 'absolute';
        iframe.style.inset = '0';
        iframe.style.width = '100%';
        iframe.style.height = '100%';
        iframe.style.display = 'block';
        iframe.style.visibility = 'visible';
        iframe.style.opacity = '1';
        iframe.style.pointerEvents = 'auto';
        iframe.style.zIndex = '1';

        syncOverlay();
        if (window.ResizeObserver) {
            state.peekResizeObserver = new ResizeObserver(syncOverlay);
            state.peekResizeObserver.observe(modal);
        }
        window.addEventListener('resize', requestSyncGeometry);
        console.info('[AUTOTASKTABS Peek Diagnostic] live iframe reuse enabled', {
            tabId: tab.id,
            url: tab.url,
            iframeSrc: iframe.src,
            viewportClassName: state.viewport.className
        });
        return true;
    }

    // Diagnostic mode: try to reuse the already-loaded real tab iframe for
    // Peek. This intentionally stresses the shell so we can inspect why it
    // fails; if it cannot reuse, it falls back to the temporary iframe path.
    function closePeekModal(immediate, options) {
        const opts = options || {};
        const refreshOriginTabId = opts.refreshOrigin === true ? state.peekOriginTabId : null;
        const refreshOriginAfterClose = function () {
            if (typeof refreshOriginTabId !== 'number') return;
            const originTab = tabById(refreshOriginTabId);
            if (originTab) refreshTabIframe(originTab);
        };
        if (state.peekClosing && !immediate) return;
        closePeekCloseConfirm();
        if (immediate || prefersReducedMotion()) {
            removePeekModalNow();
            refreshOriginAfterClose();
            return;
        }
        if (!state.peekBackdrop && !state.peekWrapper && !state.peekReuseIframe) return;
        state.peekClosing = true;
        if (state.peekBackdrop) state.peekBackdrop.classList.add('closing');
        if (state.peekWrapper) state.peekWrapper.classList.add('closing');
        if (state.viewport && state.peekReuseIframe) state.viewport.classList.add('peek-closing');
        window.setTimeout(function () {
            removePeekModalNow();
            refreshOriginAfterClose();
        }, AUTOTASKTABS_MODAL_EXIT_MS);
    }

    function removePeekModalNow() {
        if (state.peekMoveResizeCleanup) {
            try { state.peekMoveResizeCleanup(); } catch (e) {}
            state.peekMoveResizeCleanup = null;
        }
        stopPeekLiveReuse();
        if (state.peekBackdrop) {
            state.peekBackdrop.remove();
            state.peekBackdrop = null;
        }
        if (state.peekWrapper) {
            state.peekWrapper.remove();
            state.peekWrapper = null;
        }
        state.peekModal = null;
        state.peekTabId = null;
        state.peekOriginTabId = null;
        state.peekClosing = false;
    }

    function closePeekCloseConfirm() {
        if (state.peekCloseConfirm) {
            state.peekCloseConfirm.remove();
            state.peekCloseConfirm = null;
        }
        if (state.peekCloseConfirmShade) {
            state.peekCloseConfirmShade.remove();
            state.peekCloseConfirmShade = null;
        }
    }

    function requestPeekBackdropClose() {
        if (state.skipPeekBackdropCloseWarning) {
            closePeekModal();
            return;
        }
        if (state.peekCloseConfirm) return;

        const shade = document.createElement('div');
        shade.className = 'at-tabs-peek-confirm-shade';
        shade.addEventListener('click', closePeekCloseConfirm);

        const confirmBox = document.createElement('div');
        confirmBox.className = 'at-tabs-peek-confirm';
        confirmBox.setAttribute('role', 'dialog');
        confirmBox.setAttribute('aria-modal', 'true');

        const title = document.createElement('p');
        title.className = 'at-tabs-peek-confirm-title';
        title.textContent = 'Are you sure you want to close the Peek window?';

        const checkLabel = document.createElement('label');
        checkLabel.className = 'at-tabs-peek-confirm-check';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';

        const checkText = document.createElement('span');
        checkText.textContent = 'Do not show this again';
        checkLabel.appendChild(checkbox);
        checkLabel.appendChild(checkText);

        const actions = document.createElement('div');
        actions.className = 'at-tabs-peek-confirm-actions';

        const cancelButton = document.createElement('button');
        cancelButton.type = 'button';
        cancelButton.className = 'at-tabs-peek-confirm-button';
        cancelButton.textContent = 'Cancel';
        cancelButton.addEventListener('click', closePeekCloseConfirm);

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'at-tabs-peek-confirm-button primary';
        closeButton.textContent = 'Close Peek';
        closeButton.addEventListener('click', function () {
            if (checkbox.checked) {
                state.skipPeekBackdropCloseWarning = true;
                AUTOTASKTABS.state.skipPeekBackdropCloseWarning = true;
                void AUTOTASKTABS.saveSettings();
            }
            closePeekModal();
        });

        actions.appendChild(cancelButton);
        actions.appendChild(closeButton);
        confirmBox.appendChild(title);
        confirmBox.appendChild(checkLabel);
        confirmBox.appendChild(actions);
        document.body.appendChild(shade);
        document.body.appendChild(confirmBox);
        state.peekCloseConfirmShade = shade;
        state.peekCloseConfirm = confirmBox;
        closeButton.focus();
    }

    function peekActionsExtraWidth(actions) {
        if (!actions) return 0;
        const rect = actions.getBoundingClientRect();
        const width = rect && rect.width ? rect.width : 0;
        return Math.ceil(width + 12);
    }

    function clampPeekGeometry(geometry, actions) {
        const margin = 16;
        const minWidth = Math.min(560, Math.max(360, window.innerWidth - (margin * 2)));
        const minHeight = Math.min(360, Math.max(260, window.innerHeight - (margin * 2)));
        const actionWidth = peekActionsExtraWidth(actions);
        const maxWidth = Math.max(minWidth, window.innerWidth - (margin * 2) - actionWidth);
        const maxHeight = Math.max(minHeight, window.innerHeight - (margin * 2));
        const width = Math.min(maxWidth, Math.max(minWidth, geometry.width));
        const height = Math.min(maxHeight, Math.max(minHeight, geometry.height));
        const maxLeft = Math.max(margin, window.innerWidth - width - actionWidth - margin);
        const maxTop = Math.max(margin, window.innerHeight - height - margin);
        const left = Math.min(maxLeft, Math.max(margin, geometry.left));
        const top = Math.min(maxTop, Math.max(margin, geometry.top));
        return { left, top, width, height };
    }

    function applyPeekGeometry(wrapper, modal, actions, geometry) {
        if (!wrapper || !modal) return;
        const next = clampPeekGeometry(geometry, actions);
        wrapper.classList.add('at-tabs-peek-positioned');
        setCssPx(wrapper, 'left', next.left);
        setCssPx(wrapper, 'top', next.top);
        wrapper.style.right = 'auto';
        wrapper.style.bottom = 'auto';
        wrapper.style.transform = 'none';
        setCssPx(modal, 'width', next.width);
        setCssPx(modal, 'height', next.height);
        if (state.peekSyncOverlay) window.requestAnimationFrame(state.peekSyncOverlay);
    }

    function currentPeekGeometry(wrapper, modal) {
        const wrapperRect = wrapper.getBoundingClientRect();
        const modalRect = modal.getBoundingClientRect();
        return {
            left: wrapperRect.left,
            top: wrapperRect.top,
            width: modalRect.width,
            height: modalRect.height
        };
    }

    function centerPeekGeometry(modal, actions) {
        const actionWidth = peekActionsExtraWidth(actions);
        const width = Math.min(1430, Math.max(360, window.innerWidth - 96 - actionWidth));
        const height = Math.min(1014, Math.max(260, window.innerHeight - 48));
        return {
            left: Math.max(16, (window.innerWidth - width - actionWidth) / 2),
            top: Math.max(16, (window.innerHeight - height) / 2),
            width,
            height
        };
    }

    function installPeekMoveResize(wrapper, modal, actions, moveHandle, resetButton) {
        if (!wrapper || !modal) return;
        if (state.peekMoveResizeCleanup) {
            try { state.peekMoveResizeCleanup(); } catch (e) {}
            state.peekMoveResizeCleanup = null;
        }

        const dragHandle = document.createElement('button');
        dragHandle.type = 'button';
        dragHandle.className = 'at-tabs-peek-drag-handle';
        dragHandle.title = 'Drag Peek window';
        dragHandle.setAttribute('aria-label', 'Drag Peek window');

        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'at-tabs-peek-resize-handle';
        resizeHandle.title = 'Resize Peek window';
        resizeHandle.setAttribute('aria-label', 'Resize Peek window');

        modal.appendChild(dragHandle);
        modal.appendChild(resizeHandle);

        let activeInteraction = null;

        const syncToViewport = function () {
            if (state.peekSyncOverlay) window.requestAnimationFrame(state.peekSyncOverlay);
        };

        const beginInteraction = function (event, mode) {
            if (!event || event.button !== 0) return;
            if (!wrapper.isConnected || !modal.isConnected) return;
            event.preventDefault();
            event.stopPropagation();
            activeInteraction = {
                mode,
                pointerId: event.pointerId,
                startX: event.clientX,
                startY: event.clientY,
                start: currentPeekGeometry(wrapper, modal)
            };
            document.documentElement.classList.add('autotasktabs-peek-interacting');
            try {
                event.currentTarget.setPointerCapture(event.pointerId);
            } catch (e) {}
            window.addEventListener('pointermove', onPointerMove, true);
            window.addEventListener('pointerup', endInteraction, true);
            window.addEventListener('pointercancel', endInteraction, true);
        };

        const onPointerMove = function (event) {
            if (!activeInteraction) return;
            if (event.pointerId !== activeInteraction.pointerId) return;
            event.preventDefault();
            const dx = event.clientX - activeInteraction.startX;
            const dy = event.clientY - activeInteraction.startY;
            const start = activeInteraction.start;
            if (activeInteraction.mode === 'resize') {
                applyPeekGeometry(wrapper, modal, actions, {
                    left: start.left,
                    top: start.top,
                    width: start.width + dx,
                    height: start.height + dy
                });
            } else {
                applyPeekGeometry(wrapper, modal, actions, {
                    left: start.left + dx,
                    top: start.top + dy,
                    width: start.width,
                    height: start.height
                });
            }
        };

        const endInteraction = function (event) {
            if (!activeInteraction) return;
            if (event && event.pointerId !== activeInteraction.pointerId) return;
            activeInteraction = null;
            document.documentElement.classList.remove('autotasktabs-peek-interacting');
            window.removeEventListener('pointermove', onPointerMove, true);
            window.removeEventListener('pointerup', endInteraction, true);
            window.removeEventListener('pointercancel', endInteraction, true);
            syncToViewport();
        };

        const resetPeekGeometry = function () {
            applyPeekGeometry(wrapper, modal, actions, centerPeekGeometry(modal, actions));
        };

        const clampOnViewportResize = function () {
            applyPeekGeometry(wrapper, modal, actions, currentPeekGeometry(wrapper, modal));
        };

        dragHandle.addEventListener('pointerdown', function (event) { beginInteraction(event, 'move'); });
        dragHandle.addEventListener('dblclick', resetPeekGeometry);
        resizeHandle.addEventListener('pointerdown', function (event) { beginInteraction(event, 'resize'); });
        if (moveHandle) {
            moveHandle.addEventListener('pointerdown', function (event) { beginInteraction(event, 'move'); });
        }
        if (resetButton) {
            resetButton.addEventListener('click', resetPeekGeometry);
        }
        window.addEventListener('resize', clampOnViewportResize);

        applyPeekGeometry(wrapper, modal, actions, currentPeekGeometry(wrapper, modal));

        state.peekMoveResizeCleanup = function () {
            document.documentElement.classList.remove('autotasktabs-peek-interacting');
            window.removeEventListener('pointermove', onPointerMove, true);
            window.removeEventListener('pointerup', endInteraction, true);
            window.removeEventListener('pointercancel', endInteraction, true);
            window.removeEventListener('resize', clampOnViewportResize);
            try { dragHandle.remove(); } catch (e) {}
            try { resizeHandle.remove(); } catch (e) {}
        };
    }

    function assignPeekOpener(iframe, openerWindow) {
        if (!iframe || !openerWindow) return;
        try {
            if (iframe.contentWindow && iframe.contentWindow !== openerWindow) {
                iframe.contentWindow.opener = openerWindow;
            }
        } catch (e) {}
    }

    function shouldAllowProgrammaticPeekConversion(url) {
        const path = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(url)).toLowerCase();
        return path === '/mvc/servicedesk/timeentry.mvc/timeentrypopoutfromdialog' ||
            path === '/mvc/servicedesk/note.mvc/notepopoutfromdialog' ||
            path === '/mvc/servicedesk/timeentry.mvc/newtickettimeentrypage' ||
            path === '/mvc/servicedesk/note.mvc/newticketnotepage';
    }

    function ensurePeekTargetTabForConversion(peekTab, options) {
        const opts = options || {};
        const targetUrl = peekTab && peekTab.url;
        if (!targetUrl) return null;
        if (typeof peekTab.id === 'number') {
            const existingById = tabById(peekTab.id) || peekTab;
            if (opts.activate && existingById && typeof existingById.id === 'number') activateTab(existingById.id);
            return existingById;
        }
        const existing = state.tabs.find(function (candidate) { return candidate.url === targetUrl; });
        if (existing) {
            if (opts.activate) activateTab(existing.id);
            return existing;
        }
        const previousActiveId = state.activeId;
        const created = createAndAddTab(targetUrl) || state.tabs.slice().reverse().find(function (candidate) {
            return candidate.url === targetUrl;
        });
        if (!created) return null;
        if (opts.activate) {
            activateTab(created.id);
        } else if (previousActiveId !== null && previousActiveId !== created.id && tabById(previousActiveId)) {
            activateTab(previousActiveId);
        }
        return created;
    }

    function openPeekModal(tab, options) {
        if (!tab || !tab.url) return;
        const opts = options || {};
        const canOpenPeekAsTab = opts.allowOpenInTab === true;
        const openerWindow = opts.openerWindow || null;
        const openerTab = openerWindow ? findTabFromWindow(openerWindow) : null;
        closePeekModal(true);
        hideHoverCard(true);

        const backdrop = document.createElement('div');
        backdrop.className = 'at-tabs-peek-backdrop';
        backdrop.addEventListener('click', requestPeekBackdropClose);

        const wrapper = document.createElement('div');
        wrapper.className = 'at-tabs-peek-wrapper';

        const modal = document.createElement('div');
        modal.className = 'at-tabs-peek-modal';

        const loader = document.createElement('div');
        loader.className = 'at-tabs-peek-loader';
        loader.setAttribute('aria-label', 'Loading');

        const reusedLiveIframe = opts.reuseLiveIframe === true && startPeekLiveReuse(tab, modal);
        if (reusedLiveIframe) {
            modal.classList.add('live-reuse');
            loader.classList.add('hidden');
            modal.appendChild(loader);
        } else {
            const prewarm = clearPeekPrewarm(tab.url);
            const iframe = prewarm ? prewarm.iframe : document.createElement('iframe');
            iframe.className = 'at-tabs-peek-frame';
            iframe.removeAttribute('aria-hidden');
            iframe.style.cssText = '';
            if (!prewarm) {
                iframe.src = tab.url;
                iframe.referrerPolicy = 'no-referrer-when-downgrade';
            }
            if (prewarm && prewarm.loaded) {
                loader.classList.add('hidden');
            } else {
                iframe.addEventListener('load', function () {
                    loader.classList.add('hidden');
                }, { once: true });
            }
            if (openerWindow) {
                iframe.addEventListener('load', function () {
                    assignPeekOpener(iframe, openerWindow);
                });
            }
            const frameWrap = document.createElement('div');
            frameWrap.className = 'at-tabs-peek-frame-wrap';
            frameWrap.appendChild(iframe);
            assignPeekOpener(iframe, openerWindow);
            frameWrap.appendChild(loader);
            modal.appendChild(frameWrap);
            state.peekPrewarm = null;
        }

        const actions = document.createElement('div');
        actions.className = 'at-tabs-peek-actions';

        const closeBtn = document.createElement('button');
        closeBtn.type = 'button';
        closeBtn.className = 'at-tabs-peek-action close-action';
        closeBtn.title = 'Close peek';
        closeBtn.setAttribute('aria-label', 'Close peek');
        closeBtn.textContent = '×';
        closeBtn.addEventListener('click', closePeekModal);

        const peekMoveResizeEnabled = !!state.peekMoveResizeEnabled;
        let resetPositionBtn = null;
        if (peekMoveResizeEnabled) {
            resetPositionBtn = document.createElement('button');
            resetPositionBtn.type = 'button';
            resetPositionBtn.className = 'at-tabs-peek-action reset-position-action';
            resetPositionBtn.title = 'Reset Peek position and size';
            resetPositionBtn.setAttribute('aria-label', 'Reset Peek position and size');
            appendIconMarkup(resetPositionBtn, '<span class="fa-arrow-rotate-left fa-solid" aria-hidden="true"></span>');
        }

        const splitBtn = document.createElement('button');
        splitBtn.type = 'button';
        splitBtn.className = 'at-tabs-peek-action split-action';
        splitBtn.title = 'Split with current tab';
        splitBtn.setAttribute('aria-label', 'Split with current tab');
        appendIconMarkup(splitBtn, '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M12 4v16"/></svg>');
        const canConvertPeekToTab = canOpenPeekAsTab && typeof tab.id !== 'number';
        const canSplitExistingTab = opts.allowSplit !== false && typeof tab.id === 'number' && state.activeId !== null && state.activeId !== tab.id;
        const canSplitConvertedTab = opts.allowSplit === true && canConvertPeekToTab && state.activeId !== null;
        const canSplit = canSplitExistingTab || canSplitConvertedTab;
        if (!canSplit) {
            splitBtn.disabled = true;
            splitBtn.title = state.activeId === null
                ? 'Open another custom tab first to split with'
                : canConvertPeekToTab
                    ? 'Convert this Peek to a tab before splitting'
                    : typeof tab.id !== 'number'
                        ? 'Open this Peek as a tab before splitting'
                        : 'Cannot split a tab with itself';
        }
        splitBtn.addEventListener('click', function () {
            if (splitBtn.disabled) return;
            const targetTab = ensurePeekTargetTabForConversion(tab, { activate: false });
            const tabId = targetTab && targetTab.id;
            closePeekModal();
            if (typeof tabId === 'number') enableSplitScreen(tabId);
        });

        const openInTabBtn = document.createElement('button');
        openInTabBtn.type = 'button';
        openInTabBtn.className = 'at-tabs-peek-action open-tab-action';
        openInTabBtn.disabled = !canOpenPeekAsTab;
        openInTabBtn.title = canOpenPeekAsTab ? 'Open Peek in tab' : 'Only manually peeked tabs can be opened as tabs';
        openInTabBtn.setAttribute('aria-label', 'Open Peek in tab');
        appendIconMarkup(openInTabBtn, '<span class="fa-up-right-from-square fa-regular" aria-hidden="true"></span>');
        openInTabBtn.addEventListener('click', function () {
            if (!canOpenPeekAsTab) return;
            const targetTab = ensurePeekTargetTabForConversion(tab, { activate: true });
            closePeekModal();
            if (targetTab && typeof targetTab.id === 'number') activateTab(targetTab.id);
        });

        actions.appendChild(closeBtn);
        if (resetPositionBtn) actions.appendChild(resetPositionBtn);
        actions.appendChild(openInTabBtn);
        actions.appendChild(splitBtn);

        wrapper.appendChild(modal);
        wrapper.appendChild(actions);

        document.body.appendChild(backdrop);
        document.body.appendChild(wrapper);

        state.peekBackdrop = backdrop;
        state.peekWrapper = wrapper;
        state.peekModal = modal;
        state.peekTabId = tab.id;
        state.peekOriginTabId = typeof tab.id === 'number'
            ? tab.id
            : openerTab && typeof openerTab.id === 'number'
                ? openerTab.id
                : null;
        if (peekMoveResizeEnabled) {
            installPeekMoveResize(wrapper, modal, actions, null, resetPositionBtn);
        }
        if (reusedLiveIframe && state.peekSyncOverlay) {
            window.requestAnimationFrame(state.peekSyncOverlay);
        }
    }

    function openUrlInPeek(url, options) {
        if (!featuresEnabled() || !url) return;
        const opts = options || {};
        const existing = state.tabs.find(t => t.url === url);
        if (existing) {
            openPeekModal(existing, opts);
            return;
        }
        const fallback = fallbackTabMetadataForUrl(url);
        const type = tabTypeForUrl(url);
        openPeekModal({
            id: null,
            url: url,
            title: fallback.title,
            number: fallback.number,
            contact: fallback.contact,
            primaryResource: null,
            hoverFields: [],
            metadataFields: fallbackMetadataFields(type, fallback),
            pageWarning: false,
            iframeEl: null,
            tabEl: null,
        }, Object.assign({ allowSplit: false }, opts));
    }

    // --- Tab hover preview card ---------------------------------------------
    const HOVER_SHOW_DELAY_MS = 550;
    const HOVER_HIDE_DELAY_MS = 180;

    function ensureHoverCard() {
        if (state.hoverCard) return state.hoverCard;
        const card = document.createElement('div');
        card.className = 'at-tabs-hover-card';
        card.setAttribute('role', 'tooltip');
        document.body.appendChild(card);
        function markHovered() {
            state.hoverCardHovered = true;
            state.hoverAnchorHovered = false;
            if (state.hoverHideTimer) {
                clearTimeout(state.hoverHideTimer);
                state.hoverHideTimer = 0;
            }
        }
        function markLeft() {
            state.hoverCardHovered = false;
            hideHoverCard(false);
        }
        card.addEventListener('pointerenter', markHovered);
        card.addEventListener('pointerleave', markLeft);
        state.hoverCard = card;
        return card;
    }

    function hoverCardSuppressed() {
        return !!(state.draggingTabId
            || state.tabContextMenu
            || state.peekBackdrop
            || state.settingsModal
            || state.mapModal);
    }

    function fillHoverCard(card, tab) {
        card.replaceChildren();
        const titleEl = document.createElement('div');
        titleEl.className = 'hc-title';
        titleEl.textContent = tab.title || 'Tab';
        card.appendChild(titleEl);

        const typeEl = document.createElement('div');
        typeEl.className = 'hc-number';
        typeEl.textContent = tabMetadataFields(tab).type || tabTypeLabel(tab);
        card.appendChild(typeEl);

        function addRow(label, value, copyable) {
            if (!label) return;
            const displayValue = String(value || '').trim();
            const row = document.createElement('div');
            row.className = 'hc-row';
            const lbl = document.createElement('div');
            lbl.className = 'hc-label';
            lbl.textContent = label;
            const val = document.createElement('div');
            val.className = 'hc-value';
            val.textContent = displayValue || ' ';
            row.appendChild(lbl);
            row.appendChild(val);
            if (copyable !== false && displayValue) {
                const copy = document.createElement('button');
                copy.type = 'button';
                copy.className = 'hc-copy';
                copy.title = 'Copy ' + label;
                copy.setAttribute('aria-label', 'Copy ' + label);
                appendIconMarkup(copy, '<span class="hc-copy-icon fa-copy fa-regular" aria-hidden="true"></span>');
                copy.style.setProperty('color', 'var(--autotasktabs-accent-color)', 'important');
                const copyIcon = copy.querySelector('.hc-copy-icon');
                if (copyIcon) copyIcon.style.setProperty('color', 'var(--autotasktabs-accent-color)', 'important');
                copy.addEventListener('pointerdown', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                });
                copy.addEventListener('click', function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    void copyTextToClipboard(displayValue);
                });
                row.appendChild(copy);
            } else {
                const copyPlaceholder = document.createElement('span');
                copyPlaceholder.className = 'hc-copy hc-copy-placeholder';
                copyPlaceholder.setAttribute('aria-hidden', 'true');
                row.appendChild(copyPlaceholder);
            }
            card.appendChild(row);
        }

        addRow('Account', tab.contact);
        if (tab.primaryResource && tab.primaryResource.name) {
            addRow('Primary', tab.primaryResource.name);
        }
        const hoverFields = normalizeHoverFields(tab.hoverFields);
        if (hoverFields.length) {
            for (const field of hoverFields) addRow(field.label, field.value);
        } else {
            addRow('Status', tab.status);
            addRow('Priority', tab.priority);
            addRow('Last activity', tab.lastActivity);
        }
    }

    function positionHoverCard(card, anchorEl) {
        const rect = anchorEl.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const margin = 8;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        let top, left;
        if (isVerticalBar()) {
            left = rect.right + margin;
            top = rect.top;
            if (left + cardRect.width + margin > vw) {
                left = rect.left - cardRect.width - margin;
            }
            if (top + cardRect.height + margin > vh) {
                top = vh - cardRect.height - margin;
            }
            if (top < margin) top = margin;
        } else {
            top = rect.bottom + margin;
            left = rect.left;
            if (top + cardRect.height + margin > vh) {
                top = rect.top - cardRect.height - margin;
            }
            if (left + cardRect.width + margin > vw) {
                left = vw - cardRect.width - margin;
            }
            if (left < margin) left = margin;
        }
        card.style.left = left + 'px';
        card.style.top = top + 'px';
    }

    function showHoverCardNow(tab, anchorEl) {
        if (hoverCardSuppressed()) return;
        if (!tab || !tab.url) return;
        state.hoverAnchorEl = anchorEl;
        const card = ensureHoverCard();
        fillHoverCard(card, tab);
        card.style.left = '-9999px';
        card.style.top = '0px';
        card.classList.add('visible');
        window.requestAnimationFrame(function () {
            if (!state.hoverCard || state.hoverTabId !== tab.id) return;
            positionHoverCard(card, anchorEl);
        });
        state.hoverTabId = tab.id;
    }

    function scheduleHoverCard(tab, anchorEl) {
        if (hoverCardSuppressed()) return;
        state.hoverAnchorEl = anchorEl;
        if (state.hoverHideTimer) {
            clearTimeout(state.hoverHideTimer);
            state.hoverHideTimer = 0;
        }
        if (state.hoverShowTimer) clearTimeout(state.hoverShowTimer);
        const delay = state.hoverCard && state.hoverCard.classList.contains('visible')
            ? 60
            : HOVER_SHOW_DELAY_MS;
        state.hoverShowTimer = setTimeout(function () {
            state.hoverShowTimer = 0;
            showHoverCardNow(tab, anchorEl);
        }, delay);
    }

    function hideHoverCard(immediate) {
        if (state.hoverShowTimer) {
            clearTimeout(state.hoverShowTimer);
            state.hoverShowTimer = 0;
        }
        function doHide() {
            const anchorHovered = !!(state.hoverAnchorEl &&
                state.hoverAnchorEl.isConnected &&
                state.hoverAnchorEl.matches(':hover'));
            const cardHovered = !!(state.hoverCard &&
                state.hoverCard.isConnected &&
                state.hoverCard.matches(':hover'));
            state.hoverAnchorHovered = anchorHovered;
            state.hoverCardHovered = cardHovered;
            if (!immediate && anchorHovered) {
                state.hoverHideTimer = setTimeout(doHide, HOVER_HIDE_DELAY_MS);
                return;
            }
            if (!immediate && cardHovered) {
                state.hoverHideTimer = setTimeout(doHide, HOVER_HIDE_DELAY_MS);
                return;
            }
            state.hoverHideTimer = 0;
            state.hoverCardHovered = false;
            state.hoverAnchorHovered = false;
            state.hoverAnchorEl = null;
            state.hoverTabId = null;
            if (state.hoverCard) state.hoverCard.classList.remove('visible');
        }
        if (immediate) {
            if (state.hoverHideTimer) {
                clearTimeout(state.hoverHideTimer);
                state.hoverHideTimer = 0;
            }
            doHide();
            return;
        }
        if (state.hoverHideTimer) clearTimeout(state.hoverHideTimer);
        state.hoverHideTimer = setTimeout(doHide, HOVER_HIDE_DELAY_MS);
    }

    // The Autotask dialog PopOut button submits a hidden POST form with
    // target="_blank". The iframe bridge cancels that native submit and
    // forwards the payload here; we re-submit the same form (same URL,
    // same fields) into a fresh AUTOTASKTABS tab's iframe so the popout opens
    // inside AUTOTASKTABS instead of a new browser tab. Tracks the originating
    // ticket tab so closing the popout via Save & Quit can refresh the
    // ticket.
    function handleDialogPopoutMessage(sourceWindow, data) {
        if (!featuresEnabled()) return;
        if (!state.viewport) return;
        let actionUrl;
        try { actionUrl = new URL(data.url, location.origin).href; }
        catch (e) { return; }
        if (!AUTOTASKTABS.isDialogPopOutFromDialogUrl(actionUrl)) return;

        const originTab = sourceWindow ? findTabFromWindow(sourceWindow) : null;
        const originTabId = originTab ? originTab.id : null;

        const iframeEl = createTabIframe(actionUrl, { deferLoad: true });
        const loaderEl = createTabPaneLoader();

        // The form submit needs a unique frame name to target. Set
        // this BEFORE the iframe enters the DOM — the browser
        // registers the iframe's browsing-context name at insertion
        // time. Setting `.name` afterwards updates the attribute and
        // `getElementsByName` lookups, but Chrome does not always
        // retroactively update the BC name, so a form whose `target`
        // matches would fall back to opening a new top-level tab.
        const iframeName = 'autotasktabs-popout-target-'
            + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
        iframeEl.name = iframeName;
        iframeEl.setAttribute('name', iframeName);
        // Mark the iframe as actively loading so the normal lazy-load
        // guards don't try to set src to actionUrl behind our back.
        iframeEl.dataset.autotasktabsLoadStarted = 'true';
        iframeEl.removeAttribute('data-autotasktabs-deferred-src');

        state.viewport.appendChild(iframeEl);
        state.viewport.appendChild(loaderEl);

        const fallback = fallbackTabMetadataForUrl(actionUrl);
        const type = tabTypeForUrl(actionUrl);
        // Inherit the originating ticket's number and organization so
        // the popout tab shows: title (line 1) / ticket # (line 2) /
        // organization (line 3). originTab is the ticket tab the
        // dialog was launched from.
        const inheritedNumber = (originTab && originTab.number) || fallback.number || '';
        const inheritedContact = (originTab && originTab.contact) || fallback.contact || '';
        const enrichedFallback = Object.assign({}, fallback, {
            number: inheritedNumber,
            contact: inheritedContact,
        });
        const tab = {
            id: state.nextId++,
            url: actionUrl,
            title: fallback.title || 'Popout',
            number: inheritedNumber,
            contact: inheritedContact,
            primaryResource: null,
            pinned: false,
            color: '',
            priority: '',
            status: '',
            lastActivity: '',
            pageWarning: false,
            hoverFields: [],
            metadataFields: normalizeMetadataFields(fallbackMetadataFields(type, enrichedFallback)),
            iframeEl: iframeEl,
            loaderEl: loaderEl,
            tabEl: null,
            nativeShell: false,
            loading: true,
            loadStarted: true,
            popoutOriginTabId: originTabId,
        };
        addTabToList(tab);
        renderTabs();

        // Build a hidden form in the top shell document and submit it
        // with target = the new iframe's name. The browser POSTs into
        // the iframe instead of opening a new browser tab.
        const form = document.createElement('form');
        form.method = data.method === 'get' ? 'get' : 'post';
        form.action = actionUrl;
        form.target = iframeName;
        form.acceptCharset = 'UTF-8';
        form.style.display = 'none';
        (data.fields || []).forEach(function (field) {
            if (!field || typeof field.name !== 'string' || !field.name) return;
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = field.name;
            input.value = typeof field.value === 'string' ? field.value : '';
            form.appendChild(input);
        });
        document.body.appendChild(form);
        try { form.submit(); } catch (e) {}
        window.setTimeout(function () {
            try { form.remove(); } catch (e) {}
        }, 0);

        activateTab(tab.id);
        requestSyncGeometry();
        saveTabs();
    }

    function openTab(url, options) {
        if (!featuresEnabled()) return;
        const opts = options || {};
        if (!opts.skipContractProbe && isLegacyContractViewUrl(url)) {
            openLegacyContractWithProbe(url);
            return;
        }
        openTabDirect(url);
    }

    function consumePendingDirectHandledOpenUrl() {
        try {
            const pendingUrl = sessionStorage.getItem(DIRECT_HANDLED_OPEN_STORAGE_KEY) || '';
            if (!pendingUrl) return '';
            sessionStorage.removeItem(DIRECT_HANDLED_OPEN_STORAGE_KEY);
            if (!AUTOTASKTABS.isHandledUrl || !AUTOTASKTABS.isHandledUrl(pendingUrl)) return '';
            if (AUTOTASKTABS.extractHandledUrlFromLandingPageUrl && AUTOTASKTABS.extractHandledUrlFromLandingPageUrl(pendingUrl)) return '';
            return pendingUrl;
        } catch (e) {
            return '';
        }
    }

    function openPendingDirectHandledRoute() {
        const pendingUrl = consumePendingDirectHandledOpenUrl();
        if (!pendingUrl) return false;
        openTab(pendingUrl);
        return true;
    }

    function openNativeShellTab(url, options) {
        let targetUrl = '';
        try { targetUrl = canonicalTabUrl(new URL(url || '', location.origin).href); }
        catch (e) { return null; }
        if (state.nativeShellSuppressUrl === targetUrl) state.nativeShellSuppressUrl = '';
        const existing = state.tabs.find(function (tab) {
            return isNativeShellTab(tab) && canonicalTabUrl(tab.url) === targetUrl;
        });
        if (existing) {
            if (!options || options.activate !== false) activateTab(existing.id);
            return existing;
        }
        return createAndAddTab(targetUrl, null, options);
    }

    function openTabDirect(url) {
        if (!featuresEnabled()) return;
        if (isNativeShellTabUrl(url)) {
            openNativeShellTab(url);
            return;
        }
        if (isUmbrellaContractHomeUrl(url) && !useExperimentalUmbrellaContractFrameTabs()) {
            openUrlOnHome(url);
            return;
        }
        if (AUTOTASKTABS.isNativeHomeUrl && AUTOTASKTABS.isNativeHomeUrl(url) &&
            !(isUmbrellaContractHomeUrl(url) && useExperimentalUmbrellaContractFrameTabs())) {
            openUrlOnHome(url);
            return;
        }
        if (isContractEditUrl(url)) {
            openContractEditWithProbe(url);
            return;
        }
        if (shouldOpenUrlInPeek(url)) {
            const allowConversion = shouldAllowProgrammaticPeekConversion(url);
            openUrlInPeek(url, allowConversion ? { allowOpenInTab: true, allowSplit: true } : undefined);
            return;
        }
        const existing = state.tabs.find(t => t.url === url);
        if (existing) {
            activateTab(existing.id);
            return;
        }
        createAndAddTab(url);
    }

    function experimentalContractTabUrl(url) {
        if (!useExperimentalUmbrellaContractFrameTabs()) return url;
        return buildOnyxContractDetailsUrl(url) || url;
    }

    function openLegacyContractWithProbe(url) {
        let targetUrl = '';
        try { targetUrl = new URL(url || '', location.origin).href; }
        catch (e) { return; }

        if (useExperimentalUmbrellaContractFrameTabs()) {
            openTabDirect(buildOnyxContractDetailsUrl(targetUrl) || targetUrl);
            return;
        }

        const existing = state.tabs.find(t => t.url === targetUrl);
        if (existing) {
            activateTab(existing.id);
            return;
        }

        if (state.contractProbeUrl === targetUrl) {
            showContractProbeOverlay();
            return;
        }

        state.contractProbeUrl = targetUrl;
        showContractProbeOverlay();

        const finish = function (mode, resolvedUrl) {
            if (state.contractProbeUrl !== targetUrl) return;
            state.contractProbeUrl = '';
            hideContractProbeOverlay();

            if (mode === 'home' && resolvedUrl) {
                if (isUmbrellaContractHomeUrl(resolvedUrl) && useExperimentalUmbrellaContractFrameTabs()) {
                    openTabDirect(resolvedUrl);
                    return;
                }
                openUrlOnHome(resolvedUrl);
                return;
            }

            openTab(targetUrl, { skipContractProbe: true });
        };

        const failOpenTab = function () {
            finish('tab', targetUrl);
        };

        let settled = false;
        let legacySettleTimer = 0;
        const probeFrame = document.createElement('iframe');
        state.contractProbeFrame = probeFrame;
        probeFrame.setAttribute('aria-hidden', 'true');
        probeFrame.style.position = 'fixed';
        probeFrame.style.left = '-10000px';
        probeFrame.style.top = '0';
        probeFrame.style.width = '1px';
        probeFrame.style.height = '1px';
        probeFrame.style.opacity = '0';
        probeFrame.style.pointerEvents = 'none';

        const cleanup = function () {
            if (legacySettleTimer) {
                window.clearTimeout(legacySettleTimer);
                legacySettleTimer = 0;
            }
            try { probeFrame.remove(); } catch (e) {}
            if (state.contractProbeFrame === probeFrame) state.contractProbeFrame = null;
        };

        const settle = function (mode, resolvedUrl) {
            if (settled) return;
            settled = true;
            window.clearTimeout(timeoutId);
            cleanup();
            finish(mode, resolvedUrl);
        };

        const timeoutId = window.setTimeout(function () {
            settle('tab', targetUrl);
        }, 7000);

        probeFrame.addEventListener('load', function () {
            if (settled) return;
            const loadedUrl = currentFrameUrl(probeFrame);
            if (loadedUrl && AUTOTASKTABS.isNativeHomeUrl && AUTOTASKTABS.isNativeHomeUrl(loadedUrl)) {
                settle('home', loadedUrl);
                return;
            }

            if (isLegacyContractViewUrl(loadedUrl || targetUrl)) {
                if (legacySettleTimer) window.clearTimeout(legacySettleTimer);
                legacySettleTimer = window.setTimeout(function () {
                    hideContractProbeOverlay();
                    settle('tab', targetUrl);
                }, 900);
            }
        });

        try {
            document.body.appendChild(probeFrame);
            probeFrame.src = targetUrl;
        } catch (e) {
            settle('tab', targetUrl);
        }
    }

    function openContractEditWithProbe(url, openerWindow) {
        let targetUrl = '';
        try { targetUrl = new URL(url || '', location.origin).href; }
        catch (e) { return; }

        if (useExperimentalUmbrellaContractFrameTabs()) {
            const allowConversion = shouldAllowProgrammaticPeekConversion(targetUrl);
            openUrlInPeek(targetUrl, {
                openerWindow: openerWindow,
                allowOpenInTab: allowConversion,
                allowSplit: allowConversion,
            });
            return;
        }

        if (state.contractEditProbeUrl === targetUrl) {
            showContractProbeOverlay();
            return;
        }

        state.contractEditProbeUrl = targetUrl;
        showContractProbeOverlay();

        const finish = function (mode, resolvedUrl) {
            if (state.contractEditProbeUrl !== targetUrl) return;
            state.contractEditProbeUrl = '';
            hideContractProbeOverlay();

            if (mode === 'home' && resolvedUrl) {
                if (isUmbrellaContractHomeUrl(resolvedUrl) && useExperimentalUmbrellaContractFrameTabs()) {
                    openTabDirect(resolvedUrl);
                    return;
                }
                openUrlOnHome(resolvedUrl);
                return;
            }

            const allowConversion = shouldAllowProgrammaticPeekConversion(targetUrl);
            const options = {
                allowOpenInTab: allowConversion,
                allowSplit: allowConversion,
            };
            if (openerWindow) options.openerWindow = openerWindow;
            openUrlInPeek(targetUrl, options);
        };

        let settled = false;
        let legacySettleTimer = 0;
        const probeFrame = document.createElement('iframe');
        state.contractEditProbeFrame = probeFrame;
        probeFrame.setAttribute('aria-hidden', 'true');
        probeFrame.style.position = 'fixed';
        probeFrame.style.left = '-10000px';
        probeFrame.style.top = '0';
        probeFrame.style.width = '1px';
        probeFrame.style.height = '1px';
        probeFrame.style.opacity = '0';
        probeFrame.style.pointerEvents = 'none';

        const cleanup = function () {
            if (legacySettleTimer) {
                window.clearTimeout(legacySettleTimer);
                legacySettleTimer = 0;
            }
            try { probeFrame.remove(); } catch (e) {}
            if (state.contractEditProbeFrame === probeFrame) state.contractEditProbeFrame = null;
        };

        const settle = function (mode, resolvedUrl) {
            if (settled) return;
            settled = true;
            window.clearTimeout(timeoutId);
            cleanup();
            finish(mode, resolvedUrl);
        };

        const timeoutId = window.setTimeout(function () {
            settle('peek', targetUrl);
        }, 7000);

        probeFrame.addEventListener('load', function () {
            if (settled) return;
            const loadedUrl = currentFrameUrl(probeFrame);
            if (loadedUrl && AUTOTASKTABS.isNativeHomeUrl && AUTOTASKTABS.isNativeHomeUrl(loadedUrl)) {
                settle('home', loadedUrl);
                return;
            }

            if (isContractEditUrl(loadedUrl || targetUrl)) {
                if (legacySettleTimer) window.clearTimeout(legacySettleTimer);
                legacySettleTimer = window.setTimeout(function () {
                    hideContractProbeOverlay();
                    settle('peek', targetUrl);
                }, 900);
            }
        });

        try {
            document.body.appendChild(probeFrame);
            probeFrame.src = targetUrl;
        } catch (e) {
            settle('peek', targetUrl);
        }
    }

    function shouldOpenUrlInPeek(url) {
        const path = AUTOTASKTABS.normalizeHandledPath(AUTOTASKTABS.pathOf(url)).toLowerCase();
        return shouldAllowProgrammaticPeekConversion(url) ||
            path === '/billing/invoices/popups/wrkdetails.asp' ||
            path === '/autotask/views/contracts/cost.aspx' ||
            path === '/autotask/views/administration/companysetup/neweditallocationcode.aspx' ||
            path === '/mvc/administrationsetup/invoicetemplate.mvc/editproperties';
    }

    // Create a fresh tab for `url` and activate it. Bypasses the URL-dedup
    // check in `openTab` — used by `duplicateTab` so two tabs can legitimately
    // point at the same Autotask entity.
    function createAndAddTab(url, seedFromTab, options) {
        if (!featuresEnabled()) return null;
        if (!state.viewport) {
            return null;
        }
        const opts = options || {};
        const nativeShell = isNativeShellTabUrl(url);
        const iframeEl = nativeShell ? null : createTabIframe(url);
        const loaderEl = nativeShell ? null : createTabPaneLoader();
        if (iframeEl) state.viewport.appendChild(iframeEl);
        if (loaderEl) state.viewport.appendChild(loaderEl);
        const fallback = fallbackTabMetadataForUrl(url);
        const type = tabTypeForUrl(url);

        const tab = {
            id: state.nextId++,
            url: url,
            title: (seedFromTab && seedFromTab.title) || fallback.title,
            number: (seedFromTab && seedFromTab.number) || fallback.number,
            contact: (seedFromTab && seedFromTab.contact) || fallback.contact,
            primaryResource: (seedFromTab && seedFromTab.primaryResource) || null,
            pinned: false,
            color: (seedFromTab && seedFromTab.color) || '',
            priority: (seedFromTab && seedFromTab.priority) || '',
            status: (seedFromTab && seedFromTab.status) || '',
            lastActivity: (seedFromTab && seedFromTab.lastActivity) || '',
            pageWarning: !!(seedFromTab && seedFromTab.pageWarning),
            hoverFields: normalizeHoverFields(seedFromTab && seedFromTab.hoverFields),
            metadataFields: normalizeMetadataFields((seedFromTab && seedFromTab.metadataFields) || fallbackMetadataFields(type, fallback)),
            iframeEl: iframeEl,
            loaderEl: loaderEl,
            tabEl: null,
            nativeShell: nativeShell,
            loading: !nativeShell,
            loadStarted: true,
        };
        addTabToList(tab);
        renderTabs();
        if (opts.activate === false) {
            syncTabPaneState();
            updateHomeTabActive();
        } else {
            activateTab(tab.id);
        }
        requestSyncGeometry();
        saveTabs();
        return tab;
    }

    function duplicateTab(srcTab) {
        if (!srcTab || !srcTab.url) return;
        // Seed metadata from the source so the new tab shows the right title
        // immediately instead of falling back to "Loading..." until the iframe
        // re-extracts. The iframe will overwrite these once it loads.
        createAndAddTab(srcTab.url, srcTab);
    }

    function copyTabLink(tab) {
        if (!tab || !tab.url) return;
        void copyTextToClipboard(canonicalTabUrl(tab.url));
    }

    // Best-effort clipboard write. Uses async Clipboard API when available;
    // falls back to a hidden textarea + execCommand for older contexts.
    function copyTextToClipboard(text) {
        if (!text) return Promise.resolve(false);
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                return navigator.clipboard.writeText(String(text)).then(
                    function () { return true; },
                    function () { return legacyCopy(text); }
                );
            }
        } catch (e) { /* fall through */ }
        return Promise.resolve(legacyCopy(text));
    }
    function legacyCopy(text) {
        try {
            const ta = document.createElement('textarea');
            ta.value = String(text);
            ta.style.position = 'fixed';
            ta.style.left = '-9999px';
            ta.style.top = '0';
            document.body.appendChild(ta);
            ta.select();
            const ok = document.execCommand && document.execCommand('copy');
            ta.remove();
            return !!ok;
        } catch (e) {
            return false;
        }
    }

    function shouldPreserveSparseNavMetadata(url) {
        return tabTypeForUrl(url) === 'project';
    }

    function parsePurchaseOrderNumberFromTitle(rawTitle) {
        const match = String(rawTitle || '').match(/\(ID:\s*([^)]+)\)/i);
        if (!match || !match[1]) return '';
        return ('ID ' + match[1]).trim().slice(0, 40);
    }

    function normalizePurchaseOrderNavData(tab, data) {
        if (!tab) return null;
        if (tabTypeForUrl(tab.url || '') !== 'purchaseorder') return null;

        const incomingTitle = typeof data.title === 'string' ? data.title.trim() : '';
        const incomingNumber = typeof data.number === 'string' ? data.number.trim() : data.number;

        return {
            title: /purchase order/i.test(incomingTitle) ? 'Purchase Order' : (incomingTitle || null),
            number: incomingNumber || parsePurchaseOrderNumberFromTitle(incomingTitle) || null,
        };
    }

    function handleMessage(event) {
        const data = event.data;
        if (!data || data.__ns !== AUTOTASKTABS.MSG_NS) return;

        if (data.type === 'all-state-request') {
            broadcastAllFrameState();
            return;
        }

        if (data.type === 'improved-scrollbars-request') {
            const respond = function () {
                syncImprovedScrollbarsState();
            };
            if (!state.bar && AUTOTASKTABS.loadSettings) {
                void AUTOTASKTABS.loadSettings().then(respond).catch(respond);
            } else {
                respond();
            }
            return;
        }

        if (data.type === 'feature-enabled-request') {
            broadcastFeatureEnabledState();
            return;
        }

        if (!featuresEnabled()) return;

        if (data.type === 'close-frame' || data.type === 'close-peek') {
            if (windowBelongsToPeek(event.source)) {
                if (typeof state.peekOriginTabId !== 'number') {
                    let openerWindow = null;
                    try { openerWindow = event.source && event.source.opener; } catch (e) {}
                    const openerTab = openerWindow ? findTabFromWindow(openerWindow) : null;
                    const activeTab = state.activeId !== null ? tabById(state.activeId) : null;
                    const fallbackOriginTab = openerTab || activeTab;
                    if (fallbackOriginTab && typeof fallbackOriginTab.id === 'number') {
                        state.peekOriginTabId = fallbackOriginTab.id;
                    }
                }
                closePeekModal(false, { refreshOrigin: true });
                return;
            }
            const tab = findTabFromWindow(event.source);
            if (tab) {
                // If this tab was opened as the popout child of another
                // tab (Note / Time Entry popout), refresh the original
                // tab so its in-place dialog content reflects any saves
                // the user made before clicking Save & Quit.
                const popoutOriginTabId = typeof tab.popoutOriginTabId === 'number'
                    ? tab.popoutOriginTabId
                    : null;
                closeTab(tab.id);
                if (popoutOriginTabId !== null) {
                    const originTab = tabById(popoutOriginTabId);
                    if (originTab) refreshTabIframe(originTab);
                }
                return;
            }
            return;
        }

        if (data.type === 'open' && data.url) {
            openTab(data.url);
            return;
        }

        if (data.type === 'open-dialog-popout' && data.url && Array.isArray(data.fields)) {
            handleDialogPopoutMessage(event.source, data);
            return;
        }

        if (data.type === 'umbrella-open' && data.url) {
            try {
                const targetUrl = AUTOTASKTABS.toAbsoluteUrl(data.url);
                if (!isUmbrellaContractHomeUrl(targetUrl)) return;
                if (useExperimentalUmbrellaContractFrameTabs()) {
                    openTabDirect(targetUrl);
                    return;
                }
                openUrlOnHome(targetUrl);
            } catch (e) {}
            return;
        }

        if (data.type === 'umbrella-open-duplicate' && data.url) {
            try {
                const targetUrl = AUTOTASKTABS.toAbsoluteUrl(data.url);
                if (!isUmbrellaContractHomeUrl(targetUrl)) return;
                if (useExperimentalUmbrellaContractFrameTabs()) {
                    createAndAddTab(targetUrl, null, { activate: false });
                    return;
                }
                openUrlOnHome(targetUrl);
            } catch (e) {}
            return;
        }

        if (data.type === 'contract-open' && data.url) {
            try {
                const targetUrl = experimentalContractTabUrl(AUTOTASKTABS.toAbsoluteUrl(data.url));
                openTab(targetUrl);
            } catch (e) {}
            return;
        }

        if (data.type === 'contract-open-duplicate' && data.url) {
            try {
                const targetUrl = experimentalContractTabUrl(AUTOTASKTABS.toAbsoluteUrl(data.url));
                createAndAddTab(targetUrl, null, { activate: false });
            } catch (e) {}
            return;
        }

        if (data.type === 'native-open' && data.url) {
            try {
                const targetUrl = AUTOTASKTABS.toAbsoluteUrl(data.url);
                if (isUmbrellaContractHomeUrl(targetUrl) && useExperimentalUmbrellaContractFrameTabs()) {
                    openTab(targetUrl);
                    return;
                }
                if (!AUTOTASKTABS.isNativeHomeUrl(targetUrl)) return;
                if (isNativeShellTabUrl(targetUrl)) {
                    openNativeShellTab(targetUrl);
                    return;
                }
                activateHome();
                if (location.href !== targetUrl) location.assign(targetUrl);
            } catch (e) {}
            return;
        }

        if (data.type === 'open-peek' && data.url) {
            if (isContractEditUrl(data.url)) {
                openContractEditWithProbe(data.url, event.source);
                return;
            }
            const allowConversion = shouldAllowProgrammaticPeekConversion(data.url);
            openUrlInPeek(data.url, {
                openerWindow: event.source,
                allowOpenInTab: allowConversion,
                allowSplit: allowConversion,
            });
            return;
        }

        if (data.type === 'open-duplicate' && data.url) {
            createAndAddTab(data.url, null, { activate: false });
            return;
        }

        if (data.type === 'map' && data.url) {
            openMapModal(data.url);
            return;
        }

        if (data.type === 'frame-interaction') {
            const tab = findTabFromWindow(event.source);
            closeTabContextMenu();
            if (!tab || state.activeId === tab.id) return;
            activateTab(tab.id, { recordPrevious: false });
            return;
        }

            if (data.type === 'nav') {
            const tab = findTabFromWindow(event.source);
            if (!tab) return;
            const isDirectTabFrame = !!(tab.iframeEl && event.source === tab.iframeEl.contentWindow);
            if (data.url && isDirectTabFrame) tab.url = data.url;
            if (isUnsubmittedTimesheetsReportUrl(tab.url)) {
                const fallback = unsubmittedTimesheetsMetadata();
                tab.title = fallback.title;
                tab.number = '';
                tab.contact = '';
                tab.primaryResource = null;
                tab.priority = '';
                tab.status = '';
                tab.lastActivity = '';
                tab.hoverFields = [];
                tab.metadataFields = fallbackMetadataFields('timesheet', fallback);
                updateTabEl(tab);
                saveTabs();
                return;
            }
            const preservedRefreshMetadata = tab.preservedRefreshMetadata || null;
            const navHasRichMetadata = hasRichNavMetadata(data);
            const preserveRefreshMetadata = !!(preservedRefreshMetadata && !navHasRichMetadata);
            if (preserveRefreshMetadata) {
                restoreTabMetadataSnapshot(tab, preservedRefreshMetadata);
            } else if (preservedRefreshMetadata && navHasRichMetadata) {
                tab.preservedRefreshMetadata = null;
            }
            const preserveSparse = preserveRefreshMetadata || shouldPreserveSparseNavMetadata(tab.url);
            const normalizedPurchaseOrderNav = normalizePurchaseOrderNavData(tab, data);
            const navTitle = normalizedPurchaseOrderNav && normalizedPurchaseOrderNav.title !== null
                ? normalizedPurchaseOrderNav.title
                : data.title;
            const navBrowserTitle = typeof data.browserTitle === 'string' ? data.browserTitle.trim() : '';
            const navNumber = normalizedPurchaseOrderNav && normalizedPurchaseOrderNav.number !== null
                ? normalizedPurchaseOrderNav.number
                : data.number;
            if (!preserveRefreshMetadata && navTitle && (!preserveSparse || navTitle.trim())) tab.title = navTitle;
            if (navBrowserTitle) tab.browserTitle = navBrowserTitle;
            if (navNumber !== undefined && navNumber !== null) {
                if (!preserveRefreshMetadata && (!preserveSparse || (typeof navNumber === 'string' ? navNumber.trim() : navNumber))) {
                    tab.number = navNumber;
                }
            }
            if (data.contact !== undefined) {
                if (!preserveRefreshMetadata && (!preserveSparse || (typeof data.contact === 'string' ? data.contact.trim() : data.contact))) {
                    tab.contact = data.contact;
                }
            }
            if (!preserveRefreshMetadata && data.primaryResource !== undefined) tab.primaryResource = data.primaryResource || null;
            if (!preserveRefreshMetadata && data.priority !== undefined) tab.priority = data.priority || '';
            if (!preserveRefreshMetadata && data.status !== undefined) tab.status = data.status || '';
            if (!preserveRefreshMetadata && data.lastActivity !== undefined) tab.lastActivity = data.lastActivity || '';
            if (!preserveRefreshMetadata && data.pageWarning !== undefined) tab.pageWarning = !!data.pageWarning;
            if (data.hoverFields !== undefined) {
                const nextHoverFields = normalizeHoverFields(data.hoverFields);
                if (!preserveSparse || nextHoverFields.length) tab.hoverFields = nextHoverFields;
            }
            if (data.metadataFields !== undefined) {
                tab.metadataFields = preserveSparse
                    ? mergeMetadataFieldsPreservingExisting(tab.metadataFields, data.metadataFields)
                    : normalizeMetadataFields(data.metadataFields);
            }
            updateTabEl(tab);
            saveTabs();
            return;
        }

        if (data.type === 'nav-start') {
            // Ignore beforeunload fired from any iframe that belongs to one of
            // our tabs — those already have their own per-tab loader overlay.
            // What's left is native Autotask chrome navigating, which means the
            // Home view is about to refresh. Show the Home-tab spinner until
            // the native iframe fires `load`.
            if (findTabFromWindow(event.source)) return;
            startNativeHomeLoading();
            return;
        }

        if (data.type === 'native-title') {
            // Iframe bridge reports its <title>. Tab iframes get their label
            // from the existing 'nav' metadata path, so we ignore those here
            // and only honor titles coming from the native iframe (the page
            // backing the Home tab). During browser refresh a restored tab can
            // report before it is fully registered, so require a positive
            // native-frame source match instead of trusting "not a tab".
            if (findTabFromWindow(event.source)) return;
            if (!findNativeFrameFromWindow(event.source)) return;
            const nativeUrl = currentNativeFrameUrl();
            if (isUmbrellaContractHomeUrl(nativeUrl)) {
                syncUmbrellaContractHomeMetadata(nativeUrl, findNativeFrameFromWindow(event.source));
                scheduleUmbrellaContractHomeMetadataSync(nativeUrl, findNativeFrameFromWindow(event.source));
                return;
            }
            clearHomeMetadata();
            setHomeTitle(homeTitleForNativeUrl(nativeUrl) || data.title);
            return;
        }
    }

    function installTopLevelNavigationInterception() {
        if (window.__AUTOTASKTABSNavInterceptInstalled) return;
        window.__AUTOTASKTABSNavInterceptInstalled = true;

        const originalPushState = history.pushState.bind(history);
        const originalReplaceState = history.replaceState.bind(history);

        function intercept(originalFn, stateArg, unusedTitle, urlArg) {
            if (!featuresEnabled()) return originalFn(stateArg, unusedTitle, urlArg);
            const handledUrl = urlArg ? AUTOTASKTABS.extractHandledUrlFromLandingPageUrl(urlArg) : null;
            if (handledUrl) {
                openTab(handledUrl);
                return;
            }
            return originalFn(stateArg, unusedTitle, urlArg);
        }

        history.pushState = function (stateArg, unusedTitle, urlArg) {
            return intercept(originalPushState, stateArg, unusedTitle, urlArg);
        };

        history.replaceState = function (stateArg, unusedTitle, urlArg) {
            return intercept(originalReplaceState, stateArg, unusedTitle, urlArg);
        };
    }

    function injectTopLevelPageBridgeFromShell() {
        if (!AUTOTASKTABS.isTop) return;
        if (document.documentElement.dataset.autotasktabsPageBridgeInjected === 'true') {
            broadcastFeatureEnabledState();
            return;
        }
        const runtime = getRuntimeApi();
        try {
            if (!runtime || typeof runtime.getURL !== 'function') return;
        } catch (e) {
            return;
        }
        document.documentElement.dataset.autotasktabsPageBridgeInjected = 'true';
        const script = document.createElement('script');
        try {
            script.src = runtime.getURL('functions/autotask/tabs/autotaskTabsPageBridge.js');
        } catch (e) {
            document.documentElement.dataset.autotasktabsPageBridgeInjected = 'false';
            return;
        }
        script.onload = function () {
            script.remove();
            broadcastFeatureEnabledState();
        };
        (document.documentElement || document.head).appendChild(script);
    }

    function installTopLevelRouteWatchers() {
        if (state.topLevelRouteWatchInstalled) return;
        state.topLevelRouteWatchInstalled = true;
        window.addEventListener('popstate', maybePromoteTopLevelLandingRoute);
        window.addEventListener('hashchange', maybePromoteTopLevelLandingRoute);
        window.setInterval(maybePromoteTopLevelLandingRoute, 750);
        maybePromoteTopLevelLandingRoute();
    }

    function maybePromoteTopLevelLandingRoute() {
        if (!featuresEnabled()) return;
        if (!state.viewport) return;
        syncNativeHomeRouteFromCurrentFrame();
        const topHref = location.href;
        const firstObservation = !state.lastObservedTopHref;
        const hrefChanged = topHref !== state.lastObservedTopHref;
        state.lastObservedTopHref = topHref;
        if (hrefChanged && state.nativeShellSuppressUrl && canonicalTabUrl(topHref) !== state.nativeShellSuppressUrl) {
            state.nativeShellSuppressUrl = '';
        }

        // Onyx's same-document pushState to an Umbrella Contract page never
        // routes through openUrlOnHome / handleNativeFrameLoad, so neither
        // path has a chance to mark the eager-reload flag — leaving every
        // other deferred AUTOTASKTABS tab parked. Catch that case here: when the top
        // URL changes to an umbrella page, mark the flag and schedule the
        // reloader so the rest of the tab strip starts loading in the
        // background. The flag is also durable across full reloads.
        if (hrefChanged && !firstObservation && isUmbrellaContractHomeUrl(topHref)) {
            markUmbrellaContractFrameReload();
            window.setTimeout(reloadLoadedFramesAfterUmbrellaContractWhenReady, 0);
        }

        if (isUmbrellaContractHomeUrl(topHref)) {
            syncUmbrellaContractHomeMetadata(topHref, document);
            scheduleUmbrellaContractHomeMetadataSync(topHref, document);
            state.lastObservedTopHandledUrl = '';
            return;
        }

        const handledUrl = AUTOTASKTABS.extractHandledUrlFromLandingPageUrl(topHref);
        if (!handledUrl) {
            const active = state.activeId === null ? null : tabById(state.activeId);
            if (hrefChanged && !firstObservation && active && shouldMoveLegacyContractRedirectToHome(active, topHref)) {
                state.homePersistedUrl = topHref;
                state.homePersistedTitle = '';
                activateHome();
                closeTab(active.id);
                state.lastObservedTopHandledUrl = '';
                saveTabs();
                return;
            }
            state.lastObservedTopHandledUrl = '';
            if (hrefChanged && !firstObservation && state.activeId !== null) {
                activateHome();
            }
            return;
        }
        if (handledUrl === state.lastObservedTopHandledUrl && !hrefChanged) return;
        state.lastObservedTopHandledUrl = handledUrl;
        openTab(handledUrl);
    }

    // Autotask exposes the active theme via inline CSS custom properties on
    // <body> (`--is-theme-dark: 0|1`, `color-scheme: light|dark`). Mirror that
    // onto <html> as `autotasktabs-dark` so the dark-mode rules above apply to all
    // shell-injected elements (bar, viewport, modals, context menu, etc.)
    // without each consumer needing to subscribe.
    function detectAutotaskDarkMode() {
        const body = document.body;
        if (!body) return false;
        const inline = (body.style.getPropertyValue('--is-theme-dark') || '').trim();
        if (inline === '1') return true;
        if (inline === '0') return false;
        try {
            const computed = getComputedStyle(body).getPropertyValue('--is-theme-dark').trim();
            if (computed === '1') return true;
            if (computed === '0') return false;
            const scheme = (getComputedStyle(body).colorScheme || '').toLowerCase();
            if (scheme.includes('dark') && !scheme.includes('light')) return true;
        } catch (e) {}
        return false;
    }

    function effectiveDarkMode() {
        return detectAutotaskDarkMode();
    }

    function applyAutotaskTheme(force) {
        const dark = effectiveDarkMode();
        if (!force && state.lastAppliedDarkMode === dark) return;
        state.lastAppliedDarkMode = dark;
        document.documentElement.classList.toggle('autotasktabs-dark', dark);
        for (const tab of state.tabs) applyTabColorStyle(tab);
    }

    function clearAutotaskTabsAccentColorVariables() {
        document.documentElement.style.removeProperty('--autotasktabs-accent-color');
        document.documentElement.style.removeProperty('--autotasktabs-accent-color-muted');
        document.documentElement.style.removeProperty('--autotasktabs-accent-color-strong');
        document.documentElement.style.removeProperty('--autotasktabs-accent-color-soft');
        document.documentElement.style.removeProperty('--autotasktabs-accent-link-color');
        document.documentElement.style.removeProperty('--autotasktabs-accent-active-bg');
        document.documentElement.style.removeProperty('--autotasktabs-accent-scrollbar');
        document.documentElement.style.removeProperty('--autotasktabs-accent-scrollbar-hover');
        document.documentElement.style.removeProperty('--autotasktabs-accent-scrollbar-dark');
        document.documentElement.style.removeProperty('--autotasktabs-accent-scrollbar-dark-hover');
        document.documentElement.style.removeProperty('--autotasktabs-accent-icon-filter');
        document.documentElement.style.removeProperty('--autotasktabs-titlebar-icon-filter');
    }

    function applyAutotaskTabsAccentColorVariables(color) {
        document.documentElement.style.setProperty('--autotasktabs-accent-color', color);
        document.documentElement.style.setProperty('--autotasktabs-accent-color-muted', colorToRgba(color, 0.58));
        document.documentElement.style.setProperty('--autotasktabs-accent-color-strong', colorToRgba(color, 0.72));
        document.documentElement.style.setProperty('--autotasktabs-accent-color-soft', colorToRgba(color, 0.5));
        document.documentElement.style.setProperty('--autotasktabs-accent-link-color', color);
        document.documentElement.style.setProperty('--autotasktabs-accent-active-bg', colorToRgba(color, 0.15));
        document.documentElement.style.setProperty('--autotasktabs-accent-scrollbar', colorToRgba(color, 0.5));
        document.documentElement.style.setProperty('--autotasktabs-accent-scrollbar-hover', colorToRgba(color, 0.75));
        document.documentElement.style.setProperty('--autotasktabs-accent-scrollbar-dark', colorToRgba(color, 0.58));
        document.documentElement.style.setProperty('--autotasktabs-accent-scrollbar-dark-hover', colorToRgba(color, 0.82));
        document.documentElement.style.setProperty('--autotasktabs-accent-icon-filter', colorToSpriteFilter(color));
        document.documentElement.style.setProperty('--autotasktabs-titlebar-icon-filter', colorToTitlebarIconFilter(color));
    }

    function scheduleAutotaskThemeApply() {
        if (state.themeRaf) return;
        state.themeRaf = window.requestAnimationFrame(function () {
            state.themeRaf = 0;
            applyAutotaskTheme(false);
        });
    }

    function applyBarOrientationClass() {
        document.documentElement.classList.toggle('autotasktabs-bar-vertical', isVerticalBar());
        updateResizableBarClasses();
    }

    function applyBrowserCompatibilityClasses() {
        document.documentElement.classList.toggle('autotasktabs-safari-webkit', IS_SAFARI_WEBKIT);
    }

    function applyPageFrameClass() {
        const enabled = !!state.roundedPageFramesEnabled;
        document.documentElement.classList.toggle('autotasktabs-rounded-pages', enabled);
        if (state.viewport) state.viewport.classList.toggle('rounded-pages', enabled);
    }

    function improvedScrollbarsActive() {
        return featuresEnabled() && !!state.improvedScrollbarsEnabled;
    }

    function applyImprovedScrollbarsClass() {
        document.documentElement.classList.toggle('autotasktabs-improved-scrollbars', improvedScrollbarsActive());
    }

    function broadcastImprovedScrollbarsState() {
        const rootStyle = getComputedStyle(document.documentElement);
        const payload = {
            __ns: AUTOTASKTABS.MSG_NS,
            type: 'improved-scrollbars',
            enabled: improvedScrollbarsActive(),
            accentColor: rootStyle.getPropertyValue('--autotasktabs-accent-link-color').trim()
                || rootStyle.getPropertyValue('--autotasktabs-accent-color').trim(),
            scrollbar: rootStyle.getPropertyValue('--autotasktabs-accent-scrollbar').trim() || colorToRgba('#7da7c9', 0.5),
            scrollbarHover: rootStyle.getPropertyValue('--autotasktabs-accent-scrollbar-hover').trim() || colorToRgba('#7da7c9', 0.75),
            scrollbarDark: rootStyle.getPropertyValue('--autotasktabs-accent-scrollbar-dark').trim() || colorToRgba('#7da7c9', 0.58),
            scrollbarDarkHover: rootStyle.getPropertyValue('--autotasktabs-accent-scrollbar-dark-hover').trim() || colorToRgba('#7da7c9', 0.82),
            iconFilter: rootStyle.getPropertyValue('--autotasktabs-accent-icon-filter').trim() || 'none',
            titlebarIconFilter: rootStyle.getPropertyValue('--autotasktabs-titlebar-icon-filter').trim() || 'none',
        };
        function postToFrames(win) {
            try {
                for (let i = 0; i < win.frames.length; i++) {
                    const child = win.frames[i];
                    try { child.postMessage(payload, '*'); } catch (e) {}
                    try { postToFrames(child); } catch (e) {}
                }
            } catch (e) {}
        }
        postToFrames(window);
    }

    function syncImprovedScrollbarsState() {
        applyImprovedScrollbarsClass();
        broadcastImprovedScrollbarsState();
    }

    function broadcastAllFrameState() {
        broadcastFeatureEnabledState();
        applyImprovedScrollbarsClass();
        broadcastImprovedScrollbarsState();
    }

    function setBarOrientation(value) {
        const next = value === 'vertical' ? 'vertical' : 'horizontal';
        if (state.barOrientation === next) return;
        state.barOrientation = next;
        AUTOTASKTABS.state.barOrientation = next;
        applyBarOrientationClass();
        // Tear down any reservation that was applied for the old axis so the
        // next syncGeometry rebuilds it on the right axis.
        if (state.nativeFrame) clearNativeChromeReservation(state.nativeFrame);
        // Drop inline width/height the bar carried from the previous axis so
        // the new orientation's CSS + syncGeometry can reset cleanly.
        if (state.bar) {
            state.bar.style.width = '';
            state.bar.style.height = '';
        }
        if (state.viewport) {
            state.viewport.style.width = '';
            state.viewport.style.height = '';
        }
        requestSyncGeometry();
    }


    function installThemeWatcher() {
        applyAutotaskTheme(true);
        if (state.themeObserver || !document.body) return;
        state.themeObserver = new MutationObserver(scheduleAutotaskThemeApply);
        state.themeObserver.observe(document.body, {
            attributes: true,
            attributeFilter: ['style', 'class'],
        });
    }

    // Toolbar action: clicking the extension icon in the browser toolbar sends
    // a message from `autotasktabs-background.js` to ask us to open the Settings modal.
    // Only installed at the top frame (this IIFE bails out otherwise).
    function installToolbarMessageListener() {
        const runtime = getRuntimeApi();
        try {
            if (!runtime || !runtime.onMessage) return;
        } catch (e) {
            return;
        }
        const listener = function (msg) {
            if (!msg) return;
            if (msg.__autotasktabsExternalOpen && msg.type === 'open-autotask-url' && msg.url && AUTOTASKTABS.isHandledUrl(msg.url)) {
                if (featuresEnabled()) openTab(msg.url);
                return;
            }
            if (msg.__supportToolsAutotaskTabs && msg.type === 'set-enabled') {
                state.extensionEnabled = msg.enabled !== false;
                AUTOTASKTABS.state.extensionEnabled = state.extensionEnabled;
                applyExtensionEnabledState();
                return;
            }
            if (msg.__autotasktabsToolbar && msg.type === 'open-settings') {
                try { toggleSettingsModal(); } catch (e) {}
                return;
            }
            if (msg.__autotasktabsCommand && msg.type === 'close-all-tabs') {
                try { closeAllTabs(); } catch (e) {}
            }
        };
        try {
            runtime.onMessage.addListener(listener);
        } catch (e) {}
    }
    installToolbarMessageListener();

    function registerShellWithBackground() {
        const runtime = getRuntimeApi();
        try {
            if (!runtime || typeof runtime.sendMessage !== 'function') return;
            const sending = runtime.sendMessage({
                __autotasktabsShellReady: true,
                type: 'shell-ready',
            });
            if (sending && typeof sending.catch === 'function') {
                sending.catch(function () {});
            }
        } catch (e) {}
    }

    AUTOTASKTABS.mount = async function mount() {
        if (state.bar) return;
        state.mountTime = Date.now();
        applyBrowserCompatibilityClasses();
        applyPageFrameClass();
        applyImprovedScrollbarsClass();
        injectStyles();

        const bar = document.createElement('div');
        bar.className = 'at-tabs-bar';
        bar.addEventListener('mouseenter', function (event) {
            scheduleTabBarHoverExpand(event);
        });
        bar.addEventListener('mousemove', function (event) {
            scheduleTabBarHoverExpand(event);
        });
        bar.addEventListener('mouseleave', function () {
            scheduleTabBarHoverCollapse();
        });

        const viewport = document.createElement('div');
        viewport.className = 'at-tabs-viewport empty';

        const splitResizeHandles = [];
        for (let i = 0; i < 3; i++) {
            const splitResizeHandle = document.createElement('div');
            splitResizeHandle.className = 'at-tabs-split-resize-handle';
            splitResizeHandle.dataset.splitHandle = String(i);
            const splitResizeGrip = document.createElement('div');
            splitResizeGrip.className = 'at-tabs-split-resize-grip';
            splitResizeGrip.dataset.splitHandle = String(i);
            splitResizeGrip.title = 'Drag to resize split tabs';
            splitResizeGrip.addEventListener('pointerdown', startSplitResize);
            splitResizeGrip.addEventListener('contextmenu', function (event) {
                event.preventDefault();
                event.stopPropagation();
                openSplitHandleContextMenu(event.clientX, event.clientY);
            });
            splitResizeHandle.appendChild(splitResizeGrip);
            viewport.appendChild(splitResizeHandle);
            splitResizeHandles.push(splitResizeHandle);
        }

        const dragSplitIndicator = document.createElement('div');
        dragSplitIndicator.className = 'at-tabs-drag-split-indicator';
        dragSplitIndicator.setAttribute('aria-hidden', 'true');
        const dragSplitPane = document.createElement('div');
        dragSplitPane.className = 'at-tabs-drag-split-pane';
        dragSplitIndicator.appendChild(dragSplitPane);
        dragSplitIndicator.addEventListener('dragenter', handleDragSplitOver);
        dragSplitIndicator.addEventListener('dragover', handleDragSplitOver);
        dragSplitIndicator.addEventListener('dragleave', handleDragSplitLeave);
        dragSplitIndicator.addEventListener('drop', handleDragSplitDrop);

        const homeCover = document.createElement('div');
        homeCover.className = 'at-tabs-home-cover';

        const loader = document.createElement('div');
        loader.className = 'at-tabs-loader';
        viewport.appendChild(loader);
        viewport.appendChild(dragSplitIndicator);

        document.body.appendChild(homeCover);
        document.body.appendChild(viewport);
        document.body.appendChild(bar);

        state.bar = bar;
        state.viewport = viewport;
        state.homeCover = homeCover;
        state.loader = loader;
        state.splitResizeHandle = splitResizeHandles[0];
        state.splitResizeHandles = splitResizeHandles;
        state.dragSplitIndicator = dragSplitIndicator;
        state.dragSplitPane = dragSplitPane;
        applySplitRatio();

        renderHomeTab();
        // Show the spinner on the Home tab until the native iframe reports
        // its real <title>. Cleared in `setHomeTitle()` once the bridge posts
        // a `native-title` message; also cleared by `handleNativeFrameLoad`
        // as a safety net if the title never arrives.
        setHomeLoading(true);
        renderTabs();
        await AUTOTASKTABS.loadSettings();
        // Sync local state with values just loaded from storage.
        if (['horizontal', 'vertical'].includes(AUTOTASKTABS.state.barOrientation)) {
            state.barOrientation = AUTOTASKTABS.state.barOrientation;
        }
        state.themePreference = 'auto';
        AUTOTASKTABS.state.themePreference = 'auto';
        if (typeof AUTOTASKTABS.state.extensionEnabled === 'boolean') {
            state.extensionEnabled = AUTOTASKTABS.state.extensionEnabled;
        }
        if (typeof AUTOTASKTABS.state.openNewTabsAtStart === 'boolean') {
            state.openNewTabsAtStart = AUTOTASKTABS.state.openNewTabsAtStart;
        }
        if (typeof AUTOTASKTABS.state.showTabBarOnNonIframePages === 'boolean') {
            state.showTabBarOnNonIframePages = AUTOTASKTABS.state.showTabBarOnNonIframePages;
        }
        if (typeof AUTOTASKTABS.state.resizableTabBarEnabled === 'boolean') {
            state.resizableTabBarEnabled = AUTOTASKTABS.state.resizableTabBarEnabled;
        }
        if (typeof AUTOTASKTABS.state.horizontalCompactTabsEnabled === 'boolean') {
            state.horizontalCompactTabsEnabled = AUTOTASKTABS.state.horizontalCompactTabsEnabled;
        }
        if (typeof AUTOTASKTABS.state.roundedPageFramesEnabled === 'boolean') {
            state.roundedPageFramesEnabled = AUTOTASKTABS.state.roundedPageFramesEnabled;
        }
        if (typeof AUTOTASKTABS.state.experimentalUmbrellaContractFrameTabs === 'boolean') {
            state.experimentalUmbrellaContractFrameTabs = AUTOTASKTABS.state.experimentalUmbrellaContractFrameTabs;
        }
        void syncUmbrellaContractFrameRules(state.experimentalUmbrellaContractFrameTabs);
        if (AUTOTASKTABS.state.defaultEnabledSettingsMigration !== 'hide-rounded-peek-2026-05-09') {
            state.roundedPageFramesEnabled = DEFAULT_ROUNDED_PAGE_FRAMES_ENABLED;
            AUTOTASKTABS.state.roundedPageFramesEnabled = DEFAULT_ROUNDED_PAGE_FRAMES_ENABLED;
            state.peekMoveResizeEnabled = true;
            AUTOTASKTABS.state.peekMoveResizeEnabled = true;
            AUTOTASKTABS.state.defaultEnabledSettingsMigration = 'hide-rounded-peek-2026-05-09';
            void AUTOTASKTABS.saveSettings();
        }
        if (IS_FIREFOX_BROWSER && AUTOTASKTABS.state.firefoxRoundedPageFramesDefaultMigration !== 'off-by-default-2026-05-14') {
            state.roundedPageFramesEnabled = false;
            AUTOTASKTABS.state.roundedPageFramesEnabled = false;
            AUTOTASKTABS.state.firefoxRoundedPageFramesDefaultMigration = 'off-by-default-2026-05-14';
            void AUTOTASKTABS.saveSettings();
        }
        if (typeof AUTOTASKTABS.state.improvedScrollbarsEnabled === 'boolean') {
            state.improvedScrollbarsEnabled = AUTOTASKTABS.state.improvedScrollbarsEnabled;
        }
        applyPageFrameClass();
        syncImprovedScrollbarsState();
        state.tabLine2Fields = normalizeTabLineSettings(AUTOTASKTABS.state.tabLine2Fields, 2);
        state.tabLine3Fields = normalizeTabLineSettings(AUTOTASKTABS.state.tabLine3Fields, 3);
        state.tabBarWidth = normalizedTabBarWidth(AUTOTASKTABS.state.tabBarWidth);
        AUTOTASKTABS.state.tabBarWidth = state.tabBarWidth;
        applyBarOrientationClass();
        applyExtensionEnabledState(false);
        if (featuresEnabled()) {
            // Two ways we can know mount is happening "after an umbrella nav":
            //  1. Flag was set in sessionStorage by openUrlOnHome /
            //     maybePromoteTopLevelLandingRoute before the refresh.
            //  2. The flag wasn't set in time (Autotask hard-refreshed before
            //     either path could run), but the current top URL OR the
            //     native iframe URL is an umbrella page right now. In that
            //     case mount itself can detect it and trigger the eager
            //     reload — without depending on the flag at all.
            const onUmbrellaUrlNow = isUmbrellaContractHomeUrl(location.href)
                || isUmbrellaContractHomeUrl(currentNativeFrameUrl());
            const reloadFramesAfterUmbrellaContract = hasPendingUmbrellaContractFrameReload()
                || onUmbrellaUrlNow;
            await restoreTabs();
            state.tabsRestored = true;
            maybePromoteTopLevelLandingRoute();
            openPendingDirectHandledRoute();
            if (reloadFramesAfterUmbrellaContract) {
                // Set the flag if it isn't already, so the WhenReady retry
                // loop has something to clear on success.
                if (!hasPendingUmbrellaContractFrameReload()) markUmbrellaContractFrameReload();
                window.setTimeout(reloadLoadedFramesAfterUmbrellaContractWhenReady, 0);
            }
            installTabsMetadataSyncWatcher();
            if (state.tabs.length) clearHomeLoading();
            if (!state.tabs.length) activateHome();
        }
        syncGeometry();
        installGeometrySync();
        installTabContextMenuDismissal();
        installThemeWatcher();
        // Native settings menu disabled - settings now managed via popup extension
        // installNativeSettingsMenuItemWatcher();
        startMetadataRefreshTimer();
        if (state.showTabBarOnNonIframePages) ensureNonIframeTitleWatcher();
        registerShellWithBackground();
    };

    AUTOTASKTABS.installTopLevelNavigationInterception = installTopLevelNavigationInterception;
    AUTOTASKTABS.maybePromoteTopLevelLandingRoute = maybePromoteTopLevelLandingRoute;
    AUTOTASKTABS.handleShellMessage = handleMessage;

    // Storage change listener to apply settings dynamically without page refresh
    if (AUTOTASKTABS.hasChromeStorage() && chrome.storage.onChanged) {
        chrome.storage.onChanged.addListener(function (changes, areaName) {
            if (areaName !== 'sync') return;
            const change = changes[AUTOTASKTABS.SETTINGS_STORAGE_KEY];
            const settings = change && change.newValue;
            if (!settings) return;
            // Reload settings and re-apply key UI settings
            if (AUTOTASKTABS.loadSettings) {
                AUTOTASKTABS.loadSettings().then(function() {
                    // Sync settings from AUTOTASKTABS.state to local state
                    if (typeof AUTOTASKTABS.state.barOrientation === 'string' && ['horizontal', 'vertical'].includes(AUTOTASKTABS.state.barOrientation)) {
                        state.barOrientation = AUTOTASKTABS.state.barOrientation;
                    }
                    if (typeof AUTOTASKTABS.state.roundedPageFramesEnabled === 'boolean') {
                        state.roundedPageFramesEnabled = AUTOTASKTABS.state.roundedPageFramesEnabled;
                    }
                    if (typeof AUTOTASKTABS.state.improvedScrollbarsEnabled === 'boolean') {
                        state.improvedScrollbarsEnabled = AUTOTASKTABS.state.improvedScrollbarsEnabled;
                    }
                    if (typeof AUTOTASKTABS.state.extensionEnabled === 'boolean') {
                        state.extensionEnabled = AUTOTASKTABS.state.extensionEnabled;
                    }
                    if (typeof AUTOTASKTABS.state.phoneLinksEnabled === 'boolean') {
                        state.phoneLinksEnabled = AUTOTASKTABS.state.phoneLinksEnabled;
                    }
                    if (typeof AUTOTASKTABS.state.ticketLinksEnabled === 'boolean') {
                        state.ticketLinksEnabled = AUTOTASKTABS.state.ticketLinksEnabled;
                    }
                    if (typeof AUTOTASKTABS.state.horizontalCompactTabsEnabled === 'boolean') {
                        state.horizontalCompactTabsEnabled = AUTOTASKTABS.state.horizontalCompactTabsEnabled;
                        updateResizableBarClasses();
                    }
                    // Re-apply settings that affect UI
                    applyPageFrameClass();
                    syncImprovedScrollbarsState();
                    applyBarOrientationClass();
                    // Re-render tabs if tab size changed
                    if (AUTOTASKTABS.state.tabLine2Fields && AUTOTASKTABS.state.tabLine3Fields) {
                        state.tabLine2Fields = normalizeTabLineSettings(AUTOTASKTABS.state.tabLine2Fields, 2);
                        state.tabLine3Fields = normalizeTabLineSettings(AUTOTASKTABS.state.tabLine3Fields, 3);
                        AUTOTASKTABS.state.tabLine2Fields = state.tabLine2Fields;
                        AUTOTASKTABS.state.tabLine3Fields = state.tabLine3Fields;
                    }
                    state.tabs.forEach(updateTabEl);
                    if (AUTOTASKTABS.setPhoneLinksEnabled) {
                        AUTOTASKTABS.setPhoneLinksEnabled(state.phoneLinksEnabled);
                    }
                    if (AUTOTASKTABS.setTicketLinksEnabled) {
                        AUTOTASKTABS.setTicketLinksEnabled(state.ticketLinksEnabled);
                    }
                    applyExtensionEnabledState();
                    // Refresh metadata to ensure enhanced tab details are populated
                    if (AUTOTASKTABS.requestAllTabMetadataRefresh) {
                        AUTOTASKTABS.requestAllTabMetadataRefresh();
                    }
                }).catch(function(e) {
                    console.warn('Failed to reload settings:', e);
                });
            }
        });
    }
})();


// Autotask Tabs - Top-level bootstrap IIFE. This runs in the top frame of every page
(function () {
    'use strict';

    const AUTOTASKTABS = window.__AUTOTASKTABS__;
    if (!AUTOTASKTABS || AUTOTASKTABS.bootstrapped) return;
    AUTOTASKTABS.bootstrapped = true;

    if (AUTOTASKTABS.isAllowedHost && !AUTOTASKTABS.isAllowedHost(location.href)) return;
    if (AUTOTASKTABS.isExcludedUrl && AUTOTASKTABS.isExcludedUrl(location.href)) return;

    const settingsReady = AUTOTASKTABS.loadSettings ? AUTOTASKTABS.loadSettings() : Promise.resolve();
    const DIRECT_HANDLED_OPEN_STORAGE_KEY = 'autotask-tabs-direct-handled-open-url-v1';

    function shouldPromoteDirectHandledTopRoute() {
        if (!AUTOTASKTABS.isTop) return false;
        if (!AUTOTASKTABS.isHandledUrl || !AUTOTASKTABS.isHandledUrl(location.href)) return false;
        if (AUTOTASKTABS.isDialogPopOutFromDialogUrl && AUTOTASKTABS.isDialogPopOutFromDialogUrl(location.href)) return false;
        if (AUTOTASKTABS.extractHandledUrlFromLandingPageUrl && AUTOTASKTABS.extractHandledUrlFromLandingPageUrl(location.href)) return false;
        if (AUTOTASKTABS.isNativeHomeUrl && AUTOTASKTABS.isNativeHomeUrl(location.href)) return false;
        if (AUTOTASKTABS.featuresEnabled && !AUTOTASKTABS.featuresEnabled()) return false;
        return true;
    }

    function sendRuntimeMessage(message) {
        const browserRuntime = typeof browser !== 'undefined' && browser && browser.runtime
            ? browser.runtime
            : null;
        if (browserRuntime && typeof browserRuntime.sendMessage === 'function') {
            try {
                return browserRuntime.sendMessage(message).catch(function () { return null; });
            } catch (e) {
                return Promise.resolve(null);
            }
        }

        const chromeRuntime = typeof chrome !== 'undefined' && chrome && chrome.runtime
            ? chrome.runtime
            : null;
        if (!chromeRuntime || typeof chromeRuntime.sendMessage !== 'function') {
            return Promise.resolve(null);
        }

        return new Promise(function (resolve) {
            try {
                chromeRuntime.sendMessage(message, function (response) {
                    try {
                        if (chromeRuntime.lastError) {
                            resolve(null);
                            return;
                        }
                    } catch (e) {}
                    resolve(response || null);
                });
            } catch (e) {
                resolve(null);
            }
        });
    }

    function sendDirectHandledRouteToExistingShell() {
        if (!shouldPromoteDirectHandledTopRoute()) return Promise.resolve(false);
        return sendRuntimeMessage({
            __autotasktabsDirectHandledOpen: true,
            type: 'open-in-existing-shell',
            url: location.href,
        }).then(function (response) {
            return !!(response && response.ok);
        });
    }

    function promoteDirectHandledTopRoute() {
        if (!shouldPromoteDirectHandledTopRoute()) return false;
        try {
            sessionStorage.setItem(DIRECT_HANDLED_OPEN_STORAGE_KEY, location.href);
            const shellUrl = new URL('/AutotaskOnyx/LandingPage', location.origin);
            shellUrl.searchParams.set('view', 'dashboard');
            location.replace(shellUrl.href);
            return true;
        } catch (e) {
            return false;
        }
    }

    function promoteDirectHandledTopRouteAsync() {
        if (!shouldPromoteDirectHandledTopRoute()) return Promise.resolve(false);
        return sendDirectHandledRouteToExistingShell().then(function (openedInExistingShell) {
            if (openedInExistingShell) return true;
            return promoteDirectHandledTopRoute();
        });
    }

    function initSettingsBackedFeatures() {
        return settingsReady.then(function () {
            if (AUTOTASKTABS.initPhoneLinks) {
                AUTOTASKTABS.initPhoneLinks();
            }
            if (AUTOTASKTABS.initTicketLinks) {
                AUTOTASKTABS.initTicketLinks();
            }
        });
    }

    function injectPageBridgeForTopFrame() {
        // autotasktabs-iframe-bridge.js bails on the top frame, so the page-bridge
        // (which lives in the page world and patches window.open /
        // window.close / HTMLFormElement.prototype.submit etc.) was never
        // installed at top. On Onyx pages where the popout dialog and
        // its hidden form live at the top frame, that meant our submit
        // override couldn't see Autotask's form.submit() call. Inject it
        // here so the override is present at the top too.
        if (document.documentElement.dataset.autotasktabsPageBridgeInjected === 'true') return;
        document.documentElement.dataset.autotasktabsPageBridgeInjected = 'true';

        const mount = document.documentElement || document.head;
        if (!mount) return;
        const runtime = typeof chrome !== 'undefined' && chrome && chrome.runtime
            ? chrome.runtime
            : (typeof browser !== 'undefined' && browser && browser.runtime ? browser.runtime : null);
        if (!runtime || typeof runtime.getURL !== 'function') return;

        const routesScript = document.createElement('script');
        const bridgeScript = document.createElement('script');
        try {
            routesScript.src = runtime.getURL('functions/autotask/tabs/autotaskTabsRoutes.js');
            bridgeScript.src = runtime.getURL('functions/autotask/tabs/autotaskTabsPageBridge.js');
        } catch (e) { return; }
        routesScript.onload = function () {
            routesScript.remove();
            mount.appendChild(bridgeScript);
        };
        routesScript.onerror = function () {
            routesScript.remove();
            mount.appendChild(bridgeScript);
        };
        bridgeScript.onload = function () { bridgeScript.remove(); };
        mount.appendChild(routesScript);
    }

    if (AUTOTASKTABS.isTop) {
        window.addEventListener('message', AUTOTASKTABS.handleShellMessage);
        injectPageBridgeForTopFrame();

        function initTopFrame() {
            void initSettingsBackedFeatures().then(function () {
                return promoteDirectHandledTopRouteAsync().then(function (promoted) {
                    if (promoted) return null;
                    return AUTOTASKTABS.mount();
                });
            });
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initTopFrame, { once: true });
        } else {
            initTopFrame();
        }

        return;
    }

    void settingsReady.then(function () {
        if (AUTOTASKTABS.featuresEnabled && AUTOTASKTABS.featuresEnabled() && AUTOTASKTABS.initIframeBridge) {
            AUTOTASKTABS.initIframeBridge();
        }
        return initSettingsBackedFeatures();
    });
})();


