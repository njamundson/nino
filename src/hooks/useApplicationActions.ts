import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface UseApplicationActionsProps {
  opportunityId: string;
}

export const useApplicationActions = ({ opportunityId }: UseApplicationActionsProps) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const checkExistingChat = async (creatorUserId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data: messages, error } = await supabase
        .from('messages')
        .select('id')
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .or(`sender_id.eq.${creatorUserId},receiver_id.eq.${creatorUserId}`)
        .limit(1);

      if (error) {
        console.error('Error checking existing chat:', error);
        return false;
      }

      return messages && messages.length > 0;
    } catch (error) {
      console.error('Error in checkExistingChat:', error);
      return false;
    }
  };

  const createInitialMessage = async (creatorUserId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('Authentication required to create chat');
    }

    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: creatorUserId,
        content: `Hi! I've accepted your application. Let's discuss the next steps!`,
        message_type: 'text'
      });

    if (messageError) {
      throw new Error('Failed to create initial message');
    }
  };

  const handleAcceptApplication = async (applicationId: string, creatorUserId: string) => {
    setIsProcessing(true);
    try {
      // Check authentication
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Authentication required");
        return;
      }

      // Update application status
      const { error: applicationError } = await supabase
        .from('applications')
        .update({ status: 'accepted' })
        .eq('id', applicationId);

      if (applicationError) {
        throw new Error('Failed to update application status');
      }

      // Check and create chat if needed
      const chatExists = await checkExistingChat(creatorUserId);
      if (!chatExists) {
        await createInitialMessage(creatorUserId);
      }

      // Update opportunity status
      const { error: opportunityError } = await supabase
        .from('opportunities')
        .update({ status: 'active' })
        .eq('id', opportunityId);

      if (opportunityError) {
        throw new Error('Failed to update opportunity status');
      }

      // Success flow
      toast.success("Application accepted successfully!");
      await queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      navigate('/brand/bookings');

    } catch (error) {
      console.error('Error accepting application:', error);
      toast.error(error instanceof Error ? error.message : "Failed to accept application");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectApplication = async (applicationId: string) => {
    setIsProcessing(true);
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', applicationId);

      if (error) {
        throw new Error('Failed to reject application');
      }

      toast.success("Application rejected successfully");
      await queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });

    } catch (error) {
      console.error('Error rejecting application:', error);
      toast.error(error instanceof Error ? error.message : "Failed to reject application");
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