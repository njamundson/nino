import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
  onNewChat: () => void;
}

export const ChatSearch = ({ value, onChange, onNewChat }: ChatSearchProps) => {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          placeholder="Search conversations..."
          className="pl-9 rounded-full"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <Button
        variant="outline"
        size="icon"
        className="shrink-0 rounded-full"
        onClick={onNewChat}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};