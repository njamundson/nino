import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckSquare, XSquare, MessageSquare, Instagram, Globe } from "lucide-react";
import { toast } from "sonner";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: any;
  coverLetter: string;
  onUpdateStatus: (status: 'accepted' | 'rejected') => void;
  onMessageCreator: () => void;
}

const CreatorProfileModal = ({ 
  isOpen, 
  onClose, 
  creator, 
  coverLetter,
  onUpdateStatus,
  onMessageCreator
}: CreatorProfileModalProps) => {
  const handleAccept = () => {
    onUpdateStatus('accepted');
    toast.success("Application accepted successfully");
    onClose();
  };

  const handleReject = () => {
    onUpdateStatus('rejected');
    toast.error("Application rejected");
    onClose();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 rounded-3xl overflow-hidden bg-gradient-to-b from-nino-bg to-white">
        <div className="relative">
          <div className="p-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-semibold text-center mb-6">
                Creator Profile
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-8">
              {/* Profile Section */}
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                  <AvatarImage 
                    src={creator?.profile_image_url} 
                    alt={`${creator?.profile?.first_name} ${creator?.profile?.last_name}`}
                  />
                  <AvatarFallback className="bg-nino-bg text-nino-text text-xl">
                    {getInitials(
                      creator?.profile?.first_name || '',
                      creator?.profile?.last_name || ''
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-nino-text">
                    {creator?.profile?.first_name} {creator?.profile?.last_name}
                  </h3>
                  {creator?.location && (
                    <p className="text-nino-gray text-sm mt-1">📍 {creator.location}</p>
                  )}
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4">
                {creator?.instagram && (
                  <a
                    href={`https://instagram.com/${creator.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-nino-primary/90 to-nino-primary text-white hover:opacity-90 transition-opacity"
                  >
                    <Instagram className="w-4 h-4 mr-2" />
                    Instagram
                  </a>
                )}
                {creator?.website && (
                  <a
                    href={creator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 rounded-full bg-nino-text text-white hover:bg-nino-text/90 transition-colors"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Website
                  </a>
                )}
              </div>

              {/* Proposal Section */}
              <div className="space-y-4 bg-nino-bg/50 p-6 rounded-2xl">
                <h4 className="font-medium text-nino-text">Application Message</h4>
                <p className="text-nino-gray leading-relaxed">{coverLetter}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4">
                <Button
                  onClick={onMessageCreator}
                  className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Begin Chat
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleAccept}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Accept
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="border-red-500 text-red-500 hover:bg-red-50"
                  >
                    <XSquare className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorProfileModal;