import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormProgress from "../FormProgress";
import FormNavigation from "../FormNavigation";
import BasicInfo from "../steps/BasicInfo";
import Requirements from "../steps/Requirements";
import Compensation from "../steps/Compensation";
import SuccessModal from "../SuccessModal";
import { useCampaignSubmit } from "@/hooks/useCampaignSubmit";

const steps = [
  { title: "Basic Info", description: "Add campaign details" },
  { title: "Requirements", description: "Set campaign requirements" },
  { title: "Compensation", description: "Define compensation" }
] as const;

type StepKey = "basic" | "requirements" | "compensation";

interface FormData {
  title: string;
  description: string;
  requirements: string[];
  perks: string[];
  deliverables: string[];
  location: string;
  payment_details: string;
  compensation_details: string;
  start_date: string | null;
  end_date: string | null;
}

const CampaignFormContainer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<StepKey>("basic");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
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
    start_date: null,
    end_date: null,
  });

  const handleNext = () => {
    const currentIndex = ["basic", "requirements", "compensation"].indexOf(currentStep);
    if (currentIndex < 2) {
      setCurrentStep(["basic", "requirements", "compensation"][currentIndex + 1] as StepKey);
    }
  };

  const handleBack = () => {
    const currentIndex = ["basic", "requirements", "compensation"].indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(["basic", "requirements", "compensation"][currentIndex - 1] as StepKey);
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = () => {
    submitCampaign(formData, uploadedImage);
  };

  const renderStep = () => {
    switch (currentStep) {
      case "basic":
        return (
          <BasicInfo
            formData={formData}
            setFormData={setFormData}
            uploadedImage={uploadedImage}
            onImageUpload={setUploadedImage}
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
          <Compensation
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  const currentStepIndex = ["basic", "requirements", "compensation"].indexOf(currentStep);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <FormProgress 
        currentStep={currentStepIndex} 
        steps={steps as { title: string; description: string; }[]}
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
      />
    </div>
  );
};

export default CampaignFormContainer;