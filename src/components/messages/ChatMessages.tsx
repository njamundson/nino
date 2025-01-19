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
  deleted_at?: string;
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
          <div key={date} className="space-y-6">
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
                    "flex w-full mb-4",
                    isCurrentUser ? "justify-end" : "justify-start"
                  )}
                >
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
                      
                      {message.is_edited && (
                        <span className="text-[10px] opacity-70 ml-2">(edited)</span>
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
                            className="h-8 w-8 p-0 hover:bg-gray-100"
                            onClick={() => onEditMessage?.({ id: message.id, content: message.content })}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-gray-100"
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
          <div className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
            <div className="flex gap-1">
              <span className="opacity-60">●</span>
              <span className="opacity-80">●</span>
              <span>●</span>
            </div>
            Someone is typing...
          </div>
        )}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};