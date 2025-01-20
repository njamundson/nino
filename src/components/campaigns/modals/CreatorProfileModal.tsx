import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import CreatorImage from "@/components/creators/modal/profile/CreatorImage";
import CreatorBio from "@/components/creators/modal/profile/CreatorBio";
import CreatorSocialLinks from "@/components/creators/modal/profile/CreatorSocialLinks";
import { toast } from "sonner";
import { CheckSquare, XSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

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

  const handleReject = async () => {
    try {
      onUpdateStatus('rejected');
      // Delete the application after marking it as rejected
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('creator_id', creator.id);

      if (error) throw error;

      toast.error("Application rejected and removed");
      onClose();
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error("Failed to remove application");
    }
  };

  const fullName = `${creator?.profile?.first_name || ''} ${creator?.profile?.last_name || ''}`.trim();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-0 overflow-hidden bg-white rounded-3xl">
        <div className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <CreatorImage 
              profileImageUrl={creator?.profile_image_url} 
              fullName={fullName}
            />
            
            <div className="flex flex-col h-full space-y-6">
              <CreatorBio 
                bio={creator?.bio}
                location={creator?.location}
                specialties={creator?.specialties}
                instagram={creator?.instagram}
                website={creator?.website}
                onMessageClick={onMessageCreator}
              />

              <CreatorSocialLinks 
                instagram={creator?.instagram}
                website={creator?.website}
              />

              {/* Application Message */}
              <div className="bg-gray-50/80 backdrop-blur-sm p-6 rounded-2xl border border-gray-100">
                <h3 className="font-medium text-gray-900 mb-3">Application Message</h3>
                <p className="text-gray-600 leading-relaxed">{coverLetter}</p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 mt-auto">
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