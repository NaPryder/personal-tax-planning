import { TaxPlan } from '@/types/tax';
import React from 'react';
import { Badge } from '../ui/badge';


interface PlanHeaderProps {
  taxPlan: TaxPlan;
  headerName: string
  renderActions?: () => React.ReactNode
}

const PlanHeader = ({
  taxPlan,
  headerName,
  renderActions,
}: PlanHeaderProps) => {

  return (
    <div className="flex justify-between items-center">

      <div className='flex flex-col gap-2'>
        <Badge variant="warning" >
          ปีภาษี {taxPlan.year}
        </Badge>

        <h1 className="text-3xl font-bold text-gray-900">
          {headerName}
        </h1>
        <p
          className="text-sm text-gray-500 italic"
        >
          แก้ไขล่าสุด {
            taxPlan.updatedAt.toLocaleDateString('th-TH', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })
          }น.
        </p>
      </div>
      {renderActions && renderActions()}

    </div>
  )
}

export default PlanHeader
