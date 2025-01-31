import axiosInstance from '@/axiosInstance';
import { DETAIL_REIMBURSE } from '@/endpoint/reimburse/api';
import * as React from 'react';
import { Group, Reimburse } from '../model/listModel';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';
import '../css/reimburse_detail.scss';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/shacdn/tabs';
import { WorkflowComponent } from '@/components/commons/WorkflowComponent';
import LayoutApproval from '@/components/approval/LayoutApproval';
import { CustomStatus } from '@/components/commons/CustomStatus';
import { formatDateIndonesian } from '@/lib/indonesianFormatDate';

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
      <LayoutApproval id={id} type={'REIM'} status_id={data?.status_id}>
        <p className='text-sm'>
          <strong>Request No.:</strong> {data?.code}
        </p>
        <p className='text-sm'>
          <strong>Company:</strong> PT. Mitsubishi Electric Indonesia
        </p>
        <p className='text-sm'>
          <strong>Request for:</strong> {data?.user?.name}
        </p>
        <p className='text-sm'>
          <strong>Requested By:</strong> {data?.user_create_request?.name}
          </p>
        <p className='text-sm flex items-center gap-2'>
          <strong>Status:</strong>{' '}
          <CustomStatus
            name={data?.reimbursementStatus?.name!}
            className={data?.reimbursementStatus?.classname!}
            code={data?.reimbursementStatus?.code}
          />
        </p>

        <Tabs defaultValue='reimburse1' className='w-full text-sm'>
          <TabsList className={'flex items-center justify-start space-x-4'}>
            {reimburse?.map((reimburse: any, index: number) => (
              <TabsTrigger key={index} value={`reimburse${index + 1}`}>
                Form {index + 1}
              </TabsTrigger>
            ))}
          </TabsList>
          {reimburse?.map((reimburse: any, index: number) => (
            <TabsContent key={index} value={`reimburse${index + 1}`}>
              <div key={index}>
                <h3>Detail Form {index + 1}</h3>

                <table className='info-table text-sm mt-4'>
                  <tr>
                    <td>
                      <strong>Reimburse Type</strong>
                    </td>
                    <td>{reimburse?.reimburse_type?.name}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Reimbursement Balance Date</strong>
                    </td>
                    <td>{formatDateIndonesian(reimburse?.created_at)}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Reimbursement For</strong>
                    </td>
                    <td>{reimburse?.type}</td>
                  </tr>
                  {reimburse?.type == 'Family' && 
                    <>
                      <tr>
                        <td>
                          <strong>Family Status</strong>
                        </td>
                        <td className='capitalize'>{reimburse?.reimburse_type?.family_status}</td>
                      </tr>
                      <tr>
                        <td>
                          <strong>For</strong>
                        </td>
                        <td>{data?.user?.families?.filter(family => family.id == reimburse?.for).map(family => family.name)}</td>
                      </tr>
                    </>
                  }
                  <tr>
                    <td>
                      <strong>Cost Center</strong>
                    </td>
                    <td>
                      {data?.cost_center?.desc}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Balance</strong>
                    </td>
                    <td>{reimburse?.currency} {formatRupiah(reimburse?.reimburse_type?.grade_option == 'all' ? reimburse?.reimburse_type?.grade_all_price : reimburse?.reimburse_type?.gradeReimburseTypes?.plafon ?? 0, false)}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Receipt Date</strong>
                    </td>
                    <td>{formatDateIndonesian(reimburse.item_delivery_data)}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Request Date</strong>
                    </td>
                    <td>{formatDateIndonesian(reimburse.created_at)}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Claim Date</strong>
                    </td>
                    <td>{formatDateIndonesian(reimburse.claim_date)}</td>
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
                    <td>{reimburse?.currency} {formatRupiah(reimburse?.balance || 0, false)}</td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Interval Claim</strong>
                    </td>
                    <td>
                      {reimburse?.reimburse_type?.interval_claim_period !== null ? reimburse?.reimburse_type?.interval_claim_period / 365 + ' Year' : 'No have interval'}
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <strong>Purchasing Group</strong>
                    </td>
                    <td>{reimburse?.purchasing_group_model?.purchasing_group}</td>
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
                      <strong>Attachment File</strong>
                    </td>
                    <td>
                      {reimburse?.reimburse_attachment.map((attachment: any, index: number) => (
                        <>
                          <a
                            href={`/storage/reimburse/${attachment.url}`}
                            target='_blank'
                            className='text-blue-500'
                            rel='noopener noreferrer'
                            key={index}
                          >
                            {attachment.url}
                          </a>
                          <br />
                        </>
                      ))}
                    </td>
                  </tr>
                </table>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </LayoutApproval>
    </>
  );
};

export default ReimburseDetail;