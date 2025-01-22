import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatList from "@/components/messages/ChatList";
import { ChatContainer } from "@/components/messages/ChatContainer";
import { useMessages } from "@/hooks/useMessages";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");
  const [selectedChat, setSelectedChat] = useState<string | null>(userId);
  
  const { 
    messages, 
    newMessage,
    setNewMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
    handleSendMessage 
  } = useMessages(selectedChat);

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4">
      <div className="w-80 bg-white rounded-xl shadow-sm overflow-hidden">
        <ChatList 
          onSelectChat={setSelectedChat} 
          selectedUserId={selectedChat} 
        />
      </div>
      <div className="flex-1">
        <ChatContainer
          selectedChat={selectedChat}
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
    </div>
  );
};

export default Messages;