import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

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
}

interface ChatListProps {
  messages: Message[] | undefined;
  creators: any[];
  selectedChat: string | null;
  setSelectedChat: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ChatList = ({
  messages = [],
  creators,
  selectedChat,
  setSelectedChat,
  searchQuery,
  setSearchQuery,
}: ChatListProps) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/50 rounded-full"
          />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {messages?.map((message) => (
            <div
              key={message.id}
              className={`p-2 rounded-lg cursor-pointer ${
                selectedChat === message.id ? 'bg-gray-200' : 'hover:bg-gray-100'
              }`}
              onClick={() => setSelectedChat(message.id)}
            >
              <div className="font-semibold">
                {message.sender_profile?.first_name} {message.sender_profile?.last_name}
              </div>
              <div className="text-sm text-gray-600">{message.content}</div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};