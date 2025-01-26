import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye, MapPin } from "lucide-react";
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
            <div>
              <h3 className="font-medium text-gray-900">
                {displayName}
              </h3>
              {creator?.location && (
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {creator.location}
                </p>
              )}
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={onViewProfile}
              className="text-gray-500 hover:text-gray-900"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="mt-3 bg-gray-50/80 backdrop-blur-sm p-3 rounded-lg border border-gray-100">
            <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
              {application.cover_letter}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationItem;