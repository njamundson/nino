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
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
        profile?: {
          first_name: string | null;
          last_name: string | null;
        } | null;
      };
    }>;
  };
  onEdit: (campaign: any) => void;
  onDelete: (id: string) => void;
}

const CampaignCard = ({ campaign, onEdit, onDelete }: CampaignCardProps) => {
  const [isApplicationsExpanded, setIsApplicationsExpanded] = useState(false);
  const [selectedCreator, setSelectedCreator] = useState<any>(null);

  const handleDelete = async () => {
    try {
      await onDelete(campaign.id);
      toast.success("Campaign deleted successfully");
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
    }
  };

  const handleViewCreator = (creator: any) => {
    setSelectedCreator(creator);
  };

  const handleCloseCreatorModal = () => {
    setSelectedCreator(null);
  };

  const applications = campaign.applications || [];
  const pendingApplications = applications.filter(app => app.status === 'pending');
  const acceptedApplications = applications.filter(app => app.status === 'accepted');

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
                variant={acceptedApplications.length > 0 ? "default" : "secondary"}
                className={`px-2 py-0.5 ${
                  acceptedApplications.length > 0
                    ? "bg-nino-primary text-white" 
                    : "bg-nino-bg text-nino-text"
                }`}
              >
                {acceptedApplications.length} {acceptedApplications.length === 1 ? "Booking" : "Bookings"}
              </Badge>
            </div>
          </div>

          {pendingApplications.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <ApplicationsHeader
                count={pendingApplications.length}
                isExpanded={isApplicationsExpanded}
                onToggle={() => setIsApplicationsExpanded(!isApplicationsExpanded)}
              />
              
              {isApplicationsExpanded && (
                <div className="mt-4 space-y-3">
                  {pendingApplications.map((application) => (
                    <div
                      key={application.id}
                      className="p-3 bg-gray-50/80 rounded-xl cursor-pointer hover:bg-gray-100/80 transition-colors"
                      onClick={() => handleViewCreator(application.creator)}
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
          <CreatorProfile
            creator={selectedCreator}
            onInviteClick={() => {}}
            onMessageClick={() => {}}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CampaignCard;