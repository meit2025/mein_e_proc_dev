import { ScrollArea } from '@/components/shacdn/scroll-area';
import { Link, usePage } from '@inertiajs/react';
import Logo from '../../../assets/images/logo.png';
import { useEffect, useState } from 'react';
import {
  sidebarAdmin,
  sidebarBusinessTrip,
  sidebarPurchaseRequisition,
  sidebarRimbursement,
} from './menuSidebar';
import { useCookies } from 'react-cookie';

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

interface SidebarProps {
  permission: string[];
}

export default function Sidebar() {
  const { url } = usePage();
  const { props } = usePage<{ auth: { permission: string[]; user: any } }>();
  const [cookies, setCookie] = useCookies(['menu-site']);

  const [sidebar, setSidebar] = useState<any[]>([]);

  const permissions = props.auth?.permission || [];

  const hasPermission = (requiredPermissions: string[]) => {
    return requiredPermissions.some((perm) => permissions.includes(perm));
  };

  useEffect(() => {
    if (cookies['menu-site']) {
      if (props.auth?.user?.is_admin === '1') {
        setSidebar(sidebarAdmin);
      } else if (cookies['menu-site'] === 'business-trip') {
        setSidebar(sidebarBusinessTrip);
      } else if (cookies['menu-site'] === 'reimburse') {
        setSidebar(sidebarRimbursement);
      } else if (cookies['menu-site'] === 'purchase-requisition') {
        setSidebar(sidebarPurchaseRequisition);
      }
    }
  }, []);

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
        <button
          className='btn btn-icon btn-icon-md size-[30px] rounded-lg border border-gray-200 dark:border-gray-300 bg-light text-gray-500 hover:text-gray-700 toggle absolute left-full top-2/4 -translate-x-2/4 -translate-y-2/4'
          data-toggle='body'
          data-toggle-classname='sidebar-collapse'
          id='sidebar_toggle'
        >
          <i className='ki-filled ki-black-left-line toggle-active:rotate-180 transition-all duration-300'></i>
        </button>
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
                    {item.menu.map((menu: any) => {
                      if (menu.role && !hasPermission(menu.role)) {
                        return null;
                      }
                      if (menu.sub.length > 0) {
                        const visibleSub = menu.sub.filter(
                          (sub: any) => !sub.role || hasPermission(sub.role),
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
