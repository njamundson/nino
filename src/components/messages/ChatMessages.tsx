import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageBubble } from "./chat-messages/MessageBubble";
import { DateDivider } from "./chat-messages/DateDivider";
import { TypingIndicator } from "./chat-messages/TypingIndicator";

export interface Message {
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
  onMessageUpdate?: () => void;
}

export const ChatMessages = ({ messages, selectedChat, onMessageUpdate }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [typingStatus, setTypingStatus] = useState<boolean>(false);
  const { toast } = useToast();

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
    if (!selectedChat || !currentUserId) return;

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
      if (onMessageUpdate) onMessageUpdate();
    } catch (error) {
      console.error('Error adding reaction:', error);
      toast({
        title: "Error adding reaction",
        description: "Please try again later",
        variant: "destructive",
      });
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
      if (onMessageUpdate) onMessageUpdate();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        title: "Error deleting message",
        description: "Please try again later",
        variant: "destructive",
      });
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
    <ScrollArea className="h-[calc(100vh-20rem)]">
      <div className="space-y-6 p-4">
        {groupedMessages && Object.entries(groupedMessages).map(([date, dateMessages]) => (
          <div key={date} className="space-y-6">
            <DateDivider date={date} />
            {dateMessages.map((message) => {
              const isCurrentUser = message.sender_id === currentUserId;
              
              return (
                <div
                  key={message.id}
                  className={`flex w-full mb-4 ${
                    isCurrentUser ? "justify-end" : "justify-start"
                  }`}
                >
                  <MessageBubble
                    message={message}
                    isCurrentUser={isCurrentUser}
                    onReaction={handleReaction}
                    onDelete={handleDeleteMessage}
                  />
                </div>
              );
            })}
          </div>
        ))}
        {typingStatus && <TypingIndicator />}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};