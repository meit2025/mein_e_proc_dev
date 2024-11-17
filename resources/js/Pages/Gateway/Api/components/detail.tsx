export const DetailLayout = (detail: any) => {
  const data = detail?.detail;
  return (
    <ul role='list' className='divide-y divide-gray-100 h-screen'>
      <li className='flex justify-between gap-x-6 py-5'>
        <div className='flex min-w-0 gap-x-4'>
          <div className='min-w-0 flex-auto'>
            <p className='text-sm font-semibold leading-6 text-gray-900'>{'name'}</p>
            <p className='mt-1 truncate text-xs leading-5 text-gray-500'>{data?.name}</p>
          </div>
        </div>
      </li>
      <li className='flex justify-between gap-x-6 py-5'>
        <div className='flex min-w-0 gap-x-4'>
          <div className='min-w-0 flex-auto'>
            <p className='text-sm font-semibold leading-6 text-gray-900'>{'methods'}</p>
            <p className='mt-1 truncate text-xs leading-5 text-gray-500'>{data?.methods}</p>
          </div>
        </div>
      </li>
      <li className='flex justify-between gap-x-6 py-5'>
        <div className='flex min-w-0 gap-x-4'>
          <div className='min-w-0 flex-auto'>
            <p className='text-sm font-semibold leading-6 text-gray-900'>{'tabel name'}</p>
            <p className='mt-1 truncate text-xs leading-5 text-gray-500'>{data?.tabel_name}</p>
          </div>
        </div>
      </li>
      <li className='flex justify-between gap-x-6 py-5'>
        <div className='flex min-w-0 gap-x-4'>
          <div className='min-w-0 flex-auto'>
            <p className='text-sm font-semibold leading-6 text-gray-900'>{'Action type'}</p>
            <p className='mt-1 truncate text-xs leading-5 text-gray-500'>{data?.type}</p>
          </div>
        </div>
      </li>
      <li className='flex justify-between gap-x-6 py-5'>
        <div className='flex min-w-0 gap-x-4'>
          <div className='min-w-0 flex-auto'>
            <p className='text-sm font-semibold leading-6 text-gray-900'>{'Comment'}</p>
            <p className='mt-1 truncate text-xs leading-5 text-gray-500'>{data?.command}</p>
          </div>
        </div>
      </li>
    </ul>
  );
};
