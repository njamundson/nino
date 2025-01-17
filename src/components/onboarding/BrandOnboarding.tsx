import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useBrandProfile } from "@/hooks/useBrandProfile";
import BrandBasicInfoStep from "./brand/BrandBasicInfoStep";
import BrandDetailsStep from "./brand/BrandDetailsStep";
import BrandSocialStep from "./brand/BrandSocialStep";
import AccountManagersStep from "./brand/managers/AccountManagersStep";
import BrandOnboardingNavigation from "./brand/BrandOnboardingNavigation";
import BrandOnboardingProgress from "./brand/BrandOnboardingProgress";
import { BrandData } from "@/types/brand";

const BrandOnboarding = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const { data: brandProfile } = useBrandProfile(session?.user?.id);
  const [currentStep, setCurrentStep] = useState<'basic' | 'details' | 'social' | 'managers'>('basic');
  const [brandData, setBrandData] = useState<BrandData>({
    companyName: "",
    brandType: "",
    homeLocation: "",
    brandBio: "",
    instagram: "",
    website: "",
  });

  // Redirect if brand profile already exists
  if (brandProfile) {
    navigate("/dashboard");
    return null;
  }

  const handleUpdateField = (field: string, value: string) => {
    setBrandData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    const steps: ('basic' | 'details' | 'social' | 'managers')[] = ['basic', 'details', 'social', 'managers'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: ('basic' | 'details' | 'social' | 'managers')[] = ['basic', 'details', 'social', 'managers'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <BrandBasicInfoStep
            brandData={brandData}
            onUpdateField={handleUpdateField}
          />
        );
      case 'details':
        return (
          <BrandDetailsStep
            brandData={brandData}
            onUpdateField={handleUpdateField}
          />
        );
      case 'social':
        return (
          <BrandSocialStep
            brandData={brandData}
            onUpdateField={handleUpdateField}
          />
        );
      case 'managers':
        return <AccountManagersStep />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-6">
        <BrandOnboardingProgress currentStep={currentStep} />
        {renderStep()}
        <BrandOnboardingNavigation
          currentStep={currentStep}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    </div>
  );
};

export default BrandOnboarding;