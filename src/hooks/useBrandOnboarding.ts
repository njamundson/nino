import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
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
      // Validate basic info before proceeding
      if (!brandData.brandName || !brandData.brandEmail) {
        toast({
          title: "Missing Information",
          description: "Please fill out brand name and email",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep('details');
    } else if (currentStep === 'details') {
      setCurrentStep('social');
    } else if (currentStep === 'social') {
      setCurrentStep('managers');
    } else {
      try {
        console.log("Starting brand creation with data:", brandData);
        
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          console.error("Error getting user:", userError);
          toast({
            title: "Authentication Error",
            description: "Please sign in again",
            variant: "destructive",
          });
          return;
        }

        if (!user) {
          console.error("No user found");
          toast({
            title: "Error",
            description: "No authenticated user found.",
            variant: "destructive",
          });
          return;
        }

        console.log("Got user:", user.id);

        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .insert({
            user_id: user.id,
            company_name: brandData.brandName,
            description: brandData.brandBio,
            website: brandData.website,
            instagram: brandData.instagram,
            location: brandData.location,
            brand_type: brandData.brandType,
          })
          .select()
          .maybeSingle();

        if (brandError) {
          console.error("Error creating brand:", brandError);
          toast({
            title: "Error",
            description: "Failed to create brand profile. Please try again.",
            variant: "destructive",
          });
          return;
        }

        if (!brand) {
          console.error("No brand data returned after insert");
          toast({
            title: "Error",
            description: "Brand profile creation failed. Please try again.",
            variant: "destructive",
          });
          return;
        }

        console.log("Brand created successfully:", brand);

        toast({
          title: "Success!",
          description: "Your brand profile has been created.",
        });

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
    profileImage,
    brandData,
    updateField,
    setProfileImage,
    handleNext,
    handleBack,
  };
};