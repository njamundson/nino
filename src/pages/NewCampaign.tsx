import { Card } from "@/components/ui/card";
import PageHeader from "@/components/shared/PageHeader";

const NewCampaign = () => {
  return (
    <div className="space-y-8">
      <PageHeader
        title="Create New Campaign"
        description="Set up a new campaign to collaborate with creators."
      />

      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          Campaign creation form will be implemented here
        </div>
      </Card>
    </div>
  );
};

export default NewCampaign;