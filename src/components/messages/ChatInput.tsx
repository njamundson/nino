import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Mic, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChatInputProps {
  selectedChat: string | null;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  editingMessage: { id: string; content: string; } | null;
  setEditingMessage: (message: { id: string; content: string; } | null) => void;
}

const ChatInput = ({
  selectedChat,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isRecording,
  setIsRecording,
  editingMessage,
  setEditingMessage,
}: ChatInputProps) => {
  const { toast } = useToast();
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const handleTypingStatus = async (typing: boolean) => {
    if (!selectedChat) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (typing && !isTyping) {
        setIsTyping(true);
        await supabase.from('typing_status').upsert({
          user_id: user.id,
          chat_with: selectedChat,
          is_typing: true,
        });
      }

      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }

      const timeout = setTimeout(async () => {
        setIsTyping(false);
        await supabase.from('typing_status').upsert({
          user_id: user.id,
          chat_with: selectedChat,
          is_typing: false,
        });
      }, 1000);

      setTypingTimeout(timeout);
    } catch (error) {
      console.error('Error updating typing status:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    handleTypingStatus(true);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && newMessage.trim()) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-4 bg-white border-t">
      <div className="flex gap-3 items-center max-w-4xl mx-auto">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 text-gray-500 hover:text-gray-600 hover:bg-gray-100/80 rounded-full"
          onClick={() => {
            toast({
              title: "Coming soon",
              description: "File attachments will be available soon!",
            });
          }}
        >
          <Plus className="w-6 h-6" />
        </Button>

        <div className="flex-1 flex items-center gap-2 bg-[#F1F1F1] rounded-full p-1">
          <Input
            value={newMessage}
            onChange={handleInputChange}
            onKeyDown={handleKeyPress}
            placeholder={editingMessage ? "Edit message..." : "iMessage"}
            className="bg-transparent border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500"
          />
          
          {!newMessage.trim() && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-gray-500 hover:text-gray-600 hover:bg-gray-100/80 rounded-full"
              onClick={() => setIsRecording(!isRecording)}
            >
              <Mic className="w-5 h-5" />
            </Button>
          )}
          
          {newMessage.trim() && (
            <Button
              variant="ghost"
              size="icon"
              className="shrink-0 text-nino-primary hover:bg-nino-primary/10 rounded-full"
              onClick={handleSendMessage}
            >
              <Send className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput;