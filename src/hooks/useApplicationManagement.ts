import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

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
      // Update application status
      const { error: applicationError } = await supabase
        .from('applications')
        .update({ status })
        .eq('id', applicationId);

      if (applicationError) throw applicationError;

      // If accepting and not keeping campaign active, update opportunity status
      if (status === 'accepted' && !keepCampaignActive) {
        const { error: opportunityError } = await supabase
          .from('opportunities')
          .update({ status: 'active' })
          .eq('id', opportunityId);

        if (opportunityError) throw opportunityError;
      }

      // Invalidate and refetch relevant queries
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['my-campaigns'] }),
        queryClient.invalidateQueries({ queryKey: ['brand-active-bookings'] })
      ]);

    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleUpdateStatus
  };
};
