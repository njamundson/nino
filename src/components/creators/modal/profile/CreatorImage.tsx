import { useIsMobile } from "@/hooks/use-mobile";

interface CreatorImageProps {
  profileImageUrl?: string | null;
  fullName: string;
}

const CreatorImage = ({ profileImageUrl, fullName }: CreatorImageProps) => {
  const isMobile = useIsMobile();

  return (
    <div className={`relative w-full ${isMobile ? 'h-[400px]' : 'h-[500px]'} rounded-3xl overflow-hidden bg-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.12)]`}>
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