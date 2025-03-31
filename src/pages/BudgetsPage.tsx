
import React, { useState } from 'react';
import { useFinance, Budget, Category } from '@/contexts/FinanceContext';
import { formatCurrency, getCategoryName, getBgColorFromPercentage } from '@/utils/formatters';
import { PlusIcon, EditIcon, ChevronDownIcon, TrashIcon, SaveIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BudgetsPage: React.FC = () => {
  const { budgets, addBudget, updateBudget, deleteBudget, getCategoryTotal } = useFinance();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [expandedBudgetId, setExpandedBudgetId] = useState<string | null>(null);
  
  // Form state
  const [category, setCategory] = useState<Category>('food');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly'>('monthly');
  
  const categories: Category[] = [
    'food', 
    'transport', 
    'utilities', 
    'entertainment', 
    'shopping', 
    'health', 
    'other'
  ];
  
  const periods = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'yearly', label: 'Yearly' }
  ];
  
  const handleOpenDialog = (budget?: Budget) => {
    if (budget) {
      setEditingBudget(budget);
      setCategory(budget.category);
      setAmount(budget.amount.toString());
      setPeriod(budget.period);
    } else {
      setEditingBudget(null);
      setCategory('food');
      setAmount('');
      setPeriod('monthly');
    }
    setIsDialogOpen(true);
  };
  
  const handleSaveBudget = () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    
    if (editingBudget) {
      updateBudget(editingBudget.id, {
        category,
        amount: parseFloat(amount),
        period
      });
    } else {
      addBudget({
        category,
        amount: parseFloat(amount),
        period
      });
    }
    
    setIsDialogOpen(false);
  };
  
  const toggleExpand = (id: string) => {
    setExpandedBudgetId(expandedBudgetId === id ? null : id);
  };
  
  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budgets</h1>
        <Button 
          onClick={() => handleOpenDialog()} 
          size="sm" 
          className="rounded-full h-10 w-10 p-0"
        >
          <PlusIcon className="h-5 w-5" />
        </Button>
      </div>
      
      {budgets.length > 0 ? (
        <div className="space-y-4">
          {budgets.map(budget => {
            const spent = getCategoryTotal(budget.category);
            const percentage = Math.min(100, Math.round((spent / budget.amount) * 100));
            
            return (
              <div key={budget.id} className="bg-white rounded-lg shadow">
                <div 
                  className="p-4 cursor-pointer"
                  onClick={() => toggleExpand(budget.id)}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold">{getCategoryName(budget.category)}</h3>
                      <p className="text-xs text-spendwell-text-secondary capitalize">{budget.period} budget</p>
                    </div>
                    <ChevronDownIcon 
                      className={`h-5 w-5 transition-transform ${expandedBudgetId === budget.id ? 'transform rotate-180' : ''}`} 
                    />
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm mb-1">
                      <span>{formatCurrency(spent)} of {formatCurrency(budget.amount)}</span>
                      <span className={percentage >= 85 ? 'text-spendwell-danger' : ''}>
                        {percentage}%
                      </span>
                    </div>
                    <Progress 
                      value={percentage} 
                      className="h-2" 
                      indicatorClassName={getBgColorFromPercentage(percentage)}
                    />
                  </div>
                </div>
                
                {expandedBudgetId === budget.id && (
                  <div className="px-4 pb-4 pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-spendwell-text-secondary">Remaining</p>
                        <p className={`font-semibold ${spent > budget.amount ? 'text-spendwell-danger' : 'text-spendwell-success'}`}>
                          {formatCurrency(budget.amount - spent)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleOpenDialog(budget)}
                        >
                          <EditIcon className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteBudget(budget.id)}
                        >
                          <TrashIcon className="h-4 w-4 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-spendwell-text-secondary mb-4">You haven't set up any budgets yet</p>
          <Button onClick={() => handleOpenDialog()}>
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Your First Budget
          </Button>
        </div>
      )}
      
      {/* Budget Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBudget ? 'Edit Budget' : 'Create New Budget'}</DialogTitle>
            <DialogDescription>
              Set up a budget to help track and manage your spending
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value) => setCategory(value as Category)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {getCategoryName(cat)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="amount">Budget Amount</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-spendwell-text-secondary">$</span>
                </div>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  className="pl-8"
                  min="0.01"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="period">Budget Period</Label>
              <Select 
                value={period} 
                onValueChange={(value) => setPeriod(value as typeof period)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <Button onClick={handleSaveBudget} className="w-full">
              <SaveIcon className="h-4 w-4 mr-2" />
              {editingBudget ? 'Update Budget' : 'Create Budget'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetsPage;
