import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import CreatorCard from "./CreatorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

interface Creator {
  id: string;
  bio: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  location: string | null;
  specialties: string[] | null;
}

const CreatorGrid = () => {
  const { data: creators, isLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('creators')
        .select(`
          id,
          bio,
          location,
          specialties,
          user_id,
          profile:profiles!user_id(
            first_name,
            last_name
          )
        `)
        .eq('is_verified', true);

      if (error) {
        console.error('Error fetching creators:', error);
        throw error;
      }
      return data as Creator[];
    },
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="aspect-[3/4] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (!creators || creators.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No verified creators found.
        </div>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {creators.map((creator) => (
        <CreatorCard 
          key={creator.id} 
          creator={creator}
          onSelect={(creator) => {
            console.log('Selected creator:', creator);
            // Implement selection logic here
          }}
        />
      ))}
    </div>
  );
};

export default CreatorGrid;