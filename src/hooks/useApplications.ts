import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useApplications = (brandId?: string) => {
  return useQuery({
    queryKey: ['applications', brandId],
    queryFn: async () => {
      if (!brandId) return [];
      
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities!inner (
            *,
            brand:brands!inner (*)
          ),
          creator:creators (
            *,
            user_id,
            profile:profiles (
              first_name,
              last_name
            )
          )
        `)
        .eq('status', 'pending')
        .eq('opportunities.brand_id', brandId);

      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }

      return data || [];
    },
    enabled: !!brandId
  });
};