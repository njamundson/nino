import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const [chats, setChats] = useState<ChatUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let mounted = true;
    let subscription: any = null;

    const fetchChats = async () => {
      if (!currentUserId) return;

      try {
        const { data: messages, error } = await supabase
          .from('messages')
          .select(`
            id,
            content,
            created_at,
            sender_id,
            receiver_id,
            read,
            sender:profiles!sender_profile_id (
              id,
              display_name,
              creator:creators (
                id,
                profile_image_url
              )
            ),
            receiver:profiles!receiver_profile_id (
              id,
              display_name,
              creator:creators (
                id,
                profile_image_url
              )
            )
          `)
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (mounted) {
          const conversationsMap = new Map();
          
          messages?.forEach((msg: any) => {
            const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
            const otherUser = msg.sender_id === currentUserId ? msg.receiver : msg.sender;
            
            const creatorInfo = otherUser?.creator?.[0];
            const display_name = otherUser?.display_name || 'User';
            const profileImage = creatorInfo?.profile_image_url || null;

            if (!conversationsMap.has(otherUserId) || 
                new Date(msg.created_at) > new Date(conversationsMap.get(otherUserId).created_at)) {
              conversationsMap.set(otherUserId, {
                ...msg,
                otherUser: {
                  id: otherUserId,
                  display_name,
                  profileImage
                }
              });
            }
          });

          setChats(Array.from(conversationsMap.values()));
        }
      } catch (error) {
        console.error('Error fetching chats:', error);
        toast({
          title: "Error",
          description: "Failed to load conversations",
          variant: "destructive",
        });
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    const setupSubscription = () => {
      subscription = supabase
        .channel('chat_updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'messages'
          },
          () => {
            if (mounted) fetchChats();
          }
        )
        .subscribe();
    };

    fetchChats();
    setupSubscription();

    return () => {
      mounted = false;
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [currentUserId, toast]);

  return {
    chats,
    isLoading
  };
};