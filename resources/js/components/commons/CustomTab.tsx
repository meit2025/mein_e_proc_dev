import { useState, ReactNode } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';

interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
}

interface CustomTabProps {
  tabLabels: string[];
  tabContents: ReactNode[];
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

const CustomTab = ({ tabLabels, tabContents }: CustomTabProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };

  return (
    <div className='card card-grid h-full min-w-full p-4'>
      <div className='card-body'>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label='dynamic tabs example'>
              {tabLabels.map((label, index) => (
                <Tab key={index} label={label} {...a11yProps(index)} />
              ))}
            </Tabs>
          </Box>
          {tabContents.map((content, index) => (
            <TabPanel key={index} value={value} index={index}>
              {content}
            </TabPanel>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default CustomTab;
