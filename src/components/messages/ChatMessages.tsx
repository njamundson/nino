import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Heart, ThumbsUp, Smile } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  message_type?: string;
  media_url?: string;
  media_type?: string;
  is_edited?: boolean;
  reactions?: { emoji: string; user_id: string }[];
}

interface ChatMessagesProps {
  messages?: Message[];
  selectedChat: string | null;
  onEditMessage?: (message: { id: string; content: string }) => void;
}

const REACTION_EMOJIS = ['❤️', '👍', '😊', '😂', '🎉'];

export const ChatMessages = ({ messages, selectedChat, onEditMessage }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [typingStatus, setTypingStatus] = useState<boolean>(false);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedChat) return;

    const channel = supabase
      .channel('typing-status')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `chat_with=eq.${currentUserId}`,
        },
        (payload: any) => {
          setTypingStatus(payload.new.is_typing);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedChat, currentUserId]);

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      const { error } = await supabase
        .from('message_reactions')
        .upsert({
          message_id: messageId,
          user_id: currentUserId,
          emoji,
        });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding reaction:', error);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('messages')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', messageId)
        .eq('sender_id', currentUserId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const filteredMessages = messages
    ?.filter(m => !m.deleted_at && (m.sender_id === selectedChat || m.receiver_id === selectedChat))
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const groupedMessages = filteredMessages?.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = new Date(message.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <ScrollArea className="flex-1 px-4">
      <div className="space-y-6 py-4">
        {groupedMessages && Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-4">
            <div className="sticky top-0 z-10 flex justify-center">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-500">
                {date}
              </span>
            </div>
            {dateMessages.map((message) => {
              const isCurrentUser = message.sender_id === currentUserId;
              
              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
                  <div className="group relative">
                    <div
                      className={cn(
                        "max-w-[70%] px-4 py-2 rounded-2xl text-sm",
                        isCurrentUser
                          ? "bg-nino-primary text-white"
                          : "bg-gray-100 text-gray-900"
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
                        <p className="leading-relaxed">{message.content}</p>
                      )}
                      
                      {message.is_edited && (
                        <span className="text-[10px] opacity-70">(edited)</span>
                      )}
                      
                      <p className="text-[10px] mt-1 opacity-70">
                        {new Date(message.created_at).toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit'
                        })}
                      </p>

                      {message.reactions?.length > 0 && (
                        <div className="flex gap-1 mt-2">
                          {message.reactions.map((reaction, index) => (
                            <span key={index} className="text-sm">
                              {reaction.emoji}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8">
                            <Smile className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {REACTION_EMOJIS.map((emoji) => (
                            <DropdownMenuItem
                              key={emoji}
                              onClick={() => handleReaction(message.id, emoji)}
                            >
                              {emoji}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>

                      {isCurrentUser && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8"
                            onClick={() => onEditMessage?.({ id: message.id, content: message.content })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8"
                            onClick={() => handleDeleteMessage(message.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        {typingStatus && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="animate-pulse">●●●</div>
            Someone is typing...
          </div>
        )}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};