import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormProgress from "../FormProgress";
import FormNavigation from "../FormNavigation";
import BasicInfo from "../steps/BasicInfo";
import Requirements from "../steps/Requirements";
import Compensation from "../steps/Compensation";
import SuccessModal from "../SuccessModal";
import ImageUpload from "../ImageUpload";
import { useCampaignSubmit } from "@/hooks/useCampaignSubmit";

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

const steps = [
  { title: "Basic Info", description: "Add campaign details" },
  { title: "Requirements", description: "Set campaign requirements" },
  { title: "Compensation", description: "Define compensation" }
] as const;

type StepKey = "basic" | "requirements" | "compensation";

const CampaignFormContainer = () => {
  const navigate = useNavigate();
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
    start_date: null,
    end_date: null,
  });

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload-attachment', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const { url } = await response.json();
      setUploadedImage(url);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploading(false);
    }
  };

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
              <h3 className="text-lg font-medium text-gray-900 mb-4">Campaign Image</h3>
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
      />
    </div>
  );
};

export default CampaignFormContainer;