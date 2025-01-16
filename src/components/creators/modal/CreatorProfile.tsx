import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram, Globe } from "lucide-react";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  instagram: string | null;
  website: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  imageUrl: string;
}

interface CreatorProfileProps {
  creator: Creator;
  onInviteClick: () => void;
}

const CreatorProfile = ({ creator, onInviteClick }: CreatorProfileProps) => {
  const fullName = `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      <div className="relative aspect-square rounded-2xl overflow-hidden shadow-lg">
        <img
          src={creator.imageUrl}
          alt={fullName}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
      </div>
      
      <div className="space-y-6">
        {creator.location && (
          <p className="text-nino-gray flex items-center gap-2">
            <span className="text-lg">📍</span> {creator.location}
          </p>
        )}
        
        {creator.bio && (
          <p className="text-base leading-relaxed text-nino-text">
            {creator.bio}
          </p>
        )}

        {creator.specialties && creator.specialties.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {creator.specialties.map((specialty, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="px-4 py-1.5 rounded-full border-2 border-nino-primary text-nino-primary bg-white/50 hover:bg-white transition-colors"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          {creator.instagram && (
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl gap-2 hover:bg-white/80"
              onClick={() => window.open(`https://instagram.com/${creator.instagram}`, '_blank')}
            >
              <Instagram className="w-5 h-5" />
              Instagram
            </Button>
          )}
          
          {creator.website && (
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl gap-2 hover:bg-white/80"
              onClick={() => window.open(creator.website!, '_blank')}
            >
              <Globe className="w-5 h-5" />
              Website
            </Button>
          )}
        </div>

        <Button
          size="lg"
          className="w-full mt-6 bg-nino-primary hover:bg-nino-primary/90 text-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
          onClick={onInviteClick}
        >
          Invite to Campaign
        </Button>
      </div>
    </div>
  );
};

export default CreatorProfile;