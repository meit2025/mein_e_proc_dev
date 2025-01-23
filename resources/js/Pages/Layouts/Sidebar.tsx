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
import { Link, usePage } from '@inertiajs/react';
import Logo from '../../../assets/images/logo.png';
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
import { ScrollArea } from '@/components/shacdn/scroll-area';
import { LIST_PAGE_MASTER_POSITION } from '@/endpoint/masterPosition/page';
import { LIST_PAGE_MASTER_DIVISION } from '@/endpoint/masterDivision/page';
import { LIST_PAGE_MASTER_DEPARTMENT } from '@/endpoint/masterDepartment/page';
import { LIST_PAGE_MASTER_TRACKING_NUMBER } from '@/endpoint/masterTrackingNumber/page';
import { LIST_PAGE_SETTING_APPROVAL_PR } from '@/endpoint/settingApprovalPr/page';
import { LIST_PAGE_TRACKING_NUMBER_AUTO } from '@/endpoint/approvalTrackingNumberAuto/page';
import { LIST_PAGE_TRACKING_NUMBER_CHOOSE } from '@/endpoint/approvalTrackingNumberChoose/page';
import { LIST_PAGE_APPROVAL_CONDITIONAL_USER } from '@/endpoint/settingApprovalPrConditionalUser/page';
import { PAGE_REPORT, PAGE_REPORT_BT_DEC, PAGE_REPORT_BT_REQ, PAGE_REPORT_BT_OVERALL, PAGE_REPORT_PURCHASE } from '@/endpoint/report/page';

export const RuteTitle = (title: string) => {
    return (
        <div className='menu-item pt-2.25 pb-px'>
            <span className='menu-heading uppercase text-2sm font-medium text-gray-500 pl-[10px] pr-[10px]'>
                {title}
            </span>
        </div>
    );
};

