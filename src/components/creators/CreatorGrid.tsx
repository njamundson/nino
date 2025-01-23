import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import CreatorCard from "./CreatorCard";
import { useIsMobile } from "@/hooks/use-mobile";
import { CreatorData } from "@/types/creator";

interface CreatorGridProps {
  selectedSpecialties: string[];
  selectedCreatorType: string | null;
  selectedLocations: string[];
}

const CreatorGrid = ({
  selectedSpecialties,
  selectedCreatorType,
  selectedLocations,
}: CreatorGridProps) => {
  const [creators, setCreators] = useState<CreatorData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMobile = useIsMobile();

  const fetchCreators = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Fetching creators with filters:", { 
        selectedSpecialties, 
        selectedCreatorType,
        selectedLocations 
      });

      let query = supabase
        .from('creators')
        .select(`
          id,
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

      if (selectedSpecialties.length > 0) {
        query = query.contains('specialties', selectedSpecialties);
      }

      if (selectedCreatorType) {
        query = query.eq('creator_type', selectedCreatorType);
      }

      if (selectedLocations.length > 0) {
        query = query.in('location', selectedLocations);
      }

      const { data: creatorsData, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      if (!creatorsData) {
        setCreators([]);
        return;
      }

      const formattedCreators: CreatorData[] = creatorsData.map(creator => ({
        id: creator.id,
        firstName: creator.first_name || '',
        lastName: creator.last_name || '',
        bio: creator.bio || '',
        location: creator.location || '',
        specialties: creator.specialties || [],
        creatorType: creator.creator_type || '',
        instagram: creator.instagram || '',
        website: creator.website || '',
        profile_image_url: creator.profile_image_url,
        profileImage: creator.profile_image_url,
        profile: {
          first_name: creator.first_name,
          last_name: creator.last_name
        }
      }));

      console.log("Fetched creators:", formattedCreators);
      setCreators(formattedCreators);
    } catch (error) {
      console.error("Error in fetchCreators:", error);
      setError(error instanceof Error ? error : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  }, [selectedSpecialties, selectedCreatorType, selectedLocations]);

  useEffect(() => {
    fetchCreators();
  }, [fetchCreators]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500">
          Error loading creators. Please try again.
        </p>
      </div>
    );
  }

  if (loading) {
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
    <div className={`grid grid-cols-1 ${
      isMobile ? 'gap-4' : 'sm:grid-cols-2 lg:grid-cols-3 gap-6'
    }`}>
      {creators.map((creator) => (
        <CreatorCard 
          key={creator.id} 
          creator={creator} 
          onInvite={() => {}} // Add empty handler since it's required
        />
      ))}
    </div>
  );
};

export default CreatorGrid;