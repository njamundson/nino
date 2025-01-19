import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
}: CreatorProfileModalProps) => {
  console.log('Creator data in modal:', {
    creator,
    profileImage: creator?.profile_image_url,
    profile: creator?.profile
  });

  const handleAccept = () => {
    onUpdateStatus('accepted');
    onClose();
  };

  const handleReject = () => {
    onUpdateStatus('rejected');
    onClose();
  };

  const fullName = `${creator?.profile?.first_name || ''} ${creator?.profile?.last_name || ''}`.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl p-0 rounded-3xl overflow-hidden bg-white shadow-2xl">
        <div className="flex flex-col h-[80vh]">
          <div className="flex flex-1 overflow-hidden">
            {/* Left side - Profile Photo */}
            <div className="w-1/2 relative bg-[#F5F5F7]">
              <div className="w-full h-full">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage 
                    src={creator?.profile_image_url} 
                    alt={fullName}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="text-8xl bg-[#F5F5F7] text-[#86868B] rounded-none h-full">
                    {creator?.profile?.first_name?.[0]}{creator?.profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Right side - Information */}
            <div className="w-1/2 bg-[#1D1D1F] text-white overflow-y-auto">
              <div className="p-10 space-y-8">
                {/* Creator Info */}
                <div className="space-y-3">
                  <h2 className="text-3xl font-medium tracking-tight">{fullName}</h2>
                  <p className="text-[#86868B] text-lg">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {creator?.location && (
                    <p className="text-[#86868B] text-lg">{creator.location}</p>
                  )}
                </div>

                {/* Project Description */}
                <div className="space-y-4">
                  <h3 className="text-xl font-medium">Project Description</h3>
                  <p className="text-[#86868B] leading-relaxed text-lg">
                    {coverLetter}
                  </p>
                </div>

                {/* Payment Details */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Payment</h3>
                    <p className="text-[#86868B] text-lg">$0.00</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Compensation</h3>
                    <p className="text-[#86868B] text-lg">{creator?.compensation || 'Not specified'}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Project Deliverables</h3>
                    <p className="text-[#86868B] text-lg">{creator?.deliverables || 'Not specified'}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">Requirements</h3>
                    <p className="text-[#86868B] text-lg">{creator?.requirements || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="p-6 bg-[#1D1D1F] border-t border-[#2D2D2F] flex justify-between items-center">
            <Button
              onClick={handleReject}
              variant="outline"
              className="px-8 py-6 text-red-500 border-red-500 hover:bg-red-500/10 transition-colors duration-200"
            >
              Delete Proposal
            </Button>
            <Button
              onClick={handleAccept}
              className="px-8 py-6 bg-[#2ED477] hover:bg-[#2ED477]/90 text-white transition-colors duration-200"
            >
              Accept Proposal
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatorProfileModal;