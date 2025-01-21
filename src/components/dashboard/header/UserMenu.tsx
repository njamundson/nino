import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Settings, LogOut } from "lucide-react";

export const UserMenu = () => {
  const navigate = useNavigate();
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="w-9 h-9 ring-1 ring-black/5 cursor-pointer hover:ring-black/10 transition-all duration-300">
          <AvatarImage src="" alt="Profile" />
          <AvatarFallback className="bg-gradient-to-br from-nino-primary to-nino-primary/90 text-nino-white font-medium">
            {profile?.first_name?.[0]}{profile?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-52 rounded-xl p-2 shadow-lg border border-black/5 bg-white/95 backdrop-blur-sm"
      >
        <DropdownMenuLabel className="font-normal px-2 py-1.5">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none text-gray-900">
              {profile?.first_name} {profile?.last_name}
            </p>
            <p className="text-xs leading-none text-gray-500">
              {profile?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1.5 bg-gray-100" />
        <DropdownMenuItem 
          onClick={() => navigate('/creator/settings')} 
          className="cursor-pointer rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm px-2 py-1.5"
        >
          <Settings className="mr-2 h-4 w-4 text-gray-500" />
          <span>Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="cursor-pointer rounded-lg hover:bg-red-50 transition-colors duration-200 text-sm px-2 py-1.5 text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};