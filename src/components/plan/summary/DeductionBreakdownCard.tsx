'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DeductionItem } from '@/types/tax';
import { formatCurrency } from '@/lib/taxCalculation';

interface DeductionBreakdownCardProps {
  deductions: DeductionItem[];
}

export function DeductionBreakdownCard({ deductions }: DeductionBreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>รายการลดหย่อนภาษี</CardTitle>
      </CardHeader>
      <CardContent>
        {deductions.length === 0 ? (
          <p className="text-gray-500 text-sm">ยังไม่มีรายการลดหย่อน</p>
        ) : (
          <div className="space-y-3">
            {deductions.map((deduction) => (
              <div key={deduction.id} className="flex justify-between items-start text-sm">
                <div className="flex-1 mr-2">
                  <p className="font-medium">{deduction.name}</p>
                  <Badge
                    variant={deduction.isCustom ? "default" : "secondary"}
                    className="text-xs mt-1"
                  >
                    {deduction.isCustom ? 'กำหนดเอง' : 'มาตรฐาน'}
                  </Badge>
                </div>
                <p className="font-medium">{formatCurrency(deduction.amount)}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
