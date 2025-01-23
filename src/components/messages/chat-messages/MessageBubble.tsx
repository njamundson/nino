import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import { Smile, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onReaction: (messageId: string, emoji: string) => void;
  onDelete: (messageId: string) => void;
}

const REACTION_EMOJIS = ['❤️', '👍', '😊', '😂', '🎉'];

export const MessageBubble = ({ message, isCurrentUser, onReaction, onDelete }: MessageBubbleProps) => {
  return (
    <div className={cn(
      "group relative max-w-[80%] animate-fadeIn",
      isCurrentUser ? "ml-auto" : "mr-auto"
    )}>
      <div
        className={cn(
          "px-4 py-2.5 rounded-[20px] shadow-sm transition-all duration-200",
          isCurrentUser
            ? "bg-[#0B84FE] text-white"
            : "bg-[#F1F1F1] text-[#1C1C1E]"
        )}
      >
        {message.message_type === 'image' ? (
          <img
            src={message.media_url}
            alt={message.content}
            className="rounded-lg max-w-[300px] max-h-[300px] object-cover"
          />
        ) : message.message_type === 'file' ? (
          <a
            href={message.media_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-500 hover:underline"
          >
            📎 {message.content}
          </a>
        ) : (
          <p className="text-[15px] leading-relaxed">{message.content}</p>
        )}
        
        <p className={cn(
          "text-[12px] mt-1",
          isCurrentUser ? "opacity-70" : "text-[#8E8E93]"
        )}>
          {new Date(message.created_at).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit'
          })}
        </p>

        {message.reactions?.length > 0 && (
          <div className="flex gap-1 mt-2">
            {message.reactions.map((reaction, index) => (
              <span key={index} className="text-sm bg-white/10 px-2 py-1 rounded-full">
                {reaction.emoji}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className={cn(
        "absolute top-0 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1",
        isCurrentUser ? "left-0 -translate-x-full pl-2" : "right-0 translate-x-full pr-2"
      )}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full">
              <Smile className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isCurrentUser ? "end" : "start"}>
            {REACTION_EMOJIS.map((emoji) => (
              <DropdownMenuItem
                key={emoji}
                onClick={() => onReaction(message.id, emoji)}
              >
                {emoji}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {isCurrentUser && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
            onClick={() => onDelete(message.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};