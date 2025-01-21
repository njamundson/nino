import { Suspense } from "react";
import DashboardHeader from "./header/DashboardHeader";
import BrandStatsCards from "./brand/stats/BrandStatsCards";
import DashboardContent from "./brand/content/DashboardContent";
import { Loader2 } from "lucide-react";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
  </div>
);

const BrandDashboard = () => {
  return (
    <div className="space-y-6 md:space-y-8">
      <DashboardHeader />
      
      <Suspense fallback={<LoadingSpinner />}>
        <BrandStatsCards />
      </Suspense>
      
      <DashboardContent />
    </div>
  );
};

export default BrandDashboard;