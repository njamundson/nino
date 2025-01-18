import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2, ChevronDown, ChevronUp, Eye, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { useNavigate } from "react-router-dom";
import CreatorProfileModal from "./modals/CreatorProfileModal";

interface CampaignCardProps {
  campaign: any;
  onEdit: (campaign: any) => void;
  onDelete: (id: string) => void;
  applications?: any[];
  onUpdateApplicationStatus?: (applicationId: string, newStatus: 'accepted' | 'rejected') => void;
}

const CampaignCard = ({ campaign, onEdit, onDelete, applications = [], onUpdateApplicationStatus }: CampaignCardProps) => {
  const [showApplications, setShowApplications] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const handleMessageCreator = (userId: string) => {
    navigate(`/brand/messages?userId=${userId}`);
  };

  const handleViewProfile = (application: any) => {
    setSelectedCreator(application.creator);
    setSelectedApplication(application);
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const handleUpdateStatus = (applicationId: string) => (newStatus: 'accepted' | 'rejected') => {
    if (onUpdateApplicationStatus) {
      onUpdateApplicationStatus(applicationId, newStatus);
    }
  };

  return (
    <>
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

          {applications.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <Button
                variant="ghost"
                className="w-full justify-between"
                onClick={() => setShowApplications(!showApplications)}
              >
                <span className="font-medium">
                  Applications ({applications.length})
                </span>
                {showApplications ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>

              {showApplications && (
                <div className="mt-4 space-y-4">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="p-6 rounded-lg bg-gray-50 flex items-start justify-between"
                    >
                      <div className="flex-1 flex items-start gap-6">
                        <Avatar className="h-16 w-16 rounded-full border-2 border-white shadow-sm overflow-hidden">
                          {application.creator?.profile_image_url ? (
                            <AvatarImage
                              src={`${application.creator.profile_image_url}?${new Date().getTime()}`}
                              alt={`${application.creator?.profile?.first_name || ''} ${application.creator?.profile?.last_name || ''}`}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <AvatarFallback className="bg-gray-100 text-gray-600">
                              {getInitials(
                                application.creator?.profile?.first_name || '',
                                application.creator?.profile?.last_name || ''
                              )}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="space-y-2 flex-1">
                          <h4 className="text-2xl font-medium text-gray-900 tracking-tight">
                            {application.creator?.profile?.first_name} {application.creator?.profile?.last_name}
                          </h4>
                          <p className="text-gray-600 leading-relaxed">
                            {application.cover_letter}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewProfile(application)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Profile
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMessageCreator(application.creator?.user_id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {selectedCreator && selectedApplication && (
        <CreatorProfileModal
          isOpen={!!selectedCreator}
          onClose={() => {
            setSelectedCreator(null);
            setSelectedApplication(null);
          }}
          creator={selectedCreator}
          coverLetter={selectedApplication.cover_letter}
          onUpdateStatus={handleUpdateStatus(selectedApplication.id)}
        />
      )}
    </>
  );
};

export default CampaignCard;
