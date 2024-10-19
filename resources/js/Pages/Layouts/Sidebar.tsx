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
import { LIST_PAGE_BUSINESS_TRIP_DECLARATION } from '@/endpoint/business-trip-declaration/page';
// import { Link } from '@inertiajs/inertia-react';

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
  return (
    <div
      className={`menu-item  menu-item-active:text-primary menu-link-hover:!text-primary ${isActive ? 'active' : ''}`}
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
          return (
            <div key={subkey} className={`menu-item ${isSubActive ? 'menu-item-active' : ''}`}>
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
        route: '/reimburse',
        sub: [],
      },

      {
        title: 'Bussiness Trip',
        icon: 'ki-element-11',
        route: '/',
        sub: [
          {
            name: 'Allowance Category',
            route: LIST_PAGE_ALLOWANCE_CATEGORY,
            roles: '',
          },

          {
            name: 'Allowance Item',
            route: LIST_PAGE_ALLOWANCE_ITEM,
            roles: '',
          },

          {
            name: 'Purpose Type',
            route: LIST_PAGE_PURPOSE_TYPE,
            roles: '',
          },

          {
            name: 'Business Trip Request',
            route: LIST_PAGE_BUSINESS_TRIP,
            roles: '',
          },
          {
            name: 'Business Trip Declaration',
            route: LIST_PAGE_BUSINESS_TRIP_DECLARATION,
            roles: '',
          },
          // {
          //   name: 'Bank Key',
          //   route: LIST_PAGE_ALLOWANCE_CATEGORY,
          //   roles: '',
          // },
        ],
      },

      {
        title: 'Master',
        icon: 'ki-setting-3',
        route: '/',
        sub: [
          {
            name: 'Master Material',
            route: LIST_PAGE_MASTER_MATERIAL,
            roles: '',
          },
          {
            name: 'Asset',
            route: LIST_PAGE_MASTER_ASSET,
            roles: '',
          },
          {
            name: 'Cost Center',
            route: LIST_PAGE_MASTER_COST_CENTER,
            roles: '',
          },
          {
            name: 'Internal Order',
            route: LIST_PAGE_MASTER_ORDER,
            roles: '',
          },
          {
            name: 'Recon Account',
            route: LIST_PAGE_MASTER_RECON,
            roles: '',
          },
          {
            name: 'Bank Key',
            route: LIST_PAGE_MASTER_BANK_KEY,
            roles: '',
          },
        ],
      },
      {
        title: 'Purchase Requisition',
        icon: 'ki-element-11',
        route: LIST_PAGE_PR,
        sub: [],
      },
    ],
  },
  {
    group: 'Setting',
    menu: [
      {
        title: 'Master',
        icon: 'ki-setting-3',
        route: '/',
        sub: [
          {
            name: 'Master Material',
            route: LIST_PAGE_MASTER_MATERIAL,
            roles: '',
          },
          {
            name: 'Asset',
            route: LIST_PAGE_MASTER_ASSET,
            roles: '',
          },
          {
            name: 'Cost Center',
            route: LIST_PAGE_MASTER_COST_CENTER,
            roles: '',
          },
          {
            name: 'Internal Order',
            route: LIST_PAGE_MASTER_ORDER,
            roles: '',
          },
          {
            name: 'Recon Account',
            route: LIST_PAGE_MASTER_RECON,
            roles: '',
          },
          {
            name: 'Bank Key',
            route: LIST_PAGE_MASTER_BANK_KEY,
            roles: '',
          },
          {
            name: 'Business Patner',
            route: LIST_PAGE_MASTER_BUSINESS_PARTNER,
            roles: '',
          },
        ],
      },
      {
        title: 'Gateway',
        icon: 'ki-key-square',
        route: '/',
        sub: [
          {
            name: 'Secret',
            route: LIST_PAGE_SECRET,
            roles: 'gateway.secret',
          },
          {
            name: 'Api',
            route: LIST_PAGE_API,
            roles: '',
          },
        ],
      },
      {
        title: 'Master PR',
        icon: 'ki-users',
        route: '/',
        sub: [
          {
            name: 'Dokument Type',
            route: LIST_PAGE_USER,
            roles: '',
          },
          {
            name: 'Valuation Type',
            route: LIST_PAGE_ROLE,
            roles: '',
          },
          {
            name: 'Purchasing Groups',
            route: LIST_PAGE_ROLE,
            roles: '',
          },
          {
            name: 'Account Assignment Categories',
            route: LIST_PAGE_ROLE,
            roles: '',
          },
          {
            name: 'Item Categories',
            route: LIST_PAGE_ROLE,
            roles: '',
          },
          {
            name: 'Storage Locations',
            route: LIST_PAGE_ROLE,
            roles: '',
          },
        ],
      },
      {
        title: 'Approval',
        icon: 'ki-users',
        route: '/',
        sub: [
          {
            name: 'Approval',
            route: LIST_PAGE_USER,
            roles: '',
          },
          {
            name: 'Approval Conditional',
            route: LIST_PAGE_ROLE,
            roles: '',
          },
        ],
      },
      {
        title: 'User Management',
        icon: 'ki-users',
        route: '/',
        sub: [
          {
            name: 'Users',
            route: LIST_PAGE_USER,
            roles: '',
          },
          {
            name: 'Roles',
            route: LIST_PAGE_ROLE,
            roles: '',
          },
        ],
      },
    ],
  },
];

export default function Sidebar() {
  const { component: url } = usePage();
  return (
    <div
      className='sidebar dark:bg-coal-600 bg-light border-r border-r-gray-200 dark:border-r-coal-100 fixed top-0 bottom-0 z-20 hidden lg:flex flex-col items-stretch shrink-0'
      data-drawer='true'
      data-drawer-classname='drawer drawer-start top-0 bottom-0'
      data-drawer-enable='true|lg:false'
      id='sidebar'
    >
      <div
        className='sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6 shrink-0'
        id='sidebar_header'
      >
        <a className='dark:hidden' href='html/demo1.html'>
          <img className='default-logo min-h-[22px] max-w-none' src={Logo} />
          <img className='small-logo min-h-[22px] max-w-none' src={Logo} />
        </a>
        <a className='hidden dark:block' href='html/demo1.html'>
          <img className='default-logo min-h-[22px] max-w-none' src={Logo} />
          <img className='small-logo min-h-[22px] max-w-none' src={Logo} />
        </a>
        <button
          className='btn btn-icon btn-icon-md size-[30px] rounded-lg border border-gray-200 dark:border-gray-300 bg-light text-gray-500 hover:text-gray-700 toggle absolute left-full top-2/4 -translate-x-2/4 -translate-y-2/4'
          data-toggle='body'
          data-toggle-classname='sidebar-collapse'
          id='sidebar_toggle'
        >
          <i className='ki-filled ki-black-left-line toggle-active:rotate-180 transition-all duration-300'></i>
        </button>
      </div>
      <div className='sidebar-content flex grow shrink-0 py-5 pr-2' id='sidebar_content'>
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
                <div key={index}>
                  {item.group !== '' && RuteTitle(item.group)}{' '}
                  {item.menu.map((menu) => {
                    if (menu.sub.length > 0) {
                      return MultiMenu(menu, url as string);
                    }

                    if (menu.sub.length === 0) {
                      return Singel(menu, url as string);
                    }
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
