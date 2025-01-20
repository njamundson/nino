import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CreatorData } from "@/types/creator";

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
    creatorType: "",
    profile: null
  });

  const updateField = (field: keyof CreatorData, value: any) => {
    console.log('Updating creator field:', field, 'with value:', value);
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

        // First update the profile
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: creatorData.firstName,
            last_name: creatorData.lastName,
          })
          .eq('id', user.id);

        if (profileError) {
          console.error("Error updating profile:", profileError);
          throw profileError;
        }

        // Log the data being saved
        console.log('Saving creator with data:', {
          bio: creatorData.bio,
          instagram: creatorData.instagram,
          website: creatorData.website,
          location: creatorData.location,
          specialties: creatorData.specialties,
          profile_image_url: creatorData.profileImage,
          creator_type: creatorData.creatorType
        });

        // Then update the creator profile with ALL fields including bio
        const { error: creatorError } = await supabase
          .from('creators')
          .update({
            bio: creatorData.bio || null, // Ensure bio is included
            instagram: creatorData.instagram,
            website: creatorData.website,
            location: creatorData.location,
            specialties: creatorData.specialties,
            profile_image_url: creatorData.profileImage,
            creator_type: creatorData.creatorType
          })
          .eq('user_id', user.id);

        if (creatorError) {
          console.error("Error updating creator profile:", creatorError);
          toast({
            title: "Error",
            description: "Failed to update creator profile. Please try again.",
            variant: "destructive",
          });
          return;
        }

        console.log("Creator profile updated successfully");

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