import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message";
import { useState } from "react";

interface UseMessagesReturn {
  data: Message[];
  setMessages: (messages: Message[] | ((prev: Message[] | undefined) => Message[])) => void;
  isLoading: boolean;
  error: Error | null;
  newMessage: string;
  setNewMessage: (message: string) => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  editingMessage: { id: string; content: string; } | null;
  setEditingMessage: (message: { id: string; content: string; } | null) => void;
  handleSendMessage: () => void;
}

export const useMessages = (userId: string): UseMessagesReturn => {
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string; } | null>(null);

  const { data = [], isLoading, error, setData: setMessages } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          receiver_id,
          read,
          message_type,
          updated_at
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      return data as Message[];
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: 2
  });

  const handleSendMessage = () => {
    // Implementation will be handled by the component
  };

  return {
    data,
    setMessages,
    isLoading,
    error,
    newMessage,
    setNewMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
    handleSendMessage
  };
};