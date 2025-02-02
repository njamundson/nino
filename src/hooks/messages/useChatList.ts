import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";

interface ChatUser {
  id: string;
  otherUser: {
    id: string;
    display_name: string;
    profileImage: string | null;
  };
  content: string;
  created_at: string;
  sender_id: string;
  read: boolean;
}

export const useChatList = (currentUserId: string | undefined) => {
  const { toast } = useToast();

  const { data: chats = [], isLoading } = useQuery({
    queryKey: ['chat-list', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return [];

      try {
        console.log('Fetching chat list for user:', currentUserId);
        
        // First, get all messages
        const { data: messages, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            sender_id,
            receiver_id,
            read
          `)
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Get unique user IDs from messages (excluding current user)
        const uniqueUserIds = [...new Set(messages.map(msg => 
          msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id
        ))];

        // Fetch creator information for these users
        const { data: creators, error: creatorsError } = await supabase
          .from('creators')
          .select('user_id, display_name, profile_image_url')
          .in('user_id', uniqueUserIds);

        if (creatorsError) throw creatorsError;

        // Create a map of user_id to creator info for easy lookup
        const creatorMap = new Map(
          creators?.map(creator => [creator.user_id, creator]) || []
        );

        const conversationsMap = new Map();
        
        messages.forEach((msg) => {
          const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
          const creatorInfo = creatorMap.get(otherUserId);
          
          if (!conversationsMap.has(otherUserId) || 
              new Date(msg.created_at) > new Date(conversationsMap.get(otherUserId).created_at)) {
            conversationsMap.set(otherUserId, {
              ...msg,
              otherUser: {
                id: otherUserId,
                display_name: creatorInfo?.display_name || 'Creator',
                profileImage: creatorInfo?.profile_image_url
              }
            });
          }
        });

        return Array.from(conversationsMap.values());
      } catch (error) {
        console.error('Error fetching chats:', error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
        return [];
      }
    },
    staleTime: 1000 * 30, // Consider data fresh for 30 seconds
    gcTime: 1000 * 60 * 5, // Keep unused data for 5 minutes
    retry: 2,
    refetchInterval: 1000 * 30, // Refetch every 30 seconds
  });

  return {
    chats,
    isLoading
  };
};