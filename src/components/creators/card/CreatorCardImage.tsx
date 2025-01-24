import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { CreatorData } from "@/types/creator";
import { useState } from "react";

interface CreatorCardImageProps {
  creator: CreatorData;
  onInvite: (creatorId: string, opportunityId: string) => void;
  isInviting: boolean;
}

const CreatorCardImage = ({ creator, onInvite, isInviting }: CreatorCardImageProps) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    console.log(`Profile image failed to load for creator ${creator.id}`, creator.profile_image_url);
    setImageError(true);
  };

  const imageUrl = !imageError && creator.profile_image_url 
    ? creator.profile_image_url 
    : '/placeholder.svg';

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden group">
      <img
        src={imageUrl}
        alt={creator.firstName}
        onError={handleImageError}
        className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform transition-transform duration-300 group-hover:translate-y-[-4px]">
        {creator.location && (
          <p className="mb-2 text-sm font-medium opacity-90">
            {creator.location}
          </p>
        )}
        <h3 className="text-xl font-semibold mb-2">
          {creator.firstName}
        </h3>
        {creator.specialties && creator.specialties.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {creator.specialties.map((specialty, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-white/20 text-white hover:bg-white/30"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <Button
        size="icon"
        variant="secondary"
        className="absolute bottom-6 right-6 rounded-full transition-transform duration-300 group-hover:scale-110"
        onClick={(e) => {
          e.stopPropagation();
          onInvite(creator.id, '');
        }}
        disabled={isInviting}
      >
        {isInviting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default CreatorCardImage;