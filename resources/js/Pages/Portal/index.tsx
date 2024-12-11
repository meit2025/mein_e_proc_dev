import SVGLoader from '@/components/commons/SvgLoader';
import React from 'react';

const App = () => {
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
            <div className="card rounded-3xl shadow-lg m-5">
                <header style={{ backgroundImage: "url('assets/media/images/2600x1200/bg-14.png')" }} className="p-10 text-center mb-8 bg-cover bg-[right_top_-1rem] bg-no-repeat bg-opacity-60 bg-[#F1F1F4] w-full">
                    <img src="/images/main_logo.png" alt="Company Logo" className="mx-auto mb-4" />
                    <h1 className="text-2xl font-bold">Welcome to the Company <span className="text-blue-500">System Portal</span></h1>
                </header>

                <div className="w-full bg-white rounded px-6">
                    <h2 className="text-xl font-bold text-center mb-5">Welcome to E-Portal</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 bg-white">
                        <div style={{ backgroundImage: "url('assets/media/images/2600x1200/bg-14.png')" }}
                            className={` bg-cover bg-center bg-no-repeat bg-opacity-90  px-6 py-10 rounded-lg xl:min-h-96 xl:min-w-96 lg:min-h-48 lg:min-w-48 shadow-lg text-center bg-[#1B84FF] `}>
                            <div className="flex justify-center">
                                <SVGLoader src="/assets/svg/polygon/polygon-1.svg" className='object-center' width="90" height="90" alt="Icon" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Employee Self Service</h3>
                            <p className="text-white mb-6">This is our central hub for accessing all your self service company resource and tools.</p>
                            <a href='/business-trip' className='btn bg-transparent border px-4 m-2 border-solid border-white text-white rounded-full'>Business Trip</a>
                            <a href='/reimburse' className='btn bg-transparent border px-4 m-2 border-solid border-white text-white rounded-full'>Reimbursement</a>
                            <a href='#' className='btn bg-transparent border px-4 m-2 border-solid border-white text-white rounded-full'>Claim</a>
                        </div>
                        <div style={{ backgroundImage: "url('assets/media/images/2600x1200/bg-14.png')" }}
                            className={` bg-cover bg-center bg-no-repeat bg-opacity-90 px-6 py-10 rounded-lg xl:min-h-96 xl:min-w-96 lg:min-h-48 lg:min-w-48 shadow-lg text-center bg-green-500 `}>
                            <div className="flex justify-center">
                                <SVGLoader src="/assets/svg/polygon/polygon-2.svg" className='object-center' width="90" height="90" alt="Icon" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">E-Procurement</h3>
                            <p className="text-white mb-6">This is our central for Purchase Request</p>
                            <a href='/purchase-requisition' className='btn bg-transparent border px-4 m-2 border-solid border-white text-white rounded-full'>Purchase Request</a>
                        </div>
                        <div style={{ backgroundImage: "url('assets/media/images/2600x1200/bg-14.png')" }}
                            className={` bg-cover bg-center bg-no-repeat bg-opacity-90 px-6 py-10 rounded-lg xl:min-h-96 xl:min-w-96 lg:min-h-48 lg:min-w-48 shadow-lg text-center bg-purple-500 `}>
                            <div className="flex justify-center">
                                <SVGLoader src="/assets/svg/polygon/polygon-3.svg" className='object-center' width="90" height="90" alt="Icon" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Company System</h3>
                            <p className="text-white mb-6">This is our central for Company System</p>
                            <a href='#' className='btn bg-transparent border px-4 m-2 border-solid border-white text-white rounded-full'>Intranet</a>
                            <a href='#' className='btn bg-transparent border px-4 m-2 border-solid border-white text-white rounded-full'>HR Portal</a>
                            <a href='#' className='btn bg-transparent border px-4 m-2 border-solid border-white text-white rounded-full'>Project Management</a>
                        </div>
                        <div style={{ backgroundImage: "url('assets/media/images/2600x1200/bg-14.png')" }}
                            className={` bg-cover bg-center bg-no-repeat bg-opacity-90 px-6 py-10 rounded-lg xl:min-h-96 xl:min-w-96 lg:min-h-48 lg:min-w-48 shadow-lg text-center bg-gray-900 `}>
                            <div className="flex justify-center">
                                <SVGLoader src="/assets/svg/polygon/polygon-4.svg" className='object-center' width="90" height="90" alt="Icon" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4">Support</h3>
                            <p className="text-white mb-6">If you need help, contact the IT helpdesk at MEIN Department or call +628123456789</p>
                            <a href='#' className='btn bg-transparent border px-4 m-2 border-solid border-white text-white rounded-full'>Contact Us</a>
                        </div>
                        <div style={{ backgroundImage: "url('assets/media/images/2600x1200/bg-14.png')" }}
                            className={` bg-cover bg-center bg-no-repeat bg-opacity-90 px-6 py-10 rounded-lg xl:min-h-96 xl:min-w-96 lg:min-h-48 lg:min-w-48 shadow-lg text-center bg-gray-200 border-dashed border-2 border-gray-500 `}>
                            <div className="flex justify-center">
                                <SVGLoader src="/assets/svg/polygon/polygon-5.svg" className='object-center' width="90" height="90" alt="Icon" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-500 mb-4">E-Form</h3>
                            <p className="text-gray-500 mb-6">Welcome, Employee! Please register your forms here</p>
                            <a href='#' className='btn bg-transparent border px-4 m-2 border-solid border-gray-500 text-gray-500 rounded-full'>Soon will be generated</a>
                        </div>
                    </div>
                </div>

                <footer className="mt-12 text-blue-500 text-sm rounded-3xl text-center p-10  bg-[#F9F9F9]">
                    &copy; 2024 Mitsubishi Electric Indonesia IT Department. All rights reserved.
                </footer>
            </div>

        </div>
    );
};

export default App;
