import FormCheckbox from '@/components/Input/formCheckbox';
import useDropdownOptions from '@/lib/getDropdown';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

const Permission = () => {
  const { setValue, getValues } = useFormContext();
  const { dataDropdown, getDropdown: getPermission } = useDropdownOptions();
  const [permissionData, setPermissionData] = React.useState([]);
  const permissions_array = getValues('permissions_array');
  React.useEffect(() => {
    // Panggil getPermission hanya jika permissionData kosong
    if (permissionData.length === 0) {
      getPermission('', {
        name: 'name',
        id: 'name',
        tabel: 'permissions',
      });
    }
  }, [getPermission, permissionData]);

  React.useEffect(() => {
    // Perbarui permissionData saat dataDropdown berubah
    if (dataDropdown && dataDropdown.length > 0) {
      setPermissionData(dataDropdown as []);
    }
  }, [dataDropdown]);

  const handelChecked = () => {
    const values = getValues('permission');
    const trueKeys = Object.keys(values).filter((key) => values[key] === true);
    setValue('permissions_array', trueKeys);
  };

  const handleSelectAll = () => {
    const allPermissions = permissionData.map((item: any) => item.label);

    // Update each checkbox to true
    allPermissions.forEach((permission) => {
      setValue(`permission.${permission}`, true, { shouldValidate: true, shouldDirty: true });
    });

    // Update the permissions_array
    setValue('permissions_array', allPermissions, { shouldValidate: true, shouldDirty: true });
  };

  const handleUnselectAll = () => {
    const allPermissions = permissionData.map((item: any) => item.label);

    // Update each checkbox to false
    allPermissions.forEach((permission) => {
      setValue(`permission.${permission}`, false, { shouldValidate: true, shouldDirty: true });
    });

    // Clear the permissions_array
    setValue('permissions_array', [], { shouldValidate: true, shouldDirty: true });
  };
  return (
    <div>
      <div className='flex gap-4 mb-4'>
        <button
          type='button'
          className='px-4 py-2 bg-blue-500 text-white rounded'
          onClick={handleSelectAll}
        >
          Select All
        </button>
        <button
          type='button'
          className='px-4 py-2 bg-red-500 text-white rounded'
          onClick={handleUnselectAll}
        >
          Unselect All
        </button>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3'>
        {(permissionData ?? []).map((item: any, index) => {
          const checkedData =
            Array.isArray(permissions_array) && permissions_array.includes(item.label);

          setValue(`permission.${item.label}`, checkedData);

          return (
            <div key={index} className='bg-gray-100 p-2 rounded'>
              <FormCheckbox
                fieldLabel={item.label}
                fieldName={`permission.${item.label}`}
                isRequired={false}
                disabled={false}
                onChange={(checked: boolean) => {
                  handelChecked();
                }}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Permission;
