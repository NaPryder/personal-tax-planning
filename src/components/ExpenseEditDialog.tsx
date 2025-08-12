'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { ExpenseItem } from '@/types/tax';
import { getIncomeTypeDisplayName } from '@/lib/taxCalculation';

interface ExpenseEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  expense: ExpenseItem | null;
  onSave: (amount: number) => void;
}

export function ExpenseEditDialog({
  open,
  onOpenChange,
  expense,
  onSave
}: ExpenseEditDialogProps) {
  const [customAmount, setCustomAmount] = useState('');

  useEffect(() => {
    if (expense) {
      setCustomAmount(expense.amount.toString());
    } else {
      setCustomAmount('');
    }
  }, [expense]);

  const handleSave = () => {
    const amount = parseFloat(customAmount) || 0;
    onSave(amount);
  };

  const handleClose = () => {
    onOpenChange(false);
    setCustomAmount('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Expense Amount</DialogTitle>
        </DialogHeader>
        {expense && (
          <div className="grid gap-4 py-4">
            <div className="text-sm text-gray-600">
              <p><strong>Income Type:</strong> {getIncomeTypeDisplayName(expense.incomeType)}</p>
              <p><strong>Description:</strong> {expense.description}</p>
              {expense.defaultPercentage && (
                <p><strong>Default Rate:</strong> {(expense.defaultPercentage * 100)}% of income</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="custom-amount">Custom Amount (THB)</Label>
              <Input
                id="custom-amount"
                type="number"
                min="0"
                step="0.01"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
