import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useApplications = (brandId?: string) => {
  return useQuery({
    queryKey: ['applications', brandId],
    queryFn: async () => {
      try {
        console.log('Fetching applications...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          return [];
        }

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
            console.error('Error fetching brand applications:', error);
            throw error;
          }

          console.log('Fetched brand applications:', data);
          return data || [];
        }

        // Get the creator profile for the current user
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (creatorError) {
          console.error('Error fetching creator:', creatorError);
          throw creatorError;
        }

        if (!creator) {
          console.log('No creator profile found');
          return [];
        }

        // Fetch all applications for the creator, including both their submissions
        // and invitations from brands
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
      } catch (error) {
        console.error('Error in useApplications:', error);
        throw error;
      }
    },
    enabled: true
  });
};