import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import ApplicationForm from "./modal/ApplicationForm";
import SuccessModal from "./modal/SuccessModal";

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
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden rounded-2xl bg-white">
        <div className="p-8 overflow-y-auto max-h-[90vh] space-y-8">
          <div className="space-y-4">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h2 className="text-2xl font-semibold tracking-tight">{opportunity.title}</h2>
                <p className="text-muted-foreground">{opportunity.brand.company_name}</p>
              </div>
              <Button onClick={handleApply} size="lg">
                Apply Now
              </Button>
            </div>
            <p className="text-gray-600 leading-relaxed">{opportunity.description}</p>
          </div>

          <div className="space-y-6">
            {/* Project Metadata */}
            <div className="grid grid-cols-2 gap-4">
              {opportunity.location && (
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-gray-400">📍</span>
                    {opportunity.location}
                  </p>
                </div>
              )}
              {(opportunity.start_date || opportunity.end_date) && (
                <div>
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span className="text-gray-400">🗓️</span>
                    {opportunity.start_date && formatDate(opportunity.start_date)}
                    {opportunity.end_date && ` - ${formatDate(opportunity.end_date)}`}
                  </p>
                </div>
              )}
            </div>

            {/* Compensation Details */}
            {(opportunity.payment_details || opportunity.compensation_details) && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Compensation</h3>
                <div className="flex gap-2 flex-wrap">
                  {opportunity.payment_details && (
                    <Badge variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                      💰 {opportunity.payment_details}
                    </Badge>
                  )}
                  {opportunity.compensation_details && (
                    <Badge variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                      🎁 {opportunity.compensation_details}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Requirements */}
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Requirements</h3>
                <ul className="space-y-2">
                  {opportunity.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Deliverables */}
            {opportunity.deliverables && opportunity.deliverables.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Deliverables</h3>
                <ul className="space-y-2">
                  {opportunity.deliverables.map((del, index) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-gray-400 mt-1">•</span>
                      {del}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Perks */}
            {opportunity.perks && opportunity.perks.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium">Perks</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.perks.map((perk, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-purple-50 text-purple-700 hover:bg-purple-100"
                    >
                      {perk}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;