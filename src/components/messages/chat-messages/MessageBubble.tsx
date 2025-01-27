import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onReaction?: (messageId: string, emoji: string) => void;
}

const MessageBubble = ({ message, isCurrentUser, onReaction }: MessageBubbleProps) => {
  const [showReactions, setShowReactions] = useState(false);
  const { toast } = useToast();

  const handleReaction = (emoji: string) => {
    onReaction?.(message.id, emoji);
    toast({
      title: "Reaction added",
      description: `You reacted with ${emoji}`,
    });
  };

  return (
    <div className={cn(
      "group relative max-w-[80%] animate-fadeIn mb-8",
      isCurrentUser ? "ml-auto" : "mr-auto"
    )}>
      <div
        className={cn(
          "px-4 py-2.5 shadow-sm transition-all duration-200",
          isCurrentUser 
            ? "bg-[#0B84FE] text-white rounded-[20px] rounded-tr-[4px]" 
            : "bg-[#E9E9EB] text-[#1C1C1E] rounded-[20px] rounded-tl-[4px]"
        )}
      >
        {message.content}
        <p className={cn(
          "text-[11px] mt-1 select-none",
          isCurrentUser ? "text-white/70" : "text-[#8E8E93]"
        )}>
          {new Date(message.created_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </p>
      </div>

      <div className={cn(
        "absolute bottom-0 translate-y-full opacity-0 group-hover:opacity-100 transition-all duration-200 flex gap-1 pt-2 z-10",
        isCurrentUser ? "left-0" : "right-0"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-50"
            >
              <Smile className="h-4 w-4 text-gray-600" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align={isCurrentUser ? "start" : "end"}
            className="p-1 flex gap-1 min-w-0"
            sideOffset={5}
          >
            {REACTION_EMOJIS.map((emoji) => (
              <Button
                key={emoji}
                variant="ghost"
                size="icon"
                className="h-8 w-8 hover:bg-gray-100 rounded-full"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MessageBubble;