import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import BasicInfoStep from "./BasicInfoStep";
import ProfessionalInfoStep from "./ProfessionalInfoStep";
import SocialLinksStep from "./SocialLinksStep";
import CreatorOnboardingProgress from "./CreatorOnboardingProgress";
import { useCreatorOnboarding } from "@/hooks/useCreatorOnboarding";

const CreatorOnboardingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentStep,
    creatorData,
    updateField,
    handleNext,
    handleBack,
    handleComplete
  } = useCreatorOnboarding();

  const onComplete = async () => {
    try {
      await handleComplete();
      toast({
        title: "Success!",
        description: "Your creator profile has been created.",
      });
      navigate("/creator/dashboard", { replace: true });
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to complete onboarding. Please try again.",
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BasicInfoStep
            profileImage={creatorData.profileImage}
            firstName={creatorData.firstName}
            lastName={creatorData.lastName}
            bio={creatorData.bio}
            location={creatorData.location}
            onUpdateField={updateField}
            onUpdateImage={(image: string | null) => {
              updateField('profileImage', image);
            }}
          />
        );
      case 'professional':
        return (
          <ProfessionalInfoStep
            creatorType={creatorData.creatorType}
            skills={creatorData.specialties}
            onUpdateField={updateField}
            onUpdateSkills={(skills: string[]) => updateField('specialties', skills)}
          />
        );
      case 'social':
        return (
          <SocialLinksStep
            instagram={creatorData.instagram}
            website={creatorData.website}
            onUpdateField={updateField}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-8 md:p-12">
      <div className="w-full max-w-md space-y-10 bg-white p-8 md:p-10 rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.08)] backdrop-blur-sm">
        <CreatorOnboardingProgress currentStep={currentStep} />
        <div className="mt-8">
          {renderStep()}
        </div>
        
        <div className="flex justify-between pt-8 border-t border-gray-100">
          <Button
            onClick={handleBack}
            variant="outline"
          >
            Back
          </Button>
          <Button
            onClick={currentStep === 'social' ? onComplete : handleNext}
            variant="default"
          >
            {currentStep === 'social' ? 'Complete Setup' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorOnboardingForm;