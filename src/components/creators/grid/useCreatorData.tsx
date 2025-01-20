import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData } from "@/types/creator";

interface UseCreatorDataProps {
  selectedSpecialties: string[];
  selectedCreatorTypes: string[];
}

export const useCreatorData = ({ selectedSpecialties, selectedCreatorTypes }: UseCreatorDataProps) => {
  const [creators, setCreators] = useState<CreatorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        console.log("Fetching creators with selected specialties:", selectedSpecialties);
        console.log("Fetching creators with selected types:", selectedCreatorTypes);
        
        // First get the profile IDs of brands
        const { data: brandProfiles, error: brandError } = await supabase
          .from('brands')
          .select('user_id');

        if (brandError) {
          console.error("Error fetching brand profiles:", brandError);
          throw brandError;
        }

        // Filter out any null values and create a clean array of IDs
        const brandProfileIds = brandProfiles
          ?.map(b => b.user_id)
          .filter(id => id !== null && id !== undefined);
          
        console.log("Brand profile IDs to exclude:", brandProfileIds);

        // Then fetch creators excluding those profiles
        let query = supabase
          .from('creators')
          .select(`
            *,
            profile:profiles(
              first_name,
              last_name
            )
          `)
          .not('user_id', 'is', null);

        // Only add the brand profile filter if we have IDs to exclude
        if (brandProfileIds && brandProfileIds.length > 0) {
          query = query.not('user_id', 'in', `(${brandProfileIds.join(',')})`);
        }

        // Only apply specialty filter if specialties are selected
        if (selectedSpecialties.length > 0) {
          query = query.overlaps('specialties', selectedSpecialties);
        }

        // Apply creator type filter if types are selected
        if (selectedCreatorTypes.length > 0) {
          query = query.in('creator_type', selectedCreatorTypes);
        }

        const { data, error } = await query;

        if (error) {
          console.error("Error fetching creators:", error);
          throw error;
        }

        console.log("Fetched creators:", data);

        const formattedCreators: CreatorData[] = data.map(creator => ({
          id: creator.id,
          firstName: creator.profile?.first_name || "",
          lastName: creator.profile?.last_name || "",
          bio: creator.bio || "",
          specialties: creator.specialties || [],
          instagram: creator.instagram || "",
          website: creator.website || "",
          location: creator.location || "",
          profileImage: creator.profile_image_url,
          creatorType: creator.creator_type || "",
          profile: creator.profile
        }));

        console.log("Formatted creators:", formattedCreators);
        setCreators(formattedCreators);
      } catch (error) {
        console.error("Error in fetchCreators:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [selectedSpecialties, selectedCreatorTypes]);

  return { creators, loading };
};