import * as React from 'react';

import { Button } from '@/components/shacdn/button';
// import image_logo from  '../../../assets/images/mitsubishi_logo';
// import { Button } from '@/components/shacdn/button';
import { PasswordInput } from '@/components/commons/PasswordInput';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shacdn/form';

import { Checkbox } from '@/components/shacdn/checkbox';

('use client');

import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/shacdn/input';

import { z } from 'zod';

import { router, usePage } from '@inertiajs/react';

const formSchema = z.object({
  username: z.string().min(1, {
    message: 'Username required',
  }),
  password: z.string().min(1, {
    message: 'Password required',
  }),
  remember_me: z.boolean().default(false).optional(),
});

import { useForm } from 'react-hook-form';
import axios, { AxiosError } from 'axios';
import { useAlert } from '../../contexts/AlertContext.jsx';
import axiosInstance from '@/axiosInstance.js';

export function LoginForm() {
  const { errors } = usePage().props;

  const [loading, setLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
      remember_me: false,
    },
  });

  const { showToast } = useAlert();

  // console.log(fileImage)

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      setTimeout(async () => {
        setLoading(false);

        // Menggunakan axios untuk mengirim permintaan POST
        const response = await axiosInstance.post('/login', values);
        showToast(response.data.message, 'success');
        window.location.href = '/';
      }, 2000);
    } catch (error) {
      const resultError = error as AxiosError;
      console.log(resultError);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className=''>
        <div className='flex flex-col space-y-3'>
          <FormField
            control={form.control}
            name='username'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder='Username' {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <PasswordInput placeholder='Password' {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='remember_me'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <Checkbox
                        id='remember'
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                      <p className='text-xs text-muted-foreground'>Remember me</p>
                    </div>

                    <a href=''></a>
                  </div>
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='mt-4'>
          <Button className='w-full' variant={'blue'} type='submit' disabled={loading}>
            {loading ? (
              <div className='flex justify-center items-center'>
                <svg
                  className='animate-spin h-5 w-5 mr-3 text-white'
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                >
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                  ></circle>
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                  ></path>
                </svg>
                Loading...
              </div>
            ) : (
              'Submit'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default function Login({ fileImage, bgImage }: { fileImage: string; bgImage: string }) {
  return (
    <div className='flex h-screen w-screen fixed md:pt-20 top-0 left-0 justify-center '>
      {bgImage ? (
        <img src={bgImage} className='absolute top-0 left-0 h-screen w-screen -z-1' alt='' />
      ) : null}
      <div className='flex  z-10 w-full items-center flex-col space-y-4'>
        <div className='my-4'>
          {fileImage ? <img src={fileImage} alt='' className='rounded-md object-contain' /> : null}
        </div>
        <div className='md:w-1/4 md:my-12 bg-white rounded-md shadow-md md:p-6 '>
          <div className='text-center text-xl mb-4'>Sign In</div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
