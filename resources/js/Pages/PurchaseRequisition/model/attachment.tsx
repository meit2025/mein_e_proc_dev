import FormFileUpload from '@/components/Input/formFieldUpload';
import { Link } from '@inertiajs/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useFormContext } from 'react-hook-form';
import { columnsAttachment, columnsItem } from './listModel';

const Attachment = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { getValues, watch, setValue } = useFormContext();

  const handleDelete = (data: any) => {
    setValue(
      'attachment',
      getValues('attachment').filter((item: any) => item.id !== data.row.id),
    );
  };
  const handleSaveEdit = (data: any) => {
    const existingFiles = getValues('attachment') || [];
    const updatedFiles = existingFiles.map((item: any) => (item.id === data.id ? data : item));
    setValue('attachment', updatedFiles);
  };

  const action = [
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params: any) => (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'flex-start',
            alignItems: 'center',
            gap: '10px', // Add consistent spacing between elements
          }}
        >
          <Link
            type='button'
            onClick={(event) => {
              event.preventDefault();
              handleDelete(params);
            }}
            href='#'
          >
            <i className=' ki-duotone ki-trash-square text-danger text-2xl'></i>
          </Link>
        </div>
      ),
    },
  ];
  return (
    <>
      <div className='card card-grid h-full min-w-full p-4'>
        {!isDisabled && (
          <FormFileUpload
            allowedExtensions={['jpg', 'jpeg', 'png', 'pdf', 'heic']}
            fieldLabel={'Attachment'}
            fieldName={'file_attachment'}
            disabled={false}
            style={{
              width: '58.5rem',
            }}
            onFileChangeOutside={(file, name) => {
              if (file) {
                const existingFiles = getValues('attachment') || [];
                const updatedFiles = [
                  ...existingFiles,
                  {
                    id: existingFiles.length + 1 + name.length,
                    file_name: name,
                    file_path: file,
                  },
                ];
                setValue('attachment', updatedFiles);
              }
            }}
            classNames='flex items-center space-x-4'
            note={
              <p style={{ color: 'red' }}>
                Please Upload file: Vendor Selection Form, Agreement , Quotation etc Here
              </p>
            }
          />
        )}

        <Box sx={{ width: '100%', overflowX: 'auto', marginTop: '1rem' }}>
          <div className='lg:col-span-2'>
            <div className='grid'>
              <div className='card card-grid h-full min-w-full'>
                <div className='card-body'>
                  <div data-datatable='true'>
                    <div className='scrollable-x-auto'>
                      <DataGrid
                        onCellKeyDown={(params, event) => {
                          if (event.key === 'Enter') {
                            event.preventDefault();
                          }
                        }}
                        processRowUpdate={handleSaveEdit}
                        columns={[...(isDisabled ? [] : action), ...columnsAttachment]}
                        rows={watch('attachment') ?? []}
                        hideFooterPagination={true}
                        getRowClassName={
                          (params) => (params.row.isEditing ? 'bg-yellow-50' : '') // Tambahkan highlight untuk baris yang sedang diedit
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </div>
    </>
  );
};

export default Attachment;
