import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useInfiniteQuery } from "@tanstack/react-query";
import { CreatorData, CreatorType } from "@/types/creator";

interface UseCreatorFetchProps {
  filterConditions: {
    specialties: string[];
    creatorType: string | null;
    locations: string[];
  };
  CREATORS_PER_PAGE: number;
}

export const useCreatorFetch = ({ filterConditions, CREATORS_PER_PAGE }: UseCreatorFetchProps) => {
  const fetchCreators = useCallback(async ({ pageParam = 0 }) => {
    try {
      let query = supabase
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
        .eq('onboarding_completed', true)
        .range(
          pageParam * CREATORS_PER_PAGE, 
          (pageParam + 1) * CREATORS_PER_PAGE - 1
        );

      if (filterConditions.specialties.length > 0) {
        query = query.contains('specialties', filterConditions.specialties);
      }

      if (filterConditions.creatorType) {
        query = query.eq('creator_type', filterConditions.creatorType);
      }

      if (filterConditions.locations.length > 0 && filterConditions.locations[0] !== "") {
        query = query.in('location', filterConditions.locations);
      }

      const { data: creatorsData, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching creators:", fetchError);
        throw fetchError;
      }

      if (!creatorsData) {
        return { creators: [], nextPage: null };
      }

      const formattedCreators: CreatorData[] = creatorsData.map(creator => ({
        id: creator.id,
        user_id: creator.user_id,
        display_name: creator.display_name || 'Creator',
        bio: creator.bio || '',
        location: creator.location || '',
        specialties: creator.specialties || [],
        creator_type: creator.creator_type as CreatorType || 'solo',
        instagram: creator.instagram || '',
        website: creator.website || '',
        profile_image_url: creator.profile_image_url || '',
      }));
      
      const hasMore = formattedCreators.length === CREATORS_PER_PAGE;
      return {
        creators: formattedCreators,
        nextPage: hasMore ? pageParam + 1 : null
      };
    } catch (error) {
      console.error("Error in fetchCreators:", error);
      throw error;
    }
  }, [filterConditions, CREATORS_PER_PAGE]);

  return useInfiniteQuery({
    queryKey: ['creators', filterConditions],
    queryFn: fetchCreators,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
    retry: 2,
  });
};