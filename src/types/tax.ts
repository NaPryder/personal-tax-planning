// Thai Income Tax Categories (8 categories as per Thai tax law)
export enum IncomeType {
  EMPLOYMENT = 1,           // เงินเดือน ค่าจ้าง
  PROFESSIONAL_FEES = 2,    // ค่าจ้างการประกอบอาชีพอิสระ
  GOODWILL = 3,             // ค่าความนิยม ลิขสิทธิ์
  INTEREST_DIVIDEND = 4,    // ดอกเบี้ย เงินปันผล
  RENTAL_PROPERTY = 5,      // ค่าเช่าทรัพย์สิน
  LIBERAL_PROFESSION = 6,   // การประกอบอาชีพอิสระ
  CONTRACTS_ADVERTISING = 7, // งานที่ไม่ต่อเนื่อง โฆษณา
  OTHER_INCOME = 8          // รายได้อื่นๆ
}

export interface IncomeItem {
  id: string;
  type: IncomeType;
  description: string;
  amount: number;
  withholdingTax: number;
}

export interface ExpenseItem {
  id: string;
  incomeType: IncomeType;
  description: string;
  amount: number;
  isManualOverride: boolean;
  defaultPercentage?: number;
}

export interface DeductionItem {
  id: string;
  name: string;
  amount: number;
  isCustom: boolean;
  category?: string;
}

export interface TaxPlan {
  id: string;
  name: string;
  year: number;
  createdAt: Date;
  updatedAt: Date;
  incomes: IncomeItem[];
  expenses: ExpenseItem[];
  deductions: DeductionItem[];
}

export interface TaxSummary {
  totalIncome: number;
  totalExpenses: number;
  totalDeductions: number;
  netIncome: number;
  taxDue: number;
  totalWithholdingTax: number;
  finalTax: number;
  refundDue?: number;
}

export interface TaxBracket {
  min: number;
  max: number | null;
  rate: number;
}

// Standard deductions available in Thai tax system
export interface StandardDeduction {
  id: string;
  name: string;
  maxAmount: number;
  description: string;
  category: 'personal' | 'spouse' | 'child' | 'parent' | 'insurance' | 'donation' | 'other';
}
