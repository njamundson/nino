import { useState } from "react";
import { CreatorData, CreatorType } from "@/types/creator";

export const useCreatorOnboarding = () => {
  const [currentStep, setCurrentStep] = useState<'basic' | 'professional' | 'social'>('basic');
  const [creatorData, setCreatorData] = useState<CreatorData>({
    id: '',
    user_id: '',
    display_name: '',
    bio: '',
    location: '',
    specialties: [],
    instagram: '',
    website: '',
    profile_image_url: null,
    creator_type: 'solo',
  });

  const updateField = (field: keyof CreatorData, value: any) => {
    setCreatorData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    switch (currentStep) {
      case 'basic':
        setCurrentStep('professional');
        break;
      case 'professional':
        setCurrentStep('social');
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'professional':
        setCurrentStep('basic');
        break;
      case 'social':
        setCurrentStep('professional');
        break;
      default:
        break;
    }
  };

  const handleComplete = async () => {
    try {
      // Prepare the data for submission
      const submissionData = {
        ...creatorData,
        creator_type: creatorData.creator_type,
        profile_image_url: creatorData.profile_image_url,
      };

      // Return true to indicate successful completion
      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      return false;
    }
  };

  return {
    currentStep,
    creatorData,
    updateField,
    handleNext,
    handleBack,
    handleComplete,
  };
};