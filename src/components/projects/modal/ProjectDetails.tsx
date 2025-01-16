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
    <div className="space-y-6">
      <div>
        <h4 className="font-medium mb-2">Project Overview</h4>
        <div className="prose prose-sm max-w-none">
          <p>{description}</p>
        </div>
      </div>

      <Separator />

      {(startDate || endDate) && (
        <div>
          <h4 className="font-medium mb-2">Project Timeline</h4>
          <div className="flex gap-4 text-sm">
            {startDate && (
              <div>
                <span className="text-muted-foreground">Start Date:</span>{" "}
                {formatDate(startDate)}
              </div>
            )}
            {endDate && (
              <div>
                <span className="text-muted-foreground">End Date:</span>{" "}
                {formatDate(endDate)}
              </div>
            )}
          </div>
        </div>
      )}

      {paymentDetails && (
        <div>
          <h4 className="font-medium mb-2">Payment Details</h4>
          <p className="text-sm">{paymentDetails}</p>
        </div>
      )}

      {compensationDetails && (
        <div>
          <h4 className="font-medium mb-2">Additional Compensation</h4>
          <p className="text-sm">{compensationDetails}</p>
        </div>
      )}

      {deliverables && deliverables.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Project Deliverables</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {deliverables.map((deliverable, index) => (
              <li key={index}>{deliverable}</li>
            ))}
          </ul>
        </div>
      )}

      {requirements && requirements.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Requirements</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
      )}

      {perks && perks.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Perks</h4>
          <div className="flex flex-wrap gap-2">
            {perks.map((perk, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20"
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