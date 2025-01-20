import { Bell } from 'lucide-react';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import NotificationsList from './notifications/NotificationsList';
import { useNotifications } from './notifications/useNotifications';

export const NotificationPopover = () => {
  const { 
    isOpen, 
    setIsOpen, 
    notifications, 
    notificationsError, 
    dismissNotification: dismissMutation 
  } = useNotifications();
  
  const hasUnreadNotifications = notifications && notifications.length > 0;

  const handleDismiss = (notification: { id: string, type: string }) => {
    dismissMutation.mutate(notification);
  };

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
      <PopoverContent 
        className="w-[380px] p-0 rounded-xl shadow-lg backdrop-blur-xl bg-white/95 border-0" 
        align="end"
      >
        <NotificationsList 
          notifications={notifications}
          notificationsError={notificationsError}
          onDismiss={handleDismiss}
          onNotificationClick={(notification) => {
            setIsOpen(false);
            return notification;
          }}
        />
      </PopoverContent>
    </Popover>
  );
};