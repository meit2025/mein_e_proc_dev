import * as React from 'react';

import { Button } from '@/components/shacdn/button'; 
// import image_logo from  '../../../assets/images/mitsubishi_logo';
// import { Button } from '@/components/shacdn/button';
import {
  PasswordInput 
} from '@/components/commons/PasswordInput';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/shacdn/form';

import {
  Checkbox
} from '@/components/shacdn/checkbox';
'use client';

import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/shacdn/input';

import { z } from 'zod';

const formSchema = z.object({
  username: z.string().min(2).max(50),
  password: z.string().min(8).max(100)
});

import { useForm } from "react-hook-form"


export function LoginForm() {

   const form = useForm<z.infer<typeof formSchema>>({
     resolver: zodResolver(formSchema),
     defaultValues: {
       username: '',
       password: ''
     },
   });


   function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
                  <Input placeholder='shadcn' {...field} />
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
                  <PasswordInput placeholder='shadcn' {...field} />
                </FormControl>
                {/* <FormDescription>This is your public display name.</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          <div className='flex items-center space-x-2'>
            <Checkbox id='remember' />
            <p className='text-xs text-muted-foreground'>
              Remember me
            </p>
          </div>
        </div>
        <div className='mt-4'>
          <Button className='w-full' variant={'blue'} type='submit'>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
export default function Login() {
    return (
      <div className='bg-white flex h-screen w-screen fixed top-0 left-0 justify-center '>
        <div className='flex w-full items-center flex-col space-y-4'>
          <div className='my-4'>{/* <img src={image_logo} alt="" /> */}</div>
          <div className='md:w-1/4 md:my-12 bg-white rounded-md shadow-md md:p-6 '>
            <div className='text-center text-2xl'>Sign In</div>
            <LoginForm />
          </div>
        </div>
      </div>
    );
}