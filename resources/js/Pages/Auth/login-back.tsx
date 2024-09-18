// import React from 'react';
// import { useForm, FormProvider } from 'react-hook-form';
// import { Inertia } from '@inertiajs/inertia';
// import FormInput from '../../Components/Input/formInput';
// import axios from 'axios';
// import { useAlert } from '../../contexts/AlertContext';
// import { usePage } from '@inertiajs/react';

// export default function Login() {
//   const methods = useForm({
//     mode: 'onChange',
//     defaultValues: {
//       email: '',
//       password: '',
//     },
//   });

//   const { showToast } = useAlert();

//   const onSubmit = async (data: any) => {
//     try {
//       // Menggunakan axios untuk mengirim permintaan POST
//       const response = await axios.post('/login', data);
//       showToast(response.data.message, 'success');
//       window.location = '/';
//     } catch (error) {
//       showToast(error.response.data.message, 'error');
//       if (error.response && error.response.data.errors) {
//         const serverErrors = error.response.data.errors;
//         for (const [key, messages] of Object.entries(serverErrors)) {
//           methods.setError(key, { type: 'manual', message: messages[0] });
//         }
//       }
//     }
//   };

//   return (
//     <div className='flex justify-center items-center p-8 lg:p-10 order-2 lg:order-1'>
//       <div
//         className='card mt-8 max-w-[370px] w-full'
//         style={{
//           padding: '2rem',
//         }}
//       >
//         <FormProvider {...methods}>
//           <form onSubmit={methods.handleSubmit(onSubmit)}>
//             <div className='text-center mb-2.5'>
//               <h3 className='text-lg font-medium text-gray-900 leading-none mb-2.5'>Sign in</h3>
//             </div>
//             <div className='flex flex-col gap-1'>
//               <FormInput
//                 fieldLabel={'Email'}
//                 type={'email'}
//                 fieldName={'email'}
//                 isRequired={true}
//                 variant={''}
//               />
//             </div>
//             <div
//               className='flex flex-col gap-1'
//               style={{
//                 marginTop: '2rem',
//               }}
//             >
//               <FormInput
//                 fieldLabel={'Password'}
//                 type={'password'}
//                 fieldName={'password'}
//                 isRequired={true}
//                 variant={''}
//               />
//             </div>
//             <label className='checkbox-group mt-2 mb-2'>
//               <input className='checkbox checkbox-sm' name='check' type='checkbox' value='1' />
//               <span className='checkbox-label'>Remember me</span>
//             </label>
//             <button className='btn btn-primary flex justify-center grow'>Sign In</button>
//           </form>
//         </FormProvider>
//       </div>
//     </div>
//   );
// }
