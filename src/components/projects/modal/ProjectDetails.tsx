import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface ProjectDetailsProps {
  description: string;
  startDate: string | null;
  endDate: string | null;
  requirements: string[] | null;
  perks: string[] | null;
}

const ProjectDetails = ({ 
  description, 
  startDate, 
  endDate, 
  requirements, 
  perks 
}: ProjectDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="prose prose-sm max-w-none">
        <p>{description}</p>
      </div>

      {(startDate || endDate) && (
        <div className="space-y-2">
          <h4 className="font-medium">Project Timeline</h4>
          <div className="flex gap-4 text-sm">
            {startDate && (
              <div>
                <span className="text-nino-gray">Start Date:</span>{" "}
                {formatDate(startDate)}
              </div>
            )}
            {endDate && (
              <div>
                <span className="text-nino-gray">End Date:</span>{" "}
                {formatDate(endDate)}
              </div>
            )}
          </div>
        </div>
      )}

      {requirements && requirements.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Requirements</h4>
          <ul className="list-disc list-inside space-y-1 text-sm">
            {requirements.map((requirement, index) => (
              <li key={index}>{requirement}</li>
            ))}
          </ul>
        </div>
      )}

      {perks && perks.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Perks</h4>
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
      )}
    </div>
  );
};

export default ProjectDetails;