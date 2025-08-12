'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Edit, Calculator, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TaxPlan } from '@/types/tax';
import { getTaxPlan } from '@/lib/localStorage';
import {
  calculateTaxSummary,
  formatCurrency,
  getIncomeTypeDisplayName,
  TAX_BRACKETS
} from '@/lib/taxCalculation';
import { SummaryCard } from '@/components/SummaryCard';

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
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{taxPlan.name} - Summary</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary">Tax Year {taxPlan.year}</Badge>
              <span className="text-sm text-gray-500">
                Updated {taxPlan.updatedAt.toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
        <Button asChild className="flex items-center gap-2">
          <Link href={`/plan/${taxPlan.id}`}>
            <Edit className="w-4 h-4" />
            Edit Plan
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <SummaryCard
          title="Total Income"
          value={formatCurrency(summary.totalIncome)}
          icon={<TrendingUp className="w-5 h-5 text-green-600" />}
          description={`${taxPlan.incomes.length} income source(s)`}
        />
        <SummaryCard
          title="Total Expenses"
          value={formatCurrency(summary.totalExpenses)}
          icon={<TrendingDown className="w-5 h-5 text-red-600" />}
          description={`${taxPlan.expenses.length} expense item(s)`}
        />
        <SummaryCard
          title="Total Deductions"
          value={formatCurrency(summary.totalDeductions)}
          icon={<TrendingDown className="w-5 h-5 text-blue-600" />}
          description={`${taxPlan.deductions.length} deduction(s)`}
        />
        <SummaryCard
          title="Net Income"
          value={formatCurrency(summary.netIncome)}
          icon={<Calculator className="w-5 h-5 text-purple-600" />}
          description="Taxable income"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Tax Calculation Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5" />
              Tax Calculation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Total Income</span>
                <span className="font-medium">{formatCurrency(summary.totalIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span>Less: Total Expenses</span>
                <span className="font-medium text-red-600">-{formatCurrency(summary.totalExpenses)}</span>
              </div>
              <div className="flex justify-between">
                <span>Less: Total Deductions</span>
                <span className="font-medium text-red-600">-{formatCurrency(summary.totalDeductions)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Net Income (Taxable)</span>
                <span>{formatCurrency(summary.netIncome)}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Tax Due (Progressive Rate)</span>
                <span className="font-medium">{formatCurrency(summary.taxDue)}</span>
              </div>
              <div className="flex justify-between">
                <span>Less: Withholding Tax Paid</span>
                <span className="font-medium text-green-600">-{formatCurrency(summary.totalWithholdingTax)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-lg font-bold">
                <span>{summary.finalTax >= 0 ? 'Amount Due' : 'Refund Due'}</span>
                <span className={summary.finalTax >= 0 ? 'text-red-600' : 'text-green-600'}>
                  {formatCurrency(Math.abs(summary.finalTax))}
                </span>
              </div>
            </div>

            {summary.finalTax < 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                <p className="text-green-800 font-medium">
                  🎉 You are eligible for a refund of {formatCurrency(summary.refundDue || 0)}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Thai Tax Brackets */}
        <Card>
          <CardHeader>
            <CardTitle>Thai Tax Brackets (2024)</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Income Range</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {TAX_BRACKETS.map((bracket, index) => {
                  const isApplicable = summary.netIncome > bracket.min;
                  return (
                    <TableRow key={index} className={isApplicable ? 'bg-blue-50' : ''}>
                      <TableCell className="text-sm">
                        {formatCurrency(bracket.min)} - {bracket.max ? formatCurrency(bracket.max) : 'Above'}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {(bracket.rate * 100).toFixed(0)}%
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Income Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Income Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {taxPlan.incomes.length === 0 ? (
              <p className="text-gray-500 text-sm">No income sources added</p>
            ) : (
              <div className="space-y-3">
                {taxPlan.incomes.map((income) => (
                  <div key={income.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1 mr-2">
                      <p className="font-medium">{income.description}</p>
                      <p className="text-xs text-gray-500">
                        Type {income.type}: {getIncomeTypeDisplayName(income.type).split(' (')[0]}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{formatCurrency(income.amount)}</p>
                      {income.withholdingTax > 0 && (
                        <p className="text-xs text-green-600">
                          WHT: {formatCurrency(income.withholdingTax)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Expense Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Business Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {taxPlan.expenses.length === 0 ? (
              <p className="text-gray-500 text-sm">No expenses calculated</p>
            ) : (
              <div className="space-y-3">
                {taxPlan.expenses.map((expense) => (
                  <div key={expense.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1 mr-2">
                      <p className="font-medium">{expense.description}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Badge
                          variant={expense.isManualOverride ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {expense.isManualOverride ? 'Manual' : 'Auto'}
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

        {/* Deduction Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Tax Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            {taxPlan.deductions.length === 0 ? (
              <p className="text-gray-500 text-sm">No deductions added</p>
            ) : (
              <div className="space-y-3">
                {taxPlan.deductions.map((deduction) => (
                  <div key={deduction.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1 mr-2">
                      <p className="font-medium">{deduction.name}</p>
                      <Badge
                        variant={deduction.isCustom ? "default" : "secondary"}
                        className="text-xs mt-1"
                      >
                        {deduction.isCustom ? 'Custom' : 'Standard'}
                      </Badge>
                    </div>
                    <p className="font-medium">{formatCurrency(deduction.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
