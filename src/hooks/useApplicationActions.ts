import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseApplicationActionsProps {
  opportunityId: string;
}

export const useApplicationActions = ({ opportunityId }: UseApplicationActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAcceptApplication = async (applicationId: string) => {
    setIsProcessing(true);
    try {
      console.log('Processing application acceptance:', applicationId);
      
      // Update application status to accepted
      const { error: applicationError } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (applicationError) {
        console.error('Error updating application:', applicationError);
        throw applicationError;
      }

      // Update opportunity status to active
      const { error: opportunityError } = await supabase
        .from('opportunities')
        .update({ status: 'active' })
        .eq('id', opportunityId);

      if (opportunityError) {
        console.error('Error updating opportunity:', opportunityError);
        throw opportunityError;
      }

      console.log('Application accepted successfully');
      return true;
    } catch (error) {
      console.error('Error in handleAcceptApplication:', error);
      toast.error("Failed to accept application. Please try again.");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    setIsProcessing(true);
    try {
      console.log('Processing application rejection:', applicationId);
      
      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (error) throw error;

      console.log('Application rejected successfully');
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