import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePrefetchData = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetchData = async () => {
      console.log("Starting data prefetch...");
      
      try {
        // Get current user session once for all queries
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log("No authenticated user found");
          return;
        }

        // Prefetch creators with optimized configuration
        await queryClient.prefetchQuery({
          queryKey: ['creators'],
          queryFn: async () => {
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
                profile_image_url,
                profile:profiles(display_name)
              `)
              .eq('onboarding_completed', true);

            if (error) throw error;
            return data;
          },
          staleTime: 1000 * 60 * 5, // 5 minutes
          gcTime: 1000 * 60 * 10, // 10 minutes
        });

        console.log("Data prefetching completed successfully");
      } catch (error) {
        console.error("Error during data prefetching:", error);
      }
    };

    prefetchData();
  }, [queryClient]);
};