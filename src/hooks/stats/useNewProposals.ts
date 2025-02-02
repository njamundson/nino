import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNewProposals = () => {
  const { data: newProposals = 0 } = useQuery({
    queryKey: ['new-proposals-count'],
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

        // Count pending applications for all brand opportunities
        const { data, error } = await supabase
          .from('opportunities')
          .select(`
            id,
            applications!inner (
              id,
              status
            )
          `)
          .eq('brand_id', brand.id)
          .eq('applications.status', 'pending');

        if (error) {
          console.error('Error fetching new proposals:', error);
          return 0;
        }

        const count = data?.length || 0;
        console.log('New proposals count:', count);
        return count;
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