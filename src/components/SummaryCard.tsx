'use client';

import { Card, CardContent } from '@/components/ui/card';

interface SummaryCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  description?: string;
  className?: string;
}

export function SummaryCard({
  title,
  value,
  icon,
  description,
  className = ""
}: SummaryCardProps) {
  return (
    <Card className={`${className}`}>
      <CardContent
      // className="pt-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {description && (
              <p className="text-sm text-gray-500 mt-1">{description}</p>
            )}
          </div>
          {icon && (
            <div className="ml-4 flex-shrink-0">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
