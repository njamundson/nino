import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import CreatorSelectionModal from "../CreatorSelectionModal";
import { useState } from "react";

interface NewChatButtonProps {
  onStartChat: (profileId: string) => void;
}

export const NewChatButton = ({ onStartChat }: NewChatButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        variant="outline" 
        size="icon" 
        className="shrink-0"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="h-4 w-4" />
      </Button>

      <CreatorSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={onStartChat}
      />
    </>
  );
};