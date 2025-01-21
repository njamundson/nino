import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreatorData } from "@/types/creator";

interface CreatorCardImageProps {
  creator: CreatorData;
}

const CreatorCardImage = ({ creator }: CreatorCardImageProps) => {
  const fullName = `${creator.profile.first_name} ${creator.profile.last_name}`;
  const initials = `${creator.profile.first_name[0]}${creator.profile.last_name[0]}`;

  return (
    <div className="relative w-full">
      <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-white">
        {creator.profile_image_url ? (
          <img
            src={creator.profile_image_url}
            alt={fullName}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Avatar className="w-32 h-32">
              <AvatarImage src={creator.profile_image_url} alt={fullName} />
              <AvatarFallback className="text-4xl">
                {initials}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorCardImage;