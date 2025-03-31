
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HomeIcon, PieChartIcon, PlusCircleIcon, BarChartIcon, GoalIcon } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string): string => {
    return location.pathname === path 
      ? 'text-spendwell-primary' 
      : 'text-gray-500';
  };

  return (
    <nav className="bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] py-2 fixed bottom-0 w-full z-10">
      <div className="container mx-auto max-w-4xl">
        <div className="flex justify-around items-center">
          <Link to="/" className="flex flex-col items-center py-1">
            <HomeIcon className={`h-6 w-6 ${isActive('/')}`} />
            <span className={`text-xs mt-1 ${isActive('/')}`}>Home</span>
          </Link>
          
          <Link to="/transactions" className="flex flex-col items-center py-1">
            <BarChartIcon className={`h-6 w-6 ${isActive('/transactions')}`} />
            <span className={`text-xs mt-1 ${isActive('/transactions')}`}>Transactions</span>
          </Link>
          
          <Link to="/add" className="flex flex-col items-center -mt-5">
            <div className="bg-spendwell-primary rounded-full p-3 shadow-lg">
              <PlusCircleIcon className="h-6 w-6 text-white" />
            </div>
            <span className="text-xs mt-1 text-spendwell-primary font-medium">Add</span>
          </Link>
          
          <Link to="/budgets" className="flex flex-col items-center py-1">
            <GoalIcon className={`h-6 w-6 ${isActive('/budgets')}`} />
            <span className={`text-xs mt-1 ${isActive('/budgets')}`}>Budgets</span>
          </Link>
          
          <Link to="/analysis" className="flex flex-col items-center py-1">
            <PieChartIcon className={`h-6 w-6 ${isActive('/analysis')}`} />
            <span className={`text-xs mt-1 ${isActive('/analysis')}`}>Analysis</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default BottomNavigation;
