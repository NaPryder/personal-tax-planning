'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { IncomeType, IncomeItem } from '@/types/tax';
import { getIncomeTypeDisplayName } from '@/lib/taxCalculation';

interface IncomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  income: IncomeItem | null;
  onSave: (incomeData: {
    type: IncomeType;
    description: string;
    amount: number;
    withholdingTax: number;
  }) => void;
}

export function IncomeDialog({
  open,
  onOpenChange,
  income,
  onSave
}: IncomeDialogProps) {
  const [formData, setFormData] = useState({
    type: IncomeType.EMPLOYMENT,
    description: '',
    amount: '',
    withholdingTax: ''
  });

  useEffect(() => {
    if (income) {
      setFormData({
        type: income.type,
        description: income.description,
        amount: income.amount.toString(),
        withholdingTax: income.withholdingTax.toString()
      });
    } else {
      setFormData({
        type: IncomeType.EMPLOYMENT,
        description: '',
        amount: '',
        withholdingTax: ''
      });
    }
  }, [income]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount) || 0;
    const withholdingTax = parseFloat(formData.withholdingTax) || 0;

    if (!formData.description.trim() || amount <= 0) {
      return;
    }

    onSave({
      type: formData.type,
      description: formData.description.trim(),
      amount,
      withholdingTax
    });

    // reset
    setFormData({
      type: IncomeType.EMPLOYMENT,
      description: '',
      amount: '',
      withholdingTax: ''
    })
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {income ? 'Edit Income Source' : 'Add Income Source'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="income-type">Income Type</Label>
              <Select
                value={formData.type.toString()}
                onValueChange={(value) => setFormData({ ...formData, type: parseInt(value) as IncomeType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(IncomeType)
                    .filter(value => typeof value === 'number')
                    .map((type) => (
                      <SelectItem key={type} value={type.toString()}>
                        Type {type}: {getIncomeTypeDisplayName(type as IncomeType).split(' (')[0]}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">
                {getIncomeTypeDisplayName(formData.type)}
              </p>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="income-description">Description</Label>
              <Input
                id="income-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g., Salary from ABC Company"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="income-amount">Amount (THB)</Label>
                <Input
                  id="income-amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="withholding-tax">Withholding Tax (THB)</Label>
                <Input
                  id="withholding-tax"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.withholdingTax}
                  onChange={(e) => setFormData({ ...formData, withholdingTax: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">
              {income ? 'Update Income' : 'Add Income'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
