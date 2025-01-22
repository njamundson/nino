import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Message } from "@/types/message";

export const useMessages = (selectedChat: string | null) => {
  const [newMessage, setNewMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [editingMessage, setEditingMessage] = useState<{ id: string; content: string; } | null>(null);
  const { toast } = useToast();

  const { data: messages = [], refetch } = useQuery({
    queryKey: ["messages", selectedChat],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          profiles!messages_sender_id_fkey(
            first_name,
            last_name
          ),
          reactions:message_reactions(*)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }
      return data as Message[];
    },
    enabled: !!selectedChat,
  });

  useEffect(() => {
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) {
      toast({
        title: "Cannot send message",
        description: "Please select a recipient and enter a message",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to send messages",
          variant: "destructive",
        });
        return;
      }

      if (editingMessage) {
        const { error } = await supabase
          .from("messages")
          .update({
            content: newMessage,
            is_edited: true,
          })
          .eq('id', editingMessage.id);

        if (error) throw error;
        setEditingMessage(null);
      } else {
        const { error } = await supabase
          .from("messages")
          .insert({
            content: newMessage,
            sender_id: user.id,
            receiver_id: selectedChat,
            message_type: 'text',
            read: false,
          });

        if (error) throw error;
      }

      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  return {
    messages,
    newMessage,
    setNewMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
    handleSendMessage,
  };
};