import { useState, ReactNode } from 'react';
import MainLayout from '../Layouts/MainLayout';
import SVGLoader from '@/components/commons/SvgLoader';

function Index(dataTotal: any) {
    const [selectedStatus, setSelectedStatus] = useState('reim'); // State untuk filter status
    const [selectedTime, setSelectedTime] = useState('12'); // State untuk filter waktu

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedTime(e.target.value);
    };
    const url = 'https://api.example.com/submit';
    return (
        <>
            <div className='container-fixed'>
                <div className='flex flex-wrap items-center lg:items-end justify-between gap-5 pb-7.5'>
                    <div className='flex flex-col justify-center gap-2'>
                        <h1 className='text-xl font-medium leading-none text-gray-900'>Dashboard</h1>
                        <div className='flex items-center gap-2 text-sm font-normal text-gray-700'>
                            Mitsubishi Electric Indonesia
                        </div>
                    </div>
                </div>
            </div>
            <div className='container-fixed'>
                <div className="grid gap-5 lg:gap-7.5">
                    <div className='grid lg:grid-cols-3 gap-y-5 lg:gap-7.5 items-stretch'>
                        <div className='lg:col-span-1'>
                            <div className='grid grid-cols-1 gap-5 h-full'>
                                <div className="grid grid-cols-2 gap-5 lg:gap-7.5 h-full items-stretch">
                                    <div
                                        className="card flex-col justify-between gap-6 h-full bg-cover bg-[right_top_-1.7rem] bg-no-repeat bg-opacity-60"
                                        style={{ backgroundImage: "url('assets/media/images/2600x1600/bg-3.png')" }}>
                                        <h2 className='mt-4 ms-5'>
                                            <SVGLoader src="/assets/svg/user-pick.svg" width="28" height="28" alt="Icon" />
                                        </h2>
                                        <div className="flex flex-col gap-1 pb-4 px-5">
                                            <span className="text-3xl font-semibold text-black">
                                                {dataTotal.dataTotal.purchaseRequisition ?? 0}
                                            </span>
                                            <span className="text-2sm font-normal text-gray-700">
                                                Total Vendor Selection
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="card flex-col justify-between gap-6 h-full bg-cover bg-[right_top_-1.7rem] bg-no-repeat bg-opacity-60"
                                        style={{ backgroundImage: "url('assets/media/images/2600x1600/bg-3.png')" }}>
                                        <h2 className='mt-4 ms-5'>
                                            <SVGLoader src="/assets/svg/invoice.svg" width="28" height="28" alt="Icon" />
                                        </h2>
                                        <div className="flex flex-col gap-1 pb-4 px-5">
                                            <span className="text-3xl font-semibold text-black">
                                                {dataTotal.dataTotal.reimburse ?? 0}
                                            </span>
                                            <span className="text-2sm font-normal text-gray-700">
                                                Total Reimbursement Request
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="card flex-col justify-between gap-6 h-full bg-cover bg-[right_top_-1.7rem] bg-no-repeat bg-opacity-60"
                                        style={{ backgroundImage: "url('assets/media/images/2600x1600/bg-3.png')" }}>
                                        <h2 className='mt-4 ms-5'>
                                            <SVGLoader src="/assets/svg/bag.svg" width="28" height="28" alt="Icon" />
                                        </h2>
                                        <div className="flex flex-col gap-1 pb-4 px-5">
                                            <span className="text-3xl font-semibold text-black">
                                                {dataTotal.dataTotal.businessTripRequest ?? 0}
                                            </span>
                                            <span className="text-2sm font-normal text-gray-700">
                                                Total Business Trip Request
                                            </span>
                                        </div>
                                    </div>
                                    <div
                                        className="card flex-col justify-between gap-6 h-full bg-cover bg-[right_top_-1.7rem] bg-no-repeat bg-opacity-60"
                                        style={{ backgroundImage: "url('assets/media/images/2600x1600/bg-3.png')" }}>
                                        <h2 className='mt-4 ms-5'>
                                            <SVGLoader src="/assets/svg/bag-two.svg" width="28" height="28" alt="Icon" />
                                        </h2>
                                        <div className="flex flex-col gap-1 pb-4 px-5">
                                            <span className="text-3xl font-semibold text-black">
                                                {dataTotal.dataTotal.businessTripDeclaration ?? 0}
                                            </span>
                                            <span className="text-2sm font-normal text-gray-700">
                                                Total Business Trip Declaration
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='lg:col-span-2'>
                            <div className="card h-full">
                                <div className="card-header">
                                    <h3 className="card-title">Reimbursement Status</h3>
                                    <div className="menu">
                                        <div className="flex gap-3">
                                            <select value={selectedStatus} onChange={handleStatusChange} className="form-select rounded-lg">
                                                <option value="reim">Status Reimbursement</option>
                                                <option value="vendor">Status Vendor Selection</option>
                                                <option value="trip">Status Business Trip Request</option>
                                                <option value="dec">Status Business Trip Declaration</option>
                                            </select>
                                            <select value={selectedTime} onChange={handleTimeChange} className="form-select rounded-lg">
                                                <option value="12">12 months</option>
                                                <option value="6">6 months</option>
                                                <option value="3">3 months</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body flex flex-col gap-4 p-5 lg:p-7.5 lg:pt-4">
                                    <div className="flex flex-col gap-0.5">
                                        <span className="text-sm font-normal text-gray-700">Status Reimbursement 12 Bulan</span>
                                        <div className="flex items-center gap-2.5">
                                            <span className="text-3xl font-semibold text-gray-900">78</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 mb-1.5">
                                        <div className="bg-info h-2 w-full max-w-[50%] rounded-sm"></div>
                                        <div className="bg-warning h-2 w-full max-w-[25%] rounded-sm"></div>
                                        <div className="bg-success h-2 w-full max-w-[15%] rounded-sm"></div>
                                        <div className="bg-danger h-2 w-full max-w-[10%] rounded-sm"></div>
                                    </div>
                                    <div className="flex items-center flex-wrap gap-4 mb-1">
                                        <div className="flex items-center gap-1.5">
                                            <span className="badge badge-dot size-2 badge-info"></span>
                                            <span className="text-sm font-normal text-gray-800">Waiting Approve</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="badge badge-dot size-2 badge-warning"></span>
                                            <span className="text-sm font-normal text-gray-800">On Proccess</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="badge badge-dot size-2 badge-success"></span>
                                            <span className="text-sm font-normal text-gray-800">Fully Approved</span>
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <span className="badge badge-dot size-2 badge-danger"></span>
                                            <span className="text-sm font-normal text-gray-800">Reject</span>
                                        </div>
                                    </div>
                                    <div className="border-b border-gray-300"></div>
                                    <div className="grid gap-3">
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className="badge badge-dot size-2 badge-info"></span>
                                                <span className="text-sm font-normal text-gray-900">Waiting Approve</span>
                                            </div>
                                            <div className="flex items-center text-sm font-medium text-gray-800 gap-6">
                                                <span className="lg:text-right">80</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className="badge badge-dot size-2 badge-warning"></span>
                                                <span className="text-sm font-normal text-gray-900">On Proccess</span>
                                            </div>
                                            <div className="flex items-center text-sm font-medium text-gray-800 gap-6">
                                                <span className="lg:text-right">70</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className="badge badge-dot size-2 badge-success"></span>
                                                <span className="text-sm font-normal text-gray-900">Fully Aproved</span>
                                            </div>
                                            <div className="flex items-center text-sm font-medium text-gray-800 gap-6">
                                                <span className="lg:text-right">60</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between flex-wrap gap-2">
                                            <div className="flex items-center gap-1.5">
                                                <span className="badge badge-dot size-2 badge-danger"></span>
                                                <span className="text-sm font-normal text-gray-900">Reject</span>
                                            </div>
                                            <div className="flex items-center text-sm font-medium text-gray-800 gap-6">
                                                <span className="lg:text-right">60</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

// Assign layout to the page
Index.layout = (page: ReactNode) => <MainLayout>{page}</MainLayout>;

export default Index;
