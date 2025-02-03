import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Creator } from "@/types/creator";
import { mapCreatorData } from "@/utils/creatorUtils";
import { useToast } from "@/hooks/use-toast";

export const useCreators = () => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['creators'],
    queryFn: async () => {
      try {
        console.log('Fetching creators');
        const { data, error } = await supabase
          .from('creators')
          .select(`
            id,
            user_id,
            display_name,
            bio,
            location,
            specialties,
            creator_type,
            instagram,
            website,
            profile_image_url
          `)
          .eq('onboarding_completed', true);

        if (error) {
          console.error('Error fetching creators:', error);
          toast({
            title: "Error",
            description: "Failed to load creators. Please try again.",
            variant: "destructive",
          });
          throw error;
        }
        
        console.log('Creators fetched successfully:', data?.length);
        return (data || []).map(creator => mapCreatorData(creator));
      } catch (error) {
        console.error('Error in useCreators:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
    gcTime: 30 * 60 * 1000, // Keep unused data in cache for 30 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};