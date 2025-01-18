import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import ApplicationForm from "./modal/ApplicationForm";
import SuccessModal from "./modal/SuccessModal";
import { Separator } from "@/components/ui/separator";

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
      <DialogContent className="max-w-4xl h-[90vh] p-0 gap-0 overflow-hidden bg-[#FAFAFA] rounded-2xl">
        {/* Header Section with Glassmorphism */}
        <div className="sticky top-0 z-10 backdrop-blur-xl bg-white/80 border-b border-gray-100 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">
                    {opportunity.brand.company_name}
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
                    {opportunity.title}
                  </h2>
                </div>
                <Button 
                  onClick={handleApply}
                  size="lg"
                  className="bg-black hover:bg-gray-800 text-white rounded-full px-8 transition-all"
                >
                  Apply Now
                </Button>
              </div>

              {/* Quick Info Pills */}
              <div className="flex flex-wrap gap-3 mt-2">
                {opportunity.location && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    📍 {opportunity.location}
                  </span>
                )}
                {opportunity.start_date && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                    🗓️ {formatDate(opportunity.start_date)}
                    {opportunity.end_date && ` - ${formatDate(opportunity.end_date)}`}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="overflow-y-auto px-8 py-6">
          <div className="max-w-3xl mx-auto space-y-8">
            {/* Description */}
            <div className="prose prose-gray max-w-none">
              <p className="text-gray-600 leading-relaxed text-lg">
                {opportunity.description}
              </p>
            </div>

            <Separator className="my-8" />

            {/* Compensation Section */}
            {(opportunity.payment_details || opportunity.compensation_details) && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Compensation</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.payment_details && (
                    <Badge variant="secondary" className="px-4 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-full">
                      💰 {opportunity.payment_details}
                    </Badge>
                  )}
                  {opportunity.compensation_details && (
                    <Badge variant="secondary" className="px-4 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full">
                      🎁 {opportunity.compensation_details}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {/* Requirements Section */}
            {opportunity.requirements && opportunity.requirements.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Requirements</h3>
                <div className="grid gap-3">
                  {opportunity.requirements.map((req, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                    >
                      <p className="text-gray-600">{req}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Deliverables Section */}
            {opportunity.deliverables && opportunity.deliverables.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-900">Deliverables</h3>
                <div className="grid gap-3">
                  {opportunity.deliverables.map((del, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-white rounded-xl border border-gray-100 shadow-sm"
                    >
                      <p className="text-gray-600">{del}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Perks Section */}
            {opportunity.perks && opportunity.perks.length > 0 && (
              <div className="space-y-4 pb-8">
                <h3 className="text-xl font-semibold text-gray-900">Perks</h3>
                <div className="flex flex-wrap gap-2">
                  {opportunity.perks.map((perk, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="px-4 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-full"
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