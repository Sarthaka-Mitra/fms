
import React from 'react';
import { useFinance } from '@/contexts/FinanceContext';
import { formatCurrency } from '@/utils/formatters';
import { ArrowUpCircleIcon, ArrowDownCircleIcon, ArrowRightCircleIcon, TrendingUpIcon, CalendarIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Progress } from '@/components/ui/progress';

const Dashboard: React.FC = () => {
  const { 
    transactions, 
    getTotalExpenses, 
    getTotalIncome, 
    getNetIncome,
    budgets,
    getBudgetProgress,
    getCategoryTotal
  } = useFinance();
  
  // Get recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-6 pb-20">
      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-spendwell-text-primary">Hello, John</h1>
        <p className="text-spendwell-text-secondary">Here's your financial summary</p>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-spendwell-text-secondary">Income</p>
              <p className="text-xl font-bold text-spendwell-text-primary">{formatCurrency(getTotalIncome())}</p>
            </div>
            <ArrowUpCircleIcon className="h-8 w-8 text-spendwell-success" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-spendwell-text-secondary">Expenses</p>
              <p className="text-xl font-bold text-spendwell-text-primary">{formatCurrency(getTotalExpenses())}</p>
            </div>
            <ArrowDownCircleIcon className="h-8 w-8 text-spendwell-danger" />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-spendwell-text-secondary">Balance</p>
              <p className="text-xl font-bold text-spendwell-text-primary">{formatCurrency(getNetIncome())}</p>
            </div>
            <ArrowRightCircleIcon className="h-8 w-8 text-spendwell-primary" />
          </div>
        </div>
      </div>
      
      {/* Budget section */}
      <div className="bg-white rounded-lg p-5 shadow card-shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Budget Overview</h2>
          <Link to="/budgets" className="text-spendwell-primary text-sm">View all</Link>
        </div>
        
        <div className="space-y-4">
          {budgets.slice(0, 3).map(budget => {
            const progress = getBudgetProgress(budget.id);
            const spent = getCategoryTotal(budget.category);
            
            return (
              <div key={budget.id} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{budget.category.charAt(0).toUpperCase() + budget.category.slice(1)}</span>
                  <span>
                    {formatCurrency(spent)} <span className="text-spendwell-text-tertiary">/ {formatCurrency(budget.amount)}</span>
                  </span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Recent transactions */}
      <div className="bg-white rounded-lg p-5 shadow card-shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Transactions</h2>
          <Link to="/transactions" className="text-spendwell-primary text-sm">View all</Link>
        </div>
        
        <div className="divide-y">
          {recentTransactions.map(transaction => (
            <div key={transaction.id} className="py-3 flex justify-between items-center">
              <div className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${transaction.isExpense ? 'bg-red-100' : 'bg-green-100'}`}>
                  {transaction.isExpense ? (
                    <ArrowDownCircleIcon className="h-5 w-5 text-spendwell-danger" />
                  ) : (
                    <ArrowUpCircleIcon className="h-5 w-5 text-spendwell-success" />
                  )}
                </div>
                <div>
                  <p className="font-medium">{transaction.description}</p>
                  <p className="text-xs text-spendwell-text-tertiary">
                    <span className={`category-badge category-badge-${transaction.category}`}>
                      {transaction.category}
                    </span>
                    <span className="ml-2">
                      {transaction.date.toLocaleDateString()}
                    </span>
                  </p>
                </div>
              </div>
              <p className={`font-semibold ${transaction.isExpense ? 'text-spendwell-danger' : 'text-spendwell-success'}`}>
                {transaction.isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Quick Insights */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 shadow card-shadow">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <TrendingUpIcon className="h-6 w-6 text-spendwell-primary" />
            </div>
            <div>
              <p className="text-sm text-spendwell-text-secondary">Spending Trend</p>
              <p className="font-semibold">15% lower this month</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow card-shadow">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 p-2 rounded-full">
              <CalendarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-spendwell-text-secondary">Upcoming Bills</p>
              <p className="font-semibold">3 due this week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
