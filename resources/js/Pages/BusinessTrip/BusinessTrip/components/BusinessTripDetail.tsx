import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';
import '../css/index.scss';
import axios, { AxiosError } from 'axios';
import axiosInstance from '@/axiosInstance';
import { GET_DETAIL_BUSINESS_TRIP_REQUEST } from '@/endpoint/business-trip/api';
import { WorkflowComponent } from '@/components/commons/WorkflowComponent';
import LayoutApproval from '@/components/approval/LayoutApproval';
import { CustomStatus } from '@/components/commons/CustomStatus';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';

interface PurposeType {
  id: number;
  name: string;
  code: string;
}

interface RequestFor {
  id: number;
  name: string;
}

interface RequestedBy {
  id: number;
  name: string;
}

interface CostCenter {
  id: number;
  cost_center: string;
}

interface AllowanceItem {
  id: number;
  code: string;
  name: string;
}

interface DetailDestinationTotal {
  id: number;
  price: string;
  allowance_item_id: number;
  allowance_item: AllowanceItem | null;
}

interface DetailDestinationDay {
  id: number;
  date: string;
  price: string;
  allowance_item_id: number;
  allowance_item: AllowanceItem | null;
}

interface BusinessTripDetailAttendance {
  id: number;
  shift_code: string;
  shift_start: string;
  shift_end: string;
  start_time: string;
  end_time: string;
  date: string;
}

interface BusinessTripDestination {
  id: number;
  destination: string;
  business_trip_start_date: string;
  business_trip_end_date: string;
  detail_destinations_total: DetailDestinationTotal[];
  detail_destinations_day: DetailDestinationDay[];
  detail_attendance: BusinessTripDetailAttendance[];
}

interface BusinessTripAttachment {
  id: number;
  url: string;
  file_name: string;
}

interface BusinessTrip {
  status_id?: number;
  id: number;
  name: string;
  request_no: string;
  remarks: string;
  purpose_type_id: number;
  purpose_type: PurposeType | null;
  total_destination: number;
  attachment: string;
  cost_center: string;
  request_for: string;
  requested_by: string;
  purpose_type_name: string;
  start_date: string;
  end_date: string;
  file_attachement: BusinessTripAttachment[];
  business_trip_destination: BusinessTripDestination[];
  status: { name: string; code: string; classname: string };
  total_cash_advance: string;
  total_percent: string;
  cash_advance: number;
  reference_number: number;
}

