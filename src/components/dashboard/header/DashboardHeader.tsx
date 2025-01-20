import { Bell, X } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from 'react';
import { cn } from "@/lib/utils";
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";

const DashboardHeader = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

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

  const dismissNotification = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('messages')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notification dismissed",
        description: "The notification has been marked as read",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to dismiss notification",
        variant: "destructive",
      });
    },
  });

  const hasUnreadNotifications = notifications && notifications.length > 0;

  const handleSettingsClick = () => {
    navigate('/creator/settings');
  };

  const formatDate = (date: string) => {
    const now = new Date();
    const notificationDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - notificationDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`;
    }
    return notificationDate.toLocaleDateString();
  };

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
        <PopoverContent 
          className="w-[380px] p-0 rounded-xl shadow-lg backdrop-blur-xl bg-white/95 border-0" 
          align="end"
        >
          <div className="p-4 border-b border-gray-100/20">
            <h3 className="font-semibold text-nino-text">Notifications</h3>
          </div>
          <div className="max-h-[400px] overflow-y-auto">
            {notificationsError ? (
              <div className="p-4 text-center text-nino-gray">
                Unable to load notifications
              </div>
            ) : notifications && notifications.length > 0 ? (
              notifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className="group relative p-4 hover:bg-gray-50/50 transition-colors border-b border-gray-100/10 last:border-0"
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className="text-sm text-nino-text leading-relaxed">{notification.content}</p>
                      <span className="text-xs text-nino-gray mt-1 block">
                        {formatDate(notification.created_at)}
                      </span>
                    </div>
                    <button
                      onClick={() => dismissNotification.mutate(notification.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-4 h-4 text-nino-gray" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-nino-gray">
                <p className="text-sm">No new notifications</p>
                <p className="text-xs mt-1 text-nino-gray/70">We'll notify you when something important happens</p>
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-10 h-10 ring-2 ring-nino-primary/20 cursor-pointer">
            <AvatarImage src="" alt="Profile" />
            <AvatarFallback className="bg-nino-primary text-nino-white">
              {profile?.first_name?.[0]}{profile?.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={handleSettingsClick} className="cursor-pointer">
            Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default DashboardHeader;