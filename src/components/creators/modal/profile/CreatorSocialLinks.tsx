import { Button } from "@/components/ui/button";
import { Instagram, Globe, MessageCircle } from "lucide-react";
import { formatInstagramUrl, formatWebsiteUrl } from "@/utils/socialMediaUtils";

interface CreatorSocialLinksProps {
  instagram: string | null;
  website: string | null;
  onMessageClick?: () => void;
}

const CreatorSocialLinks = ({ instagram, website, onMessageClick }: CreatorSocialLinksProps) => {
  const handleInstagramClick = () => {
    if (!instagram) return;
    const url = formatInstagramUrl(instagram);
    if (url) window.open(url, '_blank');
  };

  const handleWebsiteClick = () => {
    if (!website) return;
    const url = formatWebsiteUrl(website);
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="flex items-center gap-3">
      {instagram && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleInstagramClick}
          className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
        >
          <Instagram className="w-5 h-5" />
        </Button>
      )}
      
      {website && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleWebsiteClick}
          className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
        >
          <Globe className="w-5 h-5" />
        </Button>
      )}
      
      {onMessageClick && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onMessageClick}
          className="rounded-full hover:bg-nino-primary/10 hover:text-nino-primary"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default CreatorSocialLinks;