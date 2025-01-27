import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Creator } from "@/types/creator";
import { Opportunity } from "@/integrations/supabase/types/opportunity";
import ApplicationForm from "@/components/projects/modal/ApplicationForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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

  const getInitials = () => {
    const first = creator.first_name?.[0] || '';
    const last = creator.last_name?.[0] || '';
    return (first + last).toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Left Column - Profile Image */}
          <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100 relative">
            {creator.profile_image_url ? (
              <img
                src={creator.profile_image_url}
                alt={`${creator.first_name} ${creator.last_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Avatar className="w-32 h-32">
                  <AvatarFallback>{getInitials()}</AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>

          {/* Right Column - Creator Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold">
                {creator.first_name} {creator.last_name}
              </h2>
              {creator.location && (
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{creator.location}</span>
                </div>
              )}
            </div>

            {creator.bio && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">About</h3>
                <p className="text-gray-600 leading-relaxed">
                  {creator.bio}
                </p>
              </div>
            )}

            {creator.specialties && creator.specialties.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.specialties.map((specialty, index) => (
                    <Badge 
                      key={index}
                      variant="secondary"
                      className="bg-[#FDF6F3] text-[#A55549] border-0"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {coverLetter && (
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Application Message</h3>
                <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-gray-100">
                  <p className="text-gray-600 whitespace-pre-wrap">
                    {coverLetter}
                  </p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4">
              {onUpdateStatus && (
                <Button
                  onClick={onUpdateStatus}
                  disabled={isProcessing}
                  className="w-full bg-[#A55549] hover:bg-[#A55549]/90 text-white"
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
                  className="w-full bg-[#A55549] hover:bg-[#A55549]/90 text-white"
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