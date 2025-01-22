import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ViewApplicationModal from "./modals/ViewApplicationModal";
import { useToast } from "@/hooks/use-toast";
import { Application } from "@/integrations/supabase/types/opportunity";

interface ProposalCardProps {
  application: Application;
  type: 'proposal' | 'application';
  onUpdateStatus?: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ProposalCard = ({ application, type, onUpdateStatus }: ProposalCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const handleViewDetails = () => {
    setIsLoading(true);
    try {
      navigate(`/creator/projects/${application.opportunity_id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load project details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const brandName = application.opportunity?.brand?.company_name || "Unnamed Brand";
  
  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-[400px]"
        onClick={() => setShowModal(true)}
      >
        <img
          src={application.opportunity?.image_url || "/placeholder.svg"}
          alt={application.opportunity?.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-20 left-6 right-6 text-white">
          <p className="text-sm font-medium text-white/90 mb-1">
            {brandName}
          </p>
          <h3 className="text-2xl font-semibold leading-tight line-clamp-2">
            {application.opportunity?.title}
          </h3>
          {application.opportunity?.location && (
            <p className="text-sm text-white/80 mt-2">
              📍 {application.opportunity.location}
            </p>
          )}
        </div>

        <Button
          size="icon"
          variant="secondary"
          className="absolute bottom-6 right-6 rounded-full bg-white/90 hover:bg-white transition-all duration-300 hover:scale-105 shadow-md"
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 text-gray-900" />
          )}
        </Button>
      </Card>

      <ViewApplicationModal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        application={application}
        type={type}
        onUpdateStatus={onUpdateStatus}
      />
    </>
  );
};

export default ProposalCard;