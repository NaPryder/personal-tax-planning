'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DeductionCategory, DeductionItem } from '@/types/tax';


type CustomForm = {
  name: string;
  amount: string;
  category: DeductionCategory;
}
interface CustomDeductionDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
  onUpdate: () => void;
  customForm: CustomForm
  // customForm: {
  //   name: string;
  //   amount: string;
  //   category: DeductionCategory;
  // };
  setCustomForm: (form: CustomForm) => void;
  editingDeduction: DeductionItem | null;
}

export function CustomDeductionDialog({
  open,
  onClose,
  onAdd,
  onUpdate,
  customForm,
  setCustomForm,
  editingDeduction
}: CustomDeductionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>
            {editingDeduction ? 'แก้ไขค่าลดหย่อนกำหนดเอง' : 'เพิ่มค่าลดหย่อนกำหนดเอง'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="custom-name">ชื่อค่าลดหย่อน</Label>
            <Input
              id="custom-name"
              value={customForm.name}
              onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
              placeholder="เช่น ค่าใบอนุญาตประกอบวิชาชีพ"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="custom-category">หมวดหมู่</Label>
            <Select
              value={customForm.category}
              onValueChange={(value) => setCustomForm({ ...customForm, category: value as DeductionCategory })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={DeductionCategory.PERSONAL}>ค่าลดหย่อนส่วนตัว</SelectItem>
                <SelectItem value={DeductionCategory.SPOUSE}>ค่าลดหย่อนคู่สมรส</SelectItem>
                <SelectItem value={DeductionCategory.CHILD}>ค่าลดหย่อนบุตร</SelectItem>
                <SelectItem value={DeductionCategory.PARENT}>ค่าลดหย่อนบิดามารดา</SelectItem>
                <SelectItem value={DeductionCategory.INSURANCE}>ประกันภัย และประกันสังคม</SelectItem>
                <SelectItem value={DeductionCategory.DONATION}>เงินบริจาค</SelectItem>
                <SelectItem value={DeductionCategory.OTHER}>ค่าลดหย่อนอื่นๆ</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="custom-amount">จำนวนเงิน (บาท)</Label>
            <Input
              id="custom-amount"
              type="number"
              min="0"
              step="0.01"
              value={customForm.amount}
              onChange={(e) => setCustomForm({ ...customForm, amount: e.target.value })}
              placeholder="0.00"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button
            onClick={editingDeduction ? onUpdate : onAdd}
            disabled={!customForm.name.trim() || !customForm.amount}
          >
            {editingDeduction ? 'อัปเดต' : 'เพิ่ม'}ค่าลดหย่อน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
