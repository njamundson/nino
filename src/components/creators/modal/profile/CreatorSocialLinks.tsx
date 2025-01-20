import { Button } from "@/components/ui/button";
import { Instagram, Globe } from "lucide-react";
import { formatInstagramUrl, formatWebsiteUrl } from "@/utils/socialMediaUtils";

interface CreatorSocialLinksProps {
  instagram: string | null;
  website: string | null;
}

const CreatorSocialLinks = ({ instagram, website }: CreatorSocialLinksProps) => {
  if (!instagram && !website) return null;
  
  return (
    <div className="flex gap-3 flex-wrap">
      {instagram && (
        <Button
          variant="outline"
          size="lg"
          className="flex-1 min-w-[140px] rounded-xl gap-2 hover:bg-white/80 border-2"
          onClick={() => {
            const url = formatInstagramUrl(instagram);
            if (url) window.open(url, '_blank');
          }}
        >
          <Instagram className="w-5 h-5" />
          Instagram
        </Button>
      )}
      
      {website && (
        <Button
          variant="outline"
          size="lg"
          className="flex-1 min-w-[140px] rounded-xl gap-2 hover:bg-white/80 border-2"
          onClick={() => {
            const url = formatWebsiteUrl(website);
            if (url) window.open(url, '_blank');
          }}
        >
          <Globe className="w-5 h-5" />
          Website
        </Button>
      )}
    </div>
  );
};

export default CreatorSocialLinks;