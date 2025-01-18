import { Route } from "react-router-dom";
import UserTypeSelection from "@/components/onboarding/UserTypeSelection";
import CreatorOnboarding from "@/components/onboarding/CreatorOnboarding";
import BrandOnboarding from "@/components/onboarding/BrandOnboarding";
import AccountManagersStep from "@/components/onboarding/brand/managers/AccountManagersStep";
import InvitationAcceptance from "@/components/onboarding/brand/managers/InvitationAcceptance";
import PaymentStep from "@/components/onboarding/brand/PaymentStep";

export const onboardingRoutes = [
  {
    path: "/onboarding",
    element: <UserTypeSelection />,
  },
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