import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageIcon } from "lucide-react";

interface ChatListItemProps {
  chat: {
    otherUser: {
      id: string;
      display_name: string;
      profileImage: string | null;
    };
    content: string;
    created_at: string;
    sender_id: string;
    read: boolean;
  };
  isSelected: boolean;
  currentUserId?: string;
  onSelect: () => void;
}

export const ChatListItem = ({
  chat,
  isSelected,
  currentUserId,
  onSelect,
}: ChatListItemProps) => {
  const displayName = chat.otherUser.display_name;
  const initials = displayName
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase();

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessagePreview = (content: string) => {
    if (content.startsWith('![Image]') || content.includes('supabase.co/storage')) {
      return (
        <span className="flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5" />
          Attachment
        </span>
      );
    }
    return content;
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
            alt={displayName}
          />
          <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-gray-900">
              {displayName}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(chat.created_at)}
            </span>
          </div>
          <p className={`text-sm truncate ${
            !chat.read && chat.sender_id !== currentUserId ? "font-medium text-gray-900" : "text-gray-500"
          }`}>
            {getMessagePreview(chat.content)}
          </p>
        </div>
      </div>
    </div>
  );
};