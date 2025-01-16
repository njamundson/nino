import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const Proposals = () => {
  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // First get the creator profile
      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!creator) return [];

      // Then get all applications with opportunity and brand details
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities (
            title,
            description,
            location,
            start_date,
            brand:brands (
              company_name,
              brand_type
            )
          )
        `)
        .eq('creator_id', creator.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'accepted':
        return 'bg-green-100 text-green-800 hover:bg-green-100';
      case 'rejected':
        return 'bg-red-100 text-red-800 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-nino-text">Proposals</h1>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-4 w-1/4" />
                <Skeleton className="h-20 w-full" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-nino-text">Proposals</h1>
      </div>
      
      <ScrollArea className="h-[calc(100vh-12rem)]">
        {applications && applications.length > 0 ? (
          <div className="space-y-4 pr-4">
            {applications.map((application) => (
              <Card key={application.id} className="p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">
                      {application.opportunity.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {application.opportunity.brand.company_name}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={getStatusColor(application.status)}
                  >
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>

                <div className="space-y-2">
                  {application.opportunity.location && (
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      📍 {application.opportunity.location}
                    </p>
                  )}
                  
                  {application.opportunity.start_date && (
                    <p className="text-sm text-muted-foreground">
                      🗓️ {formatDate(application.opportunity.start_date)}
                    </p>
                  )}
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Your Cover Letter</h4>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                    {application.cover_letter}
                  </p>
                </div>

                <p className="text-xs text-muted-foreground">
                  Submitted on {formatDate(application.created_at)}
                </p>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-8 bg-white rounded-xl shadow-sm">
            <div className="text-center text-muted-foreground">
              <p>You haven't submitted any proposals yet.</p>
              <p className="mt-1">Start browsing opportunities to apply!</p>
            </div>
          </Card>
        )}
      </ScrollArea>
    </div>
  );
};

export default Proposals;