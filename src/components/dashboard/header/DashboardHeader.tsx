import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

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

  return (
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
  );
};

export default DashboardHeader;