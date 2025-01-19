import { cn } from "@/lib/utils";
import { Message } from "../ChatMessages";
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
      isCurrentUser ? "items-end" : "items-start"
    )}>
      <div
        className={cn(
          "px-6 py-4 rounded-2xl shadow-sm transition-all duration-200",
          isCurrentUser
            ? "bg-nino-primary text-white rounded-br-sm"
            : "bg-gray-100 text-gray-900 rounded-bl-sm"
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
          <p className="leading-relaxed text-[15px]">{message.content}</p>
        )}
        
        <p className="text-[10px] mt-2 opacity-70">
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
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
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
            className="h-8 w-8 p-0 hover:bg-gray-100"
            onClick={() => onDelete(message.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};