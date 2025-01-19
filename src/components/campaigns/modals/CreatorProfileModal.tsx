import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, XSquare, Instagram, Link } from "lucide-react";
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
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-[#F1F0FB] border-0 shadow-xl rounded-3xl">
        <DialogHeader className="text-center pb-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32 ring-4 ring-[#9b87f5] shadow-lg">
              {creator?.profile_image_url ? (
                <AvatarImage
                  src={creator.profile_image_url}
                  alt={creatorName}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-[#E5DEFF] text-[#6E59A5] text-3xl font-medium">
                  {getInitials(
                    creator?.profile?.first_name || '',
                    creator?.profile?.last_name || ''
                  )}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="space-y-2">
              <h2 className="text-3xl font-semibold text-[#1A1F2C] tracking-tight">
                {creatorName}
              </h2>
              {creator?.location && (
                <p className="text-[#8E9196] flex items-center justify-center gap-2">
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
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
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#9b87f5] text-white hover:bg-[#7E69AB] transition-colors"
              >
                <Link className="w-5 h-5" />
                <span>Website</span>
              </a>
            )}
          </div>

          {/* Bio Section */}
          {creator?.bio && (
            <div className="space-y-3 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1A1F2C]">About</h3>
              <p className="text-[#8E9196] leading-relaxed">{creator.bio}</p>
            </div>
          )}

          {/* Specialties Section */}
          {creator?.specialties && creator.specialties.length > 0 && (
            <div className="space-y-3 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-[#1A1F2C]">Specialties</h3>
              <div className="flex flex-wrap gap-2">
                {creator.specialties.map((specialty: string, index: number) => (
                  <Badge 
                    key={index}
                    variant="outline"
                    className="px-3 py-1 rounded-full bg-[#E5DEFF] text-[#6E59A5] border-[#9b87f5] hover:bg-[#D6BCFA]"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Application Message */}
          <div className="space-y-3 bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-[#1A1F2C]">Application Message</h3>
            <p className="text-[#8E9196] leading-relaxed bg-[#F1F0FB] p-4 rounded-xl">
              {coverLetter}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button
              onClick={handleAccept}
              className="bg-[#9b87f5] hover:bg-[#7E69AB] text-white col-span-1 shadow-sm transition-all duration-300 hover:shadow-md"
            >
              <CheckSquare className="w-5 h-5 mr-2" />
              Accept Application
            </Button>
            <Button
              onClick={handleReject}
              variant="outline"
              className="border-[#D946EF] text-[#D946EF] hover:bg-[#FFDEE2] hover:text-[#D946EF] col-span-1 shadow-sm transition-all duration-300 hover:shadow-md"
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