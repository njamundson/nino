import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreatorProfile, OnboardingStep } from "@/types/creator";
import { useToast } from "@/hooks/use-toast";
import BasicInfoStep from "./creator/BasicInfoStep";
import SocialLinksStep from "./creator/SocialLinksStep";
import ProfessionalInfoStep from "./creator/ProfessionalInfoStep";
import PaymentStep from "./creator/PaymentStep";
import OnboardingProgress from "./creator/progress/OnboardingProgress";
import OnboardingNavigation from "./creator/navigation/OnboardingNavigation";

const CreatorOnboarding = () => {
  const navigate = useNavigate();
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

  const validateBasicInfo = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!profile.firstName.trim()) newErrors.firstName = "First name is required";
    if (!profile.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!profile.bio.trim()) newErrors.bio = "Bio is required";
    if (!profile.location.trim()) newErrors.location = "Location is required";
    if (!profile.profileImage) newErrors.profileImage = "Profile image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateSocialLinks = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!profile.instagram.trim()) newErrors.instagram = "Instagram handle is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateProfessionalInfo = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!profile.creatorType) newErrors.creatorType = "Creator type is required";
    if (profile.skills.length === 0) newErrors.skills = "At least one skill is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    let isValid = false;

    if (currentStep === "basic") {
      isValid = validateBasicInfo();
      if (isValid) setCurrentStep("social");
    } else if (currentStep === "social") {
      isValid = validateSocialLinks();
      if (isValid) setCurrentStep("professional");
    } else if (currentStep === "professional") {
      isValid = validateProfessionalInfo();
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

  const handleBack = () => {
    if (currentStep === "payment") setCurrentStep("professional");
    else if (currentStep === "professional") setCurrentStep("social");
    else if (currentStep === "social") setCurrentStep("basic");
    else navigate("/onboarding");
  };

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        <OnboardingProgress currentStep={currentStep} />

        <div className="bg-white p-6 rounded-xl shadow-sm">
          {currentStep === "basic" && (
            <BasicInfoStep
              profileImage={profile.profileImage}
              firstName={profile.firstName}
              lastName={profile.lastName}
              bio={profile.bio}
              location={profile.location}
              onUpdateField={updateField}
              onUpdateImage={updateImage}
              errors={errors}
            />
          )}

          {currentStep === "social" && (
            <SocialLinksStep
              instagram={profile.instagram}
              website={profile.website}
              onUpdateField={updateField}
              errors={errors}
            />
          )}

          {currentStep === "professional" && (
            <ProfessionalInfoStep
              creatorType={profile.creatorType}
              skills={profile.skills}
              onUpdateField={updateField}
              onUpdateSkills={updateSkills}
              errors={errors}
            />
          )}

          {currentStep === "payment" && <PaymentStep />}
        </div>

        <OnboardingNavigation
          currentStep={currentStep}
          onBack={handleBack}
          onNext={handleNext}
        />
      </motion.div>
    </div>
  );
};

export default CreatorOnboarding;