import { cn } from "@/lib/utils";
import { Message } from "@/types/message";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

interface MessageBubbleProps {
  message: Message;
  isCurrentUser: boolean;
  onReaction?: (messageId: string, emoji: string) => void;
}

const MessageBubble = ({ message, isCurrentUser, onReaction }: MessageBubbleProps) => {
  const [reactions, setReactions] = useState<{ emoji: string; count: number }[]>([]);
  const [userReaction, setUserReaction] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchReactions();
    subscribeToReactions();
  }, [message.id]);

  const fetchReactions = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    const { data, error } = await supabase
      .from('message_reactions')
      .select('emoji, user_id')
      .eq('message_id', message.id);

    if (error) {
      console.error('Error fetching reactions:', error);
      return;
    }

    // Find user's current reaction if any
    if (user) {
      const userCurrentReaction = data.find(r => r.user_id === user.id);
      setUserReaction(userCurrentReaction?.emoji || null);
    }

    // Count reactions
    const reactionCounts = data.reduce((acc: { [key: string]: number }, reaction) => {
      acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
      return acc;
    }, {});

    setReactions(
      Object.entries(reactionCounts).map(([emoji, count]) => ({
        emoji,
        count,
      }))
    );
  };

  const subscribeToReactions = () => {
    const channel = supabase
      .channel(`message_reactions:${message.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_reactions',
          filter: `message_id=eq.${message.id}`,
        },
        () => {
          fetchReactions();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const handleReaction = async (emoji: string) => {
    // If user already has a reaction and it's different, remove the old one first
    if (userReaction && userReaction !== emoji) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Remove old reaction from database
      await supabase
        .from('message_reactions')
        .delete()
        .match({ 
          message_id: message.id,
          user_id: user.id 
        });
    }

    // If selecting the same emoji, do nothing
    if (userReaction === emoji) return;

    // Optimistically update the UI
    const existingReaction = reactions.find(r => r.emoji === emoji);
    let updatedReactions = reactions;

    if (userReaction) {
      // Remove old reaction count
      updatedReactions = updatedReactions.map(r => 
        r.emoji === userReaction 
          ? { ...r, count: Math.max(0, r.count - 1) }
          : r
      ).filter(r => r.count > 0);
    }

    updatedReactions = existingReaction
      ? updatedReactions.map(r => 
          r.emoji === emoji 
            ? { ...r, count: r.count + 1 }
            : r
        )
      : [...updatedReactions, { emoji, count: 1 }];
    
    setReactions(updatedReactions);
    setUserReaction(emoji);

    if (onReaction) {
      try {
        await onReaction(message.id, emoji);
        toast({
          title: "Reaction updated",
          description: `You reacted with ${emoji}`,
        });
      } catch (error) {
        // Revert optimistic update on error
        setReactions(reactions);
        setUserReaction(userReaction);
        toast({
          title: "Error",
          description: "Failed to update reaction",
          variant: "destructive",
        });
      }
    }
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

      <AnimatePresence>
        {reactions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              "absolute -bottom-6 flex gap-1 items-center",
              isCurrentUser ? "right-2" : "left-2"
            )}
          >
            <motion.div 
              layout
              className="bg-white rounded-full px-2 py-1 shadow-md flex items-center gap-1"
            >
              {reactions.map(({ emoji, count }, index) => (
                <motion.span
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="text-sm"
                >
                  {emoji}{count > 1 && count}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                className={cn(
                  "h-8 w-8 hover:bg-gray-100 rounded-full",
                  userReaction === emoji && "bg-gray-100"
                )}
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