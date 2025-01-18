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
    <>
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold tracking-tight text-gray-900">
          {steps[currentStep].title}
        </h2>
        <p className="text-lg text-gray-500">
          {steps[currentStep].description}
        </p>
      </div>
      <Progress value={progress} className="h-1 bg-gray-100" />
    </>
  );
};

export default FormProgress;