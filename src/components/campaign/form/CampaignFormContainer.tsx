import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormProgress from "../FormProgress";
import FormNavigation from "../FormNavigation";
import BasicInfo from "../steps/BasicInfo";
import Requirements from "../steps/Requirements";
import Compensation from "../steps/Compensation";
import SuccessModal from "../SuccessModal";
import { useCampaignSubmit } from "@/hooks/useCampaignSubmit";

const steps = ["basic", "requirements", "compensation"] as const;
type Step = typeof steps[number];

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

const CampaignFormContainer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("basic");
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
    startDate: null,
    endDate: null,
  });

  const handleNext = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
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

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <FormProgress currentStep={currentStep} />
      
      <div className="mt-8 space-y-8">
        {renderStep()}
      </div>

      <FormNavigation
        currentStep={currentStep}
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