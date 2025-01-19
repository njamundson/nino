import { User, MapPin, CalendarDays } from "lucide-react";

interface ProposalMetadataProps {
  name: string;
  location?: string;
  startDate?: string;
}

const ProposalMetadata = ({ name, location, startDate }: ProposalMetadataProps) => {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-500 flex items-center gap-2">
        <User className="w-4 h-4" />
        {name}
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
            {new Date(startDate).toLocaleDateString()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProposalMetadata;