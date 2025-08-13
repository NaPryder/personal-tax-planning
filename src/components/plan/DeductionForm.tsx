'use client';

import { Button } from '@/components/ui/button';
import { generateId, loadStandardDeductions } from '@/lib/localStorage';
import { formatCurrency } from '@/lib/taxCalculation';
import { DeductionItem, StandardDeduction, TaxPlan, DeductionCategory } from '@/types/tax';
import { Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DeductionTable } from './DeductionTable';
import { StandardDeductionDialog } from './StandardDeductionDialog';
import { CustomDeductionDialog } from './CustomDeductionDialog';
import { cn } from '@/lib/utils';

interface DeductionFormProps {
  taxPlan: TaxPlan;
  onUpdatePlan: (updatedPlan: TaxPlan) => void;
}

export function DeductionForm({ taxPlan, onUpdatePlan }: DeductionFormProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCustomDialogOpen, setIsCustomDialogOpen] = useState(false);
  const [editingDeduction, setEditingDeduction] = useState<DeductionItem | null>(null);
  const [standardDeductions, setStandardDeductions] = useState<StandardDeduction[]>([]);
  const [selectedStandardId, setSelectedStandardId] = useState<string>('');
  const [standardAmount, setStandardAmount] = useState('');
  const [customForm, setCustomForm] = useState({
    name: '',
    amount: '',
    category: DeductionCategory.OTHER
  });

  useEffect(() => {
    setStandardDeductions(loadStandardDeductions());
  }, []);

  const handleAddStandardDeduction = () => {
    const selectedStandard = standardDeductions.find(d => d.id === selectedStandardId);
    if (!selectedStandard) return;

    const amount = parseFloat(standardAmount) || 0;
    if (amount <= 0) return;

    // Check if this deduction already exists
    const existsAlready = taxPlan.deductions.some(d =>
      !d.isCustom && d.name === selectedStandard.name
    );

    if (existsAlready) {
      alert('ได้เพิ่มค่าลดหย่อนนี้แล้ว');
      return;
    }

    const newDeduction: DeductionItem = {
      id: generateId(),
      name: selectedStandard.name,
      amount,
      isCustom: false,
      category: selectedStandard.category
    };

    onUpdatePlan({
      ...taxPlan,
      deductions: [...taxPlan.deductions, newDeduction]
    });

    setSelectedStandardId('');
    setStandardAmount('');
    setIsDialogOpen(false);
  };

  const handleAddCustomDeduction = () => {
    const amount = parseFloat(customForm.amount) || 0;
    if (!customForm.name.trim() || amount <= 0) return;

    const newDeduction: DeductionItem = {
      id: generateId(),
      name: customForm.name.trim(),
      amount,
      isCustom: true,
      category: customForm.category
    };

    onUpdatePlan({
      ...taxPlan,
      deductions: [...taxPlan.deductions, newDeduction]
    });

    setCustomForm({ name: '', amount: '', category: DeductionCategory.OTHER });
    setIsCustomDialogOpen(false);
  };

  const handleEditDeduction = (deduction: DeductionItem) => {
    setEditingDeduction(deduction);
    if (deduction.isCustom) {
      setCustomForm({
        name: deduction.name,
        amount: deduction.amount.toString(),
        category: deduction.category || DeductionCategory.OTHER
      });
      setIsCustomDialogOpen(true);
    } else {
      const standard = standardDeductions.find(s => s.name === deduction.name);
      if (standard) {
        setSelectedStandardId(standard.id);
        setStandardAmount(deduction.amount.toString());
        setIsDialogOpen(true);
      }
    }
  };

  const handleUpdateDeduction = () => {
    if (!editingDeduction) return;

    let updatedDeduction: DeductionItem;

    if (editingDeduction.isCustom) {
      const amount = parseFloat(customForm.amount) || 0;
      if (!customForm.name.trim() || amount <= 0) return;

      updatedDeduction = {
        ...editingDeduction,
        name: customForm.name.trim(),
        amount,
        category: customForm.category
      };
    } else {
      const amount = parseFloat(standardAmount) || 0;
      if (amount <= 0) return;

      updatedDeduction = {
        ...editingDeduction,
        amount
      };
    }

    const updatedDeductions = taxPlan.deductions.map(d =>
      d.id === editingDeduction.id ? updatedDeduction : d
    );

    onUpdatePlan({
      ...taxPlan,
      deductions: updatedDeductions
    });

    handleCloseDialogs();
  };

  const handleDeleteDeduction = (deductionId: string) => {
    const updatedDeductions = taxPlan.deductions.filter(d => d.id !== deductionId);
    onUpdatePlan({
      ...taxPlan,
      deductions: updatedDeductions
    });
  };

  const handleCloseDialogs = () => {
    setIsDialogOpen(false);
    setIsCustomDialogOpen(false);
    setEditingDeduction(null);
    setSelectedStandardId('');
    setStandardAmount('');
    setCustomForm({ name: '', amount: '', category: DeductionCategory.OTHER });
  };

  const totalDeductions = taxPlan.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);

  return (
    <div className="space-y-4">
      <div className={cn(
        "flex flex-col md:flex-row gap-2",
        "justify-start md:justify-between",
        "items-start md:items-center"
      )}>
        <p className="text-sm text-gray-600">
          รวมค่าลดหย่อน: <span className="font-medium">{formatCurrency(totalDeductions)}</span>
        </p>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            onClick={() => setIsDialogOpen(true)}
            className="flex items-center gap-1 flex-1/2 md:flex-auto"
          >
            <Plus className="w-4 h-4" />
            ลดหย่อนปกติ
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsCustomDialogOpen(true)}
            className="flex items-center gap-1 flex-1/2 md:flex-auto"
          >
            <Plus className="w-4 h-4" />
            ลดหย่อนเพิ่มเติม
          </Button>
        </div>
      </div>

      <DeductionTable
        deductions={taxPlan.deductions}
        onEdit={handleEditDeduction}
        onDelete={handleDeleteDeduction}
      />

      <StandardDeductionDialog
        open={isDialogOpen}
        onClose={handleCloseDialogs}
        onAdd={handleAddStandardDeduction}
        onUpdate={handleUpdateDeduction}
        standardDeductions={standardDeductions}
        taxPlan={taxPlan}
        selectedStandardId={selectedStandardId}
        setSelectedStandardId={setSelectedStandardId}
        standardAmount={standardAmount}
        setStandardAmount={setStandardAmount}
        editingDeduction={editingDeduction}
      />

      <CustomDeductionDialog
        open={isCustomDialogOpen}
        onClose={handleCloseDialogs}
        onAdd={handleAddCustomDeduction}
        onUpdate={handleUpdateDeduction}
        customForm={customForm}
        setCustomForm={setCustomForm}
        editingDeduction={editingDeduction}
      />
    </div>
  );
}
