import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/shared/PageHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Clock, Building2, MapPin, CalendarDays, ExternalLink } from "lucide-react";

const Proposals = () => {
  const { toast } = useToast();

  const { data: applications, isLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!creator) throw new Error("Creator profile not found");

      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities (
            title,
            description,
            location,
            start_date,
            payment_details,
            compensation_details,
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
    },
    meta: {
      errorMessage: "Failed to load applications"
    }
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'accepted':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  const handleWithdrawApplication = async (applicationId: string) => {
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Application withdrawn",
        description: "Your application has been successfully withdrawn.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to withdraw application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader 
        title="My Proposals" 
        description="Track all your submitted proposals and their current status" 
      />
      
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-6 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <div className="flex gap-4">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : applications && applications.length > 0 ? (
        <div className="grid gap-6">
          {applications.map((application) => (
            <Card 
              key={application.id}
              className="p-6 hover:shadow-md transition-shadow duration-200"
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {application.opportunity?.title}
                    </h3>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      <Building2 className="w-4 h-4" />
                      {application.opportunity?.brand?.company_name}
                    </p>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={`${getStatusColor(application.status)} flex items-center gap-1.5`}
                  >
                    {getStatusIcon(application.status)}
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  {application.opportunity?.location && (
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4" />
                      {application.opportunity.location}
                    </div>
                  )}
                  {application.opportunity?.start_date && (
                    <div className="flex items-center gap-1.5">
                      <CalendarDays className="w-4 h-4" />
                      {new Date(application.opportunity.start_date).toLocaleDateString()}
                    </div>
                  )}
                </div>

                {application.cover_letter && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Cover Letter</h4>
                    <p className="text-sm text-gray-600 whitespace-pre-line">
                      {application.cover_letter}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t">
                  <div className="space-y-1">
                    {application.opportunity?.payment_details && (
                      <p className="text-sm text-gray-600">
                        💰 {application.opportunity.payment_details}
                      </p>
                    )}
                    {application.opportunity?.compensation_details && (
                      <p className="text-sm text-gray-600">
                        🎁 {application.opportunity.compensation_details}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-2"
                      onClick={() => window.open(`/opportunities/${application.opportunity_id}`, '_blank')}
                    >
                      View Opportunity
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                    
                    {application.status === 'pending' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleWithdrawApplication(application.id)}
                      >
                        Withdraw Application
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No proposals submitted yet
            </h3>
            <p className="text-gray-500">
              When you submit proposals to opportunities, they will appear here.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Proposals;