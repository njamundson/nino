import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatSearch } from "./chat-list/ChatSearch";
import { NewChatButton } from "./chat-list/NewChatButton";
import { EmptyState } from "./chat-list/EmptyState";

interface ChatListProps {
  onSelectChat: (userId: string) => void;
  selectedUserId: string | null;
}

const ChatList = ({ onSelectChat, selectedUserId }: ChatListProps) => {
  const [loading, setLoading] = useState(false);
  const [isBrand, setIsBrand] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {isBrand && (
        <div className="p-4 flex items-center gap-2">
          <ChatSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <NewChatButton onStartChat={onSelectChat} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        <EmptyState isBrand={isBrand} />
      </div>
    </div>
  );
};

export default ChatList;