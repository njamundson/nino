import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Creator } from "@/types/creator";

interface CreatorInfoProps {
  creator: Creator;
}

export const CreatorInfo = ({ creator }: CreatorInfoProps) => {
  const getDisplayName = () => {
    console.log("Creator data in display name:", creator);
    
    // Direct properties check
    if (creator.first_name) {
      return `${creator.first_name} ${creator.last_name || ''}`.trim();
    }
    
    // Profile check
    if (creator.profile?.first_name) {
      return `${creator.profile.first_name} ${creator.profile.last_name || ''}`.trim();
    }
    
    return 'Anonymous Creator';
  };

  const displayName = getDisplayName();

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