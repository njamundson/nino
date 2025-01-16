import { Route } from "react-router-dom";
import UserTypeSelection from "@/components/onboarding/UserTypeSelection";
import CreatorOnboarding from "@/components/onboarding/CreatorOnboarding";
import BrandOnboarding from "@/components/onboarding/BrandOnboarding";
import AccountManagersStep from "@/components/onboarding/brand/managers/AccountManagersStep";

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