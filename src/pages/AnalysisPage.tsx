
import React, { useState } from 'react';
import { useFinance, Category, Transaction } from '@/contexts/FinanceContext';
import { formatCurrency, getCategoryName } from '@/utils/formatters';
import { Button } from '@/components/ui/button';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AnalysisPage: React.FC = () => {
  const { transactions, getCategoryTotal } = useFinance();
  const [period, setPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  const categories: Category[] = [
    'food', 
    'transport', 
    'utilities', 
    'entertainment', 
    'shopping', 
    'health', 
    'other'
  ];
  
  // Only include expenses for category analysis
  const expenseTransactions = transactions.filter(t => t.isExpense);
  
  // Generate category data for pie chart
  const categoryData = categories.map(category => {
    const amount = getCategoryTotal(category);
    return {
      name: getCategoryName(category),
      value: amount,
      category
    };
  }).filter(item => item.value > 0);
  
  // Calculate total expenses
  const totalExpenses = categoryData.reduce((sum, item) => sum + item.value, 0);
  
  // Colors for the pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B', '#6FC3DF'];
  
  // Generate trend data
  const getTrendData = () => {
    const now = new Date();
    let startDate: Date;
    let dateFormat: string;
    
    // Determine date range based on selected period
    switch(period) {
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        dateFormat = 'day';
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        dateFormat = 'month';
        break;
      case 'month':
      default:
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        dateFormat = 'day';
    }
    
    // Filter transactions within the date range
    const filteredTransactions = expenseTransactions.filter(
      t => t.date >= startDate && t.date <= now
    );
    
    // Group transactions by date
    const groupedData: Record<string, number> = {};
    
    filteredTransactions.forEach(t => {
      let key: string;
      
      if (dateFormat === 'day') {
        key = t.date.toISOString().split('T')[0];
      } else {
        key = `${t.date.getFullYear()}-${t.date.getMonth() + 1}`;
      }
      
      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      
      groupedData[key] += t.amount;
    });
    
    // Convert to array for the chart
    return Object.keys(groupedData)
      .sort()
      .map(key => {
        let label: string;
        
        if (dateFormat === 'day') {
          const date = new Date(key);
          label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        } else {
          const [year, month] = key.split('-');
          label = new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
        }
        
        return {
          date: label,
          amount: groupedData[key]
        };
      });
  };
  
  const trendData = getTrendData();
  
  // Insights generation
  const generateInsights = () => {
    if (expenseTransactions.length === 0) {
      return ["Start tracking your expenses to see insights here."];
    }
    
    const insights: string[] = [];
    
    // Find top spending category
    const topCategory = [...categoryData].sort((a, b) => b.value - a.value)[0];
    if (topCategory) {
      insights.push(`Your highest spending is on ${topCategory.name} (${formatCurrency(topCategory.value)}), which is ${Math.round((topCategory.value / totalExpenses) * 100)}% of your total expenses.`);
    }
    
    // Find potential savings
    if (transactions.filter(t => t.category === 'entertainment' && t.isExpense).length > 0) {
      insights.push(`You've spent ${formatCurrency(getCategoryTotal('entertainment'))} on entertainment. Consider setting a monthly budget for this category.`);
    }
    
    // Trend analysis
    if (trendData.length > 1) {
      const firstAmount = trendData[0].amount;
      const lastAmount = trendData[trendData.length - 1].amount;
      const percentChange = ((lastAmount - firstAmount) / firstAmount) * 100;
      
      if (percentChange > 0) {
        insights.push(`Your spending has increased by ${Math.abs(Math.round(percentChange))}% compared to the beginning of this period.`);
      } else if (percentChange < 0) {
        insights.push(`Good job! Your spending has decreased by ${Math.abs(Math.round(percentChange))}% compared to the beginning of this period.`);
      }
    }
    
    // Add a generic tip
    insights.push("Consider tracking your subscriptions separately to identify any unused services you might be paying for.");
    
    return insights;
  };
  
  const insights = generateInsights();
  
  return (
    <div className="pb-20">
      <h1 className="text-2xl font-bold mb-6">Spending Analysis</h1>
      
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-4">Spending by Category</h2>
            {expenseTransactions.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value: any) => [formatCurrency(value), 'Amount']}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-spendwell-text-secondary">No expense data available</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-4">Category Breakdown</h2>
            {categoryData.length > 0 ? (
              <div className="space-y-4">
                {categoryData
                  .sort((a, b) => b.value - a.value)
                  .map((item, index) => (
                    <div key={item.category} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div 
                          className="w-3 h-3 rounded-full mr-2"
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        ></div>
                        <span>{item.name}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">{formatCurrency(item.value)}</div>
                        <div className="text-xs text-spendwell-text-secondary">
                          {Math.round((item.value / totalExpenses) * 100)}%
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-spendwell-text-secondary">No expense data available</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold">Spending Trend</h2>
              <div className="flex space-x-2">
                <Button 
                  variant={period === 'week' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setPeriod('week')}
                >
                  Week
                </Button>
                <Button 
                  variant={period === 'month' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setPeriod('month')}
                >
                  Month
                </Button>
                <Button 
                  variant={period === 'year' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setPeriod('year')}
                >
                  Year
                </Button>
              </div>
            </div>
            
            {trendData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={trendData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [formatCurrency(value), 'Amount']} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="amount" 
                      stroke="#0EA5E9" 
                      activeDot={{ r: 8 }} 
                      name="Spending"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-spendwell-text-secondary">No trend data available for this period</p>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-4">Category Comparison</h2>
            {categoryData.length > 0 ? (
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value: any) => [formatCurrency(value), 'Amount']} />
                    <Legend />
                    <Bar dataKey="value" name="Amount" fill="#10B981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-spendwell-text-secondary">No category data available</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="insights" className="space-y-6">
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-4">Spending Insights</h2>
            <div className="space-y-4">
              {insights.map((insight, index) => (
                <div key={index} className="p-4 bg-blue-50 rounded-lg">
                  <p>{insight}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5">
            <h2 className="font-semibold mb-4">Saving Suggestions</h2>
            <div className="space-y-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-spendwell-success mb-2">Create a "No-Spend" Day</h3>
                <p>Challenge yourself to have one day a week where you don't spend any money. This can reduce impulse purchases and save you an estimated $200 per month.</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-spendwell-success mb-2">Review Your Subscriptions</h3>
                <p>Cancel unused subscriptions and save $10-50 per month. Start by checking streaming services, app subscriptions, and gym memberships.</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-medium text-spendwell-success mb-2">Meal Planning</h3>
                <p>Plan your meals in advance and stick to your grocery list. This can reduce food waste and unnecessary purchases, saving up to $100 per month.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalysisPage;
