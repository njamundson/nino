import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";
import PageHeader from "@/components/shared/PageHeader";

const Bookings = () => {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: async () => {
      const { data: creator } = await supabase
        .from("creators")
        .select("id")
        .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();

      if (!creator) return [];

      const { data: applications } = await supabase
        .from("applications")
        .select(`
          *,
          opportunity:opportunities (
            *,
            brand:brands (
              company_name,
              location
            )
          )
        `)
        .eq("creator_id", creator.id)
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

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <PageHeader
        title="Bookings"
        description="View and manage your confirmed bookings"
      />

      <Card className="p-8">
        <ScrollArea className="h-[600px] pr-4">
          {bookings && bookings.length > 0 ? (
            <div className="space-y-8">
              {bookings.map((booking) => (
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
                        {booking.opportunity.brand.location}
                      </div>
                    </div>
                    <Badge variant="outline" className="capitalize">
                      Confirmed
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {booking.opportunity.start_date
                        ? formatDate(booking.opportunity.start_date)
                        : "Date TBD"}
                    </span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    <p className="font-medium mb-2">Your message:</p>
                    <p className="whitespace-pre-wrap">{booking.cover_letter}</p>
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
  );
};

export default Bookings;