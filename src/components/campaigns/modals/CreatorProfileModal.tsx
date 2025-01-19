import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Globe, Instagram, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator: any;
  coverLetter: string;
  onUpdateStatus: (status: 'accepted' | 'rejected') => void;
  onMessageCreator?: (userId: string) => void;
}

const CreatorProfileModal = ({ 
  isOpen, 
  onClose, 
  creator, 
  coverLetter,
  onUpdateStatus,
  onMessageCreator
}: CreatorProfileModalProps) => {
  console.log('Creator data in modal:', {
    creator,
    profileImage: creator?.profile_image_url,
    profile: creator?.profile
  });

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
      <DialogContent className="max-w-5xl p-0 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <div className="flex h-[600px]">
          {/* Left side - Profile Photo */}
          <div className="w-1/2 relative bg-[#F1F0FB]">
            <div className="w-full h-full flex items-center justify-center p-8">
              <Avatar className="w-full h-full rounded-2xl shadow-lg">
                <AvatarImage 
                  src={creator?.profile_image_url} 
                  alt={fullName}
                  className="object-cover rounded-2xl"
                />
                <AvatarFallback className="text-6xl bg-[#9b87f5] text-white rounded-2xl">
                  {creator?.profile?.first_name?.[0]}{creator?.profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Right side - Information */}
          <div className="w-1/2 p-8 space-y-6">
            <div>
              <h2 className="text-3xl font-semibold text-[#1A1F2C] mb-2">
                {fullName}
              </h2>
              {creator?.location && (
                <p className="text-gray-600 flex items-center gap-1">
                  <span>📍</span> {creator.location}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[#1A1F2C]">Proposal</h3>
              <div className="bg-[#F1F0FB] p-4 rounded-xl text-gray-700 leading-relaxed">
                {coverLetter}
              </div>
            </div>

            <div className="flex gap-3">
              {creator?.instagram && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-[#F1F0FB]"
                  onClick={() => window.open(`https://instagram.com/${creator.instagram}`, '_blank')}
                >
                  <Instagram className="w-5 h-5 text-[#9b87f5]" />
                </Button>
              )}
              {creator?.website && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-[#F1F0FB]"
                  onClick={() => window.open(creator.website, '_blank')}
                >
                  <Globe className="w-5 h-5 text-[#9b87f5]" />
                </Button>
              )}
              {onMessageCreator && (
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full hover:bg-[#F1F0FB]"
                  onClick={() => onMessageCreator(creator.user_id)}
                >
                  <MessageSquare className="w-5 h-5 text-[#9b87f5]" />
                </Button>
              )}
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={handleAccept}
                className="w-full bg-[#9b87f5] hover:bg-[#9b87f5]/90 text-white"
              >
                Accept Application
              </Button>
              <Button
                onClick={handleReject}
                variant="outline"
                className="w-full border-[#D946EF] text-[#D946EF] hover:bg-[#FFDEE2]"
              >
                Reject Application
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorProfileModal;