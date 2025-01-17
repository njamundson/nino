import { Bell } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from 'react';
import { cn } from "@/lib/utils";

const DashboardHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      // First get the profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
      
      if (profileError) {
        console.error('Error fetching profile:', profileError);
        return null;
      }

      // Then get the brand associated with this user
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (brandError) {
        console.error('Error fetching brand:', brandError);
        return profileData;
      }

      // Get the avatar URL if brand exists
      let avatarUrl = '';
      if (brandData?.id) {
        const { data: avatarData } = await supabase
          .storage
          .from('avatars')
          .list(`${brandData.id}`);

        const avatarFile = avatarData?.[0];
        
        if (avatarFile) {
          const { data: { publicUrl } } = supabase
            .storage
            .from('avatars')
            .getPublicUrl(`${brandData.id}/${avatarFile.name}`);
          avatarUrl = publicUrl;
        }
      }
      
      return { ...profileData, avatarUrl };
    }
  });

  const { data: notifications, error: notificationsError } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('receiver_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false })
        .limit(5);
      
      if (error) {
        console.error('Error fetching notifications:', error);
        return [];
      }
      
      return data || [];
    },
    retry: 1,
  });

  const hasUnreadNotifications = notifications && notifications.length > 0;

  return (
    <div className="flex justify-end items-center space-x-4 mb-8">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <button className="relative p-2 hover:bg-nino-white rounded-full transition-colors">
            <Bell className={cn(
              "w-6 h-6 transition-colors",
              isOpen ? "text-nino-primary" : "text-nino-gray hover:text-nino-primary"
            )} />
            {!notificationsError && hasUnreadNotifications && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0" align="end">
          <div className="p-4 border-b border-gray-100">
            <h3 className="font-semibold text-nino-text">Notifications</h3>
          </div>
          <div className="max-h-[300px] overflow-y-auto">
            {notificationsError ? (
              <div className="p-4 text-center text-nino-gray">
                Unable to load notifications
              </div>
            ) : notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <p className="text-sm text-nino-text">{notification.content}</p>
                  <span className="text-xs text-nino-gray mt-1 block">
                    {new Date(notification.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-nino-gray">
                No new notifications
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      <Avatar className="w-10 h-10 ring-2 ring-nino-primary/20">
        <AvatarImage src={profile?.avatarUrl || ""} alt="Profile" />
        <AvatarFallback className="bg-nino-primary text-nino-white">
          {profile?.first_name?.[0]}{profile?.last_name?.[0]}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default DashboardHeader;