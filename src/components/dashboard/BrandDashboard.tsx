import { useState } from "react";
import DashboardHeader from "./header/DashboardHeader";
import CampaignFormContainer from "../campaign/form/CampaignFormContainer";
import QuickNotes from "./notes/QuickNotes";
import { Card } from "../ui/card";

const BrandDashboard = () => {
  return (
    <div className="space-y-8">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm rounded-3xl overflow-hidden p-6">
          <h3 className="text-xl font-semibold text-nino-text mb-6">New Campaign</h3>
          <CampaignFormContainer />
        </Card>
        <QuickNotes />
      </div>
    </div>
  );
};

export default BrandDashboard;