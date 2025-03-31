
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// Define our category types
export type Category = 
  | 'food' 
  | 'transport' 
  | 'utilities' 
  | 'entertainment' 
  | 'shopping' 
  | 'health' 
  | 'other';

// Define transaction interface
export interface Transaction {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: Date;
  isExpense: boolean;
}

// Define budget interface
export interface Budget {
  id: string;
  category: Category;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';
}

// Context state interface
interface FinanceContextType {
  transactions: Transaction[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  updateTransaction: (id: string, data: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, 'id'>) => void;
  updateBudget: (id: string, data: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  getCategoryTotal: (category: Category) => number;
  getTotalExpenses: () => number;
  getTotalIncome: () => number;
  getNetIncome: () => number;
  getBudgetProgress: (budgetId: string) => number;
}

// Create context with default values
const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

// Sample data for development
const sampleTransactions: Transaction[] = [
  {
    id: '1',
    amount: 35.50,
    category: 'food',
    description: 'Groceries',
    date: new Date(2023, 7, 1),
    isExpense: true
  },
  {
    id: '2',
    amount: 25.00,
    category: 'transport',
    description: 'Gas',
    date: new Date(2023, 7, 2),
    isExpense: true
  },
  {
    id: '3',
    amount: 1500.00,
    category: 'other',
    description: 'Salary',
    date: new Date(2023, 7, 1),
    isExpense: false
  },
  {
    id: '4',
    amount: 80.00,
    category: 'entertainment',
    description: 'Movie and dinner',
    date: new Date(2023, 7, 3),
    isExpense: true
  },
  {
    id: '5',
    amount: 120.00,
    category: 'utilities',
    description: 'Electricity bill',
    date: new Date(2023, 7, 5),
    isExpense: true
  },
  {
    id: '6',
    amount: 60.00,
    category: 'shopping',
    description: 'New shirt',
    date: new Date(2023, 7, 6),
    isExpense: true
  }
];

const sampleBudgets: Budget[] = [
  {
    id: '1',
    category: 'food',
    amount: 400,
    period: 'monthly'
  },
  {
    id: '2',
    category: 'transport',
    amount: 200,
    period: 'monthly'
  },
  {
    id: '3',
    category: 'entertainment',
    amount: 150,
    period: 'monthly'
  }
];

// Provider component
export const FinanceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(sampleTransactions);
  const [budgets, setBudgets] = useState<Budget[]>(sampleBudgets);

  // Local storage persistence
  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    const storedBudgets = localStorage.getItem('budgets');
    
    if (storedTransactions) {
      try {
        const parsedTransactions = JSON.parse(storedTransactions);
        // Convert date strings back to Date objects
        const processedTransactions = parsedTransactions.map((t: any) => ({
          ...t,
          date: new Date(t.date)
        }));
        setTransactions(processedTransactions);
      } catch (error) {
        console.error('Failed to parse transactions from localStorage', error);
      }
    }
    
    if (storedBudgets) {
      try {
        setBudgets(JSON.parse(storedBudgets));
      } catch (error) {
        console.error('Failed to parse budgets from localStorage', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('budgets', JSON.stringify(budgets));
  }, [budgets]);

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    };
    setTransactions([...transactions, newTransaction]);
  };

  const updateTransaction = (id: string, data: Partial<Transaction>) => {
    setTransactions(
      transactions.map(transaction => 
        transaction.id === id ? { ...transaction, ...data } : transaction
      )
    );
  };

  const deleteTransaction = (id: string) => {
    setTransactions(transactions.filter(transaction => transaction.id !== id));
  };

  // Budget functions
  const addBudget = (budget: Omit<Budget, 'id'>) => {
    const newBudget = {
      ...budget,
      id: Date.now().toString()
    };
    setBudgets([...budgets, newBudget]);
  };

  const updateBudget = (id: string, data: Partial<Budget>) => {
    setBudgets(
      budgets.map(budget => 
        budget.id === id ? { ...budget, ...data } : budget
      )
    );
  };

  const deleteBudget = (id: string) => {
    setBudgets(budgets.filter(budget => budget.id !== id));
  };

  // Analysis functions
  const getCategoryTotal = (category: Category): number => {
    return transactions
      .filter(t => t.category === category && t.isExpense)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalExpenses = (): number => {
    return transactions
      .filter(t => t.isExpense)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getTotalIncome = (): number => {
    return transactions
      .filter(t => !t.isExpense)
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getNetIncome = (): number => {
    return getTotalIncome() - getTotalExpenses();
  };

  const getBudgetProgress = (budgetId: string): number => {
    const budget = budgets.find(b => b.id === budgetId);
    if (!budget) return 0;
    
    const spent = getCategoryTotal(budget.category);
    return Math.min(100, (spent / budget.amount) * 100);
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        budgets,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addBudget,
        updateBudget,
        deleteBudget,
        getCategoryTotal,
        getTotalExpenses,
        getTotalIncome,
        getNetIncome,
        getBudgetProgress
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

// Custom hook for using the context
export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider');
  }
  return context;
};
