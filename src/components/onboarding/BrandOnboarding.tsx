import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import BrandBasicInfoStep from "./brand/BrandBasicInfoStep";
import BrandDetailsStep from "./brand/BrandDetailsStep";
import BrandSocialStep from "./brand/BrandSocialStep";
import AccountManagersStep from "./brand/managers/AccountManagersStep";
import BrandOnboardingProgress from "./brand/BrandOnboardingProgress";
import { BrandData } from "@/types/brand";

type OnboardingStep = "basic" | "details" | "social" | "managers";

const BrandOnboarding = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("basic");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [brandData, setBrandData] = useState<BrandData>({
    brandName: "",
    brandEmail: "",
    brandBio: "",
    homeLocation: "",
    instagram: "",
    website: "",
    location: "",
    brandType: "hotel",
  });

  const handleUpdateField = (field: keyof BrandData, value: string) => {
    setBrandData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNext = () => {
    switch (currentStep) {
      case "basic":
        setCurrentStep("details");
        break;
      case "details":
        setCurrentStep("social");
        break;
      case "social":
        setCurrentStep("managers");
        break;
      default:
        break;
    }
  };

  const handleBack = () => {
    switch (currentStep) {
      case "details":
        setCurrentStep("basic");
        break;
      case "social":
        setCurrentStep("details");
        break;
      case "managers":
        setCurrentStep("social");
        break;
      default:
        break;
    }
  };

  const handleComplete = () => {
    navigate("/brand/dashboard");
  };

  return (
    <div className="min-h-screen bg-nino-bg">
      <BrandOnboardingProgress currentStep={currentStep} />
      
      {currentStep === "basic" && (
        <BrandBasicInfoStep
          profileImage={profileImage}
          brandData={brandData}
          onUpdateField={handleUpdateField}
          onUpdateImage={setProfileImage}
          onNext={handleNext}
        />
      )}
      
      {currentStep === "details" && (
        <BrandDetailsStep
          brandData={brandData}
          onUpdateField={handleUpdateField}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}
      
      {currentStep === "social" && (
        <BrandSocialStep
          brandData={brandData}
          onUpdateField={handleUpdateField}
          onNext={handleNext}
          onBack={handleBack}
        />
      )}

      {currentStep === "managers" && (
        <AccountManagersStep onComplete={handleComplete} />
      )}
    </div>
  );
};

export default BrandOnboarding;