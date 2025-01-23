import { useState } from "react";
import { ChatSearch } from "./chat-list/ChatSearch";
import { NewChatButton } from "./chat-list/NewChatButton";
import { EmptyState } from "./chat-list/EmptyState";

interface ChatListProps {
  onSelectChat: (userId: string) => void;
  selectedUserId: string | null;
}

const ChatList = ({ onSelectChat, selectedUserId }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center gap-2">
        <ChatSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <NewChatButton onStartChat={onSelectChat} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <EmptyState isBrand={true} />
      </div>
    </div>
  );
};

export default ChatList;