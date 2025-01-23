import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import QuickNotes from "./notes/QuickNotes";
import RecentMessages from "./messages/RecentMessages";
import StatsCards from "./stats/StatsCards";
import { useIsMobile } from "@/hooks/use-mobile";
import PageHeader from "@/components/shared/PageHeader";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const CreatorDashboard = () => {
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkCreatorProfile = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError("No active session found");
          setLoading(false);
          return;
        }

        const { data: creator, error: creatorError } = await supabase
          .from('creators')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (creatorError) {
          console.error("Error fetching creator:", creatorError);
          throw creatorError;
        }

        if (!creator) {
          setError("Creator profile not found");
          toast({
            title: "Error",
            description: "Creator profile not found. Please complete onboarding.",
            variant: "destructive",
          });
        }

        setLoading(false);
      } catch (error) {
        console.error("Error in checkCreatorProfile:", error);
        setError("Failed to load dashboard");
        toast({
          title: "Error",
          description: "Failed to load dashboard. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
      }
    };

    checkCreatorProfile();
  }, [toast]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <p className="text-lg text-gray-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        description="Welcome back! Here's an overview of your activity"
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