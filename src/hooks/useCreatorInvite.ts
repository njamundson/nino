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

      const { error } = await supabase
        .from('applications')
        .insert({
          opportunity_id: opportunityId,
          creator_id: creatorId,
          status: 'invited'
        });

      if (error) {
        console.error("Error inviting creator:", error);
        toast.error("Failed to invite creator");
        return false;
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