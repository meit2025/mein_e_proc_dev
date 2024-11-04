import React, { useState, useEffect, useCallback, ReactNode } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef, GridFilterModel, GridSortModel } from '@mui/x-data-grid';
import axiosInstance from '@/axiosInstance'; // Pastikan mengimport axiosInstance
import { Link } from '@inertiajs/react';
import axios from 'axios';
import { useAlert } from '@/contexts/AlertContext';
import { ConfirmationDeleteModal } from './ConfirmationDeleteModal';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/shacdn/dropdown-menu';

import { CaretSortIcon, ChevronDownIcon, DotsHorizontalIcon } from '@radix-ui/react-icons';
import { Button as ShacdnButton } from '@/components/shacdn/button';
import { Edit, Trash, Trash2Icon } from 'lucide-react';

interface UrlDataGrid {
  url: string;
  addUrl?: string;
  editUrl?: string;
  deleteUrl?: string;
  detailUrl?: string;
}

interface DataGridProps {
  columns: GridColDef[];
  url: UrlDataGrid;
  labelFilter?: string;
  buttonCustome?: ReactNode;
  defaultSearch?: string;
  onExport?: () => Promise<void> | void;
  onEdit?: (id: number) => Promise<void> | void;
  onDelete?: (id: number) => Promise<void> | void;
  onDetail?: (id: number) => Promise<void> | void;
  actionType?: string;
  buttonActionCustome?: ReactNode;
  deleteConfirmationText?: string;
  titleConfirmationText?: string;
}

