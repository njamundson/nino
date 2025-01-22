import React from 'react';
import { Card } from "@/components/ui/card";
import BasicInfoStep from './BasicInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import SocialLinksStep from './SocialLinksStep';
import OnboardingNavigation from './navigation/OnboardingNavigation';
import { useCreatorOnboarding } from '@/hooks/useCreatorOnboarding';

const CreatorOnboardingForm = () => {
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
          />
        );
      case 'professional':
        return (
          <ProfessionalInfoStep
            creatorType={creatorData.creatorType}
            specialties={creatorData.specialties}
            onUpdateField={updateField}
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
    <Card className="w-full max-w-2xl mx-auto p-6">
      {renderStep()}
      <OnboardingNavigation
        currentStep={currentStep}
        onNext={handleNext}
        onBack={handleBack}
        onComplete={handleComplete}
      />
    </Card>
  );
};

export default CreatorOnboardingForm;