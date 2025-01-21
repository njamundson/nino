import { Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import CampaignFormContainer from "@/components/campaign/form/CampaignFormContainer";
import QuickNotes from "../../notes/QuickNotes";

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-[200px]">
    <Loader2 className="h-8 w-8 animate-spin text-nino-primary" />
  </div>
);

const DashboardContent = () => {
  return (
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
  );
};

export default DashboardContent;