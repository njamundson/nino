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
      <DialogContent className="max-w-4xl p-0 rounded-2xl overflow-hidden bg-white">
        <div className="flex flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <h1 className="text-2xl font-semibold">Project Application</h1>
          </div>

          {/* Content */}
          <div className="flex">
            {/* Left side - Profile Photo */}
            <div className="w-1/2 relative">
              <div className="w-full aspect-square">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage 
                    src={creator?.profile_image_url} 
                    alt={fullName}
                    className="object-cover w-full h-full"
                  />
                  <AvatarFallback className="text-6xl bg-gray-100 text-gray-400 rounded-none">
                    {creator?.profile?.first_name?.[0]}{creator?.profile?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>

            {/* Right side - Information */}
            <div className="w-1/2 bg-[#2A2A2A] text-white">
              <div className="p-6 space-y-6">
                {/* Brand Info */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold">{fullName}</h2>
                  <p className="text-gray-400">
                    {new Date().toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                  {creator?.location && (
                    <p className="text-gray-400">{creator.location}</p>
                  )}
                </div>

                {/* Project Description */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Project description:</h3>
                  <p className="text-gray-300 leading-relaxed">
                    {coverLetter}
                  </p>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Payment:</h3>
                    <p className="text-gray-300">$0.00</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Compensation:</h3>
                    <p className="text-gray-300">{creator?.compensation || 'Not specified'}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Project Deliverables:</h3>
                    <p className="text-gray-300">{creator?.deliverables || 'Not specified'}</p>
                  </div>

                  <div>
                    <h3 className="font-medium mb-1">Requirements:</h3>
                    <p className="text-gray-300">{creator?.requirements || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer with Actions */}
          <div className="p-6 border-t flex justify-between items-center">
            <Button
              onClick={handleReject}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Delete Proposal
            </Button>
            <Button
              onClick={handleAccept}
              className="bg-[#4CAF50] hover:bg-[#4CAF50]/90 text-white"
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