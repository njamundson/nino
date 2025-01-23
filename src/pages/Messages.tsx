import { useSearchParams } from "react-router-dom";
import { ChatList } from "@/components/messages/ChatList";
import { ChatContainer } from "@/components/messages/ChatContainer";
import { useMessages } from "@/hooks/useMessages";
import { useIsMobile } from "@/hooks/use-mobile";
import PageHeader from "@/components/shared/PageHeader";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const { isMobile } = useIsMobile();
  const selectedUserId = searchParams.get("userId");
  const {
    messages,
    newMessage,
    setNewMessage,
    handleSendMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
  } = useMessages(selectedUserId);

  const setSelectedUserId = (userId: string | null) => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (userId) {
      newSearchParams.set("userId", userId);
    } else {
      newSearchParams.delete("userId");
    }
    window.history.pushState({}, "", `?${newSearchParams.toString()}`);
  };

  const handleMobileBack = () => {
    setSelectedUserId(null);
  };

  return (
    <div className="min-h-screen bg-nino-bg py-8">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Messages"
          description="Connect and communicate with creators and brands"
        />
        
        <div className="mt-8 flex h-[calc(100vh-12rem)] gap-4">
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
    </div>
  );
};

export default Messages;