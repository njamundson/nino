import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useApplications = (brandId?: string) => {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['applications', brandId],
    queryFn: async () => {
      console.log('Fetching applications...');
      
      // Get and validate session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
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
          console.error('Error fetching applications:', error);
          toast({
            title: "Error",
            description: "Failed to fetch applications",
            variant: "destructive",
          });
          throw error;
        }

        console.log('Fetched applications data:', data);
        return data || [];
      }

      // Get creator ID first
      const { data: creator, error: creatorError } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (creatorError) {
        console.error('Error fetching creator:', creatorError);
        toast({
          title: "Error",
          description: "Failed to fetch creator profile",
          variant: "destructive",
        });
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
        toast({
          title: "Error",
          description: "Failed to fetch applications",
          variant: "destructive",
        });
        throw error;
      }

      console.log('Raw applications data:', data);

      // Add is_invitation flag based on who initiated the application
      const applicationsWithFlag = data?.map(app => ({
        ...app,
        is_invitation: app.initiated_by === 'brand'
      })) || [];

      console.log('Processed applications with flags:', applicationsWithFlag);
      return applicationsWithFlag;
    },
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: "always", // Refetch when component mounts
    retry: 3, // Retry failed requests 3 times
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};