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
              brand:brands (
                id,
                user_id,
                company_name,
                brand_type,
                description,
                website,
                instagram,
                location,
                phone_number,
                support_email,
                profile_image_url,
                sms_notifications_enabled,
                two_factor_enabled,
                created_at,
                updated_at,
                onboarding_completed
              )
            ),
            creator:creators!inner (
              id,
              first_name,
              last_name,
              profile_image_url,
              location,
              instagram,
              website,
              creator_type,
              specialties,
              user_id
            )
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
            brand:brands (
              id,
              user_id,
              company_name,
              brand_type,
              description,
              website,
              instagram,
              location,
              phone_number,
              support_email,
              profile_image_url,
              sms_notifications_enabled,
              two_factor_enabled,
              created_at,
              updated_at,
              onboarding_completed
            )
          ),
          creator:creators (
            id,
            first_name,
            last_name,
            profile_image_url,
            location,
            instagram,
            website,
            creator_type,
            specialties,
            user_id
          )
        `)
        .eq('creator_id', creator.id);

      if (error) {
        console.error('Error fetching applications:', error);
        throw error;
      }

      console.log('Fetched applications data:', data);
      return data || [];
    },
    enabled: true
  });
};