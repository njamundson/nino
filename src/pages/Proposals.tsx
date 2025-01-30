import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import { useApplications } from "@/hooks/useApplications";
import { Application } from "@/integrations/supabase/types/opportunity";
import { motion } from "framer-motion";
import ProposalsList from "@/components/proposals/ProposalsList";

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
        title: `Invitation ${newStatus}`,
        description: `The invitation has been ${newStatus} successfully.`,
      });
    } catch (error) {
      console.error('Error updating invitation status:', error);
      toast({
        title: "Error",
        description: "Failed to update invitation status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (error) {
    toast({
      title: "Error",
      description: "Failed to load invitations. Please refresh the page.",
      variant: "destructive",
    });
  }

  // Filter for brand invitations (initiated by brand) that don't have a cover letter yet
  const pendingInvitations = (applications?.filter((app: Application) => 
    app.initiated_by === 'brand' && !app.cover_letter
  ) || []) as Application[];

  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <PageHeader 
        title="Pending Invitations" 
        description="Review and respond to project invitations from brands"
      />
      
      <div className="mt-6">
        <ProposalsList
          applications={pendingInvitations}
          isLoading={isLoadingApplications}
          onUpdateStatus={handleUpdateApplicationStatus}
          type="proposal"
        />
      </div>
    </motion.div>
  );
};

export default Proposals;