import ChatHeader from "@/components/messages/ChatHeader";
import BrandChatMessages from "@/components/messages/brand/BrandChatMessages";
import BrandChatInput from "@/components/messages/brand/BrandChatInput";
import { useMessages } from "@/hooks/useMessages";

interface BrandChatContainerProps {
  selectedChat: string | null;
  selectedDisplayName?: string;
  selectedProfileImage?: string | null;
  currentUserId?: string;
  onMobileBack?: () => void;
}

export const BrandChatContainer = ({
  selectedChat,
  currentUserId,
  onMobileBack,
}: BrandChatContainerProps) => {
  const {
    data: messages,
    newMessage,
    setNewMessage,
    editingMessage,
    setEditingMessage,
    handleSendMessage,
    handleDeleteMessage,
    handleReaction,
  } = useMessages(selectedChat || '');

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        userId={selectedChat || ''}
        onBack={onMobileBack}
      />
      <div className="flex-1 overflow-hidden">
        <BrandChatMessages
          messages={messages}
          currentUserId={currentUserId}
          selectedChat={selectedChat}
          onReaction={handleReaction}
        />
      </div>
      <BrandChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        selectedChat={selectedChat || ''}
        editingMessage={editingMessage}
        setEditingMessage={setEditingMessage}
      />
    </div>
  );
};

export default BrandChatContainer;