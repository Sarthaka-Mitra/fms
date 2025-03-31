
import React from 'react';
import { Link } from 'react-router-dom';
import { WalletIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm py-4 sticky top-0 z-10">
      <div className="container mx-auto px-4 flex justify-between items-center max-w-4xl">
        <Link to="/" className="flex items-center space-x-2">
          <WalletIcon className="h-6 w-6 text-spendwell-primary" />
          <span className="font-bold text-xl text-spendwell-primary">SpendWell</span>
        </Link>
        <div className="flex items-center space-x-4">
          <Link 
            to="/profile" 
            className="w-8 h-8 bg-spendwell-primary rounded-full flex items-center justify-center text-white"
          >
            <span className="text-sm font-medium">JS</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
