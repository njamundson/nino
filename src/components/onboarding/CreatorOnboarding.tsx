import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import BasicInfoStep from "./creator/BasicInfoStep";
import SocialLinksStep from "./creator/SocialLinksStep";
import ProfessionalInfoStep from "./creator/ProfessionalInfoStep";
import PaymentStep from "./creator/PaymentStep";
import OnboardingProgress from "./creator/progress/OnboardingProgress";
import OnboardingNavigation from "./creator/navigation/OnboardingNavigation";
import { useCreatorOnboarding } from "@/hooks/useCreatorOnboarding";

const CreatorOnboarding = () => {
  const navigate = useNavigate();
  const {
    currentStep,
    profile,
    errors,
    updateField,
    updateImage,
    updateSkills,
    handleNext,
    handleBack,
  } = useCreatorOnboarding();

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-6"
      >
        <OnboardingProgress currentStep={currentStep} />

        <div className="bg-white p-6 rounded-xl shadow-sm">
          {currentStep === "basic" && (
            <BasicInfoStep
              profileImage={profile.profileImage}
              firstName={profile.firstName}
              lastName={profile.lastName}
              bio={profile.bio}
              location={profile.location}
              onUpdateField={updateField}
              onUpdateImage={updateImage}
              errors={errors}
            />
          )}

          {currentStep === "social" && (
            <SocialLinksStep
              instagram={profile.instagram}
              website={profile.website}
              onUpdateField={updateField}
              errors={errors}
            />
          )}

          {currentStep === "professional" && (
            <ProfessionalInfoStep
              creatorType={profile.creatorType}
              skills={profile.skills}
              onUpdateField={updateField}
              onUpdateSkills={updateSkills}
              errors={errors}
            />
          )}

          {currentStep === "payment" && <PaymentStep />}
        </div>

        <OnboardingNavigation
          currentStep={currentStep}
          onBack={() => handleBack(navigate)}
          onNext={handleNext}
        />
      </motion.div>
    </div>
  );
};

export default CreatorOnboarding;