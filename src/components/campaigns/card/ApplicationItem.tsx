import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { useEffect } from "react";
import { Creator } from "@/types/creator";
import { CreatorInfo } from "./creator/CreatorInfo";
import { CreatorSocials } from "./creator/CreatorSocials";
import { CreatorSpecialties } from "./creator/CreatorSpecialties";

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
    <div className="p-6 rounded-lg bg-gray-50/80 backdrop-blur-sm hover:bg-gray-50 transition-all duration-300">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 flex items-start gap-6">
          <Avatar className="h-20 w-20 rounded-full border-2 border-white shadow-sm overflow-hidden">
            {creator?.profile_image_url ? (
              <AvatarImage
                src={creator.profile_image_url}
                alt={displayName}
                className="h-full w-full object-cover"
              />
            ) : (
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xl">
                {getInitials(displayName)}
              </AvatarFallback>
            )}
          </Avatar>
          
          <div className="space-y-4 flex-1">
            <CreatorInfo creator={creator} />
            <CreatorSocials creator={creator} />
            <CreatorSpecialties specialties={creator?.specialties} />

            <div className="space-y-2">
              <h5 className="font-medium text-gray-700">Application Message:</h5>
              <p className="text-gray-600 leading-relaxed">
                {application.cover_letter}
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <Button
            size="sm"
            variant="outline"
            onClick={onViewProfile}
            className="text-gray-600 hover:text-gray-900 rounded-full"
          >
            <Eye className="h-4 w-4 mr-1.5" />
            View Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationItem;