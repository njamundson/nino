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

        if (mounted && messages) {
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