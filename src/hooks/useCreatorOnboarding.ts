import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { CreatorData } from "@/types/creator";
import { supabase } from "@/integrations/supabase/client";

export const useCreatorOnboarding = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<'basic' | 'professional' | 'social'>('basic');
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
    profile: null,
    profile_image_url: null
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
      if (!creatorData.creatorType || creatorData.specialties.length === 0) {
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
        throw new Error("No authenticated session found");
      }

      // First check if creator profile exists
      const { data: existingCreator, error: checkError } = await supabase
        .from('creators')
        .select('id')
        .eq('user_id', session.user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
        throw checkError;
      }

      if (existingCreator) {
        // Update existing creator profile
        const { error: updateError } = await supabase
          .from('creators')
          .update({
            bio: creatorData.bio,
            location: creatorData.location,
            instagram: creatorData.instagram,
            website: creatorData.website,
            specialties: creatorData.specialties,
            creator_type: creatorData.creatorType,
            profile_image_url: creatorData.profileImage,
            onboarding_completed: true
          })
          .eq('user_id', session.user.id);

        if (updateError) throw updateError;
      } else {
        // Create new creator profile
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
            onboarding_completed: true
          });

        if (creatorError) throw creatorError;
      }

      // Update the profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: creatorData.firstName,
          last_name: creatorData.lastName,
        })
        .eq('id', session.user.id);

      if (profileError) throw profileError;

      return true;
    } catch (error) {
      console.error('Error completing onboarding:', error);
      throw error;
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