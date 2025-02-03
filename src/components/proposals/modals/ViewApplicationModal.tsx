import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Application } from "@/integrations/supabase/types/application";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ApplicationForm from "@/components/projects/modal/ApplicationForm";
import ProjectDetails from "./components/ProjectDetails";
import ActionButtons from "./components/ActionButtons";

interface ViewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  type: 'proposal' | 'application';
  onUpdateStatus?: (status: 'accepted' | 'rejected') => Promise<void>;
}

const ViewApplicationModal = ({ 
  isOpen, 
  onClose, 
  application, 
  type,
  onUpdateStatus 
}: ViewApplicationModalProps) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDecling, setIsDecling] = useState(false);
  const queryClient = useQueryClient();

  const handleDecline = async () => {
    try {
      setIsDecling(true);
      
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', application.id);

      if (error) throw error;

      // Invalidate both queries to ensure proper UI updates
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['applications'] }),
        queryClient.invalidateQueries({ queryKey: ['my-applications'] })
      ]);

      onClose();
      toast.success("Invitation declined");
    } catch (error) {
      console.error('Error declining invitation:', error);
      toast.error("Failed to decline invitation");
    } finally {
      setIsDecling(false);
    }
  };

  const handleDeleteApplication = async () => {
    try {
      setIsDeleting(true);
      
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', application.id);

      if (error) throw error;

      // Invalidate both queries to ensure proper UI updates
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['applications'] }),
        queryClient.invalidateQueries({ queryKey: ['my-applications'] })
      ]);

      onClose();
      toast.success("Application deleted successfully");
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error("Failed to delete application");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleApplicationSubmit = async () => {
    try {
      onClose();
      
      // Invalidate both queries to trigger UI updates
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['applications'] }),
        queryClient.invalidateQueries({ queryKey: ['my-applications'] }),
        queryClient.invalidateQueries({ queryKey: ['opportunities'] })
      ]);

      toast.success("Application submitted successfully");
    } catch (error) {
      console.error('Error handling application submit:', error);
      toast.error("Failed to update application status");
    }
  };

  if (showApplicationForm && application.opportunity) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogTitle className="sr-only">Submit Application</DialogTitle>
          <ApplicationForm
            opportunity={application.opportunity}
            onBack={() => setShowApplicationForm(false)}
            onClose={handleApplicationSubmit}
            onModalClose={handleApplicationSubmit}
            isInvitation={true}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-semibold">
          {type === 'proposal' ? "You've been invited to apply!" : "Application Details"}
        </DialogTitle>

        <ProjectDetails application={application} />

        {type === 'proposal' && (
          <ActionButtons
            type={type}
            isDeleting={isDeleting}
            isDeclining={isDecling}
            onDecline={handleDecline}
            onDelete={handleDeleteApplication}
            onApply={() => setShowApplicationForm(true)}
            hasCoverLetter={!!application.cover_letter}
            onUpdateStatus={onUpdateStatus}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationModal;