import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

export const useCampaignData = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'opportunities'
        },
        () => {
          // Refetch campaigns when a new one is created
          queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['my-campaigns'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!brand) return [];

      const { data } = await supabase
        .from('opportunities')
        .select(`
          *,
          brand:brands (
            company_name,
            brand_type,
            location
          ),
          applications (
            id,
            status,
            cover_letter,
            creator:creators (
              id,
              profile_image_url,
              user_id,
              profile:profiles (
                first_name,
                last_name
              )
            )
          )
        `)
        .eq('brand_id', brand.id)
        .order('created_at', { ascending: false });

      return data || [];
    },
  });
};