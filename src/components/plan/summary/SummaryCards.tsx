'use client';

import { Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { TaxSummary, TaxPlan } from '@/types/tax';
import { formatCurrency } from '@/lib/taxCalculation';
import { SummaryCard } from '@/components/SummaryCard';

interface SummaryCardsProps {
  summary: TaxSummary;
  taxPlan: TaxPlan;
}

export function SummaryCards({ summary, taxPlan }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <SummaryCard
        title="รายได้รวม"
        value={formatCurrency(summary.totalIncome)}
        icon={<TrendingUp className="w-5 h-5 text-green-600" />}
        description={`${taxPlan.incomes.length} แหล่งรายได้`}
      />
      <SummaryCard
        title="ค่าใช้จ่ายรวม"
        value={formatCurrency(summary.totalExpenses)}
        icon={<TrendingDown className="w-5 h-5 text-red-600" />}
        description={`${taxPlan.expenses.length} รายการค่าใช้จ่าย`}
      />
      <SummaryCard
        title="ลดหย่อนรวม"
        value={formatCurrency(summary.totalDeductions)}
        icon={<TrendingDown className="w-5 h-5 text-blue-600" />}
        description={`${taxPlan.deductions.length} รายการลดหย่อน`}
      />
      <SummaryCard
        title="เงินได้สุทธิ"
        value={formatCurrency(summary.netIncome)}
        icon={<Calculator className="w-5 h-5 text-purple-600" />}
        description="รายได้ที่ต้องเสียภาษี"
      />
    </div>
  );
}
