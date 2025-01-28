import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, MoreVertical } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface CampaignCardProps {
  campaign: {
    id: string;
    title: string;
    description: string | null;
    start_date: string | null;
    end_date: string | null;
    status: string;
    location: string | null;
    payment_details: string | null;
    compensation_details: string | null;
  };
  onEdit: (campaign: any) => void;
  onDelete: (id: string) => void;
}

const CampaignCard = ({ campaign, onEdit, onDelete }: CampaignCardProps) => {
  const handleDelete = async () => {
    try {
      await onDelete(campaign.id);
      toast.success("Campaign deleted successfully");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
    }
  };

  return (
    <Card className="bg-white border border-gray-100/50 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.06)] transition-all duration-300">
      <div className="p-6 space-y-6">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-xl font-semibold text-nino-text">
              {campaign.title}
            </h3>
            {campaign.location && (
              <p className="text-nino-gray flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                {campaign.location}
              </p>
            )}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(campaign)}>
                Edit campaign
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-600"
                onClick={handleDelete}
              >
                Delete campaign
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-nino-gray">{campaign.description}</p>
          </div>

          {(campaign.start_date || campaign.end_date) && (
            <div className="flex items-center gap-2 text-nino-gray">
              <Calendar className="h-4 w-4" />
              <span>
                {campaign.start_date && formatDate(campaign.start_date)}
                {campaign.end_date && ` - ${formatDate(campaign.end_date)}`}
              </span>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {campaign.payment_details && (
              <Badge variant="secondary" className="bg-nino-bg text-nino-text px-2 py-0.5">
                💰 {campaign.payment_details}
              </Badge>
            )}
            {campaign.compensation_details && (
              <Badge variant="secondary" className="bg-nino-bg text-nino-text px-2 py-0.5">
                🎁 {campaign.compensation_details}
              </Badge>
            )}
            <Badge
              variant={campaign.status === "open" ? "default" : "secondary"}
              className={`px-2 py-0.5 ${
                campaign.status === "open" 
                  ? "bg-nino-primary text-white" 
                  : "bg-nino-bg text-nino-text"
              }`}
            >
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CampaignCard;