'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { TaxPlan } from '@/types/tax';
import { loadTaxPlans, deleteTaxPlan, createNewTaxPlan, saveTaxPlan } from '@/lib/localStorage';
import { calculateTaxSummary, formatCurrency } from '@/lib/taxCalculation';
import { CreatePlanDialog } from '@/components/CreatePlanDialog';

export default function Dashboard() {
  const [taxPlans, setTaxPlans] = useState<TaxPlan[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  useEffect(() => {
    setTaxPlans(loadTaxPlans());
  }, []);

  const handleCreatePlan = (name: string, year: number) => {
    const newPlan = createNewTaxPlan(name, year);
    saveTaxPlan(newPlan);
    setTaxPlans(loadTaxPlans());
    setIsCreateDialogOpen(false);
  };

  const handleDeletePlan = (planId: string) => {
    deleteTaxPlan(planId);
    setTaxPlans(loadTaxPlans());
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Thai Tax Planning</h1>
          <p className="text-gray-600 mt-2">Plan and calculate your personal income tax for Thailand</p>
        </div>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Tax Plan
        </Button>
      </div>

      {taxPlans.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent className="pt-6">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No tax plans yet</h3>
            <p className="text-gray-600 mb-6">Create your first tax plan to start calculating your Thai income tax</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create Your First Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {taxPlans.map((plan) => {
            const summary = calculateTaxSummary(plan);
            return (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{plan.name}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        Tax Year {plan.year}
                      </Badge>
                    </div>
                    <div className="flex gap-1">
                      <Button asChild variant="ghost" size="sm">
                        <Link href={`/plan/${plan.id}`}>
                          <Edit className="w-4 h-4" />
                        </Link>
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Tax Plan</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete &quot;{plan.name}&quot;? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeletePlan(plan.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Total Income</span>
                      <p className="font-medium">{formatCurrency(summary.totalIncome)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Net Income</span>
                      <p className="font-medium">{formatCurrency(summary.netIncome)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Tax Due</span>
                      <p className="font-medium">{formatCurrency(summary.taxDue)}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">
                        {summary.finalTax >= 0 ? 'Amount Due' : 'Refund'}
                      </span>
                      <p className={`font-medium ${summary.finalTax >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                        {formatCurrency(Math.abs(summary.finalTax))}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button asChild variant="outline" size="sm" className="flex-1">
                      <Link href={`/plan/${plan.id}`}>
                        Edit Plan
                      </Link>
                    </Button>
                    <Button asChild variant="default" size="sm" className="flex-1">
                      <Link href={`/plan/${plan.id}/summary`}>
                        View Summary
                      </Link>
                    </Button>
                  </div>

                  <div className="text-xs text-gray-500 pt-2 border-t">
                    Updated {plan.updatedAt.toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <CreatePlanDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreatePlan={handleCreatePlan}
      />
    </div>
  );
}
