import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import BasicInfoStep from "./BasicInfoStep";
import ProfessionalInfoStep from "./ProfessionalInfoStep";
import SocialLinksStep from "./SocialLinksStep";
import CreatorOnboardingProgress from "./CreatorOnboardingProgress";
import { useCreatorOnboarding } from "@/hooks/useCreatorOnboarding";
import OnboardingNavigation from "./navigation/OnboardingNavigation";

interface CreatorOnboardingFormProps {
  onComplete: (data: any) => Promise<void>;
}

const CreatorOnboardingForm = ({ onComplete }: CreatorOnboardingFormProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentStep,
    creatorData,
    handleNext,
    handleBack,
    handleComplete
  } = useCreatorOnboarding();

  const onSubmit = async () => {
    try {
      await handleComplete();
      await onComplete(creatorData);
      toast({
        title: "Success!",
        description: "Your creator profile has been created.",
      });
      navigate("/creator/welcome");
    } catch (error) {
      console.error("Error completing onboarding:", error);
      toast({
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
        variant: "destructive",
      });
    }
  };

  const getCurrentStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BasicInfoStep
            creatorData={creatorData}
          />
        );
      case 'professional':
        return (
          <ProfessionalInfoStep
            creatorData={creatorData}
          />
        );
      case 'social':
        return (
          <SocialLinksStep
            creatorData={creatorData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <CreatorOnboardingProgress currentStep={currentStep} />
      
      <div className="mt-8 space-y-8">
        {getCurrentStep()}
        
        <OnboardingNavigation
          currentStep={currentStep}
          onBack={handleBack}
          onNext={currentStep === 'social' ? onSubmit : handleNext}
          isLastStep={currentStep === 'social'}
        />
      </div>
    </div>
  );
};

export default CreatorOnboardingForm;