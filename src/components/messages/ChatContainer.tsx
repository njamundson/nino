import { Card } from "@/components/ui/card";
import { ChatHeader } from "@/components/messages/ChatHeader";
import ChatMessages from "@/components/messages/ChatMessages";
import ChatInput from "@/components/messages/ChatInput";
import { Message } from "@/types/message";
import { useMessages } from "@/hooks/useMessages";

interface ChatContainerProps {
  selectedChat: string | null;
  selectedFirstName?: string;
  selectedLastName?: string;
  currentUserId?: string;
  onMobileBack?: () => void;
}

export const ChatContainer = ({
  selectedChat,
  selectedFirstName,
  selectedLastName,
  currentUserId,
  onMobileBack,
}: ChatContainerProps) => {
  const {
    data: messages,
    newMessage,
    setNewMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
    handleSendMessage,
    handleDeleteMessage,
    handleReaction,
  } = useMessages(selectedChat || '');

  return (
    <Card className="flex flex-col h-[36rem] bg-white/80 backdrop-blur-xl border-0 shadow-lg rounded-3xl overflow-hidden">
      {selectedChat ? (
        <>
          <ChatHeader
            senderFirstName={selectedFirstName}
            senderLastName={selectedLastName}
            onBack={onMobileBack}
          />
          <div className="flex-1 overflow-hidden">
            <ChatMessages
              messages={messages}
              currentUserId={currentUserId}
              selectedChat={selectedChat}
              onReaction={handleReaction}
              onDelete={handleDeleteMessage}
            />
          </div>
          <ChatInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
            isRecording={isRecording}
            setIsRecording={setIsRecording}
            selectedChat={selectedChat}
            editingMessage={editingMessage}
            setEditingMessage={setEditingMessage}
          />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p className="text-sm">Select a conversation to start messaging</p>
        </div>
      )}
    </Card>
  );
};

export default ChatContainer;