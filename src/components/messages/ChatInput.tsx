import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, Send, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  selectedChat: string | null;
  editingMessage: { id: string; content: string; } | null;
  setEditingMessage: (message: { id: string; content: string; } | null) => void;
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
}: ChatInputProps) => {
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  const updateTypingStatus = async (isTyping: boolean) => {
    if (!selectedChat) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('typing_status')
        .upsert({
          user_id: user.id,
          chat_with: selectedChat,
          is_typing: isTyping
        }, {
          onConflict: 'user_id,chat_with'
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error updating typing status:', error);
      toast({
        title: "Error",
        description: "Failed to update typing status",
        variant: "destructive",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    updateTypingStatus(true);

    const timeout = setTimeout(() => {
      updateTypingStatus(false);
    }, 2000);

    setTypingTimeout(timeout);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleSend = () => {
    if (newMessage.trim()) {
      handleSendMessage();
      updateTypingStatus(false);
    }
  };

  return (
    <div className="p-4 border-t border-gray-100 bg-white">
      <div className="flex items-center gap-2">
        {editingMessage && (
          <div className="absolute -top-8 left-0 right-0 bg-gray-50 p-2 text-sm text-gray-600 flex items-center justify-between">
            <span>Editing message</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditingMessage(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
        <input
          type="text"
          value={newMessage}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 bg-gray-50 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
        />
        <div className="flex items-center gap-2">
          {!isRecording && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsRecording(true);
                toast({
                  title: "Recording started",
                  description: "Click again to stop recording",
                });
              }}
              className="rounded-full"
            >
              <Mic className="h-5 w-5 text-gray-500" />
            </Button>
          )}
          <Button
            onClick={handleSend}
            disabled={!newMessage.trim() && !isRecording}
            className="rounded-full"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;