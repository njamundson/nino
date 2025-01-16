import DashboardHeader from './header/DashboardHeader';
import StatsCards from './stats/StatsCards';
import QuickNotes from './notes/QuickNotes';
import RecentMessages from './messages/RecentMessages';

const CreatorDashboard = () => {
  return (
    <div className="flex-1 p-8 space-y-6">
      <DashboardHeader />
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickNotes />
        </div>
        <div className="lg:col-span-1">
          <RecentMessages />
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;