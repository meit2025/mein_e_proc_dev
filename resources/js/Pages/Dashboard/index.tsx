import { ReactNode } from 'react';
import MainLayout from '../Layouts/MainLayout';

function Index() {
  const url = 'https://api.example.com/submit';
  return (
    <>
      <div className='container-fixed'>
        <div className='flex flex-wrap items-center lg:items-end justify-between gap-5 pb-7.5'>
          <div className='flex flex-col justify-center gap-2'>
            <h1 className='text-xl font-medium leading-none text-gray-900'>Dashboard</h1>
            <div className='flex items-center gap-2 text-sm font-normal text-gray-700'>
              Mitsubishi Electric Indonesia
            </div>
          </div>
        </div>
      </div>
      <div className='container-fixed'>
        <div className='grid grid-cols-1 gap-5 h-full'>
          <div className='flex justify-center gap-2 py-[20%]'>
            <h1 className='text-5xl font-bold leading-none text-gray-900'>COMING SOON</h1>
          </div>
        </div>
      </div>
    </>
  );
}

// Assign layout to the page
Index.layout = (page: ReactNode) => <MainLayout>{page}</MainLayout>;

export default Index;
