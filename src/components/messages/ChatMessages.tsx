import { Message } from "@/types/message";
import MessageBubble from "./chat-messages/MessageBubble";
import { DateDivider } from "./chat-messages/DateDivider";
import { TypingIndicator } from "./chat-messages/TypingIndicator";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";

export interface ChatMessagesProps {
  messages: Message[];
  isTyping?: boolean;
  currentUserId?: string;
  onReaction?: (messageId: string, emoji: string) => void;
  selectedChat?: string | null;
  isLoading?: boolean;
}

const ChatMessages = ({
  messages,
  isTyping,
  currentUserId,
  onReaction = () => {},
  selectedChat,
  isLoading
}: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isNearBottom, setIsNearBottom] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.5,
  });

  const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

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
    scrollToBottom('auto');
  }, []);

  useEffect(() => {
    if (!selectedChat || !currentUserId) return;

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
        toast({
          title: "Error",
          description: "Failed to mark messages as read",
          variant: "destructive",
        });
      }
    };

    markMessagesAsRead();
    
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
  }, [selectedChat, currentUserId, isNearBottom, toast]);

  const messagesByDate = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = new Date(message.created_at).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  if (isLoading) {
    return (
      <div className="h-full overflow-y-auto px-4 py-6 flex flex-col space-y-6">
        {[1, 2, 3].map((_, index) => (
          <div key={index} className="space-y-4">
            <div className="flex justify-center mb-4">
              <Skeleton className="h-6 w-24 rounded-full" />
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((_, msgIndex) => (
                <div
                  key={msgIndex}
                  className={`flex ${msgIndex % 2 === 0 ? 'justify-end' : 'justify-start'}`}
                >
                  <Skeleton 
                    className={`h-[60px] w-[200px] rounded-2xl ${
                      msgIndex % 2 === 0 ? 'ml-12' : 'mr-12'
                    }`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div 
      ref={scrollContainerRef}
      className="h-full overflow-y-auto px-4 py-6 flex flex-col space-y-6"
      onScroll={handleScroll}
    >
      <AnimatePresence mode="popLayout">
        {Object.entries(messagesByDate).map(([date, dateMessages], index) => (
          <motion.div
            key={date}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
            ref={index === 0 ? inViewRef : undefined}
          >
            <DateDivider date={date} />
            <div className="space-y-4">
              {dateMessages.map((message) => (
                <motion.div
                  key={message.id}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                >
                  <MessageBubble
                    message={message}
                    isCurrentUser={message.sender_id === currentUserId}
                    onReaction={onReaction}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {isTyping && <TypingIndicator />}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;