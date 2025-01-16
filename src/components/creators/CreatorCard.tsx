import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Creator {
  id: string;
  bio: string | null;
  profile: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  location: string | null;
  specialties: string[] | null;
}

interface CreatorCardProps {
  creator: Creator;
  onSelect?: (creator: Creator) => void;
}

const CreatorCard = ({ creator, onSelect }: CreatorCardProps) => {
  const initials = `${creator.profile?.first_name?.[0] || ''}${creator.profile?.last_name?.[0] || ''}`;
  const fullName = `${creator.profile?.first_name || ''} ${creator.profile?.last_name || ''}`.trim();
  
  return (
    <Card className="relative overflow-hidden group">
      <CardContent className="p-0">
        <div className="aspect-[3/4] relative">
          {/* Creator Image */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/50" />
          <Avatar className="w-full h-full rounded-none">
            <AvatarImage 
              src="/lovable-uploads/b6b1a717-e9a0-49d6-98b7-74ab9e858574.png"
              className="object-cover w-full h-full"
              alt={fullName || 'Creator'}
            />
            <AvatarFallback className="w-full h-full">{initials}</AvatarFallback>
          </Avatar>
          
          {/* Creator Info - Positioned at bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <p className="text-sm opacity-90">{creator.location || 'Location not specified'}</p>
            <h3 className="text-lg font-semibold mt-1">
              {fullName || 'Anonymous Creator'}
            </h3>
            <p className="text-sm mt-1 opacity-90">
              {creator.specialties?.join(', ') || 'No skills specified'}
            </p>
          </div>

          {/* Action Button */}
          <Button
            size="icon"
            variant="secondary"
            className="absolute bottom-4 right-4 rounded-full opacity-90 hover:opacity-100"
            onClick={() => onSelect?.(creator)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorCard;