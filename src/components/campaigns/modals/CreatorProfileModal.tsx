import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, Globe, Instagram, MessageSquare, X, XSquare } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: any;
  coverLetter: string;
  onUpdateStatus: (status: 'accepted' | 'rejected') => void;
  onMessageCreator: (userId: string) => void;
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

  const fullName = `${creator?.profile?.first_name || ''} ${creator?.profile?.last_name || ''}`.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl p-0 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <DialogHeader className="p-6 relative bg-gradient-to-b from-gray-50 to-white border-b">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-4 top-4 hover:bg-gray-100 rounded-full"
            onClick={onClose}
          >
            <X className="h-4 w-4 text-gray-500" />
          </Button>
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="w-24 h-24 ring-4 ring-white shadow-lg">
              <AvatarImage src={creator?.profile_image_url} alt={fullName} />
              <AvatarFallback className="text-xl bg-nino-primary text-white">
                {creator?.profile?.first_name?.[0]}{creator?.profile?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                {fullName}
              </h2>
              {creator?.location && (
                <p className="text-gray-600 flex items-center justify-center gap-1">
                  <span>📍</span> {creator.location}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="p-6 space-y-6">
          {/* Bio Section */}
          {creator?.bio && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900">About</h3>
              <p className="text-gray-600 leading-relaxed">{creator.bio}</p>
            </div>
          )}

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
          </div>

          {/* Specialties */}
          {creator?.specialties && creator.specialties.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {creator.specialties.map((specialty: string, index: number) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="px-3 py-1 rounded-full border-2 border-nino-primary/20 bg-nino-primary/5 text-nino-primary hover:bg-nino-primary/10"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Application Message */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">Application Message</h3>
            <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border text-gray-600 leading-relaxed">
              {coverLetter}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button
              className="w-full gap-2 bg-nino-primary hover:bg-nino-primary/90"
              onClick={() => onMessageCreator(creator.user_id)}
            >
              <MessageSquare className="w-4 h-4" />
              Begin Chat
            </Button>
            
            <div className="grid grid-cols-2 gap-3">
              <Button
                onClick={handleAccept}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
              >
                <CheckSquare className="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                className="w-full border-red-500 text-red-500 hover:bg-red-50"
              >
                <XSquare className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorProfileModal;