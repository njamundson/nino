import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message";
import { useState, useEffect } from "react";

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
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      if (!userId) {
        return [];
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

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
          updated_at,
          media_url,
          media_type,
          sender_profile_id,
          receiver_profile_id,
          profiles:profiles!sender_profile_id (
            first_name,
            last_name
          )
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }

      return (data || []).map(msg => ({
        ...msg,
        profiles: {
          first_name: msg.profiles?.first_name || '',
          last_name: msg.profiles?.last_name || ''
        }
      })) as Message[];
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 30,
    gcTime: 1000 * 60 * 5,
    refetchInterval: 10000,
    refetchOnWindowFocus: true,
    retry: 2
  });

  // Subscribe to real-time updates
  useEffect(() => {
    if (!userId) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    console.log('Setting up real-time message subscription in hook...');
    
    const channel = supabase
      .channel('messages_hook')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id}))`
        },
        (payload) => {
          console.log('Message update in hook:', payload);
          queryClient.invalidateQueries({ queryKey: ['messages', userId] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up message subscription in hook');
      supabase.removeChannel(channel);
    };
  }, [userId, queryClient]);

  const setMessages = (updater: Message[] | ((prev: Message[] | undefined) => Message[])) => {
    queryClient.setQueryData(['messages', userId], updater);
  };

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