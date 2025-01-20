import BasicInfo from "./steps/BasicInfo";
import Requirements from "./steps/Requirements";
import Compensation from "./steps/Compensation";
import SuccessModal from "./SuccessModal";
import ImageUpload from "./ImageUpload";
import FormProgress from "./FormProgress";
import FormNavigation from "./FormNavigation";
import StepWrapper from "./steps/StepWrapper";
import { useCampaignForm } from "./hooks/useCampaignForm";
import type { Step } from "./types";

const steps: Step[] = [
  {
    title: "Basic Information",
    description: "Let's start with the core details",
    component: BasicInfo,
    type: 'form'
  },
  {
    title: "Requirements",
    description: "Define what you're looking for",
    component: Requirements,
    type: 'form'
  },
  {
    title: "Compensation",
    description: "Set your budget and perks",
    component: Compensation,
    type: 'form'
  },
  {
    title: "Campaign Image",
    description: "Add a visual to your campaign",
    component: ImageUpload,
    type: 'image'
  },
];

const CampaignForm = () => {
  const {
    currentStep,
    formData,
    setFormData,
    showSuccessModal,
    setShowSuccessModal,
    uploadedImage,
    isUploading,
    handleImageUpload,
    handleSubmit,
    handleNext,
    handleBack
  } = useCampaignForm(steps);

  return (
    <div className="space-y-6">
      <FormProgress currentStep={currentStep} steps={steps} />

      <div className="min-h-[400px]">
        <StepWrapper
          currentStep={currentStep}
          steps={steps}
          formData={formData}
          setFormData={setFormData}
          uploadedImage={uploadedImage}
          isUploading={isUploading}
          onImageUpload={handleImageUpload}
        />
      </div>

      <FormNavigation
        currentStep={currentStep}
        totalSteps={steps.length}
        onBack={handleBack}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />

      <SuccessModal 
        isOpen={showSuccessModal} 
        onOpenChange={setShowSuccessModal}
      />
    </div>
  );
};

export default CampaignForm;