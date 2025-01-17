import { motion } from "framer-motion";
import { useBrandOnboarding } from "@/hooks/useBrandOnboarding";
import BrandBasicInfoStep from "../brand/BrandBasicInfoStep";
import BrandDetailsStep from "../brand/BrandDetailsStep";
import BrandSocialStep from "../brand/BrandSocialStep";
import BrandOnboardingProgress from "../brand/BrandOnboardingProgress";
import BrandOnboardingNavigation from "../brand/BrandOnboardingNavigation";
import AccountManagersStep from "../brand/managers/AccountManagersStep";
import { useHandleComplete } from "../brand/hooks/useHandleComplete";

const BrandOnboarding = () => {
  const {
    currentStep,
    profileImage,
    brandData,
    updateField,
    setProfileImage,
    handleNext,
    handleBack,
  } = useBrandOnboarding();

  const { handleComplete } = useHandleComplete();

  const getCurrentStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BrandBasicInfoStep
            profileImage={profileImage}
            brandData={brandData}
            onUpdateField={updateField}
            onUpdateImage={setProfileImage}
          />
        );
      case 'details':
        return (
          <BrandDetailsStep
            brandData={brandData}
            onUpdateField={updateField}
          />
        );
      case 'social':
        return (
          <BrandSocialStep
            brandData={brandData}
            onUpdateField={updateField}
          />
        );
      case 'managers':
        return <AccountManagersStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-nino-bg flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md space-y-8 bg-white p-6 rounded-xl shadow-sm"
      >
        <BrandOnboardingProgress currentStep={currentStep} />
        {getCurrentStep()}
        <BrandOnboardingNavigation
          currentStep={currentStep}
          onBack={handleBack}
          onNext={currentStep === 'managers' ? handleComplete : handleNext}
        />
      </motion.div>
    </div>
  );
};

export default BrandOnboarding;