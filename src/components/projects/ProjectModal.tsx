import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import ApplicationForm from "./modal/ApplicationForm";
import SuccessModal from "./modal/SuccessModal";
import ProjectHeader from "./modal/ProjectHeader";
import ProjectDescription from "./modal/ProjectDescription";
import ProjectCompensation from "./modal/ProjectCompensation";
import ProjectRequirements from "./modal/ProjectRequirements";
import ProjectDeliverables from "./modal/ProjectDeliverables";
import ProjectPerks from "./modal/ProjectPerks";
import { Button } from "@/components/ui/button";

interface Brand {
  id: string;
  company_name: string | null;
  brand_type: string | null;
  location: string | null;
  description: string | null;
  website: string | null;
  instagram: string | null;
}

interface Opportunity {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  perks: string[] | null;
  requirements: string[] | null;
  payment_details: string | null;
  compensation_details: string | null;
  deliverables: string[] | null;
  brand: Brand | null;
  image_url: string | null;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
  isCompleted?: boolean;
}

const ProjectModal = ({ isOpen, onClose, opportunity, isCompleted = false }: ProjectModalProps) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleApply = () => {
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = () => {
    setShowApplicationForm(false);
    setShowSuccessModal(true);
  };

  if (showSuccessModal) {
    return (
      <SuccessModal 
        isOpen={showSuccessModal}
        onOpenChange={(open) => {
          setShowSuccessModal(open);
          if (!open) onClose();
        }}
      />
    );
  }

  if (showApplicationForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl p-6">
          <ApplicationForm 
            opportunity={opportunity}
            onClose={() => setShowApplicationForm(false)}
            onModalClose={onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[85vh] p-0 gap-0 overflow-hidden bg-[#FAFAFA] rounded-2xl">
        <ProjectHeader
          title={opportunity.title}
          companyName={opportunity.brand!.company_name!}
          location={opportunity.location}
          startDate={opportunity.start_date}
          endDate={opportunity.end_date}
          onApply={handleApply}
          isCompleted={isCompleted}
        />

        <div className="overflow-y-auto px-6 py-4 relative h-full">
          <div className="max-w-3xl mx-auto space-y-4 pb-16">
            <ProjectDescription description={opportunity.description} />
            
            <Separator className="my-4" />

            <ProjectCompensation
              paymentDetails={opportunity.payment_details}
              compensationDetails={opportunity.compensation_details}
            />

            {opportunity.requirements && (
              <ProjectRequirements requirements={opportunity.requirements} />
            )}

            {opportunity.deliverables && (
              <ProjectDeliverables deliverables={opportunity.deliverables} />
            )}

            {opportunity.perks && (
              <ProjectPerks perks={opportunity.perks} />
            )}
          </div>
          
          {!isCompleted && (
            <div className="fixed bottom-6 right-6">
              <Button 
                onClick={handleApply}
                size="lg"
                className="bg-[#a55549] hover:bg-[#a55549]/90 text-white rounded-full px-8 transition-all"
              >
                Apply Now
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;