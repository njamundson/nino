import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { CreatorProfile, OnboardingStep } from "@/types/creator";
import BasicInfoStep from "./creator/BasicInfoStep";
import SocialLinksStep from "./creator/SocialLinksStep";
import ProfessionalInfoStep from "./creator/ProfessionalInfoStep";
import PaymentStep from "./creator/PaymentStep";

const CreatorOnboarding = () => {
  const navigate = useNavigate();
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

  const updateField = (field: keyof CreatorProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const updateImage = (image: string | null) => {
    setProfile((prev) => ({ ...prev, profileImage: image }));
  };

  const updateSkills = (skills: string[]) => {
    setProfile((prev) => ({ ...prev, skills }));
  };

  const steps: { [key in OnboardingStep]: string } = {
    basic: "Basic Information",
    social: "Social Links",
    professional: "Professional Details",
    payment: "Choose Plan",
  };

  const getStepProgress = () => {
    const stepOrder: OnboardingStep[] = ["basic", "social", "professional", "payment"];
    const currentIndex = stepOrder.indexOf(currentStep);
    return ((currentIndex + 1) / stepOrder.length) * 100;
  };

  const handleNext = () => {
    if (currentStep === "basic") setCurrentStep("social");
    else if (currentStep === "social") setCurrentStep("professional");
    else if (currentStep === "professional") setCurrentStep("payment");
    else navigate("/welcome");
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
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-nino-primary rounded-full transition-all duration-300"
            style={{ width: `${getStepProgress()}%` }}
          />
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-medium text-nino-text">
            {steps[currentStep]}
          </h1>
          <p className="text-nino-gray">Complete your creator profile</p>
        </div>

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
            />
          )}

          {currentStep === "social" && (
            <SocialLinksStep
              instagram={profile.instagram}
              website={profile.website}
              onUpdateField={updateField}
            />
          )}

          {currentStep === "professional" && (
            <ProfessionalInfoStep
              creatorType={profile.creatorType}
              skills={profile.skills}
              onUpdateField={updateField}
              onUpdateSkills={updateSkills}
            />
          )}

          {currentStep === "payment" && <PaymentStep />}
        </div>

        <div className="flex justify-between pt-4">
          {currentStep !== "payment" && (
            <Button
              onClick={handleBack}
              variant="outline"
              className="text-nino-gray hover:bg-white"
            >
              Back
            </Button>
          )}
          {currentStep !== "payment" && (
            <Button
              onClick={handleNext}
              className="bg-nino-primary hover:bg-nino-primary/90 text-white"
            >
              Next
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CreatorOnboarding;