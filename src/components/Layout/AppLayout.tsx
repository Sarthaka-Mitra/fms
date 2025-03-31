
import React from 'react';
import { Outlet } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import Header from './Header';

const AppLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-spendwell-background">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
};

export default AppLayout;
