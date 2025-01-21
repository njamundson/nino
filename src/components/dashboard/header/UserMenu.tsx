import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const UserMenu = () => {
  const navigate = useNavigate();
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      // Check if user is a brand by looking up in brands table
      const { data: brandData } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      
      return { ...data, isBrand: !!brandData };
    }
  });

  const handleSettingsClick = () => {
    // Route to brand settings if user is a brand, otherwise to creator settings
    const settingsPath = profile?.isBrand ? '/brand/settings' : '/creator/settings';
    navigate(settingsPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-10 h-10 ring-2 ring-nino-primary/20 cursor-pointer hover:ring-nino-primary/40 transition-all duration-200">
          <AvatarImage src="" alt="Profile" />
          <AvatarFallback className="bg-nino-primary text-nino-white">
            {profile?.first_name?.[0]}{profile?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-56 mt-2 bg-white/80 backdrop-blur-xl border-none shadow-lg rounded-xl animate-in fade-in-0 zoom-in-95"
        align="end"
      >
        <DropdownMenuItem 
          className="flex items-center px-4 py-3 text-sm text-nino-text hover:bg-nino-bg/50 rounded-lg mx-1 cursor-pointer transition-colors duration-200"
          onClick={handleSettingsClick}
        >
          <Settings className="w-4 h-4 mr-3 text-nino-gray" />
          Settings
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};