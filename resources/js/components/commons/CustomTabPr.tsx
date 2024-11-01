import { useState, ReactNode, Children } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import Pr from '../detailPr/Pr';
import Dp from '../detailPr/Dp';
import Logs from '../detailPr/Logs';
import Po from '../detailPr/Po';

interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
}

interface CustomTabProps {
  detailLayout: ReactNode;
}

const TabPanel = ({ children, value, index, ...other }: TabPanelProps) => {
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

const a11yProps = (index: number) => {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
};

const CustomTabPr = ({ detailLayout }: CustomTabProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  const TabLabel = ['Detail', 'PR', 'DP', 'PO', 'Logs'];

  // eslint-disable-next-line react/jsx-key
  const tabContents = [{}, , , ,];

  return (
    <div className='card card-grid h-full min-w-full p-4'>
      <div className='card-body'>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label='dynamic tabs example'>
              {TabLabel.map((label, index) => (
                <Tab key={index} label={label} {...a11yProps(index)} />
              ))}
            </Tabs>
          </Box>

          <TabPanel key={0} value={value} index={0}>
            {detailLayout}
          </TabPanel>

          <TabPanel key={1} value={value} index={1}>
            <Pr />
          </TabPanel>
          <TabPanel key={2} value={value} index={2}>
            <Dp />
          </TabPanel>
          <TabPanel key={3} value={value} index={3}>
            <Po />
          </TabPanel>
          <TabPanel key={4} value={value} index={4}>
            <Logs />
          </TabPanel>
        </Box>
      </div>
    </div>
  );
};

export default CustomTabPr;
