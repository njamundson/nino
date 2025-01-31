import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/integrations/supabase/types/application";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

export const useApplications = (brandId?: string) => {
  const queryClient = useQueryClient();

  // Set up real-time subscription
  useEffect(() => {
    console.log('Setting up applications subscription');
    const channel = supabase
      .channel('applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        (payload) => {
          console.log('Application change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['applications', brandId] });
        }
      )
      .subscribe();

    // Also listen for opportunity status changes
    const opportunityChannel = supabase
      .channel('opportunity-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'opportunities'
        },
        (payload) => {
          console.log('Opportunity change detected:', payload);
          queryClient.invalidateQueries({ queryKey: ['applications', brandId] });
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up subscriptions');
      supabase.removeChannel(channel);
      supabase.removeChannel(opportunityChannel);
    };
  }, [queryClient, brandId]);

  return useQuery({
    queryKey: ['applications', brandId],
    queryFn: async () => {
      try {
        console.log('Fetching applications...');
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          console.log('No authenticated user found');
          return [];
        }

        // If brandId is provided, fetch applications for that brand
        if (brandId) {
          const { data, error } = await supabase
            .from('applications')
            .select(`
              *,
              opportunity:opportunities!inner (
                *,
                brand:brands (*)
              ),
              creator:creators!inner (*)
            `)
            .eq('status', 'pending')
            .eq('opportunities.brand_id', brandId);

          if (error) {
            console.error('Error fetching brand applications:', error);
            throw error;
          }

          console.log('Fetched brand applications:', data);
          return (data as Application[]) || [];
        }

        // Get the creator profile for the current user
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (creatorError) {
          console.error('Error fetching creator:', creatorError);
          throw creatorError;
        }

        if (!creator) {
          console.log('No creator profile found');
          return [];
        }

        // Fetch all applications for the creator
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            opportunity:opportunities (
              *,
              brand:brands (*)
            ),
            creator:creators (*)
          `)
          .eq('creator_id', creator.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching applications:', error);
          throw error;
        }

        console.log('Raw applications data:', data);

        // Ensure initiated_by is properly typed
        const typedApplications = data?.map(app => ({
          ...app,
          initiated_by: app.initiated_by as 'brand' | 'creator',
          is_invitation: app.initiated_by === 'brand'
        })) || [];

        console.log('Processed applications with flags:', typedApplications);
        return typedApplications;
      } catch (error) {
        console.error('Error in useApplications:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
  });
};