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
      // Check for active session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.access_token) {
        console.error('No active session found');
        toast.error("Please sign in to continue");
        return false;
      }

      // For now, we'll just reject applications
      if (status === 'rejected') {
        const { error: applicationError } = await supabase
          .from('applications')
          .update({ status })
          .eq('id', applicationId);

        if (applicationError) {
          console.error('Error updating application:', applicationError);
          toast.error("Failed to update application");
          return false;
        }

        await queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
        toast.success("Application rejected successfully");
        return true;
      }

      // Acceptance flow removed - to be rebuilt
      toast.error("Application acceptance is currently unavailable");
      return false;
      
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