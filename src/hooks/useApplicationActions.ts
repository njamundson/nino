import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseApplicationActionsProps {
  opportunityId: string;
}

export const useApplicationActions = ({ opportunityId }: UseApplicationActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAcceptApplication = async (applicationId: string, keepCampaignActive: boolean = true) => {
    setIsProcessing(true);
    try {
      // Update application status to accepted
      const { error: applicationError } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (applicationError) throw applicationError;

      // Update opportunity status based on keepCampaignActive flag
      const newStatus = keepCampaignActive ? 'active' : 'completed';
      const { error: opportunityError } = await supabase
        .from('opportunities')
        .update({ status: newStatus })
        .eq('id', opportunityId);

      if (opportunityError) throw opportunityError;

      return true;
    } catch (error) {
      console.error('Error accepting application:', error);
      toast.error("Failed to accept application. Please try again.");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error("Failed to reject application. Please try again.");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleAcceptApplication,
    handleRejectApplication
  };
};
