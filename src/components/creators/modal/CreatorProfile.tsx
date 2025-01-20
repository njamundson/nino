import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram, Globe, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  onChatClick?: () => void;
}

const CreatorProfile = ({ creator, onInviteClick, onChatClick }: CreatorProfileProps) => {
  const fullName = `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim();
  
  const getInitials = (firstName: string | null, lastName: string | null) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="p-8 space-y-8">
        {/* Header with Avatar and Name */}
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
            <AvatarImage 
              src={creator.imageUrl} 
              alt={fullName} 
            />
            <AvatarFallback className="bg-nino-primary/10 text-nino-primary text-2xl font-medium">
              {getInitials(creator.profile?.first_name, creator.profile?.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-semibold text-nino-text">{fullName}</h2>
            {creator.location && (
              <p className="text-nino-gray text-sm">📍 {creator.location}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          {creator.instagram && (
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl gap-2 hover:bg-white/80 border-2"
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
              className="rounded-xl gap-2 hover:bg-white/80 border-2"
              onClick={() => window.open(creator.website!, '_blank')}
            >
              <Globe className="w-5 h-5" />
              Website
            </Button>
          )}

          {onChatClick && (
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl gap-2 hover:bg-white/80 border-2"
              onClick={onChatClick}
            >
              <MessageCircle className="w-5 h-5" />
              Chat
            </Button>
          )}
        </div>

        {/* Bio Section */}
        {creator.bio && (
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-nino-text">About</h3>
            <p className="text-base leading-relaxed text-nino-text/90 bg-white/50 p-4 rounded-xl">
              {creator.bio}
            </p>
          </div>
        )}

        {/* Skills/Specialties Section */}
        {creator.specialties && creator.specialties.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-nino-text">Specialties</h3>
            <div className="flex flex-wrap gap-2">
              {creator.specialties.map((specialty, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className="px-3 py-1 rounded-full border-2 border-nino-primary text-nino-primary bg-white/50 hover:bg-white transition-colors"
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Invite Button */}
        <Button
          size="lg"
          className="w-full bg-nino-primary hover:bg-nino-primary/90 text-white rounded-xl shadow-md transition-all duration-300 hover:shadow-lg"
          onClick={onInviteClick}
        >
          Invite to Campaign
        </Button>
      </div>
    </div>
  );
};

export default CreatorProfile;