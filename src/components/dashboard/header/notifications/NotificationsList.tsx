import { X } from 'lucide-react';
import { formatDate } from './notificationUtils';

interface Notification {
  id: string;
  type: string;
  content: string;
  created_at: string;
  action_url: string;
}

interface NotificationsListProps {
  notifications: Notification[] | undefined;
  notificationsError: Error | null;
  onDismiss: (notification: { id: string, type: string }) => void;
  onNotificationClick: (notification: { action_url: string }) => void;
}

const NotificationsList = ({ 
  notifications, 
  notificationsError, 
  onDismiss, 
  onNotificationClick 
}: NotificationsListProps) => {
  return (
    <>
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
              className="group relative p-4 hover:bg-gray-50/50 transition-colors border-b border-gray-100/10 last:border-0 cursor-pointer"
              onClick={() => onNotificationClick(notification)}
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <p className="text-sm text-nino-text leading-relaxed">{notification.content}</p>
                  <span className="text-xs text-nino-gray mt-1 block">
                    {formatDate(notification.created_at)}
                  </span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(notification);
                  }}
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
            <p className="text-xs mt-1 text-nino-gray/70">
              We'll notify you when you receive new messages or proposals
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default NotificationsList;