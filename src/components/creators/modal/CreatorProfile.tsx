import { Creator } from "@/types/creator";
import CreatorBio from "./profile/CreatorBio";
import CreatorImage from "./profile/CreatorImage";
import CreatorSocialLinks from "./profile/CreatorSocialLinks";

interface CreatorProfileProps {
  creator: Creator;
  onClose?: () => void;
}

const CreatorProfile = ({ creator, onClose }: CreatorProfileProps) => {
  const fullName = creator.first_name && creator.last_name 
    ? `${creator.first_name} ${creator.last_name}`
    : 'Creator';

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900 px-6 pt-6">
        {fullName}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
        <CreatorImage creator={creator} />
        <div className="space-y-6">
          <CreatorBio creator={creator} />
          <CreatorSocialLinks creator={creator} />
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;