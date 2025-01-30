import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CreatorData, CreatorType } from "@/types/creator";
import { supabase } from "@/integrations/supabase/client";

export const useCreatorOnboarding = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'basic' | 'professional' | 'social'>('basic');
  const [creatorData, setCreatorData] = useState<CreatorData>({
    id: crypto.randomUUID(),
    user_id: "",
    first_name: "",
    last_name: "",
    bio: "",
    specialties: [],
    instagram: "",
    website: "",
    location: "",
    profile_image_url: "",
    creator_type: "Content Creator",
  });

  const updateField = (field: keyof CreatorData, value: any) => {
    setCreatorData(prev => ({ ...prev, [field]: value }));
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
      if (!creatorData.creator_type || creatorData.specialties.length === 0) {
        toast({
          title: "Required Fields Missing",
          description: "Please select your creator type and at least one specialty.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep('social');
    }
  };

  const handleBack = () => {
    if (currentStep === 'social') {
      setCurrentStep('professional');
    } else if (currentStep === 'professional') {
      setCurrentStep('basic');
    }
  };

  const handleComplete = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        throw new Error("No authenticated session");
      }

      const { error } = await supabase
        .from('creators')
        .update({
          bio: creatorData.bio,
          location: creatorData.location,
          instagram: creatorData.instagram,
          website: creatorData.website,
          specialties: creatorData.specialties,
          creator_type: creatorData.creator_type,
          profile_image_url: creatorData.profile_image_url,
          onboarding_completed: true,
          first_name: creatorData.first_name,
          last_name: creatorData.last_name
        })
        .eq('user_id', session.user.id);

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