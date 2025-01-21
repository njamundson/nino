import { useEffect, useState } from "react";
import CreatorCard from "./CreatorCard";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData } from "@/types/creator";

interface CreatorGridProps {
  selectedSpecialties: string[];
  selectedCreatorType: string | null;
  selectedLocations: string[];
  onInvite: (creatorId: string) => void;
}

const CreatorGrid = ({ 
  selectedSpecialties, 
  selectedCreatorType, 
  selectedLocations,
  onInvite 
}: CreatorGridProps) => {
  const [creators, setCreators] = useState<CreatorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      try {
        console.log("Fetching creators with filters:", { 
          selectedSpecialties, 
          selectedCreatorType,
          selectedLocations 
        });
        
        const { data: brandProfiles, error: brandError } = await supabase
          .from('brands')
          .select('user_id');

        if (brandError) {
          console.error("Error fetching brand profiles:", brandError);
          throw brandError;
        }

        const brandProfileIds = brandProfiles
          ?.map(b => b.user_id)
          .filter(id => id !== null && id !== undefined);
          
        console.log("Brand profile IDs to exclude:", brandProfileIds);

        let query = supabase
          .from('creators')
          .select(`
            *,
            profile:profiles!creators_user_id_fkey (
              first_name,
              last_name
            )
          `)
          .not('user_id', 'is', null);

        if (brandProfileIds && brandProfileIds.length > 0) {
          query = query.not('user_id', 'in', `(${brandProfileIds.join(',')})`);
        }

        if (selectedCreatorType) {
          query = query.eq('creator_type', selectedCreatorType);
        }

        if (selectedSpecialties.length > 0) {
          query = query.overlaps('specialties', selectedSpecialties);
        }

        if (selectedLocations.length > 0) {
          query = query.in('location', selectedLocations);
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
          creatorType: creator.creator_type as CreatorData['creatorType'],
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
  }, [selectedSpecialties, selectedCreatorType, selectedLocations]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="h-96 bg-gray-100 rounded-xl animate-pulse"
          />
        ))}
      </div>
    );
  }

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          onInvite={() => onInvite(creator.id)}
        />
      ))}
    </div>
  );
};

export default CreatorGrid;