import { useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import CreatorCard from "./CreatorCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { CreatorData, CreatorType } from "@/types/creator";
import { motion } from "framer-motion";
import { useInfiniteQuery } from "@tanstack/react-query";

interface CreatorGridProps {
  selectedSpecialties: string[];
  selectedCreatorType: string | null;
  selectedLocations: string[];
}

const CREATORS_PER_PAGE = 12;

const CreatorGrid = ({
  selectedSpecialties,
  selectedCreatorType,
  selectedLocations,
}: CreatorGridProps) => {
  const isMobile = useIsMobile();
  const [error, setError] = useState<Error | null>(null);

  const filterConditions = useMemo(() => ({
    specialties: selectedSpecialties,
    creatorType: selectedCreatorType,
    locations: selectedLocations,
  }), [selectedSpecialties, selectedCreatorType, selectedLocations]);

  const baseQuery = useMemo(() => {
    return supabase
      .from('creators')
      .select(`
        id,
        user_id,
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
      .eq('onboarding_completed', true);
  }, []);

  const fetchCreators = useCallback(async ({ pageParam = 0 }) => {
    try {
      console.log("Fetching creators with filters:", { 
        ...filterConditions,
        page: pageParam
      });

      let query = baseQuery.range(
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
        creatorType: (creator.creator_type || 'solo') as CreatorType,
        instagram: creator.instagram || '',
        website: creator.website || '',
        profileImage: creator.profile_image_url || '',
        profile_image_url: creator.profile_image_url || '',
        profile: {
          first_name: creator.first_name || '',
          last_name: creator.last_name || ''
        }
      }));
      
      const hasMore = formattedCreators.length === CREATORS_PER_PAGE;
      return {
        creators: formattedCreators,
        nextPage: hasMore ? pageParam + 1 : null
      };
    } catch (error) {
      console.error("Error in fetchCreators:", error);
      setError(error instanceof Error ? error : new Error('An error occurred'));
      throw error;
    }
  }, [baseQuery, filterConditions]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ['creators', filterConditions],
    queryFn: fetchCreators,
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 30, // Keep unused data in cache for 30 minutes (increased from 10)
    retry: 2, // Limit retries to reduce unnecessary API calls
  });

  // Memoize the flattened creators array
  const allCreators = useMemo(() => {
    return data?.pages.flatMap(page => page.creators) || [];
  }, [data?.pages]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500">
          Error loading creators. Please try again.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`grid grid-cols-1 ${
        isMobile ? 'gap-4' : 'sm:grid-cols-2 lg:grid-cols-3 gap-6'
      }`}>
        {allCreators.map((creator, index) => (
          <motion.div
            key={creator.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ 
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: Math.min(index * 0.1, 0.3)
            }}
          >
            <CreatorCard 
              creator={creator}
              onInvite={() => {}} 
            />
          </motion.div>
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 bg-nino-primary text-white rounded-lg hover:bg-nino-primary/90 transition-colors disabled:opacity-50"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default CreatorGrid;
