import { useState } from "react";
import BrandBasicInfoStep from "./brand/BrandBasicInfoStep";
import BrandDetailsStep from "./brand/BrandDetailsStep";
import BrandSocialStep from "./brand/BrandSocialStep";
import AccountManagersStep from "./brand/managers/AccountManagersStep";
import BrandOnboardingProgress from "./brand/BrandOnboardingProgress";

type OnboardingStep = "basic" | "details" | "social" | "managers";

const BrandOnboarding = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("basic");

  const handleNext = () => {
    switch (currentStep) {
      case "basic":
        setCurrentStep("details");
        break;
      case "details":
        setCurrentStep("social");
        break;
      case "social":
        setCurrentStep("managers");
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "details":
        setCurrentStep("basic");
        break;
      case "social":
        setCurrentStep("details");
        break;
      case "managers":
        setCurrentStep("social");
        break;
      default:
        break;
    }
  };

  return (
    <div className="min-h-screen bg-nino-bg">
      <BrandOnboardingProgress currentStep={currentStep} />
      
      {currentStep === "basic" && (
        <BrandBasicInfoStep onNext={handleNext} />
      )}
      
      {currentStep === "details" && (
        <BrandDetailsStep onNext={handleNext} onBack={handleBack} />
      )}
      
      {currentStep === "social" && (
        <BrandSocialStep onNext={handleNext} onBack={handleBack} />
      )}

      {currentStep === "managers" && (
        <AccountManagersStep />
      )}
    </div>
  );
};

export default BrandOnboarding;