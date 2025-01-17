import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData } from "@/types/creator";

type OnboardingStep = 'basic' | 'professional' | 'social' | 'payment';

export const useCreatorOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('basic');
  const [creatorData, setCreatorData] = useState<CreatorData>({
    id: crypto.randomUUID(),
    firstName: "",
    lastName: "",
    bio: "",
    specialties: [],
    instagram: "",
    website: "",
    location: "",
    paymentDetails: "",
    profile: null,
    profileImage: null // Initialize profileImage
  });

  const updateField = (field: keyof CreatorData, value: any) => {
    console.log('Updating field:', field, 'with value:', value);
    setCreatorData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = async () => {
    if (currentStep === 'basic') {
      setCurrentStep('professional');
    } else if (currentStep === 'professional') {
      setCurrentStep('social');
    } else if (currentStep === 'social') {
      setCurrentStep('payment');
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

        // First get the profile ID
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', user.id)
          .single();

        if (!profile) {
          toast({
            title: "Error",
            description: "Profile not found.",
            variant: "destructive",
          });
          return;
        }

        const { error: creatorError } = await supabase.from('creators').insert({
          user_id: user.id,
          profile_id: profile.id,
          bio: creatorData.bio,
          instagram: creatorData.instagram,
          website: creatorData.website,
          location: creatorData.location,
          specialties: creatorData.specialties,
          profile_image_url: creatorData.profileImage // Save the profile image URL
        });

        if (creatorError) {
          console.error("Error creating creator profile:", creatorError);
          toast({
            title: "Error",
            description: "Failed to create creator profile. Please try again.",
            variant: "destructive",
          });
          return;
        }

        toast({
          title: "Success!",
          description: "Your creator profile has been created.",
        });

        navigate("/creator/dashboard");
      } catch (error) {
        console.error("Error in creator creation:", error);
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
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