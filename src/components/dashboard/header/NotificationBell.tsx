import { Bell } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface NotificationBellProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const NotificationBell = ({ isOpen, setIsOpen }: NotificationBellProps) => {
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
  );
};

export default NotificationBell;