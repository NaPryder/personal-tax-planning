import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IncomeForm } from './IncomeForm';
import { ExpenseForm } from './ExpenseForm';
import { DeductionForm } from './DeductionForm';
import { TaxPlan } from '@/types/tax';
import { EditTabsEnum } from '@/types/edit-tabs';

interface EditTabsProps {
  taxPlan: TaxPlan;
  handleUpdatePlan: (updatedPlan: TaxPlan) => void;
}


const EditTabs = ({
  taxPlan,
  handleUpdatePlan,
}: EditTabsProps) => {

  const searchParams = new URLSearchParams(window.location.search);
  const tabParam = searchParams.get('tabs') as EditTabsEnum;
  const defaultTab = tabParam && Object.values(EditTabsEnum).includes(tabParam) ? tabParam : EditTabsEnum.INCOME;

  const handleTabChange = (tab: EditTabsEnum) => {
    searchParams.set('tabs', tab);
    window.history.replaceState({}, '', `${window.location.pathname}?${searchParams}`);
  };

  return (
    <Tabs
      className="space-y-2"
      defaultValue={defaultTab}
      onValueChange={(tab) => handleTabChange(tab as EditTabsEnum)}
    >
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value={EditTabsEnum.INCOME}>
          เงินได้ ({taxPlan.incomes.length})
        </TabsTrigger>
        <TabsTrigger value="expenses">
          ค่าใช้จ่าย ({taxPlan.expenses.length})
        </TabsTrigger>
        <TabsTrigger value="deductions">
          ลดหย่อน ({taxPlan.deductions.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value={EditTabsEnum.INCOME} >
        <Card>
          <CardHeader>
            <CardTitle>แหล่งที่มาของเงินได้</CardTitle>
            <p className="text-sm text-gray-600">
              เพิ่มที่มาของเงินเงินได้ที่ต้องเสียภาษี {" "}
              <a
                href="https://www.rd.go.th/553.html"
                className='underline'
              >
                รายละเอียดประเภทเงินได้ที่ต้องเสียภาษี
              </a>
            </p>
          </CardHeader>
          <CardContent>
            <IncomeForm
              taxPlan={taxPlan}
              onUpdatePlan={handleUpdatePlan}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value={EditTabsEnum.EXPENSES} >
        <Card>
          <CardHeader>
            <CardTitle>ค่าใช้จ่าย</CardTitle>
            <p className="text-sm text-gray-600">
              {/* Expenses are automatically calculated based on income type, but can be manually overridden */}
              ค่าใช้จ่ายจะถูกคำนวณอัตโนมัติตามประเภทเงินได้ แต่สามารถปรับแต่งด้วยตนเองได้
            </p>
          </CardHeader>
          <CardContent>
            <ExpenseForm
              taxPlan={taxPlan}
              onUpdatePlan={handleUpdatePlan}
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value={EditTabsEnum.DEDUCTIONS}>
        <Card>
          <CardHeader>
            <CardTitle>Tax Deductions</CardTitle>
            <p className="text-sm text-gray-600">
              เพิ่มรายการลดหย่อนที่คุณมี
            </p>
          </CardHeader>
          <CardContent>
            <DeductionForm
              taxPlan={taxPlan}
              onUpdatePlan={handleUpdatePlan}
            />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

export default EditTabs
