import { TaxPlan, StandardDeduction } from '../types/tax';

const TAX_PLANS_KEY = 'thai-tax-plans';
const STANDARD_DEDUCTIONS_KEY = 'thai-standard-deductions';

// Default standard deductions for Thai tax system
const DEFAULT_STANDARD_DEDUCTIONS: StandardDeduction[] = [
  {
    id: 'personal-deduction',
    name: 'ค่าลดหย่อนส่วนตัว',
    maxAmount: 60000,
    description: 'ค่าลดหย่อนส่วนตัวมาตรฐานสำหรับผู้เสียภาษีทุกคน',
    category: 'personal'
  },
  {
    id: 'spouse-deduction',
    name: 'ค่าลดหย่อนคู่สมรส',
    maxAmount: 60000,
    description: 'ค่าลดหย่อนสำหรับคู่สมรสที่ไม่มีรายได้',
    category: 'spouse'
  },
  {
    id: 'child-deduction',
    name: 'ค่าลดหย่อนบุตร',
    maxAmount: 30000,
    description: 'ต่อบุตรที่อายุต่ำกว่า 25 ปี',
    category: 'child'
  },
  {
    id: 'parent-deduction',
    name: 'ค่าลดหย่อนบิดามารดา',
    maxAmount: 30000,
    description: 'ต่อบิดามารดาที่อายุเกิน 60 ปี',
    category: 'parent'
  },
  {
    id: 'social-security',
    name: 'ประกันสังคม',
    maxAmount: 9000,
    description: 'เงินสมทบประกันสังคม',
    category: 'insurance'
  },
  {
    id: 'life-insurance',
    name: 'ประกันชีวิต',
    maxAmount: 100000,
    description: 'รวมเบี้ยประกันชีวิต ตลอดทั้งปี',
    category: 'insurance'
  },
  {
    id: 'health-insurance',
    name: 'ประกันสุขภาพ',
    maxAmount: 25000,
    description: 'รวมเบี้ยประกันสุขภาพ ตลอดทั้งปี',
    category: 'insurance'
  },
  {
    id: 'donation-education',
    name: 'บริจาคการศึกษา',
    maxAmount: 0, // No limit, but max 2x normal donation
    description: 'เงินบริจาคให้สถาบันการศึกษา',
    category: 'donation'
  },
  {
    id: 'donation-general',
    name: 'บริจาคทั่วไป',
    maxAmount: 0, // Calculated as % of income
    description: 'เงินบริจาคทั่วไป (สูงสุด 10% ของรายได้)',
    category: 'donation'
  },
  {
    id: 'rmf-ltf',
    name: 'กองทุน RMF/LTF/SSF',
    maxAmount: 500000,
    description: 'การลงทุนในกองทุนรวมเพื่อการเกษียณและกองทุนรวมหุ้นระยะยาว',
    category: 'other'
  },
  {
    id: 'home-mortgage',
    name: 'ดอกเบี้ยบ้าน',
    maxAmount: 100000,
    description: 'ดอกเบี้ยเงินกู้ซื้อบ้าน',
    category: 'other'
  }
];

// Save tax plans to localStorage
export function saveTaxPlans(taxPlans: TaxPlan[]): void {
  try {
    const serializedPlans = JSON.stringify(taxPlans, (key, value) => {
      // Convert Date objects to ISO strings for serialization
      if (key === 'createdAt' || key === 'updatedAt') {
        return value instanceof Date ? value.toISOString() : value;
      }
      return value;
    });
    localStorage.setItem(TAX_PLANS_KEY, serializedPlans);
  } catch (error) {
    console.error('Failed to save tax plans:', error);
  }
}

// Load tax plans from localStorage
export function loadTaxPlans(): TaxPlan[] {
  try {
    const stored = localStorage.getItem(TAX_PLANS_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    // Convert ISO strings back to Date objects
    return parsed.map((plan: TaxPlan) => ({
      ...plan,
      createdAt: new Date(plan.createdAt),
      updatedAt: new Date(plan.updatedAt)
    }));
  } catch (error) {
    console.error('Failed to load tax plans:', error);
    return [];
  }
}

// Save a single tax plan (create or update)
export function saveTaxPlan(taxPlan: TaxPlan): void {
  const taxPlans = loadTaxPlans();
  const existingIndex = taxPlans.findIndex(plan => plan.id === taxPlan.id);

  const updatedPlan = {
    ...taxPlan,
    updatedAt: new Date()
  };

  if (existingIndex >= 0) {
    taxPlans[existingIndex] = updatedPlan;
  } else {
    taxPlans.push(updatedPlan);
  }

  saveTaxPlans(taxPlans);
}

// Delete a tax plan
export function deleteTaxPlan(planId: string): void {
  const taxPlans = loadTaxPlans();
  const filteredPlans = taxPlans.filter(plan => plan.id !== planId);
  saveTaxPlans(filteredPlans);
}

// Get a single tax plan by ID
export function getTaxPlan(planId: string): TaxPlan | null {
  const taxPlans = loadTaxPlans();
  return taxPlans.find(plan => plan.id === planId) || null;
}

// Create a new empty tax plan
export function createNewTaxPlan(name: string, year: number = new Date().getFullYear()): TaxPlan {
  return {
    id: generateId(),
    name,
    year,
    createdAt: new Date(),
    updatedAt: new Date(),
    incomes: [],
    expenses: [],
    deductions: []
  };
}

// Generate a unique ID
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
}

// Load standard deductions
export function loadStandardDeductions(): StandardDeduction[] {
  try {
    const stored = localStorage.getItem(STANDARD_DEDUCTIONS_KEY);
    if (!stored) {
      // Initialize with default deductions if none exist
      saveStandardDeductions(DEFAULT_STANDARD_DEDUCTIONS);
      return DEFAULT_STANDARD_DEDUCTIONS;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Failed to load standard deductions:', error);
    return DEFAULT_STANDARD_DEDUCTIONS;
  }
}

// Save standard deductions
export function saveStandardDeductions(deductions: StandardDeduction[]): void {
  try {
    localStorage.setItem(STANDARD_DEDUCTIONS_KEY, JSON.stringify(deductions));
  } catch (error) {
    console.error('Failed to save standard deductions:', error);
  }
}

// Check if localStorage is available
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__localStorage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}
