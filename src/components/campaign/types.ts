import { FormData } from "./hooks/useCampaignForm";
import { ImageUploadProps } from "./ImageUpload";

export type StepComponentProps = {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
};

export interface Step {
  title: string;
  description: string;
  component: React.ComponentType<StepComponentProps | ImageUploadProps>;
  type: 'form' | 'image';
}