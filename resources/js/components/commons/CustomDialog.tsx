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

interface CustomDialogProps {
  open?: boolean;
  onOpenChange?: () => void;
  onClose?: () => void;
  onSubmit?: () => void;
}
const CustomDialog = ({ open, onOpenChange, onSubmit, onClose }: CustomDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      {/* {onOpenChange ? null : (
        <DialogTrigger asChild>
          <Button variant='outline'>Edit Profile</Button>
        </DialogTrigger>
      )} */}
      <DialogTitle></DialogTitle>
      <DialogContent className='md:max-w-[600px]'>
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

        <DialogFooter>
          {onClose ? (
            <Button variant={'outline'} onClick={onClose}>
              Close
            </Button>
          ) : null}
          <Button type='submit' onClick={onSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export { CustomDialog };
