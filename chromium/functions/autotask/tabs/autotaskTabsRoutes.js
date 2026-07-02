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

