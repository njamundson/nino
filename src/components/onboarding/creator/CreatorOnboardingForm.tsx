import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import BasicInfoStep from "./BasicInfoStep";
import ProfessionalInfoStep from "./ProfessionalInfoStep";
import SocialLinksStep from "./SocialLinksStep";
import PaymentStep from "./PaymentStep";
import { CreatorData } from "@/types/creator";
import { useCreatorOnboarding } from "@/hooks/useCreatorOnboarding";

const CreatorOnboardingForm = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    currentStep,
    creatorData,
    updateField,
    handleNext,
    handleBack
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
            onUpdateImage={(image: string | null) => {
              console.log('Updating profile image:', image);
              updateField('profileImage', image);
            }}
          />
        );
      case 'professional':
        return (
          <ProfessionalInfoStep
            creatorType={creatorData.creatorType || ''}
            skills={creatorData.specialties || []}
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
      case 'payment':
        return (
          <PaymentStep />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8 bg-white p-6 rounded-xl shadow-sm">
        {renderStep()}
        
        <div className="flex justify-between pt-6 border-t border-gray-100">
          <Button
            onClick={handleBack}
            variant="outline"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            variant="default"
          >
            {currentStep === 'payment' ? 'Complete' : 'Continue'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatorOnboardingForm;