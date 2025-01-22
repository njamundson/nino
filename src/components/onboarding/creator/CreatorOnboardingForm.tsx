import React from 'react';
import { Card } from "@/components/ui/card";
import BasicInfoStep from './BasicInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import SocialLinksStep from './SocialLinksStep';
import OnboardingNavigation from './navigation/OnboardingNavigation';
import { useCreatorOnboarding } from '@/hooks/useCreatorOnboarding';
import { CreatorData } from '@/types/creator';

interface CreatorOnboardingFormProps {
  onComplete: (data: CreatorData) => Promise<void>;
}

const CreatorOnboardingForm = ({ onComplete }: CreatorOnboardingFormProps) => {
  const {
    currentStep,
    creatorData,
    updateField,
    handleNext,
    handleBack,
    handleComplete,
  } = useCreatorOnboarding();

  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BasicInfoStep
            firstName={creatorData.firstName}
            lastName={creatorData.lastName}
            bio={creatorData.bio}
            location={creatorData.location}
            profileImage={creatorData.profileImage}
            onUpdateField={updateField}
            onUpdateImage={(url) => updateField('profileImage', url)}
          />
        );
      case 'professional':
        return (
          <ProfessionalInfoStep
            creatorType={creatorData.creatorType}
            skills={creatorData.specialties}
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
      default:
        return null;
    }
  };

  const handleFormComplete = async () => {
    const success = await handleComplete();
    if (success) {
      await onComplete(creatorData);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto p-6 bg-nino-white shadow-lg">
      {renderStep()}
      <OnboardingNavigation
        currentStep={currentStep}
        onNext={handleNext}
        onBack={handleBack}
        onComplete={handleFormComplete}
        isLastStep={currentStep === 'social'}
      />
    </Card>
  );
};

export default CreatorOnboardingForm;