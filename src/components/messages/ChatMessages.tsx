import { Message } from "@/types/message";
import MessageBubble from "./chat-messages/MessageBubble";
import { DateDivider } from "./chat-messages/DateDivider";
import { TypingIndicator } from "./chat-messages/TypingIndicator";
import { useEffect, useRef } from "react";
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!selectedChat || !currentUserId) return;

    console.log('Setting up real-time subscription for messages...');
    
    const channel = supabase
      .channel('messages')
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
          scrollToBottom();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=eq.${currentUserId},receiver_id=eq.${selectedChat}`
        },
        (payload) => {
          console.log('Received message update:', payload);
          scrollToBottom();
        }
      )
      .subscribe(status => {
        console.log('Subscription status:', status);
      });

    return () => {
      console.log('Cleaning up message subscription');
      supabase.removeChannel(channel);
    };
  }, [selectedChat, currentUserId]);

  useEffect(() => {
    if (!selectedChat) return;

    console.log('Setting up typing status subscription...');
    
    const channel = supabase
      .channel('typing_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'typing_status',
          filter: `chat_with=eq.${selectedChat}`
        },
        (payload) => {
          console.log('Typing status changed:', payload);
          scrollToBottom();
        }
      )
      .subscribe();

    return () => {
      console.log('Cleaning up typing subscription');
      supabase.removeChannel(channel);
    };
  }, [selectedChat]);

  const messagesByDate = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = new Date(message.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <div className="h-full overflow-y-auto px-6 py-8 space-y-6">
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