import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card } from "@/components/ui/card";

const DashboardHeader = () => {
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

  const { data: user } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    }
  });

  return (
    <Card className="bg-white shadow-sm rounded-3xl overflow-hidden mb-8">
      <div className="p-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Avatar className="w-10 h-10 ring-2 ring-nino-primary/20">
            <AvatarImage src="" alt="Profile" />
            <AvatarFallback className="bg-nino-primary text-nino-white">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-medium text-nino-text">
              {profile?.first_name} {profile?.last_name}
            </h3>
            <p className="text-sm text-nino-gray">
              {user?.email}
            </p>
          </div>
        </div>
        
        <button className="p-2 hover:bg-nino-white rounded-full transition-colors">
          <Bell className="w-6 h-6 text-nino-gray hover:text-nino-primary transition-colors" />
        </button>
      </div>
    </Card>
  );
};

export default DashboardHeader;