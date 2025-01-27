import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import ApplicationItem from "./ApplicationItem";
import CreatorProfileModal from "../modals/CreatorProfileModal";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface ApplicationsListProps {
  applications: any[];
  onViewProfile: (application: any) => void;
  onMessageCreator: (userId: string) => void;
}

const ApplicationsList = ({ applications = [], onViewProfile, onMessageCreator }: ApplicationsListProps) => {
  const [showApplications, setShowApplications] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const queryClient = useQueryClient();

  if (!Array.isArray(applications)) {
    console.error('Invalid applications data:', applications);
    toast.error("Error loading applications");
    return null;
  }

  // Filter out rejected and invalid applications
  const activeApplications = applications.filter(app => {
    if (!app || typeof app !== 'object') {
      console.error('Invalid application object:', app);
      return false;
    }
    // Only show pending and accepted applications
    return ['pending', 'accepted'].includes(app.status);
  });

  if (!activeApplications.length) return null;

  const handleViewProfile = (application: any) => {
    if (!application || !application.creator) {
      console.error('Invalid application data for profile view:', application);
      toast.error("Error loading creator profile");
      return;
    }
    setSelectedApplication(application);
  };

  const handleCloseModal = () => {
    setSelectedApplication(null);
  };

  const handleUpdateStatus = async (status: 'accepted' | 'rejected') => {
    if (!selectedApplication) return;
    
    setIsProcessing(true);
    try {
      if (status === 'rejected') {
        // Delete the application instead of updating status
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', selectedApplication.id);

        if (error) throw error;
        
        toast.success("Application rejected and removed");
      } else {
        // For acceptance, update the status
        const { error } = await supabase
          .from('applications')
          .update({ status })
          .eq('id', selectedApplication.id);

        if (error) throw error;
        
        toast.success("Application accepted");
      }

      // Invalidate and refetch the applications query
      queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
      setSelectedApplication(null);
    } catch (error) {
      console.error('Error updating application:', error);
      toast.error("Failed to update application");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="mt-6 pt-6 border-t border-gray-100">
      <Button
        variant="ghost"
        className="w-full justify-between"
        onClick={() => setShowApplications(!showApplications)}
      >
        <span className="font-medium">
          Applications ({activeApplications.length})
        </span>
        {showApplications ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </Button>

      {showApplications && (
        <div className="mt-4 space-y-4">
          {activeApplications.map((application) => (
            <ApplicationItem
              key={application.id}
              application={application}
              onViewProfile={() => handleViewProfile(application)}
              onMessageCreator={() => {
                if (application.creator?.user_id) {
                  onMessageCreator(application.creator.user_id);
                } else {
                  console.error('No creator user_id found:', application);
                  toast.error("Unable to message creator");
                }
              }}
            />
          ))}
        </div>
      )}

      {selectedApplication && (
        <CreatorProfileModal
          isOpen={!!selectedApplication}
          onClose={handleCloseModal}
          creator={selectedApplication.creator}
          coverLetter={selectedApplication.cover_letter}
          onUpdateStatus={handleUpdateStatus}
          isProcessing={isProcessing}
          onMessageCreator={() => {
            if (selectedApplication.creator?.user_id) {
              onMessageCreator(selectedApplication.creator.user_id);
            }
          }}
        />
      )}
    </div>
  );
};

export default ApplicationsList;