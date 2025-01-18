import { useCreatorOnboarding } from "@/hooks/useCreatorOnboarding";
import { Button } from "@/components/ui/button";
import BasicInfoStep from "./steps/BasicInfoStep";
import ProfessionalInfoStep from "./steps/ProfessionalInfoStep";
import SocialLinksStep from "./steps/SocialLinksStep";
import PaymentStep from "./steps/PaymentStep";
import OnboardingProgress from "./common/OnboardingProgress";
import OnboardingNavigation from "./common/OnboardingNavigation";

const CreatorOnboardingForm = () => {
  const {
    currentStep,
    creatorData,
    updateField,
    handleNext,
    handleBack,
  } = useCreatorOnboarding();

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
            onUpdateImage={(url: string) => updateField('profileImage', url)}
          />
        );
      case 'professional':
        return (
          <ProfessionalInfoStep
            creatorType={creatorData.creatorType || ''}
            skills={creatorData.specialties || []}
            onUpdateField={updateField}
            onUpdateSkills={(skills) => updateField('specialties', skills)}
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
      case 'payment':
        return (
          <PaymentStep
            paymentDetails={creatorData.paymentDetails}
            onUpdateField={updateField}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <OnboardingProgress currentStep={currentStep} />
      {renderStep()}
      <OnboardingNavigation
        currentStep={currentStep}
        onNext={handleNext}
        onBack={handleBack}
      />
    </div>
  );
};

export default CreatorOnboardingForm;