import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBrandOnboarding } from "@/hooks/useBrandOnboarding";
import BrandOnboardingContainer from "./brand/BrandOnboardingContainer";
import BrandOnboardingProgress from "./brand/BrandOnboardingProgress";
import BrandOnboardingNavigation from "./brand/BrandOnboardingNavigation";
import BrandBasicInfoStep from "./brand/BrandBasicInfoStep";
import BrandDetailsStep from "./brand/BrandDetailsStep";
import BrandSocialStep from "./brand/BrandSocialStep";
import AccountManagersStep from "./brand/AccountManagersStep";

const BrandOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const { brandData, updateBrandData, handleSubmit } = useBrandOnboarding();

  const handleNext = async () => {
    if (currentStep === 4) {
      await handleSubmit();
      navigate("/brand/dashboard");
      return;
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentStep === 1) {
      navigate("/onboarding");
      return;
    }
    setCurrentStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BrandBasicInfoStep
            brandData={brandData}
            updateBrandData={updateBrandData}
          />
        );
      case 2:
        return (
          <BrandDetailsStep
            brandData={brandData}
            updateBrandData={updateBrandData}
          />
        );
      case 3:
        return (
          <BrandSocialStep
            brandData={brandData}
            updateBrandData={updateBrandData}
          />
        );
      case 4:
        return (
          <AccountManagersStep
            brandData={brandData}
            updateBrandData={updateBrandData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <BrandOnboardingContainer>
      <BrandOnboardingProgress currentStep={currentStep} />
      {renderStep()}
      <BrandOnboardingNavigation
        currentStep={currentStep}
        onNext={handleNext}
        onBack={handleBack}
      />
    </BrandOnboardingContainer>
  );
};

export default BrandOnboarding;