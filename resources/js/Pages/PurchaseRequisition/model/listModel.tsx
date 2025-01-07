import { CustomStatus } from '@/components/commons/CustomStatus';
import { DETAIL_PAGE_PR } from '@/endpoint/purchaseRequisition/page';
import { formatRupiah } from '@/lib/rupiahCurrencyFormat';
import { Link } from '@inertiajs/react';
import { GridColDef } from '@mui/x-data-grid';
export const columns: GridColDef[] = [
  {
    field: 'purchases_number',
    headerName: 'Purchases number',
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
    headerName: 'Request for',
    width: 200,
    filterable: false,
    renderCell: (params: any) => {
      return <Link href={`${DETAIL_PAGE_PR}/${params?.row?.id}`}>{params?.row?.user?.name}</Link>;
    },
  },
  { field: 'document_type', headerName: 'document type', width: 200, filterable: true },
  {
    field: 'purchasing_groups',
    headerName: 'purchasing groups',
    width: 200,
    filterable: true,
  },
  {
    field: 'delivery_date',
    headerName: 'delivery date',
    width: 200,
    filterable: true,
  },
  {
    field: 'storage_locations',
    headerName: 'storage locations',
    width: 200,
    filterable: true,
  },
  {
    field: 'total_vendor',
    headerName: 'total vendor',
    width: 200,
    filterable: true,
  },
  {
    field: 'total_item',
    headerName: 'total item',
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
    headerName: 'account assignment categories',
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
    headerName: 'Material number',
    width: 200,
    filterable: false,
  },
  {
    field: 'uom',
    headerName: 'Uom',
    width: 200,
    filterable: false,
  },
  {
    field: 'tax',
    headerName: 'Tax on sales',
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
          const link = document.createElement('a');
          link.href = fileData;
          link.download = fileName;
          link.click();
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
