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
import { LoadingSpin } from './LoadingSpin';

interface ConfirmationDeleteProps {
  open?: boolean;
  isLoading: boolean;
  onOpenChange?: () => void;
  onClose?: () => void;
  onDelete?: () => void;
  className?: string;
  title?: string;
  description?: string;
}
const ConfirmationDeleteModal = ({
  open,
  onOpenChange,
  onDelete,
  onClose,
  children,
  className,
  isLoading,
  title,
  description,
}: PropsWithChildren<ConfirmationDeleteProps>) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* <DialogTitle>{title ? title : 'Delete Item'}</DialogTitle> */}
      <DialogContent className={className ? className : 'md:max-w-[768px]'}>
        {description ? description : 'Are you sure delete this item?'}
        <DialogFooter>
          {onClose ? (
            <Button variant={'outline'} onClick={onClose}>
              Close
            </Button>
          ) : null}
          {onDelete ? (
            <>
              {isLoading ? (
                <LoadingSpin />
              ) : (
                <Button type='submit' onClick={onDelete}>
                  Delete
                </Button>
              )}
            </>
          ) : null}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { ConfirmationDeleteModal };
