import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/message";

export const useMessages = (selectedChat: string | null) => {
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string; } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) {
      toast({
        title: "Cannot send message",
        description: "Please select a recipient and enter a message",
        variant: "destructive",
      });
      return;
    }

    // Clear the message input
    setNewMessage("");
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
    handleSendMessage
  };
};