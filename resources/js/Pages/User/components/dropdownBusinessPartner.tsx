import FormAutocomplete from '@/components/Input/formDropdown';
import useDropdownOptions from '@/lib/getDropdown';
import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';

function DropdownBusinessPartner() {
  const { dataDropdown: dataVendor, getDropdown: getVendor } = useDropdownOptions();
  const { getValues, setValue, watch } = useFormContext();

  useEffect(() => {
    getVendor('', {
      name: 'name_one',
      id: 'id',
      tabel: 'master_business_partners',
      hiddenZero: true,
      isMapping: false,
      where: {
        key: 'type',
        parameter: 'employee',
      },
      raw: false,
    });
  }, []);
  return (
    <>
      <FormAutocomplete<any[]>
        options={dataVendor}
        fieldLabel={'Select Business Partner'}
        fieldName={'master_business_partner_id'}
        isRequired={true}
        style={{
          width: '63.5rem',
        }}
        placeholder={'Select Business Partner'}
        classNames='mt-2'
        onSearch={async (search) => {
          const isLabelMatch = dataVendor?.some((option) => option.label === search);
          if (search.length > 0 && !isLabelMatch) {
            await getVendor('', {
              name: 'name_one',
              id: 'id',
              tabel: 'master_business_partners',
              hiddenZero: true,
              isMapping: false,
              search: search,
              where: {
                key: 'type',
                parameter: 'employee',
              },
              raw: false,
            });
          } else if (search.length === 0 && !isLabelMatch) {
            await getVendor('', {
              name: 'name_one',
              id: 'id',
              tabel: 'master_business_partners',
              hiddenZero: true,
              isMapping: false,
              search: search,
              where: {
                key: 'type',
                parameter: 'employee',
              },
              raw: false,
            });
          }
          // Return the updated options or an empty array to satisfy the type
          return dataVendor ?? [];
        }}
        onFocus={async () => {
          const value = getValues('master_business_partner_id');
          await getVendor('', {
            name: 'name_one',
            id: 'id',
            tabel: 'master_business_partners',
            hiddenZero: true,
            isMapping: false,
            hasValue: {
              key: value ? 'id' : '',
              value: value ?? '',
            },
            where: {
              key: 'type',
              parameter: 'employee',
            },
          });
        }}
      />
    </>
  );
}

export default DropdownBusinessPartner;
