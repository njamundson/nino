import DashboardHeader from './header/DashboardHeader';
import StatsCards from './stats/StatsCards';
import QuickNotes from './notes/QuickNotes';
import RecentMessages from './messages/RecentMessages';

const CreatorDashboard = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <RecentMessages />
        </div>
        <div className="lg:col-span-1">
          <QuickNotes />
        </div>
      </div>
    </div>
  );
};

export default CreatorDashboard;