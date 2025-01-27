import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/integrations/supabase/types/opportunity";
import ViewApplicationModal from "./modals/ViewApplicationModal";
import { useState } from "react";
import ProposalStatusBadge from "./ProposalStatusBadge";
import { useQueryClient } from "@tanstack/react-query";

interface ProposalCardProps {
  application: Application;
  type: 'proposal' | 'application';
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ProposalCard = ({ application, type, onUpdateStatus }: ProposalCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleUpdateStatus = async (status: 'accepted' | 'rejected') => {
    try {
      if (status === 'rejected') {
        // Delete the application instead of updating status
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', application.id);

        if (error) throw error;

        // Invalidate queries to refresh the UI
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
      <Card className="overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold mb-1">
                {application.opportunity?.title || "Untitled Opportunity"}
              </h3>
              <p className="text-sm text-muted-foreground">
                {application.opportunity?.brand?.company_name || "Unknown Brand"}
              </p>
            </div>
            <ProposalStatusBadge status={application.status} />
          </div>

          <div className="space-y-4">
            {application.cover_letter && (
              <p className="text-sm text-muted-foreground line-clamp-3">
                {application.cover_letter}
              </p>
            )}

            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewDetails}
              >
                View Details
              </Button>
              {application.status === 'accepted' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMessageBrand}
                >
                  Message Brand
                </Button>
              )}
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