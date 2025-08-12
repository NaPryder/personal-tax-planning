'use client';

import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { TaxPlan, IncomeType, IncomeItem } from '@/types/tax';
import { getIncomeTypeDisplayName, formatCurrency } from '@/lib/taxCalculation';
import { generateId } from '@/lib/localStorage';

interface IncomeFormProps {
  taxPlan: TaxPlan;
  onUpdatePlan: (updatedPlan: TaxPlan) => void;
}

export function IncomeForm({ taxPlan, onUpdatePlan }: IncomeFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeItem | null>(null);
  const [formData, setFormData] = useState({
    type: IncomeType.EMPLOYMENT,
    description: '',
    amount: '',
    withholdingTax: ''
  });

  const resetForm = () => {
    setFormData({
      type: IncomeType.EMPLOYMENT,
      description: '',
      amount: '',
      withholdingTax: ''
    });
    setEditingIncome(null);
  };

  const handleOpenDialog = (income?: IncomeItem) => {
    if (income) {
      setEditingIncome(income);
      setFormData({
        type: income.type,
        description: income.description,
        amount: income.amount.toString(),
        withholdingTax: income.withholdingTax.toString()
      });
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseFloat(formData.amount) || 0;
    const withholdingTax = parseFloat(formData.withholdingTax) || 0;

    if (!formData.description.trim() || amount <= 0) {
      return;
    }

    const newIncome: IncomeItem = {
      id: editingIncome?.id || generateId(),
      type: formData.type,
      description: formData.description.trim(),
      amount,
      withholdingTax
    };

    let updatedIncomes;
    if (editingIncome) {
      updatedIncomes = taxPlan.incomes.map(income =>
        income.id === editingIncome.id ? newIncome : income
      );
    } else {
      updatedIncomes = [...taxPlan.incomes, newIncome];
    }

    onUpdatePlan({
      ...taxPlan,
      incomes: updatedIncomes
    });

    handleCloseDialog();
  };

  const handleDelete = (incomeId: string) => {
    const updatedIncomes = taxPlan.incomes.filter(income => income.id !== incomeId);
    onUpdatePlan({
      ...taxPlan,
      incomes: updatedIncomes
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Total Income: <span className="font-medium">{formatCurrency(taxPlan.incomes.reduce((sum, income) => sum + income.amount, 0))}</span>
        </p>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Income
        </Button>
      </div>

      {taxPlan.incomes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No income sources added yet. Click &quot;Add Income&quot; to get started.
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Type</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Withholding Tax</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxPlan.incomes.map((income) => (
                <TableRow key={income.id}>
                  <TableCell className="text-sm">
                    <div className="font-medium">Type {income.type}</div>
                    <div className="text-xs text-gray-500 max-w-48 truncate">
                      {getIncomeTypeDisplayName(income.type)}
                    </div>
                  </TableCell>
                  <TableCell>{income.description}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(income.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(income.withholdingTax)}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(income)}
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(income.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Income Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingIncome ? 'Edit Income Source' : 'Add Income Source'}
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
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancel
              </Button>
              <Button type="submit">
                {editingIncome ? 'Update Income' : 'Add Income'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
