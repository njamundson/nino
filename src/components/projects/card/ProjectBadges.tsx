import { Badge } from "@/components/ui/badge";

interface ProjectBadgesProps {
  payment_details: string | null;
  compensation_details: string | null;
}

const ProjectBadges = ({ payment_details, compensation_details }: ProjectBadgesProps) => {
  if (!payment_details && !compensation_details) return null;
  
  return (
    <div className="space-y-1">
      {payment_details && (
        <Badge
          variant="secondary"
          className="bg-white/20 hover:bg-white/30 text-white border-0"
        >
          💰 {payment_details}
        </Badge>
      )}
      
      {compensation_details && (
        <Badge
          variant="secondary"
          className="bg-white/20 hover:bg-white/30 text-white border-0 ml-2"
        >
          🎁 {compensation_details}
        </Badge>
      )}
    </div>
  );
};

export default ProjectBadges;