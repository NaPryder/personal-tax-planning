import { IncomeType, TaxBracket, TaxSummary, TaxPlan } from '../types/tax';

// Thai progressive tax brackets for 2024 (in THB)
export const TAX_BRACKETS: TaxBracket[] = [
  { min: 0, max: 150000, rate: 0 },
  { min: 150001, max: 300000, rate: 0.05 },
  { min: 300001, max: 500000, rate: 0.10 },
  { min: 500001, max: 750000, rate: 0.15 },
  { min: 750001, max: 1000000, rate: 0.20 },
  { min: 1000001, max: 2000000, rate: 0.25 },
  { min: 2000001, max: 5000000, rate: 0.30 },
  { min: 5000001, max: null, rate: 0.35 }
];

// Standard expense percentages by income type (Thai tax law)
export const EXPENSE_PERCENTAGES: Record<IncomeType, number> = {
  [IncomeType.EMPLOYMENT]: 0, // No standard expenses, use actual expenses or standard deduction
  [IncomeType.PROFESSIONAL_FEES]: 0.60, // 60% of income
  [IncomeType.GOODWILL]: 0.60, // 60% of income
  [IncomeType.INTEREST_DIVIDEND]: 0, // No expenses allowed
  [IncomeType.RENTAL_PROPERTY]: 0.30, // 30% of income
  [IncomeType.LIBERAL_PROFESSION]: 0.60, // 60% of income
  [IncomeType.CONTRACTS_ADVERTISING]: 0.60, // 60% of income
  [IncomeType.OTHER_INCOME]: 0.60 // 60% of income
};

// Calculate expenses based on income type and amount
export function calculateStandardExpense(incomeType: IncomeType, incomeAmount: number): number {
  const percentage = EXPENSE_PERCENTAGES[incomeType];
  return Math.round(incomeAmount * percentage);
}

// Calculate progressive tax based on net income
export function calculateProgressiveTax(netIncome: number): number {
  if (netIncome <= 0) return 0;

  let tax = 0;

  for (const bracket of TAX_BRACKETS) {
    if (netIncome <= bracket.min) break;

    const taxableInThisBracket = bracket.max
      ? Math.min(netIncome, bracket.max) - bracket.min + 1
      : netIncome - bracket.min + 1;

    if (taxableInThisBracket > 0) {
      tax += taxableInThisBracket * bracket.rate;
    }
  }

  return Math.round(tax);
}

// Calculate tax summary for a tax plan
export function calculateTaxSummary(taxPlan: TaxPlan): TaxSummary {
  // Calculate totals
  const totalIncome = taxPlan.incomes.reduce((sum, income) => sum + income.amount, 0);
  const totalExpenses = taxPlan.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalDeductions = taxPlan.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  const totalWithholdingTax = taxPlan.incomes.reduce((sum, income) => sum + income.withholdingTax, 0);

  // Calculate net income
  const netIncome = totalIncome - totalExpenses - totalDeductions;

  // Calculate tax due
  const taxDue = calculateProgressiveTax(Math.max(0, netIncome));

  // Calculate final tax (positive = owe money, negative = refund)
  const finalTax = taxDue - totalWithholdingTax;

  return {
    totalIncome,
    totalExpenses,
    totalDeductions,
    netIncome,
    taxDue,
    totalWithholdingTax,
    finalTax,
    refundDue: finalTax < 0 ? Math.abs(finalTax) : undefined
  };
}

// Get income type display name in Thai
export function getIncomeTypeDisplayName(type: IncomeType): string {
  const names: Record<IncomeType, string> = {
    [IncomeType.EMPLOYMENT]: 'เงินเดือน ค่าจ้าง (Employment Income)',
    [IncomeType.PROFESSIONAL_FEES]: 'ค่าตอบแทนวิชาชีพอิสระ (Professional Fees)',
    [IncomeType.GOODWILL]: 'ค่าความนิยม ลิขสิทธิ์ (Goodwill & Copyright)',
    [IncomeType.INTEREST_DIVIDEND]: 'ดอกเบี้ย เงินปันผล (Interest & Dividends)',
    [IncomeType.RENTAL_PROPERTY]: 'ค่าเช่าทรัพย์สิน (Rental Income)',
    [IncomeType.LIBERAL_PROFESSION]: 'อาชีพอิสระ (Liberal Profession)',
    [IncomeType.CONTRACTS_ADVERTISING]: 'งานตามสัญญา โฆษณา (Contract & Advertising)',
    [IncomeType.OTHER_INCOME]: 'รายได้อื่นๆ (Other Income)'
  };

  return names[type] || 'Unknown Income Type';
}

// Format currency in Thai Baht
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Generate expense items based on incomes
export function generateExpensesFromIncomes(incomes: Array<{ id: string; type: IncomeType; amount: number; description: string }>): Array<{
  id: string;
  incomeType: IncomeType;
  description: string;
  amount: number;
  isManualOverride: boolean;
  defaultPercentage: number;
}> {
  return incomes.map(income => ({
    id: `expense-${income.id}`,
    incomeType: income.type,
    description: `Expenses for ${income.description}`,
    amount: calculateStandardExpense(income.type, income.amount),
    isManualOverride: false,
    defaultPercentage: EXPENSE_PERCENTAGES[income.type]
  }));
}
