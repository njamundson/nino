import CampaignFormContainer from "@/components/campaign/form/CampaignFormContainer";
import PageHeader from "@/components/shared/PageHeader";

const NewCampaign = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Create New Campaign"
        description="Set up a new campaign to collaborate with creators"
      />
      <div className="bg-white rounded-xl shadow-lg">
        <CampaignFormContainer />
      </div>
    </div>
  );
};

export default NewCampaign;