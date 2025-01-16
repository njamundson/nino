import { Badge } from "@/components/ui/badge";
import { Check, X, Clock } from "lucide-react";

interface ProposalStatusBadgeProps {
  status: string;
}

const ProposalStatusBadge = ({ status }: ProposalStatusBadgeProps) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'accepted':
        return <Check className="w-4 h-4" />;
      case 'rejected':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20';
      case 'accepted':
        return 'bg-green-500/10 text-green-500 hover:bg-green-500/20';
      case 'rejected':
        return 'bg-red-500/10 text-red-500 hover:bg-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20';
    }
  };

  return (
    <Badge 
      variant="secondary"
      className={`${getStatusColor(status)} flex items-center gap-1.5`}
    >
      {getStatusIcon(status)}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
};

export default ProposalStatusBadge;