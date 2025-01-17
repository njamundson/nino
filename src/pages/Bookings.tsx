import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, Calendar as CalendarIcon, Search } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import PageHeader from "@/components/shared/PageHeader";
import CreatorModal from "@/components/creators/CreatorModal";
import BookingModal from "@/components/bookings/BookingModal";
import { toast } from "sonner";

interface Booking {
  id: string;
  created_at: string;
  opportunity: {
    title: string;
    start_date: string;
    brand: {
      company_name: string;
      location: string;
    };
  };
  creator: {
    id: string;
    bio: string;
    location: string;
    specialties: string[];
    instagram: string;
    website: string;
    profile: {
      first_name: string;
      last_name: string;
    };
    imageUrl: string;
  };
}

const Bookings = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<Booking["creator"] | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data: brand } = await supabase
        .from("brands")
        .select("id")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (!brand) return [];

      const { data: opportunities } = await supabase
        .from("opportunities")
        .select(`
          id,
          title,
          start_date,
          applications (
            id,
            created_at,
            creator:creators (
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
            )
          )
        `)
        .eq("brand_id", brand.id);

      if (!opportunities) return [];

      const bookings = opportunities
        .flatMap(opp => 
          opp.applications?.map(app => ({
            id: app.id,
            created_at: app.created_at,
            opportunity: {
              title: opp.title,
              start_date: opp.start_date,
              brand: {
                company_name: "",
                location: ""
              }
            },
            creator: {
              ...app.creator,
              imageUrl: "" // You'll need to implement image handling
            }
          }))
        )
        .filter(Boolean);

      return bookings || [];
    },
  });

  const filteredBookings = bookings?.filter(booking => {
    const creatorName = `${booking.creator.profile.first_name} ${booking.creator.profile.last_name}`.toLowerCase();
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = creatorName.includes(searchLower) || 
                         booking.opportunity.title.toLowerCase().includes(searchLower);
    
    if (selectedDate) {
      const bookingDate = new Date(booking.opportunity.start_date);
      return matchesSearch && bookingDate.toDateString() === selectedDate.toDateString();
    }
    
    return matchesSearch;
  });

  const handleChat = (creatorId: string) => {
    // Implement chat functionality
    toast.info("Chat functionality coming soon!");
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Bookings"
        description="View and manage your confirmed bookings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search bookings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <ScrollArea className="h-[600px]">
            <div className="space-y-4">
              {filteredBookings?.map((booking) => (
                <Card
                  key={booking.id}
                  className="p-6 hover:border-nino-primary transition-all duration-300 cursor-pointer animate-fade-in"
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex items-start gap-4">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-nino-bg">
                      <img
                        src={booking.creator.imageUrl || "/placeholder.svg"}
                        alt={`${booking.creator.profile.first_name} ${booking.creator.profile.last_name}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-medium">
                        {booking.creator.profile.first_name} {booking.creator.profile.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {booking.opportunity.title}
                      </p>
                      <div className="flex items-center gap-4 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCreator(booking.creator);
                          }}
                        >
                          View Profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleChat(booking.creator.id);
                          }}
                        >
                          <MessageCircle className="h-4 w-4" />
                          Chat
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarIcon className="h-4 w-4" />
                      {format(new Date(booking.opportunity.start_date), "MMM d, yyyy")}
                    </div>
                  </div>
                </Card>
              ))}
              
              {filteredBookings?.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No bookings found</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
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
          isOpen={!!selectedCreator}
          onClose={() => setSelectedCreator(null)}
        />
      )}

      {selectedBooking && (
        <BookingModal
          booking={selectedBooking}
          isOpen={!!selectedBooking}
          onClose={() => setSelectedBooking(null)}
        />
      )}
    </div>
  );
};

export default Bookings;