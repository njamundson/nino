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

  return (
    <div className="p-6 rounded-lg bg-gray-50 flex items-start justify-between">
      <div className="flex-1 flex items-start gap-6">
        <Avatar className="h-16 w-16 rounded-full border-2 border-white shadow-sm overflow-hidden">
          {application.creator?.profile_image_url ? (
            <AvatarImage
              src={`${application.creator.profile_image_url}?${new Date().getTime()}`}
              alt={`${application.creator?.profile?.first_name || ''} ${application.creator?.profile?.last_name || ''}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <AvatarFallback className="bg-gray-100 text-gray-600">
              {getInitials(
                application.creator?.profile?.first_name || '',
                application.creator?.profile?.last_name || ''
              )}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="space-y-2 flex-1">
          <h4 className="text-2xl font-medium text-gray-900 tracking-tight">
            {application.creator?.profile?.first_name} {application.creator?.profile?.last_name}
          </h4>
          <p className="text-gray-600 leading-relaxed">
            {application.cover_letter}
          </p>
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