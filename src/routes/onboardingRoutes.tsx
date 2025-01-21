import Welcome from "@/pages/Welcome";
import CreatorOnboarding from "@/components/onboarding/CreatorOnboarding";
import BrandOnboarding from "@/components/onboarding/BrandOnboarding";

export const onboardingRoutes = [
  {
    path: "/welcome",
    element: <Welcome />,
  },
  {
    path: "/creator/welcome",
    element: <Welcome />,
  },
  {
    path: "/brand/welcome",
    element: <Welcome />,
  },
  {
    path: "/onboarding",
    element: <CreatorOnboarding />,
  },
  {
    path: "/brand/onboarding",
    element: <BrandOnboarding />,
  },
];