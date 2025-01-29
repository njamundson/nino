import { Creator } from "@/types/creator";
import CreatorBio from "./profile/CreatorBio";
import CreatorImage from "./profile/CreatorImage";
import CreatorSocialLinks from "./profile/CreatorSocialLinks";
import { Application } from "@/integrations/supabase/types/opportunity";

interface CreatorProfileProps {
  creator: Creator;
  onClose?: () => void;
  onInviteClick?: () => void;
  onMessageClick?: () => void;
  application?: Application | null;
}

const CreatorProfile = ({ creator, onClose, onInviteClick, onMessageClick, application }: CreatorProfileProps) => {
  if (!creator) return null;

  const fullName = creator.first_name && creator.last_name 
    ? `${creator.first_name} ${creator.last_name}`
    : creator.first_name || 'Creator';

  return (
    <div className="space-y-6">
      <h2 className="text-4xl font-semibold text-gray-900 px-6 pt-6">
        {fullName}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
        <CreatorImage 
          profileImageUrl={creator.profile_image_url} 
          fullName={fullName} 
        />
        <div className="space-y-6">
          <CreatorBio 
            bio={creator.bio}
            specialties={creator.specialties}
            location={creator.location}
            instagram={creator.instagram}
            website={creator.website}
            onMessageClick={onMessageClick}
            coverLetter={application?.cover_letter}
          />
          <CreatorSocialLinks 
            instagram={creator.instagram}
            website={creator.website}
          />
        </div>
      </div>

      {application && (
        <div className="px-6 pb-6">
          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
            
            <div className="space-y-2">
              {application.opportunity && (
                <p className="text-sm text-gray-500">
                  Submitted for: {application.opportunity.title}
                </p>
              )}
              {application.cover_letter && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Cover Letter</p>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">
                    {application.cover_letter}
                  </p>
                </div>
              )}
              <p className="text-sm text-gray-500">
                Status: <span className="font-medium capitalize">{application.status}</span>
              </p>
              <p className="text-sm text-gray-500">
                Submitted: {new Date(application.created_at || '').toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorProfile;