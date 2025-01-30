import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ImageIcon, SendHorizontal } from "lucide-react";
import { useRef } from "react";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isUploading: boolean;
  handleImageUpload: (file: File) => void;
}

const ChatInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  isUploading,
  handleImageUpload,
}: ChatInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  return (
    <div className="border-t p-4 flex gap-2 items-end bg-background">
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
      >
        <ImageIcon className="h-5 w-5" />
      </Button>
      <Textarea
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        onKeyDown={handleKeyPress}
        placeholder="Type a message..."
        className="min-h-[20px] max-h-[200px] resize-none"
        rows={1}
      />
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0"
        onClick={handleSendMessage}
        disabled={isUploading || (!newMessage.trim() && !isUploading)}
      >
        <SendHorizontal className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default ChatInput;