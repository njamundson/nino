import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useApplications = () => {
  return useQuery({
    queryKey: ['received-applications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!brand) throw new Error("Brand profile not found");

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities (
            title,
            description,
            location,
            start_date,
            payment_details,
            compensation_details,
            brand:brands (
              company_name,
              brand_type
            )
          ),
          creator:creators (
            id,
            bio,
            instagram,
            website,
            location,
            user_id
          )
        `)
        .eq('opportunity.brand_id', brand.id);

      if (error) throw error;

      if (data) {
        const creatorUserIds = data
          .map(app => app.creator?.user_id)
          .filter((id): id is string => id != null);

        if (creatorUserIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', creatorUserIds);

          return data.map(application => ({
            ...application,
            creator: application.creator ? {
              ...application.creator,
              profile: profiles?.find(p => p.id === application.creator.user_id) || null
            } : null
          }));
        }
      }

      return data || [];
    },
    meta: {
      errorMessage: "Failed to load applications"
    }
  });
};