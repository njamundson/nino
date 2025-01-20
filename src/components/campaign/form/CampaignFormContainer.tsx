import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import FormProgress from "../FormProgress";
import FormNavigation from "../FormNavigation";
import BasicInfo from "../steps/BasicInfo";
import Requirements from "../steps/Requirements";
import Compensation from "../steps/Compensation";
import ImageUpload from "../ImageUpload";
import SuccessModal from "../SuccessModal";

const steps = [
  {
    title: "Basic Information",
    description: "Add campaign details and timeline",
  },
  {
    title: "Requirements",
    description: "Set campaign requirements and deliverables",
  },
  {
    title: "Compensation",
    description: "Define payment and compensation details",
  },
  {
    title: "Campaign Image",
    description: "Upload your campaign image",
  },
];

const CampaignFormContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    startDate: "",
    endDate: "",
    requirements: [""],
    deliverables: [""],
    paymentDetails: "",
    compensationDetails: "",
  });

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("campaign-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("campaign-images")
        .getPublicUrl(fileName);

      setUploadedImage(publicUrl);
      toast({
        description: "Image uploaded successfully",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
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
    try {
      // Get the current user's brand ID
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No authenticated user");

      const { data: brandData, error: brandError } = await supabase
        .from("brands")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (brandError) throw brandError;
      if (!brandData) throw new Error("No brand found for user");

      const { error } = await supabase.from("opportunities").insert({
        brand_id: brandData.id,
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

      if (error) throw error;

      setIsSuccessModalOpen(true);
    } catch (error) {
      console.error("Error creating campaign:", error);
      toast({
        title: "Error",
        description: "Failed to create campaign. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStep = () => {
    const stepContent = (() => {
      switch (currentStep) {
        case 0:
          return <BasicInfo formData={formData} setFormData={setFormData} />;
        case 1:
          return <Requirements formData={formData} setFormData={setFormData} />;
        case 2:
          return <Compensation formData={formData} setFormData={setFormData} />;
        case 3:
          return (
            <ImageUpload
              uploadedImage={uploadedImage}
              isUploading={isUploading}
              onImageUpload={handleImageUpload}
            />
          );
        default:
          return null;
      }
    })();

    return (
      <div className="py-6">
        {stepContent}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <FormProgress currentStep={currentStep} steps={steps} />
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
        {renderStep()}
        <FormNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onBack={handleBack}
          onNext={handleNext}
          onSubmit={handleSubmit}
        />
      </div>
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onOpenChange={setIsSuccessModalOpen}
      />
    </div>
  );
};

export default CampaignFormContainer;