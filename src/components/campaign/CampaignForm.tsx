import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Camera, ImagePlus } from "lucide-react";
import BasicInfo from "./steps/BasicInfo";
import Requirements from "./steps/Requirements";
import Compensation from "./steps/Compensation";
import SuccessModal from "./SuccessModal";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

type Step = {
  title: string;
  description: string;
  component: React.ComponentType<any>;
};

const steps: Step[] = [
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

  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

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

  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
          {steps[currentStep].title}
        </h2>
        <p className="text-lg text-gray-500">
          {steps[currentStep].description}
        </p>
      </div>

      <Progress value={progress} className="h-1 bg-gray-100" />

      {currentStep === 0 && (
        <div className="flex flex-col items-center space-y-4 py-12">
          <div className="relative group cursor-pointer transition-all duration-300">
            <div 
              className={`
                w-80 h-56 rounded-2xl border-2 border-dashed 
                flex items-center justify-center bg-white
                transition-all duration-300 ease-in-out
                group-hover:border-gray-400 group-hover:bg-gray-50
                ${uploadedImage ? 'border-green-500 shadow-lg' : 'border-gray-200'}
                ${isUploading ? 'animate-pulse' : ''}
              `}
            >
              {uploadedImage ? (
                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                  <img 
                    src={uploadedImage} 
                    alt="Campaign" 
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <ImagePlus className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3 px-6 transition-all duration-300 group-hover:scale-105">
                  <Camera className="mx-auto h-12 w-12 text-gray-300 group-hover:text-gray-400 transition-colors duration-300" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Upload campaign image</p>
                    <p className="text-xs text-gray-500 mt-1">Recommended size: 1200x800px</p>
                  </div>
                </div>
              )}
            </div>
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploading}
            />
          </div>
          {isUploading && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-gray-600 animate-spin" />
              <p className="text-sm text-gray-600 font-medium">Uploading...</p>
            </div>
          )}
        </div>
      )}

      <div className="min-h-[400px] py-4">
        <CurrentStepComponent
          formData={formData}
          setFormData={setFormData}
        />
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-100">
        <Button
          variant="ghost"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="text-gray-600 hover:text-gray-900"
        >
          Back
        </Button>
        
        {currentStep === steps.length - 1 ? (
          <Button 
            onClick={handleSubmit}
            className="bg-black hover:bg-gray-900 text-white px-8"
          >
            Create Campaign
          </Button>
        ) : (
          <Button 
            onClick={handleNext}
            className="bg-black hover:bg-gray-900 text-white px-8"
          >
            Continue
          </Button>
        )}
      </div>

      <SuccessModal 
        isOpen={showSuccessModal} 
        onOpenChange={setShowSuccessModal}
      />
    </div>
  );
};

export default CampaignForm;
