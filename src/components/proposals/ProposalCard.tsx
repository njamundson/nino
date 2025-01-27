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
          
          <div className="absolute inset-x-0 bottom-0 p-6 text-white">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <p className="text-sm text-white/90 mb-1">
                  {application.opportunity?.brand?.company_name || "Unknown Brand"}
                </p>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                  {application.opportunity?.title || "Untitled Opportunity"}
                </h3>
              </div>
              <ProposalStatusBadge status={application.status} />
            </div>

            <div className="space-y-4">
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