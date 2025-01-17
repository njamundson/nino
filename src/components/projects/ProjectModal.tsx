import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import BrandInfo from "./modal/BrandInfo";
import ProjectDetails from "./modal/ProjectDetails";
import ApplicationForm from "./modal/ApplicationForm";
import SuccessModal from "./modal/SuccessModal";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  opportunity: {
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
    brand: {
      company_name: string;
      brand_type: string;
      location: string | null;
    };
  };
}

const ProjectModal = ({ isOpen, onClose, opportunity }: ProjectModalProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isApplying, setIsApplying] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { data: creator, isLoading: isLoadingCreator } = useQuery({
    queryKey: ["creator"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from("creators")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
  });

  const handleApply = async (coverLetter: string) => {
    if (!creator) {
      toast({
        title: "Creator profile required",
        description: "Please complete your creator profile to apply for projects.",
        variant: "destructive",
      });
      navigate("/onboarding");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from("applications")
        .insert({
          opportunity_id: opportunity.id,
          creator_id: creator.id,
          cover_letter: coverLetter,
        });

      if (error) throw error;

      setShowSuccessModal(true);
      setIsApplying(false);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description: "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (showSuccessModal) {
    return (
      <SuccessModal
        companyName={opportunity.brand.company_name}
        onClose={() => {
          setShowSuccessModal(false);
          onClose();
        }}
      />
    );
  }

  if (isLoadingCreator) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl">
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {opportunity.title}
          </DialogTitle>
          <BrandInfo
            companyName={opportunity.brand.company_name}
            brandType={opportunity.brand.brand_type}
            location={opportunity.location}
          />
        </DialogHeader>
        
        <div className="space-y-4">
          <ProjectDetails
            description={opportunity.description}
            startDate={opportunity.start_date}
            endDate={opportunity.end_date}
            requirements={opportunity.requirements}
            perks={opportunity.perks}
            paymentDetails={opportunity.payment_details}
            compensationDetails={opportunity.compensation_details}
            deliverables={opportunity.deliverables}
          />

          {isApplying ? (
            <ApplicationForm
              onSubmit={handleApply}
              onCancel={() => setIsApplying(false)}
              isSubmitting={isSubmitting}
            />
          ) : (
            <Button
              className="w-full"
              onClick={() => setIsApplying(true)}
            >
              Apply for this Project
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;
