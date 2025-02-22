import { Route } from "react-router-dom";
import CreatorOnboarding from "@/components/onboarding/CreatorOnboarding";
import BrandOnboarding from "@/components/onboarding/BrandOnboarding";
import AccountManagersStep from "@/components/onboarding/brand/managers/AccountManagersStep";
import InvitationAcceptance from "@/components/onboarding/brand/managers/InvitationAcceptance";
import NinoWelcomeMessage from "@/components/onboarding/brand/NinoWelcomeMessage";

export const onboardingRoutes = [
  {
    path: "/onboarding/creator",
    element: <CreatorOnboarding />,
  },
  {
    path: "/onboarding/brand",
    element: <BrandOnboarding />,
  },
  {
    path: "/onboarding/brand/managers",
    element: <AccountManagersStep />,
  },
  {
    path: "/onboarding/brand/payment",
    element: <NinoWelcomeMessage />,
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