const DataGridComponent: React.FC<DataGridProps> = ({
  columns,
  buttonCustome,
  onExport,
  url,
  labelFilter = 'Search', // Default label filter
  onEdit,
  onDelete,
  onDetail,
  defaultSearch,
  actionType,
  buttonActionCustome,
  deleteConfirmationText,
  titleConfirmationText,
}) => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [sortModel, setSortModel] = useState<GridSortModel>([]);
  const [filterModel, setFilterModel] = useState<GridFilterModel>({ items: [] });
  const [modalDelete, setModalDelete] = useState<number | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  const [rowCount, setRowCount] = useState(0);
  const [search, setSearch] = useState('');
  const { showToast } = useAlert();

  const fetchRows = useCallback(
    async (
      page: number,
      pageSize: number,
      search: string,
      sortModel: GridSortModel,
      filterModel: GridFilterModel,
    ) => {
      setLoading(true);

      const sortBy = sortModel.length > 0 ? sortModel[0].field : 'id';
      const sortDirection = sortModel.length > 0 ? sortModel[0].sort : 'asc';

      const filterParams = filterModel.items
        .map((item) => `${item.field}=${item.operator},${item.value}`)
        .join('&');

      try {
        const response = await axiosInstance.get(
          `${url.url}${defaultSearch ? defaultSearch : '?'}page=${page + 1}&per_page=${pageSize}&search=${search}&sort_by=${sortBy}&sort_direction=${sortDirection}&${filterParams}`,
        );
        setRows(response.data.data.data);
        setRowCount(response.data.data.total);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    },
    [url], // Dependensi di sini memastikan fungsi hanya berubah jika `url` berubah
  );

  useEffect(() => {
    fetchRows(paginationModel.page, paginationModel.pageSize, search, sortModel, filterModel);
  }, [fetchRows, filterModel, paginationModel, search, sortModel]); // Tidak lagi menyebabkan looping tak terbatas

  const handleDelete = async (id: number) => {
    setDeleteLoading(true);
    try {
      const request = await axiosInstance.delete(`${url.deleteUrl}/${id}`);
      showToast(request?.data?.message || 'Record deleted successfully', 'success');

      // set delete loading
      setDeleteLoading(false);
      setModalDelete(null);

      onDelete && (await onDelete(id));
      fetchRows(paginationModel.page, paginationModel.pageSize, search, sortModel, filterModel);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || 'Failed to delete record';
        showToast(errorMessage, 'error');
      } else {
        showToast('An unexpected error occurred', 'error');
      }
    }
  };

  const openConfirmationDelete = (id: number) => {
    setModalDelete(id);
  };

  // Kondisi untuk menambahkan kolom "Actions" jika salah satu aksi tersedia
  const actionColumn =
    onEdit ||
    onDelete ||
    onDetail ||
    url.detailUrl ||
    url.editUrl ||
    url.deleteUrl ||
    buttonActionCustome
      ? [
          {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params: any) => (
              <>
                {actionType === 'dropdown' ? (
                  <>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <ShacdnButton variant='ghost' className='h-8 w-8 p-0'>
                          <span className='sr-only'>...</span>
                          <DotsHorizontalIcon className='h-4 w-4' />
                        </ShacdnButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        {(onEdit || url.editUrl) && (
                          <DropdownMenuItem onClick={() => onEdit && onEdit(params.row.id)}>
                            <span className='flex items-center text-sm space-x-2'>
                              <span>Edit</span>
                              <Edit size={14} />
                            </span>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}

                        {(url.deleteUrl || onDelete) && (
                          <DropdownMenuItem
                            className='bg-red-400 text-white hover:!bg-red-500 hover:!text-white transition-all duration-300'
                            onClick={() => openConfirmationDelete(params.row.id)}
                          >
                            <span className='flex items-center  text-sm space-x-2'>
                              <span>Delete</span>
                              <Trash2Icon size={14} />
                            </span>
                          </DropdownMenuItem>
                        )}

                        <DropdownMenuSeparator />
                        {(onDetail || url.detailUrl) && (
                          <DropdownMenuItem
                            onClick={() => {
                              onDetail && onDetail(params.row.id);
                              if (url.detailUrl) {
                                window.location.href = `${url.detailUrl}/${params.row.id}`;
                              }
                            }}
                          >
                            View details
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                ) : (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'flex-start',
                        alignItems: 'center',
                        gap: '10px', // Add consistent spacing between elements
                      }}
                    >
                      {(onDetail || url.detailUrl) && (
                        <Link
                          href={`${url.detailUrl}/${params.row.id}`}
                          onClick={() => onDetail && onDetail(params.row.id)}
                          alt='detail'
                        >
                          <i className=' ki-duotone ki-size text-info text-2xl'></i>
                        </Link>
                      )}

                      {(onEdit || url.editUrl) && (
                        <Link
                          href={`${url.editUrl}/${params.row.id}`}
                          onClick={() => onEdit && onEdit(params.row.id)}
                          alt='edit'
                        >
                          <i className=' ki-duotone ki-notepad-edit text-success text-2xl'></i>
                        </Link>
                      )}
                      {(url.deleteUrl || onDelete) && (
                        <Link href={''} onClick={() => handleDelete(params.row.id)} alt='delete'>
                          <i className=' ki-duotone ki-trash-square text-danger text-2xl'></i>
                        </Link>
                      )}
                      {buttonActionCustome}
                    </div>
                  </>
                )}
              </>
            ),
          },
        ]
      : [];

  return (
    <Box>
      {/* DataGrid with the action buttons */}

      <Box sx={{ height: '45rem', width: '100%', overflowX: 'auto' }}>
        <div className='lg:col-span-2'>
          <div className='grid'>
            <div className='card card-grid h-full min-w-full'>
              <div className='card-header'>
                <h3 className='card-title'>
                  <div className='input input-sm max-w-48'>
                    <i className='ki-filled ki-magnifier'></i>

                    <input
                      placeholder={labelFilter}
                      type='text'
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      style={{
                        width: '100%',
                        maxWidth: '200px',
                        marginBottom: '10p',
                      }}
                    />
                  </div>
                </h3>

                {/* Flex container for the buttons */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: '10px', // Add consistent spacing between elements
                  }}
                >
                  {url.addUrl && (
                    <Link
                      href={url.addUrl ?? '#'}
                      className='btn btn-success'
                      style={{ marginRight: '10px', marginBottom: '10px' }} // Add margin for spacing
                    >
                      <i className='ki-filled ki-additem'></i>
                      Add New
                    </Link>
                  )}

                  {onExport && (
                    <Button
                      className='btn'
                      variant='contained'
                      onClick={() => onExport()}
                      color='primary'
                      startIcon={<i className='ki-filled ki-folder-down' />}
                      style={{ marginBottom: '10px' }} // Add margin for spacing
                    >
                      Export
                    </Button>
                  )}

                  {buttonCustome}
                </div>
              </div>
              <div className='card-body'>
                <ConfirmationDeleteModal
                  isLoading={deleteLoading}
                  description={deleteConfirmationText}
                  open={modalDelete !== null}
                  onClose={() => {
                    setModalDelete(null);
                  }}
                  onDelete={() => handleDelete(modalDelete ?? 0)}
                />
                <div data-datatable='true' data-datatable-page-size={paginationModel.pageSize}>
                  <div className='scrollable-x-auto'>
                    <DataGrid
                      rows={rows}
                      columns={[...columns, ...actionColumn]}
                      loading={loading}
                      paginationMode='server'
                      rowCount={rowCount}
                      paginationModel={paginationModel}
                      onPaginationModelChange={setPaginationModel}
                      pageSizeOptions={[10, 20]}
                      sortingMode='server'
                      sortModel={sortModel}
                      onSortModelChange={(model) => setSortModel(model)}
                      filterMode='server'
                      filterModel={filterModel}
                      onFilterModelChange={(model) => setFilterModel(model)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default DataGridComponent;
