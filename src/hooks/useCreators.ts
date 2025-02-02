import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Creator } from "@/types/creator";
import { mapCreatorData } from "@/utils/creatorUtils";

export const useCreators = () => {
  return useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      console.log('Fetching creators data');
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

      if (error) {
        console.error('Error fetching creators:', error);
        throw error;
      }
      
      return data.map(creator => mapCreatorData(creator));
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 10, // Keep unused data in cache for 10 minutes
    refetchOnMount: false, // Don't refetch on mount if data exists
    refetchOnWindowFocus: false, // Don't refetch on window focus
    initialData: [], // Start with empty array to prevent undefined
  });
};