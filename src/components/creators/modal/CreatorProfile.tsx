import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Instagram, Globe } from "lucide-react";
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
  profile_image_url: string;
}

interface CreatorProfileProps {
  creator: Creator;
  onInviteClick: () => void;
}

const CreatorProfile = ({ creator, onInviteClick }: CreatorProfileProps) => {
  const fullName = `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim();
  const initials = `${creator.profile?.first_name?.[0] || ''}${creator.profile?.last_name?.[0] || ''}`.toUpperCase();

  return (
    <div className="p-6">
      <div className="flex flex-col items-center space-y-6 mb-8">
        <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
          <AvatarImage 
            src={creator.profile_image_url} 
            alt={fullName} 
          />
          <AvatarFallback className="text-2xl font-medium">
            {initials}
          </AvatarFallback>
        </Avatar>
      </div>

      <div className="space-y-6">
        {creator.bio && (
          <div className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-nino-primary/10">
            <h3 className="font-medium text-nino-text mb-3">About</h3>
            <p className="text-nino-gray leading-relaxed">{creator.bio}</p>
          </div>
        )}

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

        <div className="flex gap-3 flex-wrap">
          {creator.instagram && (
            <Button
              variant="outline"
              size="lg"
              className="flex-1 min-w-[140px] rounded-xl gap-2 hover:bg-white/80 border-2"
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
              className="flex-1 min-w-[140px] rounded-xl gap-2 hover:bg-white/80 border-2"
              onClick={() => window.open(creator.website!, '_blank')}
            >
              <Globe className="w-5 h-5" />
              Website
            </Button>
          )}
        </div>

        <Button
          size="lg"
          className="w-full mt-6 bg-nino-primary hover:bg-nino-primary/90 text-white rounded-xl py-6"
          onClick={onInviteClick}
        >
          Invite to Campaign
        </Button>
      </div>
    </div>
  );
};

export default CreatorProfile;