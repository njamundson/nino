import { useEffect, useState, useRef, useCallback } from "react";
import CreatorCard from "./CreatorCard";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData, CreatorType } from "@/types/creator";
import { useIsMobile } from "@/hooks/use-mobile";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";

interface CreatorGridProps {
  selectedSpecialties: string[];
  selectedCreatorType: string | null;
  selectedLocations: string[];
  onInvite: (creatorId: string) => void;
}

const CREATORS_PER_PAGE = 9;

const CreatorGrid = ({ 
  selectedSpecialties, 
  selectedCreatorType, 
  selectedLocations,
  onInvite 
}: CreatorGridProps) => {
  const isMobile = useIsMobile();
  const { ref, inView } = useInView();

  const fetchCreators = async ({ pageParam = 0 }) => {
    const from = pageParam * CREATORS_PER_PAGE;
    const to = from + CREATORS_PER_PAGE - 1;

    const { data: brandProfiles } = await supabase
      .from('brands')
      .select('user_id');

    const brandProfileIds = brandProfiles
      ?.map(b => b.user_id)
      .filter(id => id !== null && id !== undefined);

    let query = supabase
      .from('creators')
      .select(`
        id,
        first_name,
        last_name,
        bio,
        specialties,
        instagram,
        website,
        location,
        profile_image_url,
        creator_type
      `)
      .not('user_id', 'is', null)
      .range(from, to);

    if (brandProfileIds && brandProfileIds.length > 0) {
      query = query.not('user_id', 'in', `(${brandProfileIds.join(',')})`);
    }

    if (selectedCreatorType) {
      query = query.eq('creator_type', selectedCreatorType);
    }

    if (selectedSpecialties.length > 0) {
      query = query.overlaps('specialties', selectedSpecialties);
    }

    if (selectedLocations.length > 0 && selectedLocations[0] !== "") {
      query = query.in('location', selectedLocations);
    }

    const { data, error } = await query;

    if (error) throw error;

    return data.map(creator => ({
      id: creator.id,
      firstName: creator.first_name || "",
      lastName: creator.last_name || "",
      bio: creator.bio || "",
      specialties: creator.specialties || [],
      instagram: creator.instagram || "",
      website: creator.website || "",
      location: creator.location || "",
      profileImage: creator.profile_image_url,
      creatorType: creator.creator_type as CreatorType || "solo",
      profile_image_url: creator.profile_image_url,
      profile: {
        first_name: creator.first_name,
        last_name: creator.last_name
      }
    }));
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status
  } = useInfiniteQuery({
    queryKey: ['creators', selectedSpecialties, selectedCreatorType, selectedLocations],
    queryFn: fetchCreators,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length === CREATORS_PER_PAGE ? pages.length : undefined;
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (status === 'loading') {
    return (
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-96 bg-gray-100 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">
          Error loading creators. Please try again later.
        </p>
      </div>
    );
  }

  const creators = data?.pages.flat() || [];

  if (!creators.length) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">
          No creators found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'md:grid-cols-2 lg:grid-cols-3 gap-6'}`}>
        {creators.map((creator) => (
          <CreatorCard
            key={creator.id}
            creator={creator}
            onInvite={() => onInvite(creator.id)}
          />
        ))}
      </div>
      <div ref={ref} className="h-10">
        {isFetchingNextPage && (
          <div className="flex justify-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorGrid;