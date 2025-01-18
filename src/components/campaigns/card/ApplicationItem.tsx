import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, MessageSquare } from "lucide-react";

interface ApplicationItemProps {
  application: any;
  onViewProfile: () => void;
  onMessageCreator: () => void;
}

const ApplicationItem = ({ application, onViewProfile, onMessageCreator }: ApplicationItemProps) => {
  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  const creatorProfile = application.creator?.profile;
  const creatorName = creatorProfile?.first_name && creatorProfile?.last_name
    ? `${creatorProfile.first_name} ${creatorProfile.last_name}`
    : 'Anonymous Creator';

  console.log('Creator profile data:', {
    profile: creatorProfile,
    fullCreator: application.creator
  }); // Debug log

  return (
    <div className="p-6 rounded-lg bg-gray-50 flex items-start justify-between gap-6">
      <div className="flex-1 flex items-start gap-6">
        <Avatar className="h-16 w-16 rounded-full border-2 border-white shadow-sm overflow-hidden">
          {application.creator?.profile_image_url ? (
            <AvatarImage
              src={application.creator.profile_image_url}
              alt={creatorName}
              className="h-full w-full object-cover"
            />
          ) : (
            <AvatarFallback className="bg-gray-100 text-gray-600">
              {getInitials(
                creatorProfile?.first_name || '',
                creatorProfile?.last_name || ''
              )}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-3 flex-1">
          <div>
            <h4 className="text-2xl font-medium text-gray-900 tracking-tight">
              {creatorName}
            </h4>
            {application.creator?.location && (
              <p className="text-sm text-gray-500">
                📍 {application.creator.location}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <h5 className="font-medium text-gray-700">Application Message:</h5>
            <p className="text-gray-600 leading-relaxed">
              {application.cover_letter}
            </p>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={onViewProfile}
          className="text-gray-600 hover:text-gray-900"
        >
          <Eye className="h-4 w-4 mr-1" />
          View Profile
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={onMessageCreator}
          className="text-gray-600 hover:text-gray-900"
        >
          <MessageSquare className="h-4 w-4 mr-1" />
          Message
        </Button>
      </div>
    </div>
  );
};

export default ApplicationItem;