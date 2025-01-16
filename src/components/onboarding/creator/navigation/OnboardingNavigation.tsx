import { Button } from "@/components/ui/button";
import { OnboardingStep } from "@/types/creator";

interface OnboardingNavigationProps {
  currentStep: OnboardingStep;
  onBack: () => void;
  onNext: () => void;
}

const OnboardingNavigation = ({ currentStep, onBack, onNext }: OnboardingNavigationProps) => {
  return (
    <div className="flex justify-between pt-4">
      <Button
        onClick={onBack}
        variant="outline"
        className="text-nino-gray hover:bg-white"
      >
        Back
      </Button>
      {currentStep !== "payment" && (
        <Button
          onClick={onNext}
          className="bg-nino-primary hover:bg-nino-primary/90 text-white"
        >
          Next
        </Button>
      )}
    </div>
  );
};

export default OnboardingNavigation;