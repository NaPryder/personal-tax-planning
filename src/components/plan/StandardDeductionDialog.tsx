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
import { formatCurrency } from '@/lib/taxCalculation';
import { DeductionItem, StandardDeduction, TaxPlan } from '@/types/tax';
import { Check } from 'lucide-react';

interface StandardDeductionDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: () => void;
  onUpdate: () => void;
  standardDeductions: StandardDeduction[];
  taxPlan: TaxPlan;
  selectedStandardId: string;
  setSelectedStandardId: (id: string) => void;
  standardAmount: string;
  setStandardAmount: (amount: string) => void;
  editingDeduction: DeductionItem | null;
}

export function StandardDeductionDialog({
  open,
  onClose,
  onAdd,
  onUpdate,
  standardDeductions,
  taxPlan,
  selectedStandardId,
  setSelectedStandardId,
  standardAmount,
  setStandardAmount,
  editingDeduction
}: StandardDeductionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {editingDeduction ? 'แก้ไขค่าลดหย่อนมาตรฐาน' : 'เพิ่มค่าลดหย่อนมาตรฐาน'}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>ประเภทลดหย่อน</Label>
            <Select
              value={selectedStandardId}
              onValueChange={setSelectedStandardId}
              disabled={!!editingDeduction}
            >
              <SelectTrigger>
                <SelectValue placeholder="เลือกค่าลดหย่อนมาตรฐาน" />
              </SelectTrigger>
              <SelectContent>
                {standardDeductions.map((deduction) => {
                  const alreadyAdded = taxPlan.deductions.some(d =>
                    !d.isCustom && d.name === deduction.name && d.id !== editingDeduction?.id
                  );
                  return (
                    <SelectItem
                      key={deduction.id}
                      value={deduction.id}
                      disabled={alreadyAdded}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span>{deduction.name}</span>
                        {alreadyAdded && <Check className="w-4 h-4 text-green-600" />}
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedStandardId && (
              <p className="text-xs text-gray-600">
                {standardDeductions.find(d => d.id === selectedStandardId)?.description}
                {standardDeductions.find(d => d.id === selectedStandardId)?.maxAmount &&
                  ` (สูงสุด: ${formatCurrency(standardDeductions.find(d => d.id === selectedStandardId)!.maxAmount)})`
                }
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="standard-amount">จำนวนเงิน (บาท)</Label>
            <Input
              id="standard-amount"
              type="number"
              min="0"
              step="0.01"
              value={standardAmount}
              onChange={(e) => setStandardAmount(e.target.value)}
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
            disabled={!selectedStandardId || !standardAmount}
          >
            {editingDeduction ? 'อัปเดต' : 'เพิ่ม'}ค่าลดหย่อน
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
