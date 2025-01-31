import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface UseApplicationActionsProps {
  opportunityId: string;
}

export const useApplicationActions = ({ opportunityId }: UseApplicationActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const handleAcceptApplication = async (applicationId: string) => {
    setIsProcessing(true);
    try {
      console.log('Processing application acceptance:', applicationId);
      
      // Start a transaction by using multiple updates
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

      // Invalidate relevant queries to refresh the UI
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['my-campaigns'] }),
        queryClient.invalidateQueries({ queryKey: ['active-bookings'] }),
        queryClient.invalidateQueries({ queryKey: ['applications'] }),
        queryClient.invalidateQueries({ queryKey: ['opportunities'] })
      ]);

      console.log('Application accepted successfully');
      toast.success("Application accepted successfully");
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
      
      // Delete the application instead of just updating status
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

      if (error) {
        console.error('Error rejecting application:', error);
        throw error;
      }

      // Invalidate relevant queries to refresh the UI
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['my-campaigns'] }),
        queryClient.invalidateQueries({ queryKey: ['applications'] }),
        queryClient.invalidateQueries({ queryKey: ['opportunities'] }),
        queryClient.invalidateQueries({ queryKey: ['my-applications'] })
      ]);

      console.log('Application rejected successfully');
      toast.success("Application rejected successfully");
      return true;
    } catch (error) {
      console.error('Error in handleRejectApplication:', error);
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