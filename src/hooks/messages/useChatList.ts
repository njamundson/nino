import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatUser {
  id: string;
  otherUser: {
    id: string;
    firstName: string;
    lastName: string;
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
            sender:sender_profile_id (
              id,
              first_name,
              last_name,
              user_id
            ),
            receiver:receiver_profile_id (
              id,
              first_name,
              last_name,
              user_id
            )
          `)
          .or(`sender_id.eq.${currentUserId},receiver_id.eq.${currentUserId}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        if (mounted) {
          const conversationsMap = new Map();
          
          for (const msg of messages || []) {
            const otherUserId = msg.sender_id === currentUserId ? msg.receiver_id : msg.sender_id;
            const otherUser = msg.sender_id === currentUserId ? msg.receiver : msg.sender;
            
            if (!otherUser?.user_id) continue;

            // Fetch additional user info
            const { data: creatorData } = await supabase
              .from('creators')
              .select('first_name, last_name, profile_image_url')
              .eq('user_id', otherUser.user_id)
              .single();

            const { data: brandData } = await supabase
              .from('brands')
              .select('company_name, profile_image_url')
              .eq('user_id', otherUser.user_id)
              .single();

            let firstName = '', lastName = '', profileImage = null;

            if (creatorData) {
              firstName = creatorData.first_name;
              lastName = creatorData.last_name;
              profileImage = creatorData.profile_image_url;
            } else if (brandData) {
              firstName = brandData.company_name;
              profileImage = brandData.profile_image_url;
            } else {
              firstName = otherUser.first_name || '';
              lastName = otherUser.last_name || '';
            }

            // Only update the map if this is a more recent message for this conversation
            if (!conversationsMap.has(otherUserId) || 
                new Date(msg.created_at) > new Date(conversationsMap.get(otherUserId).created_at)) {
              conversationsMap.set(otherUserId, {
                ...msg,
                otherUser: {
                  id: otherUserId,
                  firstName,
                  lastName,
                  profileImage
                }
              });
            }
          }

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