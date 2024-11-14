import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import { ScrollArea } from '@/components/shacdn/scroll-area';

interface MainLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

export default function MainLayout({ children, title, description }: MainLayoutProps) {
  return (
    <div className='antialiased flex h-full text-base text-gray-700 [--tw-page-bg:#fefefe] [--tw-page-bg-dark:var(--tw-coal-500)] demo1 sidebar-fixed header-fixed bg-[--tw-page-bg] dark:bg-[--tw-page-bg-dark]'>
      {/* Example of a header */}
      <div className='flex grow'>
        {/* sidebar */}
        <Sidebar />
        {/* end sidebar */}
        <div className='wrapper flex grow flex-col'>
          {/* header */}
          <Header />
          {/* end header */}
          <main className='grow content pt-5' id='content' role='content'>
            <div className='container-fixed' id='content_container'></div>
            {title && (
              <div className='container-fixed'>
                <div className='flex flex-wrap items-center lg:items-end justify-between gap-5 pb-7.5'>
                  <div className='flex flex-col justify-center gap-2'>
                    <h1 className='text-xl font-medium leading-none text-gray-900'>{title}</h1>
                    <div className='flex items-center gap-2 text-sm font-normal text-gray-700'>
                      {description}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div
              className='container-fixed'
              style={{
                height: '100%',
              }}
            >
              <ScrollArea>{children}</ScrollArea>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}
