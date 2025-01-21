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
import { supabase } from "@/integrations/supabase/client";

type OnboardingStep = "basic" | "details" | "social" | "managers";

const BrandOnboarding = ({
  currentStep,
  setCurrentStep,
  profileImage,
  brandData,
  updateField,
  setProfileImage,
  handleNext,
  handleBack,
  handleSubmit: propHandleSubmit
}: BrandOnboardingProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("No authenticated user found");
      }

      // Update the profile to mark onboarding as completed
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Call the original submit handler
      await propHandleSubmit();

      toast({
        title: "Onboarding completed",
        description: "Welcome to NINO!",
      });
      
      navigate('/brand/dashboard');
    } catch (error: any) {
      console.error('Error completing onboarding:', error);
      toast({
        variant: "destructive",
        title: "Error completing onboarding",
        description: error.message || "Please try again.",
      });
    }
  };

  const getCurrentStep = () => {
    switch (currentStep as OnboardingStep) {
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
      <BrandOnboardingProgress currentStep={currentStep as OnboardingStep} />
      {getCurrentStep()}
      <BrandOnboardingNavigation
        currentStep={currentStep as OnboardingStep}
        onBack={handleBack}
        onNext={currentStep === 'managers' ? handleSubmit : handleNext}
      />
    </BrandOnboardingContainer>
  );
};

export default BrandOnboarding;