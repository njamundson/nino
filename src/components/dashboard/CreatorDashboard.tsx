import QuickNotes from "./notes/QuickNotes";
import RecentMessages from "./messages/RecentMessages";
import StatsCards from "./stats/StatsCards";
import { useIsMobile } from "@/hooks/use-mobile";
import PageHeader from "@/components/shared/PageHeader";
import { useCreatorDashboard } from "@/hooks/useCreatorDashboard";
import DashboardLoading from "./states/DashboardLoading";
import DashboardError from "./states/DashboardError";

const CreatorDashboard = () => {
  const isMobile = useIsMobile();
  const { data: creator, isLoading, error } = useCreatorDashboard();

  console.log("Dashboard state:", { creator, isLoading, error });

  if (isLoading) {
    return <DashboardLoading />;
  }

  if (error || !creator) {
    console.error("Dashboard error:", error);
    return <DashboardError />;
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