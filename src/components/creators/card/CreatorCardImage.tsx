import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreatorData } from "@/types/creator";

interface CreatorCardImageProps {
  creator: CreatorData;
  onInvite: (creatorId: string) => void;
}

const CreatorCardImage = ({ creator, onInvite }: CreatorCardImageProps) => {
  const fullName = creator.firstName && creator.lastName 
    ? `${creator.firstName} ${creator.lastName}`.trim()
    : 'Anonymous Creator';

  const handleInviteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    onInvite(creator.id);
  };

  return (
    <div className="relative aspect-[3/4] overflow-hidden">
      <img
        src={creator.profileImage || '/placeholder.svg'}
        alt={fullName}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-xl font-semibold mb-1">
          {fullName}
        </h3>
        {creator.location && (
          <p className="text-sm font-medium text-white/80 mb-3">
            {creator.location}
          </p>
        )}
        {creator.specialties && creator.specialties.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
        className="absolute top-4 right-4 rounded-full bg-white hover:bg-white/90"
        onClick={handleInviteClick}
      >
        <Plus className="h-4 w-4 text-black" />
      </Button>
    </div>
  );
};

export default CreatorCardImage;