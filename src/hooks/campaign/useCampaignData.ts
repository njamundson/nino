import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";

type OpportunityPayload = RealtimePostgresChangesPayload<{
  [key: string]: any;
  id: string;
}>;

export const useCampaignData = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

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
      try {
        console.log('Executing campaign data fetch');
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          navigate('/signin');
          throw sessionError;
        }

        if (!session) {
          console.log('No active session found');
          navigate('/signin');
          throw new Error('No active session');
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

        // Fetch campaigns with related data
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
          toast.error('Error loading campaigns');
          throw error;
        }

        console.log(`Successfully fetched ${data?.length || 0} campaigns`);
        return data || [];
      } catch (error) {
        console.error('Error in campaign data fetch:', error);
        toast.error('Error loading campaigns');
        throw error;
      }
    },
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: 2,
    refetchOnMount: "always",
    refetchOnWindowFocus: true,
    refetchOnReconnect: true
  });
};