import { Badge } from "@/components/ui/badge";
import { Application } from "@/integrations/supabase/types/application";

export interface ProjectBadgesProps {
  applications: Application[];
  currentCreatorId?: string;
  isCompleted?: boolean;
}

const ProjectBadges = ({ applications, currentCreatorId, isCompleted }: ProjectBadgesProps) => {
  const acceptedApplications = applications?.filter(app => app.status === 'accepted') || [];
  const isAccepted = acceptedApplications.length > 0;
  const isCurrentCreator = acceptedApplications.some(app => app.creator_id === currentCreatorId);

  // Only render badges for completed or accepted states
  if (isCompleted) {
    return (
      <div className="absolute top-4 right-4 z-10">
        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
          Completed
        </Badge>
      </div>
    );
  }

  if (isAccepted) {
    return (
      <div className="absolute top-4 right-4 z-10">
        <Badge variant="default" className="bg-nino-primary text-white">
          {isCurrentCreator ? "You're Hired!" : "Creator Hired"}
        </Badge>
      </div>
    );
  }

  // Return null when the project is open (no badge)
  return null;
};

export default ProjectBadges;