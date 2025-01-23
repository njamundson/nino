import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  selectedChat: string | null;
  editingMessage: { id: string; content: string; } | null;
  setEditingMessage: (message: { id: string; content: string; } | null) => void;
  isLoading?: boolean;
}

const ChatInput = ({ 
  newMessage, 
  setNewMessage, 
  handleSendMessage, 
  isRecording, 
  setIsRecording, 
  selectedChat,
  editingMessage,
  setEditingMessage,
  isLoading 
}: ChatInputProps) => {
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

  const updateTypingStatus = async (typing: boolean) => {
    if (!selectedChat) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('typing_status')
        .upsert(
          {
            user_id: user.id,
            chat_with: selectedChat,
            is_typing: typing
          },
          {
            onConflict: 'user_id,chat_with'
          }
        );

      if (error) {
        console.error('Error updating typing status:', error);
      }
    } catch (error) {
      console.error('Error in updateTypingStatus:', error);
    }
  };

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
      updateTypingStatus(false);
    };
  }, [selectedChat]);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
      updateTypingStatus(true);
    }

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      setIsTyping(false);
      updateTypingStatus(false);
    }, 2000);

    setTypingTimeout(timeout);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat) return;

    handleSendMessage();
    setIsTyping(false);
    updateTypingStatus(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-background">
      <div className="flex gap-2">
        <Textarea
          value={newMessage}
          onChange={(e) => {
            setNewMessage(e.target.value);
            handleTyping();
          }}
          placeholder="Type a message..."
          className="min-h-[44px] max-h-32"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button 
          type="submit" 
          size="icon"
          disabled={isLoading || !newMessage.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;