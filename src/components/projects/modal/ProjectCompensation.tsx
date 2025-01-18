import { Badge } from "@/components/ui/badge";

interface ProjectCompensationProps {
  paymentDetails: string | null;
  compensationDetails: string | null;
}

const ProjectCompensation = ({ paymentDetails, compensationDetails }: ProjectCompensationProps) => {
  if (!paymentDetails && !compensationDetails) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-900">Compensation</h3>
      <div className="flex flex-wrap gap-2">
        {paymentDetails && (
          <Badge variant="secondary" className="px-4 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-full">
            💰 {paymentDetails}
          </Badge>
        )}
        {compensationDetails && (
          <Badge variant="secondary" className="px-4 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-full">
            🎁 {compensationDetails}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default ProjectCompensation;