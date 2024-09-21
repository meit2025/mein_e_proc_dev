import { ReactNode } from 'react';
import MainLayout from '../Layouts/MainLayout';
import FormInput from '@/components/Input/formInput';
import { useForm, FormProvider } from 'react-hook-form';
import { Button } from '@mui/material';
import FormCheckbox from '@/components/Input/formCheckbox';
import SearchIcon from '@mui/icons-material/Search';
import FormAutocomplete from '@/components/Input/formDropdown';
import FormTextArea from '@/components/Input/formTextArea';
import FormSwitch from '@/components/Input/formSwitch';
import FormMultiSelect from '@/components/Input/formMultiSelect';
import FormFileUpload from '@/components/Input/formFieldUpload';
import { FormFieldModel } from '@/interfaces/form/formWrapper';
import FormMapping from '@/components/form/FormMapping';

const formModel: Array<FormFieldModel<any>> = [
  {
    type: 'input',
    name: 'firstName',
    label: 'First Name',
    placeholder: 'Enter your first name',
    required: true,
  },
  {
    type: 'multiselect',
    name: 'hobbies',
    label: 'Select Hobbies',
    options: [
      { label: 'Reading', value: 'reading' },
      { label: 'Traveling', value: 'traveling' },
      { label: 'Cooking', value: 'cooking' },
    ],
    required: true,
    placeholder: 'Choose your hobbies',
  },
  {
    type: 'multiselect',
    name: 'favoriteNumbers',
    label: 'Select Favorite Numbers',
    options: [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
      { label: 'Three', value: 3 },
    ],
    required: true,
    placeholder: 'Choose your favorite numbers',
  },
];

