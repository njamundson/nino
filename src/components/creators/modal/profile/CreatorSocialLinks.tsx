import { Button } from "@/components/ui/button";
import { Instagram, Globe } from "lucide-react";

interface CreatorSocialLinksProps {
  instagram: string | null;
  website: string | null;
}

const CreatorSocialLinks = ({ instagram, website }: CreatorSocialLinksProps) => {
  return (
    <div className="flex gap-3 flex-wrap">
      {instagram && (
        <Button
          variant="outline"
          size="lg"
          className="flex-1 min-w-[140px] rounded-xl gap-2 hover:bg-white/80 border-2"
          onClick={() => window.open(`https://instagram.com/${instagram}`, '_blank')}
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
          onClick={() => window.open(website, '_blank')}
        >
          <Globe className="w-5 h-5" />
          Website
        </Button>
      )}
    </div>
  );
};

export default CreatorSocialLinks;