import { Badge } from "@/components/ui/badge";
import { Application } from "@/integrations/supabase/types/application";

interface ProjectBadgesProps {
  applications: Application[];
}

const ProjectBadges = ({ applications }: ProjectBadgesProps) => {
  const acceptedCount = applications.filter(app => app.status === 'accepted').length;
  const pendingCount = applications.filter(app => app.status === 'pending').length;
  const rejectedCount = applications.filter(app => app.status === 'rejected').length;

  return (
    <div className="flex space-x-2">
      {acceptedCount > 0 && (
        <Badge variant="default">Accepted: {acceptedCount}</Badge>
      )}
      {pendingCount > 0 && (
        <Badge variant="secondary">Pending: {pendingCount}</Badge>
      )}
      {rejectedCount > 0 && (
        <Badge variant="destructive">Rejected: {rejectedCount}</Badge>
      )}
    </div>
  );
};

export default ProjectBadges;
