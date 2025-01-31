import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatListHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNewChat?: () => void;
}

export const ChatListHeader = ({ 
  searchQuery, 
  setSearchQuery,
  onNewChat
}: ChatListHeaderProps) => {
  return (
    <div className="p-6 border-b border-gray-100">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-full"
            />
          </div>
          {onNewChat && (
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={onNewChat}
            >
              <Plus className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};