export const Singel = (menu: any, url: string) => {
    const isActive = url === menu.route;
    const { props } = usePage<{ auth: { permission: string[] } }>();

    const permissions = props.auth?.permission || [];

    if (menu.role && !menu.role.some((perm: string) => permissions.includes(perm))) {
        return null; // Tidak render jika tidak memiliki izin
    }

    return (
        <div
            className={`menu-item  menu-item-active:text-primary menu-link-hover:!text-primary ${isActive ? 'active text-blue-500' : ''}`}
        >
            <Link
                className='menu-link border border-transparent items-center grow menu-item-active:bg-secondary-active dark:menu-item-active:bg-coal-300 dark:menu-item-active:border-gray-100 menu-item-active:rounded-lg hover:bg-secondary-active dark:hover:bg-coal-300 dark:hover:border-gray-100 hover:rounded-lg'
                href={menu.route}
                tabIndex={0}
            >
                <div
                    className='menu-label border border-transparent gap-[10px] pl-[10px] pr-[10px] py-[6px]'
                    tabIndex={0}
                >
                    <span className='menu-icon items-start text-gray-500 dark:text-gray-400 w-[20px]'>
                        <i className={`ki-filled ${menu.icon}  text-lg`}></i>
                    </span>
                    <span className='menu-title text-sm font-medium text-gray-800'>{menu.title}</span>
                </div>
            </Link>
        </div>
    );
};
export const MultiMenu = (menu: any, url: string) => {
    const isActive = menu.sub.some((sub: any) => url === sub.route);
    const { props } = usePage<{ auth: { permission: string[] } }>();

    const permissions = props.auth?.permission || [];
    return (
        <div
            className={`menu-item ${isActive ? 'active' : ''}`}
            data-menu-item-toggle='accordion'
            data-menu-item-trigger='click'
        >
            <div
                className='menu-link flex items-center grow cursor-pointer border border-transparent gap-[10px] pl-[10px] pr-[10px] py-[6px]'
                tabIndex={0}
            >
                <span className='menu-icon items-start text-gray-500 dark:text-gray-400 w-[20px]'>
                    <i className={`ki-filled ${menu.icon} text-lg`}></i>
                </span>
                <span className='menu-title text-sm font-medium text-gray-800 menu-item-active:text-primary menu-link-hover:!text-primary'>
                    {menu.title}
                </span>
                <span className='menu-arrow text-gray-400 w-[20px] shrink-0 justify-end ml-1 mr-[-10px]'>
                    <i className='ki-filled ki-plus text-2xs menu-item-show:hidden'></i>
                    <i className='ki-filled ki-minus text-2xs hidden menu-item-show:inline-flex'></i>
                </span>
            </div>
            <div className='menu-accordion gap-0.5 pl-[10px] relative before:absolute before:left-[20px] before:top-0 before:bottom-0 before:border-l before:border-gray-200'>
                {menu.sub.map((sub: any, subkey: number) => {
                    const isSubActive = url === sub.route;

                    if (sub.role && !sub.role.some((perm: string) => permissions.includes(perm))) {
                        return null;
                    }
                    return (
                        <div key={subkey} className={`menu-item ${isSubActive ? 'active' : ''}`}>
                            <Link
                                className='menu-link border border-transparent items-center grow menu-item-active:bg-secondary-active dark:menu-item-active:bg-coal-300 dark:menu-item-active:border-gray-100 menu-item-active:rounded-lg hover:bg-secondary-active dark:hover:bg-coal-300 dark:hover:border-gray-100 hover:rounded-lg gap-[14px] pl-[10px] pr-[10px] py-[8px]'
                                href={sub.route}
                                tabIndex={0}
                            >
                                <span className='menu-bullet flex w-[6px] relative before:absolute before:top-0 before:size-[6px] before:rounded-full before:-translate-x-1/2 before:-translate-y-1/2 menu-item-active:before:bg-primary menu-item-hover:before:bg-primary'></span>
                                <span className='menu-title text-2sm font-normal text-gray-800 menu-item-active:text-primary menu-item-active:font-semibold menu-link-hover:!text-primary'>
                                    {sub.name}
                                </span>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const sidebar = [
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
                    }
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
            'report purchase requisition view',
            'report purchase requisition export',
        ],
        menu: [
            {
                title: 'Reimburse',
                icon: 'ki-element-11',
                route: PAGE_REPORT,
                role: ['report reimburse view',
                    'report reimburse export',
                ],
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
                ],
                sub: [
                    {
                        name: 'Business Trip Request',
                        route: PAGE_REPORT_BT_REQ,
                        role: [
                            'report business trip request view',
                            'report business trip request export',
                        ],
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
                role: [
                    'report purchase requisition view',
                    'report purchase requisition export',
                ],
                sub: [],
            },
        ],
    },
];

interface SidebarProps {
    permission: string[];
}

export default function Sidebar() {
    const { url } = usePage();
    const { props } = usePage<{ auth: { permission: string[] } }>();

    const permissions = props.auth?.permission || [];

    const hasPermission = (requiredPermissions: string[]) => {
        return requiredPermissions.some((perm) => permissions.includes(perm));
    };

    return (
        <div
            className='sidebar dark:bg-coal-600 bg-light border-e border-e-gray-200 dark:border-e-coal-100 fixed z-20 hidden lg:flex flex-col items-stretch shrink-0'
            data-drawer='true'
            data-drawer-classname='drawer drawer-start top-0 bottom-0'
            data-drawer-enable='true|lg:false'
            id='sidebar'
        >
            <div
                className='sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6 shrink-0'
                id='sidebar_header'
            >
                <a className='dark:hidden' href='/'>
                    <img alt='logo' className='default-logo min-h-[22px] max-w-none' src={Logo} />
                    <img alt='logo' className='small-logo min-h-[22px] max-w-none' src={Logo} />
                </a>
                <a className='hidden dark:block' href='/'>
                    <img alt='logo' className='default-logo min-h-[22px] max-w-none' src={Logo} />
                    <img alt='logo-main' className='small-logo min-h-[22px] max-w-none' src={Logo} />
                </a>
                {/* <button
          className='btn btn-icon btn-icon-md size-[30px] rounded-lg border border-gray-200 dark:border-gray-300 bg-light text-gray-500 hover:text-gray-700 toggle absolute left-full top-2/4 -translate-x-2/4 -translate-y-2/4'
          data-toggle='body'
          data-toggle-classname='sidebar-collapse'
          id='sidebar_toggle'
        >
          <i className='ki-filled ki-black-left-line toggle-active:rotate-180 transition-all duration-300'></i>
        </button> */}
            </div>
            <ScrollArea>
                <div
                    className='sidebar-content flex grow shrink-0 py-5 pr-2'
                    id='sidebar_content'
                    style={{
                        height: '93vh',
                    }}
                >
                    <div
                        className='scrollable-y-hover grow shrink-0 flex pl-2 lg:pl-5 pr-1 lg:pr-3'
                        data-scrollable='true'
                        data-scrollable-dependencies='#sidebar_header'
                        data-scrollable-height='auto'
                        data-scrollable-offset='0px'
                        data-scrollable-wrappers='#sidebar_content'
                        id='sidebar_scrollable'
                    >
                        <div
                            className='menu flex flex-col grow gap-0.5'
                            data-menu='true'
                            data-menu-accordion-expand-all='false'
                            id='sidebar_menu'
                        >
                            {sidebar.map((item, index) => {
                                return (
                                    <div key={`${index}-${item.menu}`}>
                                        {item.group !== '' && hasPermission(item.role ?? []) && RuteTitle(item.group)}
                                        {item.menu.map((menu) => {
                                            if (menu.role && !hasPermission(menu.role)) {
                                                return null;
                                            }
                                            if (menu.sub.length > 0) {
                                                const visibleSub = menu.sub.filter(
                                                    (sub) => !sub.role || hasPermission(sub.role),
                                                );

                                                if (visibleSub.length === 0) return null;

                                                return MultiMenu(menu, url.toLowerCase());
                                            }

                                            if (menu.sub.length === 0) {
                                                return Singel(menu, url.toLowerCase());
                                            }
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}
