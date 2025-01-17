import { Route } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import UserTypeSelection from "@/components/onboarding/UserTypeSelection";
import CreatorOnboarding from "@/components/onboarding/CreatorOnboarding";
import BrandOnboarding from "@/components/onboarding/BrandOnboarding";
import AccountManagersStep from "@/components/onboarding/brand/managers/AccountManagersStep";

const AccountManagersWrapper = () => {
  const navigate = useNavigate();
  
  const handleComplete = () => {
    navigate("/brand/dashboard");
  };

  return <AccountManagersStep onComplete={handleComplete} />;
};

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
    element: <AccountManagersWrapper />,
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