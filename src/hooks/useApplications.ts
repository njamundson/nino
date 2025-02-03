import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/types/application";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { mapCreatorData } from "@/utils/creatorUtils";

export const useApplications = (brandId?: string) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

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
      void supabase.removeChannel(applicationsChannel);
    };
  }, [queryClient]);

  const fetchApplications = async () => {
    console.log('Fetching applications...');
    const { data: { user }, error: userError } = await supabase.auth.getUser();
      
    if (userError) {
      console.error("Error fetching user:", userError);
      throw new Error('Authentication error. Please try signing in again.');
    }
      
    if (!user) {
      console.log("No authenticated user found");
      throw new Error('Not authenticated');
    }

    if (brandId) {
      console.log('Fetching applications for brand:', brandId);
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          opportunity:opportunities(
            *,
            brand:brands(*)
          ),
          creator:creators(*)
        `)
        .eq('opportunity.brand_id', brandId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching brand applications:', error);
        throw error;
      }

      console.log('Fetched brand applications:', data?.length);
      return (data || []).map((app: any) => ({
        ...app,
        creator: mapCreatorData(app.creator)
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

    console.log('Fetching applications for creator:', creator.id);
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        opportunity:opportunities(
          *,
          brand:brands(*)
        ),
        creator:creators(*)
      `)
      .eq('creator_id', creator.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching creator applications:', error);
      throw error;
    }

    console.log('Fetched creator applications:', data?.length);
    return (data || []).map(app => ({
      ...app,
      initiated_by: app.initiated_by as 'brand' | 'creator',
      is_invitation: app.initiated_by === 'brand',
      creator: mapCreatorData(app.creator)
    }));
  };

  return useQuery({
    queryKey: ['applications', brandId],
    queryFn: fetchApplications,
    staleTime: 1000 * 60, // 1 minute
    gcTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error) => {
      // Only retry network-related errors, up to 3 times
      if (error instanceof Error && error.message.includes('Network')) {
        return failureCount < 3;
      }
      return false;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    refetchOnReconnect: true
  });
};