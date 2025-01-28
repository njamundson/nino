import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, CheckCircle2, X, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Application } from "@/integrations/supabase/types/opportunity";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ApplicationForm from "@/components/projects/modal/ApplicationForm";
import { useQueryClient } from "@tanstack/react-query";
import { DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ViewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  type: 'proposal' | 'application';
  onUpdateStatus?: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ViewApplicationModal = ({ isOpen, onClose, application, type, onUpdateStatus }: ViewApplicationModalProps) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [isDecling, setIsDecling] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  
  const brandName = application.opportunity?.brand?.company_name || "Anonymous Brand";
  const brandLocation = application.opportunity?.brand?.location;
  const title = application.opportunity?.title || "Untitled Opportunity";

  const handleApplicationSubmit = () => {
    onClose();
    queryClient.invalidateQueries({ queryKey: ['applications'] });
  };

  const handleDecline = async () => {
    try {
      setIsDecling(true);
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', application.id);

      if (error) throw error;

      toast.success("Invitation declined");
      queryClient.invalidateQueries({ queryKey: ['applications'] });
      onClose(); // Close the modal immediately after successful decline
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

      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      
      toast.success("Application deleted successfully");
      onClose();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error("Failed to delete application");
    } finally {
      setIsDeleting(false);
    }
  };

  if (showApplicationForm && application.opportunity) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Submit Application</DialogTitle>
          <ApplicationForm
            opportunity={application.opportunity}
            onBack={() => setShowApplicationForm(false)}
            onClose={handleApplicationSubmit}
            onModalClose={handleApplicationSubmit}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogTitle className="text-2xl font-semibold">
          {type === 'proposal' ? "You've been invited to apply!" : "Application Details"}
        </DialogTitle>

        <div className="space-y-6 py-4">
          {/* Project Overview */}
          <div className="space-y-2">
            <h3 className="text-xl font-medium">{title}</h3>
            <p className="text-muted-foreground">{brandName}</p>
          </div>

          {/* Location and Dates */}
          <div className="flex flex-col gap-2">
            {brandLocation && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{brandLocation}</span>
              </div>
            )}
            {(application.opportunity?.start_date || application.opportunity?.end_date) && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>
                  {application.opportunity.start_date && formatDate(application.opportunity.start_date)}
                  {application.opportunity.end_date && ` - ${formatDate(application.opportunity.end_date)}`}
                </span>
              </div>
            )}
          </div>

          {/* Project Details */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium">Project Details</h4>
            {application.opportunity?.description && (
              <p className="text-muted-foreground">{application.opportunity.description}</p>
            )}

            {/* Requirements */}
            {application.opportunity?.requirements && application.opportunity.requirements.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium">Requirements</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {application.opportunity.requirements.map((req, index) => (
                    <li key={index} className="text-muted-foreground">{req}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Deliverables */}
            {application.opportunity?.deliverables && application.opportunity.deliverables.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium">Deliverables</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {application.opportunity.deliverables.map((del, index) => (
                    <li key={index} className="text-muted-foreground">{del}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Perks */}
            {application.opportunity?.perks && application.opportunity.perks.length > 0 && (
              <div className="space-y-2">
                <h5 className="font-medium">Perks</h5>
                <ul className="list-disc pl-5 space-y-1">
                  {application.opportunity.perks.map((perk, index) => (
                    <li key={index} className="text-muted-foreground">{perk}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Compensation Details */}
          <div className="flex flex-wrap gap-2">
            {application.opportunity?.payment_details && (
              <Badge variant="secondary" className="px-3 py-1">
                💰 {application.opportunity.payment_details}
              </Badge>
            )}
            {application.opportunity?.compensation_details && (
              <Badge variant="secondary" className="px-3 py-1">
                🎁 {application.opportunity.compensation_details}
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          {type === 'proposal' ? (
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                variant="outline" 
                onClick={handleDecline}
                disabled={isDecling}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                {isDecling ? 'Declining...' : 'Not Interested'}
              </Button>
              <Button 
                onClick={() => setShowApplicationForm(true)}
                className="bg-[#A55549] hover:bg-[#A55549]/90 text-white gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Apply Now
              </Button>
            </div>
          ) : (
            type === 'application' && application.cover_letter && (
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="destructive"
                  onClick={handleDeleteApplication}
                  disabled={isDeleting}
                  className="gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting ? 'Deleting...' : 'Delete Application'}
                </Button>
              </div>
            )
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationModal;