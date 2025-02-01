import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const usePrefetchData = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const prefetchData = async () => {
      console.log("Prefetching data for other pages...");

      // Prefetch creators data
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
        }
      });

      // Prefetch campaigns data
      await queryClient.prefetchQuery({
        queryKey: ['campaigns'],
        queryFn: async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return [];

          const { data: brand } = await supabase
            .from('brands')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (!brand) return [];

          const { data, error } = await supabase
            .from('opportunities')
            .select('*')
            .eq('brand_id', brand.id);

          if (error) throw error;
          return data;
        }
      });

      // Prefetch applications data
      await queryClient.prefetchQuery({
        queryKey: ['applications'],
        queryFn: async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return [];

          const { data: brand } = await supabase
            .from('brands')
            .select('id')
            .eq('user_id', user.id)
            .single();

          if (!brand) return [];

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
        }
      });

      // Prefetch messages data
      await queryClient.prefetchQuery({
        queryKey: ['messages'],
        queryFn: async () => {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return [];

          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
            .order('created_at', { ascending: false })
            .limit(50);

          if (error) throw error;
          return data;
        }
      });

      console.log("Data prefetching completed");
    };

    prefetchData();
  }, [queryClient]);
};
