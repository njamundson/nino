import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/shared/PageHeader";
import { useState } from "react";
import CreatorModal from "@/components/creators/CreatorModal";
import { useNavigate } from "react-router-dom";
import BookingsList from "@/components/bookings/BookingsList";
import { Creator, CreatorType } from "@/types/creator";

const Bookings = () => {
  const navigate = useNavigate();
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data: brand } = await supabase
        .from("brands")
        .select("id")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (!brand) return [];

      const { data: applications } = await supabase
        .from("applications")
        .select(`
          *,
          creator:creators (
            *,
            profile:profiles (
              first_name,
              last_name
            )
          ),
          opportunity:opportunities (
            *,
            brand:brands (
              company_name,
              location
            )
          )
        `)
        .eq("status", "accepted")
        .order("created_at", { ascending: false });

      return applications || [];
    },
  });

  const handleViewCreator = (creator: any) => {
    const creatorData: Creator = {
      id: creator.id,
      bio: creator.bio,
      location: creator.location,
      specialties: creator.specialties,
      instagram: creator.instagram,
      website: creator.website,
      creator_type: creator.creator_type as CreatorType,
      profile: creator.profile,
      profile_image_url: creator.profile_image_url,
    };
    setSelectedCreator(creatorData);
    setIsCreatorModalOpen(true);
  };

  const handleChatClick = (creatorId: string) => {
    navigate(`/messages?creator=${creatorId}`);
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <PageHeader
          title="Bookings"
          description="Manage your confirmed collaborations and schedule upcoming content creation"
        />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Bookings"
        description="Manage your confirmed collaborations and schedule upcoming content creation"
      />

      <div className="mt-8">
        <BookingsList
          bookings={bookings || []}
          onChatClick={handleChatClick}
          onViewCreator={handleViewCreator}
        />
      </div>

      {selectedCreator && (
        <CreatorModal
          creator={selectedCreator}
          isOpen={isCreatorModalOpen}
          onClose={() => setIsCreatorModalOpen(false)}
        />
      )}
    </div>
  );
};

export default Bookings;