import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNewProposals = () => {
  const { data: newProposals = 0 } = useQuery({
    queryKey: ['new-proposals'],
    queryFn: async () => {
      try {
        console.log('Fetching new proposals count...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 0;

        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!brand) return 0;

        // Count pending applications for open opportunities
        const { count } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'pending')
          .in('opportunity_id', (query) => 
            query
              .from('opportunities')
              .select('id')
              .eq('brand_id', brand.id)
              .eq('status', 'open')
          );

        console.log('New proposals count:', count);
        return count || 0;
      } catch (error) {
        console.error('Error fetching new proposals:', error);
        return 0;
      }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 15, // Keep unused data for 15 minutes
  });

  return newProposals;
};