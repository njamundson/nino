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
            profileImage={creatorData.profileImage}
            firstName={creatorData.firstName}
            lastName={creatorData.lastName}
            bio={creatorData.bio}
            location={creatorData.location}
            onUpdateField={(field, value) => handleUpdateField(field, value)}
            onUpdateImage={(image) => handleUpdateField('profileImage', image)}
          />
        );
      case 'professional':
        return (
          <ProfessionalInfoStep
            creatorType={creatorData.creatorType}
            skills={creatorData.specialties}
            onUpdateField={(field, value) => handleUpdateField(field, value)}
            onUpdateSkills={(skills) => handleUpdateField('specialties', skills)}
          />
        );
      case 'social':
        return (
          <SocialLinksStep
            instagram={creatorData.instagram}
            website={creatorData.website}
            onUpdateField={(field, value) => handleUpdateField(field, value)}
          />
        );
      default:
        return null;
    }
  };

  const handleUpdateField = (field: string, value: any) => {
    // Update the field in creatorData
    // This function should be implemented in useCreatorOnboarding
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