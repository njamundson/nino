import QuickNotes from "./notes/QuickNotes";
import RecentMessages from "./messages/RecentMessages";
import StatsCards from "./stats/StatsCards";
import { useIsMobile } from "@/hooks/use-mobile";
import PageHeader from "@/components/shared/PageHeader";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const CreatorDashboard = () => {
  const isMobile = useIsMobile();

  const { data: creator, isLoading, error } = useQuery({
    queryKey: ['creator-profile'],
    queryFn: async () => {
      try {
        console.log("Fetching creator profile...");
        const { data: { user } } = await supabase.auth.getUser();
        console.log("Current user:", user);
        
        if (!user) {
          console.error("No user found");
          throw new Error('No user found');
        }

        const { data: creator, error } = await supabase
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
            user_id
          `)
          .eq('user_id', user.id)
          .maybeSingle();

        if (error) {
          console.error("Error fetching creator:", error);
          throw error;
        }

        console.log("Creator data:", creator);
        return creator;
      } catch (error) {
        console.error("Error in creator profile query:", error);
        throw error;
      }
    },
    retry: 1
  });

  console.log("Query state:", { isLoading, error, creator });

  if (error) {
    console.error("Error in component:", error);
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-500">
          Error loading dashboard. Please try again later.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!creator) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-500">
          Creator profile not found. Please complete onboarding.
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