interface CreatorImageProps {
  profileImageUrl: string | null;
  fullName: string;
}

const CreatorImage = ({ profileImageUrl, fullName }: CreatorImageProps) => {
  return (
    <div className="relative w-full h-full">
      <div className="h-full rounded-xl overflow-hidden bg-white shadow-sm">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt={`${fullName}'s profile`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-lg">No profile image</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatorImage;