import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ViewApplicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: {
    opportunity: {
      title: string;
      description: string;
      location: string | null;
      start_date: string | null;
      end_date: string | null;
      payment_details: string | null;
      compensation_details: string | null;
      deliverables: string[] | null;
      requirements: string[] | null;
      perks: string[] | null;
      brand?: {
        company_name: string | null;
        location: string | null;
      } | null;
    };
    cover_letter: string | null;
  };
}

const ViewApplicationModal = ({ isOpen, onClose, application }: ViewApplicationModalProps) => {
  // Add null checks and default values
  const brandName = application.opportunity?.brand?.company_name || "Anonymous Brand";
  const brandLocation = application.opportunity?.brand?.location;
  const title = application.opportunity?.title || "Untitled Opportunity";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Application Details</DialogTitle>
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

          {/* Your Application */}
          {application.cover_letter && (
            <div className="space-y-2">
              <h4 className="text-lg font-medium">Your Application</h4>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-muted-foreground whitespace-pre-line">{application.cover_letter}</p>
              </div>
            </div>
          )}

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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewApplicationModal;