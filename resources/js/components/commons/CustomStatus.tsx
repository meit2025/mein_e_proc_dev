import { cn } from '@/lib/utils';
import { CircleAlert, CircleCheck, Ban } from 'lucide-react';

export interface CustomStatusProps {
  className: string;
  code?: string;
  name: string;
}

export function CustomStatus({ className, code, name }: CustomStatusProps) {
  let classess = 'bg-red-100 border-red-600';
  let iconComponent = null;

  const iconSize = 16;
  switch (code) {
    case 'waiting_approve':
      classess = 'bg-yellow-50 border-yellow-600  text-yellow-600';
      iconComponent = <CircleAlert size={iconSize} />;
      break;

    case 'cancel':
      classess = 'bg-red-50 border-red-600  text-red-600';
      iconComponent = <Ban size={iconSize} />;
      break;

    case 'approve_to':
      classess = 'bg-green-50 border-green-600  text-green-600';
      iconComponent = <CircleCheck size={iconSize} />;
      break;

    case 'reject_to':
      classess = 'bg-red-50 border-red-600  text-red-600';
      iconComponent = <Ban size={iconSize} />;
      break;

    case 'fully_approve':
      classess = 'bg-green-50 border-green-600  text-green-600';
      iconComponent = <CircleCheck size={iconSize} />;
      break;
    case 'revise':
      classess = 'bg-red-50 border-red-600  text-red-600';
      iconComponent = <Ban size={iconSize} />;
      break;
    default:
      classess = 'bg-green-50 border-green-400 text-green-600 ';
      iconComponent = <CircleCheck size={iconSize} />;
      break;
  }
  return (
    <div
      className={cn(
        'px-4 py-2 mt-1 flex font-bold items-center space-x-2 border-4 rounded-full border text-xs ',
        classess,
      )}
    >
      {iconComponent}
      <span>{name}</span>
    </div>
  );
}
