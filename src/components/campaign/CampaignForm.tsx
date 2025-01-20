import { useCampaignForm } from "./hooks/useCampaignForm";
import { steps } from "./config/formSteps";
import CampaignFormContent from "./CampaignFormContent";
import SuccessModal from "./SuccessModal";
import FormProgress from "./FormProgress";
import FormNavigation from "./FormNavigation";

const CampaignForm = () => {
  const {
    currentStep,
    setCurrentStep,
    showSuccessModal,
    setShowSuccessModal,
    uploadedImage,
    isUploading,
    formData,
    setFormData,
    handleImageUpload,
    handleSubmit,
  } = useCampaignForm();

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="space-y-6">
      <FormProgress currentStep={currentStep} steps={steps} />

      <div className="min-h-[400px]">
        <CampaignFormContent
          currentStep={currentStep}
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