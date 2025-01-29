import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CampaignCardProps {
  campaign: any;
  onDelete?: () => void;
  onEdit?: (campaign: any) => void;
}

const CampaignCard = ({ campaign, onDelete, onEdit }: CampaignCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasApplications = campaign.applications && campaign.applications.length > 0;

  const handleDelete = async () => {
    if (onDelete) {
      onDelete();
    }
  };

  return (
    <Card className="overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="p-6 space-y-6">
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
                className="text-gray-600 hover:text-gray-900 border-gray-200"
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-gray-600 hover:text-gray-900 border-gray-200"
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
      </div>

      {hasApplications && (
        <div className="border-t border-gray-100">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <span className="font-medium text-gray-700">
              Applications ({campaign.applications.length})
            </span>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-500" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-500" />
            )}
          </Button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="p-4 space-y-3 bg-gray-50">
                  {campaign.applications.map((application: any) => (
                    <div
                      key={application.id}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                    >
                      <div className="flex items-center gap-3">
                        {application.creator?.profile_image_url && (
                          <img
                            src={application.creator.profile_image_url}
                            alt="Creator"
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <p className="font-medium text-sm text-gray-900">
                            {application.creator?.first_name} {application.creator?.last_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            Applied {format(new Date(application.created_at), 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        onClick={() => window.open(`/applications/${application.id}`, '_blank')}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </Card>
  );
};

export default CampaignCard;