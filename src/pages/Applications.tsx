import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import { useApplications } from "@/hooks/useApplications";
import { Application } from "@/integrations/supabase/types/opportunity";
import { motion } from "framer-motion";
import ProposalsList from "@/components/proposals/ProposalsList";

const Applications = () => {
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
      description: "Failed to load applications. Please refresh the page.",
      variant: "destructive",
    });
  }

  // Filter for applications that have a cover letter (meaning the creator has actually applied)
  const userApplications = applications?.filter(app => 
    app.cover_letter && app.initiated_by === 'creator'
  ) || [] as Application[];

  return (
    <motion.div 
      className="min-h-screen"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <PageHeader 
        title="My Applications" 
        description="Track all your submitted project applications"
      />
      
      <div className="mt-6">
        <ProposalsList
          applications={userApplications}
          isLoading={isLoadingApplications}
          onUpdateStatus={handleUpdateApplicationStatus}
          type="application"
        />
      </div>
    </motion.div>
  );
};

export default Applications;