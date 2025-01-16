import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";

export const useBrandOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'basic' | 'details' | 'social'>('basic');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [brandData, setBrandData] = useState<BrandData>({
    brandName: "",
    brandEmail: "",
    brandBio: "",
    homeLocation: "",
    instagram: "",
    website: "",
    location: "",
    brandType: "hotel",
  });

  const updateField = (field: keyof BrandData, value: string) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep === 'basic') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('social');
    } else {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          toast({
            title: "Error",
            description: "No authenticated user found.",
            variant: "destructive",
          });
          return;
        }

        const { error: brandError } = await supabase.from('brands').insert({
          user_id: user.id,
          company_name: brandData.brandName,
          description: brandData.brandBio,
          website: brandData.website,
          instagram: brandData.instagram,
          location: brandData.location,
          brand_type: brandData.brandType,
        });

        if (brandError) {
          console.error("Error creating brand:", brandError);
          toast({
            title: "Error",
            description: "Failed to create brand profile. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success!",
          description: "Your brand profile has been created.",
        });

        // Redirect to brand dashboard after successful creation
        navigate("/brand/dashboard");
      } catch (error) {
        console.error("Error in brand creation:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 'social') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('basic');
    } else {
      navigate("/onboarding");
    }
  };

  return {
    currentStep,
    profileImage,
    brandData,
    updateField,
    setProfileImage,
    handleNext,
    handleBack,
  };
};