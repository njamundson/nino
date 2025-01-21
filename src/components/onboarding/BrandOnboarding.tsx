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

const BrandOnboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const handleComplete = async () => {
    try {
      // For local development, we'll skip the user check
      // Store brand data in localStorage
      localStorage.setItem('brandData', JSON.stringify({
        ...brandData,
        profileImage,
        onboardingCompleted: true
      }));

      // Navigate to payment step
      navigate("/onboarding/brand/payment");
    } catch (error) {
      console.error('Error in handleComplete:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

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
        onNext={currentStep === 'managers' ? handleComplete : handleNext}
      />
    </BrandOnboardingContainer>
  );
};

export default BrandOnboarding;