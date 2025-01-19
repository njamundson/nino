import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, CheckCircle2, XCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface InvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
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
  onAccept: () => void;
  onDecline: () => void;
}

const InvitationModal = ({ isOpen, onClose, opportunity, onAccept, onDecline }: InvitationModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">Campaign Invitation</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="text-xl font-medium">{opportunity.title}</h3>
            <p className="text-muted-foreground">{opportunity.brand.company_name}</p>
          </div>

          {opportunity.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{opportunity.location}</span>
            </div>
          )}

          {(opportunity.start_date || opportunity.end_date) && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {opportunity.start_date && formatDate(opportunity.start_date)}
                {opportunity.end_date && ` - ${formatDate(opportunity.end_date)}`}
              </span>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium">About the Campaign</h4>
            <p className="text-muted-foreground">{opportunity.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {opportunity.payment_details && (
              <Badge variant="secondary" className="px-3 py-1">
                💰 {opportunity.payment_details}
              </Badge>
            )}
            {opportunity.compensation_details && (
              <Badge variant="secondary" className="px-3 py-1">
                🎁 {opportunity.compensation_details}
              </Badge>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onDecline}
              className="gap-2"
            >
              <XCircle className="w-4 h-4" />
              Decline
            </Button>
            <Button
              onClick={onAccept}
              className="gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="w-4 h-4" />
              Accept Invitation
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InvitationModal;