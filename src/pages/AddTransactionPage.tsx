
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance, Category } from '@/contexts/FinanceContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { CameraIcon, ArrowLeftIcon } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { getCategoryName } from '@/utils/formatters';

const AddTransactionPage: React.FC = () => {
  const navigate = useNavigate();
  const { addTransaction } = useFinance();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState<Category>('other');
  const [isExpense, setIsExpense] = useState(true);
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  
  const categories: Category[] = [
    'food', 
    'transport', 
    'utilities', 
    'entertainment', 
    'shopping', 
    'health', 
    'other'
  ];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!description || !amount || !category || !date) {
      alert('Please fill in all fields');
      return;
    }
    
    // Add transaction
    addTransaction({
      description,
      amount: parseFloat(amount),
      category,
      isExpense,
      date: new Date(date)
    });
    
    // Navigate back
    navigate('/transactions');
  };
  
  return (
    <div className="pb-20">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate(-1)} 
          className="mr-2"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Add Transaction</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction type */}
          <div className="space-y-2">
            <Label>Transaction Type</Label>
            <RadioGroup 
              defaultValue="expense" 
              className="flex space-x-4"
              onValueChange={(value) => setIsExpense(value === 'expense')}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="expense" />
                <Label htmlFor="expense" className="cursor-pointer">Expense</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="income" />
                <Label htmlFor="income" className="cursor-pointer">Income</Label>
              </div>
            </RadioGroup>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="What was this transaction for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          
          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
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
                required
              />
            </div>
          </div>
          
          {/* Category */}
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
          
          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          
          {/* Camera option */}
          <div className="space-y-2">
            <Label>Scan Receipt</Label>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full flex items-center justify-center space-x-2"
            >
              <CameraIcon className="h-5 w-5" />
              <span>Take a photo</span>
            </Button>
            <p className="text-xs text-spendwell-text-tertiary text-center mt-1">
              Automatically extract purchase details from a receipt
            </p>
          </div>
          
          {/* Submit button */}
          <Button type="submit" className="w-full">Save Transaction</Button>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionPage;
