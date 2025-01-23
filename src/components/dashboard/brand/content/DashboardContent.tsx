import { Card } from "@/components/ui/card";
import CampaignFormContainer from "@/components/campaign/form/CampaignFormContainer";
import QuickNotes from "../../notes/QuickNotes";

const DashboardContent = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Card className="bg-white shadow-sm rounded-3xl overflow-hidden p-4 md:p-6">
        <h3 className="text-xl font-semibold text-nino-text mb-6 px-8">New Campaign</h3>
        <CampaignFormContainer />
      </Card>
      <QuickNotes />
    </div>
  );
};

export default DashboardContent;