export const DetailLayout = (detail: any) => {
  const data = detail?.detail;
  return (
    <ul role='list' className='divide-y divide-gray-100 h-screen'>
      <li className='flex justify-between gap-x-6 py-5'>
        <div className='flex min-w-0 gap-x-4'>
          <div className='min-w-0 flex-auto'>
            <p className='text-sm font-semibold leading-6 text-gray-900'>{'name'}</p>
            <p className='mt-1 truncate leading-5 text-gray-500 font-semibold leading-6 text-lg'>
              {data?.name}
            </p>
          </div>
        </div>
      </li>
      <hr></hr>
      <li className='flex justify-between gap-x-6 py-5'>
        <div className='flex min-w-0 gap-x-4'>
          <div className='min-w-0 flex-auto'>
            <p className=' text-lg font-semibold leading-6 text-gray-900'>{'Permission'}</p>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4'>
              {(data?.permissions_array ?? []).map((item: string, index: number) => {
                return (
                  <div key={index} className='bg-gray-100 p-2 rounded'>
                    <p>{item}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
};
