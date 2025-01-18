import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, XSquare, MessageSquare, Instagram, Globe } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl p-0">
        <div className="relative">
          {/* Header Background */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-nino-primary/20 to-transparent rounded-t-3xl" />
          
          <DialogHeader className="p-6 relative z-10">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20 rounded-2xl border-4 border-white shadow-lg">
                {creator?.profile_image_url ? (
                  <AvatarImage
                    src={creator.profile_image_url}
                    alt={`${creator?.profile?.first_name} ${creator?.profile?.last_name}`}
                    className="object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-nino-primary/10 text-nino-primary text-xl">
                    {getInitials(
                      creator?.profile?.first_name || '',
                      creator?.profile?.last_name || ''
                    )}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {creator?.profile?.first_name} {creator?.profile?.last_name}
                </h2>
                {creator?.location && (
                  <p className="text-gray-600 flex items-center gap-2 mt-1">
                    <span className="text-lg">📍</span> {creator.location}
                  </p>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="p-6 space-y-6">
            {/* Social Links */}
            <div className="flex gap-3">
              {creator?.instagram && (
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => window.open(`https://instagram.com/${creator.instagram}`, '_blank')}
                >
                  <Instagram className="w-4 h-4" />
                  Instagram
                </Button>
              )}
              {creator?.website && (
                <Button
                  variant="outline"
                  className="flex-1 gap-2"
                  onClick={() => window.open(creator.website, '_blank')}
                >
                  <Globe className="w-4 h-4" />
                  Website
                </Button>
              )}
              <Button
                className="flex-1 gap-2 bg-nino-primary hover:bg-nino-primary/90"
                onClick={onMessageCreator}
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </Button>
            </div>

            {/* Bio Section */}
            {creator?.bio && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-900">About</h3>
                <p className="text-gray-600 leading-relaxed">{creator.bio}</p>
              </div>
            )}

            {/* Specialties Section */}
            {creator?.specialties && creator.specialties.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">Specialties</h3>
                <div className="flex flex-wrap gap-2">
                  {creator.specialties.map((specialty: string, index: number) => (
                    <Badge 
                      key={index}
                      variant="outline"
                      className="px-3 py-1 rounded-full border-2 border-nino-primary/20 text-nino-primary bg-nino-primary/5"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Proposal Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Proposal</h3>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <p className="text-gray-600 leading-relaxed">{coverLetter}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleAccept}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Accept Proposal
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                className="flex-1 border-red-500 text-red-500 hover:bg-red-50"
              >
                <XSquare className="w-4 h-4 mr-2" />
                Reject Proposal
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorProfileModal;