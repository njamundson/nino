import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Creator } from "@/types/creator";

export const useCreatorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  return useQuery({
    queryKey: ['creator-profile'],
    queryFn: async () => {
      try {
        console.log("Starting creator profile fetch...");
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error fetching user:", userError);
          throw userError;
        }
        
        if (!user) {
          console.log("No authenticated user found");
          navigate('/auth');
          return null;
        }

        console.log("Fetching creator profile for user:", user.id);
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select(`
            id,
            first_name,
            last_name,
            bio,
            location,
            instagram,
            website,
            specialties,
            creator_type,
            profile_image_url,
            user_id,
            onboarding_completed
          `)
          .eq('user_id', user.id)
          .maybeSingle();

        if (creatorError) {
          console.error("Error fetching creator:", creatorError);
          toast({
            title: "Error loading profile",
            description: "There was a problem loading your profile. Please try refreshing the page.",
            variant: "destructive",
          });
          throw creatorError;
        }

        if (!creator) {
          console.log("No creator profile found, redirecting to welcome");
          navigate('/creator/welcome');
          return null;
        }

        if (!creator.onboarding_completed) {
          console.log("Onboarding not completed, redirecting to welcome");
          navigate('/creator/welcome');
          return null;
        }

        console.log("Successfully fetched creator profile:", creator);
        return creator as Creator;
      } catch (error) {
        console.error("Error in creator profile query:", error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile. Please try refreshing the page.",
          variant: "destructive",
        });
        throw error;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false
  });
};