function Index() {
  const url = 'https://api.example.com/submit';
  return (
    <>
      <div className='container-fixed'>
        <div className='flex flex-wrap items-center lg:items-end justify-between gap-5 pb-7.5'>
          <div className='flex flex-col justify-center gap-2'>
            <h1 className='text-xl font-medium leading-none text-gray-900'>Dashboard</h1>
            <div className='flex items-center gap-2 text-sm font-normal text-gray-700'>
              Central Hub for Personal Customization
            </div>
          </div>
          <div className='flex items-center gap-2.5'>
            <a
              className='btn btn-sm btn-light'
              href='html/demo1/public-profile/profiles/default.html'
            >
              View Profile
            </a>
          </div>
        </div>
      </div>
      <div className='container-fixed'>
        <div className='grid gap-5 lg:gap-7.5'>
          <div className='grid lg:grid-cols-3 gap-y-5 lg:gap-7.5 items-stretch'>
            <div className='lg:col-span-1'>
              <div className='grid grid-cols-2 gap-5 lg:gap-7.5 h-full items-stretch'>
                <div className='card flex-col justify-between gap-6 h-full bg-cover bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg'>
                  <img
                    alt=''
                    className='w-7 mt-4 ms-5'
                    src='assets/media/brand-logos/linkedin-2.svg'
                  />
                  <div className='flex flex-col gap-1 pb-4 px-5'>
                    <span className='text-3xl font-semibold text-gray-900'>9.3k</span>
                    <span className='text-2sm font-normal text-gray-700'>Amazing mates</span>
                  </div>
                </div>
                <div className='card flex-col justify-between gap-6 h-full bg-cover bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg'>
                  <img
                    alt=''
                    className='w-7 mt-4 ms-5'
                    src='assets/media/brand-logos/youtube-2.svg'
                  />
                  <div className='flex flex-col gap-1 pb-4 px-5'>
                    <span className='text-3xl font-semibold text-gray-900'>24k</span>
                    <span className='text-2sm font-normal text-gray-700'>Lessons Views</span>
                  </div>
                </div>
                <div className='card flex-col justify-between gap-6 h-full bg-cover bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg'>
                  <img
                    alt=''
                    className='w-7 mt-4 ms-5'
                    src='assets/media/brand-logos/instagram-03.svg'
                  />
                  <div className='flex flex-col gap-1 pb-4 px-5'>
                    <span className='text-3xl font-semibold text-gray-900'>608</span>
                    <span className='text-2sm font-normal text-gray-700'>New subscribers</span>
                  </div>
                </div>
                <div className='card flex-col justify-between gap-6 h-full bg-cover bg-[right_top_-1.7rem] bg-no-repeat channel-stats-bg'>
                  <img
                    alt=''
                    className='dark:hidden w-7 mt-4 ms-5'
                    src='assets/media/brand-logos/tiktok.svg'
                  />
                  <img
                    alt=''
                    className='light:hidden w-7 mt-4 ms-5'
                    src='assets/media/brand-logos/tiktok-dark.svg'
                  />
                  <div className='flex flex-col gap-1 pb-4 px-5'>
                    <span className='text-3xl font-semibold text-gray-900'>2.5k</span>
                    <span className='text-2sm font-normal text-gray-700'>Stream audience</span>
                  </div>
                </div>
              </div>
            </div>
            <div className='lg:col-span-2'>
              <div className='card h-full h-full'>
                <div className='card-body p-10 bg-[length:80%] [background-position:175%_25%] bg-no-repeat entry-callout-bg'>
                  <div className='flex flex-col justify-center gap-4'>
                    <div className='flex -space-x-2'>
                      <div className='flex'>
                        <img
                          className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-10'
                          src='assets/media/avatars/300-4.png'
                        />
                      </div>
                      <div className='flex'>
                        <img
                          className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-10'
                          src='assets/media/avatars/300-1.png'
                        />
                      </div>
                      <div className='flex'>
                        <img
                          className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-10'
                          src='assets/media/avatars/300-2.png'
                        />
                      </div>
                      <div className='flex'>
                        <span className='hover:z-5 relative inline-flex items-center justify-center shrink-0 rounded-full ring-1 font-semibold leading-none text-3xs size-10 text-success-inverse text-xs ring-success-light bg-success'>
                          S
                        </span>
                      </div>
                    </div>
                    <h2 className='text-1.5xl font-semibold text-gray-900'>
                      Connect Today & Join
                      <br />
                      the
                      <a className='link' href='#'>
                        KeenThemes Network
                      </a>
                    </h2>
                    <p className='text-sm font-normal text-gray-700 leading-5.5'>
                      Enhance your projects with premium themes and
                      <br />
                      templates. Join the KeenThemes community today
                      <br />
                      for top-quality designs and resources.
                    </p>
                  </div>
                </div>
                <div className='card-footer justify-center'>
                  <a className='btn btn-link' href='html/demo1/account/home/get-started.html'>
                    Get Started
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch'>
          <div className='lg:col-span-1'>
            <div className='card h-full'>
              <div className='card-header'>
                <h3 className='card-title'>Highlights</h3>
                <div className='menu' data-menu='true'>
                  <div
                    className='menu-item'
                    data-menu-item-offset='0, 10px'
                    data-menu-item-placement='bottom-end'
                    data-menu-item-toggle='dropdown'
                    data-menu-item-trigger='click|lg:click'
                  >
                    <button className='menu-toggle btn btn-sm btn-icon btn-light btn-clear'>
                      <i className='ki-filled ki-dots-vertical'></i>
                    </button>
                    <div
                      className='menu-dropdown menu-default w-full max-w-[200px]'
                      data-menu-dismiss='true'
                    >
                      <div className='menu-item'>
                        <a className='menu-link' href='html/demo1/account/activity.html'>
                          <span className='menu-icon'>
                            <i className='ki-filled ki-cloud-change'></i>
                          </span>
                          <span className='menu-title'>Activity</span>
                        </a>
                      </div>
                      <div className='menu-item'>
                        <a className='menu-link' data-modal-toggle='#share_profile_modal' href='#'>
                          <span className='menu-icon'>
                            <i className='ki-filled ki-share'></i>
                          </span>
                          <span className='menu-title'>Share</span>
                        </a>
                      </div>
                      <div
                        className='menu-item'
                        data-menu-item-offset='-15px, 0'
                        data-menu-item-placement='right-start'
                        data-menu-item-toggle='dropdown'
                        data-menu-item-trigger='click|lg:hover'
                      >
                        <div className='menu-link'>
                          <span className='menu-icon'>
                            <i className='ki-filled ki-notification-status'></i>
                          </span>
                          <span className='menu-title'>Notifications</span>
                          <span className='menu-arrow'>
                            <i className='ki-filled ki-right text-3xs'></i>
                          </span>
                        </div>
                        <div className='menu-dropdown menu-default w-full max-w-[175px]'>
                          <div className='menu-item'>
                            <a
                              className='menu-link'
                              href='html/demo1/account/home/settings-sidebar.html'
                            >
                              <span className='menu-icon'>
                                <i className='ki-filled ki-sms'></i>
                              </span>
                              <span className='menu-title'>Email</span>
                            </a>
                          </div>
                          <div className='menu-item'>
                            <a
                              className='menu-link'
                              href='html/demo1/account/home/settings-sidebar.html'
                            >
                              <span className='menu-icon'>
                                <i className='ki-filled ki-message-notify'></i>
                              </span>
                              <span className='menu-title'>SMS</span>
                            </a>
                          </div>
                          <div className='menu-item'>
                            <a
                              className='menu-link'
                              href='html/demo1/account/home/settings-sidebar.html'
                            >
                              <span className='menu-icon'>
                                <i className='ki-filled ki-notification-status'></i>
                              </span>
                              <span className='menu-title'>Push</span>
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className='menu-item'>
                        <a className='menu-link' data-modal-toggle='#report_user_modal' href='#'>
                          <span className='menu-icon'>
                            <i className='ki-filled ki-dislike'></i>
                          </span>
                          <span className='menu-title'>Report</span>
                        </a>
                      </div>
                      <div className='menu-separator'></div>
                      <div className='menu-item'>
                        <a
                          className='menu-link'
                          href='html/demo1/account/home/settings-enterprise.html'
                        >
                          <span className='menu-icon'>
                            <i className='ki-filled ki-setting-3'></i>
                          </span>
                          <span className='menu-title'>Settings</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='card-body flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4'>
                <div className='flex flex-col gap-0.5'>
                  <span className='text-sm font-normal text-gray-700'>All time sales</span>
                  <div className='flex items-center gap-2.5'>
                    <span className='text-3xl font-semibold text-gray-900'>$295.7k</span>
                    <span className='badge badge-outline badge-success badge-sm'>+2.7%</span>
                  </div>
                </div>
                <div className='flex items-center gap-1 mb-1.5'>
                  <div className='bg-success h-2 w-full max-w-[60%] rounded-sm'></div>
                  <div className='bg-brand h-2 w-full max-w-[25%] rounded-sm'></div>
                  <div className='bg-info h-2 w-full max-w-[15%] rounded-sm'></div>
                </div>
                <div className='flex items-center flex-wrap gap-4 mb-1'>
                  <div className='flex items-center gap-1.5'>
                    <span className='badge badge-dot size-2 badge-success'></span>
                    <span className='text-sm font-normal text-gray-800'>Metronic</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <span className='badge badge-dot size-2 badge-danger'></span>
                    <span className='text-sm font-normal text-gray-800'>Bundle</span>
                  </div>
                  <div className='flex items-center gap-1.5'>
                    <span className='badge badge-dot size-2 badge-info'></span>
                    <span className='text-sm font-normal text-gray-800'>MetronicNest</span>
                  </div>
                </div>
                <div className='border-b border-gray-300'></div>
                <div className='grid gap-3'>
                  <div className='flex items-center justify-between flex-wrap gap-2'>
                    <div className='flex items-center gap-1.5'>
                      <i className='ki-filled ki-shop text-base text-gray-500'></i>
                      <span className='text-sm font-normal text-gray-900'>Online Store</span>
                    </div>
                    <div className='flex items-center text-sm font-medium text-gray-800 gap-6'>
                      <span className='lg:text-right'>$172k</span>
                      <span className='lg:text-right'>
                        <i className='ki-filled ki-arrow-up text-success'></i>
                        3.9%
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between flex-wrap gap-2'>
                    <div className='flex items-center gap-1.5'>
                      <i className='ki-filled ki-facebook text-base text-gray-500'></i>
                      <span className='text-sm font-normal text-gray-900'>Facebook</span>
                    </div>
                    <div className='flex items-center text-sm font-medium text-gray-800 gap-6'>
                      <span className='lg:text-right'>$85k</span>
                      <span className='lg:text-right'>
                        <i className='ki-filled ki-arrow-down text-danger'></i>
                        0.7%
                      </span>
                    </div>
                  </div>
                  <div className='flex items-center justify-between flex-wrap gap-2'>
                    <div className='flex items-center gap-1.5'>
                      <i className='ki-filled ki-instagram text-base text-gray-500'></i>
                      <span className='text-sm font-normal text-gray-900'>Instagram</span>
                    </div>
                    <div className='flex items-center text-sm font-medium text-gray-800 gap-6'>
                      <span className='lg:text-right'>$36k</span>
                      <span className='lg:text-right'>
                        <i className='ki-filled ki-arrow-up text-success'></i>
                        8.2%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='lg:col-span-2'>
            <div className='card h-full'>
              <div className='card-header'>
                <h3 className='card-title'>Earnings</h3>
                <div className='flex gap-5'>
                  <label className='switch switch-sm'>
                    <input className='order-2' name='check' type='checkbox' value='1' />
                    <span className='switch-label order-1'>Referrals only</span>
                  </label>
                  <select className='select select-sm w-28' name='select'>
                    <option value='1'>1 month</option>
                    <option value='2'>3 month</option>
                    <option value='3'>6 month</option>
                    <option value='4'>12 month</option>
                  </select>
                </div>
              </div>
              <div className='card-body flex flex-col justify-end items-stretch grow px-3 py-1'>
                <div id='earnings_chart'></div>
              </div>
            </div>
          </div>
        </div>

        <div className='grid lg:grid-cols-3 gap-5 lg:gap-7.5 items-stretch'>
          <div className='lg:col-span-1'>
            <div className='card h-full'>
              <div className='card-body lg:p-7.5 lg:pt-6 p-5'>
                <div className='flex items-center justify-between flex-wrap gap-5 mb-7.5'>
                  <div className='flex flex-col gap-1'>
                    <span className='text-1.5xl font-semibold text-gray-900'>Team Meeting</span>
                    <span className='text-sm font-semibold text-gray-800'>09:00 - 09:30</span>
                  </div>
                  <img alt='' className='size-7' src='assets/media/brand-logos/zoom.svg' />
                </div>
                <p className='text-sm font-normal text-gray-800 leading-5.5 mb-8'>
                  Team meeting to discuss strategies, outline
                  <br />
                  project milestones, define key goals, and
                  <br />
                  establish clear timelines.
                </p>
                <div className='flex rounded-lg bg-gray-100 gap-10 p-5'>
                  <div className='flex flex-col gap-5'>
                    <div className='flex items-center gap-1.5 text-sm font-normal text-gray-800'>
                      <i className='ki-filled ki-geolocation text-base text-gray-500'></i>
                      Location
                    </div>
                    <div className='text-sm font-medium text-gray-800 pt-1.5'>Amsterdam</div>
                  </div>
                  <div className='flex flex-col gap-5'>
                    <div className='flex items-center gap-1.5 text-sm font-normal text-gray-800'>
                      <i className='ki-filled ki-users text-base text-gray-500'></i>
                      Team
                    </div>
                    <div className='flex -space-x-2'>
                      <div className='flex'>
                        <img
                          className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                          src='assets/media/avatars/300-4.png'
                        />
                      </div>
                      <div className='flex'>
                        <img
                          className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                          src='assets/media/avatars/300-1.png'
                        />
                      </div>
                      <div className='flex'>
                        <img
                          className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                          src='assets/media/avatars/300-2.png'
                        />
                      </div>
                      <div className='flex'>
                        <span className='hover:z-5 relative inline-flex items-center justify-center shrink-0 rounded-full ring-1 font-semibold leading-none text-3xs size-[30px] text-success-inverse text-4xs ring-success-light bg-success'>
                          +10
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className='card-footer justify-center'>
                <a className='btn btn-link' href=''>
                  Join Meeting
                </a>
              </div>
            </div>
          </div>
          <div className='lg:col-span-2'>
            <div className='grid'>
              <div className='card card-grid h-full min-w-full'>
                <div className='card-header'>
                  <h3 className='card-title'>Teams</h3>
                  <div className='input input-sm max-w-48'>
                    <i className='ki-filled ki-magnifier'></i>
                    <input placeholder='Search Teams' type='text' />
                  </div>
                </div>
                <div className='card-body'>
                  <div data-datatable='true' data-datatable-page-size='5'>
                    <div className='scrollable-x-auto'>
                      <table className='table table-border' data-datatable-table='true'>
                        <thead>
                          <tr>
                            <th className='w-[60px]'>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-check='true'
                                type='checkbox'
                              />
                            </th>
                            <th className='min-w-[280px]'>
                              <span className='sort asc'>
                                <span className='sort-label'>Team</span>
                                <span className='sort-icon'></span>
                              </span>
                            </th>
                            <th className='min-w-[135px]'>
                              <span className='sort'>
                                <span className='sort-label'>Rating</span>
                                <span className='sort-icon'></span>
                              </span>
                            </th>
                            <th className='min-w-[135px]'>
                              <span className='sort'>
                                <span className='sort-label'>Last Modified</span>
                                <span className='sort-icon'></span>
                              </span>
                            </th>
                            <th className='min-w-[135px]'>
                              <span className='sort'>
                                <span className='sort-label'>Members</span>
                                <span className='sort-icon'></span>
                              </span>
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='1'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  Product Management
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Product development & lifecycle
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>21 Oct, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-4.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-1.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-2.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <span className='relative inline-flex items-center justify-center shrink-0 rounded-full ring-1 font-semibold leading-none text-3xs size-[30px] text-success-inverse ring-success-light bg-success'>
                                    +10
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='2'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  Marketing Team
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Campaigns & market analysis
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label indeterminate'>
                                  <i
                                    className='rating-on ki-solid ki-star text-base leading-none'
                                    style={{
                                      width: '50.0%',
                                    }}
                                  ></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>15 Oct, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-4.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <span className='hover:z-5 relative inline-flex items-center justify-center shrink-0 rounded-full ring-1 font-semibold leading-none text-3xs size-[30px] uppercase text-warning-inverse ring-warning-light bg-warning'>
                                    g
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='3'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  HR Department
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Talent acquisition, employee welfare
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>10 Oct, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-4.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-1.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-2.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <span className='relative inline-flex items-center justify-center shrink-0 rounded-full ring-1 font-semibold leading-none text-3xs size-[30px] text-info-inverse ring-info-light bg-info'>
                                    +A
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='4'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  Sales Division
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Customer relations, sales strategy
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>05 Oct, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-24.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-7.png'
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='5'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  Development Team
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Software development
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label indeterminate'>
                                  <i
                                    className='rating-on ki-solid ki-star text-base leading-none'
                                    style={{
                                      width: '50.0%',
                                    }}
                                  ></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>01 Oct, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-3.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-8.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-9.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <span className='relative inline-flex items-center justify-center shrink-0 rounded-full ring-1 font-semibold leading-none text-3xs size-[30px] text-danger-inverse ring-danger-light bg-danger'>
                                    +5
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='6'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  Quality Assurance
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Product testing
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>25 Sep, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-6.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-5.png'
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='7'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  Finance Team
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Financial planning
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>20 Sep, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-10.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-11.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-12.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <span className='relative inline-flex items-center justify-center shrink-0 rounded-full ring-1 font-semibold leading-none text-3xs size-[30px] text-primary-inverse ring-primary-light bg-primary'>
                                    +8
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='8'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  Customer Support
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Customer service
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label indeterminate'>
                                  <i
                                    className='rating-on ki-solid ki-star text-base leading-none'
                                    style={{
                                      width: '50.0%',
                                    }}
                                  ></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>15 Sep, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-13.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-14.png'
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='9'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  R&D Team
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Research & development
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>10 Sep, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-15.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-16.png'
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='10'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  Operations Team
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Operations management
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>05 Sep, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-17.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-18.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-19.png'
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='11'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  IT Support
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Technical support
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>01 Sep, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-20.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-21.png'
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='12'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  Legal Team
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Legal support
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>25 Aug, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-22.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-23.png'
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='13'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  Logistics Team
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Supply chain
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label indeterminate'>
                                  <i
                                    className='rating-on ki-solid ki-star text-base leading-none'
                                    style={{
                                      width: '50.0%',
                                    }}
                                  ></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>20 Aug, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-24.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-25.png'
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='14'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  Procurement Team
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Supplier management
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>15 Aug, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-26.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-27.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-28.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <span className='relative inline-flex items-center justify-center shrink-0 rounded-full ring-1 font-semibold leading-none text-3xs size-[30px] text-info-inverse ring-info-light bg-info'>
                                    +3
                                  </span>
                                </div>
                              </div>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <input
                                className='checkbox checkbox-sm'
                                data-datatable-row-check='true'
                                type='checkbox'
                                value='15'
                              />
                            </td>
                            <td>
                              <div className='flex flex-col gap-2'>
                                <a
                                  className='leading-none font-medium text-sm text-gray-900 hover:text-primary'
                                  href='#'
                                >
                                  Training Team
                                </a>
                                <span className='text-2sm text-gray-700 font-normal leading-3'>
                                  Employee training
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='rating'>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label checked'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                                <div className='rating-label'>
                                  <i className='rating-on ki-solid ki-star text-base leading-none'></i>
                                  <i className='rating-off ki-outline ki-star text-base leading-none'></i>
                                </div>
                              </div>
                            </td>
                            <td>10 Aug, 2024</td>
                            <td>
                              <div className='flex -space-x-2'>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-29.png'
                                  />
                                </div>
                                <div className='flex'>
                                  <img
                                    className='hover:z-5 relative shrink-0 rounded-full ring-1 ring-light-light size-[30px]'
                                    src='assets/media/avatars/300-30.png'
                                  />
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className='card-footer justify-center md:justify-between flex-col md:flex-row gap-5 text-gray-600 text-2sm font-medium'>
                      <div className='flex items-center gap-2 order-2 md:order-1'>
                        Show
                        <select
                          className='select select-sm w-16'
                          data-datatable-size='true'
                          name='perpage'
                        ></select>
                        per page
                      </div>
                      <div className='flex items-center gap-4 order-1 md:order-2'>
                        <span data-datatable-info='true'></span>
                        <div className='pagination' data-datatable-pagination='true'></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Assign layout to the page
Index.layout = (page: ReactNode) => <MainLayout>{page}</MainLayout>;

export default Index;
