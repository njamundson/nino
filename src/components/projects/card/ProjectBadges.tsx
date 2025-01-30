import { Badge } from "@/components/ui/badge";
import { BadgeCheck, Clock, CheckCircle } from "lucide-react";
import { Application } from "@/integrations/supabase/types/opportunity";

interface ProjectBadgesProps {
  applications?: Application[];
  isCompleted?: boolean;
  currentCreatorId?: string;
}

const ProjectBadges = ({ applications, isCompleted, currentCreatorId }: ProjectBadgesProps) => {
  const creatorApplication = applications?.find(
    app => app.creator_id === currentCreatorId
  );

  if (isCompleted) {
    return (
      <Badge 
        variant="secondary" 
        className="absolute top-6 right-6 bg-gradient-to-b from-green-400/90 to-green-500/90 text-white border-0 shadow-sm backdrop-blur-sm flex items-center gap-1.5 px-3 py-1.5 font-medium"
      >
        <CheckCircle className="w-4 h-4" />
        Completed
      </Badge>
    );
  }

  if (!creatorApplication) return null;

  if (creatorApplication.initiated_by === "brand" && !creatorApplication.cover_letter) {
    return (
      <Badge 
        variant="secondary" 
        className="absolute top-6 right-6 bg-gradient-to-b from-blue-400/90 to-blue-500/90 text-white border-0 shadow-sm backdrop-blur-sm flex items-center gap-1.5 px-3 py-1.5 font-medium"
      >
        <BadgeCheck className="w-4 h-4" />
        Invited
      </Badge>
    );
  }

  if (creatorApplication.initiated_by === "creator") {
    return (
      <Badge 
        variant="secondary" 
        className="absolute top-6 right-6 bg-gradient-to-b from-orange-400/90 to-orange-500/90 text-white border-0 shadow-sm backdrop-blur-sm flex items-center gap-1.5 px-3 py-1.5 font-medium"
      >
        <Clock className="w-4 h-4" />
        Applied
      </Badge>
    );
  }

  return null;
};

export default ProjectBadges;