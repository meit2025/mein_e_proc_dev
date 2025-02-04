import { CustomStatus } from '@/components/commons/CustomStatus';
import { DETAIL_PAGE_PR } from '@/endpoint/purchaseRequisition/page';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';
import { Link } from '@inertiajs/react';
import { GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
export const columns: GridColDef[] = [
  {
    field: 'purchases_number',
    headerName: 'Purchase Number',
    width: 200,
    filterable: false,
    renderCell: (params: any) => {
      return (
        <Link href={`${DETAIL_PAGE_PR}/${params?.row?.id}`}>{params?.row?.purchases_number}</Link>
      );
    },
  },
  {
    field: 'user.name',
    headerName: 'Request For',
    width: 200,
    filterable: false,
    renderCell: (params: any) => {
      return <Link href={`${DETAIL_PAGE_PR}/${params?.row?.id}`}>{params?.row?.user?.name}</Link>;
    },
  },
  { field: 'document_type', headerName: 'document type', width: 200, filterable: true },
  {
    field: 'purchasing_groups',
    headerName: 'Purchasing Groups',
    width: 200,
    filterable: true,
  },
  {
    field: 'delivery_date',
    headerName: 'Delivery Date',
    width: 200,
    filterable: true,
  },
  {
    field: 'storage_locations',
    headerName: 'Storage Locations',
    width: 200,
    filterable: true,
  },
  {
    field: 'total_vendor',
    headerName: 'Total Vendor',
    width: 200,
    filterable: true,
  },
  {
    field: 'total_item',
    headerName: 'Total Item',
    width: 200,
    filterable: true,
  },
  {
    field: 'status',
    headerName: 'Status',
    width: 200,
    filterable: false,
    renderCell: (params: any) => {
      return (
        <CustomStatus
          name={params.row.status?.name}
          className={params.row.status?.classname}
          code={params.row.status?.code}
        />
      );
    },
  },
  {
    field: 'created_by.name',
    headerName: 'Requested By',
    width: 200,
    filterable: false,
    renderCell: ({ row: { created_by: e } }) => e?.name ?? 'Unknown',
  },
  {
    field: 'created_at',
    headerName: 'Created At',
    width: 200,
    filterable: false,
    renderCell: (params: any) => {
      return moment(params.row.created_at).format('DD-MM-YYYY');
    },
  },
  {
    field: 'purchase_requisitions.no_po',
    headerName: 'Number PO',
    width: 200,
    filterable: false,
    renderCell: (params: any) => {
      const firstNonNullPo = params.row.purchase_requisitions.find(
        (data: any) => data?.no_po !== null,
      );
      return firstNonNullPo ? firstNonNullPo.no_po : '-';
    },
  },
  {
    field: 'purchase_requisitions.is_closed',
    headerName: 'Status PO',
    width: 200,
    filterable: false,
    renderCell: (params: any) => {
      const firstNonNullPo = params.row.purchase_requisitions.find(
        (data: any) => data?.is_closed !== null,
      );
      return firstNonNullPo ? firstNonNullPo.is_closed : '-';
    },
  },
  {
    field: 'purchase_requisitions.purchase_requisition_number',
    headerName: 'Number PR',
    width: 200,
    filterable: false,
    renderCell: (params: any) => {
      const firstNonNullPo = params.row.purchase_requisitions.find(
        (data: any) => data?.purchase_requisition_number !== null,
      );
      return firstNonNullPo ? firstNonNullPo.purchase_requisition_number : '-';
    },
  },
  {
    field: 'purchase_requisitions.status',
    headerName: 'Status PR',
    width: 200,
    filterable: false,
    renderCell: (params: any) => {
      const firstNonNullPo = params.row.purchase_requisitions.find(
        (data: any) => data?.status !== null,
      );
      return firstNonNullPo ? firstNonNullPo.status : '-';
    },
  },
];

export const columnsItem: GridColDef[] = [
  { field: 'qty', headerName: 'QTY', width: 200, filterable: true },
  {
    field: 'unit_price',
    headerName: 'Unit Price ',
    width: 200,
    filterable: false,
  },
  {
    field: 'total_amount',
    headerName: 'Total Amount ',
    width: 200,
    filterable: false,
    renderCell: (params) => {
      return formatRupiah(params.row.total_amount);
    },
  },
  {
    field: 'account_assignment_categories',
    headerName: 'Account Assignment Categories',
    width: 200,
    filterable: false,
  },
  {
    field: 'cost_center',
    headerName: 'Cost Center',
    width: 200,
    filterable: false,
  },
  {
    field: 'material_group',
    headerName: 'Material Group',
    width: 200,
    filterable: false,
  },
  {
    field: 'material_number',
    headerName: 'Material Number',
    width: 200,
    filterable: false,
  },
  {
    field: 'uom',
    headerName: 'UOM',
    width: 200,
    filterable: false,
  },
  {
    field: 'tax',
    headerName: 'Tax On Sales',
    width: 200,
    filterable: false,
  },
  {
    field: 'short_text',
    headerName: 'Short Text',
    width: 200,
    filterable: false,
  },
  {
    field: 'order_number',
    headerName: 'Order Number',
    width: 200,
    filterable: false,
  },
  {
    field: 'asset_number',
    headerName: 'Main Asset Number',
    width: 200,
    filterable: false,
  },
  {
    field: 'item_sub_asset_number',
    headerName: 'Sub Asset Number',
    width: 200,
    filterable: false,
  },
];

export const columnsAttachment: GridColDef[] = [
  {
    field: 'file_name',
    headerName: 'Name',
    width: 400,
    filterable: false,
    editable: true,
  },
  {
    field: 'file_path',
    headerName: 'File',
    width: 200,
    filterable: false,
    renderCell: (params) => {
      const handleDownload = () => {
        const fileData = params.value; // filePath atau Base64
        const fileName = params.row.file_name || 'download';

        if (fileData.startsWith('data:')) {
          // Jika Base64, buat Blob dan unduh
          const blob = new Blob([atob(fileData.split(',')[1])], {
            type: fileData.split(';')[0].split(':')[1],
          });
          const blobUrl = URL.createObjectURL(blob);

          const link = document.createElement('a');
          link.href = blobUrl;
          link.download = fileName;
          link.click();

          // Hapus URL sementara
          URL.revokeObjectURL(blobUrl);
        } else {
          // Jika URL filePath, langsung unduh
          // Jika URL filePath, buka di tab baru
          window.open(fileData, '_blank');
        }
      };

      return (
        <button onClick={handleDownload} type='button' className='text-blue-500 underline'>
          Download
        </button>
      );
    },
  },
];
