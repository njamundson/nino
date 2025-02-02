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
        if (!user) return;

        console.log('Checking brand access...');
        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (brand) {
          // Prefetch active bookings
          queryClient.prefetchQuery({
            queryKey: ['brand-active-bookings-list'],
            queryFn: async () => {
              const { data } = await supabase
                .from('opportunities')
                .select(`
                  *,
                  applications!inner (
                    *,
                    creator:creators(*)
                  )
                `)
                .eq('brand_id', brand.id)
                .eq('status', 'active')
                .eq('applications.status', 'accepted');
              return data || [];
            },
            staleTime: 1000 * 60 * 5,
          });

          // Prefetch other necessary data
          queryClient.prefetchQuery({
            queryKey: ['other-query-key'], // Replace with actual query key
            queryFn: async () => {
              // Fetch other data as needed
            },
            staleTime: 1000 * 60 * 5,
          });
        }

        console.log('Data prefetching completed successfully');
      } catch (error) {
        console.error('Error during data prefetch:', error);
      }
    };

    prefetchData();
  }, [queryClient]);
};
