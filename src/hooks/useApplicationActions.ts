import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useApplicationActions = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const handleAcceptApplication = async (applicationId: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      console.log('Processing application acceptance:', applicationId);
      
      if (!applicationId) {
        throw new Error('Application ID is required');
      }

      // First get the application details to ensure we have a valid opportunity_id
      const { data: application, error: fetchError } = await supabase
        .from('applications')
        .select('opportunity_id')
        .eq('id', applicationId)
        .single();

      if (fetchError) {
        console.error('Error fetching application:', fetchError);
        throw fetchError;
      }

      if (!application?.opportunity_id) {
        throw new Error('No opportunity found for this application');
      }

      // Update the application status
      const { error: updateError } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (updateError) {
        console.error('Error updating application:', updateError);
        throw updateError;
      }

      // Update the opportunity status
      const { error: opportunityError } = await supabase
        .from('opportunities')
        .update({ status: 'active' })
        .eq('id', application.opportunity_id);

      if (opportunityError) {
        console.error('Error updating opportunity:', opportunityError);
        throw opportunityError;
      }

      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['opportunities'] });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['brand-active-bookings'] });

      toast.success('Application accepted successfully');
      return true;
    } catch (error) {
      console.error('Error in handleAcceptApplication:', error);
      toast.error('Failed to accept application. Please try again.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectApplication = async (applicationId: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      if (!applicationId) {
        throw new Error('Application ID is required');
      }

      const { error } = await supabase
        .from('applications')
        .update({ status: 'rejected' })
        .eq('id', applicationId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['applications'] });
      toast.success('Application rejected successfully');
      return true;
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error('Failed to reject application. Please try again.');
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