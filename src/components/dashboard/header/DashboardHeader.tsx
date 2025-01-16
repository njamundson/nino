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
    <Card className="bg-white shadow-sm rounded-[20px] overflow-hidden mb-8">
      <div className="px-8 py-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Avatar className="w-12 h-12 ring-2 ring-nino-primary/20">
            <AvatarImage src="" alt="Profile" />
            <AvatarFallback className="bg-nino-primary text-nino-white text-lg">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg text-nino-text">
              {profile?.first_name} {profile?.last_name}
            </h3>
            <p className="text-sm text-nino-gray">
              {user?.email}
            </p>
          </div>
        </div>
        
        <div className="flex items-center">
          <button className="p-2.5 hover:bg-gray-50 rounded-full transition-colors">
            <Bell className="w-6 h-6 text-nino-gray hover:text-nino-primary transition-colors" />
          </button>
          <div className="w-10 h-10 bg-black rounded-full ml-4 flex items-center justify-center text-white">
            AB
          </div>
        </div>
      </div>
    </Card>
  );
};

export default DashboardHeader;