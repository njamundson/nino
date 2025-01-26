import { Instagram, Globe, MessageCircle } from "lucide-react";
import SocialIconButton from "./SocialIconButton";
import { validateInstagramHandle, validateWebsiteUrl } from "@/types/creator";

interface SocialLinksProps {
  instagram: string | null;
  website: string | null;
  onMessageClick?: () => void;
}

const SocialLinks = ({ instagram, website, onMessageClick }: SocialLinksProps) => {
  const getInstagramUrl = (handle: string) => {
    const username = handle.startsWith('@') ? handle.slice(1) : handle;
    return `https://instagram.com/${username}`;
  };

  return (
    <div className="flex items-center gap-3">
      {instagram && validateInstagramHandle(instagram) && (
        <SocialIconButton
          icon={<Instagram className="w-5 h-5" />}
          href={getInstagramUrl(instagram)}
          label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        />
      )}
      
      {website && validateWebsiteUrl(website) && (
        <SocialIconButton
          icon={<Globe className="w-5 h-5" />}
          href={website}
          label="Website"
          target="_blank"
          rel="noopener noreferrer"
        />
      )}

      {onMessageClick && (
        <SocialIconButton
          icon={<MessageCircle className="w-5 h-5" />}
          onClick={onMessageClick}
          label="Message"
        />
      )}
    </div>
  );
};

export default SocialLinks;