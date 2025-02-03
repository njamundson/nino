import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Application } from "@/integrations/supabase/types/application";
import ViewApplicationModal from "./modals/ViewApplicationModal";
import { useState } from "react";
import { ProposalStatusBadge } from "./ProposalStatusBadge";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProposalCardProps {
  application: Application;
  type: 'proposal' | 'application';
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ProposalCard = ({ application, type, onUpdateStatus }: ProposalCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const queryClient = useQueryClient();

  // For brand invitations without a cover letter, show as 'invited'
  // For creator applications or responded invitations, show the actual status
  const displayStatus = type === 'proposal' && !application.cover_letter 
    ? 'invited'
    : application.status;

  const handleUpdateStatus = async (status: 'accepted' | 'rejected') => {
    try {
      if (status === 'rejected') {
        const { error } = await supabase
          .from('applications')
          .delete()
          .eq('id', application.id);

        if (error) throw error;

        await Promise.all([
          queryClient.invalidateQueries({ queryKey: ['applications'] }),
          queryClient.invalidateQueries({ queryKey: ['my-applications'] }),
          queryClient.invalidateQueries({ queryKey: ['opportunities'] })
        ]);
        
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

  return (
    <>
      <Card className="group relative overflow-hidden rounded-xl border border-gray-100 shadow-sm cursor-pointer h-[260px] transition-all duration-300 hover:shadow-md">
        <div className="relative h-full w-full">
          <img
            src={application.opportunity?.image_url || "/placeholder.svg"}
            alt={application.opportunity?.title || "Project image"}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          
          <div className="absolute top-3 right-3 z-10">
            <ProposalStatusBadge status={displayStatus} />
          </div>
          
          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
            <div className="flex flex-col gap-2">
              <div>
                <p className="text-sm text-white/90 mb-1">
                  {application.opportunity?.brand?.company_name || "Unknown Brand"}
                </p>
                <h3 className="text-base font-semibold mb-2 line-clamp-2">
                  {application.opportunity?.title || "Untitled Opportunity"}
                </h3>
              </div>

              {application.cover_letter && (
                <p className="text-sm text-white/80 line-clamp-2">
                  {application.cover_letter}
                </p>
              )}

              <div className="flex gap-2 mt-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleViewDetails}
                  className="bg-white/90 hover:bg-white text-gray-900 text-sm"
                >
                  View Details
                </Button>
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