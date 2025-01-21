import { useBrandOnboarding } from "@/hooks/useBrandOnboarding";
import BrandBasicInfoStep from "./brand/BrandBasicInfoStep";
import BrandDetailsStep from "./brand/BrandDetailsStep";
import BrandSocialStep from "./brand/BrandSocialStep";
import BrandOnboardingProgress from "./brand/BrandOnboardingProgress";
import BrandOnboardingNavigation from "./brand/BrandOnboardingNavigation";
import AccountManagersStep from "./brand/managers/AccountManagersStep";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import BrandOnboardingContainer from "./brand/BrandOnboardingContainer";
import { BrandOnboardingProps } from "@/types/brand";

const BrandOnboarding = ({
  currentStep,
  setCurrentStep,
  profileImage,
  brandData,
  updateField,
  setProfileImage,
  handleNext,
  handleBack,
  handleSubmit
}: BrandOnboardingProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const getCurrentStep = () => {
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
      {getCurrentStep()}
      <BrandOnboardingNavigation
        currentStep={currentStep}
        onBack={handleBack}
        onNext={currentStep === 'managers' ? handleSubmit : handleNext}
      />
    </BrandOnboardingContainer>
  );
};

export default BrandOnboarding;