const BusinessTripDetail = () => {
  const pathname = window.location.pathname;
  const id = pathname.substring(pathname.lastIndexOf('/') + 1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<BusinessTrip | null>(null);

  React.useEffect(() => {
    const fetchBusinessTrip = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get(GET_DETAIL_BUSINESS_TRIP_REQUEST(id));
        console.log(response.data.data);
        setData(response.data.data);
      } catch (err) {
        console.error('Error fetching detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinessTrip();
  }, [id]);

  return (
    <>
      <LayoutApproval id={id} status_id={data?.status_id} type={'TRIP'}>
        <p className='text-sm'>
          <strong>Request No.:</strong> {data?.request_no}
        </p>
        <p className='text-sm'>
          <strong>Company:</strong> PT. Mitsubishi Electric Indonesia
        </p>
        <p className='text-sm'>
          <strong>Request for:</strong> {data?.request_for}
        </p>
        <p className='text-sm'>
          <strong>Requested By:</strong> {data?.requested_by}
        </p>
        <p className='text-sm flex items-center gap-2'>
          <strong>Status:</strong>{' '}
          <CustomStatus
            name={data?.status?.name!}
            className={data?.status?.classname!}
            code={data?.status?.code}
          />
        </p>
        <div>
          <table className='info-table text-sm mt-4'>
            <tr>
              <td>
                <strong>Purpose Type</strong>
              </td>
              <td>{data?.purpose_type_name}</td>
            </tr>
            <tr>
              <td>
                <strong>Pusat Biaya</strong>
              </td>
              <td>{data?.cost_center}</td>
            </tr>
            <tr>
              <td>
                <strong>Start Date</strong>
              </td>
              <td>{data?.start_date}</td>
            </tr>
            <tr>
              <td>
                <strong>End Date</strong>
              </td>
              <td>{data?.end_date}</td>
            </tr>
            <tr>
              <td>
                <strong>Remark</strong>
              </td>
              <td>{data?.remarks}</td>
            </tr>
            <tr>
              <td>
                <strong>Attachment File</strong>
              </td>
              <td className='flex flex-col'>
                {data?.file_attachement.map((attachment: any, index: number) => (
                  <a
                    href={attachment.url}
                    target='_blank'
                    className='text-blue-500'
                    rel='noopener noreferrer'
                    key={index}
                  >
                    {attachment.file_name}
                  </a>
                ))}
              </td>
            </tr>
            {data?.cash_advance != 0 && (
              <>
                <tr>
                  <td>
                    <strong>
                      Ref Number
                    </strong>
                  </td>
                  <td>{data?.reference_number}</td>
                </tr>
                <tr>
                  <td>
                    <strong>
                      Total Percent <br /> Cash Advance
                    </strong>
                  </td>
                  <td>{data?.total_percent}%</td>
                </tr>
                <tr>
                  <td>
                    <strong>Total Cash Advance</strong>
                  </td>
                  <td>{formatRupiah(data?.total_cash_advance ?? '')}</td>
                </tr>
              </>
            )}
          </table>
        </div>

        <Tabs defaultValue='destination1' className='w-full text-sm'>
          <TabsList className={'flex items-center justify-start space-x-4'}>
            {data?.business_trip_destination.map((destination: any, index: number) => (
              <TabsTrigger key={index} value={`destination${index + 1}`}>
                {destination.destination}
              </TabsTrigger>
            ))}
          </TabsList>
          {data?.business_trip_destination.map((destination: any, index: number) => (
            <TabsContent key={index} value={`destination${index + 1}`}>
              <div key={index}>
                <h3>Detail {destination.destination}</h3>
                <table className='detail-table'>
                  <tr>
                    <th>Request Date</th>
                    <th>Declaration Date</th>
                    <th>Shift Code</th>
                    <th>Shift Start</th>
                    <th>Shift End</th>
                    <th>Actual Start</th>
                    <th>Actual End</th>
                  </tr>
                  {destination.business_trip_detail_attendance.map(
                    (attendance: any, index: number) => (
                      <tr key={index}>
                        <td>{attendance.date}</td>
                        <td>{attendance.date}</td>
                        <td>{attendance.shift_code}</td>
                        <td>{attendance.shift_start}</td>
                        <td>{attendance.shift_end}</td>
                        <td>{attendance.start_time}</td>
                        <td>{attendance.end_time}</td>
                      </tr>
                    ),
                  )}
                </table>
                <div className='tables-wrapper'>
                  <table className='value-table'>
                    <caption>Standard Value</caption>
                    <tr>
                      <th>Item Name</th>
                      <th>Currency Code</th>
                      <th>Value</th>
                      <th>Total Days</th>
                      <th>Total</th>
                    </tr>
                    {destination.standar_detail_allowance.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>
                          {item.item_name} ({item.type})
                        </td>
                        <td>{item.currency_code}</td>
                        <td>{item.value}</td>
                        <td className='text-center'>{item.total_day}</td>
                        <td>{item.total}</td>
                      </tr>
                    ))}

                    <tr>
                      <td>
                        <strong>Total Standar Value</strong>
                      </td>
                      <td>IDR</td>
                      <td></td>
                      <td className='text-center'></td>
                      <td>{destination.total_standard}</td>
                    </tr>
                  </table>

                  <table className='value-table'>
                    <caption>Requested Value</caption>
                    <tr>
                      <th>Item Name</th>
                      <th>Currency Code</th>
                      <th>Value</th>
                      <th>Total Days</th>
                      <th>Total</th>
                    </tr>
                    {destination.request_detail_allowance.map((item: any, index: number) => (
                      <tr key={index}>
                        <td>
                          {item.item_name} ({item.type})
                        </td>
                        <td>{item.currency_code}</td>
                        <td>{item.value}</td>
                        <td className='text-center'>{item.total_day}</td>
                        <td>{item.total}</td>
                      </tr>
                    ))}
                    <tr>
                      <td>
                        <strong>Total Request Value</strong>
                      </td>
                      <td>IDR</td>
                      <td></td>
                      <td className='text-center'></td>
                      <td>{destination.total_request}</td>
                    </tr>
                  </table>
                </div>
                <div>
                    <table>
                        <tr>
                            <th>Total Request Value</th>
                            <td>:</td>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Total Declaration Value</th>
                            <td>:</td>
                            <td> +</td>
                        </tr>
                        <tr>
                            <th>Deviation Value</th>
                            <th>:</th>
                            <th></th>
                        </tr>
                    </table>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </LayoutApproval>
    </>
  );
};

export default BusinessTripDetail;
