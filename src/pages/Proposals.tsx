import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import ProposalsTabs from "@/components/proposals/ProposalsTabs";
import { useApplications } from "@/hooks/useApplications";
import { Application } from "@/integrations/supabase/types/opportunity";
import { motion } from "framer-motion";

const Proposals = () => {
  const { toast } = useToast();
  const { data: applications, isLoading: isLoadingApplications, error } = useApplications();

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
      console.error('Error updating application status:', error);
      toast({
        title: "Error",
        description: "Failed to update application status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load proposals. Please refresh the page.",
      variant: "destructive",
    });
  }

  const pendingProposals = applications?.filter((app: Application) => 
    app.status === 'pending' && 
    app.opportunity?.brand?.user_id === app.creator?.user_id
  ) || [];
  
  const myApplications = applications?.filter((app: Application) => 
    app.opportunity?.brand?.user_id !== app.creator?.user_id
  ) || [];

  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
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
    </motion.div>
  );
};

export default Proposals;