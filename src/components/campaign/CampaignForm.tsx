import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImagePlus, Loader2 } from "lucide-react";
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
    imageUrl: "",
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

      setFormData(prev => ({ ...prev, imageUrl: publicUrl }));
      
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
    if (!formData.imageUrl) {
      toast({
        title: "Required Field",
        description: "Please upload an image for your campaign",
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
          image_url: formData.imageUrl,
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

      <div className="space-y-8">
        <div className="space-y-4">
          <Label htmlFor="campaign-image" className="text-base">Campaign Image</Label>
          <div className="flex items-start space-x-4">
            {formData.imageUrl ? (
              <div className="relative w-40 h-40 rounded-lg overflow-hidden">
                <img 
                  src={formData.imageUrl} 
                  alt="Campaign preview" 
                  className="w-full h-full object-cover"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="absolute bottom-2 right-2"
                  onClick={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                >
                  Change
                </Button>
              </div>
            ) : (
              <Label
                htmlFor="campaign-image"
                className="flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer transition-colors"
              >
                {isUploading ? (
                  <div className="flex flex-col items-center space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                    <span className="text-sm text-gray-500">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <ImagePlus className="w-8 h-8 text-gray-400" />
                    <span className="mt-2 text-sm text-gray-500">Upload image</span>
                  </>
                )}
              </Label>
            )}
            <Input
              id="campaign-image"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading}
            />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium text-gray-700">Campaign Image Requirements</p>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                <li>Minimum dimensions: 800x600 pixels</li>
                <li>Maximum file size: 5MB</li>
                <li>Supported formats: JPG, PNG</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="min-h-[400px] py-4">
          <CurrentStepComponent
            formData={formData}
            setFormData={setFormData}
          />
        </div>
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