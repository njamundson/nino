import CampaignFormContainer from "@/components/campaign/form/CampaignFormContainer";
import PageHeader from "@/components/shared/PageHeader";

const NewCampaign = () => {
  return (
    <div className="min-h-screen bg-nino-bg py-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Create New Campaign"
          description="Set up a new campaign to collaborate with creators"
        />
        <div className="mt-8 bg-white rounded-xl shadow-lg">
          <CampaignFormContainer />
        </div>
      </div>
    </div>
  );
};

export default NewCampaign;