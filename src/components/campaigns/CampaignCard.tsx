import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, MoreVertical, ListChecks } from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
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
      initiated_by?: 'creator' | 'brand';
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

  // Filter applications to only show actual applications (not just invitations)
  const applications = (campaign.applications || []).filter(app => 
    app.initiated_by === 'creator' || // Show all creator-initiated applications
    (app.initiated_by === 'brand' && app.status !== 'pending') // Only show brand invitations if they've been responded to
  );
  
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
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1 min-w-0">
              <h3 className="text-lg sm:text-xl font-semibold text-nino-text truncate pr-2">
                {campaign.title}
              </h3>
              {campaign.location && (
                <p className="text-nino-gray flex items-center gap-1.5 text-sm sm:text-base">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{campaign.location}</span>
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              {applications.length > 0 && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <ListChecks className="h-4 w-4" />
                      <span className="sr-only">View applications</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-64 bg-white">
                    <div className="px-2 py-1.5 text-sm font-semibold">
                      Applications ({applications.length})
                    </div>
                    <DropdownMenuSeparator />
                    {applications.map((application) => (
                      <DropdownMenuItem
                        key={application.id}
                        className="flex items-center gap-2 p-2 cursor-pointer"
                        onClick={() => handleViewCreator(application.creator, application)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">
                            {application.creator.first_name} {application.creator.last_name}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                          </p>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              {!isCompleted && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
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
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-nino-gray text-sm sm:text-base line-clamp-3">
                {campaign.description}
              </p>
            </div>

            {(campaign.start_date || campaign.end_date) && (
              <div className="flex items-center gap-2 text-nino-gray text-sm sm:text-base">
                <Calendar className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">
                  {campaign.start_date && formatDate(campaign.start_date)}
                  {campaign.end_date && ` - ${formatDate(campaign.end_date)}`}
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {campaign.payment_details && (
                <Badge 
                  variant="secondary" 
                  className="bg-nino-bg text-nino-text px-2 py-0.5 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-[200px]"
                >
                  <span className="inline-block truncate">
                    💰 {campaign.payment_details}
                  </span>
                </Badge>
              )}
              {campaign.compensation_details && (
                <Badge 
                  variant="secondary" 
                  className="bg-nino-bg text-nino-text px-2 py-0.5 text-sm whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] sm:max-w-[200px]"
                >
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
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {application.creator.first_name} {application.creator.last_name}
                          </p>
                          {application.creator.location && (
                            <p className="text-sm text-gray-500 truncate">
                              {application.creator.location}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-nino-primary hover:text-nino-primary/90 whitespace-nowrap"
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
        <DialogContent className="max-w-4xl p-0 w-[95vw] sm:w-auto">
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
