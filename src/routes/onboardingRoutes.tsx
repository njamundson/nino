import { Route } from "react-router-dom";
import BrandOnboarding from "@/components/onboarding/BrandOnboarding";
import AccountManagersStep from "@/components/onboarding/brand/managers/AccountManagersStep";
import InvitationAcceptance from "@/components/onboarding/brand/managers/InvitationAcceptance";
import PaymentStep from "@/components/onboarding/brand/PaymentStep";
import { useBrandOnboarding } from "@/hooks/useBrandOnboarding";
import { useState } from "react";

type OnboardingStep = "basic" | "details" | "social" | "managers";

const BrandOnboardingWrapper = () => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>("basic");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { brandData, handleUpdateField, handleSubmit } = useBrandOnboarding();

  const handleNext = () => {
    const steps: OnboardingStep[] = ["basic", "details", "social", "managers"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: OnboardingStep[] = ["basic", "details", "social", "managers"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <BrandOnboarding
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      profileImage={profileImage}
      brandData={brandData}
      updateField={handleUpdateField}
      setProfileImage={setProfileImage}
      handleNext={handleNext}
      handleBack={handleBack}
      handleSubmit={handleSubmit}
    />
  );
};

export const onboardingRoutes = [
  {
    path: "/onboarding",
    element: <PaymentStep />,
  },
  {
    path: "/onboarding/brand",
    element: <BrandOnboardingWrapper />,
  },
  {
    path: "/onboarding/brand/managers",
    element: <AccountManagersStep />,
  },
  {
    path: "/onboarding/brand/managers/invitation/:token",
    element: <InvitationAcceptance />,
  },
];

export const OnboardingRoutes = () => {
  return (
    <>
      {onboardingRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </>
  );
};

export default OnboardingRoutes;