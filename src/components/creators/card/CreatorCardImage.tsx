import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreatorData } from "@/types/creator";

interface CreatorCardImageProps {
  creator: CreatorData;
  onInvite: (creatorId: string) => void;
}

const CreatorCardImage = ({ creator }: CreatorCardImageProps) => {
  const fullName = creator.firstName && creator.lastName 
    ? `${creator.firstName} ${creator.lastName}`.trim()
    : 'Anonymous Creator';

  return (
    <div className="relative aspect-[3/4] overflow-hidden">
      <img
        src={creator.profileImage || '/placeholder.svg'}
        alt={fullName}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        {creator.location && (
          <p className="mb-2 text-sm font-medium opacity-90">
            {creator.location}
          </p>
        )}
        <h3 className="text-xl font-semibold">
          {fullName}
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
        className="absolute bottom-6 right-6 rounded-full pointer-events-none"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CreatorCardImage;