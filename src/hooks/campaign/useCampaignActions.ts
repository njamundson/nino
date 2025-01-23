import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useCampaignActions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDelete = async (campaignId: string) => {
    try {
      // First delete all related applications
      const { error: applicationsError } = await supabase
        .from('applications')
        .delete()
        .eq('opportunity_id', campaignId);

      if (applicationsError) throw applicationsError;

      // Then delete the campaign itself
      const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', campaignId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Campaign deleted successfully",
      });
      
      // Invalidate and refetch the campaigns query to update the UI
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast({
        title: "Error",
        description: "Failed to delete campaign",
        variant: "destructive",
      });
    }
  };

  const handleUpdateApplicationStatus = async (applicationId: string, newStatus: 'accepted' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ status: newStatus })
        .eq('id', applicationId);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Application ${newStatus} successfully`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update application status",
        variant: "destructive",
      });
    }
  };

  return {
    handleDelete,
    handleUpdateApplicationStatus
  };
};