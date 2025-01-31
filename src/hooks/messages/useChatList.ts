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
            sender:profiles!sender_profile_id (
              id,
              first_name,
              last_name,
              creator:creators (
                id,
                first_name,
                last_name,
                profile_image_url
              ),
              brand:brands (
                id,
                company_name,
                profile_image_url
              )
            ),
            receiver:profiles!receiver_profile_id (
              id,
              first_name,
              last_name,
              creator:creators (
                id,
                first_name,
                last_name,
                profile_image_url
              ),
              brand:brands (
                id,
                company_name,
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
            
            // Get name and profile image based on user type (creator or brand)
            let firstName = '', lastName = '', profileImage = null;
            
            if (otherUser?.creator) {
              firstName = otherUser.creator.first_name;
              lastName = otherUser.creator.last_name;
              profileImage = otherUser.creator.profile_image_url;
            } else if (otherUser?.brand) {
              firstName = otherUser.brand.company_name;
              profileImage = otherUser.brand.profile_image_url;
            } else {
              firstName = otherUser?.first_name || '';
              lastName = otherUser?.last_name || '';
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