import { Globe, Instagram } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CreatorSocialLinksProps {
  instagram?: string | null;
  website?: string | null;
}

const CreatorSocialLinks = ({ instagram, website }: CreatorSocialLinksProps) => {
  const isMobile = useIsMobile();
  
  if (!instagram && !website) return null;

  return (
    <div className={`flex gap-6 ${isMobile ? 'text-sm' : 'text-base'}`}>
      {instagram && (
        <a
          href={`https://instagram.com/${instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-nino-gray flex items-center gap-2 hover:text-nino-primary transition-colors"
        >
          <Instagram className="h-5 w-5" strokeWidth={1.5} />
          {instagram}
        </a>
      )}
      
      {website && (
        <a
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-nino-gray flex items-center gap-2 hover:text-nino-primary transition-colors"
        >
          <Globe className="h-5 w-5" strokeWidth={1.5} />
          Website
        </a>
      )}
    </div>
  );
};

export default CreatorSocialLinks;