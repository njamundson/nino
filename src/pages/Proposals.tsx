import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import PageHeader from "@/components/shared/PageHeader";
import ProposalsList from "@/components/proposals/ProposalsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send, Inbox } from "lucide-react";

const Proposals = () => {
  const { toast } = useToast();

  const { data: applications, isLoading: isLoadingApplications } = useQuery({
    queryKey: ['received-applications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (!brand) throw new Error("Brand profile not found");

      // First, get applications with opportunity and creator data
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
          ),
          creator:creators (
            id,
            bio,
            instagram,
            website,
            location,
            user_id
          )
        `)
        .eq('opportunity.brand_id', brand.id);

      if (error) throw error;

      if (data) {
        // Get unique creator user IDs
        const creatorUserIds = data
          .map(app => app.creator?.user_id)
          .filter((id): id is string => id != null);

        if (creatorUserIds.length > 0) {
          // Fetch corresponding profiles
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', creatorUserIds);

          // Merge profile data with applications
          return data.map(application => ({
            ...application,
            creator: application.creator ? {
              ...application.creator,
              profile: profiles?.find(p => p.id === application.creator.user_id) || null
            } : null
          }));
        }
      }

      return data || [];
    },
    meta: {
      errorMessage: "Failed to load applications"
    }
  });

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: `Application ${newStatus}`,
        description: `The application has been ${newStatus} successfully.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-12 px-4 max-w-7xl mx-auto">
      <PageHeader 
        title="Proposals" 
        description="Manage creator applications and send invites for your campaigns" 
      />
      
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-2xl bg-gray-100/90 p-1 backdrop-blur-sm">
          <TabsTrigger 
            value="received" 
            className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
          >
            <Inbox className="w-4 h-4" />
            Received Proposals
          </TabsTrigger>
          <TabsTrigger 
            value="sent" 
            className="flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm"
          >
            <Send className="w-4 h-4" />
            Sent Invites
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="mt-8">
          <ProposalsList
            applications={applications}
            isLoading={isLoadingApplications}
            onUpdateStatus={handleUpdateApplicationStatus}
          />
        </TabsContent>
        
        <TabsContent value="sent" className="mt-8">
          <div className="text-center text-gray-500">
            Coming soon: Send and manage invites to creators
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Proposals;