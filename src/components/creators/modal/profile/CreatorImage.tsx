import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CreatorImageProps {
  profileImageUrl: string | null;
  fullName: string;
}

const CreatorImage = ({ profileImageUrl, fullName }: CreatorImageProps) => {
  return (
    <div className="relative w-full">
      <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-white">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt={fullName}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profileImageUrl || ''} alt={fullName} />
              <AvatarFallback className="text-4xl">
                {fullName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorImage;