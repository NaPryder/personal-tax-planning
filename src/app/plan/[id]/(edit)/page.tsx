'use client';

import EditTabs from '@/components/plan/EditTabs';
import PlanHeader from '@/components/plan/PlanHeader';
import QuickSummaryCard from '@/components/plan/QuickSummaryCard';
import { Button } from '@/components/ui/button';
import { getTaxPlan, saveTaxPlan } from '@/lib/localStorage';
import { calculateTaxSummary, generateExpensesFromIncomes } from '@/lib/taxCalculation';
import { TaxPlan } from '@/types/tax';
import { Calculator } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function PlanEditPage() {
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

  const handleUpdatePlan = (updatedPlan: TaxPlan) => {
    // Auto-generate expenses when incomes change
    const newExpenses = generateExpensesFromIncomes(updatedPlan.incomes);

    // Keep manual overrides for existing expenses
    const finalExpenses = newExpenses.map(newExpense => {
      const existingExpense = updatedPlan.expenses.find(
        expense => expense.incomeType === newExpense.incomeType
      );
      return existingExpense?.isManualOverride ? existingExpense : newExpense;
    });

    const planToSave = {
      ...updatedPlan,
      expenses: finalExpenses
    };

    saveTaxPlan(planToSave);
    setTaxPlan(planToSave);
  };

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
        headerName={taxPlan.name}
        taxPlan={taxPlan}
        renderActions={() => (
          <Button asChild className="flex items-center gap-2">
            <Link href={`/plan/${taxPlan.id}/summary`}>
              <Calculator className="w-4 h-4" />
              View Summary
            </Link>
          </Button>
        )}
      />

      {/* Quick Summary Card */}
      <QuickSummaryCard summary={summary} />

      {/* Main Tabs */}
      <EditTabs
        taxPlan={taxPlan}
        handleUpdatePlan={handleUpdatePlan}
      />
    </section>
  );
}
