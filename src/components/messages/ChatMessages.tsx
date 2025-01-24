import { Message } from "@/types/message";
import MessageBubble from "./chat-messages/MessageBubble";
import { DateDivider } from "./chat-messages/DateDivider";
import { TypingIndicator } from "./chat-messages/TypingIndicator";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface ChatMessagesProps {
  messages: Message[];
  isTyping?: boolean;
  currentUserId?: string;
  onReaction?: (messageId: string, emoji: string) => void;
  onDelete?: (messageId: string) => void;
  selectedChat?: string | null;
}

const ChatMessages = ({
  messages,
  isTyping,
  currentUserId,
  onReaction = () => {},
  onDelete = () => {},
  selectedChat
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Check if user is near bottom of scroll
  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const scrollPosition = scrollHeight - scrollTop - clientHeight;
      setIsNearBottom(scrollPosition < 100);
    }
  };

  useEffect(() => {
    if (isNearBottom) {
      scrollToBottom();
    }
  }, [messages, isNearBottom]);

  useEffect(() => {
    // Initial scroll to bottom
    scrollToBottom('auto');
  }, []);

  useEffect(() => {
    if (!selectedChat || !currentUserId) return;

    // Mark messages as read when viewed
    const markMessagesAsRead = async () => {
      try {
        const { error } = await supabase
          .from('messages')
          .update({ read: true })
          .eq('sender_id', selectedChat)
          .eq('receiver_id', currentUserId)
          .eq('read', false);

        if (error) throw error;
      } catch (error) {
        console.error('Error marking messages as read:', error);
      }
    };

    markMessagesAsRead();
    
    // Subscribe to new messages
    const channel = supabase
      .channel(`chat:${selectedChat}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${selectedChat},receiver_id=eq.${currentUserId}`
        },
        (payload) => {
          console.log('Received message update:', payload);
          if (isNearBottom) {
            scrollToBottom();
          }
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up message subscription');
      supabase.removeChannel(channel);
    };
  }, [selectedChat, currentUserId, isNearBottom]);

  const messagesByDate = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = new Date(message.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div 
      ref={scrollContainerRef}
      className="h-full overflow-y-auto px-6 py-8 space-y-6"
      onScroll={handleScroll}
    >
      {Object.entries(messagesByDate).map(([date, dateMessages]) => (
        <div key={date} className="space-y-4">
          <DateDivider date={date} />
          {dateMessages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isCurrentUser={message.sender_id === currentUserId}
              onReaction={onReaction}
              onDelete={onDelete}
            />
          ))}
        </div>
      ))}
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;