import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export interface ProjectDetailsProps {
  description: string;
  start_date: string | null;
  end_date: string | null;
  requirements: string[] | null;
  perks: string[] | null;
  payment_details: string | null;
  compensation_details: string | null;
  deliverables: string[] | null;
}

const ProjectDetails = ({ 
  description, 
  start_date, 
  end_date, 
  requirements, 
  perks,
  payment_details,
  compensation_details,
  deliverables
}: ProjectDetailsProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="font-medium mb-1">Project Overview</h4>
        <p className="text-sm">{description}</p>
      </div>

      {(start_date || end_date) && (
        <div className="flex gap-4 text-sm">
          {start_date && (
            <div>
              <span className="text-muted-foreground">Start:</span>{" "}
              {formatDate(start_date)}
            </div>
          )}
          {end_date && (
            <div>
              <span className="text-muted-foreground">End:</span>{" "}
              {formatDate(end_date)}
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        {payment_details && (
          <div>
            <h4 className="font-medium mb-1 text-sm">Payment</h4>
            <p className="text-sm text-muted-foreground">{payment_details}</p>
          </div>
        )}

        {compensation_details && (
          <div>
            <h4 className="font-medium mb-1 text-sm">Additional Compensation</h4>
            <p className="text-sm text-muted-foreground">{compensation_details}</p>
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