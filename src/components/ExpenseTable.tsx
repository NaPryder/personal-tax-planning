'use client';

import { Edit, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExpenseItem } from '@/types/tax';
import { getIncomeTypeDisplayName, formatCurrency } from '@/lib/taxCalculation';

interface ExpenseTableProps {
  expenses: ExpenseItem[];
  onEditExpense: (expense: ExpenseItem) => void;
  onResetToDefault: (expense: ExpenseItem) => void;
}

export function ExpenseTable({
  expenses,
  onEditExpense,
  onResetToDefault
}: ExpenseTableProps) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="mb-2">No expenses yet.</p>
        <p className="text-sm">Expenses will be automatically generated when you add income sources.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Income Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="w-32">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="text-sm">
                <div className="font-medium">Type {expense.incomeType}</div>
                <div className="text-xs text-gray-500 max-w-48 truncate">
                  {getIncomeTypeDisplayName(expense.incomeType)}
                </div>
              </TableCell>
              <TableCell>
                <div>{expense.description}</div>
                {expense.defaultPercentage && (
                  <div className="text-xs text-gray-500">
                    Default: {(expense.defaultPercentage * 100)}% of income
                  </div>
                )}
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(expense.amount)}
              </TableCell>
              <TableCell className="text-center">
                <Badge
                  variant={expense.isManualOverride ? "default" : "secondary"}
                  className="text-xs"
                >
                  {expense.isManualOverride ? 'Manual' : 'Auto'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditExpense(expense)}
                    title="Edit amount"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  {expense.isManualOverride && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResetToDefault(expense)}
                      title="Reset to default"
                    >
                      <RefreshCw className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
