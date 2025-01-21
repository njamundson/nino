import { Route } from "react-router-dom";
import CreatorOnboarding from "@/components/onboarding/CreatorOnboarding";
import BrandOnboarding from "@/components/onboarding/BrandOnboarding";
import AccountManagersStep from "@/components/onboarding/brand/managers/AccountManagersStep";
import InvitationAcceptance from "@/components/onboarding/brand/managers/InvitationAcceptance";
import PaymentStep from "@/components/onboarding/brand/PaymentStep";
import { useBrandOnboarding } from "@/hooks/useBrandOnboarding";
import { useState } from "react";

const BrandOnboardingWrapper = () => {
  const [currentStep, setCurrentStep] = useState<"basic" | "details" | "social" | "managers">("basic");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const { brandData, handleUpdateField, handleSubmit } = useBrandOnboarding();

  const handleNext = () => {
    const steps: ("basic" | "details" | "social" | "managers")[] = ["basic", "details", "social", "managers"];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: ("basic" | "details" | "social" | "managers")[] = ["basic", "details", "social", "managers"];
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
    path: "/onboarding/creator",
    element: <CreatorOnboarding />,
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
    path: "/onboarding/brand/payment",
    element: <PaymentStep />,
  },
  {
    path: "/onboarding/brand/invitation/:token",
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