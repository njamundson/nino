import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { BrandData } from "@/types/brand";

export const useBrandOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'basic' | 'details' | 'social' | 'managers'>('basic');
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

        // First check if the user already has a brand
        const { data: existingBrand } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (existingBrand) {
          // If brand exists, update it
          const { error: updateError } = await supabase
            .from('brands')
            .update({
              company_name: brandData.brandName,
              description: brandData.brandBio,
              website: brandData.website,
              instagram: brandData.instagram,
              location: brandData.homeLocation,
              brand_type: brandData.brandType,
              profile_image_url: profileImage,
            })
            .eq('id', existingBrand.id);

          if (updateError) throw updateError;
        } else {
          // Create new brand profile if it doesn't exist
          const { error: brandError } = await supabase
            .from('brands')
            .insert({
              user_id: user.id,
              company_name: brandData.brandName,
              description: brandData.brandBio,
              website: brandData.website,
              instagram: brandData.instagram,
              location: brandData.homeLocation,
              brand_type: brandData.brandType,
              profile_image_url: profileImage,
            });

          if (brandError) throw brandError;
        }

        console.log("Brand data saved successfully:", {
          ...brandData,
          profileImage,
        });
      } catch (error) {
        console.error("Error in brand creation:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('social');
    } else if (currentStep === 'social') {
      setCurrentStep('managers');
    }
  };

  const handleBack = () => {
    if (currentStep === 'managers') {
      setCurrentStep('social');
    } else if (currentStep === 'social') {
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('basic');
    } else {
      navigate("/onboarding");
    }
  };

  return {
    currentStep,
    setCurrentStep,
    profileImage,
    brandData,
    updateField,
    setProfileImage,
    handleNext,
    handleBack,
  };
};