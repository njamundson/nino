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
    <div className="space-y-4">
      <h2 className="text-4xl font-semibold text-gray-900 px-6 pt-4">
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
            creatorId={creator.id}
            onMessageClick={onMessageClick}
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
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Application Details</h3>
              <span className="px-3 py-1 rounded-full text-sm font-medium capitalize bg-gray-100 text-gray-700">
                {application.status}
              </span>
            </div>
            
            <div className="space-y-4">
              {application.opportunity && (
                <div>
                  <p className="text-sm font-medium text-gray-700">Campaign</p>
                  <p className="text-base text-gray-900">{application.opportunity.title}</p>
                </div>
              )}
              
              {application.cover_letter && (
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Message from Creator</p>
                  <div className="bg-white rounded-lg p-4 border border-gray-100">
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {application.cover_letter}
                    </p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500 pt-2">
                <p>Submitted {new Date(application.created_at || '').toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorProfile;