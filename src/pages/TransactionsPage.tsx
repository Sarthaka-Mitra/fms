
import React, { useState } from 'react';
import { useFinance, Transaction } from '@/contexts/FinanceContext';
import { formatCurrency, formatDate, getCategoryClass, getCategoryName } from '@/utils/formatters';
import { PlusIcon, SearchIcon, FilterIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const TransactionsPage: React.FC = () => {
  const { transactions } = useFinance();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all');
  
  // Filter and sort transactions
  const filteredTransactions = transactions
    .filter(t => {
      // Apply search filter
      const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           t.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Apply transaction type filter
      const matchesFilter = filter === 'all' || 
                           (filter === 'expense' && t.isExpense) || 
                           (filter === 'income' && !t.isExpense);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  
  // Group transactions by date
  const groupedTransactions: { [key: string]: Transaction[] } = {};
  
  filteredTransactions.forEach(transaction => {
    const dateKey = formatDate(transaction.date, 'short');
    if (!groupedTransactions[dateKey]) {
      groupedTransactions[dateKey] = [];
    }
    groupedTransactions[dateKey].push(transaction);
  });
  
  return (
    <div className="pb-20">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-spendwell-text-primary">Transactions</h1>
        <Link to="/add">
          <Button className="rounded-full h-10 w-10 p-0">
            <PlusIcon className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      
      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-2">
          <Button 
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            All
          </Button>
          <Button 
            variant={filter === 'expense' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('expense')}
          >
            Expenses
          </Button>
          <Button 
            variant={filter === 'income' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('income')}
          >
            Income
          </Button>
        </div>
      </div>
      
      {/* Transactions list */}
      <div className="space-y-6">
        {Object.keys(groupedTransactions).length > 0 ? (
          Object.keys(groupedTransactions).map(dateKey => (
            <div key={dateKey} className="space-y-4">
              <h2 className="font-semibold text-spendwell-text-secondary">{dateKey}</h2>
              <div className="bg-white rounded-lg shadow divide-y">
                {groupedTransactions[dateKey].map(transaction => (
                  <div key={transaction.id} className="p-4 flex justify-between items-center">
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
                        <span className={getCategoryClass(transaction.category)}>
                          {getCategoryName(transaction.category)}
                        </span>
                      </div>
                    </div>
                    <p className={`font-semibold ${transaction.isExpense ? 'text-spendwell-danger' : 'text-spendwell-success'}`}>
                      {transaction.isExpense ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10">
            <p className="text-spendwell-text-secondary">No transactions found</p>
            <Link to="/add" className="text-spendwell-primary mt-2 inline-block">
              Add your first transaction
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;
