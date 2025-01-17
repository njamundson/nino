import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  content: string;
  created_at: string;
  sender_profile?: {
    first_name: string;
    last_name: string;
  };
}

interface Creator {
  id: string;
  profile: {
    first_name: string;
    last_name: string;
  };
}

interface ChatListProps {
  messages?: Message[];
  creators?: Creator[];
  selectedChat: string | null;
  setSelectedChat: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ChatList = ({
  messages,
  creators,
  selectedChat,
  setSelectedChat,
  searchQuery,
  setSearchQuery,
}: ChatListProps) => {
  const filteredMessages = messages?.filter((message) => {
    const senderName = `${message.sender_profile?.first_name} ${message.sender_profile?.last_name}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return senderName.includes(query) || message.content.toLowerCase().includes(query);
  });

  return (
    <div>
      <div className="p-4 border-b flex justify-between items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search messages"
            className="pl-10 bg-gray-50 border-0"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="ml-2">
              <Plus className="w-5 h-5 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {creators?.map((creator) => (
              <DropdownMenuItem
                key={creator.id}
                onClick={() => setSelectedChat(creator.id)}
                className="flex items-center gap-2 p-2"
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
                    {creator.profile?.first_name?.[0]}
                    {creator.profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <span>
                  {creator.profile?.first_name} {creator.profile?.last_name}
                </span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="h-[calc(100vh-10rem)]">
        <div className="p-2">
          {filteredMessages?.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat.id)}
              className={`w-full p-4 rounded-xl text-left transition-all duration-200 ${
                selectedChat === chat.id
                  ? "bg-nino-primary/10"
                  : "hover:bg-gray-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
                    {chat.sender_profile?.first_name?.[0]}
                    {chat.sender_profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-nino-text truncate">
                      {chat.sender_profile?.first_name} {chat.sender_profile?.last_name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {formatDate(chat.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate mt-1">
                    {chat.content}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};