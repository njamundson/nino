import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface ProjectDetailsProps {
  description: string;
  startDate: string | null;
  endDate: string | null;
  requirements: string[] | null;
  perks: string[] | null;
  paymentDetails: string | null;
  compensationDetails: string | null;
  deliverables: string[] | null;
}

const ProjectDetails = ({ 
  description, 
  startDate, 
  endDate, 
  requirements, 
  perks,
  paymentDetails,
  compensationDetails,
  deliverables
}: ProjectDetailsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-1">Project Overview</h4>
        <p className="text-sm">{description}</p>
      </div>

      {(startDate || endDate) && (
        <div className="flex gap-4 text-sm">
          {startDate && (
            <div>
              <span className="text-muted-foreground">Start:</span>{" "}
              {formatDate(startDate)}
            </div>
          )}
          {endDate && (
            <div>
              <span className="text-muted-foreground">End:</span>{" "}
              {formatDate(endDate)}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {paymentDetails && (
          <div>
            <h4 className="font-medium mb-1 text-sm">Payment</h4>
            <p className="text-sm text-muted-foreground">{paymentDetails}</p>
          </div>
        )}

        {compensationDetails && (
          <div>
            <h4 className="font-medium mb-1 text-sm">Additional Compensation</h4>
            <p className="text-sm text-muted-foreground">{compensationDetails}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {deliverables && deliverables.length > 0 && (
          <div>
            <h4 className="font-medium mb-1 text-sm">Deliverables</h4>
            <ul className="list-disc list-inside space-y-0.5 text-sm text-muted-foreground">
              {deliverables.map((deliverable, index) => (
                <li key={index}>{deliverable}</li>
              ))}
            </ul>
          </div>
        )}

        {requirements && requirements.length > 0 && (
          <div>
            <h4 className="font-medium mb-1 text-sm">Requirements</h4>
            <ul className="list-disc list-inside space-y-0.5 text-sm text-muted-foreground">
              {requirements.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {perks && perks.length > 0 && (
        <div>
          <h4 className="font-medium mb-1 text-sm">Perks</h4>
          <div className="flex flex-wrap gap-1">
            {perks.map((perk, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 text-xs"
              >
                {perk}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;