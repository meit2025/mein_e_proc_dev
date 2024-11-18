import React from 'react';
import { LoadingSpin } from './LoadingSpin';

export function CustomFormWrapper({
  isLoading = false,
  children,
}: {
  isLoading: boolean;
  chidren: React.ReactNode;
}) {
  return (
    <div className=''>
      {isLoading ? (
        <>
          <div className='h-64 w-full flex justify-center items-center'>
            <LoadingSpin />
          </div>
        </>
      ) : (
        children
      )}
    </div>
  );
}
