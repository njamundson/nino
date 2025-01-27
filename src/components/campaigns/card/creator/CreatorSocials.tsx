import { Globe, Instagram, MessageSquare } from "lucide-react";
import { Creator } from "@/types/creator";

interface CreatorSocialsProps {
  creator: Creator;
  onMessageClick?: () => void;
}

export const CreatorSocials = ({ creator, onMessageClick }: CreatorSocialsProps) => {
  if (!creator?.instagram && !creator?.website && !onMessageClick) return null;

  return (
    <div className="flex gap-3">
      {creator?.instagram && (
        <a
          href={`https://instagram.com/${creator.instagram.replace('@', '')}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 text-sm"
        >
          <Instagram className="w-3.5 h-3.5" />
          {creator.instagram}
        </a>
      )}
      {creator?.website && (
        <a
          href={creator.website}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 text-sm"
        >
          <Globe className="w-3.5 h-3.5" />
          Website
        </a>
      )}
      {onMessageClick && (
        <button
          onClick={onMessageClick}
          className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 text-sm"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          Message
        </button>
      )}
    </div>
  );
};