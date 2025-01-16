import { useState } from "react";
import { CreatorProfile, OnboardingStep } from "@/types/creator";
import { useToast } from "@/hooks/use-toast";
import { validateBasicInfo, validateSocialLinks, validateProfessionalInfo } from "@/utils/validations";

export const useCreatorOnboarding = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("basic");
  const [profile, setProfile] = useState<CreatorProfile>({
    firstName: "",
    lastName: "",
    bio: "",
    profileImage: null,
    instagram: "",
    website: "",
    creatorType: "",
    skills: [],
    location: "",
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const updateField = (field: keyof CreatorProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const updateImage = (image: string | null) => {
    setProfile((prev) => ({ ...prev, profileImage: image }));
    setErrors((prev) => ({ ...prev, profileImage: "" }));
  };

  const updateSkills = (skills: string[]) => {
    setProfile((prev) => ({ ...prev, skills }));
    setErrors((prev) => ({ ...prev, skills: "" }));
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === "basic") {
      const newErrors = validateBasicInfo(profile);
      setErrors(newErrors);
      isValid = Object.keys(newErrors).length === 0;
      if (isValid) setCurrentStep("social");
    } else if (currentStep === "social") {
      const newErrors = validateSocialLinks(profile);
      setErrors(newErrors);
      isValid = Object.keys(newErrors).length === 0;
      if (isValid) setCurrentStep("professional");
    } else if (currentStep === "professional") {
      const newErrors = validateProfessionalInfo(profile);
      setErrors(newErrors);
      isValid = Object.keys(newErrors).length === 0;
      if (isValid) setCurrentStep("payment");
    }

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Please fill in all required fields",
        description: "Some required information is missing or invalid.",
      });
    }
  };

  const handleBack = (navigate: (path: string) => void) => {
    if (currentStep === "payment") setCurrentStep("professional");
    else if (currentStep === "professional") setCurrentStep("social");
    else if (currentStep === "social") setCurrentStep("basic");
    else navigate("/onboarding");
  };

  return {
    currentStep,
    profile,
    errors,
    updateField,
    updateImage,
    updateSkills,
    handleNext,
    handleBack,
  };
};