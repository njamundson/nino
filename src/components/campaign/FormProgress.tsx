import { Progress } from "@/components/ui/progress";

interface FormProgressProps {
  currentStep: number;
  steps: {
    title: string;
    description: string;
  }[];
}

const FormProgress = ({ currentStep, steps }: FormProgressProps) => {
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="space-y-1">
      <p className="text-xs font-medium text-gray-400">
        {steps[currentStep].description}
      </p>
      <Progress value={progress} className="h-0.5 bg-gray-100" />
    </div>
  );
};

export default FormProgress;