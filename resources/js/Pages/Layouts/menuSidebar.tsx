import { LIST_PAGE_API } from '@/endpoint/getway/page';
import { LIST_PAGE_MASTER_ASSET } from '@/endpoint/masterAsset/page';
import { LIST_PAGE_MASTER_BANK_KEY } from '@/endpoint/masterBankKey/page';
import { LIST_PAGE_MASTER_COST_CENTER } from '@/endpoint/masterCostCenter/page';
import { LIST_PAGE_MASTER_MATERIAL } from '@/endpoint/masterMaterial/page';
import { LIST_PAGE_MASTER_ORDER } from '@/endpoint/masterOrder/page';
import { LIST_PAGE_MASTER_RECON } from '@/endpoint/masterRecon/page';
import { LIST_PAGE_SECRET } from '@/endpoint/secret/page';
import { LIST_PAGE_USER } from '@/endpoint/user/page';
import { LIST_PAGE_ROLE } from '@/endpoint/role/page';
import { LIST_PAGE_ALLOWANCE_CATEGORY } from '@/endpoint/allowance-category/page';
import { LIST_PAGE_MASTER_BUSINESS_PARTNER } from '@/endpoint/masterBusinessPartner/page';
import { LIST_PAGE_ALLOWANCE_ITEM } from '@/endpoint/allowance-item/page';
import { LIST_PAGE_PURPOSE_TYPE } from '@/endpoint/purpose-type/page';
import { LIST_PAGE_PR } from '@/endpoint/purchaseRequisition/page';
import { LIST_PAGE_BUSINESS_TRIP } from '@/endpoint/business-trip/page';
import { LIST_PAGE_BUSINESS_GRADE } from '@/endpoint/business-grade/page';
import { LIST_PAGE_MASTER_DOKUMENT_TYPE } from '@/endpoint/dokumentType/page';
import { LIST_PAGE_MASTER_VALUATION_TYPE } from '@/endpoint/valuationType/page';
import { LIST_PAGE_MASTER_PURCHASING_GROUP } from '@/endpoint/purchasingGroup/page';
import { LIST_PAGE_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY } from '@/endpoint/accountAssignmentCategory/page';
import { LIST_PAGE_MASTER_ITEM_CATEGORY } from '@/endpoint/ItemCategory/page';
import { LIST_PAGE_MASTER_STORAGE_LOCATION } from '@/endpoint/storageLocation/page';
import { LIST_PAGE_APPROVAL_ROUTE } from '@/endpoint/approvalRoute/page';
import { LIST_PAGE_SETTING_APPROVAL } from '@/endpoint/settingApproval/page';
import { LIST_PAGE_MASTER_MATERIAL_GROUP } from '@/endpoint/materialGroup/page';
import { LIST_PAGE_MASTER_UOM } from '@/endpoint/uom/page';
import { LIST_PAGE_MASTER_PAJAK } from '@/endpoint/pajak/page';
import { LIST_PAGE_BUSINESS_TRIP_DECLARATION } from '@/endpoint/business-trip-declaration/page';
import { PAGE_REIMBURSE_TYPE } from '@/endpoint/reimburseType/page';
import { PAGE_REIMBURSE, PAGE_MY_REIMBURSE } from '@/endpoint/reimburse/page';
import { LIST_PAGE_MASTER_PERMISSION } from '@/endpoint/permission/page';
import { LIST_PAGE_DESTINATION } from '@/endpoint/destination/page';
import { LIST_PAGE_MASTER_POSITION } from '@/endpoint/masterPosition/page';
import { LIST_PAGE_MASTER_DIVISION } from '@/endpoint/masterDivision/page';
import { LIST_PAGE_MASTER_DEPARTMENT } from '@/endpoint/masterDepartment/page';
import { LIST_PAGE_MASTER_TRACKING_NUMBER } from '@/endpoint/masterTrackingNumber/page';
import { LIST_PAGE_SETTING_APPROVAL_PR } from '@/endpoint/settingApprovalPr/page';
import { LIST_PAGE_TRACKING_NUMBER_AUTO } from '@/endpoint/approvalTrackingNumberAuto/page';
import { LIST_PAGE_TRACKING_NUMBER_CHOOSE } from '@/endpoint/approvalTrackingNumberChoose/page';
import { LIST_PAGE_APPROVAL_CONDITIONAL_USER } from '@/endpoint/settingApprovalPrConditionalUser/page';
import {
    PAGE_REPORT,
    PAGE_REPORT_BT_DEC,
    PAGE_REPORT_BT_OVERALL,
    PAGE_REPORT_BT_REQ,
    PAGE_REPORT_PURCHASE,
} from '@/endpoint/report/page';

export const sidebarRimbursement = () => [
    {
        group: '',
        role: ['reimburse view', 'reimburse create', 'reimburse update', 'reimburse delete'],
        menu: [
            {
                title: 'Dashboard',
                icon: 'ki-element-11',
                route: '/',
                sub: [],
            },
            {
                title: 'Reimburse',
                icon: 'ki-element-11',
                route: '/',
                role: ['reimburse view', 'reimburse create', 'reimburse update', 'reimburse delete'],
                sub: [
                    {
                        name: 'Reimbursement Request',
                        route: PAGE_REIMBURSE,
                        role: ['reimburse view', 'reimburse create', 'reimburse update', 'reimburse delete'],
                    },
                    {
                        name: 'My Reimbursement',
                        route: PAGE_MY_REIMBURSE,
                        role: ['reimburse view', 'reimburse create', 'reimburse update', 'reimburse delete'],
                    },
                ],
            },
        ],
    },
];

export const sidebarBusinessTrip = () => [
    {
        group: '',
        role: [
            'business trip request view',
            'business trip request create',
            'business trip request update',
            'business trip request delete',
            'business trip declaration view',
            'business trip declaration create',
            'business trip declaration update',
            'business trip declaration delete',
        ],
        menu: [
            {
                title: 'Dashboard',
                icon: 'ki-element-11',
                route: '/',
                sub: [],
            },
            {
                title: 'Bussiness Trip',
                icon: 'ki-element-11',
                route: '/',
                role: [
                    'business trip request view',
                    'business trip request create',
                    'business trip request update',
                    'business trip request delete',
                    'business trip declaration view',
                    'business trip declaration create',
                    'business trip declaration update',
                    'business trip declaration delete',
                ],
                sub: [
                    {
                        name: 'Business Trip Request',
                        route: LIST_PAGE_BUSINESS_TRIP,
                        role: [
                            'business trip request view',
                            'business trip request create',
                            'business trip request update',
                            'business trip request delete',
                        ],
                    },
                    {
                        name: 'Business Trip Declaration',
                        route: LIST_PAGE_BUSINESS_TRIP_DECLARATION,
                        role: [
                            'business trip declaration view',
                            'business trip declaration create',
                            'business trip declaration update',
                            'business trip declaration delete',
                        ],
                    },
                ],
            },
        ],
    },
];

export const sidebarPurchaseRequisition = () => [
    {
        group: '',
        role: [
            'purchase requisition view',
            'purchase requisition create',
            'purchase requisition update',
            'purchase requisition delete',
        ],
        menu: [
            {
                title: 'Dashboard',
                icon: 'ki-element-11',
                route: '/',
                sub: [],
            },
            {
                title: 'Purchase Requisition',
                icon: 'ki-element-11',
                route: LIST_PAGE_PR,
                role: [
                    'purchase requisition view',
                    'purchase requisition create',
                    'purchase requisition update',
                    'purchase requisition delete',
                ],
                sub: [],
            },
        ],
    },
];

