import { Badge } from "@/components/ui/badge";
import { Application } from "@/integrations/supabase/types";

export interface ProjectBadgesProps {
  applications: Application[];
  currentCreatorId?: string;
  isCompleted?: boolean;
}

const ProjectBadges = ({ applications, currentCreatorId, isCompleted }: ProjectBadgesProps) => {
  const acceptedApplications = applications?.filter(app => app.status === 'accepted') || [];
  const isAccepted = acceptedApplications.length > 0;
  const isCurrentCreator = acceptedApplications.some(app => app.creator_id === currentCreatorId);

  return (
    <div className="absolute top-4 right-4 z-10">
      {isCompleted ? (
        <Badge variant="secondary" className="bg-gray-100 text-gray-700">
          Completed
        </Badge>
      ) : isAccepted ? (
        isCurrentCreator ? (
          <Badge variant="default" className="bg-nino-primary text-white">
            You're Hired!
          </Badge>
        ) : (
          <Badge variant="default" className="bg-nino-primary text-white">
            Creator Hired
          </Badge>
        )
      ) : (
        <Badge variant="secondary" className="bg-nino-bg text-nino-text">
          Open
        </Badge>
      )}
    </div>
  );
};

export default ProjectBadges;