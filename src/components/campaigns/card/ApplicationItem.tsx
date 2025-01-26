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

  // Truncate cover letter to first 150 characters
  const truncatedMessage = application.cover_letter?.length > 150 
    ? `${application.cover_letter.substring(0, 150)}...` 
    : application.cover_letter;

  return (
    <div className="group p-5 rounded-xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 rounded-full ring-2 ring-white shadow-sm">
          {creator?.profile_image_url ? (
            <AvatarImage
              src={creator.profile_image_url}
              alt={displayName}
              className="object-cover"
            />
          ) : (
            <AvatarFallback className="bg-gray-100 text-gray-600">
              {getInitials(displayName)}
            </AvatarFallback>
          )}
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-gray-900 truncate">
              {displayName}
            </h3>
            <Button
              size="sm"
              variant="ghost"
              onClick={onViewProfile}
              className="text-gray-600 hover:text-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            >
              <Eye className="h-4 w-4 mr-1.5" />
              View Profile
            </Button>
          </div>
          
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {truncatedMessage}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationItem;