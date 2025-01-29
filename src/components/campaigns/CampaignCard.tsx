import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";

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
    <Card className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{campaign.title}</h3>
          <p className="text-sm text-gray-500">{campaign.description}</p>
        </div>
        <div className="flex gap-2">
          {onEdit && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit(campaign)}
              className="text-gray-600 hover:text-gray-900"
            >
              Edit
            </Button>
          )}
          {onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              className="text-gray-600 hover:text-gray-900"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 pt-4 border-t border-gray-100">
        <div className="space-y-3">
          {campaign.location && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-5 text-gray-400">📍</span>
              {campaign.location}
            </p>
          )}
          {campaign.payment_details && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-5 text-gray-400">💰</span>
              {campaign.payment_details}
            </p>
          )}
          {campaign.compensation_details && (
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <span className="w-5 text-gray-400">🎁</span>
              {campaign.compensation_details}
            </p>
          )}
        </div>

        <div className="space-y-4">
          {campaign.start_date && (
            <div>
              <p className="text-sm text-gray-600 flex items-center gap-2">
                <span className="w-5 text-gray-400">🗓️</span>
                {format(new Date(campaign.start_date), 'MMM d, yyyy')}
                {campaign.end_date && (
                  <>
                    <span className="text-gray-400">→</span>
                    {format(new Date(campaign.end_date), 'MMM d, yyyy')}
                  </>
                )}
              </p>
            </div>
          )}

          {campaign.requirements?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements</h4>
              <ul className="space-y-1">
                {campaign.requirements.map((req: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {campaign.deliverables?.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-2">Deliverables</h4>
              <ul className="space-y-1">
                {campaign.deliverables.map((del: string, index: number) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-gray-400">•</span>
                    {del}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default CampaignCard;