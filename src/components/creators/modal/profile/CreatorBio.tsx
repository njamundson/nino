import { Badge } from "@/components/ui/badge";
import { Instagram, Globe, MessageSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CreatorBioProps {
  bio: string | null;
  specialties: string[] | null;
  location: string | null;
  instagram: string | null;
  website: string | null;
  onMessageClick?: () => void;
}

const CreatorBio = ({ 
  bio, 
  specialties, 
  location,
  instagram,
  website,
  onMessageClick 
}: CreatorBioProps) => {
  const handleInstagramClick = () => {
    if (instagram) {
      // Remove @ if present and any whitespace
      const username = instagram.trim().replace(/^@/, '');
      window.open(`https://instagram.com/${username}`, '_blank');
    }
  };

  const handleWebsiteClick = () => {
    if (website) {
      // Add https:// if not present
      const url = website.startsWith('http') ? website : `https://${website}`;
      window.open(url, '_blank');
    }
  };

  return (
    <div className="flex-grow space-y-6">
      {location && (
        <p className="text-nino-gray flex items-center gap-2">
          <span className="text-lg">📍</span> {location}
        </p>
      )}
      
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`p-3 rounded-2xl ${instagram ? 'bg-white/40 hover:bg-white/90 cursor-pointer' : 'bg-white/20 cursor-not-allowed'} transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm group`}
                  onClick={handleInstagramClick}
                >
                  <Instagram 
                    className={`w-[18px] h-[18px] ${instagram ? 'text-nino-primary/80 group-hover:text-nino-primary' : 'text-nino-gray/50'} transition-colors`}
                    strokeWidth={1.25} 
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {instagram ? `@${instagram.replace('@', '').trim()}` : 'No Instagram profile'}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`p-3 rounded-2xl ${website ? 'bg-white/40 hover:bg-white/90 cursor-pointer' : 'bg-white/20 cursor-not-allowed'} transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm group`}
                  onClick={handleWebsiteClick}
                >
                  <Globe 
                    className={`w-[18px] h-[18px] ${website ? 'text-nino-primary/80 group-hover:text-nino-primary' : 'text-nino-gray/50'} transition-colors`}
                    strokeWidth={1.25} 
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {website || 'No website available'}
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <div 
                  className={`p-3 rounded-2xl ${onMessageClick ? 'bg-white/40 hover:bg-white/90 cursor-pointer' : 'bg-white/20 cursor-not-allowed'} transition-all duration-300 shadow-sm hover:shadow-md backdrop-blur-sm group`}
                  onClick={onMessageClick}
                >
                  <MessageSquare 
                    className={`w-[18px] h-[18px] ${onMessageClick ? 'text-nino-primary/80 group-hover:text-nino-primary' : 'text-nino-gray/50'} transition-colors`}
                    strokeWidth={1.25} 
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {onMessageClick ? 'Send message' : 'Messaging not available'}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <h3 className="text-lg font-semibold text-nino-text">About</h3>
        <p className="text-base leading-relaxed text-nino-text/90">
          {bio || "No bio available"}
        </p>
      </div>

      {specialties && specialties.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-nino-text">Specialties</h3>
          <div className="flex flex-wrap gap-2 max-w-full">
            {specialties.map((specialty, index) => (
              <Badge 
                key={index}
                variant="outline" 
                className="px-3 py-1 rounded-full border-[1.5px] border-nino-primary/20 text-nino-primary/90 bg-white/50 hover:bg-white/80 transition-all duration-300 hover:border-nino-primary/40 whitespace-nowrap"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatorBio;