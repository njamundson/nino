import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
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

interface Brand {
  company_name: string;
  brand_type: string;
  location: string | null;
  description: string;
  website: string;
  instagram: string;
}

interface Opportunity {
  id: string;
  title: string;
  description: string;
  location: string | null;
  start_date: string | null;
  end_date: string | null;
  perks: string[] | null;
  requirements: string[] | null;
  payment_details: string | null;
  compensation_details: string | null;
  deliverables: string[] | null;
  brand: Brand;
}

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: Opportunity;
}

const ProjectModal = ({ isOpen, onClose, opportunity }: ProjectModalProps) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleApply = () => {
    setShowApplicationForm(true);
  };

  const handleApplicationSubmit = () => {
    setShowApplicationForm(false);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  if (showSuccessModal) {
    return (
      <SuccessModal 
        companyName={opportunity.brand.company_name} 
        onClose={handleSuccessClose} 
      />
    );
  }

  if (showApplicationForm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl p-6">
          <DialogTitle>Apply to {opportunity.title}</DialogTitle>
          <ApplicationForm 
            opportunity={opportunity}
            onClose={() => setShowApplicationForm(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 overflow-hidden bg-[#FAFAFA] rounded-2xl">
        <ProjectHeader
          title={opportunity.title}
          companyName={opportunity.brand.company_name}
          location={opportunity.location}
          startDate={opportunity.start_date}
          endDate={opportunity.end_date}
          onApply={handleApply}
        />

        <div className="overflow-y-auto px-8 py-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <ProjectDescription description={opportunity.description} />
            
            <Separator className="my-8" />

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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;