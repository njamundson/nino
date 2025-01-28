import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/integrations/supabase/types/opportunity";
import ViewApplicationModal from "./modals/ViewApplicationModal";
import { useState } from "react";
import { ProposalStatusBadge } from "./ProposalStatusBadge";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2 } from "lucide-react";

interface ProposalCardProps {
  application: Application;
  type: 'proposal' | 'application';
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ProposalCard = ({ application, type, onUpdateStatus }: ProposalCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Determine the display status - if it's in the Applied tab and has a cover letter, 
  // it should show as Pending regardless of how it was initiated
  const displayStatus = type === 'application' && application.cover_letter 
    ? 'pending'
    : application.status;

  const handleUpdateStatus = async (status: 'accepted' | 'rejected') => {
    try {
      if (status === 'rejected') {
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', application.id);

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ['applications'] });
        queryClient.invalidateQueries({ queryKey: ['my-applications'] });
        
        toast.success("Application rejected");
      } else {
        await onUpdateStatus(application.id, status);
      }
      
      setShowModal(false);
    } catch (error) {
      console.error('Error updating application status:', error);
      toast.error("Failed to update application status");
    }
  };

  const handleDeleteApplication = async () => {
    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', application.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['applications'] });
      queryClient.invalidateQueries({ queryKey: ['my-applications'] });
      
      toast.success("Application deleted successfully");
    } catch (error) {
      console.error('Error deleting application:', error);
      toast.error("Failed to delete application");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleViewDetails = () => {
    setShowModal(true);
  };

  const handleMessageBrand = () => {
    if (application.opportunity?.brand?.user_id) {
      navigate(`/creator/messages?userId=${application.opportunity.brand.user_id}`);
    } else {
      toast.error("Unable to message brand at this time");
    }
  };

  return (
    <>
      <Card className="group relative overflow-hidden rounded-3xl border-0 cursor-pointer h-[400px]">
        <div className="relative h-full w-full">
          <img
            src={application.opportunity?.image_url || "/placeholder.svg"}
            alt={application.opportunity?.title || "Project image"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent" />
          
          {/* Status Badge - Using displayStatus instead of application.status */}
          <div className="absolute top-4 right-4 z-10">
            <ProposalStatusBadge status={displayStatus} />
          </div>
          
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="flex flex-col gap-4">
              <div>
                <p className="text-sm text-white/90 mb-1">
                  {application.opportunity?.brand?.company_name || "Unknown Brand"}
                </p>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                  {application.opportunity?.title || "Untitled Opportunity"}
                </h3>
              </div>

              {application.cover_letter && (
                <p className="text-sm text-white/80 line-clamp-2">
                  {application.cover_letter}
                </p>
              )}

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleViewDetails}
                  className="bg-white/90 hover:bg-white text-gray-900"
                >
                  View Details
                </Button>
                {application.status === 'accepted' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleMessageBrand}
                    className="border-white/30 text-white hover:bg-white/20"
                  >
                    Message Brand
                  </Button>
                )}
                {type === 'application' && application.cover_letter && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteApplication}
                    disabled={isDeleting}
                    className="border-white/30 text-white hover:bg-white/20"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {showModal && (
        <ViewApplicationModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          application={application}
          type={type}
          onUpdateStatus={handleUpdateStatus}
        />
      )}
    </>
  );
};

export default ProposalCard;