import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useApplications = () => {
  return useQuery({
    queryKey: ['applications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // First get the creator profile for the current user
      const { data: creator } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      // Then get both received applications (for brands) and submitted applications (for creators)
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities (
            title,
            description,
            location,
            start_date,
            payment_details,
            compensation_details,
            brand:brands (
              company_name,
              brand_type,
              location
            )
          ),
          creator:creators (
            id,
            bio,
            instagram,
            website,
            location,
            user_id
          )
        `)
        .or(
          creator ? 
          `creator_id.eq.${creator.id}` : 
          'creator_id.is.null'
        );

      if (error) throw error;

      if (data) {
        const creatorUserIds = data
          .map(app => app.creator?.user_id)
          .filter((id): id is string => id != null);

        if (creatorUserIds.length > 0) {
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', creatorUserIds);

          return data.map(application => ({
            ...application,
            creator: application.creator ? {
              ...application.creator,
              profile: profiles?.find(p => p.id === application.creator.user_id) || null
            } : null
          }));
        }
      }

      return data || [];
    },
    meta: {
      errorMessage: "Failed to load applications"
    }
  });
};

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