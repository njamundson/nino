import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useNewProposals = () => {
  const { data: count = 0 } = useQuery({
    queryKey: ['new-proposals'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return 0;

      // First get the brand id for the current user
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!brand) return 0;

      // Then get applications for opportunities owned by this brand
      const { data: applications, error } = await supabase
        .from('applications')
        .select(`
          id,
          opportunity:opportunities!inner (
            brand_id
          )
        `)
        .eq('status', 'pending')
        .eq('opportunities.brand_id', brand.id);

      if (error) {
        console.error('Error fetching new proposals:', error);
        return 0;
      }

      return applications?.length || 0;
    }
  });

  return count;
};