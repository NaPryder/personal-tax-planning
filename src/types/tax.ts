// Thai Income Tax Categories (8 categories as per Thai tax law)
export enum IncomeType {
  EMPLOYMENT = 1,           // เงินเดือน ค่าจ้าง
  PROFESSIONAL_FEES = 2,    // ค่าจ้างการประกอบอาชีพอิสระ เงินได้เนื่องจากหน้าที่หรือตำแหน่งงานที่ทำ
  GOODWILL = 3,             // ค่าความนิยม ลิขสิทธิ์ ค่าแห่งลิขสิทธิ์หรือสิทธิอย่างอื่น เงินปี หรือเงินได้ที่มีลักษณะ เป็นเงินรายปีอันได้มาจากพินัยกรรม นิติกรรมอย่างอื่น หรือคำพิพากษาของศาล
  INTEREST_DIVIDEND = 4,    // ดอกเบี้ย เงินปันผล
  RENTAL_PROPERTY = 5,      // ค่าเช่าทรัพย์สิน
  LIBERAL_PROFESSION = 6,   // การประกอบอาชีพอิสระ คือวิชากฎหมาย การประกอบโรคศิลป วิศวกรรม สถาปัตยกรรม การบัญชี ประณีตศิลปกรรม หรือวิชาชีพอื่นซึ่งจะได้มีพระราชกฤษฎีกากำหนดชนิดไว้
  CONTRACTS_ADVERTISING = 7, // งานที่ไม่ต่อเนื่อง โฆษณา เงินได้จากการรับเหมาที่ผู้รับเหมาต้องลงทุนด้วยการจัดหาสัมภาระ ในส่วนสำคัญนอกจากเครื่องมือ 
  OTHER_INCOME = 8          // เงินได้จากการธุรกิจ การพาณิชย์ การเกษตร การอุตสาหกรรม การขนส่ง การขายอสังหาริมทรัพย์ หรือการอื่นนอกจากที่ระบุไว้ในประเภทที่ 1 ถึงประเภทที่ 7 แล้ว
}

// Thai Tax Deduction Categories
export enum DeductionCategory {
  PERSONAL = 'personal',           // ค่าลดหย่อนส่วนตัว
  SPOUSE = 'spouse',              // ค่าลดหย่อนคู่สมรส
  CHILD = 'child',                // ค่าลดหย่อนบุตร
  PARENT = 'parent',              // ค่าลดหย่อนบิดามารดา
  INSURANCE = 'insurance',        // ประกันภัย และประกันสังคม
  DONATION = 'donation',          // เงินบริจาค
  OTHER = 'other'                 // ค่าลดหย่อนอื่นๆ
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
  category: DeductionCategory;
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
  category: DeductionCategory;
}
