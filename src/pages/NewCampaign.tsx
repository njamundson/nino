import CampaignFormContainer from "@/components/campaign/form/CampaignFormContainer";

const NewCampaign = () => {
  return (
    <div className="min-h-screen bg-gray-50/50 py-8">
      <div className="container">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">
          Create New Campaign
        </h1>
        <CampaignFormContainer />
      </div>
    </div>
  );
};

export default NewCampaign;