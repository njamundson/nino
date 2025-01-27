import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Creator } from "@/types/creator";
import { Opportunity } from "@/integrations/supabase/types/opportunity";
import ApplicationForm from "@/components/projects/modal/ApplicationForm";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: Creator;
  selectedCampaign?: Opportunity;
  onInvite?: () => void;
  coverLetter?: string;
  onUpdateStatus?: () => Promise<boolean>;
  isProcessing?: boolean;
  onMessageCreator?: () => void;
}

const CreatorProfileModal = ({ 
  isOpen, 
  onClose, 
  creator, 
  selectedCampaign,
  onInvite,
  coverLetter,
  onUpdateStatus,
  isProcessing,
  onMessageCreator
}: CreatorProfileModalProps) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const queryClient = useQueryClient();

  const handleApplicationSubmit = () => {
    onClose();
    queryClient.invalidateQueries({ queryKey: ['applications'] });
  };

  if (showApplicationForm && selectedCampaign) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogTitle className="sr-only">Send Invitation</DialogTitle>
          <ApplicationForm
            opportunity={selectedCampaign}
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
        <DialogTitle className="text-2xl font-semibold px-8 pt-6">
          Creator Profile
        </DialogTitle>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Creator Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-medium">
                {creator.first_name} {creator.last_name}
              </h3>
              {creator.creator_type && (
                <Badge variant="secondary" className="capitalize">
                  {creator.creator_type}
                </Badge>
              )}
            </div>

            {creator.location && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>{creator.location}</span>
              </div>
            )}

            {creator.bio && (
              <div className="space-y-2">
                <h4 className="font-medium">About</h4>
                <p className="text-muted-foreground">{creator.bio}</p>
              </div>
            )}

            {coverLetter && (
              <div className="space-y-2">
                <h4 className="font-medium">Application Message</h4>
                <p className="text-muted-foreground whitespace-pre-wrap">{coverLetter}</p>
              </div>
            )}

            {creator.specialties && creator.specialties.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {creator.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Social Links & Actions */}
          <div className="space-y-6">
            {(creator.instagram || creator.website) && (
              <div className="space-y-2">
                <h4 className="font-medium">Social Links</h4>
                <div className="space-y-2">
                  {creator.instagram && (
                    <a
                      href={`https://instagram.com/${creator.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-nino-primary hover:underline block"
                    >
                      @{creator.instagram}
                    </a>
                  )}
                  {creator.website && (
                    <a
                      href={creator.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-nino-primary hover:underline block"
                    >
                      {creator.website}
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {onUpdateStatus && (
                <Button
                  onClick={onUpdateStatus}
                  disabled={isProcessing}
                  className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white"
                >
                  {isProcessing ? "Processing..." : "Accept Application"}
                </Button>
              )}
              
              {onMessageCreator && (
                <Button
                  onClick={onMessageCreator}
                  variant="outline"
                  className="w-full"
                >
                  Message Creator
                </Button>
              )}

              {onInvite && (
                <Button
                  onClick={() => setShowApplicationForm(true)}
                  className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white"
                >
                  Send Invitation
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorProfileModal;