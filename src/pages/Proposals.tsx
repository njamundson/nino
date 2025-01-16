import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import ProposalsTabs from "@/components/proposals/ProposalsTabs";
import { useApplications } from "@/hooks/useApplications";

const Proposals = () => {
  const { toast } = useToast();
  const { data: applications, isLoading: isLoadingApplications } = useApplications();

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

  const pendingApplications = applications?.filter(app => app.status === 'pending') || [];
  const acceptedApplications = applications?.filter(app => app.status === 'accepted') || [];
  const rejectedApplications = applications?.filter(app => app.status === 'rejected') || [];

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Proposals" 
        description="Manage creator applications and send invites for your campaigns" 
      />
      
      <ProposalsTabs
        pendingApplications={pendingApplications}
        acceptedApplications={acceptedApplications}
        rejectedApplications={rejectedApplications}
        isLoading={isLoadingApplications}
        onUpdateStatus={handleUpdateApplicationStatus}
      />
    </div>
  );
};

export default Proposals;