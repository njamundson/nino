import { ChatSearch } from "./ChatSearch";

interface ChatListHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewChat: () => void;
}

export const ChatListHeader = ({
  searchQuery,
  setSearchQuery,
  onNewChat,
}: ChatListHeaderProps) => {
  return (
    <div className="p-4 border-b border-gray-100">
      <ChatSearch 
        value={searchQuery} 
        onChange={setSearchQuery}
        onNewChat={onNewChat}
      />
    </div>
  );
};