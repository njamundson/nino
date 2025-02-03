import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Creator } from "@/types/creator";
import { mapCreatorData } from "@/utils/creatorUtils";

export const useCreators = () => {
  return useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      console.log('Fetching creators');
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
      
      return data.map(creator => mapCreatorData(creator));
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes (renamed from cacheTime)
    refetchOnWindowFocus: false, // Disable automatic refetch on window focus
    refetchOnMount: false, // Disable automatic refetch on mount
  });
};