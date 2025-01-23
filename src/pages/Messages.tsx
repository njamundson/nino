import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import ChatContainer from "@/components/messages/ChatContainer";
import ChatList from "@/components/messages/ChatList";
import { useMessages } from "@/hooks/useMessages";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    searchParams.get("userId")
  );

  const {
    messages,
    newMessage,
    setNewMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
    handleSendMessage
  } = useMessages(selectedUserId);

  const handleSelectChat = (userId: string) => {
    setSelectedUserId(userId);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Messages"
        description="Connect and communicate with creators."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-12rem)]">
        <div className="md:col-span-1 bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          <ChatList 
            onSelectChat={handleSelectChat}
            selectedUserId={selectedUserId}
          />
        </div>
        
        <div className="md:col-span-2 h-full">
          <ChatContainer
            selectedChat={selectedUserId}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            editingMessage={editingMessage}
            setEditingMessage={setEditingMessage}
            messages={messages}
          />
        </div>
      </div>
    </div>
  );
};

export default Messages;