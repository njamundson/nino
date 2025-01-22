import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProposalMetadata from "../ProposalMetadata";
import ProposalStatusBadge from "../ProposalStatusBadge";
import { Badge } from "@/components/ui/badge";
import { DollarSign } from "lucide-react";

interface ProposalCardHeaderProps {
  brandName: string;
  title: string;
  location?: string;
  startDate?: string;
  status: string;
  profileImage?: string;
  compensationAmount?: number;
  compensationType?: string;
}

const ProposalCardHeader = ({ 
  brandName, 
  title, 
  location, 
  startDate, 
  status,
  profileImage,
  compensationAmount,
  compensationType
}: ProposalCardHeaderProps) => {
  const brandInitial = brandName[0].toUpperCase();

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={profileImage} alt={brandName} />
          <AvatarFallback className="bg-nino-bg text-nino-gray">
            {brandInitial}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            {title}
          </h3>
          <ProposalMetadata
            name={brandName}
            location={location}
            startDate={startDate}
          />
          {compensationAmount && compensationType && (
            <Badge variant="secondary" className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
              <DollarSign className="w-4 h-4 mr-1" />
              {compensationAmount} {compensationType}
            </Badge>
          )}
        </div>
      </div>
      <ProposalStatusBadge status={status} />
    </div>
  );
};

export default ProposalCardHeader;