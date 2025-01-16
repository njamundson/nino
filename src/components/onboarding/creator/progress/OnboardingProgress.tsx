import { OnboardingStep } from "@/types/creator";

interface OnboardingProgressProps {
  currentStep: OnboardingStep;
}

const OnboardingProgress = ({ currentStep }: OnboardingProgressProps) => {
  const steps: { [key in OnboardingStep]: string } = {
    basic: "Basic Information",
    social: "Social Links",
    professional: "Professional Details",
    payment: "Choose Plan",
  };

  const getStepProgress = () => {
    const stepOrder: OnboardingStep[] = ["basic", "social", "professional", "payment"];
    const currentIndex = stepOrder.indexOf(currentStep);
    return ((currentIndex + 1) / stepOrder.length) * 100;
  };

  return (
    <>
      <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
        <div
          className="h-full bg-nino-primary rounded-full transition-all duration-300"
          style={{ width: `${getStepProgress()}%` }}
        />
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-medium text-nino-text">
          {steps[currentStep]}
        </h1>
        <p className="text-nino-gray">Complete your creator profile</p>
      </div>
    </>
  );
};

export default OnboardingProgress;