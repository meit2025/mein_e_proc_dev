import { cn } from '@/lib/utils';

export interface CustomStatusProps {
  className: string;
  code?: string;
  name: string;
}

export function CustomStatus({ className, code, name }: CustomStatusProps) {
  return <div className={cn('px-6 rounded-md text-xs ', className)}>{name}</div>;
}
