import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import CreatorSelectionModal from "../CreatorSelectionModal";

interface ChatListHeaderProps {
  onSearch?: (query: string) => void;
  onNewChat?: (creatorId: string) => void;
  isCreator?: boolean;
}

const ChatListHeader = ({ onSearch, onNewChat, isCreator }: ChatListHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    onSearch?.(value);
  };

  const handleCreatorSelect = (creatorId: string) => {
    onNewChat?.(creatorId);
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 border-b border-gray-100">
      <div className="space-y-4">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-gray-400" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 w-full h-9 rounded-full bg-gray-50/80 border-gray-200 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-gray-200 focus:border-gray-300 transition-all duration-200"
          />
        </div>
        {!isCreator && onNewChat && (
          <CreatorSelectionModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onSelect={handleCreatorSelect}
          />
        )}
      </div>
    </div>
  );
};

export default ChatListHeader;