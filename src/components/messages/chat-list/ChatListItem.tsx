import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatListItemProps {
  chat: {
    otherUser: {
      id: string;
      firstName: string;
      lastName: string;
      profileImage: string | null;
    };
    content: string;
    created_at: string;
    sender_id: string;
    read: boolean;
  };
  isSelected: boolean;
  currentUserId?: string;
  formatTime?: (dateString: string) => string;
  onSelect: () => void;
}

export const ChatListItem = ({
  chat,
  isSelected,
  currentUserId,
  onSelect,
}: ChatListItemProps) => {
  const fullName = `${chat.otherUser.firstName} ${chat.otherUser.lastName}`.trim();
  const initials = `${chat.otherUser.firstName[0] || ''}${chat.otherUser.lastName[0] || ''}`.toUpperCase();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div
      className={`group relative px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors ${
        isSelected ? "bg-gray-50/50" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage 
            src={chat.otherUser.profileImage || ''} 
            alt={fullName}
          />
          <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className={`text-sm truncate ${
            !chat.read && chat.sender_id !== currentUserId ? "font-medium text-gray-900" : "text-gray-500"
          }`}>
            {chat.content}
          </p>
          <span className="text-xs text-gray-500">
            {formatTime(chat.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};