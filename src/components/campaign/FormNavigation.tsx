import { Button } from "@/components/ui/button";

interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const FormNavigation = ({ 
  currentStep, 
  totalSteps, 
  onBack, 
  onNext, 
  onSubmit 
}: FormNavigationProps) => {
  return (
    <div className="flex justify-between pt-6 mt-6 border-t border-gray-100">
      <Button
        variant="ghost"
        onClick={onBack}
        disabled={currentStep === 0}
        className="text-gray-500 hover:text-gray-900 text-sm font-medium"
      >
        Back
      </Button>
      
      {currentStep === totalSteps - 1 ? (
        <Button 
          onClick={onSubmit}
          className="bg-nino-primary hover:bg-nino-primary/90 text-white px-6 text-sm font-medium rounded-full"
        >
          Create Campaign
        </Button>
      ) : (
        <Button 
          onClick={onNext}
          className="bg-nino-primary hover:bg-nino-primary/90 text-white px-6 text-sm font-medium rounded-full"
        >
          Continue
        </Button>
      )}
    </div>
  );
};

export default FormNavigation;