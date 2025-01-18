import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

type OnboardingStep = 'basic' | 'professional' | 'social' | 'payment';

interface OnboardingNavigationProps {
  currentStep: OnboardingStep;
  onNext: () => void;
  onBack: () => void;
}

const OnboardingNavigation = ({
  currentStep,
  onNext,
  onBack,
}: OnboardingNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      <Button
        type="button"
        variant="ghost"
        onClick={onBack}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Button>
      <Button
        type="button"
        onClick={onNext}
        className="bg-nino-primary hover:bg-nino-primary/90"
      >
        {currentStep === 'payment' ? 'Complete' : 'Next'}
      </Button>
    </div>
  );
};

export default OnboardingNavigation;