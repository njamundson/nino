import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Application } from "@/integrations/supabase/types/application";
import ViewApplicationModal from "./modals/ViewApplicationModal";
import { useState } from "react";
import { motion } from "framer-motion";

interface ProposalCardProps {
  application: Application;
  type: 'proposal' | 'application';
  onUpdateStatus: (applicationId: string, status: 'accepted' | 'rejected') => void;
}

const ProposalCard = ({ application, type, onUpdateStatus }: ProposalCardProps) => {
  const [showModal, setShowModal] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // For brand invitations without a cover letter, show as 'invited'
  // For creator applications or responded invitations, show the actual status
  const displayStatus = type === 'proposal' && !application.cover_letter 
    ? 'invited'
    : application.status;

  const handleViewDetails = () => {
    setShowModal(true);
  };

  // Create a wrapper function to match the expected signature
  const handleUpdateStatus = async (status: 'accepted' | 'rejected') => {
    onUpdateStatus(application.id, status);
  };

  // Get the brand name from the opportunity's brand
  const brandName = application.opportunity?.brand?.company_name;

  return (
    <>
      <Card 
        className="group relative overflow-hidden rounded-3xl border-0 bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer h-[400px]"
        onClick={handleViewDetails}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            handleViewDetails();
          }
        }}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <img
          src={application.opportunity?.image_url || "/placeholder.svg"}
          alt={application.opportunity?.title || "Project image"}
          className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        <div className="absolute top-4 right-4">
          <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium
            ${displayStatus === 'invited' ? 'bg-blue-100 text-blue-700' : 
              displayStatus === 'accepted' ? 'bg-green-100 text-green-700' : 
              displayStatus === 'rejected' ? 'bg-red-100 text-red-700' : 
              'bg-gray-100 text-gray-700'}`}
          >
            {displayStatus.charAt(0).toUpperCase() + displayStatus.slice(1)}
          </span>
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm text-white/90 mb-1">
                {brandName || ""}
              </p>
              <h3 className="text-xl font-semibold mb-2 line-clamp-2">
                {application.opportunity?.title || ""}
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
                onClick={(e) => {
                  e.preventDefault();
                  handleViewDetails();
                }}
                className="bg-white/90 hover:bg-white text-gray-900"
              >
                View Details
              </Button>
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