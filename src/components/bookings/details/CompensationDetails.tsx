import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4">
      <div className={`flex flex-wrap gap-2 ${isMobile ? 'flex-col items-start w-full' : ''}`}>
        {payment_details && (
          <Badge 
            variant="outline" 
            className={`rounded-full border-gray-200 inline-flex items-center ${
              isMobile ? 'w-full justify-start' : 'max-w-fit'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="flex-shrink-0">💰</span>
              <span className="truncate">{payment_details}</span>
            </span>
          </Badge>
        )}
        {compensation_details && (
          <Badge 
            variant="outline" 
            className={`rounded-full border-gray-200 inline-flex items-center ${
              isMobile ? 'w-full justify-start' : 'max-w-fit'
            }`}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="flex-shrink-0">🎁</span>
              <span className="truncate">{compensation_details}</span>
            </span>
          </Badge>
        )}
      </div>

      {deliverables && deliverables.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-900">Deliverables</h5>
          <div className={`flex flex-wrap gap-2 ${isMobile ? 'flex-col items-start w-full' : ''}`}>
            {deliverables.map((deliverable, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className={`rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 inline-flex items-center ${
                  isMobile ? 'w-full justify-start' : 'max-w-fit'
                }`}
              >
                <span className="truncate">{deliverable}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {requirements && requirements.length > 0 && (
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-900">Requirements</h5>
          <div className={`flex flex-wrap gap-2 ${isMobile ? 'flex-col items-start w-full' : ''}`}>
            {requirements.map((requirement, index) => (
              <Badge 
                key={index}
                variant="secondary"
                className={`rounded-full bg-gray-100/80 text-gray-600 hover:bg-gray-200/80 inline-flex items-center ${
                  isMobile ? 'w-full justify-start' : 'max-w-fit'
                }`}
              >
                <span className="truncate">{requirement}</span>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CompensationDetails;