import { Calendar, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { Application } from "@/integrations/supabase/types/opportunity";

interface ProjectDetailsProps {
  application: Application;
}

const ProjectDetails = ({ application }: ProjectDetailsProps) => {
  const brandName = application.opportunity?.brand?.company_name || "Anonymous Brand";
  const brandLocation = application.opportunity?.brand?.location;
  const title = application.opportunity?.title || "Untitled Opportunity";

  return (
    <div className="space-y-6 py-4">
      {/* Project Overview */}
      <div className="space-y-2">
        <h3 className="text-xl font-medium">{title}</h3>
        <p className="text-muted-foreground">{brandName}</p>
      </div>

      {/* Location and Dates */}
      <div className="flex flex-col gap-2">
        {brandLocation && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{brandLocation}</span>
          </div>
        )}
        {(application.opportunity?.start_date || application.opportunity?.end_date) && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>
              {application.opportunity.start_date && formatDate(application.opportunity.start_date)}
              {application.opportunity.end_date && ` - ${formatDate(application.opportunity.end_date)}`}
            </span>
          </div>
        )}
      </div>

      {/* Project Details */}
      <div className="space-y-4">
        <h4 className="text-lg font-medium">Project Details</h4>
        {application.opportunity?.description && (
          <p className="text-muted-foreground">{application.opportunity.description}</p>
        )}

        {/* Cover Letter */}
        {application.cover_letter && (
          <div className="space-y-2">
            <h5 className="font-medium">Your Cover Letter</h5>
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-muted-foreground whitespace-pre-wrap">{application.cover_letter}</p>
            </div>
          </div>
        )}

        {/* Requirements */}
        {application.opportunity?.requirements && application.opportunity.requirements.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium">Requirements</h5>
            <ul className="list-disc pl-5 space-y-1">
              {application.opportunity.requirements.map((req, index) => (
                <li key={index} className="text-muted-foreground">{req}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Deliverables */}
        {application.opportunity?.deliverables && application.opportunity.deliverables.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium">Deliverables</h5>
            <ul className="list-disc pl-5 space-y-1">
              {application.opportunity.deliverables.map((del, index) => (
                <li key={index} className="text-muted-foreground">{del}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Perks */}
        {application.opportunity?.perks && application.opportunity.perks.length > 0 && (
          <div className="space-y-2">
            <h5 className="font-medium">Perks</h5>
            <ul className="list-disc pl-5 space-y-1">
              {application.opportunity.perks.map((perk, index) => (
                <li key={index} className="text-muted-foreground">{perk}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;