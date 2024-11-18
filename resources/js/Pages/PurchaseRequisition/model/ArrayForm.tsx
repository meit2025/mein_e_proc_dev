import FormAutocomplete from '@/components/Input/formDropdown';
import FormInput from '@/components/Input/formInput';
import useDropdownOptions from '@/lib/getDropdown';
import { Box, Tab, Tabs } from '@mui/material';
import { useEffect, useState } from 'react';
import { a11yProps, TabPanel } from './itemForm';
import { useWatch } from 'react-hook-form';
import ArrayItem from './ArrayItem';
import FormSwitch from '@/components/Input/formSwitch';

const ArrayForm = ({
  dataIndex,
  subAsset,
  FetchDataValue,
}: {
  dataIndex: number;
  subAsset: any[][][];
  FetchDataValue: (value: string, index: number, indexData: number) => void;
}) => {
  const { dataDropdown: dataVendor, getDropdown: getVendor } = useDropdownOptions();

  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  // Watch the 'total_vendor' value
  const watchData = useWatch({ name: 'total_item' });

  // Determine tabCount, default to 1 if total_vendor is 0 or not set
  const tabCount = watchData > 0 ? watchData : 1;

  useEffect(() => {
    getVendor('', { name: 'name_one', id: 'id', tabel: 'master_business_partners' });
  }, []);

  return (
    <div>
      <FormAutocomplete<any[]>
        options={dataVendor}
        fieldLabel={'Select Vendor'}
        fieldName={`vendors[${dataIndex}].vendor`}
        isRequired={true}
        disabled={false}
        style={{
          width: '58.5rem',
        }}
        placeholder={'Select Vendor'}
        classNames='mt-2'
      />

      <FormSwitch
        fieldLabel='Vendor Winner'
        fieldName={`vendors[${dataIndex}].winner`}
        isRequired={false}
        disabled={false}
      />

      <FormInput
        fieldLabel={'Total Item'}
        fieldName={'total_item'}
        isRequired={true}
        disabled={false}
        type={'number'}
        placeholder={'Enter your Item'}
      />
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label='dynamic tabs example'>
            {Array.from({ length: tabCount }, (_, indexItem) => (
              <Tab
                key={`Item${indexItem}`}
                label={`Item ${indexItem + 1}`}
                {...a11yProps(`Item${indexItem}`)}
              />
            ))}
          </Tabs>
        </Box>
        {Array.from({ length: tabCount }, (_, indexItem) => (
          <TabPanel key={indexItem} value={value} index={indexItem}>
            <ArrayItem
              dataIndex={dataIndex}
              ItemIndex={indexItem}
              FetchDataValue={FetchDataValue}
              subAsset={subAsset}
            />
          </TabPanel>
        ))}
      </Box>
    </div>
  );
};
export default ArrayForm;
