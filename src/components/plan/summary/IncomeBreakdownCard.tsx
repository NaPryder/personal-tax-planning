'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IncomeItem } from '@/types/tax';
import { formatCurrency, getIncomeTypeDisplayName } from '@/lib/taxCalculation';

interface IncomeBreakdownCardProps {
  incomes: IncomeItem[];
}

export function IncomeBreakdownCard({ incomes }: IncomeBreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>แหล่งรายได้</CardTitle>
      </CardHeader>
      <CardContent>
        {incomes.length === 0 ? (
          <p className="text-gray-500 text-sm">ยังไม่มีแหล่งรายได้</p>
        ) : (
          <div className="flex flex-col gap-4">
            {incomes.map((income) => (
              <div key={income.id} className="flex justify-between items-start text-sm">
                <div className="flex-1 mr-2">
                  <p className="font-medium">{income.description}</p>
                  <p className="text-xs text-gray-500">
                    ประเภท {income.type}: {getIncomeTypeDisplayName(income.type).split(' (')[0]}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(income.amount)}</p>
                  {income.withholdingTax > 0 && (
                    <p className="text-xs text-green-600">
                      ภาษีหัก ณ ที่จ่าย: {formatCurrency(income.withholdingTax)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
