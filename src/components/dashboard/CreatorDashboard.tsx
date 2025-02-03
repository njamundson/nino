import { memo, useEffect } from "react";
import { useCreatorDashboard } from "@/hooks/useCreatorDashboard";
import DashboardError from "./states/DashboardError";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import DashboardWelcome from "./header/DashboardWelcome";
import DashboardStats from "./stats/DashboardStats";
import DashboardSections from "./sections/DashboardSections";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const CreatorDashboard = () => {
  const { data: creator, isLoading, error } = useCreatorDashboard();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Prefetch projects data when dashboard loads
  useEffect(() => {
    const prefetchProjects = async () => {
      console.log('Prefetching projects data...');
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: creator } = await supabase
          .from('creators')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (!creator) {
          console.log("No creator profile found");
          return;
        }

        // Prefetch opportunities data
        await queryClient.prefetchQuery({
          queryKey: ['available-projects'],
          queryFn: async () => {
            const { data: opportunities, error } = await supabase
              .from('opportunities')
              .select(`
                *,
                brand:brands (
                  id,
                  company_name,
                  brand_type,
                  location,
                  description,
                  website,
                  instagram,
                  user_id,
                  phone_number,
                  support_email,
                  profile_image_url,
                  sms_notifications_enabled,
                  two_factor_enabled,
                  created_at,
                  updated_at,
                  onboarding_completed
                ),
                applications!left (
                  id,
                  status,
                  creator_id,
                  initiated_by,
                  cover_letter,
                  created_at,
                  updated_at,
                  opportunity_id
                )
              `)
              .eq('status', 'open');

            if (error) {
              console.error("Error prefetching opportunities:", error);
              return [];
            }

            const opportunitiesWithCreatorId = opportunities?.map(opp => ({
              ...opp,
              current_creator_id: creator.id
            }));

            console.log("Prefetched available projects:", opportunitiesWithCreatorId);
            return opportunitiesWithCreatorId || [];
          },
          staleTime: 1000 * 60 * 5, // Consider data fresh for 5 minutes
        });

      } catch (error) {
        console.error("Error in prefetch:", error);
      }
    };

    void prefetchProjects();
  }, [queryClient]);

  if (error || !creator) {
    console.error("Dashboard error:", error);
    return <DashboardError />;
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="dashboard-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        {!isLoading && (
          <>
            <DashboardWelcome display_name={creator.display_name} />
            <div className="space-y-6 md:space-y-8">
              <DashboardStats />
              <DashboardSections />
            </div>
          </>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default memo(CreatorDashboard);