import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/application";
import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { CreatorType } from "@/types/creator";
import { mapCreatorData } from "@/utils/creatorUtils";

export const useApplications = (brandId?: string) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const applicationsChannel = supabase
      .channel('applications-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applications'
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['applications'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(applicationsChannel);
    };
  }, [queryClient]);

  const fetchApplications = async () => {
    try {
      console.log('Fetching applications...');
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.log('No authenticated user found');
        return [];
      }

      if (brandId) {
        console.log('Fetching applications for brand:', brandId);
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            opportunity:opportunities(*),
            creator:creators(*)
          `)
          .eq('opportunity.brand_id', brandId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching brand applications:', error);
          throw error;
        }

        console.log('Fetched brand applications:', data);
        return data.map((app: any) => ({
          ...app,
          creator: mapCreatorData(app.creator)
        })) as Application[];
      }

      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (creatorError) {
        console.error('Error fetching creator:', creatorError);
        throw creatorError;
      }

      if (!creator) {
        console.log('No creator profile found');
        return [];
      }

      console.log('Fetching applications for creator:', creator.id);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities(*),
          creator:creators(*)
        `)
        .eq('creator_id', creator.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching creator applications:', error);
        throw error;
      }

      console.log('Fetched creator applications:', data);
      const typedApplications = data?.map(app => ({
        ...app,
        initiated_by: app.initiated_by as 'brand' | 'creator',
        is_invitation: app.initiated_by === 'brand',
        creator: mapCreatorData(app.creator)
      })) || [];

      console.log('Processed applications with flags:', typedApplications);
      return typedApplications;
    } catch (error) {
      console.error('Error in fetchApplications:', error);
      throw error;
    }
  };

  return fetchApplications;
};