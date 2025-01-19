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
  const myApplications = applications?.filter(app => app.status === 'submitted') || [];

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <PageHeader 
        title="Proposals" 
        description="Track the status of your project applications and manage brand invitations"
      />
      
      <div className="mt-8">
        <ProposalsTabs
          pendingApplications={pendingApplications}
          myInvites={myApplications}
          isLoading={isLoadingApplications}
          onUpdateStatus={handleUpdateApplicationStatus}
        />
      </div>
    </div>
  );
};

export default Proposals;