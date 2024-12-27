import FormFileUpload from '@/components/Input/formFieldUpload';
import { Link } from '@inertiajs/react';
import { Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useFormContext } from 'react-hook-form';
import { columnsAttachment, columnsItem } from './listModel';

const Attachment = ({ isDisabled }: { isDisabled?: boolean }) => {
  const { getValues, watch, setValue } = useFormContext();

  const handleDelete = (data: any) => {
    console.log(data);
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
                        columns={[
                          ...(isDisabled ? [] : action), // Spread an empty array if disabled, or the action array if not
                          ...columnsAttachment,
                        ]}
                        rows={watch('attachment') ?? []}
                        hideFooterPagination={true}
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
