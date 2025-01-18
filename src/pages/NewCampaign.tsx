import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import CampaignForm from "@/components/campaign/CampaignForm";

const NewCampaign = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50/50 px-4">
      <div className="max-w-3xl mx-auto space-y-12 py-16">
        <PageHeader
          title="Create New Campaign"
          description="Set up a new campaign to collaborate with creators."
        />

        <Card className="overflow-hidden border-0 shadow-xl shadow-gray-100/50 rounded-3xl bg-white/70 backdrop-blur-xl">
          <div className="p-8 md:p-12">
            <CampaignForm />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default NewCampaign;