import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useApplications = (brandId?: string) => {
  return useQuery({
    queryKey: ['applications', brandId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Get creator id
      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creator) return [];

      // If brandId is provided, fetch applications for that brand
      if (brandId) {
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
      }

      // Otherwise, fetch all applications for the creator
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities (
            *,
            brand:brands (*)
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
        .eq('creator_id', creator.id);

      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }

      return data || [];
    },
    enabled: true
  });
};
