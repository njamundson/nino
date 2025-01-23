import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CreatorImageProps {
  profileImageUrl: string | null;
  fullName: string;
}

const CreatorImage = ({ profileImageUrl, fullName }: CreatorImageProps) => {
  const initials = fullName
    .split(' ')
    .map(n => n[0])
    .join('');

  return (
    <div className="relative w-full">
      <h2 className="text-2xl font-semibold mb-4 text-nino-text">
        {fullName.split(' ')[0]}
      </h2>
      <div className="aspect-[3/4] rounded-2xl overflow-hidden shadow-lg bg-white">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt={fullName}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              console.error('Error loading profile image:', profileImageUrl);
              e.currentTarget.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158'; // Fallback image
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <Avatar className="w-32 h-32">
              <AvatarImage src={profileImageUrl || ''} alt={fullName} />
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

export default CreatorImage;