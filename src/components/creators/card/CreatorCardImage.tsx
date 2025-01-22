import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2 } from "lucide-react";
import { useState } from "react";

interface CreatorCardImageProps {
  creator: {
    id: string;
    name: string;
    location?: string;
    specialties?: string[];
    profileImage?: string | null;
  };
  onInvite: (creatorId: string) => void;
}

const CreatorCardImage = ({ creator, onInvite }: CreatorCardImageProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleInviteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    try {
      await onInvite(creator.id);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <img
        src={creator.profileImage || "/placeholder.svg"}
        alt={creator.name}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      
      {creator.location && (
        <p className="absolute top-6 left-6 text-sm text-white/90">
          📍 {creator.location}
        </p>
      )}

      <div className="absolute bottom-20 left-6 right-6 text-white">
        <h3 className="text-2xl font-semibold leading-tight line-clamp-2">
          {creator.name}
        </h3>
      </div>

      {creator.specialties && creator.specialties.length > 0 && (
        <div className="absolute bottom-6 left-6 right-16 flex flex-wrap gap-1.5">
          {creator.specialties.slice(0, 3).map((specialty, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-white/10 text-white border-0 backdrop-blur-sm"
            >
              {specialty}
            </Badge>
          ))}
        </div>
      )}

      <Button
        size="icon"
        variant="secondary"
        className="absolute bottom-6 right-6 rounded-full bg-white/90 hover:bg-white transition-all duration-300 hover:scale-105 shadow-md"
        onClick={handleInviteClick}
        disabled={isLoading}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Plus className="h-4 w-4 text-gray-900" />
        )}
      </Button>
    </>
  );
};

export default CreatorCardImage;