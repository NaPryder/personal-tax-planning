'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/taxCalculation';
import { DeductionItem, DeductionCategory } from '@/types/tax';
import { Edit, Trash2 } from 'lucide-react';

interface DeductionTableProps {
  deductions: DeductionItem[];
  onEdit: (deduction: DeductionItem) => void;
  onDelete: (deductionId: string) => void;
}

const categoryNames: Record<DeductionCategory, string> = {
  [DeductionCategory.PERSONAL]: 'ค่าลดหย่อนส่วนตัว',
  [DeductionCategory.SPOUSE]: 'ค่าลดหย่อนคู่สมรส',
  [DeductionCategory.CHILD]: 'ค่าลดหย่อนบุตร',
  [DeductionCategory.PARENT]: 'ค่าลดหย่อนบิดามารดา',
  [DeductionCategory.INSURANCE]: 'ประกันภัย และประกันสังคม',
  [DeductionCategory.DONATION]: 'เงินบริจาค',
  [DeductionCategory.OTHER]: 'ค่าลดหย่อนอื่นๆ'
};

export function DeductionTable({ deductions, onEdit, onDelete }: DeductionTableProps) {
  if (deductions.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="mb-2">ยังไม่มีรายการลดหย่อน</p>
        <p className="text-sm">เพิ่มค่าลดหย่อนมาตรฐานหรือสร้างแบบกำหนดเองเพื่อลดรายได้ที่ต้องเสียภาษี</p>
      </div>
    );
  }

  // Group deductions by category
  const groupedDeductions = deductions.reduce((acc, deduction) => {
    const category = deduction.category || DeductionCategory.OTHER;
    if (!acc[category]) acc[category] = [];
    acc[category].push(deduction);
    return acc;
  }, {} as Record<DeductionCategory, DeductionItem[]>);

  return (
    <div className="space-y-4">
      {Object.entries(groupedDeductions).map(([category, categoryDeductions]) => (
        <Card key={category}>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">{categoryNames[category as DeductionCategory]}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {categoryDeductions.map((deduction) => (
                <div key={deduction.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{deduction.name}</span>
                      <Badge variant={deduction.isCustom ? "default" : "secondary"} className="text-xs">
                        {deduction.isCustom ? 'กำหนดเอง' : 'มาตรฐาน'}
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
                      onClick={() => onEdit(deduction)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(deduction.id)}
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
  );
}
