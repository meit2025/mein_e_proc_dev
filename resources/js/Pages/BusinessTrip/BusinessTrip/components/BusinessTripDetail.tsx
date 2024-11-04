import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';
import '../css/index.scss';
import axios, { AxiosError } from 'axios';
import axiosInstance from '@/axiosInstance';
import { GET_DETAIL_BUSINESS_TRIP } from '@/endpoint/business-trip/api';

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

interface BusinessTrip {
  id: number;
  name: string;
  request_no: string;
  remarks: string;
  purpose_type_id: number;
  purpose_type: PurposeType | null;
  total_destination: number;
  attachment: string;
  cost_center: CostCenter | null;
  request_for: RequestFor | null;
  requested_by: RequestedBy | null;
  business_trip_destination: BusinessTripDestination[];
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
        // Pastikan endpoint API mengembalikan data relasi `posts`
        const response = await axiosInstance.get(GET_DETAIL_BUSINESS_TRIP(id));
        console.log(response.data.data.business_trip_destination);
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
      <p className='text-sm'>
        <strong>Request No.:</strong> {data?.request_no}
      </p>
      <p className='text-sm'>
        <strong>Company:</strong> PT. Mitsubishi Electric Indonesia
      </p>
      <p className='text-sm'>
        <strong>Request for:</strong> {data?.request_for?.name ?? '-'}
      </p>
      <p className='text-sm'>
        <strong>Requested By:</strong> {data?.requested_by?.name ?? '-'}
      </p>
      <p className='text-sm'>
        <strong>Status:</strong> <span className='status-approved'>Fully Approved</span>
      </p>

      <table className='info-table text-sm mt-4'>
        <tr>
          <td>
            <strong>Purpose Type</strong>
          </td>
          <td>{data?.purpose_type?.name ?? '-'}</td>
        </tr>
        <tr>
          <td>
            <strong>Pusat Biaya</strong>
          </td>
          <td>{data?.cost_center?.cost_center ?? '-'}</td>
        </tr>
        <tr>
          <td>
            <strong>Start Date</strong>
          </td>
          <td>17 Aug 2023</td>
        </tr>
        <tr>
          <td>
            <strong>End Date</strong>
          </td>
          <td>17 Aug 2023</td>
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
          <td></td>
        </tr>
      </table>

      <Tabs defaultValue='destination1' className='w-full text-sm'>
        <TabsList className={'flex items-center justify-start space-x-4'}>
          {data?.business_trip_destination.map((destination: any, index: number) => (
            <TabsTrigger value={`destination${index + 1}`}>{destination.destination}</TabsTrigger>
          ))}
        </TabsList>
        {data?.business_trip_destination.map((destination: any, index: number) => (
          <TabsContent value={`destination${index + 1}`}>
            <div key={index}>
              <h3>Detail</h3>
              <table className='detail-table'>
                <tr>
                  <th>Date</th>
                  <th>Shift Code</th>
                  <th>Shift Start</th>
                  <th>Shift End</th>
                  <th>Actual Start</th>
                  <th>Actual End</th>
                </tr>
                {destination.detail_attendance.map((attendance: any, index: number) => (
                  <tr key={index}>
                    <td>{attendance.date}</td>
                    <td>{attendance.shift_code}</td>
                    <td>{attendance.shift_start}</td>
                    <td>{attendance.shift_end}</td>
                    <td>{attendance.start_time}</td>
                    <td>{attendance.end_time}</td>
                  </tr>
                ))}
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

                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Total Standar Value</strong>
                    </td>
                    <td>IDR</td>
                    <td></td>
                    <td></td>
                    <td></td>
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
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Total Request Value</strong>
                    </td>
                    <td>IDR</td>
                    <td></td>
                    <td></td>
                    <td></td>
                  </tr>
                </table>
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
};

export default BusinessTripDetail;
