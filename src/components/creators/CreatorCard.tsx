import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface CreatorCardProps {
  creator: {
    bio: string | null;
    profile: {
      first_name: string | null;
      last_name: string | null;
    } | null;
  };
}

const CreatorCard = ({ creator }: CreatorCardProps) => {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12">
          <AvatarFallback className="bg-primary/10">
            {creator.profile?.first_name?.[0]}
            {creator.profile?.last_name?.[0]}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-semibold">
            {creator.profile?.first_name} {creator.profile?.last_name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3">
            {creator.bio || "No bio available"}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default CreatorCard;