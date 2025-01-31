import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData, CreatorType } from "@/types/creator";

interface CreatorFetchProps {
  filterConditions: {
    specialties: string[];
    creatorType: string;
    locations: string[];
  };
  CREATORS_PER_PAGE: number;
}

export const useCreatorFetch = ({ filterConditions, CREATORS_PER_PAGE }: CreatorFetchProps) => {
  return useInfiniteQuery({
    queryKey: ["creators", filterConditions],
    queryFn: async ({ pageParam = 0 }) => {
      const from = pageParam * CREATORS_PER_PAGE;
      const to = from + (CREATORS_PER_PAGE - 1);

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
          profile_image_url,
          notifications_enabled,
          onboarding_completed
        `)
        .range(from, to);

      if (filterConditions.specialties.length > 0) {
        query = query.contains('specialties', filterConditions.specialties);
      }

      if (filterConditions.creatorType) {
        query = query.eq('creator_type', filterConditions.creatorType);
      }

      if (filterConditions.locations.length > 0) {
        query = query.in('location', filterConditions.locations);
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
        notifications_enabled: creator.notifications_enabled ?? true,
        onboarding_completed: creator.onboarding_completed ?? false
      }));

      return {
        creators: formattedCreators,
        nextPage: creators.length === CREATORS_PER_PAGE ? pageParam + 1 : null,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0
  });
};