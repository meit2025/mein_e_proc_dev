import * as React from 'react';

interface StatusBoleanProps {
  status: boolean;
  name?: { active: string; InActive: string };
}

// Define StatusBolean component using props
export const StatusBolean: React.FC<StatusBoleanProps> = ({
  status,
  name = { active: 'Active', InActive: 'Inactive' },
}) => {
  return (
    <span className={`badge badge-outline ${status ? 'badge-success' : 'badge-danger'}`}>
      {status ? name.active : name.InActive}
    </span>
  );
};
