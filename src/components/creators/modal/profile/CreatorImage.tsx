import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CreatorImageProps {
  profileImageUrl: string | null;
  fullName: string;
}

const CreatorImage = ({ profileImageUrl, fullName }: CreatorImageProps) => {
  const initials = fullName
    ? fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
    : '?';

  return (
    <div className="flex items-center justify-center">
      <Avatar className="h-64 w-64 rounded-xl">
        <AvatarImage
          src={profileImageUrl || undefined}
          alt={fullName}
          className="object-cover"
        />
        <AvatarFallback className="text-4xl">
          {initials}
        </AvatarFallback>
      </Avatar>
    </div>
  );
};

export default CreatorImage;