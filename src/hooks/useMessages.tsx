import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message";
import { useState } from "react";

interface UseMessagesReturn {
  data: Message[];
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

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      // Only fetch messages if we have a valid userId
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
          read
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      return data as Message[];
    },
    enabled: Boolean(userId), // Only run the query if we have a userId
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 10000, // Refetch every 10 seconds
    refetchOnWindowFocus: true,
    retry: 2
  });

  const handleSendMessage = () => {
    // Implementation will be handled by the component
  };

  return {
    data,
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