import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      console.log('Fetching messages for conversation between:', user.id, 'and', userId);

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

      return data as Message[];
    },
    enabled: Boolean(userId),
    staleTime: 1000,
    refetchInterval: false
  });

  useEffect(() => {
    if (!userId) return;

    const setupSubscription = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      console.log('Setting up real-time message subscription...');
      
      const channel = supabase
        .channel(`messages:${userId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages',
            filter: `or(and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id}))`
          },
          async (payload) => {
            console.log('Real-time message update:', payload);
            
            // For inserts, add the message to the existing messages
            if (payload.eventType === 'INSERT') {
              const newMessage = payload.new as Message;
              queryClient.setQueryData(['messages', userId], (old: Message[] = []) => {
                if (!old.some(msg => msg.id === newMessage.id)) {
                  return [...old, newMessage];
                }
                return old;
              });
            }
            
            // For updates, update the existing message
            if (payload.eventType === 'UPDATE') {
              queryClient.setQueryData(['messages', userId], (old: Message[] = []) => {
                return old.map(msg => 
                  msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
                );
              });
            }
            
            // For deletes, remove the message
            if (payload.eventType === 'DELETE') {
              queryClient.setQueryData(['messages', userId], (old: Message[] = []) => {
                return old.filter(msg => msg.id !== payload.old.id);
              });
            }
          }
        )
        .subscribe();

      return () => {
        console.log('Cleaning up message subscription');
        supabase.removeChannel(channel);
      };
    };

    setupSubscription();
  }, [userId, queryClient]);

  const handleSendMessage = async () => {
    if (!userId || !newMessage.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to send messages",
          variant: "destructive",
        });
        return;
      }

      // Get the profile IDs for sender and receiver
      const { data: senderProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      const { data: receiverProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (!senderProfile || !receiverProfile) {
        toast({
          title: "Error",
          description: "Could not find user profiles",
          variant: "destructive",
        });
        return;
      }

      const messageData = {
        sender_id: user.id,
        receiver_id: userId,
        content: newMessage,
        message_type: 'text',
        sender_profile_id: senderProfile.id,
        receiver_profile_id: receiverProfile.id
      };

      const { error } = await supabase
        .from('messages')
        .insert(messageData);

      if (error) throw error;

      // Clear input
      setNewMessage('');
      
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  const setMessages = (updater: Message[] | ((prev: Message[] | undefined) => Message[])) => {
    queryClient.setQueryData(['messages', userId], updater);
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