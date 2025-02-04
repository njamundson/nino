import { useIsMobile } from "@/hooks/use-mobile";

interface CreatorImageProps {
  profileImageUrl?: string | null;
  fullName: string;
}

const CreatorImage = ({ profileImageUrl, fullName }: CreatorImageProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`relative w-full h-full ${isMobile ? 'max-h-[300px]' : ''} rounded-2xl overflow-hidden bg-gray-100`}>
      {profileImageUrl ? (
        <img
          src={profileImageUrl}
          alt={`${fullName}'s profile`}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 text-4xl font-medium">
          {fullName[0]}
        </div>
      )}
    </div>
  );
};

export default CreatorImage;