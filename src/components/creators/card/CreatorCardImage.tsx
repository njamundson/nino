import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreatorData } from "@/types/creator";

interface CreatorCardImageProps {
  creator: CreatorData;
  onInvite: (creatorId: string) => void;
}

const CreatorCardImage = ({ creator, onInvite }: CreatorCardImageProps) => {
  const fullName = creator.profile.first_name && creator.profile.last_name 
    ? `${creator.profile.first_name} ${creator.profile.last_name}`.trim()
    : 'Anonymous Creator';

  return (
    <div className="relative aspect-[3/4] overflow-hidden">
      <img
        src={creator.profile_image_url || '/placeholder.svg'}
        alt={fullName}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h3 className="text-lg font-semibold text-white mb-2">{fullName}</h3>
        <div className="flex flex-wrap gap-2">
          {creator.specialties.slice(0, 3).map((specialty, index) => (
            <span
              key={index}
              className="text-xs text-white/90 bg-white/20 px-2 py-1 rounded-full"
            >
              {specialty}
            </span>
          ))}
          {creator.specialties.length > 3 && (
            <span className="text-xs text-white/90 bg-white/20 px-2 py-1 rounded-full">
              +{creator.specialties.length - 3} more
            </span>
          )}
        </div>
      </div>
      <Button
        size="icon"
        variant="secondary"
        className="absolute bottom-6 right-6 rounded-full pointer-events-none"
        onClick={(e) => {
          e.stopPropagation();
          onInvite(creator.id);
        }}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default CreatorCardImage;