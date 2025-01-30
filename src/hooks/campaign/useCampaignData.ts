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
    console.log('Setting up real-time subscription');
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
          queryClient.invalidateQueries({ 
            queryKey: ['my-campaigns']
          });
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
      console.log('Executing campaign data fetch');
      
      // Get current session and refresh if needed
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw sessionError;
      }

      if (!session) {
        console.log('No active session found');
        throw new Error('No active session');
      }

      // Refresh session to ensure token is valid
      const { error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) {
        console.error('Error refreshing session:', refreshError);
        throw refreshError;
      }

      // Get the brand ID first
      const { data: brand, error: brandError } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (brandError) {
        console.error('Error fetching brand:', brandError);
        toast.error('Error loading brand data');
        throw brandError;
      }

      if (!brand) {
        console.log('No brand found for user');
        return [];
      }

      // Fetch campaigns with related data, excluding inactive ones
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
        .neq('status', 'inactive') // Filter out inactive campaigns
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching campaigns:', error);
        toast.error('Error loading campaigns');
        throw error;
      }

      console.log(`Successfully fetched ${data?.length || 0} campaigns`);
      return data || [];
    },
    staleTime: 0,
    gcTime: 0,
    retry: 2,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });
};