import { Suspense } from "react";
import DashboardHeader from "./header/DashboardHeader";
import CampaignFormContainer from "../campaign/form/CampaignFormContainer";
import QuickNotes from "./notes/QuickNotes";
import { Card } from "../ui/card";
import BrandStatsCards from "./stats/BrandStatsCards";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
  </div>
);

const BrandDashboard = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      
      <Suspense fallback={<LoadingSpinner />}>
        <BrandStatsCards />
      </Suspense>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm rounded-3xl overflow-hidden p-6">
          <h3 className="text-xl font-semibold text-nino-text mb-6">New Campaign</h3>
          <Suspense fallback={<LoadingSpinner />}>
            <CampaignFormContainer />
          </Suspense>
        </Card>
        
        <Suspense fallback={<LoadingSpinner />}>
          <QuickNotes />
        </Suspense>
      </div>
    </div>
  );
};

export default BrandDashboard;