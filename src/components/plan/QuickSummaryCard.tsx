import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaxSummary } from '@/types/tax';
import { formatCurrency } from '@/lib/taxCalculation';
import { cn } from '@/lib/utils';


interface QuickSummaryCardProps {
  summary: TaxSummary
}
const QuickSummaryCard = ({ summary }: QuickSummaryCardProps) => {
  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="text-2xl">
          Overview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <SummaryDetail
            label="รวมเงินได้"
            value={summary.totalIncome}
          />
          <SummaryDetail
            label="รวมค่าใช้จ่าย"
            value={summary.totalExpenses}
          />
          <SummaryDetail
            label="รวมลดหย่อน"
            value={summary.totalDeductions}
          />
          <SummaryDetail
            label="เงินได้สุทธิ"
            value={summary.netIncome}
          />
          <SummaryDetail
            label="ภาษีที่คำนวณได้"
            value={summary.taxDue}
          />
          <SummaryDetail
            label={summary.finalTax >= 0 ? 'จำนวนที่ต้องชำระ' : 'เงินคืนภาษี'}
            value={Math.abs(summary.finalTax)}
            valueClassName={
              summary.finalTax >= 0 ? 'text-red-600' : 'text-green-600'
            }
          />
        </div>
      </CardContent>
    </Card>
  )
}

export default QuickSummaryCard


interface SummaryDetailProps {
  label: string;
  value: number;
  valueClassName?: string;
}
const SummaryDetail = ({ label, value, valueClassName }: SummaryDetailProps) => {
  return (
    <div>
      <span className="text-gray-600">{label}</span>
      <p
        className={cn(
          `font-semibold text-lg`,
          valueClassName,
        )}
      >
        {formatCurrency(value)}
      </p>
    </div>
  )
}
