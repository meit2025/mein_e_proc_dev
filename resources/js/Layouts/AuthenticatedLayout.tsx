
import { useState, PropsWithChildren, ReactNode } from 'react';


export default function AuthenticatedLayout({ header, children }: PropsWithChildren<{ header?: ReactNode }>) {
  
    return (
        <div className="py-4 px-16">
            {header ?  <header>
                {header}
            </header> : null}
            <main className="">
                {children}
            </main>
        </div>
    );
}