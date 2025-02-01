import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/application";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CreatorType } from "@/types/creator";

export const useApplications = (brandId?: string) => {
  const queryClient = useQueryClient();

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
          return data.map((app: any) => ({
            ...app,
            creator: {
              ...app.creator,
              profileImage: app.creator.profile_image_url,
              creatorType: app.creator.creator_type as CreatorType,
              creator_type: app.creator.creator_type as CreatorType
            }
          })) as Application[];
        }

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

        const typedApplications = data?.map(app => ({
          ...app,
          initiated_by: app.initiated_by as 'brand' | 'creator',
          is_invitation: app.initiated_by === 'brand',
          creator: {
            ...app.creator,
            profileImage: app.creator.profile_image_url,
            creatorType: app.creator.creator_type as CreatorType,
            creator_type: app.creator.creator_type as CreatorType
          }
        })) || [];

        console.log('Processed applications with flags:', typedApplications);
        return typedApplications as Application[];
      } catch (error) {
        console.error('Error in useApplications:', error);
        throw error;
      }
    },
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // Consider data stale after 5 minutes
  });
};