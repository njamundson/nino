import { Instagram, Globe, MessageSquare, Share2 } from "lucide-react";
import { formatInstagramUrl, formatWebsiteUrl } from "@/utils/socialMediaUtils";
import SocialIconButton from "./SocialIconButton";

interface SocialLinksProps {
  instagram: string | null;
  website: string | null;
  onMessageClick?: () => void;
  onShareClick?: () => void;
}

const SocialLinks = ({ 
  instagram, 
  website, 
  onMessageClick,
  onShareClick 
}: SocialLinksProps) => {
  const handleInstagramClick = () => {
    const url = formatInstagramUrl(instagram);
    if (url) window.open(url, '_blank');
  };

  const handleWebsiteClick = () => {
    const url = formatWebsiteUrl(website);
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="flex items-center gap-3">
      <SocialIconButton
        icon={Instagram}
        onClick={instagram ? handleInstagramClick : undefined}
        tooltipText={instagram ? `@${instagram.replace(/^@/, '')}` : 'No Instagram profile'}
        isActive={!!instagram}
        label="Instagram"
      />
      
      <SocialIconButton
        icon={Globe}
        onClick={website ? handleWebsiteClick : undefined}
        tooltipText={website || 'No website available'}
        isActive={!!website}
        label="Website"
      />
      
      <SocialIconButton
        icon={MessageSquare}
        onClick={onMessageClick}
        tooltipText={onMessageClick ? 'Send message' : 'Messaging not available'}
        isActive={!!onMessageClick}
        label="Message"
      />

      <SocialIconButton
        icon={Share2}
        onClick={onShareClick}
        tooltipText="Share profile"
        isActive={true}
        label="Share"
      />
    </div>
  );
};

export default SocialLinks;