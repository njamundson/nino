import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Message } from "@/types/message";

export const useMessageQueries = (userId: string) => {
  const queryClient = useQueryClient();

  const { data = [], isLoading, error } = useQuery({
    queryKey: ['messages', userId],
    queryFn: async () => {
      if (!userId) return [];

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
          sender:profiles!sender_profile_id(display_name),
          receiver:profiles!receiver_profile_id(display_name)
        `)
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data as Message[];
    },
    enabled: Boolean(userId),
    staleTime: 1000 * 60,
    gcTime: 1000 * 60 * 5,
  });

  const setMessages = (updater: Message[] | ((prev: Message[] | undefined) => Message[])) => {
    queryClient.setQueryData(['messages', userId], updater);
  };

  return {
    data,
    isLoading,
    error,
    setMessages
  };
};