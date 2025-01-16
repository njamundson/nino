import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import CampaignForm from "@/components/campaign/CampaignForm";

const NewCampaign = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-12 pb-16">
      <PageHeader
        title="Create New Campaign"
        description="Set up a new campaign to collaborate with creators."
      />

      <Card className="p-10 bg-white/50 backdrop-blur-sm border-0 shadow-lg rounded-2xl">
        <CampaignForm />
      </Card>
    </div>
  );
};

export default NewCampaign;