export const sidebarAdmin = () => [
    {
        group: '',
        role: [
            'reimburse view',
            'reimburse create',
            'reimburse update',
            'reimburse delete',
            'business trip request view',
            'business trip request create',
            'business trip request update',
            'business trip request delete',
            'business trip declaration view',
            'business trip declaration create',
            'business trip declaration update',
            'business trip declaration delete',
            'purchase requisition view',
            'purchase requisition create',
            'purchase requisition update',
            'purchase requisition delete',
        ],
        menu: [
            {
                title: 'Dashboard',
                icon: 'ki-element-11',
                route: '/',
                sub: [],
            },
            {
                title: 'Reimburse',
                icon: 'ki-element-11',
                route: '/',
                role: ['reimburse view', 'reimburse create', 'reimburse update', 'reimburse delete'],
                sub: [
                    {
                        name: 'Reimbursement Request',
                        route: PAGE_REIMBURSE,
                        role: ['reimburse view', 'reimburse create', 'reimburse update', 'reimburse delete'],
                    },
                    {
                        name: 'My Reimbursement',
                        route: PAGE_MY_REIMBURSE,
                        role: ['reimburse view', 'reimburse create', 'reimburse update', 'reimburse delete'],
                    },
                ],
            },

            {
                title: 'Bussiness Trip',
                icon: 'ki-element-11',
                route: '/',
                role: [
                    'business trip request view',
                    'business trip request create',
                    'business trip request update',
                    'business trip request delete',
                    'business trip declaration view',
                    'business trip declaration create',
                    'business trip declaration update',
                    'business trip declaration delete',
                ],
                sub: [
                    {
                        name: 'Business Trip Request',
                        route: LIST_PAGE_BUSINESS_TRIP,
                        role: [
                            'business trip request view',
                            'business trip request create',
                            'business trip request update',
                            'business trip request delete',
                        ],
                    },
                    {
                        name: 'Business Trip Declaration',
                        route: LIST_PAGE_BUSINESS_TRIP_DECLARATION,
                        role: [
                            'business trip declaration view',
                            'business trip declaration create',
                            'business trip declaration update',
                            'business trip declaration delete',
                        ],
                    },
                ],
            },
            {
                title: 'Purchase Requisition',
                icon: 'ki-element-11',
                route: LIST_PAGE_PR,
                role: [
                    'purchase requisition view',
                    'purchase requisition create',
                    'purchase requisition update',
                    'purchase requisition delete',
                ],
                sub: [],
            },
        ],
    },
    {
        group: 'Setting',
        role: [
            'setting create',
            'setting view',
            'setting update',
            'setting delete',
            'secret create',
            'secret view',
            'secret update',
            'secret delete',
            'api create',
            'api view',
            'api update',
            'api delete',
        ],
        menu: [
            {
                title: 'Setting',
                icon: 'ki-setting-2',
                route: LIST_PAGE_SETTING_APPROVAL,
                role: ['setting create', 'setting view', 'setting update', 'setting delete'],
                sub: [],
            },
            {
                title: 'Gateway',
                icon: 'ki-key-square',
                route: '/',
                role: [
                    'secret create',
                    'secret view',
                    'secret update',
                    'secret delete',
                    'api create',
                    'api view',
                    'api update',
                    'api delete',
                ],
                sub: [
                    {
                        name: 'Secret',
                        route: LIST_PAGE_SECRET,
                        role: ['secret create', 'secret view', 'secret update', 'secret delete'],
                    },
                    {
                        name: 'Api',
                        route: LIST_PAGE_API,
                        role: ['api create', 'api view', 'api update', 'api delete'],
                    },
                ],
            },

            {
                title: 'Approval',
                icon: 'ki-copy-success',
                route: '/',
                role: [
                    'approval create',
                    'approval view',
                    'approval update',
                    'approval delete',
                    'tracking number create',
                    'tracking number view',
                    'tracking number update',
                    'tracking number delete',
                    'approval pr create',
                    'approval pr view',
                    'approval pr update',
                    'approval pr delete',
                    'tracking number auto create',
                    'tracking number auto view',
                    'tracking number auto update',
                    'tracking number auto delete',
                    'tracking number choose create',
                    'tracking number choose view',
                    'tracking number choose update',
                    'tracking number choose delete',
                    'approval conditional user create',
                    'approval conditional user view',
                    'approval conditional user update',
                    'approval conditional user delete',
                ],
                sub: [
                    {
                        name: 'Approval',
                        route: LIST_PAGE_APPROVAL_ROUTE,
                        role: ['approval create', 'approval view', 'approval update', 'approval delete'],
                    },
                    {
                        name: 'Approval Pr',
                        route: LIST_PAGE_SETTING_APPROVAL_PR,
                        role: [
                            'approval pr create',
                            'approval pr view',
                            'approval pr update',
                            'approval pr delete',
                        ],
                    },
                    {
                        name: 'Approval Conditional Route',
                        route: LIST_PAGE_APPROVAL_CONDITIONAL_USER,
                        role: [
                            'approval conditional user create',
                            'approval conditional user view',
                            'approval conditional user update',
                            'approval conditional user delete',
                        ],
                    },
                    {
                        name: 'Tracking Number Auto',
                        route: LIST_PAGE_TRACKING_NUMBER_AUTO,
                        role: [
                            'tracking number auto create',
                            'tracking number auto view',
                            'tracking number auto update',
                            'tracking number auto delete',
                        ],
                    },
                    {
                        name: 'Tracking Number Choose',
                        route: LIST_PAGE_TRACKING_NUMBER_CHOOSE,
                        role: [
                            'tracking number choose create',
                            'tracking number choose view',
                            'tracking number choose update',
                            'tracking number choose delete',
                        ],
                    },
                    {
                        name: 'Master Tracking Number',
                        route: LIST_PAGE_MASTER_TRACKING_NUMBER,
                        role: [
                            'tracking number create',
                            'tracking number view',
                            'tracking number update',
                            'tracking number delete',
                        ],
                    },
                ],
            },
            {
                title: 'User Management',
                icon: 'ki-users',
                route: '/',
                role: [
                    'user create',
                    'user view',
                    'user update',
                    'user delete',
                    'role permission create',
                    'role permission view',
                    'role permission update',
                    'role permission delete',
                    'role create',
                    'role view',
                    'role update',
                    'role delete',
                    'position create',
                    'position view',
                    'position update',
                    'position delete',
                ],
                sub: [
                    {
                        name: 'Users',
                        route: LIST_PAGE_USER,
                        role: ['user create', 'user view', 'user update', 'user delete'],
                    },
                    {
                        name: 'Role Permission',
                        route: LIST_PAGE_MASTER_PERMISSION,
                        role: [
                            'role permission create',
                            'role permission view',
                            'role permission update',
                            'role permission delete',
                        ],
                    },
                    {
                        name: 'Roles',
                        route: LIST_PAGE_ROLE,
                        role: ['role create', 'role view', 'role update', 'role delete'],
                    },
                    {
                        name: 'Position',
                        route: LIST_PAGE_MASTER_POSITION,
                        role: ['position create', 'position view', 'position update', 'position delete'],
                    },
                    {
                        name: 'Division',
                        route: LIST_PAGE_MASTER_DIVISION,
                        role: ['division create', 'division view', 'division update', 'division delete'],
                    },
                    {
                        name: 'Department',
                        route: LIST_PAGE_MASTER_DEPARTMENT,
                        role: [
                            'department create',
                            'department view',
                            'department update',
                            'department delete',
                        ],
                    },
                ],
            },
        ],
    },
    {
        group: 'Master',
        role: [
            'master sap material create',
            'master sap material view',
            'master sap material update',
            'master sap material delete',
            'master sap asset create',
            'master sap asset view',
            'master sap asset update',
            'master sap asset delete',
            'master sap cost center create',
            'master sap cost center view',
            'master sap cost center update',
            'master sap cost center delete',
            'master sap internal order create',
            'master sap internal order view',
            'master sap internal order update',
            'master sap internal order delete',
            'master sap recon account create',
            'master sap recon account view',
            'master sap recon account update',
            'master sap recon account delete',
            'master sap bank key create',
            'master sap bank key view',
            'master sap bank key update',
            'master sap bank key delete',
            'master sap business partner create',
            'master sap business partner view',
            'master sap business partner update',
            'master sap business partner delete',
            'master pr document type create',
            'master pr document type view',
            'master pr document type update',
            'master pr document type delete',
            'master pr valuation type create',
            'master pr valuation type view',
            'master pr valuation type update',
            'master pr valuation type delete',
            'master pr purchasing group create',
            'master pr purchasing group view',
            'master pr purchasing group update',
            'master pr purchasing group delete',
            'master pr account assignment category create',
            'master pr account assignment category view',
            'master pr account assignment category update',
            'master pr account assignment category delete',
            'master pr item category create',
            'master pr item category view',
            'master pr item category update',
            'master pr item category delete',
            'master pr storage location create',
            'master pr storage location view',
            'master pr storage location update',
            'master pr storage location delete',
            'master pr material group create',
            'master pr material group view',
            'master pr material group update',
            'master pr material group delete',
            'master pr uom create',
            'master pr uom view',
            'master pr uom update',
            'master pr uom delete',
            'master pr tax create',
            'master pr tax view',
            'master pr tax update',
            'master pr tax delete',
            'master reimburse type create',
            'master reimburse type view',
            'master reimburse type update',
            'master reimburse type delete',
            'master reimburse period create',
            'master reimburse period view',
            'master reimburse period update',
            'master reimburse period delete',
            'master reimburse quota create',
            'master reimburse quota view',
            'master reimburse quota update',
            'master reimburse quota delete',
            'master business trip allowance category create',
            'master business trip allowance category view',
            'master business trip allowance category update',
            'master business trip allowance category delete',
            'master business trip allowance item create',
            'master business trip allowance item view',
            'master business trip allowance item update',
            'master business trip allowance item delete',
            'master business trip purpose type create',
            'master business trip purpose type view',
            'master business trip purpose type update',
            'master business trip purpose type delete',
            'master business trip grade create',
            'master business trip grade view',
            'master business trip grade update',
            'master business trip grade delete',
            'master business trip destination create',
            'master business trip destination view',
            'master business trip destination update',
            'master business trip destination delete',
        ],
        menu: [
            {
                title: 'Master SAP',
                icon: 'ki-setting-3',
                route: '/',
                role: [
                    'master sap material create',
                    'master sap material view',
                    'master sap material update',
                    'master sap material delete',
                    'master sap asset create',
                    'master sap asset view',
                    'master sap asset update',
                    'master sap asset delete',
                    'master sap cost center create',
                    'master sap cost center view',
                    'master sap cost center update',
                    'master sap cost center delete',
                    'master sap internal order create',
                    'master sap internal order view',
                    'master sap internal order update',
                    'master sap internal order delete',
                    'master sap recon account create',
                    'master sap recon account view',
                    'master sap recon account update',
                    'master sap recon account delete',
                    'master sap bank key create',
                    'master sap bank key view',
                    'master sap bank key update',
                    'master sap bank key delete',
                    'master sap business partner create',
                    'master sap business partner view',
                    'master sap business partner update',
                    'master sap business partner delete',
                ],
                sub: [
                    {
                        name: 'Master Material',
                        route: LIST_PAGE_MASTER_MATERIAL,
                        role: [
                            'master sap material create',
                            'master sap material view',
                            'master sap material update',
                            'master sap material delete',
                        ],
                    },
                    {
                        name: 'Asset',
                        route: LIST_PAGE_MASTER_ASSET,
                        role: [
                            'master sap asset create',
                            'master sap asset view',
                            'master sap asset update',
                            'master sap asset delete',
                        ],
                    },
                    {
                        name: 'Cost Center',
                        route: LIST_PAGE_MASTER_COST_CENTER,
                        role: [
                            'master sap cost center create',
                            'master sap cost center view',
                            'master sap cost center update',
                            'master sap cost center delete',
                        ],
                    },
                    {
                        name: 'Internal Order',
                        route: LIST_PAGE_MASTER_ORDER,
                        role: [
                            'master sap internal order create',
                            'master sap internal order view',
                            'master sap internal order update',
                            'master sap internal order delete',
                        ],
                    },
                    {
                        name: 'Recon Account',
                        route: LIST_PAGE_MASTER_RECON,
                        role: [
                            'master sap recon account create',
                            'master sap recon account view',
                            'master sap recon account update',
                            'master sap recon account delete',
                        ],
                    },
                    {
                        name: 'Bank Key',
                        route: LIST_PAGE_MASTER_BANK_KEY,
                        role: [
                            'master sap bank key create',
                            'master sap bank key view',
                            'master sap bank key update',
                            'master sap bank key delete',
                        ],
                    },
                    {
                        name: 'Business Partner',
                        route: LIST_PAGE_MASTER_BUSINESS_PARTNER,
                        role: [
                            'master sap business partner create',
                            'master sap business partner view',
                            'master sap business partner update',
                            'master sap business partner delete',
                        ],
                    },
                ],
            },
            {
                title: 'Master PR',
                icon: 'ki-wrench',
                route: '/',
                role: [
                    'master pr document type create',
                    'master pr document type view',
                    'master pr document type update',
                    'master pr document type delete',
                    'master pr valuation type create',
                    'master pr valuation type view',
                    'master pr valuation type update',
                    'master pr valuation type delete',
                    'master pr purchasing group create',
                    'master pr purchasing group view',
                    'master pr purchasing group update',
                    'master pr purchasing group delete',
                    'master pr account assignment category create',
                    'master pr account assignment category view',
                    'master pr account assignment category update',
                    'master pr account assignment category delete',
                    'master pr item category create',
                    'master pr item category view',
                    'master pr item category update',
                    'master pr item category delete',
                    'master pr storage location create',
                    'master pr storage location view',
                    'master pr storage location update',
                    'master pr storage location delete',
                    'master pr material group create',
                    'master pr material group view',
                    'master pr material group update',
                    'master pr material group delete',
                    'master pr uom create',
                    'master pr uom view',
                    'master pr uom update',
                    'master pr uom delete',
                    'master pr tax create',
                    'master pr tax view',
                    'master pr tax update',
                    'master pr tax delete',
                ],
                sub: [
                    {
                        name: 'Document Type',
                        route: LIST_PAGE_MASTER_DOKUMENT_TYPE,
                        role: [
                            'master pr document type create',
                            'master pr document type view',
                            'master pr document type update',
                            'master pr document type delete',
                        ],
                    },
                    {
                        name: 'Valuation Type',
                        route: LIST_PAGE_MASTER_VALUATION_TYPE,
                        role: [
                            'master pr valuation type create',
                            'master pr valuation type view',
                            'master pr valuation type update',
                            'master pr valuation type delete',
                        ],
                    },
                    {
                        name: 'Purchasing Groups',
                        route: LIST_PAGE_MASTER_PURCHASING_GROUP,
                        role: [
                            'master pr purchasing group create',
                            'master pr purchasing group view',
                            'master pr purchasing group update',
                            'master pr purchasing group delete',
                        ],
                    },
                    {
                        name: 'Account Assignment Categories',
                        route: LIST_PAGE_MASTER_ACCOUNT_ASSIGNMENT_CATEGORY,
                        role: [
                            'master pr account assignment category create',
                            'master pr account assignment category view',
                            'master pr account assignment category update',
                            'master pr account assignment category delete',
                        ],
                    },
                    {
                        name: 'Item Categories',
                        route: LIST_PAGE_MASTER_ITEM_CATEGORY,
                        role: [
                            'master pr item category create',
                            'master pr item category view',
                            'master pr item category update',
                            'master pr item category delete',
                        ],
                    },
                    {
                        name: 'Storage Locations',
                        route: LIST_PAGE_MASTER_STORAGE_LOCATION,
                        role: [
                            'master pr storage location create',
                            'master pr storage location view',
                            'master pr storage location update',
                            'master pr storage location delete',
                        ],
                    },
                    {
                        name: 'Material Group',
                        route: LIST_PAGE_MASTER_MATERIAL_GROUP,
                        role: [
                            'master pr material group create',
                            'master pr material group view',
                            'master pr material group update',
                            'master pr material group delete',
                        ],
                    },
                    {
                        name: 'UOM',
                        route: LIST_PAGE_MASTER_UOM,
                        role: [
                            'master pr uom create',
                            'master pr uom view',
                            'master pr uom update',
                            'master pr uom delete',
                        ],
                    },
                    {
                        name: 'Tax',
                        route: LIST_PAGE_MASTER_PAJAK,
                        role: [
                            'master pr tax create',
                            'master pr tax view',
                            'master pr tax update',
                            'master pr tax delete',
                        ],
                    },
                ],
            },
            {
                title: 'Master Business Trip',
                icon: 'ki-book-square',
                route: '/',
                role: [
                    'master business trip allowance category create',
                    'master business trip allowance category view',
                    'master business trip allowance category update',
                    'master business trip allowance category delete',
                    'master business trip allowance item create',
                    'master business trip allowance item view',
                    'master business trip allowance item update',
                    'master business trip allowance item delete',
                    'master business trip purpose type create',
                    'master business trip purpose type view',
                    'master business trip purpose type update',
                    'master business trip purpose type delete',
                    'master business trip grade create',
                    'master business trip grade view',
                    'master business trip grade update',
                    'master business trip grade delete',
                    'master business trip destination create',
                    'master business trip destination view',
                    'master business trip destination update',
                    'master business trip destination delete',
                ],
                sub: [
                    {
                        name: 'Allowance Category',
                        route: LIST_PAGE_ALLOWANCE_CATEGORY,
                        role: [
                            'master business trip allowance category create',
                            'master business trip allowance category view',
                            'master business trip allowance category update',
                            'master business trip allowance category delete',
                        ],
                    },
                    {
                        name: 'Allowance Item',
                        route: LIST_PAGE_ALLOWANCE_ITEM,
                        role: [
                            'master business trip allowance item create',
                            'master business trip allowance item view',
                            'master business trip allowance item update',
                            'master business trip allowance item delete',
                        ],
                    },
                    {
                        name: 'Purpose Type',
                        route: LIST_PAGE_PURPOSE_TYPE,
                        role: [
                            'master business trip purpose type create',
                            'master business trip purpose type view',
                            'master business trip purpose type update',
                            'master business trip purpose type delete',
                        ],
                    },
                    {
                        name: 'Business Trip Grade',
                        route: LIST_PAGE_BUSINESS_GRADE,
                        role: [
                            'master business trip grade create',
                            'master business trip grade view',
                            'master business trip grade update',
                            'master business trip grade delete',
                        ],
                    },
                    {
                        name: 'Master Destination',
                        route: LIST_PAGE_DESTINATION,
                        role: [
                            'master business trip destination create',
                            'master business trip destination view',
                            'master business trip destination update',
                            'master business trip destination delete',
                        ],
                    },
                ],
            },

            {
                title: 'Master Reimburse',
                icon: 'ki-paper-plane',
                route: '/',
                role: [
                    'master reimburse type create',
                    'master reimburse type view',
                    'master reimburse type update',
                    'master reimburse type delete',
                    'master reimburse period create',
                    'master reimburse period view',
                    'master reimburse period update',
                    'master reimburse period delete',
                    'master reimburse quota create',
                    'master reimburse quota view',
                    'master reimburse quota update',
                    'master reimburse quota delete',
                ],
                sub: [
                    {
                        name: 'Reimburse Type',
                        route: PAGE_REIMBURSE_TYPE,
                        role: [
                            'master reimburse type create',
                            'master reimburse type view',
                            'master reimburse type update',
                            'master reimburse type delete',
                        ],
                    },
                ],
            },
        ],
    },
    {
        group: 'Report',
        role: [
            'report reimburse view',
            'report reimburse export',
            'report business trip request view',
            'report business trip request export',
            'report business trip declaration view',
            'report business trip declaration export',
            'report business trip overall view',
            'report business trip overall export',
            'report purchase requisition view',
            'report purchase requisition export',
        ],
        menu: [
            {
                title: 'Reimburse',
                icon: 'ki-element-11',
                route: PAGE_REPORT,
                role: ['report reimburse view', 'report reimburse export'],
                sub: [],
            },

            {
                title: 'Bussiness Trip',
                icon: 'ki-element-11',
                route: '/',
                role: [
                    'report business trip request view',
                    'report business trip request export',
                    'report business trip declaration view',
                    'report business trip declaration export',
                    'report business trip overall view',
                    'report business trip overall export',

                ],
                sub: [
                    {
                        name: 'Business Trip Request',
                        route: PAGE_REPORT_BT_REQ,
                        role: ['report business trip request view', 'report business trip request export'],
                    },
                    {
                        name: 'Business Trip Declaration',
                        route: PAGE_REPORT_BT_DEC,
                        role: [
                            'report business trip declaration view',
                            'report business trip declaration export',
                        ],
                    },
                    {
                        name: 'Business Trip Overall',
                        route: PAGE_REPORT_BT_OVERALL,
                        role: [
                            'report business trip overall view',
                            'report business trip overall export',
                        ],
                    },
                ],
            },
            {
                title: 'Purchase Requisition',
                icon: 'ki-element-11',
                route: PAGE_REPORT_PURCHASE,
                role: ['report purchase requisition view', 'report purchase requisition export'],
                sub: [],
            },
        ],
    },
];
