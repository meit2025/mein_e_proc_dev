import axiosInstance from '@/axiosInstance';
import { DETAIL_REIMBURSE } from '@/endpoint/reimburse/api';
import * as React from 'react';
import { Group, Reimburse } from '../model/listModel';
import '../css/reimburse_detail.scss';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';
import { WorkflowComponent } from '@/components/commons/WorkflowComponent';

const ReimburseDetail = () => {
  const pathname = window.location.pathname;
  const id = pathname.substring(pathname.lastIndexOf('/') + 1);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [data, setData] = React.useState<Group | null>(null);

  const [group, setGroup] = React.useState<Group | null>(null);

  const [reimburse, setReimburse] = React.useState<Reimburse[] | null>([]);
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Pastikan endpoint API mengembalikan data relasi `posts`
        const response = await axiosInstance.get(DETAIL_REIMBURSE(id));
        console.log(response.data.data);
        setData(response.data.data.group);
        setReimburse(response.data.data.forms);
      } catch (err) {
        console.error('Error fetching detail:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);
  return (
    <>
      <p className='text-sm'>
        <strong>Request No.:</strong> {data?.code}
      </p>
      <p className='text-sm'>
        <strong>Company:</strong> PT. Mitsubishi Electric Indonesia
      </p>
      <p className='text-sm'>
        <strong>Request for:</strong> {data?.user?.name}
      </p>
      <p className='text-sm'>{/* <strong>Requested By:</strong> {data?.requested_by} */}</p>
      <p className='text-sm'>
        <strong>Status:</strong> <span className='status-approved'>Fully Approved</span>
      </p>

      <table className='info-table text-sm mt-4'>
        <tr>
          <td>
            <strong>Pusat Biaya</strong>
          </td>
          <td>{data?.cost_center?.desc}</td>
        </tr>
        <tr>
          <td>
            <strong>Status</strong>
          </td>
          <td>{data?.status}</td>
        </tr>
        <tr>
          <td>
            <strong>Remark</strong>
          </td>
          <td>{data?.remark}</td>
        </tr>
        <tr>
          <td>
            <strong>Attachment File</strong>
          </td>
          <td></td>
        </tr>
      </table>

      <Tabs defaultValue='reimburse1' className='w-full text-sm'>
        <TabsList className={'flex items-center justify-start space-x-4'}>
          {reimburse?.map((reimburse: any, index: number) => (
            <TabsTrigger value={`reimburse${index + 1}`}>Form {index + 1}</TabsTrigger>
          ))}
        </TabsList>
        {reimburse?.map((reimburse: any, index: number) => (
          <TabsContent value={`reimburse${index + 1}`}>
            <div key={index}>
              <h3>Detail Form {index + 1}</h3>

              <table className='info-table text-sm mt-4'>
                <tr>
                  <td>
                    <strong>Type</strong>
                  </td>
                  <td>{reimburse?.type}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Reimburse Type</strong>
                  </td>
                  <td>{reimburse?.reimburse_type?.name}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Purchasing Group</strong>
                  </td>
                  <td>{reimburse?.purchasing_group_model?.purchasing_group}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Periode Date</strong>
                  </td>
                  <td>
                    {reimburse?.periode_date?.start} {' - '} {reimburse?.periode_date?.end}
                  </td>
                </tr>
                <tr>
                  <td>
                    <strong>Tax</strong>
                  </td>
                  <td>{reimburse?.tax_on_sales_model?.description}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Uom</strong>
                  </td>
                  <td>{reimburse?.uom_model?.unit_of_measurement_text}</td>
                </tr>

                <tr>
                  <td>
                    <strong>Claim Date</strong>
                  </td>
                  <td>
                    <div className='flex space-x-4 items-center'>
                      <div className='space-x-1'>
                        <span>Start date</span>
                        <span>:</span>
                        <span>{reimburse.start_date}</span>
                      </div>
                      <div className='flex space-x-4 items-center'>
                        <div className='space-x-1'>
                          <span>End Date</span>
                          <span>:</span>
                          <span>{reimburse.end_date}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>

                <tr>
                  <td>
                    <strong>Currency</strong>
                  </td>
                  <td>{reimburse?.currency}</td>
                </tr>

                <tr>
                  <td>
                    <strong>Reimburse Cost</strong>
                  </td>
                  <td>{reimburse?.balance}</td>
                </tr>
                <tr>
                  <td>
                    <strong>Attachment File</strong>
                  </td>
                  <td></td>
                </tr>
              </table>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <div className='my-2'>
        <WorkflowComponent />
      </div>
    </>
  );
};

export default ReimburseDetail;
