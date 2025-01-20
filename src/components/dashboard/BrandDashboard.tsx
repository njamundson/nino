import BrandStatsCards from "./stats/BrandStatsCards";
import QuickNotes from "./notes/QuickNotes";
import DashboardHeader from "./header/DashboardHeader";
import CampaignForm from "../campaign/CampaignForm";
import { Card } from "../ui/card";

const BrandDashboard = () => {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <BrandStatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/50 backdrop-blur-sm border-0 shadow-lg rounded-3xl overflow-hidden">
          <div className="p-6 h-[calc(100vh-24rem)] overflow-auto scrollbar-hide">
            <h3 className="text-xl font-semibold text-nino-text mb-4">Create New Campaign</h3>
            <CampaignForm compact={true} />
          </div>
        </Card>
        <QuickNotes />
      </div>
    </div>
  );
};

export default BrandDashboard;