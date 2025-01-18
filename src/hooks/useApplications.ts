import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useCreatorInvite = () => {
  const { toast } = useToast();

  const handleInvite = async (creatorId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to invite creators",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from('applications')
        .insert({
          opportunity_id: creatorId,
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
        return;
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