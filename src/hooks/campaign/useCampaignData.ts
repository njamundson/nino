import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";

export const useCampaignData = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities'
        },
        () => {
          console.log('Campaign data changed, invalidating query cache');
          queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up Supabase channel');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const query = useQuery({
    queryKey: ['my-campaigns'],
    queryFn: async () => {
      console.log('Fetching campaigns data');
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error fetching user:', userError);
        toast.error('Error loading campaigns. Please try again.');
        throw userError;
      }

      if (!user) {
        console.log('No user found');
        return [];
      }

      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (brandError) {
        console.error('Error fetching brand:', brandError);
        toast.error('Error loading brand information. Please try again.');
        throw brandError;
      }

      if (!brand) {
        console.log('No brand found for user');
        return [];
      }

      const { data, error: campaignsError } = await supabase
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

      if (campaignsError) {
        console.error('Error fetching campaigns:', campaignsError);
        toast.error('Error loading campaigns. Please try again.');
        throw campaignsError;
      }

      console.log('Campaigns data fetched:', data);
      return data || [];
    },
    retry: 2,
    staleTime: 1000 * 60, // Consider data fresh for 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return query;
};