import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { CreatorData } from "@/types/creator";
import { useState } from "react";

interface CreatorCardImageProps {
  creator: CreatorData;
  onInvite: (creatorId: string) => void;
}

const CreatorCardImage = ({ creator, onInvite }: CreatorCardImageProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Add console.log to debug profile data
  console.log('Creator data:', creator);
  
  // Get the full name from the creator's data
  const fullName = creator.firstName && creator.lastName 
    ? `${creator.firstName} ${creator.lastName}`.trim()
    : creator.firstName // If only first name is available
    ? creator.firstName.trim()
    : 'Anonymous Creator';

  const handleImageError = () => {
    console.log(`Profile image failed to load for creator ${creator.id}`, creator.profileImage);
    setImageError(true);
  };

  // Fallback placeholder images if profile image fails to load
  const placeholderImages = [
    'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e',
    'https://images.unsplash.com/photo-1581092795360-fd1ca04f0952',
    'https://images.unsplash.com/photo-1527576539890-dfa815648363'
  ];

  const getRandomPlaceholder = () => {
    const randomIndex = Math.floor(Math.random() * placeholderImages.length);
    return placeholderImages[randomIndex];
  };

  const imageUrl = !imageError && creator.profileImage 
    ? creator.profileImage 
    : getRandomPlaceholder();

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden">
      <img
        src={imageUrl}
        alt={fullName}
        onError={handleImageError}
        className="h-full w-full object-cover"
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
        className="absolute bottom-6 right-6 rounded-full"
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