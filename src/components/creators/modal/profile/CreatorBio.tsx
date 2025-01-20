import { Badge } from "@/components/ui/badge";
import { Instagram, Globe, MessageSquare } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CreatorBioProps {
  bio: string | null;
  specialties: string[] | null;
  location: string | null;
  instagram: string | null;
  website: string | null;
}

const CreatorBio = ({ bio, specialties, location, instagram, website }: CreatorBioProps) => {
  const handleInstagramClick = () => {
    if (instagram) {
      // Remove @ if present and ensure proper URL format
      const username = instagram.startsWith('@') ? instagram.substring(1) : instagram;
      window.open(`https://instagram.com/${username}`, '_blank');
    }
  };

  const handleWebsiteClick = () => {
    if (website) {
      // Ensure URL has proper format
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
            {instagram && (
              <Tooltip>
                <TooltipTrigger>
                  <div 
                    onClick={handleInstagramClick}
                    className="p-3 rounded-2xl bg-white/40 hover:bg-white/90 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md backdrop-blur-sm group"
                  >
                    <Instagram 
                      className="w-[18px] h-[18px] text-nino-primary/80 group-hover:text-nino-primary transition-colors" 
                      strokeWidth={1.25} 
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>@{instagram.replace('@', '')}</p>
                </TooltipContent>
              </Tooltip>
            )}

            {website && (
              <Tooltip>
                <TooltipTrigger>
                  <div 
                    onClick={handleWebsiteClick}
                    className="p-3 rounded-2xl bg-white/40 hover:bg-white/90 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md backdrop-blur-sm group"
                  >
                    <Globe 
                      className="w-[18px] h-[18px] text-nino-primary/80 group-hover:text-nino-primary transition-colors" 
                      strokeWidth={1.25} 
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{website}</p>
                </TooltipContent>
              </Tooltip>
            )}

            <Tooltip>
              <TooltipTrigger>
                <div className="p-3 rounded-2xl bg-white/40 hover:bg-white/90 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md backdrop-blur-sm group">
                  <MessageSquare 
                    className="w-[18px] h-[18px] text-nino-primary/80 group-hover:text-nino-primary transition-colors" 
                    strokeWidth={1.25} 
                  />
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Send message</p>
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