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

const CampaignFormContainer = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>("basic");
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const { isSuccessModalOpen, setIsSuccessModalOpen, submitCampaign } = useCampaignSubmit();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: [] as string[],
    perks: [] as string[],
    deliverables: [] as string[],
    location: "",
    payment_details: "",
    compensation_details: "",
    start_date: null as string | null,
    end_date: null as string | null,
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
            title={formData.title}
            description={formData.description}
            location={formData.location}
            uploadedImage={uploadedImage}
            onUpdateField={updateFormData}
            onImageUpload={setUploadedImage}
          />
        );
      case "requirements":
        return (
          <Requirements
            requirements={formData.requirements}
            perks={formData.perks}
            deliverables={formData.deliverables}
            onUpdateField={updateFormData}
          />
        );
      case "compensation":
        return (
          <Compensation
            paymentDetails={formData.payment_details}
            compensationDetails={formData.compensation_details}
            startDate={formData.start_date}
            endDate={formData.end_date}
            onUpdateField={updateFormData}
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
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate("/brand/campaigns");
        }}
      />
    </div>
  );
};

export default CampaignFormContainer;