import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, MapPin, MessageSquare } from "lucide-react";
import { formatDate } from "@/lib/utils";
import PageHeader from "@/components/shared/PageHeader";
import { useState } from "react";
import CreatorModal from "@/components/creators/CreatorModal";

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
                <div className="space-y-8">
                  {bookings.map((booking: any) => (
                    <div
                      key={booking.id}
                      className="p-6 border rounded-lg space-y-4 hover:border-nino-primary transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-medium">
                            {booking.opportunity.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                            <MapPin className="w-4 h-4" />
                            {booking.opportunity.location}
                          </div>
                        </div>
                        <Badge variant="outline" className="capitalize">
                          Confirmed
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewCreator(booking.creator)}
                          >
                            View Creator
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              // Handle chat functionality
                            }}
                          >
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Chat
                          </Button>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="w-4 h-4" />
                          <span>
                            {booking.opportunity.start_date
                              ? formatDate(booking.opportunity.start_date)
                              : "Date TBD"}
                          </span>
                        </div>
                      </div>

                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium mb-2">Booking details:</p>
                        <p className="whitespace-pre-wrap">
                          {booking.cover_letter}
                        </p>
                      </div>

                      <div className="text-xs text-muted-foreground mt-4">
                        Booked on {formatDate(booking.created_at)}
                      </div>
                    </div>
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