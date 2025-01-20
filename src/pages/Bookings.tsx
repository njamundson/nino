import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import PageHeader from "@/components/shared/PageHeader";
import { useState } from "react";
import CreatorModal from "@/components/creators/CreatorModal";
import { useNavigate } from "react-router-dom";
import BookingsList from "@/components/bookings/BookingsList";
import BookingsCalendar from "@/components/bookings/BookingsCalendar";

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
  profile_image_url: string | null;
}

const Bookings = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Skeleton className="h-[600px] w-full" />
          </div>
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Bookings"
        description="Manage your confirmed collaborations and schedule upcoming content creation"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <BookingsList
            bookings={bookings || []}
            onChatClick={handleChatClick}
            onViewCreator={handleViewCreator}
          />
        </div>

        <div>
          <BookingsCalendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        </div>
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