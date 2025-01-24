import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Smile, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onReaction?: (messageId: string, emoji: string) => void;
  onDelete?: (messageId: string) => void;
}

const MessageBubble = ({ message, isCurrentUser, onReaction, onDelete }: MessageBubbleProps) => {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div className={cn(
      "group relative max-w-[80%] animate-fadeIn",
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
        "absolute -bottom-8 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1",
        isCurrentUser ? "-left-2" : "-right-2"
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
          <DropdownMenuContent align={isCurrentUser ? "start" : "end"}>
            <div className="flex p-1 gap-1">
              {REACTION_EMOJIS.map((emoji) => (
                <Button
                  key={emoji}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-gray-100 rounded-full"
                  onClick={() => onReaction?.(message.id, emoji)}
                >
                  {emoji}
                </Button>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {isCurrentUser && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="secondary"
                size="icon"
                className="h-8 w-8 rounded-full bg-white shadow-md hover:bg-gray-50"
              >
                <Trash2 className="h-4 w-4 text-gray-600" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Message</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this message? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete?.(message.id)}
                  className="bg-red-600 hover:bg-red-700"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;