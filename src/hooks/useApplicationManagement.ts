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
    setIsProcessing(true);
    
    try {
      console.log('Updating application status:', { applicationId, status });
      
      // Update application status
      const { error: applicationError } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (applicationError) {
        console.error('Error updating application:', applicationError);
        toast.error("Failed to update application status");
        return false;
      }

      // If accepting and not keeping campaign active, update opportunity status
      if (status === 'accepted' && !keepCampaignActive) {
        const { error: opportunityError } = await supabase
          .from('opportunities')
          .update({ status: 'closed' })
          .eq('id', opportunityId);

        if (opportunityError) {
          console.error('Error updating opportunity:', opportunityError);
          toast.error("Failed to update campaign status");
          return false;
        }
      }

      // Invalidate relevant queries
      await queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      await queryClient.invalidateQueries({ queryKey: ['brand-active-bookings'] });

      // Show success message
      toast.success(status === 'accepted' ? 
        "Creator accepted successfully! You can now message them." : 
        "Application rejected successfully"
      );

      return true;
    } catch (error) {
      console.error('Error in handleUpdateStatus:', error);
      toast.error("An unexpected error occurred");
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
