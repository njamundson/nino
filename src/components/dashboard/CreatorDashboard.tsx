import React from 'react';
import { Bell, User } from 'lucide-react';
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Sidebar from './Sidebar';

const CreatorDashboard = () => {
  return (
    <div className="flex h-screen bg-nino-bg">
      <Sidebar />
      <div className="flex-1">
        <header className="p-8 flex justify-between items-center">
          <h1 className="text-3xl font-semibold text-nino-text">
            Welcome Back
          </h1>
          <div className="flex items-center gap-6">
            <button className="text-nino-text hover:text-nino-primary transition-colors">
              <Bell size={24} />
            </button>
            <Avatar className="h-10 w-10 border border-nino-primary">
              <AvatarFallback>
                <User className="h-6 w-6 text-nino-gray" />
              </AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="p-8">
          {/* Main content will go here */}
        </main>
      </div>
    </div>
  );
};

export default CreatorDashboard;