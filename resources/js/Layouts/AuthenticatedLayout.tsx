
import { useState, PropsWithChildren, ReactNode } from 'react';


export default function AuthenticatedLayout({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
  
    return (
      <div className='py-4 relative px-16'>
        <div className='bg-gray-100 absolute top-0 left-0 -z-10 h-screen w-screen'></div>
        <div className="z-10">
          {header ? <header>{header}</header> : null}
          <main className=''>{children}</main>
        </div>
      </div>
    );
}