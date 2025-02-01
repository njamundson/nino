import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Creator } from "@/types/creator";

export const useCreators = () => {
  return useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const { data: creators, error } = await supabase
        .from('creators')
        .select(`
          id,
          display_name,
          bio,
          location,
          specialties,
          creator_type,
          instagram,
          website,
          profile_image_url,
          profile:profiles(display_name)
        `)
        .eq('onboarding_completed', true);

      if (error) {
        console.error('Error fetching creators:', error);
        throw error;
      }

      return creators.map((creator): Creator => ({
        id: creator.id,
        bio: creator.bio || '',
        location: creator.location || '',
        specialties: creator.specialties || [],
        creator_type: creator.creator_type || '',
        instagram: creator.instagram || '',
        website: creator.website || '',
        profileImage: creator.profile_image_url || '',
        profile_image_url: creator.profile_image_url || '',
        profile: {
          display_name: creator.profile?.display_name || creator.display_name || 'Creator'
        }
      }));
    }
  });
};