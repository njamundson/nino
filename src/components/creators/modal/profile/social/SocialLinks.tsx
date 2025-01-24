import { Instagram, Globe, MessageSquare } from "lucide-react";
import { formatInstagramUrl, formatWebsiteUrl } from "@/utils/socialMediaUtils";
import SocialIconButton from "./SocialIconButton";

interface SocialLinksProps {
  instagram: string | null;
  website: string | null;
  onMessageClick?: () => void;
}

const SocialLinks = ({ instagram, website, onMessageClick }: SocialLinksProps) => {
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
      <SocialIconButton
        icon={Instagram}
        onClick={instagram ? handleInstagramClick : undefined}
        tooltipText={instagram ? `@${instagram.replace(/^@/, '').trim()}` : 'No Instagram profile'}
        isActive={!!instagram}
      />
      
      <SocialIconButton
        icon={Globe}
        onClick={website ? handleWebsiteClick : undefined}
        tooltipText={website || 'No website available'}
        isActive={!!website}
      />
      
      {onMessageClick && (
        <SocialIconButton
          icon={MessageSquare}
          onClick={onMessageClick}
          tooltipText="Send message"
          isActive={true}
        />
      )}
    </div>
  );
};

export default SocialLinks;