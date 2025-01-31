import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData, CreatorType } from "@/types/creator";

export const useCreatorFetch = (searchTerm: string = "") => {
  return useInfiniteQuery({
    queryKey: ["creators", searchTerm],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * 12;
      const to = from + 11;

      let query = supabase
        .from("creators")
        .select(`
          id,
          user_id,
          display_name,
          first_name,
          last_name,
          bio,
          location,
          specialties,
          creator_type,
          instagram,
          website,
          profile_image_url
        `)
        .range(from, to);

      if (searchTerm) {
        query = query.ilike("display_name", `%${searchTerm}%`);
      }

      const { data: creators, error } = await query;

      if (error) {
        console.error("Error fetching creators:", error);
        return { creators: [], nextPage: null };
      }

      const formattedCreators: CreatorData[] = creators.map((creator) => ({
        id: creator.id,
        user_id: creator.user_id,
        display_name: creator.display_name || 'Creator',
        first_name: creator.first_name || '',
        last_name: creator.last_name || '',
        bio: creator.bio || '',
        location: creator.location || '',
        specialties: creator.specialties || [],
        creator_type: creator.creator_type as CreatorType || 'solo',
        instagram: creator.instagram || '',
        website: creator.website || '',
        profile_image_url: creator.profile_image_url || '',
        notifications_enabled: true,
        onboarding_completed: true
      }));

      return {
        creators: formattedCreators,
        nextPage: creators.length === 12 ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });
};