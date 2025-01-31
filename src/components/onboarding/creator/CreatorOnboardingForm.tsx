import { useState } from 'react';
import BasicInfoStep from './BasicInfoStep';
import ProfessionalInfoStep from './ProfessionalInfoStep';
import SocialLinksStep from './SocialLinksStep';
import { CreatorData } from '@/types/creator';

const CreatorOnboardingForm = () => {
  const [step, setStep] = useState<'basic' | 'professional' | 'social'>('basic');
  const [creatorData, setCreatorData] = useState<CreatorData>({
    id: '',
    user_id: '',
    display_name: '',
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

  const renderStep = () => {
    switch (step) {
      case 'basic':
        return (
          <BasicInfoStep
            creatorData={creatorData}
            onUpdateField={updateField}
          />
        );
      case 'professional':
        return (
          <ProfessionalInfoStep
            creatorType={creatorData.creator_type}
            skills={creatorData.specialties || []}
            onUpdateField={updateField}
            onUpdateSkills={(skills) => updateField('specialties', skills)}
          />
        );
      case 'social':
        return (
          <SocialLinksStep
            creatorData={creatorData}
            onUpdateField={updateField}
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