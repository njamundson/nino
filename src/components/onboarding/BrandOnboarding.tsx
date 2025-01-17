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
  const {
    currentStep,
    setCurrentStep,
    profileImage,
    brandData,
    updateField,
    setProfileImage,
    handleNext,
    handleBack,
  } = useBrandOnboarding();

  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BrandBasicInfoStep
            profileImage={profileImage}
            brandData={brandData}
            onUpdateField={updateField}
            onUpdateImage={setProfileImage}
          />
        );
      case 'details':
        return (
          <BrandDetailsStep
            brandData={brandData}
            onUpdateField={updateField}
          />
        );
      case 'social':
        return (
          <BrandSocialStep
            brandData={brandData}
            onUpdateField={updateField}
          />
        );
      case 'managers':
        return <AccountManagersStep />;
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