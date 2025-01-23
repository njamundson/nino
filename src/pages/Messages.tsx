import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ChatList from "@/components/messages/ChatList";
import { ChatContainer } from "@/components/messages/ChatContainer";
import { useMessages } from "@/hooks/useMessages";
import { useIsMobile } from "@/hooks/use-mobile";
import PageHeader from "@/components/shared/PageHeader";
import { MessagesSquare } from "lucide-react";

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
    <div className="space-y-6 p-4">
      <div className="flex items-center gap-2">
        <MessagesSquare className="h-8 w-8 text-gray-600" />
        <PageHeader
          title="Messages"
          description="Connect and communicate with creators and brands"
        />
      </div>
      
      <div className="flex h-[calc(100vh-12rem)] gap-4">
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
    </div>
  );
};

export default Messages;