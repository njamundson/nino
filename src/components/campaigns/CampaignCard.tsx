import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatorProfileModal from "./modals/CreatorProfileModal";
import CampaignDetails from "./card/CampaignDetails";
import ApplicationsList from "./card/ApplicationsList";
import { useApplicationActions } from "@/hooks/useApplicationActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CampaignCardProps {
  campaign: any;
  onEdit: (campaign: any) => void;
  onDelete: (id: string) => void;
  applications?: any[];
  onUpdateApplicationStatus?: (applicationId: string, newStatus: 'accepted' | 'rejected') => void;
}

const CampaignCard = ({ 
  campaign, 
  onEdit, 
  onDelete, 
  applications = [], 
  onUpdateApplicationStatus 
}: CampaignCardProps) => {
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [localApplications, setLocalApplications] = useState(applications);
  const navigate = useNavigate();
  
  const { 
    isProcessing,
    handleAcceptApplication,
    handleRejectApplication
  } = useApplicationActions({ opportunityId: campaign.id });

  const handleMessageCreator = (userId: string) => {
    navigate(`/brand/messages?userId=${userId}`);
  };

  const handleViewProfile = (application: any) => {
    setSelectedCreator(application.creator);
    setSelectedApplication(application);
  };

  const handleUpdateStatus = (applicationId: string) => async (newStatus: 'accepted' | 'rejected') => {
    if (onUpdateApplicationStatus) {
      try {
        if (newStatus === 'accepted') {
          await handleAcceptApplication(applicationId, selectedCreator.user_id);
        } else {
          await handleRejectApplication(applicationId);
          setLocalApplications(prevApps => 
            prevApps.filter(app => app.id !== applicationId)
          );
        }
        
        // Close the modal
        setSelectedCreator(null);
        setSelectedApplication(null);
      } catch (error) {
        console.error('Error updating application status:', error);
      }
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

              <CampaignDetails campaign={campaign} />
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your campaign
                      and remove all associated applications.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(campaign.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <ApplicationsList
            applications={localApplications}
            onViewProfile={handleViewProfile}
            onMessageCreator={handleMessageCreator}
          />
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
          onMessageCreator={() => handleMessageCreator(selectedCreator.user_id)}
          opportunityId={campaign.id}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
};

export default CampaignCard;