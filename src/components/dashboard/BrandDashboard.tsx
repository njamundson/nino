import BrandStatsCards from "./brand/stats/BrandStatsCards";
import DashboardContent from "./brand/content/DashboardContent";

const BrandDashboard = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      <BrandStatsCards />
      <DashboardContent />
    </div>
  );
};

export default BrandDashboard;