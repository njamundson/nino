import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useApplicationManagement = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const handleUpdateStatus = async (
    applicationId: string,
    opportunityId: string,
    status: 'accepted' | 'rejected',
    keepCampaignActive?: boolean
  ) => {
    if (isProcessing) return false;
    setIsProcessing(true);
    console.log('Starting application update:', { applicationId, status });
    
    try {
      // First, check if we have a valid session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Authentication error');
      }

      if (!session) {
        console.error('No active session');
        throw new Error('No active session');
      }

      // Update application status
      const { error: applicationError } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (applicationError) {
        console.error('Error updating application:', applicationError);
        throw applicationError;
      }

      // If accepting and not keeping campaign active, update opportunity status
      if (status === 'accepted' && !keepCampaignActive) {
        const { error: opportunityError } = await supabase
          .from('opportunities')
          .update({ status: 'closed' })
          .eq('id', opportunityId);

        if (opportunityError) {
          console.error('Error updating opportunity:', opportunityError);
          throw opportunityError;
        }
      }

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      await queryClient.invalidateQueries({ queryKey: ['brand-active-bookings'] });

      // Show success message
      toast.success(
        status === 'accepted' 
          ? "Creator accepted successfully! You can now message them."
          : "Application rejected successfully"
      );

      return true;
    } catch (error) {
      console.error('Error in handleUpdateStatus:', error);
      toast.error("An error occurred. Please try again.");
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleUpdateStatus
  };
};
