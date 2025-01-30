import { Globe, Instagram, MessageSquare } from "lucide-react";
import { Creator } from "@/types/creator";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

interface CreatorSocialsProps {
  creator: Creator;
  onMessageClick?: () => void;
}

export const CreatorSocials = ({ creator, onMessageClick }: CreatorSocialsProps) => {
  if (!creator?.instagram && !creator?.website && !onMessageClick) return null;

  return (
    <div className="flex gap-3">
      {creator?.instagram && (
        <HoverCard openDelay={300} closeDelay={0}>
          <HoverCardTrigger asChild>
            <a
              href={`https://instagram.com/${creator.instagram.replace('@', '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 text-sm transition-colors duration-200"
            >
              <Instagram className="w-3.5 h-3.5" />
              {creator.instagram}
            </a>
          </HoverCardTrigger>
          <HoverCardContent 
            side="top" 
            align="start"
            className="w-64 p-3"
          >
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Instagram Profile</p>
              <p className="text-sm text-muted-foreground">
                View {creator.instagram}'s Instagram profile
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
      
      {creator?.website && (
        <HoverCard openDelay={300} closeDelay={0}>
          <HoverCardTrigger asChild>
            <a
              href={creator.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 text-sm transition-colors duration-200"
            >
              <Globe className="w-3.5 h-3.5" />
              Website
            </a>
          </HoverCardTrigger>
          <HoverCardContent 
            side="top" 
            align="start"
            className="w-64 p-3"
          >
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Creator Website</p>
              <p className="text-sm text-muted-foreground">
                Visit {creator.first_name}'s website
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
      
      {onMessageClick && (
        <HoverCard openDelay={300} closeDelay={0}>
          <HoverCardTrigger asChild>
            <button
              onClick={onMessageClick}
              className="text-gray-500 hover:text-gray-700 flex items-center gap-1.5 text-sm transition-colors duration-200"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              Message
            </button>
          </HoverCardTrigger>
          <HoverCardContent 
            side="top" 
            align="start"
            className="w-64 p-3"
          >
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Start a Conversation</p>
              <p className="text-sm text-muted-foreground">
                Send a message to {creator.first_name}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      )}
    </div>
  );
};