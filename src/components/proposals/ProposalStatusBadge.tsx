import { Badge } from "@/components/ui/badge";
import { Clock, Check, X } from "lucide-react";

interface ProposalStatusBadgeProps {
  status: string;
}

export const ProposalStatusBadge = ({ status }: ProposalStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          className: 'bg-gradient-to-b from-nino-text/80 to-nino-text/90 text-nino-white'
        };
      case 'accepted':
        return {
          icon: Check,
          text: 'Accepted',
          className: 'bg-gradient-to-b from-nino-primary/90 to-nino-primary text-nino-white'
        };
      case 'rejected':
        return {
          icon: X,
          text: 'Rejected',
          className: 'bg-gradient-to-b from-nino-gray/80 to-nino-gray/90 text-nino-white'
        };
      default:
        return {
          icon: Clock,
          text: 'Pending',
          className: 'bg-gradient-to-b from-nino-text/80 to-nino-text/90 text-nino-white'
        };
    }
  };

  const { icon: Icon, text, className } = getStatusConfig(status);

  return (
    <Badge 
      variant="secondary"
      className={`${className} border-0 shadow-sm backdrop-blur-sm flex items-center gap-1.5 px-3 py-1.5 font-medium`}
    >
      <Icon className="w-4 h-4" />
      {text}
    </Badge>
  );
};