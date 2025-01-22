import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatContainer from "@/components/messages/ChatContainer";
import { Message } from "@/types/message";
import { useMessages } from "@/hooks/useMessages";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");
  const { messages, sendMessage, markAsRead } = useMessages(userId);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (userId && messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg) => !msg.read && msg.sender_id === userId
      );
      if (unreadMessages.length > 0) {
        markAsRead(unreadMessages.map((msg) => msg.id));
      }
    }
  }, [userId, messages, markAsRead]);

  // Type assertion to handle the conversion
  const typedMessages = messages as unknown as Message[];

  return (
    <div className="h-screen bg-gray-50">
      <ChatContainer
        messages={typedMessages}
        selectedMessage={selectedMessage}
        onSelectMessage={setSelectedMessage}
        onSendMessage={sendMessage}
      />
    </div>
  );
};

export default Messages;