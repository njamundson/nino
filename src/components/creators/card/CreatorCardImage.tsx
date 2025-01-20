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

  return (
    <div className="relative aspect-[3/4] overflow-hidden">
      <img
        src={creator.profileImage || '/placeholder.svg'}
        alt={fullName}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      
      {/* Content container */}
      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <div className="space-y-3">
          {/* Name */}
          <h3 className="text-2xl font-semibold">
            {fullName}
          </h3>
          
          {/* Location */}
          {creator.location && (
            <p className="text-sm font-medium text-white/90">
              {creator.location}
            </p>
          )}
          
          {/* Specialties */}
          {creator.specialties && creator.specialties.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {creator.specialties.map((specialty, index) => (
                <Badge 
                  key={index} 
                  variant="secondary" 
                  className="bg-white/20 text-white hover:bg-white/30 border-none"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invite button */}
      <Button
        size="icon"
        variant="secondary"
        className="absolute top-4 right-4 rounded-full bg-white/90 hover:bg-white"
        onClick={(e) => {
          e.stopPropagation();
          onInvite(creator.id);
        }}
      >
        <Plus className="h-4 w-4 text-gray-900" />
      </Button>
    </div>
  );
};

export default CreatorCardImage;