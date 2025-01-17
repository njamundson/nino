import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender_profile?: {
    first_name: string;
    last_name: string;
  };
  receiver_profile?: {
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
  messages: Message[] | undefined;
  creators: Creator[] | undefined;
  selectedChat: string | null;
  setSelectedChat: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ChatList = ({
  messages = [],
  creators = [],
  selectedChat,
  setSelectedChat,
  searchQuery,
  setSearchQuery,
}: ChatListProps) => {
  // Group messages by conversation partner
  const conversations = messages.reduce((acc: { [key: string]: Message }, message) => {
    const partnerId = message.sender_id === selectedChat ? message.receiver_id : message.sender_id;
    if (!acc[partnerId] || new Date(acc[partnerId].created_at) < new Date(message.created_at)) {
      acc[partnerId] = message;
    }
    return acc;
  }, {});

  const filteredConversations = Object.values(conversations).filter((message) => {
    const senderName = `${message.sender_profile?.first_name} ${message.sender_profile?.last_name}`.toLowerCase();
    const receiverName = `${message.receiver_profile?.first_name} ${message.receiver_profile?.last_name}`.toLowerCase();
    return senderName.includes(searchQuery.toLowerCase()) || 
           receiverName.includes(searchQuery.toLowerCase()) ||
           message.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="relative flex-1 mr-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/50 rounded-full"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="w-56 max-h-[300px] overflow-y-auto bg-white"
            align="end"
          >
            <ScrollArea className="h-[300px] p-2">
              {creators?.map((creator) => (
                <div
                  key={creator.id}
                  className="p-2 hover:bg-gray-100 rounded-md cursor-pointer"
                  onClick={() => setSelectedChat(creator.id)}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {creator.profile?.first_name?.[0]}
                        {creator.profile?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="font-medium">
                      {creator.profile?.first_name} {creator.profile?.last_name}
                    </div>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filteredConversations.map((message) => {
            const isReceived = message.receiver_id === selectedChat;
            const profile = isReceived ? message.sender_profile : message.receiver_profile;
            
            return (
              <div
                key={message.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChat === (isReceived ? message.sender_id : message.receiver_id)
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedChat(isReceived ? message.sender_id : message.receiver_id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {profile?.first_name?.[0]}
                      {profile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-sm">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
};