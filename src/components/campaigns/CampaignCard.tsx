import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CampaignCardProps {
  campaign: any;
  onDelete?: () => void;
  onEdit?: (campaign: any) => void;
}

const CampaignCard = ({ campaign, onDelete, onEdit }: CampaignCardProps) => {
  const handleDelete = async () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold">{campaign.title}</h3>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(campaign)}
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground">{campaign.description}</p>
    </Card>
  );
};

export default CampaignCard;