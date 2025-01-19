import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, XSquare, Instagram, Link, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: any;
  coverLetter: string;
  onUpdateStatus: (status: 'accepted' | 'rejected') => void;
}

const CreatorProfileModal = ({ 
  isOpen, 
  onClose, 
  creator, 
  coverLetter,
  onUpdateStatus 
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

  const creatorName = creator?.profile?.first_name && creator?.profile?.last_name
    ? `${creator.profile.first_name} ${creator.profile.last_name}`
    : 'Anonymous Creator';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-nino-bg/95 backdrop-blur-sm border-0 shadow-xl">
        <DialogHeader className="text-center pb-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 ring-4 ring-white shadow-lg">
              {creator?.profile_image_url ? (
                <AvatarImage
                  src={creator.profile_image_url}
                  alt={creatorName}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-nino-primary/10 text-nino-primary text-3xl font-medium">
                  {getInitials(
                    creator?.profile?.first_name || '',
                    creator?.profile?.last_name || ''
                  )}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-nino-text tracking-tight">
                {creatorName}
              </h2>
              {creator?.location && (
                <p className="text-nino-gray flex items-center justify-center gap-2">
                  <span>📍</span> {creator.location}
                </p>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-8 px-2">
          {/* Social Links */}
          <div className="flex justify-center gap-4">
            {creator?.instagram && (
              <a
                href={`https://instagram.com/${creator.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-nino-text hover:bg-nino-primary/10 transition-colors"
              >
                <Instagram className="w-5 h-5" />
                <span>Instagram</span>
              </a>
            )}
            {creator?.website && (
              <a
                href={creator.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white text-nino-text hover:bg-nino-primary/10 transition-colors"
              >
                <Link className="w-5 h-5" />
                <span>Website</span>
              </a>
            )}
          </div>

          {/* Bio Section */}
          {creator?.bio && (
            <div className="space-y-3 bg-white/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-nino-text">About</h3>
              <p className="text-nino-gray leading-relaxed">{creator.bio}</p>
            </div>
          )}

          {/* Specialties Section */}
          {creator?.specialties && creator.specialties.length > 0 && (
            <div className="space-y-3 bg-white/50 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-nino-text">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {creator.specialties.map((specialty: string, index: number) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="px-3 py-1 rounded-full bg-white/80"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Application Message */}
          <div className="space-y-3 bg-white/50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-nino-text">Application Message</h3>
            <p className="text-nino-gray leading-relaxed bg-white/80 p-4 rounded-xl">
              {coverLetter}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button
              onClick={handleAccept}
              className="bg-green-500 hover:bg-green-600 text-white col-span-1"
            >
              <CheckSquare className="w-5 h-5 mr-2" />
              Accept Application
            </Button>
            <Button
              onClick={handleReject}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50 col-span-1"
            >
              <XSquare className="w-5 h-5 mr-2" />
              Reject Application
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorProfileModal;