import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface CampaignCardProps {
  campaign: any;
  onEdit: (campaign: any) => void;
  onDelete: (id: string) => void;
}

const CampaignCard = ({ campaign, onEdit, onDelete }: CampaignCardProps) => {
  return (
    <Card className="overflow-hidden backdrop-blur-lg bg-white/80 border-0 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl">
      <div className="p-8">
        <div className="flex justify-between items-start">
          <div className="space-y-6 flex-1">
            <div>
              <h3 className="text-2xl font-medium text-gray-900 tracking-tight mb-2">
                {campaign.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {campaign.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="space-y-1.5">
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

                {campaign.start_date && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-sm text-gray-600 flex items-center gap-2">
                      <span className="w-5 text-gray-400">🗓️</span>
                      {format(new Date(campaign.start_date), 'MMM d, yyyy')}
                      {campaign.end_date && (
                        <span className="text-gray-400">→</span>
                      )}
                      {campaign.end_date && format(new Date(campaign.end_date), 'MMM d, yyyy')}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
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
          </div>

          <div className="flex gap-2 ml-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(campaign)}
              className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/80"
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(campaign.id)}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CampaignCard;