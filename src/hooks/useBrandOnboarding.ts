import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { BrandData } from "@/types/brand";

export const useBrandOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'basic' | 'details' | 'social' | 'managers'>('basic');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [brandData, setBrandData] = useState<BrandData>({
    company_name: "",
    brand_type: "hotel",
    description: "",
    website: null,
    instagram: null,
    location: "",
    phone_number: null,
    support_email: null,
    sms_notifications_enabled: false,
    two_factor_enabled: false,
  });

  const updateField = (field: keyof BrandData, value: string) => {
    setBrandData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep === 'basic') {
      if (!brandData.company_name || !brandData.support_email) {
        toast({
          title: "Required Fields Missing",
          description: "Please fill in all required fields.",
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

  const handleComplete = () => {
    // Store brand data in localStorage
    localStorage.setItem('brandData', JSON.stringify({
      ...brandData,
      profileImage,
      onboardingCompleted: true
    }));

    toast({
      title: "Success!",
      description: "Your brand profile has been created.",
    });

    // Navigate to brand dashboard
    navigate("/brand/dashboard");
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
    handleComplete,
  };
};