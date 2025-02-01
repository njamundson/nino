import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Creator } from "@/types/creator";
import { mapCreatorData } from "@/utils/creatorUtils";

export const useCreators = () => {
  return useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creators')
        .select(`
          id,
          user_id,
          display_name,
          bio,
          location,
          specialties,
          creator_type,
          instagram,
          website,
          profile_image_url
        `)
        .eq('onboarding_completed', true);

      if (error) throw error;
      
      // Map the raw data to match the Creator type
      return data.map(creator => mapCreatorData(creator));
    }
  });
};