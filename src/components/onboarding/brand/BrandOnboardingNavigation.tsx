import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BrandOnboardingNavigationProps {
  currentStep: 'basic' | 'details' | 'social' | 'managers';
  onBack: () => void;
  onNext: () => void;
}

const BrandOnboardingNavigation = ({
  currentStep,
  onBack,
  onNext,
}: BrandOnboardingNavigationProps) => {
  return (
    <div className="flex justify-between pt-8">
      <Button
        onClick={onBack}
        variant="outline"
        className="text-nino-gray hover:bg-gray-50 space-x-2"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back</span>
      </Button>
      <Button
        onClick={onNext}
        className="bg-nino-primary hover:bg-nino-primary/90 text-white px-8 space-x-2"
      >
        <span>{currentStep === 'managers' ? 'Complete Setup' : 'Next'}</span>
        {currentStep !== 'managers' && <ChevronRight className="w-4 h-4" />}
      </Button>
    </div>
  );
};

export default BrandOnboardingNavigation;