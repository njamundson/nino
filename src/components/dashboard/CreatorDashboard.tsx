import QuickNotes from "./notes/QuickNotes";
import DashboardHeader from "./header/DashboardHeader";
import RecentMessages from "./messages/RecentMessages";
import StatsCards from "./stats/StatsCards";

const CreatorDashboard = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <StatsCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMessages />
        <QuickNotes />
      </div>
    </div>
  );
};

export default CreatorDashboard;