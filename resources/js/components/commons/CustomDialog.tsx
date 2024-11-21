import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/shacdn/dialog';

import { Button } from '@/components/shacdn/button';
import { Label } from '@/components/shacdn/label';

import { Input } from '@/components/shacdn/input';

import { SlashIcon } from '@radix-ui/react-icons';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/shacdn/breadcrumb';
import { PropsWithChildren } from 'react';

interface CustomDialogProps {
  open?: boolean;
  onOpenChange?: () => void;
  onClose?: () => void;
  onSubmit?: () => void;
  className?: string;
}
const CustomDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onClose,
  children,
  className,
}: PropsWithChildren<CustomDialogProps>) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* {onOpenChange ? null : (
        <DialogTrigger asChild>
          <Button variant='outline'>Edit Profile</Button>
        </DialogTrigger>
      )} */}
      <DialogTitle></DialogTitle>
      <DialogContent className={className ? className : 'md:max-w-[768px]'}>
        <div> {children ? children : null}</div>
        <DialogFooter>
          {onClose ? (
            <Button variant={'outline'} onClick={onClose}>
              Close
            </Button>
          ) : null}
          {onSubmit ? (
            <Button type='submit' onClick={onSubmit}>
              Save changes
            </Button>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { CustomDialog };
