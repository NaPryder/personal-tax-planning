'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatCurrency, TAX_BRACKETS } from '@/lib/taxCalculation';
import { TaxBracket, TaxSummary } from '@/types/tax';

interface TaxBracketsCardProps {
  summary: TaxSummary;
}

export function TaxBracketsCard({ summary }: TaxBracketsCardProps) {
  // Helper function to calculate tax for each bracket
  const calculateTaxForBracket = (bracket: TaxBracket, netIncome: number) => {
    if (netIncome <= bracket.min) return 0;

    const taxableInThisBracket = bracket.max
      ? Math.min(netIncome, bracket.max) - bracket.min + 1
      : netIncome - bracket.min + 1;

    return taxableInThisBracket > 0 ? Math.round(taxableInThisBracket * bracket.rate) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>อัตราภาษีเงินได้บุคคลธรรมดา (พ.ศ. 2567)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ช่วงรายได้</TableHead>
              <TableHead className="text-right">อัตรา</TableHead>
              <TableHead className="text-right">ภาษีที่ต้องเสีย</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {TAX_BRACKETS.map((bracket, index) => {
              const isApplicable = summary.netIncome > bracket.min;
              const taxForThisBracket = calculateTaxForBracket(bracket, summary.netIncome);

              return (
                <TableRow key={index} className={isApplicable ? 'bg-blue-50' : ''}>
                  <TableCell className="text-sm">
                    {
                      formatCurrency(
                        bracket.min,
                        {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                        }
                      )
                    } - {
                      bracket.max
                        ? formatCurrency(
                          bracket.max,
                          {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                          }
                        )
                        : 'ขึ้นไป'
                    }
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {(bracket.rate * 100).toFixed(0)}%
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {isApplicable ? (
                      <span className={taxForThisBracket > 0 ? 'text-red-600' : 'text-gray-500'}>
                        {formatCurrency(taxForThisBracket)}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
