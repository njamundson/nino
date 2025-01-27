import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatListItemProps {
  chat: any;
  isSelected: boolean;
  currentUserId: string | undefined;
  formatTime: (dateString: string) => string;
  onSelect: () => void;
  onDelete: () => void;
}

export const ChatListItem = ({
  chat,
  isSelected,
  currentUserId,
  formatTime,
  onSelect,
  onDelete,
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
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete conversation
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};