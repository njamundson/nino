import { useQuery } from "@tanstack/react-query";
import CreatorCard from "./CreatorCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  user_id: string;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
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
          profile:profiles(first_name, last_name)
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {creators.map((creator) => (
        <CreatorCard key={creator.id} creator={creator} />
      ))}
    </div>
  );
};

export default CreatorGrid;