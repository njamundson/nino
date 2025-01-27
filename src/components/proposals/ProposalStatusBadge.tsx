import { Badge } from "@/components/ui/badge";
import { Clock, Check, X } from "lucide-react";

interface ProposalStatusBadgeProps {
  status: string;
}

const ProposalStatusBadge = ({ status }: ProposalStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          text: 'Pending',
          className: 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20'
        };
      case 'accepted':
        return {
          icon: Check,
          text: 'Accepted',
          className: 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
        };
      case 'rejected':
        return {
          icon: X,
          text: 'Rejected',
          className: 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
        };
      default:
        return {
          icon: Clock,
          text: status,
          className: 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
        };
    }
  };

  const { icon: Icon, text, className } = getStatusConfig(status);

  return (
    <Badge 
      variant="secondary"
      className={`${className} flex items-center gap-1.5 px-3 py-1.5 shadow-sm`}
    >
      <Icon className="w-4 h-4" />
      {text}
    </Badge>
  );
};

export default ProposalStatusBadge;