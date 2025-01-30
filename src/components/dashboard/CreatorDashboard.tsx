import { memo, useEffect } from "react";
import { useCreatorDashboard } from "@/hooks/useCreatorDashboard";
import DashboardLoading from "./states/DashboardLoading";
import DashboardError from "./states/DashboardError";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import DashboardWelcome from "./header/DashboardWelcome";
import DashboardStats from "./stats/DashboardStats";
import DashboardSections from "./sections/DashboardSections";
import DashboardHeader from "./header/DashboardHeader";

const CreatorDashboard = () => {
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
      <DashboardHeader />
      <DashboardWelcome firstName={creator.first_name} />
      <div className="space-y-6 md:space-y-8">
        <DashboardStats />
        <DashboardSections />
      </div>
    </motion.div>
  );
};

export default memo(CreatorDashboard);