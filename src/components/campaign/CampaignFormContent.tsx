import { Dispatch, SetStateAction } from "react";
import { steps } from "./config/formSteps";
import ImageUpload from "./ImageUpload";

interface CampaignFormContentProps {
  currentStep: number;
  formData: any;
  setFormData: Dispatch<SetStateAction<any>>;
  uploadedImage: string | null;
  isUploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CampaignFormContent = ({
  currentStep,
  formData,
  setFormData,
  uploadedImage,
  isUploading,
  onImageUpload,
}: CampaignFormContentProps) => {
  const CurrentStepComponent = steps[currentStep].component;

  if (currentStep === steps.length - 1) {
    return (
      <ImageUpload
        uploadedImage={uploadedImage}
        isUploading={isUploading}
        onImageUpload={onImageUpload}
      />
    );
  }

  return (
    <CurrentStepComponent
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default CampaignFormContent;