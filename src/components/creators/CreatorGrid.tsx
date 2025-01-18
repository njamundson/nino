import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData } from "@/types/creator";
import CreatorCard from "./CreatorCard";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface CreatorGridProps {
  onInvite: (creatorId: string) => void;
}

const CreatorGrid = ({ onInvite }: CreatorGridProps) => {
  const { toast } = useToast();

  const { data: creators, isLoading, error } = useQuery({
    queryKey: ["creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creators")
        .select(`
          *,
          profiles:profile_id (
            first_name,
            last_name
          )
        `);

      if (error) {
        console.error("Error fetching creators:", error);
        toast({
          title: "Error",
          description: "Failed to load creators. Please try again.",
          variant: "destructive",
        });
        throw error;
      }

      return data;
    },
  });

  const mappedCreators: CreatorData[] = creators
    ? creators.map(creator => ({
        ...creator,
        firstName: creator.profiles?.first_name || '',
        lastName: '', // Since we use a single field for the full name
        profile: {
          first_name: creator.profiles?.first_name || '',
          last_name: ''
        },
        paymentDetails: '',
        creatorType: '',
        id: creator.id,
        bio: creator.bio || '',
        instagram: creator.instagram || '',
        website: creator.website || '',
        location: creator.location || '',
        specialties: creator.specialties || [],
        profileImage: null
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