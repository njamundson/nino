import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const UserMenu = () => {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return data;
    }
  });

  return (
    <Avatar className="w-10 h-10 ring-2 ring-nino-primary/20">
      <AvatarImage src="" alt="Profile" />
      <AvatarFallback className="bg-nino-primary text-nino-white">
        {profile?.first_name?.[0]}{profile?.last_name?.[0]}
      </AvatarFallback>
    </Avatar>
  );
};