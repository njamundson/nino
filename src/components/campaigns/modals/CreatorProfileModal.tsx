import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import CreatorImage from "../creators/modal/profile/CreatorImage";
import CreatorBio from "../creators/modal/profile/CreatorBio";
import CreatorSocialLinks from "../creators/modal/profile/CreatorSocialLinks";

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
  onMessageCreator,
}: CreatorProfileModalProps) => {
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);
  const [showCampaignDialog, setShowCampaignDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAccept = async () => {
    setShowAcceptDialog(true);
  };

  const handleConfirmAccept = async () => {
    try {
      await onUpdateStatus('accepted');
      setShowAcceptDialog(false);
      setShowCampaignDialog(true);
      
      // Create a new message thread
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          sender_id: user.id,
          receiver_id: creator.user_id,
          content: "Hi! I've accepted your proposal. Let's discuss the next steps!",
        });

      if (messageError) throw messageError;

    } catch (error) {
      console.error('Error accepting application:', error);
      toast({
        title: "Error",
        description: "Failed to accept application. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleKeepCampaign = () => {
    setShowCampaignDialog(false);
    toast({
      title: "Success",
      description: "Application accepted! The campaign will remain active for more applications.",
    });
    navigate('/brand/bookings');
  };

  const handleRemoveCampaign = async () => {
    try {
      // Update the opportunity status to closed
      const { error: updateError } = await supabase
        .from('opportunities')
        .update({ status: 'closed' })
        .eq('id', creator.opportunity_id);

      if (updateError) throw updateError;

      setShowCampaignDialog(false);
      toast({
        title: "Success",
        description: "Application accepted and campaign closed!",
      });
      navigate('/brand/bookings');
    } catch (error) {
      console.error('Error closing campaign:', error);
      toast({
        title: "Error",
        description: "Failed to close the campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReject = () => {
    setShowRejectDialog(true);
  };

  const handleConfirmReject = async () => {
    try {
      await onUpdateStatus('rejected');
      
      // Delete the application
      const { error: deleteError } = await supabase
        .from('applications')
        .delete()
        .eq('creator_id', creator.id);

      if (deleteError) throw deleteError;

      setShowRejectDialog(false);
      onClose();
      
      toast({
        title: "Success",
        description: "Application rejected and removed.",
      });
    } catch (error) {
      console.error('Error rejecting application:', error);
      toast({
        title: "Error",
        description: "Failed to reject application. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="grid md:grid-cols-[300px,1fr]">
            <div className="p-6 bg-gray-50 border-r border-gray-100">
              <CreatorImage creator={creator} className="mb-6" />
              <CreatorSocialLinks creator={creator} className="mb-6" />
              <div className="space-y-2">
                <Button 
                  onClick={handleAccept}
                  className="w-full"
                >
                  Accept
                </Button>
                <Button 
                  onClick={handleReject}
                  variant="outline" 
                  className="w-full"
                >
                  Reject
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <CreatorBio creator={creator} />
              
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-2">Application Message</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600">{coverLetter}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Proposal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to accept this creator's proposal? This will create a new messaging thread and move the project to your bookings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAccept}>
              Accept Proposal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showCampaignDialog} onOpenChange={setShowCampaignDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Campaign Status</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to keep this campaign active for more applications or remove it from active projects?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleKeepCampaign}>
              Keep Active
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveCampaign} variant="destructive">
              Remove Campaign
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Proposal</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject this proposal? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmReject} variant="destructive">
              Reject Proposal
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default CreatorProfileModal;