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
        <p className="mb-2">ยังไม่มีค่าใช้จ่าย</p>
        <p className="text-sm">ค่าใช้จ่ายจะถูกสร้างโดยอัตโนมัติเมื่อคุณเพิ่มแหล่งรายได้</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ประเภทรายได้</TableHead>
            <TableHead>รายละเอียด</TableHead>
            <TableHead className="text-right">จำนวนเงิน</TableHead>
            <TableHead className="text-center">สถานะ</TableHead>
            <TableHead className="w-32">การจัดการ</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense, i) => (
            <TableRow
              key={`${expense.id}_${i}`}
            >
              <TableCell className="text-sm">
                <div className="font-medium">ประเภท {expense.incomeType}</div>
                <div className="text-xs text-gray-500 max-w-48 truncate">
                  {getIncomeTypeDisplayName(expense.incomeType)}
                </div>
              </TableCell>
              <TableCell>
                <div>{expense.description}</div>
                {expense.defaultPercentage && (
                  <div className="text-xs text-gray-500">
                    ค่าเริ่มต้น: {(expense.defaultPercentage * 100)}% ของรายได้
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
                  {expense.isManualOverride ? 'กำหนดเอง' : 'อัตโนมัติ'}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEditExpense(expense)}
                    title="แก้ไขจำนวนเงิน"
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  {expense.isManualOverride && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResetToDefault(expense)}
                      title="รีเซ็ตเป็นค่าเริ่มต้น"
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
