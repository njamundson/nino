import { useState } from 'react';
import { CreatorData, CreatorType } from '@/types/creator';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';

type OnboardingStep = 'basic' | 'professional' | 'social';

export const useCreatorOnboarding = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('basic');
  const { toast } = useToast();
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
    if (currentStep === 'basic') {
      if (!creatorData.display_name || !creatorData.bio || !creatorData.location) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return false;
      }
      setCurrentStep('professional');
    } else if (currentStep === 'professional') {
      if (!creatorData.creator_type || creatorData.specialties.length === 0) {
        toast({
          title: "Missing Information",
          description: "Please select your creator type and at least one specialty",
          variant: "destructive",
        });
        return false;
      }
      setCurrentStep('social');
    }
    return true;
  };

  const handleBack = () => {
    if (currentStep === 'professional') {
      setCurrentStep('basic');
    } else if (currentStep === 'social') {
      setCurrentStep('professional');
    }
  };

  const handleComplete = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No user found');

      const { error } = await supabase
        .from('creators')
        .insert({
          user_id: user.id,
          display_name: creatorData.display_name,
          bio: creatorData.bio,
          location: creatorData.location,
          specialties: creatorData.specialties,
          creator_type: creatorData.creator_type,
          instagram: creatorData.instagram,
          website: creatorData.website,
          profile_image_url: creatorData.profile_image_url,
          onboarding_completed: true
        });

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
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