import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Paperclip, Mic, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChatInputProps {
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  selectedChat: string | null;
  editingMessage?: {
    id: string;
    content: string;
  } | null;
  setEditingMessage?: (message: { id: string; content: string; } | null) => void;
}

export const ChatInput = ({
  newMessage,
  setNewMessage,
  handleSendMessage,
  isRecording,
  setIsRecording,
  selectedChat,
  editingMessage,
  setEditingMessage,
}: ChatInputProps) => {
  const { toast } = useToast();
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout>();

  useEffect(() => {
    if (!selectedChat) return;

    const updateTypingStatus = async (isTyping: boolean) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('typing_status')
        .upsert({
          user_id: user.id,
          chat_with: selectedChat,
          is_typing: isTyping,
        }, {
          onConflict: 'user_id,chat_with'
        });
    };

    if (isTyping) {
      updateTypingStatus(true);
    }

    return () => {
      updateTypingStatus(false);
    };
  }, [isTyping, selectedChat]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    setIsTyping(true);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const timeout = setTimeout(() => {
      setIsTyping(false);
    }, 1000);

    setTypingTimeout(timeout);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !selectedChat) {
        toast({
          title: "Error",
          description: "You must be logged in and have a chat selected to send files",
          variant: "destructive",
        });
        return;
      }

      const { data, error } = await supabase.storage
        .from('message-attachments')
        .upload(`${user.id}/${file.name}`, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('message-attachments')
        .getPublicUrl(data.path);

      await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: selectedChat,
        content: file.name,
        message_type: file.type.startsWith('image/') ? 'image' : 'file',
        media_url: publicUrl,
        media_type: file.type,
      });

      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    toast({
      title: "Coming soon",
      description: "Voice recording feature will be available soon",
    });
  };

  return (
    <div className="p-4 border-t bg-white/50 backdrop-blur-lg shadow-lg">
      <div className="flex gap-3 items-center max-w-4xl mx-auto">
        <input
          type="file"
          id="file-upload"
          className="hidden"
          accept="image/*,video/*,application/pdf"
          onChange={handleFileUpload}
        />
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-500 hover:bg-gray-100 rounded-full shadow-md"
          onClick={() => document.getElementById('file-upload')?.click()}
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={`text-gray-500 hover:bg-gray-100 rounded-full shadow-md ${isRecording ? 'bg-red-50' : ''}`}
          onClick={handleVoiceRecord}
        >
          <Mic className="w-5 h-5" />
        </Button>
        <Input
          value={newMessage}
          onChange={handleInputChange}
          placeholder={editingMessage ? "Edit message..." : "Message"}
          className="bg-white border shadow-md rounded-full focus-visible:ring-0 focus-visible:ring-offset-0"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button
          onClick={handleSendMessage}
          className="bg-nino-primary hover:bg-nino-primary/90 text-white rounded-full w-14 h-14 p-0 flex items-center justify-center transition-all active:scale-95 disabled:opacity-50 shadow-lg hover:shadow-xl"
          disabled={!newMessage.trim() && !selectedChat}
        >
          {editingMessage ? (
            <Edit className="w-6 h-6" />
          ) : (
            <Send className="w-6 h-6" />
          )}
        </Button>
      </div>
    </div>
  );
};