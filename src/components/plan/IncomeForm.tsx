'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaxPlan, IncomeType, IncomeItem } from '@/types/tax';
import { formatCurrency } from '@/lib/taxCalculation';
import { generateId } from '@/lib/localStorage';
import { IncomeTable } from './IncomeTable';
import { IncomeDialog } from './IncomeDialog';
import ConfirmationDialog from './ConfirmationDialog';

interface IncomeFormProps {
  taxPlan: TaxPlan;
  onUpdatePlan: (updatedPlan: TaxPlan) => void;
}

export function IncomeForm({ taxPlan, onUpdatePlan }: IncomeFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeItem | null>(null);

  const handleOpenDialog = (income?: IncomeItem) => {
    setEditingIncome(income || null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingIncome(null);
  };

  const handleSaveIncome = (incomeData: {
    type: IncomeType;
    description: string;
    amount: number;
    withholdingTax: number;
  }) => {
    const newIncome: IncomeItem = {
      id: editingIncome?.id || generateId(),
      type: incomeData.type,
      description: incomeData.description,
      amount: incomeData.amount,
      withholdingTax: incomeData.withholdingTax
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

  const handleDeleteIncome = (incomeId: string) => {
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
          รวมเงินได้: <span className="font-medium">{formatCurrency(taxPlan.incomes.reduce((sum, income) => sum + income.amount, 0))}</span>
        </p>
        <Button onClick={() => handleOpenDialog()} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          เพิ่มรายได้
        </Button>
      </div>

      <IncomeTable
        incomes={taxPlan.incomes}
        onEditIncome={handleOpenDialog}
        onDeleteIncome={handleDeleteIncome}
      />

      <IncomeDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        income={editingIncome}
        onSave={handleSaveIncome}
      />


    </div>
  );
}
