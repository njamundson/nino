import React from 'react';
import { Bell, Briefcase, FilePlus } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import Sidebar from './Sidebar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const CreatorDashboard = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      return data;
    }
  });

  return (
    <div className="flex h-screen bg-nino-bg">
      <Sidebar />
      <div className="flex-1 p-8">
        <div className="flex justify-end items-center space-x-4 mb-8">
          <button className="p-2 hover:bg-nino-white rounded-full transition-colors">
            <Bell className="w-6 h-6 text-nino-gray hover:text-nino-primary transition-colors" />
          </button>
          <Avatar className="w-10 h-10 ring-2 ring-nino-primary/20">
            <AvatarImage src="" alt="Profile" />
            <AvatarFallback className="bg-nino-primary text-nino-white">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
                  <Briefcase className="w-6 h-6 text-nino-primary" />
                </div>
                <div>
                  <h3 className="text-lg text-nino-gray font-medium mb-1">
                    Active Projects
                  </h3>
                  <p className="text-4xl font-semibold text-nino-text">
                    0
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm rounded-3xl overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-nino-bg rounded-2xl flex items-center justify-center">
                  <FilePlus className="w-6 h-6 text-nino-primary" />
                </div>
                <div>
                  <h3 className="text-lg text-nino-gray font-medium mb-1">
                    New Proposals
                  </h3>
                  <p className="text-4xl font-semibold text-nino-text">
                    0
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;