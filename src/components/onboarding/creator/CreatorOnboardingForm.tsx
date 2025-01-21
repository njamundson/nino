import { useEffect } from "react";
import { CreatorData } from "@/types/creator";
import BasicInfoStep from "./BasicInfoStep";
import ProfessionalInfoStep from "./ProfessionalInfoStep";
import SocialLinksStep from "./SocialLinksStep";
import PaymentStep from "./PaymentStep";

interface CreatorOnboardingFormProps {
  currentStep: number;
  creatorData: CreatorData;
  onUpdateField: (field: keyof CreatorData, value: any) => void;
  onSubmit: () => void;
}

const CreatorOnboardingForm = ({
  currentStep,
  creatorData,
  onUpdateField,
  onSubmit,
}: CreatorOnboardingFormProps) => {
  useEffect(() => {
    console.log("Current creator data:", creatorData);
  }, [creatorData]);

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <BasicInfoStep
            profile={creatorData.profile}
            profile_image_url={creatorData.profile_image_url}
            location={creatorData.location}
            onUpdateField={onUpdateField}
          />
        );
      case 1:
        return (
          <ProfessionalInfoStep
            bio={creatorData.bio}
            creator_type={creatorData.creator_type}
            specialties={creatorData.specialties}
            onUpdateField={onUpdateField}
          />
        );
      case 2:
        return (
          <SocialLinksStep
            instagram={creatorData.instagram}
            website={creatorData.website}
            onUpdateField={onUpdateField}
          />
        );
      case 3:
        return <PaymentStep onSubmit={onSubmit} />;
      default:
        return null;
    }
  };

  return <div className="space-y-8">{renderStep()}</div>;
};

export default CreatorOnboardingForm;