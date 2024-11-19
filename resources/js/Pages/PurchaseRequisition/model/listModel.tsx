import { Link } from '@inertiajs/react';
import { GridColDef } from '@mui/x-data-grid';
export const columns: GridColDef[] = [
  { field: 'document_type', headerName: 'document type', width: 200, filterable: true },
  {
    field: 'purchasing_groups',
    headerName: 'purchasing groups',
    width: 200,
    filterable: true,
  },
  {
    field: 'account_assignment_categories',
    headerName: 'account assignment categories',
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
  {
    field: 'is_cashAdvance',
    headerName: 'cash Advance',
    width: 200,
    filterable: false,
  },
  {
    field: 'dp',
    headerName: 'DP',
    width: 200,
    filterable: false,
  },
  {
    field: 'reference',
    headerName: 'Reference',
    width: 200,
    filterable: false,
  },
  {
    field: 'document_header_text',
    headerName: 'Document Header Text',
    width: 200,
    filterable: false,
  },
  {
    field: 'document_date',
    headerName: 'Document Date',
    width: 200,
    filterable: false,
  },
  {
    field: 'due_on',
    headerName: 'Due on',
    width: 200,
    filterable: false,
  },
  {
    field: 'text',
    headerName: 'text',
    width: 200,
    filterable: false,
  },
];
