import { Creator } from "@/types/creator";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import BrowseCreatorProfile from "./modal/BrowseCreatorProfile";

interface CreatorCardProps {
  creator: Creator;
  onInviteClick?: () => void;
}

const CreatorCard = ({ creator, onInviteClick }: CreatorCardProps) => {
  const displayName = `${creator.first_name} ${creator.last_name || ''}`.trim();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="bg-white rounded-2xl p-6 space-y-4 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-100">
            {creator.profile_image_url ? (
              <img
                src={creator.profile_image_url}
                alt={displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                No Image
              </div>
            )}
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-lg text-gray-900">{displayName}</h3>
            {creator.location && (
              <p className="text-gray-600 flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4" />
                {creator.location}
              </p>
            )}
            {creator.creator_type && (
              <Badge variant="secondary" className="capitalize">
                {creator.creator_type}
              </Badge>
            )}
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-4xl h-[80vh]">
        <BrowseCreatorProfile
          creator={creator}
          onInviteClick={onInviteClick}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreatorCard;