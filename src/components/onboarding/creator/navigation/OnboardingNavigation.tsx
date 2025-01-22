import { Button } from "@/components/ui/button";

interface OnboardingNavigationProps {
  currentStep: string;
  onBack: () => void;
  onNext: () => void;
  onComplete: () => Promise<void>;
  isLastStep: boolean;
}

const OnboardingNavigation = ({
  currentStep,
  onBack,
  onNext,
  onComplete,
  isLastStep
}: OnboardingNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        onClick={onBack}
        variant="outline"
        type="button"
      >
        Back
      </Button>
      <Button
        onClick={isLastStep ? onComplete : onNext}
        variant="default"
        type="button"
      >
        {isLastStep ? 'Complete Setup' : 'Continue'}
      </Button>
    </div>
  );
};

export default OnboardingNavigation;