import moment from 'moment';

export const DetailLayout = (detail: any) => {
  const data = detail?.detail;

  return (
    <>
      <p className='text-sm font-semibold leading-6 text-yellow-500 uppercase'>
        This user is {data.is_admin === '0' && 'not'} admin <br></br>
        This user is {!data.is_approval && 'not'} User Approval{' '}
      </p>
      <ul role='list' className='divide-y divide-gray-100 h-screen'>
        <li className='flex justify-between gap-x-6 py-5'>
          <div className='flex min-w-0 gap-x-4'>
            <div className='min-w-0 flex-auto'>
              <p className='text-sm font-semibold leading-6 text-gray-900 uppercase'>
                {'Username'}
              </p>
              <p className='mt-1 truncate text-xs leading-5 text-gray-500'>{data?.username}</p>
            </div>
          </div>
        </li>
        <li className='flex justify-between gap-x-6 py-5'>
          <div className='flex min-w-0 gap-x-4'>
            <div className='min-w-0 flex-auto'>
              <p className='text-sm font-semibold leading-6 text-gray-900 uppercase'>{'name'}</p>
              <p className='mt-1 truncate text-xs leading-5 text-gray-500'>{data?.name}</p>
            </div>
          </div>
        </li>
        <li className='flex justify-between gap-x-6 py-5'>
          <div className='flex min-w-0 gap-x-4'>
            <div className='min-w-0 flex-auto'>
              <p className='text-sm font-semibold leading-6 text-gray-900 uppercase'>{'nip'}</p>
              <p className='mt-1 truncate text-xs leading-5 text-gray-500'>{data?.nip}</p>
            </div>
          </div>
        </li>
        <li className='flex justify-between gap-x-6 py-5'>
          <div className='flex min-w-0 gap-x-4'>
            <div className='min-w-0 flex-auto'>
              <p className='text-sm font-semibold leading-6 text-gray-900 uppercase'>{'email'}</p>
              <p className='mt-1 truncate text-xs leading-5 text-gray-500'>{data?.email}</p>
            </div>
          </div>
        </li>
        <li className='flex justify-between gap-x-6 py-5'>
          <div className='flex min-w-0 gap-x-4'>
            <div className='min-w-0 flex-auto'>
              <p className='text-sm font-semibold leading-6 text-gray-900 uppercase'>
                {'division'}
              </p>
              <p className='mt-1 truncate text-xs leading-5 text-gray-500'>
                {data?.divisions?.name}
              </p>
            </div>
          </div>
        </li>
        <li className='flex justify-between gap-x-6 py-5'>
          <div className='flex min-w-0 gap-x-4'>
            <div className='min-w-0 flex-auto'>
              <p className='text-sm font-semibold leading-6 text-gray-900 uppercase'>
                {'Position'}
              </p>
              <p className='mt-1 truncate text-xs leading-5 text-gray-500'>
                {data?.positions?.name}
              </p>
            </div>
          </div>
        </li>
        <li className='flex justify-between gap-x-6 py-5'>
          <div className='flex min-w-0 gap-x-4'>
            <div className='min-w-0 flex-auto'>
              <p className='text-sm font-semibold leading-6 text-gray-900 uppercase'>
                {'Departement'}
              </p>
              <p className='mt-1 truncate text-xs leading-5 text-gray-500'>
                {data?.departements?.name}
              </p>
            </div>
          </div>
        </li>
        <li className='flex justify-between gap-x-6 py-5'>
          <div className='flex min-w-0 gap-x-4'>
            <div className='min-w-0 flex-auto'>
              <p className='text-sm font-semibold leading-6 text-gray-900 uppercase'>
                {'Employee'}
              </p>
              <p className='mt-1 truncate text-xs leading-5 text-gray-500'>
                {data?.employee?.name_one}
              </p>
            </div>
          </div>
        </li>
        <li className='flex justify-between gap-x-6 py-5'>
          <div className='flex min-w-0 gap-x-4'>
            <div className='min-w-0 flex-auto'>
              <p className='text-sm font-semibold leading-6 text-gray-900 uppercase'>{'Role'}</p>
              <p className='mt-1 truncate text-xs leading-5 text-gray-500'>{data?.role?.name}</p>
            </div>
          </div>
        </li>
        <li className='flex justify-between gap-x-6 py-5'>
          <div className='flex min-w-0 gap-x-4'>
            <div className='min-w-0 flex-auto'>
              <p className='text-sm font-semibold leading-6 text-gray-900 uppercase'>
                {'Join Date'}
              </p>
              <p className='mt-1 truncate text-xs leading-5 text-gray-500'>
                {moment(data?.created_at).format('DD-MM-YYYY')}
              </p>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};
