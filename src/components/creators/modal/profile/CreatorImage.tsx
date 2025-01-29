import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface CreatorImageProps {
  profileImageUrl: string | null;
  fullName: string;
}

const CreatorImage = ({ profileImageUrl, fullName }: CreatorImageProps) => {
  const initials = fullName
    ? fullName
        .split(' ')
        .map(n => n[0])
        .join('')
    : '';

  return (
    <div className="relative w-full">
      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-white shadow-sm">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt={fullName}
            className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              console.error('Error loading profile image:', profileImageUrl);
              e.currentTarget.src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-50">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profileImageUrl || ''} alt={fullName} />
              <AvatarFallback className="text-3xl">
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