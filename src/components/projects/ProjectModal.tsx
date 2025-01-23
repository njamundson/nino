import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ProjectHeader from "./modal/ProjectHeader";
import ProjectDescription from "./modal/ProjectDescription";
import ProjectRequirements from "./modal/ProjectRequirements";
import ProjectDeliverables from "./modal/ProjectDeliverables";
import ProjectCompensation from "./modal/ProjectCompensation";
import ApplicationForm from "./modal/ApplicationForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
    id: string;
    title: string;
    description: string | null;
    requirements: string[] | null;
    deliverables: string[] | null;
    location: string | null;
    start_date: string | null;
    end_date: string | null;
    payment_details: string | null;
    compensation_details: string | null;
    brand_id: string;
  };
  isCompleted?: boolean;
}

const ProjectModal = ({ isOpen, onClose, opportunity, isCompleted = false }: ProjectModalProps) => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // Fetch brand data
  const { data: brandData } = useQuery({
    queryKey: ['brand', opportunity.brand_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('brands')
        .select('company_name')
        .eq('id', opportunity.brand_id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleApply = () => {
    if (!isOpen) return;
    setShowApplicationForm(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0">
        <div className="max-h-[85vh] overflow-y-auto">
          {showApplicationForm ? (
            <ApplicationForm
              opportunity={opportunity}
              onBack={() => setShowApplicationForm(false)}
              onClose={onClose}
              onModalClose={onClose}
            />
          ) : (
            <div className="space-y-8">
              <ProjectHeader
                title={opportunity.title}
                companyName={brandData?.company_name || 'Loading...'}
                location={opportunity.location}
                startDate={opportunity.start_date}
                endDate={opportunity.end_date}
              />

              <div className="px-8 pb-8 space-y-8">
                <ProjectDescription description={opportunity.description} />
                <ProjectRequirements requirements={opportunity.requirements} />
                <ProjectDeliverables deliverables={opportunity.deliverables} />
                <ProjectCompensation
                  paymentDetails={opportunity.payment_details}
                  compensationDetails={opportunity.compensation_details}
                />

                {!isCompleted && (
                  <div className="flex justify-end pt-6">
                    <Button
                      onClick={handleApply}
                      className="bg-nino-primary hover:bg-nino-primary/90"
                    >
                      Apply Now
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;