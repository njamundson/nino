import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProjectDetailsProps {
  opportunity: {
    title: string;
    status: string;
    start_date: string | null;
    end_date: string | null;
    location: string | null;
    payment_details: string | null;
    compensation_details: string | null;
  };
}

const ProjectDetails = ({ opportunity }: ProjectDetailsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-start">
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold text-gray-900 tracking-tight">
            {opportunity.title}
          </h3>
          <Badge 
            variant="secondary" 
            className="capitalize bg-nino-primary/10 text-nino-primary hover:bg-nino-primary/20"
          >
            {opportunity.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
        {(opportunity.start_date || opportunity.end_date) && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>
              {opportunity.start_date && formatDate(opportunity.start_date)}
              {opportunity.start_date && opportunity.end_date && " - "}
              {opportunity.end_date && formatDate(opportunity.end_date)}
            </span>
          </div>
        )}

        {opportunity.location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span>{opportunity.location}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;