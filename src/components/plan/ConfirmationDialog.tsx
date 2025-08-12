import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';

interface ConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: () => React.ReactNode;
}

const ConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description
}: ConfirmationDialogProps) => {


  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {title}
          </DialogTitle>
        </DialogHeader>

        <DialogDescription>
          {description()}
        </DialogDescription>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="destructive"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onClose()
              }}
            >
              ยกเลิก
            </Button>
          </DialogClose>

          <DialogClose asChild>
            <Button
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onConfirm()
              }}
            >
              ยืนยัน
            </Button>
          </DialogClose>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ConfirmationDialog
