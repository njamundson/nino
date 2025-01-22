import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import ProposalsTabs from "@/components/proposals/ProposalsTabs";
import { useApplications } from "@/hooks/useApplications";
import { useIsMobile } from "@/hooks/use-mobile";

const Proposals = () => {
  const { toast } = useToast();
  const { data: applications, isLoading: isLoadingApplications } = useApplications();
  const isMobile = useIsMobile();

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

  const pendingProposals = applications?.filter(app => 
    app.status === 'pending' && 
    app.opportunity?.brand?.user_id === app.creator?.user_id
  ) || [];
  
  const myApplications = applications?.filter(app => 
    app.opportunity?.brand?.user_id !== app.creator?.user_id
  ) || [];

  return (
    <div className="min-h-screen bg-white">
      <div className={`${isMobile ? 'px-4 py-6' : 'p-8'} max-w-7xl mx-auto`}>
        <PageHeader 
          title="Proposals" 
          description="Track the status of your project applications and manage brand invitations"
        />
        
        <div className="mt-6">
          <ProposalsTabs
            pendingProposals={pendingProposals}
            myApplications={myApplications}
            isLoading={isLoadingApplications}
            onUpdateStatus={handleUpdateApplicationStatus}
          />
        </div>
      </div>
    </div>
  );
};

export default Proposals;