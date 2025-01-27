import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

export const useApplicationManagement = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  const handleUpdateStatus = async (
    applicationId: string, 
    opportunityId: string,
    status: 'accepted' | 'rejected',
    keepCampaignActive?: boolean,
    onSuccess?: () => void
  ) => {
    setIsProcessing(true);
    try {
      if (status === 'accepted') {
        // Update application status
        const { error: applicationError } = await supabase
          .from('applications')
          .update({ status: 'accepted' })
          .eq('id', applicationId);

        if (applicationError) throw applicationError;

        // If not keeping campaign active, update opportunity status
        if (!keepCampaignActive) {
          const { error: opportunityError } = await supabase
            .from('opportunities')
            .update({ status: 'active' })
            .eq('id', opportunityId);

          if (opportunityError) throw opportunityError;
        }

        toast.success("Proposal accepted! The creator has been added to your bookings.");

        // Invalidate and refetch relevant queries
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['my-campaigns'] }),
          queryClient.invalidateQueries({ queryKey: ['brand-active-bookings'] })
        ]);
      } else {
        // Delete the application instead of updating status
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', applicationId);

        if (error) throw error;
        
        toast.success("Proposal rejected");
        await queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      }

      onSuccess?.();
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error("Failed to update proposal status");
    } finally {
      setIsProcessing(false);
    }
  };

  return {
    isProcessing,
    handleUpdateStatus
  };
};