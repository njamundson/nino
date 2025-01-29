import { Badge } from "@/components/ui/badge";

interface CompensationDetailsProps {
  payment_details: string | null;
  compensation_details: string | null;
  deliverables?: string[] | null;
  requirements?: string[] | null;
}

const CompensationDetails = ({ 
  payment_details, 
  compensation_details, 
  deliverables, 
  requirements 
}: CompensationDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {payment_details && (
          <Badge variant="outline" className="rounded-full border-gray-200">
            💰 {payment_details}
          </Badge>
        )}
        {compensation_details && (
          <Badge variant="outline" className="rounded-full border-gray-200">
            🎁 {compensation_details}
          </Badge>
        )}
      </div>

      {deliverables && deliverables.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-900">Deliverables</h5>
          <div className="flex flex-wrap gap-2">
            {deliverables.map((deliverable, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
              >
                {deliverable}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {requirements && requirements.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-900">Requirements</h5>
          <div className="flex flex-wrap gap-2">
            {requirements.map((requirement, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className="rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-200/80"
              >
                {requirement}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompensationDetails;