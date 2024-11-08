import { useState, ReactNode, Children, useEffect } from 'react';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import Pr from '../detailPr/Pr';
import Dp from '../detailPr/Dp';
import Logs from '../detailPr/Logs';
import Po from '../detailPr/Po';
import Detail from '@/Pages/Reimburse/Detail';

interface TabPanelProps {
  children?: ReactNode;
  value: number;
  index: number;
}

interface CustomTabProps {
  detailLayout: ReactNode;
  id: number;
  type: string;
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

const CustomTabPr = ({ detailLayout, id, type }: CustomTabProps) => {
  const [value, setValue] = useState(0);

  const handleChange = (event: any, newValue: number) => {
    setValue(newValue);
  };
  const [tabData, setTabData] = useState([
    {
      title: 'Detail',
      content: detailLayout,
    },
    {
      title: 'Pr',
      content: <Pr id={id} type={type} />,
    },
    {
      title: 'Dp',
      content: <Dp id={id} type={type} />,
    },
    {
      title: 'Po',
      content: <Po id={id} type={type} />,
    },
    {
      title: 'Log',
      content: <Logs />,
    },
  ]);

  useEffect(() => {}, [type, detailLayout, id]);

  // eslint-disable-next-line react/jsx-key

  return (
    <div className='card card-grid h-full min-w-full p-4'>
      <div className='card-body'>
        <Box sx={{ width: '100%' }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleChange} aria-label='dynamic tabs example'>
              {tabData.map((label, index) => (
                <Tab key={index} label={label.title} {...a11yProps(index)} />
              ))}
            </Tabs>
          </Box>
          {tabData.map((label, index) => (
            <TabPanel key={index} value={value} index={index}>
              {label.content}
            </TabPanel>
          ))}
        </Box>
      </div>
    </div>
  );
};

export default CustomTabPr;
