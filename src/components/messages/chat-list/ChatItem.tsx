import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

interface ChatItemProps {
  userId: string;
  message: {
    content: string;
    created_at: string;
    profiles: {
      first_name: string;
      last_name: string;
    };
  };
  isSelected: boolean;
  onClick: () => void;
}

export const ChatItem = ({ userId, message, isSelected, onClick }: ChatItemProps) => {
  return (
    <div
      className={`p-4 cursor-pointer hover:bg-gray-100 ${
        isSelected ? "bg-gray-100" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarFallback>
            {message.profiles.first_name?.[0]}
            {message.profiles.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {message.profiles.first_name} {message.profiles.last_name}
          </p>
          <p className="text-sm text-gray-500 truncate">{message.content}</p>
        </div>
        <span className="text-xs text-gray-500">
          {formatDate(message.created_at)}
        </span>
      </div>
    </div>
  );
};