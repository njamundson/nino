import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useApplications = (brandId?: string) => {
  return useQuery({
    queryKey: ['applications', brandId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // If brandId is provided, fetch applications for that brand
      if (brandId) {
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            opportunity:opportunities!inner (
              *,
              brand:brands (*)
            ),
            creator:creators!inner (*)
          `)
          .eq('status', 'pending')
          .eq('opportunities.brand_id', brandId);

        if (error) {
          console.error('Error fetching applications:', error);
          throw error;
        }

        console.log('Fetched applications data:', data);
        return data || [];
      }

      // Otherwise, fetch all applications for the creator
      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!creator) return [];

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities (
            *,
            brand:brands (*)
          ),
          creator:creators (*)
        `)
        .eq('creator_id', creator.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }

      console.log('Raw applications data:', data);

      // Add is_invitation flag based on who initiated the application
      const applicationsWithFlag = data?.map(app => ({
        ...app,
        is_invitation: app.initiated_by === 'brand'
      })) || [];

      console.log('Processed applications with flags:', applicationsWithFlag);
      return applicationsWithFlag;
    },
    enabled: true
  });
};