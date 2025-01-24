import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Application } from "@/types/application";
import { Campaign } from "@/types/campaign";
import CampaignDetails from "./card/CampaignDetails";
import ApplicationsList from "./card/ApplicationsList";

interface CampaignCardProps {
  campaign: Campaign;
  applications: Application[];
  onEdit: (campaign: Campaign) => void;
  onDelete: (id: string) => void;
  onUpdateApplicationStatus: (applicationId: string, status: string) => void;
}

const CampaignCard = ({
  campaign,
  applications,
  onEdit,
  onDelete,
  onUpdateApplicationStatus,
}: CampaignCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      setIsDeleting(true);
      try {
        await onDelete(campaign.id);
        toast.success("Campaign deleted successfully");
      } catch (error) {
        toast.error("Failed to delete campaign");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-start gap-4">
        <CampaignDetails campaign={campaign} />
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(campaign)}
            className="shrink-0"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleDelete}
            disabled={isDeleting}
            className="shrink-0"
          >
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        </div>
      </div>

      <ApplicationsList
        applications={applications}
        onUpdateApplicationStatus={onUpdateApplicationStatus}
      />
    </Card>
  );
};

export default CampaignCard;