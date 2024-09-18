import React, { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
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
        </div>
      </div>
      {/* Main content */}
      <main className='p-8'>{children}</main>
      {/* Example of a footer */}
      <footer className='bg-blue-500 text-white p-4'>Footer Content</footer>
    </div>
  );
}
