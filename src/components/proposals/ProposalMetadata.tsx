import { User, MapPin, CalendarDays } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ProposalMetadataProps {
  creatorName: string;
  location?: string;
  startDate?: string;
}

const ProposalMetadata = ({ creatorName, location, startDate }: ProposalMetadataProps) => {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-500 flex items-center gap-2">
        <User className="w-4 h-4" />
        {creatorName}
      </p>
      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
        {location && (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            {location}
          </div>
        )}
        {startDate && (
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            {formatDate(startDate)}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalMetadata;