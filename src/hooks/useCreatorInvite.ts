import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useCreatorInvite = () => {
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = async (creatorId: string, opportunityId: string) => {
    if (isInviting) return false;
    
    try {
      setIsInviting(true);
      
      // Check if invitation already exists
      const { data: existingInvite, error: checkError } = await supabase
        .from('applications')
        .select('id, status')
        .eq('opportunity_id', opportunityId)
        .eq('creator_id', creatorId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing invitation:", checkError);
        toast.error("Failed to check existing invitations");
        return false;
      }

      if (existingInvite) {
        if (existingInvite.status === 'invited') {
          toast.error("Creator has already been invited to this campaign");
          return false;
        } else if (existingInvite.status === 'accepted') {
          toast.error("Creator is already part of this campaign");
          return false;
        }
      }

      // Get opportunity details for the notification
      const { data: opportunity, error: opportunityError } = await supabase
        .from('opportunities')
        .select('title, brand_id, brands!inner(company_name)')
        .eq('id', opportunityId)
        .single();

      if (opportunityError) {
        console.error("Error fetching opportunity:", opportunityError);
        toast.error("Failed to fetch opportunity details");
        return false;
      }

      // Start a transaction to create both the application and notification
      const { data: creator } = await supabase
        .from('creators')
        .select('user_id')
        .eq('id', creatorId)
        .single();

      if (!creator) {
        toast.error("Creator not found");
        return false;
      }

      // Create the application
      const { error: applicationError } = await supabase
        .from('applications')
        .insert({
          opportunity_id: opportunityId,
          creator_id: creatorId,
          status: 'invited'
        });

      if (applicationError) {
        console.error("Error inviting creator:", applicationError);
        toast.error("Failed to invite creator");
        return false;
      }

      // Create a message notification for the creator
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: opportunity.brand_id,
          receiver_id: creator.user_id,
          content: `You've been invited to collaborate on "${opportunity.title}" by ${opportunity.brands.company_name}`,
          message_type: 'invitation',
          read: false
        });

      if (messageError) {
        console.error("Error creating notification:", messageError);
        // Don't return false here as the invitation was already created
      }

      toast.success("Creator invited successfully!");
      return true;
    } catch (error) {
      console.error("Error in handleInvite:", error);
      toast.error("An unexpected error occurred");
      return false;
    } finally {
      setIsInviting(false);
    }
  };

  return { handleInvite, isInviting };
};