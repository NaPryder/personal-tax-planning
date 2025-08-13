'use client';

import { Calculator } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { TaxSummary } from '@/types/tax';
import { formatCurrency } from '@/lib/taxCalculation';

interface TaxCalculationCardProps {
  summary: TaxSummary;
}

export function TaxCalculationCard({ summary }: TaxCalculationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          การคำนวณภาษี
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>รายได้รวม</span>
            <span className="font-medium">{formatCurrency(summary.totalIncome)}</span>
          </div>
          <div className="flex justify-between">
            <span>หัก: ค่าใช้จ่ายรวม</span>
            <span className="font-medium text-red-600">-{formatCurrency(summary.totalExpenses)}</span>
          </div>
          <div className="flex justify-between">
            <span>หัก: ค่าลดหย่อนรวม</span>
            <span className="font-medium text-red-600">-{formatCurrency(summary.totalDeductions)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-semibold">
            <span>เงินได้สุทธิ (เสียภาษี)</span>
            <span>{formatCurrency(summary.netIncome)}</span>
          </div>
          <Separator />
          <div className="flex justify-between">
            <span>ภาษีที่ต้องชำระ (อัตราก้าวหน้า)</span>
            <span className="font-medium">{formatCurrency(summary.taxDue)}</span>
          </div>
          <div className="flex justify-between">
            <span>หัก: ภาษีหัก ณ ที่จ่ายแล้ว</span>
            <span className="font-medium text-green-600">-{formatCurrency(summary.totalWithholdingTax)}</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>{summary.finalTax >= 0 ? 'ยอดที่ต้องชำระเพิ่ม' : 'ยอดที่ได้รับคืน'}</span>
            <span className={summary.finalTax >= 0 ? 'text-red-600' : 'text-green-600'}>
              {formatCurrency(Math.abs(summary.finalTax))}
            </span>
          </div>
        </div>

        {summary.finalTax < 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
            <p className="text-green-800 font-medium">
              🎉 คุณมีสิทธิ์ได้รับเงินภาษีคืน {formatCurrency(summary.refundDue || 0)}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
