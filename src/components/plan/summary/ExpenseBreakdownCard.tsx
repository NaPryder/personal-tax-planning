'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExpenseItem } from '@/types/tax';
import { formatCurrency } from '@/lib/taxCalculation';

interface ExpenseBreakdownCardProps {
  expenses: ExpenseItem[];
}

export function ExpenseBreakdownCard({ expenses }: ExpenseBreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>ค่าใช้จ่ายในการประกอบอาชีพ</CardTitle>
      </CardHeader>
      <CardContent>
        {expenses.length === 0 ? (
          <p className="text-gray-500 text-sm">ยังไม่มีการคำนวณค่าใช้จ่าย</p>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense, i) => (
              <div key={`${expense.id}_${i}`}
                className="flex justify-between items-start text-sm"
              >
                <div className="flex-1 mr-2">
                  <p className="font-medium">{expense.description}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Badge
                      variant={expense.isManualOverride ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {expense.isManualOverride ? 'กำหนดเอง' : 'อัตโนมัติ'}
                    </Badge>
                    {expense.defaultPercentage && (
                      <span className="text-xs text-gray-500">
                        ({(expense.defaultPercentage * 100)}%)
                      </span>
                    )}
                  </div>
                </div>
                <p className="font-medium">{formatCurrency(expense.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
