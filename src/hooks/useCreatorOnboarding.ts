import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { CreatorData } from "@/types/creator";
import { supabase } from "@/integrations/supabase/client";

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

  const updateField = (field: keyof CreatorData, value: any) => {
    setCreatorData(prev => ({ ...prev, [field]: value }));
    localStorage.setItem('creatorData', JSON.stringify({
      ...creatorData,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep === 'basic') {
      if (!creatorData.bio || !creatorData.location) {
        toast({
          title: "Required Fields Missing",
          description: "Please fill in all required fields.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep('professional');
    } else if (currentStep === 'professional') {
      if (!creatorData.creatorType || creatorData.specialties.length === 0) {
        toast({
          title: "Required Fields Missing",
          description: "Please select your creator type and at least one specialty.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep('social');
    } else if (currentStep === 'social') {
      setCurrentStep('payment');
    } else if (currentStep === 'payment') {
      handleComplete();
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

  const handleComplete = async () => {
    try {
      // Get current user session
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No authenticated session found");
      }

      // Create creator profile in the database
      const { error: creatorError } = await supabase
        .from('creators')
        .insert({
          user_id: session.user.id,
          bio: creatorData.bio,
          location: creatorData.location,
          instagram: creatorData.instagram,
          website: creatorData.website,
          specialties: creatorData.specialties,
          creator_type: creatorData.creatorType,
          profile_image_url: creatorData.profileImage,
        });

      if (creatorError) throw creatorError;

      // Store creator data in localStorage
      localStorage.setItem('creatorData', JSON.stringify({
        ...creatorData,
        onboardingCompleted: true
      }));

      toast({
        title: "Success!",
        description: "Your creator profile has been created.",
      });

      // Navigate to creator dashboard
      navigate("/creator/dashboard");
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        variant: "destructive",
        title: "Error creating profile",
        description: error instanceof Error ? error.message : "Please try again.",
      });
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