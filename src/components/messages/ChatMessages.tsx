import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface ChatMessagesProps {
  messages?: Message[];
  selectedChat: string | null;
}

export const ChatMessages = ({ messages, selectedChat }: ChatMessagesProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const filteredMessages = messages?.filter(
    (m) => m.sender_id === selectedChat || m.receiver_id === selectedChat
  ).sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Mark messages as read
  useEffect(() => {
    const markMessagesAsRead = async () => {
      if (!selectedChat) return;
      
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase
        .from('messages')
        .update({ read: true })
        .eq('sender_id', selectedChat)
        .eq('receiver_id', user.id)
        .eq('read', false);
    };

    markMessagesAsRead();
  }, [selectedChat, messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {filteredMessages?.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender_id === selectedChat
                ? "justify-start"
                : "justify-end"
            }`}
          >
            <div
              className={`max-w-[70%] p-4 rounded-2xl animate-fade-in ${
                message.sender_id === selectedChat
                  ? "bg-gray-100 text-nino-text"
                  : "bg-nino-primary text-white"
              }`}
            >
              <p className="text-sm leading-relaxed">{message.content}</p>
              <p className="text-xs mt-1 opacity-70">
                {formatDate(message.created_at)}
              </p>
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};