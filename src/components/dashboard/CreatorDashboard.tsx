import QuickNotes from "./notes/QuickNotes";
import DashboardHeader from "./header/DashboardHeader";
import RecentMessages from "./messages/RecentMessages";
import StatsCards from "./stats/StatsCards";
import { useIsMobile } from "@/hooks/use-mobile";

const CreatorDashboard = () => {
  const isMobile = useIsMobile();

  return (
    <div className="space-y-6 md:space-y-8">
      <DashboardHeader />
      <StatsCards />
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-2 gap-6'}`}>
        <RecentMessages />
        <QuickNotes />
      </div>
    </div>
  );
};

export default CreatorDashboard;