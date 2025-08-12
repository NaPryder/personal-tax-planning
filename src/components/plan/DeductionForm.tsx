'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { generateId, loadStandardDeductions } from '@/lib/localStorage';
import { formatCurrency } from '@/lib/taxCalculation';
import { DeductionItem, StandardDeduction, TaxPlan } from '@/types/tax';
import { Check, Edit, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';

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
    category: 'other'
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
      alert('This deduction has already been added.');
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

    setCustomForm({ name: '', amount: '', category: 'other' });
    setIsCustomDialogOpen(false);
  };

  const handleEditDeduction = (deduction: DeductionItem) => {
    setEditingDeduction(deduction);
    if (deduction.isCustom) {
      setCustomForm({
        name: deduction.name,
        amount: deduction.amount.toString(),
        category: deduction.category || 'other'
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
    setCustomForm({ name: '', amount: '', category: 'other' });
  };

  const totalDeductions = taxPlan.deductions.reduce((sum, deduction) => sum + deduction.amount, 0);
  // const totalIncome = taxPlan.incomes.reduce((sum, income) => sum + income.amount, 0);

  // Group deductions by category
  const groupedDeductions = taxPlan.deductions.reduce((acc, deduction) => {
    const category = deduction.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(deduction);
    return acc;
  }, {} as Record<string, DeductionItem[]>);

  const categoryNames: Record<string, string> = {
    personal: 'Personal Allowances',
    spouse: 'Spouse Allowances',
    child: 'Child Allowances',
    parent: 'Parent Allowances',
    insurance: 'Insurance & Social Security',
    donation: 'Donations',
    other: 'Other Deductions'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Total Deductions: <span className="font-medium">{formatCurrency(totalDeductions)}</span>
        </p>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsDialogOpen(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Standard
          </Button>
          <Button
            onClick={() => setIsCustomDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Custom
          </Button>
        </div>
      </div>

      {taxPlan.deductions.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p className="mb-2">No deductions added yet.</p>
          <p className="text-sm">Add standard deductions or create custom ones to reduce your taxable income.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedDeductions).map(([category, deductions]) => (
            <Card key={category}>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">{categoryNames[category]}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {deductions.map((deduction) => (
                    <div key={deduction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{deduction.name}</span>
                          <Badge variant={deduction.isCustom ? "default" : "secondary"} className="text-xs">
                            {deduction.isCustom ? 'Custom' : 'Standard'}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          {formatCurrency(deduction.amount)}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditDeduction(deduction)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteDeduction(deduction.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Standard Deduction Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleCloseDialogs}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingDeduction ? 'Edit Standard Deduction' : 'Add Standard Deduction'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Deduction Type</Label>
              <Select
                value={selectedStandardId}
                onValueChange={setSelectedStandardId}
                disabled={!!editingDeduction}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a standard deduction" />
                </SelectTrigger>
                <SelectContent>
                  {standardDeductions.map((deduction) => {
                    const alreadyAdded = taxPlan.deductions.some(d =>
                      !d.isCustom && d.name === deduction.name && d.id !== editingDeduction?.id
                    );
                    return (
                      <SelectItem
                        key={deduction.id}
                        value={deduction.id}
                        disabled={alreadyAdded}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span>{deduction.name}</span>
                          {alreadyAdded && <Check className="w-4 h-4 text-green-600" />}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              {selectedStandardId && (
                <p className="text-xs text-gray-600">
                  {standardDeductions.find(d => d.id === selectedStandardId)?.description}
                  {standardDeductions.find(d => d.id === selectedStandardId)?.maxAmount &&
                    ` (Max: ${formatCurrency(standardDeductions.find(d => d.id === selectedStandardId)!.maxAmount)})`
                  }
                </p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="standard-amount">Amount (THB)</Label>
              <Input
                id="standard-amount"
                type="number"
                min="0"
                step="0.01"
                value={standardAmount}
                onChange={(e) => setStandardAmount(e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialogs}>
              Cancel
            </Button>
            <Button
              onClick={editingDeduction ? handleUpdateDeduction : handleAddStandardDeduction}
              disabled={!selectedStandardId || !standardAmount}
            >
              {editingDeduction ? 'Update' : 'Add'} Deduction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Custom Deduction Dialog */}
      <Dialog open={isCustomDialogOpen} onOpenChange={handleCloseDialogs}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>
              {editingDeduction ? 'Edit Custom Deduction' : 'Add Custom Deduction'}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="custom-name">Deduction Name</Label>
              <Input
                id="custom-name"
                value={customForm.name}
                onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
                placeholder="e.g., Professional License Fee"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="custom-category">Category</Label>
              <Select
                value={customForm.category}
                onValueChange={(value) => setCustomForm({ ...customForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="personal">Personal Allowances</SelectItem>
                  <SelectItem value="insurance">Insurance & Social Security</SelectItem>
                  <SelectItem value="donation">Donations</SelectItem>
                  <SelectItem value="other">Other Deductions</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="custom-amount">Amount (THB)</Label>
              <Input
                id="custom-amount"
                type="number"
                min="0"
                step="0.01"
                value={customForm.amount}
                onChange={(e) => setCustomForm({ ...customForm, amount: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={handleCloseDialogs}>
              Cancel
            </Button>
            <Button
              onClick={editingDeduction ? handleUpdateDeduction : handleAddCustomDeduction}
              disabled={!customForm.name.trim() || !customForm.amount}
            >
              {editingDeduction ? 'Update' : 'Add'} Deduction
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
