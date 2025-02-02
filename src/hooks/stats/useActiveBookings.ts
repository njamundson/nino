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

        // Count opportunities that have an accepted application and are active
        const { data: opportunities, error } = await supabase
          .from('opportunities')
          .select(`
            id,
            applications!inner (
              status
            )
          `)
          .eq('brand_id', brand.id)
          .eq('status', 'active')
          .eq('applications.status', 'accepted');

        if (error) {
          console.error('Error fetching active bookings:', error);
          return 0;
        }

        const count = opportunities?.length || 0;
        console.log('Active bookings count:', count);
        return count;
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