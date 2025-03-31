
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, UserIcon, BellIcon, MoonIcon, HelpCircleIcon, LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  
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
        <h1 className="text-2xl font-bold">Profile & Settings</h1>
      </div>
      
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6 flex items-center space-x-4">
          <div className="w-16 h-16 bg-spendwell-primary rounded-full flex items-center justify-center text-white text-2xl font-semibold">
            JS
          </div>
          <div>
            <h2 className="font-semibold text-lg">John Smith</h2>
            <p className="text-spendwell-text-secondary">john.smith@example.com</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold">Account Settings</h2>
          </div>
          <div className="divide-y">
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 mr-3 text-spendwell-text-secondary" />
                <span>Edit Profile</span>
              </div>
              <Button variant="ghost" size="sm">
                Edit
              </Button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <BellIcon className="h-5 w-5 mr-3 text-spendwell-text-secondary" />
                <span>Notifications</span>
              </div>
              <Switch id="notifications" defaultChecked />
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center">
                <MoonIcon className="h-5 w-5 mr-3 text-spendwell-text-secondary" />
                <span>Dark Mode</span>
              </div>
              <Switch id="dark-mode" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="font-semibold">App Settings</h2>
          </div>
          <div className="divide-y">
            <div className="p-4 flex items-center justify-between">
              <span>Currency</span>
              <div className="flex items-center">
                <span className="text-spendwell-text-secondary mr-2">USD</span>
                <Button variant="ghost" size="sm">
                  Change
                </Button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span>Default Budget Period</span>
              <div className="flex items-center">
                <span className="text-spendwell-text-secondary mr-2">Monthly</span>
                <Button variant="ghost" size="sm">
                  Change
                </Button>
              </div>
            </div>
            <div className="p-4 flex items-center justify-between">
              <span>Reminder Frequency</span>
              <div className="flex items-center">
                <span className="text-spendwell-text-secondary mr-2">Daily</span>
                <Button variant="ghost" size="sm">
                  Change
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow">
          <div className="divide-y">
            <div className="p-4 flex items-center">
              <HelpCircleIcon className="h-5 w-5 mr-3 text-spendwell-text-secondary" />
              <span>Help & Support</span>
            </div>
            <div className="p-4 flex items-center text-spendwell-danger">
              <LogOutIcon className="h-5 w-5 mr-3" />
              <span>Log Out</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
