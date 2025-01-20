import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreatorProfileModal from "./modals/CreatorProfileModal";
import CampaignDetails from "./card/CampaignDetails";
import ApplicationsList from "./card/ApplicationsList";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

interface CampaignCardProps {
  campaign: any;
  onEdit: (campaign: any) => void;
  onDelete: (id: string) => void;
  applications?: any[];
  onUpdateApplicationStatus?: (applicationId: string, newStatus: 'accepted' | 'rejected') => void;
}

const CampaignCard = ({ 
  campaign, 
  onEdit, 
  onDelete, 
  applications = [], 
  onUpdateApplicationStatus 
}: CampaignCardProps) => {
  const [selectedCreator, setSelectedCreator] = useState<any>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [localApplications, setLocalApplications] = useState(applications);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleMessageCreator = (userId: string) => {
    navigate(`/brand/messages?userId=${userId}`);
  };

  const handleViewProfile = (application: any) => {
    setSelectedCreator(application.creator);
    setSelectedApplication(application);
  };

  const checkExistingChat = async (creatorUserId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    const { data: messages } = await supabase
      .from('messages')
      .select('id')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .or(`sender_id.eq.${creatorUserId},receiver_id.eq.${creatorUserId}`)
      .limit(1);

    return messages && messages.length > 0;
  };

  const createInitialMessage = async (creatorUserId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { error: messageError } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: creatorUserId,
        content: `Hi! I've accepted your application. Let's discuss the next steps!`,
        message_type: 'text'
      });

    if (messageError) throw messageError;
  };

  const handleUpdateStatus = (applicationId: string) => async (newStatus: 'accepted' | 'rejected') => {
    if (onUpdateApplicationStatus) {
      try {
        setIsProcessing(true);
        
        await onUpdateApplicationStatus(applicationId, newStatus);
        
        if (newStatus === 'rejected') {
          const { error } = await supabase
            .from('applications')
            .delete()
            .eq('id', applicationId);

          if (error) throw error;

          setLocalApplications(prevApps => 
            prevApps.filter(app => app.id !== applicationId)
          );

          toast.success("Application rejected and removed");
        } else if (newStatus === 'accepted') {
          const chatExists = await checkExistingChat(selectedCreator.user_id);
          
          if (!chatExists) {
            await createInitialMessage(selectedCreator.user_id);
          }

          // Update opportunity status
          const { error: opportunityError } = await supabase
            .from('opportunities')
            .update({ status: 'active' })
            .eq('id', campaign.id);

          if (opportunityError) throw opportunityError;

          // Success flow
          toast.success("Application accepted successfully");
          
          // Invalidate queries before navigation
          await queryClient.invalidateQueries({ queryKey: ['my-campaigns'] });
          
          // Navigate after everything is done
          navigate('/brand/bookings');
        }
        
        // Close the modal
        setSelectedCreator(null);
        setSelectedApplication(null);
      } catch (error) {
        console.error('Error updating application status:', error);
        toast.error("Failed to update application status");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  return (
    <>
      <Card className="overflow-hidden backdrop-blur-lg bg-white/80 border-0 shadow-lg rounded-2xl transition-all duration-300 hover:shadow-xl">
        <div className="p-8">
          <div className="flex justify-between items-start">
            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-2xl font-medium text-gray-900 tracking-tight mb-2">
                  {campaign.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {campaign.description}
                </p>
              </div>

              <CampaignDetails campaign={campaign} />
            </div>

            <div className="flex gap-2 ml-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onEdit(campaign)}
                className="text-gray-500 hover:text-gray-900 hover:bg-gray-100/80"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDelete(campaign.id)}
                className="text-gray-500 hover:text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ApplicationsList
            applications={localApplications}
            onViewProfile={handleViewProfile}
            onMessageCreator={handleMessageCreator}
          />
        </div>
      </Card>

      {selectedCreator && selectedApplication && (
        <CreatorProfileModal
          isOpen={!!selectedCreator}
          onClose={() => {
            setSelectedCreator(null);
            setSelectedApplication(null);
          }}
          creator={selectedCreator}
          coverLetter={selectedApplication.cover_letter}
          onUpdateStatus={handleUpdateStatus(selectedApplication.id)}
          onMessageCreator={() => handleMessageCreator(selectedCreator.user_id)}
          opportunityId={campaign.id}
          isProcessing={isProcessing}
        />
      )}
    </>
  );
};

export default CampaignCard;