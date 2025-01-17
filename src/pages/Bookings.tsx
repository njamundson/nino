import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar } from "@/components/ui/calendar";
import PageHeader from "@/components/shared/PageHeader";
import { useState } from "react";
import CreatorModal from "@/components/creators/CreatorModal";
import BookingCard from "@/components/bookings/BookingCard";
import { useNavigate } from "react-router-dom";

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
      imageUrl: `https://source.unsplash.com/random/400x600?portrait&${creator.id}`,
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
        <Skeleton className="h-8 w-48" />
        <Card className="p-8">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader
        title="Bookings"
        description="View and manage your confirmed bookings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        <div className="lg:col-span-2">
          <Card className="p-8">
            <ScrollArea className="h-[600px] pr-4">
              {bookings && bookings.length > 0 ? (
                <div className="space-y-6">
                  {bookings.map((booking: any) => (
                    <BookingCard
                      key={booking.id}
                      booking={booking}
                      onChatClick={() => handleChatClick(booking.creator.id)}
                      onViewCreator={() => handleViewCreator(booking.creator)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <p>No confirmed bookings yet</p>
                  <p className="text-sm mt-1">
                    Your accepted applications will appear here
                  </p>
                </div>
              )}
            </ScrollArea>
          </Card>
        </div>

        <div>
          <Card className="p-6">
            <h3 className="text-lg font-medium mb-4">Upcoming Bookings</h3>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </Card>
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