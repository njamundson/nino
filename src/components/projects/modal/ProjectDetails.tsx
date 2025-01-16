import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface ProjectDetailsProps {
  description: string;
  startDate: string | null;
  endDate: string | null;
  requirements: string[] | null;
  perks: string[] | null;
  deliverables?: string[] | null;
  payment?: {
    amount?: number;
    terms?: string;
  };
  compensation?: string[] | null;
}

const ProjectDetails = ({ 
  description, 
  startDate, 
  endDate, 
  requirements, 
  perks,
  deliverables,
  payment,
  compensation
}: ProjectDetailsProps) => {
  return (
    <div className="space-y-6">
      {/* Project Description */}
      <div className="space-y-2">
        <h4 className="font-medium text-lg">About this Project</h4>
        <div className="prose prose-sm max-w-none text-nino-gray">
          <p>{description}</p>
        </div>
      </div>

      <Separator />

      {/* Timeline Section */}
      {(startDate || endDate) && (
        <div className="space-y-2">
          <h4 className="font-medium text-lg">Project Timeline</h4>
          <div className="flex gap-4 text-sm">
            {startDate && (
              <div>
                <span className="text-nino-gray">Start Date:</span>{" "}
                <span className="font-medium">{formatDate(startDate)}</span>
              </div>
            )}
            {endDate && (
              <div>
                <span className="text-nino-gray">End Date:</span>{" "}
                <span className="font-medium">{formatDate(endDate)}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Payment & Compensation */}
      {(payment || compensation) && (
        <>
          <Separator />
          <div className="space-y-4">
            {payment && (
              <div className="space-y-2">
                <h4 className="font-medium text-lg">Payment Details</h4>
                <div className="space-y-1">
                  {payment.amount && (
                    <p className="text-2xl font-semibold text-nino-primary">
                      ${payment.amount.toLocaleString()}
                    </p>
                  )}
                  {payment.terms && (
                    <p className="text-sm text-nino-gray">{payment.terms}</p>
                  )}
                </div>
              </div>
            )}
            
            {compensation && compensation.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Additional Compensation</h4>
                <div className="flex flex-wrap gap-2">
                  {compensation.map((item, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Deliverables */}
      {deliverables && deliverables.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-lg">Project Deliverables</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-nino-gray">
              {deliverables.map((deliverable, index) => (
                <li key={index}>{deliverable}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Requirements */}
      {requirements && requirements.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-lg">Requirements</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-nino-gray">
              {requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </>
      )}

      {/* Perks */}
      {perks && perks.length > 0 && (
        <>
          <Separator />
          <div className="space-y-2">
            <h4 className="font-medium text-lg">Perks</h4>
            <div className="flex flex-wrap gap-2">
              {perks.map((perk, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20"
                >
                  {perk}
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProjectDetails;