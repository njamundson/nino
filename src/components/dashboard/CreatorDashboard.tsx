import QuickNotes from "./notes/QuickNotes";
import RecentMessages from "./messages/RecentMessages";
import StatsCards from "./stats/StatsCards";
import { useIsMobile } from "@/hooks/use-mobile";
import PageHeader from "@/components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const CreatorDashboard = () => {
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: creator, isLoading, error } = useQuery({
    queryKey: ['creator-profile'],
    queryFn: async () => {
      try {
        // First check if we have an authenticated user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error fetching user:", userError);
          throw userError;
        }
        
        if (!user) {
          navigate('/auth');
          return null;
        }

        // Then fetch the creator profile
        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select(`
            id,
            first_name,
            last_name,
            bio,
            location,
            instagram,
            website,
            specialties,
            creator_type,
            profile_image_url,
            user_id,
            onboarding_completed
          `)
          .eq('user_id', user.id)
          .maybeSingle();

        if (creatorError) {
          console.error("Error fetching creator:", creatorError);
          toast({
            title: "Error loading profile",
            description: "There was a problem loading your profile. Please try refreshing the page.",
            variant: "destructive",
          });
          throw creatorError;
        }

        // Handle missing creator profile
        if (!creator) {
          console.log("No creator profile found, redirecting to onboarding");
          navigate('/creator/welcome');
          return null;
        }

        // Handle incomplete onboarding
        if (!creator.onboarding_completed) {
          console.log("Onboarding not completed, redirecting to welcome page");
          navigate('/creator/welcome');
          return null;
        }

        return creator;
      } catch (error) {
        console.error("Error in creator profile query:", error);
        toast({
          title: "Error loading profile",
          description: "There was a problem loading your profile. Please try refreshing the page.",
          variant: "destructive",
        });
        throw error;
      }
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false // Changed to false since we handle navigation in the query
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500">
          Error loading dashboard. Please try refreshing the page.
        </p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        description={`Welcome back${creator.first_name ? `, ${creator.first_name}` : ''}! Here's an overview of your activity`}
      />
      <div className="space-y-6 md:space-y-8">
        <StatsCards />
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-2 gap-6'}`}>
          <RecentMessages />
          <QuickNotes />
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;