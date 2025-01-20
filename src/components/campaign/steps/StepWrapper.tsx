import { Step } from "../types";
import { FormData } from "../hooks/useCampaignForm";
import { ImageUploadProps } from "../ImageUpload";

interface StepWrapperProps {
  currentStep: number;
  steps: Step[];
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  uploadedImage: string | null;
  isUploading: boolean;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const StepWrapper = ({
  currentStep,
  steps,
  formData,
  setFormData,
  uploadedImage,
  isUploading,
  onImageUpload
}: StepWrapperProps) => {
  const CurrentStep = steps[currentStep].component;
  const stepType = steps[currentStep].type;

  if (stepType === 'image') {
    return (
      <CurrentStep
        uploadedImage={uploadedImage}
        isUploading={isUploading}
        onImageUpload={onImageUpload}
      />
    );
  }

  return (
    <CurrentStep
      formData={formData}
      setFormData={setFormData}
    />
  );
};

export default StepWrapper;