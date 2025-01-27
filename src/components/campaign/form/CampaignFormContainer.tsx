import { useState } from "react";
import FormProgress from "../FormProgress";
import FormNavigation from "../FormNavigation";
import BasicInfo from "../steps/BasicInfo";
import Requirements from "../steps/Requirements";
import Compensation from "../steps/Compensation";
import SuccessModal from "../SuccessModal";
import ImageUpload from "../ImageUpload";
import { useCampaignSubmit } from "@/hooks/useCampaignSubmit";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface FormData {
  title: string;
  description: string;
  requirements: string[];
  perks: string[];
  deliverables: string[];
  location: string;
  payment_details: string;
  compensation_details: string;
  startDate: string | null;
  endDate: string | null;
}

const steps = [
  { title: "Basic Info", description: "Add campaign details" },
  { title: "Requirements", description: "Set campaign requirements" },
  { title: "Compensation", description: "Define compensation" }
] as const;

type StepKey = "basic" | "requirements" | "compensation";

const CampaignFormContainer = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<StepKey>("basic");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { isSuccessModalOpen, setIsSuccessModalOpen, submitCampaign } = useCampaignSubmit();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    requirements: [],
    perks: [],
    deliverables: [],
    location: "",
    payment_details: "",
    compensation_details: "",
    startDate: null,
    endDate: null,
  });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const { data, error } = await supabase.functions.invoke('upload-attachment', {
        body: formData,
        method: 'POST',
      });

      if (error) throw error;
      if (!data?.url) throw new Error('No URL returned from upload');

      setUploadedImage(data.url);
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const validateCurrentStep = () => {
    if (currentStep === "basic") {
      if (!formData.title.trim()) {
        toast({
          title: "Required Field",
          description: "Please enter a project title",
          variant: "destructive",
        });
        return false;
      }
      if (!formData.description.trim()) {
        toast({
          title: "Required Field",
          description: "Please enter a project description",
          variant: "destructive",
        });
        return false;
      }
    }

    if (currentStep === "compensation" && !uploadedImage) {
      toast({
        title: "Required Field",
        description: "Please upload a campaign image",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    const currentIndex = ["basic", "requirements", "compensation"].indexOf(currentStep);
    if (currentIndex < 2) {
      setCurrentStep(["basic", "requirements", "compensation"][currentIndex + 1] as StepKey);
    }
  };

  const handleBack = () => {
    const currentIndex = ["basic", "requirements", "compensation"].indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(["basic", "requirements", "compensation"][currentIndex - 1] as StepKey);
    }
  };

  const handleSubmit = () => {
    if (!validateCurrentStep()) return;
    
    if (!formData.title.trim() || !formData.description.trim() || !uploadedImage) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields: Project Title, Project Description, and Campaign Image",
        variant: "destructive",
      });
      return;
    }

    const submissionData = {
      ...formData,
      start_date: formData.startDate,
      end_date: formData.endDate
    };
    submitCampaign(submissionData, uploadedImage);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "basic":
        return (
          <BasicInfo
            formData={formData}
            setFormData={setFormData}
          />
        );
      case "requirements":
        return (
          <Requirements
            formData={formData}
            setFormData={setFormData}
          />
        );
      case "compensation":
        return (
          <div className="space-y-8">
            <Compensation
              formData={formData}
              setFormData={setFormData}
            />
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Image <span className="text-red-500">*</span></h3>
              <ImageUpload
                uploadedImage={uploadedImage}
                isUploading={isUploading}
                onImageUpload={handleImageUpload}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const currentStepIndex = ["basic", "requirements", "compensation"].indexOf(currentStep);

  const handleKeepActive = () => {
    setIsSuccessModalOpen(false);
    toast({
      title: "Success",
      description: "Campaign kept active",
    });
  };

  const handleClose = () => {
    setIsSuccessModalOpen(false);
    toast({
      title: "Success",
      description: "Campaign closed",
    });
  };

  return (
    <div className="p-8">
      <FormProgress 
        currentStep={currentStepIndex} 
        steps={steps as unknown as { title: string; description: string; }[]}
      />
      
      <div className="mt-8 space-y-8">
        {renderStep()}
      </div>

      <FormNavigation
        currentStep={currentStepIndex}
        totalSteps={steps.length}
        onNext={handleNext}
        onBack={handleBack}
        onSubmit={handleSubmit}
      />

      <SuccessModal
        isOpen={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
        onKeepActive={handleKeepActive}
        onClose={handleClose}
      />
    </div>
  );
};

export default CampaignFormContainer;
