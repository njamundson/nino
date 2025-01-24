import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

type OpportunityPayload = RealtimePostgresChangesPayload<{
  [key: string]: any;
  id: string;
}>;

export const useCampaignData = () => {
  const queryClient = useQueryClient();

  // Set up real-time subscription for campaign updates
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
        (payload: OpportunityPayload) => {
          console.log('Campaign data changed:', payload);
          // Only invalidate the specific campaign that changed
          if (payload.new && 'id' in payload.new) {
            queryClient.invalidateQueries({ 
              queryKey: ['my-campaigns', payload.new.id] 
            });
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up Supabase channel');
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return useQuery({
    queryKey: ['my-campaigns'],
    queryFn: async () => {
      console.log('Fetching campaigns data');
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No user found');
        return [];
      }

      // First get the brand ID in a separate query
      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!brand) {
        console.log('No brand found for user');
        return [];
      }

      // Then use the brand ID to fetch campaigns with optimized select
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          id,
          title,
          description,
          start_date,
          end_date,
          status,
          requirements,
          perks,
          location,
          payment_details,
          compensation_details,
          deliverables,
          image_url,
          created_at,
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

      if (error) {
        console.error('Error fetching campaigns:', error);
        toast.error('Error loading campaigns. Please try again.');
        throw error;
      }

      console.log('Campaigns data fetched:', data?.length || 0);
      return data || [];
    },
    staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
    gcTime: 1000 * 60 * 15, // Keep unused data in cache for 15 minutes
    refetchOnWindowFocus: false, // Don't refetch when window regains focus
    retry: 1, // Only retry once on failure
  });
};