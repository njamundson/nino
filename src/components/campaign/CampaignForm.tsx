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

const steps = [
  {
    title: "Basic Information",
    description: "Let's start with the core details of your project",
    component: BasicInfo,
  },
  {
    title: "Requirements",
    description: "Define what you're looking for",
    component: Requirements,
  },
  {
    title: "Compensation",
    description: "Set your budget and additional perks",
    component: Compensation,
  },
];

const CampaignForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    requirements: [] as string[],
    deliverables: [] as string[],
    paymentDetails: "",
    compensationDetails: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('campaign-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('campaign-images')
        .getPublicUrl(filePath);

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
    if (currentStep === 0 && !uploadedImage) {
      toast({
        title: "Required Field",
        description: "Please upload a campaign image before proceeding",
        variant: "destructive",
      });
      return;
    }
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

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="space-y-10">
      <FormProgress currentStep={currentStep} steps={steps} />

      {currentStep === 0 && (
        <ImageUpload
          uploadedImage={uploadedImage}
          isUploading={isUploading}
          onImageUpload={handleImageUpload}
        />
      )}

      <div className="min-h-[400px] py-4">
        <CurrentStepComponent
          formData={formData}
          setFormData={setFormData}
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