import { Card } from "@/components/ui/card";

const EmptyCampaigns = () => {
  return (
    <Card className="p-12">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No campaigns found
        </h3>
        <p className="text-gray-500">
          When you create campaigns, they will appear here.
        </p>
      </div>
    </Card>
  );
};

export default EmptyCampaigns;