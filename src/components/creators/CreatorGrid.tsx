import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData } from "@/types/creator";
import CreatorCard from "./CreatorCard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CreatorGridProps {
  selectedSpecialties: string[];
  onInvite: (creatorId: string) => void;
}

const CreatorGrid = ({ selectedSpecialties, onInvite }: CreatorGridProps) => {
  const { toast } = useToast();

  const { data: creators, isLoading, error } = useQuery({
    queryKey: ["creators", selectedSpecialties],
    queryFn: async () => {
      console.log("Fetching creators with specialties:", selectedSpecialties);
      
      let query = supabase
        .from("creators")
        .select(`
          *,
          profiles (
            id,
            first_name,
            last_name
          )
        `);

      if (selectedSpecialties.length > 0) {
        query = query.contains('specialties', selectedSpecialties);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching creators:", error);
        toast({
          title: "Error",
          description: "Failed to load creators. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      console.log("Fetched creators data:", data);
      return data || [];
    },
  });

  const mappedCreators: CreatorData[] = creators
    ? creators.map(creator => ({
        id: creator.id,
        firstName: creator.profiles?.first_name || '',
        lastName: creator.profiles?.last_name || '',
        bio: creator.bio || '',
        specialties: creator.specialties || [],
        instagram: creator.instagram || '',
        website: creator.website || '',
        location: creator.location || '',
        profileImage: creator.profile_image_url || '/placeholder.svg',
        profile: {
          first_name: creator.profiles?.first_name || '',
          last_name: creator.profiles?.last_name || ''
        }
      }))
    : [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-nino-gray">
        Failed to load creators. Please try again.
      </div>
    );
  }

  if (!mappedCreators.length) {
    return (
      <div className="text-center text-nino-gray">
        No creators found.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {mappedCreators.map((creator) => (
        <CreatorCard
          key={creator.id}
          creator={creator}
          onInvite={onInvite}
        />
      ))}
    </div>
  );
};

export default CreatorGrid;