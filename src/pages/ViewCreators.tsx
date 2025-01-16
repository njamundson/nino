import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const ViewCreators = () => {
  const { data: creators, isLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      const { data } = await supabase
        .from('creators')
        .select(`
          *,
          profile:profiles(
            first_name,
            last_name
          )
        `)
        .eq('is_verified', true)
        .order('created_at', { ascending: false });
      
      return data || [];
    }
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Browse Creators"
        description="Discover and connect with talented creators for your campaigns."
      />

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : creators && creators.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator) => (
            <Card key={creator.id} className="p-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10">
                    {creator.profile?.first_name?.[0]}
                    {creator.profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {creator.profile?.first_name} {creator.profile?.last_name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {creator.bio || "No bio available"}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <div className="text-center text-muted-foreground">
            No verified creators found.
          </div>
        </Card>
      )}
    </div>
  );
};

export default ViewCreators;