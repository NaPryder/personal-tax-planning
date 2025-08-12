'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TaxPlan } from '@/types/tax';
import { getTaxPlan, saveTaxPlan } from '@/lib/localStorage';
import { calculateTaxSummary, formatCurrency, generateExpensesFromIncomes } from '@/lib/taxCalculation';
import { IncomeForm } from '@/components/IncomeForm';
import { ExpenseForm } from '@/components/ExpenseForm';
import { DeductionForm } from '@/components/DeductionForm';

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
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{taxPlan.name}</h1>
            <Badge variant="secondary" className="mt-1">
              Tax Year {taxPlan.year}
            </Badge>
          </div>
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href={`/plan/${taxPlan.id}/summary`}>
            <Calculator className="w-4 h-4" />
            View Summary
          </Link>
        </Button>
      </div>

      {/* Quick Summary Card */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Quick Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Total Income</span>
              <p className="font-semibold text-lg">{formatCurrency(summary.totalIncome)}</p>
            </div>
            <div>
              <span className="text-gray-600">Net Income</span>
              <p className="font-semibold text-lg">{formatCurrency(summary.netIncome)}</p>
            </div>
            <div>
              <span className="text-gray-600">Tax Due</span>
              <p className="font-semibold text-lg">{formatCurrency(summary.taxDue)}</p>
            </div>
            <div>
              <span className="text-gray-600">
                {summary.finalTax >= 0 ? 'Amount Due' : 'Refund'}
              </span>
              <p className={`font-semibold text-lg ${summary.finalTax >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                {formatCurrency(Math.abs(summary.finalTax))}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="income" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="income">
            Income ({taxPlan.incomes.length})
          </TabsTrigger>
          <TabsTrigger value="expenses">
            Expenses ({taxPlan.expenses.length})
          </TabsTrigger>
          <TabsTrigger value="deductions">
            Deductions ({taxPlan.deductions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="income">
          <Card>
            <CardHeader>
              <CardTitle>Income Sources</CardTitle>
              <p className="text-sm text-gray-600">
                Add your income sources based on Thailand&apos;s 8 income categories
              </p>
            </CardHeader>
            <CardContent>
              <IncomeForm
                taxPlan={taxPlan}
                onUpdatePlan={handleUpdatePlan}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="expenses">
          <Card>
            <CardHeader>
              <CardTitle>Business Expenses</CardTitle>
              <p className="text-sm text-gray-600">
                Expenses are automatically calculated based on income type, but can be manually overridden
              </p>
            </CardHeader>
            <CardContent>
              <ExpenseForm
                taxPlan={taxPlan}
                onUpdatePlan={handleUpdatePlan}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deductions">
          <Card>
            <CardHeader>
              <CardTitle>Tax Deductions</CardTitle>
              <p className="text-sm text-gray-600">
                Select standard deductions or add custom deductions
              </p>
            </CardHeader>
            <CardContent>
              <DeductionForm
                taxPlan={taxPlan}
                onUpdatePlan={handleUpdatePlan}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
