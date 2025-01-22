import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import ViewApplicationModal from "./modals/ViewApplicationModal";
import ProposalStatusBadge from "./ProposalStatusBadge";

interface ProposalCardProps {
  application: any;
  onUpdateStatus?: (applicationId: string, status: 'accepted' | 'rejected') => void;
  type: 'proposal' | 'application';
}

const ProposalCard = ({ application, type }: ProposalCardProps) => {
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  
  const brandName = application.opportunity?.brand?.company_name || "Anonymous Brand";
  const title = application.opportunity?.title || "Untitled Opportunity";
  const location = application.opportunity?.brand?.location;
  const imageUrl = application.opportunity?.image_url;

  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-[400px]"
        onClick={() => setShowApplicationModal(true)}
      >
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute bottom-20 left-6 right-6 text-white">
          <p className="text-sm font-medium text-white/90 mb-1">
            {brandName}
          </p>
          <h3 className="text-2xl font-semibold leading-tight line-clamp-2">
            {title}
          </h3>
          {location && (
            <p className="text-sm text-white/80 mt-2">
              📍 {location}
            </p>
          )}
        </div>

        <div className="absolute bottom-6 right-6 flex items-center gap-2">
          <ProposalStatusBadge status={application.status} />
          <Button
            size="icon"
            variant="secondary"
            className="rounded-full bg-white/90 hover:bg-white transition-all duration-300 hover:scale-105 shadow-md"
          >
            <ExternalLink className="h-4 w-4 text-gray-900" />
          </Button>
        </div>
      </Card>

      {showApplicationModal && (
        <ViewApplicationModal
          isOpen={showApplicationModal}
          onClose={() => setShowApplicationModal(false)}
          application={application}
        />
      )}
    </>
  );
};

export default ProposalCard;