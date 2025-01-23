import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ChatSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export const ChatSearch = ({ value, onChange }: ChatSearchProps) => {
  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
      <Input
        placeholder="Search conversations..."
        className="pl-9 rounded-full"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};