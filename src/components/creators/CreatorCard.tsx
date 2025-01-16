import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Creator {
  id: string;
  bio: string | null;
  location: string | null;
  specialties: string[] | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface CreatorCardProps {
  creator: Creator;
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  const initials = `${creator.profile?.first_name?.[0] || ''}${creator.profile?.last_name?.[0] || ''}`;
  const fullName = `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-12 h-12">
            <AvatarFallback className="bg-nino-primary/10 text-nino-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-nino-text truncate">
              {fullName || 'Anonymous Creator'}
            </h3>
            {creator.location && (
              <p className="text-sm text-nino-gray mt-1">
                📍 {creator.location}
              </p>
            )}
            {creator.specialties && creator.specialties.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {creator.specialties.map((specialty, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}
            <p className="text-sm text-nino-gray mt-3 line-clamp-2">
              {creator.bio || 'No bio available'}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorCard;