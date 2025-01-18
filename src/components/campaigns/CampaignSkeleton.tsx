import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const CampaignSkeleton = () => {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-1/3" />
        <div className="flex gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
    </Card>
  );
};

export default CampaignSkeleton;