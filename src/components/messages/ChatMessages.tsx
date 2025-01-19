import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDate } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

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

  // Group messages by date
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
            {dateMessages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender_id === selectedChat ? "justify-start" : "justify-end"
                )}
              >
                <div
                  className={cn(
                    "max-w-[70%] px-4 py-2 rounded-2xl text-sm",
                    message.sender_id === selectedChat
                      ? "bg-gray-100 text-gray-900"
                      : "bg-nino-primary text-white"
                  )}
                >
                  <p className="leading-relaxed">{message.content}</p>
                  <p className="text-[10px] mt-1 opacity-70">
                    {new Date(message.created_at).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};