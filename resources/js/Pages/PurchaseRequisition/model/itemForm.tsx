import { useState, ReactNode } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { useWatch } from 'react-hook-form';
import ArrayForm from './ArrayForm';
import axiosInstance from '@/axiosInstance';

interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
}

interface ItemFormProps {
  tabLabels: string[];
  tabContents: ReactNode[];
}

export const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export const a11yProps = (index: any) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const ItemForm = ({ disable }: { disable: boolean }) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  // Watch the 'total_vendor' value
  const watchData = useWatch({ name: 'total_vendor' });

  // Determine tabCount, default to 1 if total_vendor is 0 or not set
  const tabCount = watchData > 0 ? watchData : 1;
  const [subAsset, setSubAsset] = useState<any[][]>([[]]);

  const FetchDataValue = async (item: string, index: number) => {
    const data = {
      name: 'desc',
      id: 'asset_subnumber',
      tabel: 'master_assets',
      where: {
        key: 'asset',
        parameter: item,
        groupBy: 'asset_subnumber,desc',
      },
    };

    const response = await axiosInstance.get(
      `api/master/dropdown?name=${data.name}&id=${data.id}&tabelname=${data.tabel}&key=${data.where?.key ?? ''}&parameter=${data.where?.parameter ?? ''}&groupBy=${data.where?.groupBy ?? ''}`,
    );

    setSubAsset((prevState) => {
      const newState = [...prevState];
      // Ensure that indexData exists
      if (!newState[index]) {
        newState[index] = []; // Create an empty array for the indexData if it does not exist
      }

      newState[index] = response.data.data;
      return newState;
    });
  };

  return (
    <div className='card card-grid h-full min-w-full p-4'>
      <div className='card-body'>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label='dynamic tabs example'>
              {Array.from({ length: tabCount }, (_, index) => (
                <Tab key={index} label={`Vendor ${index + 1}`} {...a11yProps(index)} />
              ))}
            </Tabs>
          </Box>
          {Array.from({ length: tabCount }, (_, index) => (
            <TabPanel key={index} value={value} index={index}>
              <ArrayForm
                disable={disable}
                dataIndex={index}
                FetchDataValue={FetchDataValue}
                subAsset={subAsset}
              />
            </TabPanel>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default ItemForm;
