import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNewProposals = () => {
  const { data: count = 0 } = useQuery({
    queryKey: ['new-proposals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!brand) return 0;

      const { data: applications } = await supabase
        .from('applications')
        .select(`
          id,
          opportunity:opportunities!inner (
            brand_id
          )
        `)
        .eq('status', 'pending')
        .eq('opportunities.brand_id', brand.id);

      return applications?.length || 0;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    gcTime: 1000 * 60 * 15, // Keep unused data for 15 minutes
  });

  return count;
};