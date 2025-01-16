import { useState } from "react";
import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";
import CampaignForm from "@/components/campaign/CampaignForm";

const NewCampaign = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <PageHeader
        title="Create New Campaign"
        description="Set up a new campaign to collaborate with creators."
      />

      <Card className="p-8 bg-white/50 backdrop-blur-sm border-0 shadow-lg">
        <CampaignForm />
      </Card>
    </div>
  );
};

export default NewCampaign;