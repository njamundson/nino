import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CreatorSelectionModal from "../CreatorSelectionModal";

interface ChatListHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewChat?: (userId: string, displayName: string, profileImage: string | null) => void;
  isCreator?: boolean;
}

export const ChatListHeader = ({ 
  searchQuery, 
  setSearchQuery,
  onNewChat,
  isCreator = false
}: ChatListHeaderProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreatorSelect = (userId: string, displayName: string, profileImage: string | null) => {
    if (onNewChat) {
      onNewChat(userId, displayName, profileImage);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="p-6 border-b border-gray-100">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-gray-400" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full h-9 rounded-full bg-gray-50/80 border-gray-200 text-sm placeholder:text-gray-400 focus:ring-1 focus:ring-gray-200 focus:border-gray-300 transition-all duration-200"
            />
          </div>
          {onNewChat && !isCreator && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 h-9 w-9 rounded-full border-gray-200 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus className="h-[15px] w-[15px] text-gray-600" />
              </Button>
              <CreatorSelectionModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={handleCreatorSelect}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};