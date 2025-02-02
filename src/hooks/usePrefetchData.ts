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

        // Get brand ID once if needed for multiple queries
        const { data: brand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        // Prefetch creators with a longer stale time since creator data changes less frequently
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
          staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        });

        if (brand?.id) {
          // Prefetch campaigns with shorter stale time as they update more frequently
          await queryClient.prefetchQuery({
            queryKey: ['campaigns'],
            queryFn: async () => {
              const { data, error } = await supabase
                .from('opportunities')
                .select('*')
                .eq('brand_id', brand.id);

              if (error) throw error;
              return data;
            },
            staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
          });

          // Prefetch applications
          await queryClient.prefetchQuery({
            queryKey: ['applications'],
            queryFn: async () => {
              const { data, error } = await supabase
                .from('applications')
                .select(`
                  *,
                  opportunity:opportunities!inner (*),
                  creator:creators!inner (*)
                `)
                .eq('opportunities.brand_id', brand.id);

              if (error) throw error;
              return data;
            },
            staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
          });
        }

        // Prefetch messages with short stale time as they update frequently
        await queryClient.prefetchQuery({
          queryKey: ['messages'],
          queryFn: async () => {
            const { data, error } = await supabase
              .from('messages')
              .select('*')
              .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
              .order('created_at', { ascending: false })
              .limit(50);

            if (error) throw error;
            return data;
          },
          staleTime: 1000 * 30, // Consider data fresh for 30 seconds
        });

        console.log("Data prefetching completed successfully");
      } catch (error) {
        console.error("Error during data prefetching:", error);
      }
    };

    prefetchData();
  }, [queryClient]);
};