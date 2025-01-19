import {
  Dialog,
  DialogContent,
  DialogHeader,
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
      <DialogContent className="max-w-2xl p-0 overflow-hidden bg-nino-bg rounded-3xl">
        <div className="relative">
          <div className="p-8">
            <DialogHeader>
              <div className="flex flex-col items-center space-y-6">
                <Avatar className="w-28 h-28 border-4 border-white shadow-lg">
                  <AvatarImage 
                    src={creator?.profile_image_url} 
                    alt={`${creator?.profile?.first_name} ${creator?.profile?.last_name}`}
                  />
                  <AvatarFallback className="bg-nino-primary/10 text-nino-primary text-2xl font-medium">
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
                    <p className="text-nino-gray text-sm">📍 {creator.location}</p>
                  )}
                </div>
              </div>
            </DialogHeader>

            <div className="mt-8 space-y-6">
              {/* Social Links */}
              <div className="flex justify-center gap-4">
                {creator?.instagram && (
                  <a
                    href={`https://instagram.com/${creator.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 rounded-2xl bg-gradient-to-r from-nino-primary/90 to-nino-primary text-white hover:opacity-90 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Instagram className="w-5 h-5 mr-2" />
                    Instagram
                  </a>
                )}
                {creator?.website && (
                  <a
                    href={creator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-5 py-2.5 rounded-2xl bg-nino-text text-white hover:bg-nino-text/90 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Website
                  </a>
                )}
              </div>

              {/* Application Message */}
              <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-nino-primary/10">
                <h3 className="font-medium text-nino-text mb-3">Application Message</h3>
                <p className="text-nino-gray leading-relaxed">{coverLetter}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <Button
                  onClick={onMessageCreator}
                  className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white py-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <MessageSquare className="w-5 h-5 mr-2" />
                  Begin Chat
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={handleAccept}
                    className="bg-green-500 hover:bg-green-600 text-white py-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <CheckSquare className="w-5 h-5 mr-2" />
                    Accept
                  </Button>
                  <Button
                    onClick={handleReject}
                    variant="outline"
                    className="border-2 border-red-500 text-red-500 hover:bg-red-50 py-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <XSquare className="w-5 h-5 mr-2" />
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