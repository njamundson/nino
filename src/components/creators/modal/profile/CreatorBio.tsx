import { Badge } from "@/components/ui/badge";
import { Instagram, Globe, MessageSquare } from "lucide-react";

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
      // Remove @ symbol if present
      const username = instagram.startsWith('@') ? instagram.substring(1) : instagram;
      window.open(`https://instagram.com/${username}`, '_blank');
    }
  };

  const handleWebsiteClick = () => {
    if (website) {
      // Add https if not present
      const url = website.startsWith('http') ? website : `https://${website}`;
      window.open(url, '_blank');
    }
  };

  const handleMessageClick = () => {
    // This will be implemented later when we add the messaging feature
    console.log('Message clicked');
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
          {instagram && (
            <div 
              onClick={handleInstagramClick}
              className="p-3 rounded-2xl bg-white/40 hover:bg-white/90 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md backdrop-blur-sm group"
              title={`@${instagram}`}
            >
              <Instagram 
                className="w-[18px] h-[18px] text-nino-primary/80 group-hover:text-nino-primary transition-colors" 
                strokeWidth={1.25} 
              />
            </div>
          )}
          
          {website && (
            <div 
              onClick={handleWebsiteClick}
              className="p-3 rounded-2xl bg-white/40 hover:bg-white/90 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md backdrop-blur-sm group"
              title={website}
            >
              <Globe 
                className="w-[18px] h-[18px] text-nino-primary/80 group-hover:text-nino-primary transition-colors" 
                strokeWidth={1.25} 
              />
            </div>
          )}
          
          <div 
            onClick={handleMessageClick}
            className="p-3 rounded-2xl bg-white/40 hover:bg-white/90 transition-all duration-300 cursor-pointer shadow-sm hover:shadow-md backdrop-blur-sm group"
            title="Send message"
          >
            <MessageSquare 
              className="w-[18px] h-[18px] text-nino-primary/80 group-hover:text-nino-primary transition-colors" 
              strokeWidth={1.25} 
            />
          </div>
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