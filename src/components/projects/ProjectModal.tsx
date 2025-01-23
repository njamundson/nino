import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import ProjectHeader from "./modal/ProjectHeader";
import ProjectDescription from "./modal/ProjectDescription";
import ProjectRequirements from "./modal/ProjectRequirements";
import ProjectDeliverables from "./modal/ProjectDeliverables";
import ProjectCompensation from "./modal/ProjectCompensation";
import ApplicationForm from "./modal/ApplicationForm";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const { data: brandData, isLoading } = useQuery({
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
    enabled: isOpen,
  });

  const handleApply = () => {
    if (!isOpen) return;
    setShowApplicationForm(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden">
        <div className="max-h-[85vh] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="flex flex-col items-center space-y-4">
                <div className="h-6 w-6 border-2 border-nino-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-gray-500">Loading project details...</p>
              </div>
            </div>
          ) : showApplicationForm ? (
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