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
    <div className="bg-white rounded-[20px] p-6 mb-6 flex justify-between items-center">
      <div className="flex flex-col">
        <h1 className="text-2xl font-semibold text-nino-text">
          {profile?.first_name} {profile?.last_name}
        </h1>
        <p className="text-nino-gray">
          {profile?.email}
        </p>
      </div>
      
      <div className="flex items-center space-x-4">
        <button className="p-2 hover:bg-nino-bg rounded-full transition-colors">
          <Bell className="w-6 h-6 text-nino-gray hover:text-nino-primary transition-colors" />
        </button>
        <Avatar className="w-10 h-10 bg-black text-white">
          <AvatarImage src="" alt="Profile" />
          <AvatarFallback>
            {profile?.first_name?.[0]}{profile?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardHeader;