import { useEffect, useState } from "react";
import CreatorCard from "./CreatorCard";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData } from "@/types/creator";

interface CreatorGridProps {
  selectedSpecialties: string[];
}

const CreatorGrid = ({ selectedSpecialties }: CreatorGridProps) => {
  const [creators, setCreators] = useState<CreatorData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCreators = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('creators')
          .select(`
            *,
            profiles:profiles(first_name, last_name)
          `);

        if (selectedSpecialties.length > 0) {
          query = query.contains('specialties', selectedSpecialties);
        }

        const { data, error } = await query;

        if (error) throw error;

        const formattedCreators = data.map(creator => ({
          firstName: creator.profiles.first_name,
          lastName: creator.profiles.last_name,
          bio: creator.bio || '',
          specialties: creator.specialties || [],
          instagram: creator.instagram || '',
          website: creator.website || '',
          location: creator.location || '',
          paymentDetails: '',
          profileImage: null
        }));

        setCreators(formattedCreators);
      } catch (error) {
        console.error('Error fetching creators:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreators();
  }, [selectedSpecialties]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className="h-64 bg-gray-100 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (creators.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">
          No creators found matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator, index) => (
        <CreatorCard key={index} creator={creator} />
      ))}
    </div>
  );
};

export default CreatorGrid;