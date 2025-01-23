import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface NewChatButtonProps {
  onStartChat: (userId: string) => void;
}

export const NewChatButton = ({ onStartChat }: NewChatButtonProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      className="shrink-0"
      onClick={() => onStartChat("")}
    >
      <Plus className="h-4 w-4" />
    </Button>
  );
};