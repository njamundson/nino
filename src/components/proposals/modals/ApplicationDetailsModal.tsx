import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ApplicationDetailsModalProps {
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
      brand: {
        company_name: string;
      };
    };
    cover_letter: string | null;
    status: string;
  };
}

const ApplicationDetailsModal = ({ isOpen, onClose, application }: ApplicationDetailsModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Application Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-xl font-medium">{application.opportunity.title}</h3>
            <p className="text-muted-foreground">{application.opportunity.brand.company_name}</p>
          </div>

          {application.opportunity.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{application.opportunity.location}</span>
            </div>
          )}

          {(application.opportunity.start_date || application.opportunity.end_date) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {application.opportunity.start_date && formatDate(application.opportunity.start_date)}
                {application.opportunity.end_date && ` - ${formatDate(application.opportunity.end_date)}`}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">Campaign Details</h4>
            <p className="text-muted-foreground">{application.opportunity.description}</p>
          </div>

          {application.cover_letter && (
            <div className="space-y-2">
              <h4 className="font-medium">Your Cover Letter</h4>
              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="text-muted-foreground whitespace-pre-line">{application.cover_letter}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            {application.opportunity.payment_details && (
              <Badge variant="secondary" className="px-3 py-1">
                💰 {application.opportunity.payment_details}
              </Badge>
            )}
            {application.opportunity.compensation_details && (
              <Badge variant="secondary" className="px-3 py-1">
                🎁 {application.opportunity.compensation_details}
              </Badge>
            )}
          </div>

          <div className="mt-4">
            <Badge 
              variant={application.status === 'pending' ? 'secondary' : 
                      application.status === 'accepted' ? 'success' : 'destructive'}
              className="px-3 py-1"
            >
              {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationDetailsModal;