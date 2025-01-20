import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import CampaignFlow from "@/components/campaign/flow/CampaignFlow";

const NewCampaign = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-16">
      <PageHeader
        title="Create New Campaign"
        description="Set up a new campaign to collaborate with creators."
      />

      <Card className="p-6 bg-white/50 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CampaignFlow />
      </Card>
    </div>
  );
};

export default NewCampaign;