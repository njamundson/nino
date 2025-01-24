import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, MapPin, Globe, Instagram } from "lucide-react";
import { useEffect } from "react";

interface ApplicationItemProps {
  application: any;
  onViewProfile: () => void;
  onMessageCreator: () => void;
}

const ApplicationItem = ({ application, onViewProfile }: ApplicationItemProps) => {
  // Debug logging to help us see the data structure
  useEffect(() => {
    console.log('Full application data:', application);
  }, [application]);

  const getInitials = (name: string = '') => {
    const parts = name.split(' ');
    return parts.map(part => part[0] || '').join('').toUpperCase();
  };

  // Extract creator data
  const creator = application?.creator;
  
  // Get the creator's name, checking all possible sources
  const getCreatorName = () => {
    // First check if we have a profile with first and last name
    if (creator?.profile?.first_name && creator?.profile?.last_name) {
      return `${creator.profile.first_name} ${creator.profile.last_name}`;
    }
    
    // Then check if we have first and last name directly on creator
    if (creator?.first_name && creator?.last_name) {
      return `${creator.first_name} ${creator.last_name}`;
    }
    
    // If no name is found, return Anonymous
    return 'Anonymous Creator';
  };

  const creatorName = getCreatorName();

  return (
    <div className="p-6 rounded-lg bg-gray-50/80 backdrop-blur-sm hover:bg-gray-50 transition-all duration-300">
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1 flex items-start gap-6">
          <Avatar className="h-20 w-20 rounded-full border-2 border-white shadow-sm overflow-hidden">
            {creator?.profile_image_url ? (
              <AvatarImage
                src={creator.profile_image_url}
                alt={creatorName}
                className="h-full w-full object-cover"
              />
            ) : (
              <AvatarFallback className="bg-gray-100 text-gray-600 text-xl">
                {getInitials(creatorName)}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="space-y-4 flex-1">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-xl font-medium text-gray-900">
                  {creatorName}
                </h4>
                {creator?.creator_type && (
                  <Badge variant="secondary" className="capitalize">
                    {creator.creator_type}
                  </Badge>
                )}
              </div>
              {creator?.location && (
                <p className="text-sm text-gray-500 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {creator.location}
                </p>
              )}
            </div>

            {/* Social Links */}
            {(creator?.instagram || creator?.website) && (
              <div className="flex gap-3">
                {creator?.instagram && (
                  <a
                    href={`https://instagram.com/${creator.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 text-sm"
                  >
                    <Instagram className="w-3.5 h-3.5" />
                    {creator.instagram}
                  </a>
                )}
                {creator?.website && (
                  <a
                    href={creator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 text-sm"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    Website
                  </a>
                )}
              </div>
            )}

            {/* Specialties */}
            {creator?.specialties && creator.specialties.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {creator.specialties.map((specialty: string, index: number) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-white/50"
                  >
                    {specialty}
                  </Badge>
                ))}
              </div>
            )}

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