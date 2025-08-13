'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TaxPlan } from '@/types/tax';
import { getTaxPlan } from '@/lib/localStorage';
import { calculateTaxSummary } from '@/lib/taxCalculation';
import PlanHeader from '@/components/plan/PlanHeader';
import { SummaryCards } from '@/components/plan/summary/SummaryCards';
import { TaxCalculationCard } from '@/components/plan/summary/TaxCalculationCard';
import { TaxBracketsCard } from '@/components/plan/summary/TaxBracketsCard';
import { IncomeBreakdownCard } from '@/components/plan/summary/IncomeBreakdownCard';
import { ExpenseBreakdownCard } from '@/components/plan/summary/ExpenseBreakdownCard';
import { DeductionBreakdownCard } from '@/components/plan/summary/DeductionBreakdownCard';

export default function SummaryPage() {
  const params = useParams();
  const router = useRouter();
  const [taxPlan, setTaxPlan] = useState<TaxPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const plan = getTaxPlan(params.id as string);
      if (plan) {
        setTaxPlan(plan);
      } else {
        router.push('/');
      }
      setIsLoading(false);
    }
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!taxPlan) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Tax Plan Not Found</h2>
          <Button asChild>
            <Link href="/">Back to Dashboard</Link>
          </Button>
        </div>
      </div>
    );
  }

  const summary = calculateTaxSummary(taxPlan);

  return (
    <section className='flex flex-col gap-4'>
      <PlanHeader
        headerName={`[สรุป] - ${taxPlan.name}`}
        taxPlan={taxPlan}
        renderActions={() => (
          <Button asChild className="flex items-center gap-2">
            <Link href={`/plan/${taxPlan.id}`}>
              <Edit className="w-4 h-4" />
              Edit Plan
            </Link>
          </Button>
        )}
      />

      {/* Summary Cards */}
      <SummaryCards summary={summary} taxPlan={taxPlan} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Tax Calculation Breakdown */}
        <TaxCalculationCard summary={summary} />

        {/* Thai Tax Brackets */}
        <TaxBracketsCard summary={summary} />
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* แหล่งเงินได้ */}
        <IncomeBreakdownCard incomes={taxPlan.incomes} />

        {/* Expense Breakdown */}
        <ExpenseBreakdownCard expenses={taxPlan.expenses} />

        {/* Deduction Breakdown */}
        <DeductionBreakdownCard deductions={taxPlan.deductions} />
      </div>
    </section>
  );
}
