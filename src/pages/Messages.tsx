import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ChatContainer } from "@/components/messages/ChatContainer";
import { Message } from "@/types/message";
import { useMessages } from "@/hooks/useMessages";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");
  const { 
    messages, 
    newMessage,
    setNewMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
    handleSendMessage 
  } = useMessages(userId);

  useEffect(() => {
    if (userId && messages && messages.length > 0) {
      const unreadMessages = messages.filter(
        (msg) => !msg.read && msg.sender_id === userId
      );
      if (unreadMessages.length > 0) {
        // Handle marking messages as read through Supabase if needed
      }
    }
  }, [userId, messages]);

  return (
    <div className="h-screen bg-gray-50">
      <ChatContainer
        selectedChat={userId}
        messages={messages}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        isRecording={isRecording}
        setIsRecording={setIsRecording}
        editingMessage={editingMessage}
        setEditingMessage={setEditingMessage}
      />
    </div>
  );
};

export default Messages;