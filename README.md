# 🇹🇭 Thai Personal Income Tax Planning

A comprehensive web application for planning and calculating personal income tax in Thailand. Built with Next.js 15, TypeScript, and Tailwind CSS.

## ✨ Features

### 📊 Tax Plan Management
- Create and manage multiple tax plans
- Save plans locally using localStorage
- Edit and delete tax plans with confirmation dialogs

### 💰 Income Tracking
- Support for all 8 Thai income categories (ประเภทเงินได้ 8 ประเภท):
  1. เงินเดือน ค่าจ้าง (Employment Income)
  2. ค่าตอบแทนวิชาชีพอิสระ (Professional Fees)
  3. ค่าความนิยม ลิขสิทธิ์ (Goodwill & Copyright)
  4. ดอกเบี้ย เงินปันผล (Interest & Dividends)
  5. ค่าเช่าทรัพย์สิน (Rental Income)
  6. อาชีพอิสระ (Liberal Profession)
  7. งานตามสัญญา โฆษณา (Contract & Advertising)
  8. รายได้อื่นๆ (Other Income)
- Track withholding tax for each income source
- Add multiple income sources per plan

### 🧾 Expense Calculation
- Automatic expense calculation based on Thai tax law percentages
- Manual override option for custom expense amounts
- Visual indicators for auto vs manual calculations
- Reset to default functionality

### 🎯 Tax Deductions
- Standard deductions based on Thai tax law:
  - Personal allowance (ค่าลดหย่อนส่วนตัว)
  - Spouse allowance (ค่าลดหย่อนคู่สมรส)
  - Child allowance (ค่าลดหย่อนบุตร)
  - Parent allowance (ค่าลดหย่อนบิดามารดา)
  - Insurance premiums (ประกัน)
  - Donations (เงินบริจาค)
  - Investment funds (RMF/LTF)
- Custom deductions with categories
- Maximum limits enforcement

### 📈 Tax Calculation
- Accurate Thai progressive tax calculation (2024 rates)
- Real-time tax summary updates
- Final tax calculation (amount due or refund)
- Detailed breakdown view

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **State Management**: React useState/useEffect
- **Data Persistence**: localStorage
- **Package Manager**: pnpm

## 📁 Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (dashboard)/             # Dashboard page
│   ├── plan/[id]/               # Plan editing pages
│   │   ├── page.tsx             # Edit plan page
│   │   └── summary/             # Tax summary page
│   ├── globals.css              # Global styles
│   └── layout.tsx               # Root layout
├── components/                   # Reusable components
│   ├── ui/                      # shadcn/ui components
│   ├── plan/                    # Plan-specific components
│   │   ├── IncomeForm.tsx       # Income management
│   │   ├── IncomeTable.tsx      # Income display table
│   │   ├── IncomeDialog.tsx     # Income add/edit dialog
│   │   └── ...                  # Other plan components
│   ├── CreatePlanDialog.tsx     # New plan creation
│   ├── ExpenseForm.tsx          # Expense management
│   ├── ExpenseTable.tsx         # Expense display
│   ├── ExpenseEditDialog.tsx    # Expense editing
│   ├── DeductionForm.tsx        # Deduction management
│   └── SummaryCard.tsx          # Summary display card
├── lib/                         # Utility functions
│   ├── taxCalculation.ts        # Tax calculation logic
│   ├── localStorage.ts          # Data persistence
│   └── utils.ts                 # General utilities
└── types/                       # TypeScript definitions
    └── tax.ts                   # Tax-related types
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/NaPryder/personal-tax-planning.git
cd personal-tax-planning
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
pnpm build
pnpm start
```

## 💡 Usage

1. **Create a Tax Plan**: Click "New Tax Plan" and enter a name and tax year
2. **Add Income Sources**: Use the Income tab to add your various income sources
3. **Review Expenses**: Check auto-calculated expenses or override manually
4. **Add Deductions**: Select standard deductions or add custom ones
5. **View Summary**: See your complete tax calculation and final amount due/refund

## 🎯 Key Features in Detail

### Thai Tax Law Compliance
- Implements current Thai progressive tax rates (2024)
- Follows official expense calculation percentages by income type
- Includes all standard deductions with proper limits
- Accurate withholding tax calculations

### User Experience
- Intuitive tabbed interface for data entry
- Real-time calculations and updates
- Responsive design for mobile and desktop
- Clean, professional UI with shadcn/ui components

### Data Management
- Local storage persistence (no backend required)
- Export/import functionality (future feature)
- Multiple tax plan support
- Data validation and error handling

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Thai Revenue Department for tax law reference
- shadcn/ui for the excellent component library
- Next.js team for the amazing framework

---

**Note**: This application is for educational and planning purposes only. Always consult with a qualified tax professional for official tax advice and compliance.
