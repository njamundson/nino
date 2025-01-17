import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
            creatorData={creatorData}
            onUpdateField={updateField}
          />
        );
      case 'professional':
        return (
          <ProfessionalInfoStep
            creatorData={creatorData}
            onUpdateField={updateField}
          />
        );
      case 'social':
        return (
          <SocialLinksStep
            creatorData={creatorData}
            onUpdateField={updateField}
          />
        );
      case 'payment':
        return (
          <PaymentStep
            creatorData={creatorData}
            onUpdateField={updateField}
          />
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
          <button
            onClick={handleBack}
            className="text-gray-600 hover:text-gray-900"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            className="bg-black hover:bg-gray-900 text-white px-8 py-2 rounded"
          >
            {currentStep === 'payment' ? 'Complete' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatorOnboardingForm;