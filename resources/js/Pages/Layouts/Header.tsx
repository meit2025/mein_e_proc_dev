/* eslint-disable react-hooks/exhaustive-deps */
import { usePage, Link } from '@inertiajs/react';
import Logo from '../../../assets/images/logo.png';
import { useEffect, useRef, useState } from 'react';
import { useAlert } from '@/contexts/AlertContext';
import axiosInstance from '@/axiosInstance';
import { Notification } from '@/interfaces/notifikasi/notifikasi';
import { Loading } from '@/components/commons/Loading';
export interface User {
  id: number;
  name: string;
  email: string;
  role_id: string;
  is_approval: boolean;
  is_admin: string;
  username: string;
}

export interface Auth {
  user?: User;
}

const messageNotifikasi = (data: Notification) => {
  return (
    <>
      <div className='flex items-center justify-center border rounded-full size-8 bg-success-light border-success-clarity'>
        <i
          className={`ki-filled ${data.is_read ? ' ki-check text-success' : 'ki-information-1 text-warning'}  text-lg `}
        ></i>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='mb-px font-medium text-2sm'>
          <Link
            className='font-semibold text-gray-900 hover:text-primary-active'
            href={data.url_redirect}
          >
            {data.message}
          </Link>
        </div>
        <span className='flex items-center font-medium text-gray-500 text-2xs'>
          {formatTimeAgo(data.created_at)}
        </span>
      </div>
    </>
  );
};

const formatTimeAgo = (timestamp: string | Date) => {
  const now = new Date();
  const date = new Date(timestamp);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  return `${seconds} seconds ago`;
};

export default function Header() {
  const { auth } = usePage().props as unknown as { auth?: Auth };
  const { showToast } = useAlert();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isRead, setIsRead] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/notifikasi');
      const newNotifications: Notification[] = response.data.data;

      const unreadNotifications = response.data.data.filter(
        (notification: Notification) => !notification.is_read,
      );
      setIsRead(unreadNotifications.length === 0 ? false : true);
      setNotifications(newNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const action = async (url: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(url);
      showToast(response.data.message);
      await fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    } finally {
      setLoading(false);
    }
  };

  //   useEffect(() => {
  //     const channel = `App.Models.User.${auth?.user?.id}`;
  //     const handlePodcastPublished = async (event: any) => {
  //       showToast(event.message.message);
  //       await fetchNotifications();
  //     };
  //     window.Echo.private(channel).listen('NotifikasiUsers', handlePodcastPublished);
  //     return () => {
  //       window.Echo.leave(channel);
  //     };
  //   }, [auth?.user?.id]);

  //   useEffect(() => {
  //     fetchNotifications();
  //   }, []);

  return (
    <>
      <Loading isLoading={loading} />
      <header
        className='header fixed top-0 z-10 left-0 right-0 flex items-stretch shrink-0 bg-[--tw-page-bg] dark:bg-[--tw-page-bg-dark]'
        data-sticky='true'
        data-sticky-className='shadow-sm'
        data-sticky-name='header'
        id='header'
      >
        <div
          className='flex items-stretch justify-end container-fixed lg:gap-4'
          id='header_container'
        >
          {/* mobile logo */}
          <div className='flex items-center gap-1 -ml-1 lg:hidden'>
            <a className='shrink-0' href='/'>
              <img className='max-h-[25px] w-full' src={Logo} />
            </a>
            <div className='flex items-center'>
              <button
                className='btn btn-icon btn-light btn-clear btn-sm'
                data-drawer-toggle='#sidebar'
              >
                <i className='ki-filled ki-menu'></i>
              </button>
              {/* <button
                className='btn btn-icon btn-light btn-clear btn-sm'
                data-drawer-toggle='#mega_menu_wrapper'
              >
                <i className='ki-filled ki-burger-menu-2'></i>
              </button> */}
            </div>
          </div>
          {/* end mobile logo */}
          {/* <!-- Mega Men --> */}
          {/* <div className='flex items-stretch' id='mega_menu_container'></div> */}
          {/* <!-- End of Mega Men --> */}
          <div className='menu flex-col lg:flex-row gap-5 lg:gap-7.5 p-5 lg:p-0'>
            {window.location.pathname !== '/portal' && (
              <div className='menu-item'>
                <a
                  className='px-4 py-2 my-4 text-sm font-medium text-white text-gray-700 bg-blue-500 border border-white border-solid rounded-full btn menu-link menu-item-show:text-primary'
                  href='/portal'
                >
                  <div className='menu-title text-nowrap'>Portal</div>
                </a>
              </div>
            )}
          </div>
          {/* <!-- Topbar --> */}
          <div className='flex items-center gap-2 lg:gap-3.5'>
            {/* notification */}
            <div
              className='dropdown'
              data-dropdown='true'
              data-dropdown-offset='70px, 10px'
              data-dropdown-placement='bottom-end'
              data-dropdown-trigger='click|lg:click'
            >
              <button className='relative text-gray-500 rounded-full cursor-pointer dropdown-toggle btn btn-icon btn-icon-lg size-9 hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary'>
                <i className='ki-filled ki-notification-on'></i>
                {isRead && (
                  <span className='badge badge-dot badge-success size-[5px] absolute top-0.5 right-0.5 transform translate-y-1/2'></span>
                )}
              </button>
              <div className='dropdown-content light:border-gray-300 w-full max-w-[460px]'>
                <div
                  className='flex items-center justify-between gap-2.5 text-sm text-gray-900 font-semibold px-5 py-2.5 border-b border-b-gray-200'
                  id='notifications_header'
                >
                  Notifications
                  <button
                    className='btn btn-sm btn-icon btn-light btn-clear shrink-0'
                    data-dropdown-dismiss='true'
                  >
                    <i className='ki-filled ki-cross'></i>
                  </button>
                </div>
                <div
                  className='justify-between px-5 mb-2 tabs'
                  data-tabs='true'
                  id='notifications_tabs'
                ></div>
                {/* tab all */}
                <div className='grow' id='notifications_tab_all'>
                  <div className='flex flex-col'>
                    <div
                      className='scrollable-y-auto'
                      data-scrollable='true'
                      data-scrollable-dependencies='#header'
                      data-scrollable-max-height='auto'
                      data-scrollable-offset='200px'
                    >
                      <div className='flex flex-col gap-5 pt-3 pb-4 divider-y divider-gray-200'>
                        {notifications.map((notification: Notification, index) => {
                          return (
                            <>
                              <li key={index} className='flex grow gap-2.5 px-5'>
                                {messageNotifikasi(notification)}
                              </li>
                              <div className='border-b border-b-gray-200'></div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                    <div className='border-b border-b-gray-200'></div>
                    <div className='grid grid-cols-2 p-5 gap-2.5' id='notifications_all_footer'>
                      <button
                        onClick={(x) => action('/notifikasi/delete')}
                        className='justify-center btn btn-sm btn-light'
                      >
                        Delete all
                      </button>
                      <button
                        onClick={(x) => action('/notifikasi/read')}
                        className='justify-center btn btn-sm btn-light'
                      >
                        Mark all as read
                      </button>
                    </div>
                  </div>
                </div>
                {/* end tab all */}
              </div>
            </div>
            {/* notification */}
            {/* profile */}
            <div className='menu' data-menu='true'>
              <div
                className='menu-item'
                data-menu-item-offset='20px, 10px'
                data-menu-item-placement='bottom-end'
                data-menu-item-toggle='dropdown'
                data-menu-item-trigger='click|lg:click'
              >
                <div className='rounded-full menu-toggle btn btn-icon'>
                  <i className='!text-lg md:!text-3xl text-blue-500 ki-filled ki-profile-circle'></i>
                </div>
                <div className='menu-dropdown menu-default light:border-gray-300 w-screen max-w-[250px]'>
                  <div className='flex items-center justify-between px-5 py-1.5 gap-1.5'>
                    <div className='flex items-center gap-2'>
                      <img
                        alt=''
                        className='border-2 rounded-full size-9 border-success'
                        src={Logo}
                      ></img>
                      <div className='flex flex-col gap-1.5'>
                        <span className='text-sm font-semibold leading-none text-gray-800'>
                          {auth?.user?.name}
                        </span>
                        <a
                          className='text-xs font-medium leading-none text-gray-600 hover:text-primary'
                          href='html/demo1/account/home/get-started.html'
                        >
                          {auth?.user?.email}
                        </a>
                      </div>
                    </div>
                    {/* <span className='badge badge-xs badge-primary badge-outline'>
                      {auth?.user?.name}
                    </span> */}
                  </div>
                  <div className='menu-separator'></div>
                  <div className='flex flex-col'>
                    {/* <div className='menu-item'>
                      <a
                        className='menu-link'
                        href='html/demo1/public-profile/profiles/default.html'
                      >
                        <span className='menu-icon'>
                          <i className='ki-filled ki-badge'></i>
                        </span>
                        <span className='menu-title'>Public Profile</span>
                      </a>
                    </div> */}
                    {/* <div className='menu-item'>
                      <a className='menu-link' href='html/demo1/account/home/user-profile.html'>
                        <span className='menu-icon'>
                          <i className='ki-filled ki-profile-circle'></i>
                        </span>
                        <span className='menu-title'>My Profile</span>
                      </a>
                    </div> */}
                    {/* <div
                      className='menu-item'
                      data-menu-item-offset='-50px, 0'
                      data-menu-item-placement='left-start'
                      data-menu-item-toggle='dropdown'
                      data-menu-item-trigger='click|lg:hover'
                    >
                      <div className='menu-link'>
                        <span className='menu-icon'>
                          <i className='ki-filled ki-setting-2'></i>
                        </span>
                        <span className='menu-title'>My Account</span>
                        <span className='menu-arrow'>
                          <i className='ki-filled ki-right text-3xs'></i>
                        </span>
                      </div>
                      <div className='menu-dropdown menu-default light:border-gray-300 w-full max-w-[220px]'>
                        <div className='menu-item'>
                          <a className='menu-link' href='html/demo1/account/home/get-started.html'>
                            <span className='menu-icon'>
                              <i className='ki-filled ki-coffee'></i>
                            </span>
                            <span className='menu-title'>Get Started</span>
                          </a>
                        </div>
                        <div className='menu-item'>
                          <a className='menu-link' href='html/demo1/account/home/user-profile.html'>
                            <span className='menu-icon'>
                              <i className='ki-filled ki-some-files'></i>
                            </span>
                            <span className='menu-title'>My Profile</span>
                          </a>
                        </div>
                        <div className='menu-item'>
                          <a className='menu-link' href='#'>
                            <span className='menu-icon'>
                              <i className='ki-filled ki-icon'></i>
                            </span>
                            <span className='menu-title'>Billing</span>
                            <span
                              className='menu-badge'
                              data-tooltip='true'
                              data-tooltip-placement='top'
                            >
                              <i className='text-gray-500 ki-filled ki-information-2 text-md'></i>
                              <span className='tooltip' data-tooltip-content='true'>
                                Payment and subscription info
                              </span>
                            </span>
                          </a>
                        </div>
                        <div className='menu-item'>
                          <a className='menu-link' href='html/demo1/account/security/overview.html'>
                            <span className='menu-icon'>
                              <i className='ki-filled ki-medal-star'></i>
                            </span>
                            <span className='menu-title'>Security</span>
                          </a>
                        </div>
                        <div className='menu-item'>
                          <a className='menu-link' href='html/demo1/account/members/teams.html'>
                            <span className='menu-icon'>
                              <i className='ki-filled ki-setting'></i>
                            </span>
                            <span className='menu-title'>Members & Roles</span>
                          </a>
                        </div>
                        <div className='menu-item'>
                          <a className='menu-link' href='html/demo1/account/integrations.html'>
                            <span className='menu-icon'>
                              <i className='ki-filled ki-switch'></i>
                            </span>
                            <span className='menu-title'>Integrations</span>
                          </a>
                        </div>
                        <div className='menu-separator'></div>
                        <div className='menu-item'>
                          <a className='menu-link' href='html/demo1/account/security/overview.html'>
                            <span className='menu-icon'>
                              <i className='ki-filled ki-shield-tick'></i>
                            </span>
                            <span className='menu-title'>Notifications</span>
                            <label className='switch switch-sm'>
                              {''}
                              <input checked={false} name='check' type='checkbox' value='1'></input>
                            </label>
                          </a>
                        </div>
                      </div>
                    </div> */}
                  </div>
                  <div className='menu-separator'></div>
                  <div className='flex flex-col'>
                    <div className='menu-item px-4 py-1.5'>
                      <a className='justify-center btn btn-sm btn-light' href='/logout'>
                        Log out
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end profile */}
          </div>
          {/* <!-- End of Topbar --> */}
        </div>
      </header>
    </>
  );
}
