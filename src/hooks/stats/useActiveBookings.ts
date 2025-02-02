import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useActiveBookings = () => {
  const { data: activeBookings = 0 } = useQuery({
    queryKey: ['active-bookings'],
    queryFn: async () => {
      try {
        console.log('Fetching active bookings count...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 0;

        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!brand) return 0;

        // Count opportunities that have an accepted application and haven't ended yet
        const { count } = await supabase
          .from('opportunities')
          .select('*', { count: 'exact', head: true })
          .eq('brand_id', brand.id)
          .eq('status', 'active')
          .exists(
            'applications',
            (query) => query.eq('status', 'accepted')
          );

        console.log('Active bookings count:', count);
        return count || 0;
      } catch (error) {
        console.error('Error fetching active bookings:', error);
        return 0;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 15, // Keep unused data for 15 minutes
  });

  return activeBookings;
};