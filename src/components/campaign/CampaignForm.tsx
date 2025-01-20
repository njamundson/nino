import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BasicInfo from "./steps/BasicInfo";
import Requirements from "./steps/Requirements";
import Compensation from "./steps/Compensation";
import SuccessModal from "./SuccessModal";
import ImageUpload from "./ImageUpload";
import FormProgress from "./FormProgress";
import FormNavigation from "./FormNavigation";

interface FormData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  requirements: string[];
  deliverables: string[];
  paymentDetails: string;
  compensationDetails: string;
}

type StepComponent = typeof BasicInfo | typeof Requirements | typeof Compensation | typeof ImageUpload;

interface Step {
  title: string;
  description: string;
  component: StepComponent;
}

const steps: Step[] = [
  {
    title: "Basic Information",
    description: "Let's start with the core details",
    component: BasicInfo,
  },
  {
    title: "Requirements",
    description: "Define what you're looking for",
    component: Requirements,
  },
  {
    title: "Compensation",
    description: "Set your budget and perks",
    component: Compensation,
  },
  {
    title: "Campaign Image",
    description: "Add a visual to your campaign",
    component: ImageUpload,
  },
];

const CampaignForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    requirements: [],
    deliverables: [],
    paymentDetails: "",
    compensationDetails: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      console.log("Starting image upload...");
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      console.log("Uploading to path:", filePath);

      const { error: uploadError, data } = await supabase.storage
        .from('campaign-images')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log("Upload successful, getting public URL...");

      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(filePath);

      console.log("Public URL obtained:", publicUrl);

      setUploadedImage(publicUrl);
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading image:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

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

  const handleSubmit = async () => {
    if (!uploadedImage) {
      toast({
        title: "Required Field",
        description: "Please upload a campaign image before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!brand) throw new Error("Brand not found");

      const { error: insertError } = await supabase
        .from('opportunities')
        .insert({
          brand_id: brand.id,
          title: formData.title,
          description: formData.description,
          location: formData.location,
          start_date: formData.startDate,
          end_date: formData.endDate,
          requirements: formData.requirements,
          deliverables: formData.deliverables,
          payment_details: formData.paymentDetails,
          compensation_details: formData.compensationDetails,
          image_url: uploadedImage,
        });

      if (insertError) throw insertError;

      setShowSuccessModal(true);
      
      setTimeout(() => {
        navigate('/brand/campaigns');
      }, 2000);

    } catch (error) {
      console.error('Error creating campaign:', error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderCurrentStep = () => {
    const CurrentStepComponent = steps[currentStep].component;

    if (CurrentStepComponent === ImageUpload) {
      return (
        <ImageUpload
          uploadedImage={uploadedImage}
          isUploading={isUploading}
          onImageUpload={handleImageUpload}
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

  return (
    <div className="space-y-6">
      <FormProgress currentStep={currentStep} steps={steps} />

      <div className="min-h-[400px]">
        {renderCurrentStep()}
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