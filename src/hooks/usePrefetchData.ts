import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePrefetchData = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetchData = async () => {
      console.log('Starting data prefetch...');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found during prefetch');
          return;
        }

        // Prefetch chat list
        queryClient.prefetchQuery({
          queryKey: ['chat-list', user.id],
          queryFn: async () => {
            const { data: messages } = await supabase
              .from('messages')
              .select(`
                id,
                content,
                created_at,
                sender_id,
                receiver_id,
                read
              `)
              .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
              .order('created_at', { ascending: false })
              .limit(20);
            return messages || [];
          },
        });

        // Prefetch notifications
        queryClient.prefetchQuery({
          queryKey: ['notifications'],
          queryFn: async () => {
            const { data: messages } = await supabase
              .from('messages')
              .select('*')
              .eq('receiver_id', user.id)
              .eq('read', false)
              .order('created_at', { ascending: false });
            return messages || [];
          },
        });

      } catch (error) {
        console.error('Error during data prefetch:', error);
      }
    };

    prefetchData();
  }, [queryClient]);
};