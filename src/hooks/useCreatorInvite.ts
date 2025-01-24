import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useCreatorInvite = () => {
  const { toast } = useToast();

  const handleInvite = async (creatorId: string, opportunityId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to invite creators",
          variant: "destructive",
        });
        return false;
      }

      // First verify this creator hasn't already been invited
      const { data: existingInvite, error: checkError } = await supabase
        .from('applications')
        .select('id, status')
        .eq('opportunity_id', opportunityId)
        .eq('creator_id', creatorId)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing invitation:", checkError);
        toast({
          title: "Error",
          description: "Failed to check existing invitations",
          variant: "destructive",
        });
        return false;
      }

      if (existingInvite) {
        if (existingInvite.status === 'invited') {
          toast({
            title: "Already invited",
            description: "This creator has already been invited to this campaign",
          });
          return false;
        } else if (existingInvite.status === 'accepted') {
          toast({
            title: "Already participating",
            description: "This creator is already part of this campaign",
          });
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
        toast({
          title: "Error",
          description: "Failed to invite creator. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Creator invited successfully!",
      });
      return true;
    } catch (error) {
      console.error("Error in handleInvite:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  return { handleInvite };
};