import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Instagram, Globe, CheckCircle2, XCircle } from "lucide-react";
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
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-nino-bg">
        <div className="relative">
          <div className="p-8">
            <DialogHeader>
              <div className="flex flex-col items-center space-y-6">
                <Avatar className="w-40 h-40 border-4 border-nino-white shadow-lg">
                  <AvatarImage 
                    src={creator?.profile_image_url} 
                    alt={`${creator?.profile?.first_name} ${creator?.profile?.last_name}`}
                  />
                  <AvatarFallback className="bg-nino-primary/10 text-nino-primary text-3xl font-medium">
                    {getInitials(
                      creator?.profile?.first_name || '',
                      creator?.profile?.last_name || ''
                    )}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-semibold text-nino-text">
                    {creator?.profile?.first_name} {creator?.profile?.last_name}
                  </h2>
                  {creator?.location && (
                    <p className="text-nino-gray">📍 {creator.location}</p>
                  )}
                </div>
              </div>
            </DialogHeader>

            <div className="mt-8 space-y-6">
              {/* Social Links */}
              <div className="flex justify-center gap-4">
                <Button
                  onClick={onMessageCreator}
                  variant="outline"
                  className="bg-nino-white hover:bg-nino-primary/5 border-nino-primary/20 text-nino-primary hover:text-nino-primary space-x-2"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </Button>
                {creator?.instagram && (
                  <Button
                    variant="outline"
                    className="bg-nino-white hover:bg-nino-primary/5 border-nino-primary/20 text-nino-primary hover:text-nino-primary space-x-2"
                    onClick={() => window.open(`https://instagram.com/${creator.instagram}`, '_blank')}
                  >
                    <Instagram className="w-4 h-4" />
                    <span>Instagram</span>
                  </Button>
                )}
                {creator?.website && (
                  <Button
                    variant="outline"
                    className="bg-nino-white hover:bg-nino-primary/5 border-nino-primary/20 text-nino-primary hover:text-nino-primary space-x-2"
                    onClick={() => window.open(creator.website, '_blank')}
                  >
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </Button>
                )}
              </div>

              {/* Application Message */}
              <div className="bg-nino-white rounded-xl p-6 shadow-sm border border-nino-primary/10">
                <h3 className="font-medium text-nino-text mb-3">Application Message</h3>
                <p className="text-nino-gray leading-relaxed">{coverLetter}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <Button
                  onClick={handleAccept}
                  className="bg-nino-primary hover:bg-nino-primary/90 text-white py-6 rounded-xl"
                >
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Accept
                </Button>
                <Button
                  onClick={handleReject}
                  variant="outline"
                  className="border-2 border-red-500 text-red-500 hover:bg-red-50 py-6 rounded-xl"
                >
                  <XCircle className="w-5 h-5 mr-2" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorProfileModal;