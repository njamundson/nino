import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProposalMetadata from "../ProposalMetadata";
import ProposalStatusBadge from "../ProposalStatusBadge";

interface ProposalCardHeaderProps {
  brandName: string;
  title: string;
  location?: string;
  startDate?: string;
  status: string;
}

const ProposalCardHeader = ({ 
  brandName, 
  title, 
  location, 
  startDate, 
  status 
}: ProposalCardHeaderProps) => {
  const brandInitial = brandName[0].toUpperCase();

  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarImage src={`/brand-profile-image.jpg`} />
          <AvatarFallback className="bg-nino-bg text-nino-gray">
            {brandInitial}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-gray-900">
            {title}
          </h3>
          <ProposalMetadata
            name={brandName}
            location={location}
            startDate={startDate}
          />
        </div>
      </div>
      <ProposalStatusBadge status={status} />
    </div>
  );
};

export default ProposalCardHeader;