import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Creator } from "@/types/creator";
import { useCallback } from "react";

export const useCreatorDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const fetchCreatorProfile = useCallback(async () => {
    console.log("Fetching creator profile...");
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

    const { data: creator, error: creatorError } = await supabase
      .from('creators')
      .select(`
        id,
        display_name,
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

    console.log("Creator profile loaded successfully");
    return creator as Creator;
  }, [navigate, toast]);

  return useQuery({
    queryKey: ['creator-profile'],
    queryFn: fetchCreatorProfile,
    staleTime: 1000 * 30, // 30 seconds
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });
};