import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

interface ChatItemProps {
  userId: string;
  firstName: string;
  lastName: string;
  profileImage: string | null;
  lastMessage?: {
    content: string;
    created_at: string;
  };
  isSelected: boolean;
  onClick: () => void;
}

export const ChatItem = ({ 
  firstName, 
  lastName, 
  profileImage,
  lastMessage, 
  isSelected, 
  onClick 
}: ChatItemProps) => {
  const getInitials = () => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div
      className={`p-4 cursor-pointer hover:bg-gray-100 transition-colors ${
        isSelected ? "bg-gray-100" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <Avatar>
          <AvatarImage src={profileImage || ""} />
          <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
            {getInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {firstName} {lastName}
          </p>
          {lastMessage && (
            <p className="text-sm text-gray-500 truncate">
              {lastMessage.content}
            </p>
          )}
        </div>
        {lastMessage && (
          <span className="text-xs text-gray-500">
            {formatDate(lastMessage.created_at)}
          </span>
        )}
      </div>
    </div>
  );
};