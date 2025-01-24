import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Application } from "@/integrations/supabase/types/opportunity";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import ApplicationForm from "@/components/projects/modal/ApplicationForm";

interface ViewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: Application;
  type: 'proposal' | 'application';
  onUpdateStatus?: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ViewApplicationModal = ({ isOpen, onClose, application, type, onUpdateStatus }: ViewApplicationModalProps) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  // Add null checks and default values
  const brandName = application.opportunity?.brand?.company_name || "Anonymous Brand";
  const brandLocation = application.opportunity?.brand?.location;
  const title = application.opportunity?.title || "Untitled Opportunity";

  if (showApplicationForm && application.opportunity) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <ApplicationForm
            opportunity={application.opportunity}
            onBack={() => setShowApplicationForm(false)}
            onClose={onClose}
            onModalClose={onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            {type === 'proposal' ? "You've been invited to apply!" : "Application Details"}
          </DialogTitle>
        </DialogHeader>

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

          {/* Apply Now Button for Proposals */}
          {type === 'proposal' && (
            <div className="flex justify-end pt-4">
              <Button 
                onClick={() => setShowApplicationForm(true)}
                className="bg-[#A55549] hover:bg-[#A55549]/90 text-white"
              >
                Apply Now
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationModal;