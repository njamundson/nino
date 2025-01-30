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
import { useState } from "react";
import ApplicationsHeader from "./card/applications/ApplicationsHeader";
import CreatorProfile from "@/components/creators/modal/CreatorProfile";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useApplicationActions } from "@/hooks/useApplicationActions";
import AcceptDialog from "./modals/profile/AcceptDialog";

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
    applications?: Array<{
      id: string;
      status: string;
      cover_letter: string | null;
      creator: {
        id: string;
        bio: string | null;
        location: string | null;
        specialties: string[] | null;
        instagram: string | null;
        website: string | null;
        creator_type: string;
        profile_image_url: string | null;
        first_name: string | null;
        last_name: string | null;
      };
    }>;
  };
  onEdit: (campaign: any) => void;
  onDelete: (id: string) => void;
}

const CampaignCard = ({ campaign, onEdit, onDelete }: CampaignCardProps) => {
  const [isApplicationsExpanded, setIsApplicationsExpanded] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  
  const { handleAcceptApplication, handleRejectApplication, isProcessing } = useApplicationActions({
    opportunityId: campaign.id,
  });

  const handleDelete = async () => {
    try {
      await onDelete(campaign.id);
      toast.success("Campaign deleted successfully");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
    }
  };

  const handleViewCreator = (creator: any, application: any) => {
    setSelectedCreator(creator);
    setSelectedApplication(application);
  };

  const handleCloseCreatorModal = () => {
    setSelectedCreator(null);
    setSelectedApplication(null);
  };

  const handleAccept = async () => {
    if (!selectedApplication?.id) return;
    
    const success = await handleAcceptApplication(selectedApplication.id);
    if (success) {
      toast.success("Application accepted successfully");
      handleCloseCreatorModal();
    }
    setShowAcceptDialog(false);
  };

  const handleReject = async () => {
    if (!selectedApplication?.id) return;
    
    const success = await handleRejectApplication(selectedApplication.id);
    if (success) {
      toast.success("Application rejected successfully");
      handleCloseCreatorModal();
    }
  };

  const applications = campaign.applications || [];
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');
  const isInactive = campaign.status === 'inactive';
  const isCompleted = campaign.status === 'completed';

  const getStatusBadgeProps = () => {
    if (isCompleted) {
      return {
        variant: "secondary" as const,
        className: "bg-gray-100 text-gray-700",
        children: "Completed"
      };
    }
    if (isInactive) {
      return {
        variant: "destructive" as const,
        className: "bg-red-100 text-red-700",
        children: "Inactive"
      };
    }
    if (acceptedApplications.length > 0) {
      return {
        variant: "default" as const,
        className: "bg-nino-primary text-white",
        children: "Creator Hired"
      };
    }
    return {
      variant: "secondary" as const,
      className: "bg-nino-bg text-nino-text",
      children: "Open"
    };
  };

  return (
    <>
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

            {!isCompleted && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white">
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
            )}
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
                <Badge variant="secondary" className="bg-nino-bg text-nino-text px-2 py-0.5 max-w-[200px]">
                  <span className="inline-block truncate">
                    💰 {campaign.payment_details}
                  </span>
                </Badge>
              )}
              {campaign.compensation_details && (
                <Badge variant="secondary" className="bg-nino-bg text-nino-text px-2 py-0.5 max-w-[200px]">
                  <span className="inline-block truncate">
                    🎁 {campaign.compensation_details}
                  </span>
                </Badge>
              )}
              <Badge
                variant={getStatusBadgeProps().variant}
                className={getStatusBadgeProps().className}
              >
                {getStatusBadgeProps().children}
              </Badge>
            </div>
          </div>

          {!isCompleted && !isInactive && applications.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <ApplicationsHeader
                count={applications.length}
                isExpanded={isApplicationsExpanded}
                onToggle={() => setIsApplicationsExpanded(!isApplicationsExpanded)}
              />
              
              {isApplicationsExpanded && (
                <div className="mt-4 space-y-3">
                  {applications.map((application) => (
                    <div
                      key={application.id}
                      className="p-3 bg-gray-50/80 rounded-xl cursor-pointer hover:bg-gray-100/80 transition-colors"
                      onClick={() => handleViewCreator(application.creator, application)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">
                            {application.creator.first_name} {application.creator.last_name}
                          </p>
                          {application.creator.location && (
                            <p className="text-sm text-gray-500">
                              {application.creator.location}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-nino-primary hover:text-nino-primary/90"
                        >
                          View Profile
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

      <Dialog open={!!selectedCreator} onOpenChange={handleCloseCreatorModal}>
        <DialogContent className="max-w-4xl p-0">
          <DialogTitle className="sr-only">Creator Profile</DialogTitle>
          <CreatorProfile
            creator={selectedCreator}
            onClose={handleCloseCreatorModal}
            onInviteClick={() => {}}
            onMessageClick={() => {}}
            application={selectedApplication}
          />
        </DialogContent>
      </Dialog>

      <AcceptDialog
        isOpen={showAcceptDialog}
        onOpenChange={setShowAcceptDialog}
        onConfirm={handleAccept}
        creatorName={`${selectedCreator?.first_name || ''} ${selectedCreator?.last_name || ''}`}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default CampaignCard;