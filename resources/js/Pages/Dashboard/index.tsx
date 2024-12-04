import { ReactNode } from 'react';
import MainLayout from '../Layouts/MainLayout';

function Index( dataTotal: any ) {
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
        <div className='grid grid-cols-1 gap-5 h-full'>
            <div className="grid grid-cols-2 gap-5 lg:gap-7.5 h-full items-stretch">
                <div
                    className="card flex-col justify-between gap-6 h-full bg-cover bg-[right_top_-1.7rem] bg-no-repeat bg-opacity-60"
                    style={{ backgroundImage: "url('assets/media/images/2600x1600/bg-3.png')" }}>
                    <h2 className='mt-4 ms-5'>Total</h2>
                    <div className="flex flex-col gap-1 pb-4 px-5">
                        <span className="text-3xl font-semibold text-red-600">
                            {dataTotal.dataTotal.reimburse}
                        </span>
                        <span className="text-2sm font-normal text-gray-700">
                            Reimbursement Request
                        </span>
                    </div>
                </div>
                <div
                    className="card flex-col justify-between gap-6 h-full bg-cover bg-[right_top_-1.7rem] bg-no-repeat bg-opacity-60"
                    style={{ backgroundImage: "url('assets/media/images/2600x1600/bg-3.png')" }}>
                    <h2 className='mt-4 ms-5'>Total</h2>
                    <div className="flex flex-col gap-1 pb-4 px-5">
                        <span className="text-3xl font-semibold text-red-600">
                            {dataTotal.dataTotal.purchaseRequisition}
                        </span>
                        <span className="text-2sm font-normal text-gray-700">
                            Purchase Requisition
                        </span>
                    </div>
                </div>
                <div
                    className="card flex-col justify-between gap-6 h-full bg-cover bg-[right_top_-1.7rem] bg-no-repeat bg-opacity-60"
                    style={{ backgroundImage: "url('assets/media/images/2600x1600/bg-3.png')" }}>
                    <h2 className='mt-4 ms-5'>Total</h2>
                    <div className="flex flex-col gap-1 pb-4 px-5">
                        <span className="text-3xl font-semibold text-red-600">
                            {dataTotal.dataTotal.businessTripRequest}
                        </span>
                        <span className="text-2sm font-normal text-gray-700">
                            Business Trip Request
                        </span>
                    </div>
                </div>
                <div
                    className="card flex-col justify-between gap-6 h-full bg-cover bg-[right_top_-1.7rem] bg-no-repeat bg-opacity-60"
                    style={{ backgroundImage: "url('assets/media/images/2600x1600/bg-3.png')" }}>
                    <h2 className='mt-4 ms-5'>Total</h2>
                    <div className="flex flex-col gap-1 pb-4 px-5">
                        <span className="text-3xl font-semibold text-red-600">
                            {dataTotal.dataTotal.businessTripDeclaration}
                        </span>
                        <span className="text-2sm font-normal text-gray-700">
                            Business Trip Declaration
                        </span>
                    </div>
                </div>
                {/* <div
                    className="card flex-col justify-between gap-6 h-full bg-cover bg-[right_-9.7rem_top_-1.7rem] bg-no-repeat bg-opacity-60"
                    style={{ backgroundImage: "url('assets/media/images/2600x1600/bg-3.png')" }}>
                    <h2 className='mt-4 ms-5'>Total</h2>
                    <div className="flex flex-col gap-1 pb-4 px-5">
                        <span className="text-3xl font-semibold text-red-600">
                            9.3k
                        </span>
                        <span className="text-2sm font-normal text-gray-700">
                            Approval
                        </span>
                    </div>
                </div> */}
            </div>
        </div>
    </div>
</>
);
}

// Assign layout to the page
Index.layout = (page: ReactNode) => <MainLayout>{page}</MainLayout>;

export default Index;
