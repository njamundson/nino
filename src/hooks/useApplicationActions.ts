import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UseApplicationActionsProps {
  opportunityId: string;
}

export const useApplicationActions = ({ opportunityId }: UseApplicationActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAcceptApplication = async (applicationId: string, creatorUserId: string) => {
    setIsProcessing(true);
    try {
      // Get creator
      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', creatorUserId)
        .maybeSingle();

      if (creatorError) throw creatorError;
      if (!creator) throw new Error('Creator not found');

      // Update application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (updateError) throw updateError;

      toast.success('Application accepted successfully');
    } catch (error) {
      console.error('Error accepting application:', error);
      toast.error('Failed to accept application');
      throw error;
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
      toast.success('Application rejected successfully');
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application');
      throw error;
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