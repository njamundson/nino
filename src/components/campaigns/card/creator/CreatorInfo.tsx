import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Creator } from "@/types/creator";

interface CreatorInfoProps {
  creator: Creator;
}

export const CreatorInfo = ({ creator }: CreatorInfoProps) => {
  const displayName = creator.display_name || 'Creator';

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <h2 className="text-3xl font-semibold text-gray-900">
          {displayName}
        </h2>
      </div>
      {creator?.location && (
        <p className="text-gray-600 flex items-center gap-1.5">
          <MapPin className="w-4 h-4" />
          {creator.location}
        </p>
      )}
      {creator?.creator_type && (
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="secondary" className="capitalize">
            {creator.creator_type}
          </Badge>
        </div>
      )}
    </div>
  );
};