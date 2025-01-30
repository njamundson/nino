import { Instagram, Globe, MessageCircle } from "lucide-react";
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
      {instagram && (
        <SocialIconButton
          icon={Instagram}
          onClick={handleInstagramClick}
          tooltipText={`@${instagram.replace(/^@/, '').trim()}`}
          isActive={true}
        />
      )}
      
      {website && (
        <SocialIconButton
          icon={Globe}
          onClick={handleWebsiteClick}
          tooltipText={website}
          isActive={true}
        />
      )}
      
      <SocialIconButton
        icon={MessageCircle}
        onClick={onMessageClick}
        tooltipText="Send message"
        isActive={!!onMessageClick}
      />
    </div>
  );
};

export default SocialLinks;