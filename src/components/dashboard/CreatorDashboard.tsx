import { memo, useEffect } from "react";
import QuickNotes from "./notes/QuickNotes";
import Goals from "./goals/Goals";
import StatsCards from "./stats/StatsCards";
import { useIsMobile } from "@/hooks/use-mobile";
import PageHeader from "@/components/shared/PageHeader";
import { useCreatorDashboard } from "@/hooks/useCreatorDashboard";
import DashboardLoading from "./states/DashboardLoading";
import DashboardError from "./states/DashboardError";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

// Memoize child components to prevent unnecessary re-renders
const MemoizedStatsCards = memo(StatsCards);
const MemoizedGoals = memo(Goals);
const MemoizedQuickNotes = memo(QuickNotes);

const CreatorDashboard = () => {
  const isMobile = useIsMobile();
  const { data: creator, isLoading, error } = useCreatorDashboard();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      console.error("Dashboard error:", error);
      toast({
        title: "Error loading dashboard",
        description: "Please try refreshing the page",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error || !creator) {
    return <DashboardError />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      layout
    >
      <PageHeader 
        title="Dashboard" 
        description={`Welcome back${creator.first_name ? `, ${creator.first_name}` : ''}! Here's an overview of your activity`}
      />
      <div className="space-y-6 md:space-y-8">
        <MemoizedStatsCards />
        <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-2 gap-6'}`}>
          <MemoizedGoals />
          <MemoizedQuickNotes />
        </div>
      </div>
    </motion.div>
  );
};

export default memo(CreatorDashboard);