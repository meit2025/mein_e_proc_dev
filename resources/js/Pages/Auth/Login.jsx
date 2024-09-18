import * as React from 'react';

import { Button } from '@/components/shacdn/button'; 
// import image_logo from  '../../../assets/images/mitsubishi_logo';
export default function Login() {
    return (
      <div className='bg-white flex h-screen w-screen fixed top-0 left-0 justify-center '>
        <div className='flex w-full items-center flex-col space-y-4'>
          <div className='my-4'>{/* <img src={image_logo} alt="" /> */}</div>
          <div className='md:w-1/4 md:my-12 bg-white rounded-md shadow-md md:p-6 '>
            <div className='text-center text-2xl'>Sign In</div>
            <div className='md:mt-4 md:px-6'>
              <div className='form-group flex flex-col space-y-2'>
                <label htmlFor='' className='text-sm'>
                  Email
                </label>
                <input
                  type='text'
                  placeholder='Insert email'
                  className='py-2 px-3 rounded-md bg-gray-200 text-xs'
                />
              </div>

              <div className='form-group mt-2 flex flex-col space-y-2'>
                <label htmlFor='' className='text-sm'>
                  Password
                </label>
                <input
                  type='password'
                  placeholder='Insert password'
                  className='py-2 px-3 rounded-md bg-gray-200 text-xs'
                />
              </div>

              <div className='flex space-x-2 my-2 items-center'>
                <input type='checkbox' className='' /> 
                <span className='text-xs'>
                  Remeber me
                </span>
              </div>

              <button className='w-full rounded-md bg-blue-400 text-white flex justify-center items-center py-2 '>
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    );
}