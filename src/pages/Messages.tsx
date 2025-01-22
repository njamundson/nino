import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatList from "@/components/messages/ChatList";
import { ChatContainer } from "@/components/messages/ChatContainer";
import { useMessages } from "@/hooks/useMessages";
import { useIsMobile } from "@/hooks/use-mobile";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("user");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(userId);
  const isMobile = useIsMobile();
  
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

  useEffect(() => {
    setSelectedUserId(userId);
  }, [userId]);

  // Handle mobile view switching
  const handleMobileBack = () => {
    setSelectedUserId(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] gap-4 p-4">
      {(!isMobile || !selectedUserId) && (
        <div className={`${isMobile ? 'w-full' : 'w-80'} bg-white rounded-2xl shadow-lg overflow-hidden`}>
          <ChatList 
            onSelectChat={setSelectedUserId}
            selectedUserId={selectedUserId}
          />
        </div>
      )}
      {(!isMobile || selectedUserId) && (
        <div className={`${isMobile ? 'w-full' : 'flex-1'}`}>
          <ChatContainer
            selectedChat={selectedUserId}
            messages={messages}
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            editingMessage={editingMessage}
            setEditingMessage={setEditingMessage}
            onMobileBack={isMobile ? handleMobileBack : undefined}
          />
        </div>
      )}
    </div>
  );
};

export default Messages;