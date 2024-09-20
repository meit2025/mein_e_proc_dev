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
  className?: string,
  onSave? : () =>void;
}
const CustomDialog = ({
  open,
  onOpenChange,
  onSubmit,
  onClose,
  children,
  className,
  onSave
}: PropsWithChildren<CustomDialogProps>) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* {onOpenChange ? null : (
        <DialogTrigger asChild>
          <Button variant='outline'>Edit Profile</Button>
        </DialogTrigger>
      )} */}
      <DialogTitle></DialogTitle>
      <DialogContent className={className ? className : 'md:max-w-[600px]'}>
        <DialogHeader>
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href='/'>Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbLink href='/components'>Components</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator>
                <SlashIcon />
              </BreadcrumbSeparator>
              <BreadcrumbItem>
                <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </DialogHeader>

        <div> {children ? children : null}</div>
        <DialogFooter>
          {onClose ? (
            <Button variant={'outline'} onClick={onClose}>
              Close
            </Button>
          ) : null}
         {onSave ? ( <Button type='submit' onClick={onSubmit}>
            Save changes
          </Button>) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { CustomDialog };
