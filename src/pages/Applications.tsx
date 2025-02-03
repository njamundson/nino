import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import PageHeader from "@/components/shared/PageHeader";
import { useApplications } from "@/hooks/useApplications";
import { motion, AnimatePresence } from "framer-motion";
import ProposalsList from "@/components/proposals/ProposalsList";
import DashboardLoading from "@/components/dashboard/states/DashboardLoading";
import DashboardError from "@/components/dashboard/states/DashboardError";
import ErrorBoundary from "@/components/shared/ErrorBoundary";
import { useQueryClient } from "@tanstack/react-query";

const Applications = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { 
    data: applications, 
    isLoading, 
    error,
    refetch 
  } = useApplications();

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['applications'] });

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

  // Filter for applications that have a cover letter and are pending
  const userApplications = (applications || []).filter(app => 
    app.cover_letter && 
    (app.initiated_by === 'creator' || app.initiated_by === 'brand') &&
    app.status === 'pending'
  );

  if (isLoading) {
    return <DashboardLoading message="Loading your applications..." />;
  }

  if (error) {
    return (
      <DashboardError 
        message="Unable to load your applications. Please try again." 
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <motion.div 
          className="min-h-screen"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <PageHeader 
            title="My Applications" 
            description="Track all your submitted project applications"
          />
          
          <div className="mt-6">
            <ProposalsList
              applications={userApplications}
              isLoading={isLoading}
              onUpdateStatus={handleUpdateApplicationStatus}
              type="application"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </ErrorBoundary>
  );
};

export default Applications;