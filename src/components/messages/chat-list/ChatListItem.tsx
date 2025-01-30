import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatListItemProps {
  chat: any;
  isSelected: boolean;
  currentUserId: string | undefined;
  formatTime: (dateString: string) => string;
  onSelect: () => void;
}

export const ChatListItem = ({
  chat,
  isSelected,
  currentUserId,
  formatTime,
  onSelect,
}: ChatListItemProps) => {
  const fullName = chat.otherUser.firstName && chat.otherUser.lastName 
    ? `${chat.otherUser.firstName} ${chat.otherUser.lastName}`
    : 'Unnamed User';

  return (
    <div
      className={`group relative px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors ${
        isSelected ? "bg-gray-50/50" : ""
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={chat.otherUser.profileImage || ''} />
          <AvatarFallback>
            {`${chat.otherUser.firstName?.[0] || ''}${chat.otherUser.lastName?.[0] || ''}`}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {fullName}
            </h3>
            <span className="text-xs text-gray-500">
              {formatTime(chat.created_at)}
            </span>
          </div>
          <p className={`text-sm truncate ${
            !chat.read && chat.sender_id !== currentUserId ? "font-medium text-gray-900" : "text-gray-500"
          }`}>
            {chat.sender_id === currentUserId ? `You: ${chat.content}` : chat.content}
          </p>
        </div>
      </div>
    </div>
  );
};