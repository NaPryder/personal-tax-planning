'use client';

import { Edit, EllipsisIcon, EllipsisVertical, EllipsisVerticalIcon, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IncomeItem, IncomeType } from '@/types/tax';
import { getIncomeTypeDisplayName, formatCurrency } from '@/lib/taxCalculation';
import { Badge, BadgeVariant } from '../ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import ConfirmationDialog from './ConfirmationDialog';
import { useState } from 'react';

interface IncomeTableProps {
  incomes: IncomeItem[];
  onEditIncome: (income: IncomeItem) => void;
  onDeleteIncome: (incomeId: string) => void;
}

export function IncomeTable({
  incomes,
  onEditIncome,
  onDeleteIncome
}: IncomeTableProps) {
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [deletingIncome, setDeletingIncome] = useState<IncomeItem | null>(null);

  if (incomes.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        ยังไม่มีแหล่งรายได้ กดปุ่ม &quot;เพิ่มรายได้&quot; เพื่อเริ่มต้น
      </div>
    );
  }

  return (
    <div className="border rounded-lg ">
      <ConfirmationDialog
        open={isConfirmationDialogOpen}
        onClose={() => setIsConfirmationDialogOpen(false)}
        onConfirm={() => deletingIncome?.id && onDeleteIncome(deletingIncome.id)}
        title={`ยืนยันการลบรายได้ `}
        description={() => deletingIncome?.id && (
          <div className='flex flex-col gap-1'>
            <strong>
              {getIncomeTypeDisplayName(deletingIncome?.type)}
            </strong>
            <p>
              คำอธิบายรายได้: {deletingIncome?.description}
            </p>
            <p>
              รายได้: {formatCurrency(deletingIncome?.amount)}
            </p>
            <p>
              ภาษีหัก ณ ที่จ่าย: {formatCurrency(deletingIncome?.withholdingTax)}
            </p>
          </div>
        )}
      />
      <Table >
        <TableHeader>
          <TableRow>
            <TableHead className='w-4'>ประเภทเงินได้</TableHead>
            <TableHead className="text-right">จำนวนเงิน</TableHead>
            <TableHead className="text-right">ภาษีหัก ณ ที่จ่าย</TableHead>
            <TableHead className="w-10 mx-auto">
              <EllipsisIcon className="w-4 h-4 mx-auto" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {incomes.map((income) => (
            <TableRow
              key={income.id}
              className='cursor-pointer'
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onEditIncome(income);
              }}
            >
              <TableCell className="text-sm">
                <CellIncomeType income={income} />
              </TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(income.amount)}
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(income.withholdingTax)}
              </TableCell>
              <TableCell className='text-center'>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setDeletingIncome(income);
                    setIsConfirmationDialogOpen(true); // open confirmation dialog
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}


const CellIncomeType = ({ income }: {
  income: IncomeItem
}) => {

  let variant: BadgeVariant
  switch (income.type) {
    case IncomeType.EMPLOYMENT: // 40(1)
      variant = "employment";
      break;
    case IncomeType.PROFESSIONAL_FEES: // 40(2)
      variant = "professional_fees";
      break;
    case IncomeType.GOODWILL: // 40(3)
      variant = "goodwill";
      break;
    case IncomeType.INTEREST_DIVIDEND: // 40(4)
      variant = "interest_dividend";
      break;
    case IncomeType.RENTAL_PROPERTY: // 40(5)
      variant = "rental_property";
      break;
    case IncomeType.LIBERAL_PROFESSION: // 40(6)
      variant = "liberal_profession";
      break;
    case IncomeType.CONTRACTS_ADVERTISING: // 40(7)
      variant = "contracts_advertising";
      break;
    case IncomeType.OTHER_INCOME:
      variant = "other";
      break;
    default:
      variant = "default";
      break;
  }

  const displayType = getIncomeTypeDisplayName(income.type)

  return (

    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className='max-w-20 md:max-w-50'>
            <Badge variant={variant as BadgeVariant}>
              Type {income.type}
            </Badge>
            <div className='w-full  truncate'>
              <i className='px-1 text-xs '>{income.description}</i>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className='flex flex-col gap-1'>
            <p>{displayType}</p>
            <hr />
            <p>คำอธิบายรายได้: {income.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </>

  )
}