'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { TaxPlan, ExpenseItem } from '@/types/tax';
import { formatCurrency, calculateStandardExpense } from '@/lib/taxCalculation';
import { ExpenseTable } from '../ExpenseTable';
import { ExpenseEditDialog } from '../ExpenseEditDialog';

interface ExpenseFormProps {
  taxPlan: TaxPlan;
  onUpdatePlan: (updatedPlan: TaxPlan) => void;
}

export function ExpenseForm({ taxPlan, onUpdatePlan }: ExpenseFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(null);

  const handleEditExpense = (expense: ExpenseItem) => {
    setEditingExpense(expense);
    setIsDialogOpen(true);
  };

  const handleSaveExpense = (amount: number) => {
    if (!editingExpense) return;

    const updatedExpense: ExpenseItem = {
      ...editingExpense,
      amount,
      isManualOverride: true
    };

    const updatedExpenses = taxPlan.expenses.map(expense =>
      expense.id === editingExpense.id ? updatedExpense : expense
    );

    onUpdatePlan({
      ...taxPlan,
      expenses: updatedExpenses
    });

    setIsDialogOpen(false);
    setEditingExpense(null);
  };

  const handleResetToDefault = (expense: ExpenseItem) => {
    const relatedIncome = taxPlan.incomes.find(income =>
      income.type === expense.incomeType
    );

    if (!relatedIncome) return;

    const defaultAmount = calculateStandardExpense(expense.incomeType, relatedIncome.amount);

    const updatedExpense: ExpenseItem = {
      ...expense,
      amount: defaultAmount,
      isManualOverride: false
    };

    const updatedExpenses = taxPlan.expenses.map(exp =>
      exp.id === expense.id ? updatedExpense : exp
    );

    onUpdatePlan({
      ...taxPlan,
      expenses: updatedExpenses
    });
  };

  const totalExpenses = taxPlan.expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          รวมค่าใช้จ่าย:
          <span className="font-medium">
            {formatCurrency(totalExpenses)}
          </span>
        </p>
        <div className="flex items-center gap-2 text-xs text-blue-600">
          <Info className="w-3 h-3" />
          Expenses auto-calculated based on Thai tax law percentages
        </div>
      </div>

      <ExpenseTable
        expenses={taxPlan.expenses}
        onEditExpense={handleEditExpense}
        onResetToDefault={handleResetToDefault}
      />

      <ExpenseEditDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        expense={editingExpense}
        onSave={handleSaveExpense}
      />
    </div>
  );
}
