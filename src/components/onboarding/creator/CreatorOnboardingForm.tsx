import { useState } from 'react';
import BasicInfoStep from './BasicInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import SocialLinksStep from './SocialLinksStep';
import { CreatorData, CreatorType } from '@/types/creator';

interface CreatorOnboardingFormProps {
  onComplete?: (data: CreatorData) => Promise<void>;
}

interface StepProps {
  creatorData: CreatorData;
  onUpdateField: (field: keyof CreatorData, value: any) => void;
  onNext?: () => void;
  onBack?: () => void;
  onComplete?: () => Promise<void>;
}

const CreatorOnboardingForm = ({ onComplete }: CreatorOnboardingFormProps) => {
  const [step, setStep] = useState<'basic' | 'professional' | 'social'>('basic');
  const [creatorData, setCreatorData] = useState<CreatorData>({
    id: '',
    user_id: '',
    display_name: '',
    first_name: '',
    last_name: '',
    bio: null,
    location: null,
    specialties: [],
    creator_type: 'solo',
    instagram: null,
    website: null,
    profile_image_url: null,
    notifications_enabled: true,
    onboarding_completed: false
  });

  const updateField = (field: keyof CreatorData, value: any) => {
    setCreatorData(prev => ({ ...prev, [field]: value }));
  };

  const handleComplete = async () => {
    if (onComplete) {
      await onComplete(creatorData);
    }
  };

  const renderStep = () => {
    const stepProps: StepProps = {
      creatorData,
      onUpdateField: updateField,
    };

    switch (step) {
      case 'basic':
        return (
          <BasicInfoStep
            {...stepProps}
            onNext={() => setStep('professional')}
          />
        );
      case 'professional':
        return (
          <ProfessionalInfoStep
            {...stepProps}
            onNext={() => setStep('social')}
            onBack={() => setStep('basic')}
          />
        );
      case 'social':
        return (
          <SocialLinksStep
            {...stepProps}
            onBack={() => setStep('professional')}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      {renderStep()}
    </div>
  );
};

export default CreatorOnboardingForm;