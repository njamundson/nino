import { Button } from "@/components/ui/button";

interface OnboardingNavigationProps {
  currentStep: string;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
}

const OnboardingNavigation = ({
  currentStep,
  onBack,
  onNext,
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
        onClick={onNext}
        variant="default"
        type="button"
      >
        {isLastStep ? 'Complete Setup' : 'Continue'}
      </Button>
    </div>
  );
};

export default OnboardingNavigation;