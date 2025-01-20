import { Progress } from "@/components/ui/progress";

interface FormProgressProps {
  currentStep: number;
  steps: {
    title: string;
    description: string;
  }[];
}

const FormProgress = ({ currentStep, steps }: FormProgressProps) => {
  // Add null check and default empty array
  if (!steps || steps.length === 0) {
    return null;
  }

  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-gray-500">
        {steps[currentStep]?.description || ""}
      </p>
      <Progress 
        value={progress} 
        className="h-1 bg-gray-100" 
        indicatorClassName="bg-nino-primary"
      />
    </div>
  );
};

export default FormProgress;