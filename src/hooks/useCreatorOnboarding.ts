import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CreatorData, validateInstagramHandle, validateWebsiteUrl } from "@/types/creator";

export const useCreatorOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'basic' | 'professional' | 'social' | 'payment'>('basic');
  const [creatorData, setCreatorData] = useState<CreatorData>({
    id: crypto.randomUUID(),
    firstName: "",
    lastName: "",
    bio: "",
    specialties: [],
    instagram: "",
    website: "",
    location: "",
    profileImage: null,
    creatorType: "solo",
    profile: null
  });

  const validateBasicInfo = (): boolean => {
    if (!creatorData.bio || !creatorData.location) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields before continuing.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateProfessionalInfo = (): boolean => {
    if (!creatorData.creatorType || creatorData.specialties.length === 0) {
      toast({
        title: "Required Fields Missing",
        description: "Please select your creator type and at least one specialty.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const validateSocialInfo = (): boolean => {
    if (creatorData.instagram && !validateInstagramHandle(creatorData.instagram)) {
      toast({
        title: "Invalid Instagram Username",
        description: "Please enter a valid Instagram username.",
        variant: "destructive",
      });
      return false;
    }
    if (creatorData.website && !validateWebsiteUrl(creatorData.website)) {
      toast({
        title: "Invalid Website URL",
        description: "Please enter a valid website URL starting with http:// or https://",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const updateField = (field: keyof CreatorData, value: any) => {
    console.log('Updating creator field:', field, 'with value:', value);
    setCreatorData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep === 'basic') {
      if (!validateBasicInfo()) return;
      setCurrentStep('professional');
    } else if (currentStep === 'professional') {
      if (!validateProfessionalInfo()) return;
      setCurrentStep('social');
    } else if (currentStep === 'social') {
      if (!validateSocialInfo()) return;
      setCurrentStep('payment');
    } else {
      // Mock successful completion
      toast({
        title: "Success!",
        description: "Your creator profile has been created.",
      });
      navigate("/creator/dashboard");
    }
  };

  const handleBack = () => {
    if (currentStep === 'payment') {
      setCurrentStep('social');
    } else if (currentStep === 'social') {
      setCurrentStep('professional');
    } else if (currentStep === 'professional') {
      setCurrentStep('basic');
    } else {
      navigate("/onboarding");
    }
  };

  return {
    currentStep,
    creatorData,
    updateField,
    handleNext,
    handleBack,
  };
};