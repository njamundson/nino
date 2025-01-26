import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useEffect } from "react";
import { Creator } from "@/types/creator";

interface ApplicationItemProps {
  application: {
    id: string;
    status: string;
    cover_letter: string;
    creator: Creator;
  };
  onViewProfile: () => void;
  onMessageCreator: () => void;
}

const ApplicationItem = ({ application, onViewProfile }: ApplicationItemProps) => {
  useEffect(() => {
    console.log('Application data:', application);
    console.log('Creator data:', application?.creator);
  }, [application]);

  const creator = application?.creator;
  
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  const displayName = creator?.first_name 
    ? `${creator.first_name} ${creator.last_name || ''}`
    : 'Anonymous Creator';

  return (
    <div className="group p-4 rounded-lg bg-white border border-gray-100 hover:shadow-sm transition-all duration-200">
      <h2 className="font-semibold text-lg text-gray-900 mb-3 px-1">
        {displayName}
      </h2>
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 rounded-full ring-2 ring-white">
          {creator?.profile_image_url ? (
            <AvatarImage
              src={creator.profile_image_url}
              alt={displayName}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-gray-50 text-gray-600 text-sm">
              {getInitials(displayName)}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1.5">
            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed flex-1 mr-3">
              {application.cover_letter}
            </p>
            <Button
              size="sm"
              variant="ghost"
              onClick={onViewProfile}
              className="text-gray-500 hover:text-gray-900 shrink-0"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationItem;