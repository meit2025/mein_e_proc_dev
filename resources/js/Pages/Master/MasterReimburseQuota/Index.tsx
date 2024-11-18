import MainLayout from '@/Pages/Layouts/MainLayout';
import React, { ReactNode } from 'react';
import DataGridComponent from '@/components/commons/DataGrid';

import axiosInstance from '@/axiosInstance';
import { AxiosError } from 'axios';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/shacdn/dialog';
import { columns } from './models/models';
import { detailColumns } from './models/detailModels';
import { Button } from '@/components/shacdn/button';
import { PlusIcon } from 'lucide-react';
import { CustomDialog } from '@/components/commons/CustomDialog';
import { User } from './models/models';
import ReimburseQuotaForm from './component/form'
import { 
  LIST_API_REIMBURSE_QUOTA, 
  STORE_REIMBURSE_QUOTA, 
  DETAIL_REIMBURSE_QUOTA, 
  EDIT_REIMBURSE_QUOTA, 
  UPDATE_REIMBURSE_QUOTA, 
  DESTROY_REIMBURSE_QUOTA } from '@/endpoint/reimburseQuota/api';
import { FormType } from '@/lib/utils';

export const Index = () => {
  const [openForm, setOpenForm] = React.useState<boolean>(false);
  const [openDetailModal, setOpenDetailModal] = React.useState<boolean>(false);
  const [detailData, setDetailData] = React.useState<any>(null);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  const [formType, setFormType] = React.useState({
    type: FormType.create,
    id: undefined,
  });

  function openFormHandler() {
    setOpenForm(!openForm);
    setFormType({
      type: FormType.create,
      id: undefined,
    });
  }

  async function getDetailData($id: string) {
    setSelectedId($id);
    setOpenDetailModal(true);
    fetchDetailData();
  }

  React.useEffect(() => {
    if (selectedId && openDetailModal) {
      fetchDetailData();
    }

  }, [selectedId, openDetailModal]);
  
  const fetchDetailData = async () => {
    if (selectedId && openDetailModal) {
      try {
        const response = await axiosInstance.get(DETAIL_REIMBURSE_QUOTA(selectedId));
        
        setDetailData(response.data.data);
      } catch (e) {
        const error = e as AxiosError;
        console.error(error);
        setOpenDetailModal(false);
      }
    }
  }

  return (
    <>
      <div className='flex md:mb-4 mb-2 w-full justify-end'>
        <Button onClick={openFormHandler}>
          <PlusIcon />
        </Button>

        <CustomDialog
          onClose={() => setOpenForm(false)}
          open={openForm}
          onOpenChange={openFormHandler}
        >
          <ReimburseQuotaForm
            onSuccess={(value) => {
              setOpenForm(false);
            }}
            type={formType.type}
            storeURL={STORE_REIMBURSE_QUOTA}
            editURL={EDIT_REIMBURSE_QUOTA(formType.id ?? '')}
            updateURL={UPDATE_REIMBURSE_QUOTA(formType.id ?? '')}
          />
        </CustomDialog>
      </div>
      <DataGridComponent
        columns={columns}
        actionType='dropdown'
        onEdit={(value) => {
          setFormType({
            type: FormType.edit,
            id: value.toString(),
          });
          setOpenForm(true);
        }}
        onDetail={(value) => {
          getDetailData(value.toString())
        }}
        url={{
          url: LIST_API_REIMBURSE_QUOTA,
          deleteUrl: DESTROY_REIMBURSE_QUOTA,
        }}
        labelFilter='search'
      />

      <Dialog 
        open={openDetailModal} 
        onOpenChange={(open) => {
          setOpenDetailModal(open);
          if (!open) {
            setDetailData(null);
            setSelectedId(null);
          }
        }}
      >
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">
              Preview Balance Reimburse Quota
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <table className='border-0 text-sm'>
              <tr>
                <td width="200">Reimburse Type</td>
                <td>: {detailData?.type}</td>
              </tr>
              <tr>
                <td width="200">Reimburse Period</td>
                <td>: {detailData?.period}</td>
              </tr>
              <tr>
                <td width="200">Employer Status</td>
                <td>: {detailData?.employerStatus}</td>
              </tr>
              <tr>
                <td width="200">Family Status</td>
                <td>: {detailData?.familyStatus}</td>
              </tr>
            </table>
            <table className='text-xs mt-4 table font-thin'>
              <thead>
                <tr>
                  <th>Employer Name</th>
                  <th>Family Name</th>
                  <th>Balance</th>
                  <th>Grade</th>
                </tr>
              </thead>
              <tbody>
                {detailData?.dataBalance && detailData?.dataBalance.map((value, index) => (
                  <tr key={index}>
                    <td>{value.employerName}</td>
                    <td>{value.familyName}</td>
                    <td>{value.plafon}</td>
                    <td>{value.grade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

Index.layout = (page: ReactNode) => (
  <MainLayout title='Reimburse Quota' description='Reimburse Quota'>
    {page}
  </MainLayout>
);

export default Index;
