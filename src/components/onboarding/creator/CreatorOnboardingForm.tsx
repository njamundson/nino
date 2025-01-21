import { useEffect } from "react";
import { CreatorData, CreatorType } from "@/types/creator";
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
            firstName={creatorData.profile.first_name}
            lastName={creatorData.profile.last_name}
            bio={creatorData.bio || ""}
            location={creatorData.location || ""}
            profileImage={creatorData.profile_image_url}
            onUpdateField={(field, value) => onUpdateField(field as keyof CreatorData, value)}
            onUpdateImage={(image) => onUpdateField('profile_image_url', image)}
          />
        );
      case 1:
        return (
          <ProfessionalInfoStep
            creatorType={creatorData.creator_type}
            skills={creatorData.specialties}
            onUpdateField={(field, value) => onUpdateField(field as keyof CreatorData, value)}
            onUpdateSkills={(skills) => onUpdateField('specialties', skills)}
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