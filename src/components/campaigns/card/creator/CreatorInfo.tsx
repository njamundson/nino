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
    <div>
      <div className="flex items-center gap-2 mb-1">
        <h4 className="text-xl font-medium text-gray-900">
          {displayName}
        </h4>
        {creator?.creator_type && (
          <Badge variant="secondary" className="capitalize">
            {creator.creator_type}
          </Badge>
        )}
      </div>
      {creator?.location && (
        <p className="text-sm text-gray-500 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />
          {creator.location}
        </p>
      )}
    </div>
  );
};