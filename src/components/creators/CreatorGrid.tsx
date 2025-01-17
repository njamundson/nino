import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CreatorCard from "./CreatorCard";
import CreatorFilters from "./CreatorFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  instagram: string | null;
  website: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  imageUrl: string;
}

const CreatorGrid = () => {
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

  const { data: creators, isLoading } = useQuery({
    queryKey: ['verified-creators'],
    queryFn: async () => {
      const { data: creatorsData, error } = await supabase
        .from('creators')
        .select(`
          id,
          bio,
          location,
          specialties,
          instagram,
          website,
          profile:profiles (
            first_name,
            last_name
          )
        `)
        .eq('is_verified', true);

      if (error) {
        console.error("Error fetching creators:", error);
        return [];
      }

      // Transform the data to match our interface
      return creatorsData.map(creator => ({
        ...creator,
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" // Placeholder for now
      }));
    }
  });

  const handleSpecialtyChange = (specialty: string) => {
    setSelectedSpecialties(prev =>
      prev.includes(specialty)
        ? prev.filter(s => s !== specialty)
        : [...prev, specialty]
    );
  };

  const filteredCreators = selectedSpecialties.length > 0
    ? creators?.filter(creator =>
        creator.specialties?.some(specialty =>
          selectedSpecialties.includes(specialty)
        )
      )
    : creators;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-[3/4] rounded-3xl" />
        ))}
      </div>
    );
  }

  if (!creators || creators.length === 0) {
    return (
      <Card className="p-6 rounded-xl">
        <div className="text-center text-muted-foreground">
          No verified creators found.
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      <CreatorFilters
        selectedSpecialties={selectedSpecialties}
        onSpecialtyChange={handleSpecialtyChange}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators?.map((creator) => (
          <CreatorCard key={creator.id} creator={creator} />
        ))}
      </div>
    </div>
  );
};

export default CreatorGrid;