import { Card } from "@/components/ui/card";
import { ChatHeader } from "@/components/messages/ChatHeader";
import ChatMessages from "@/components/messages/ChatMessages";
import { ChatInput } from "@/components/messages/ChatInput";
import { Message } from "@/types/message";

interface ChatContainerProps {
  selectedChat: string | null;
  selectedFirstName?: string;
  selectedLastName?: string;
  newMessage: string;
  setNewMessage: (message: string) => void;
  handleSendMessage: () => void;
  isRecording: boolean;
  setIsRecording: (isRecording: boolean) => void;
  editingMessage: { id: string; content: string; } | null;
  setEditingMessage: (message: { id: string; content: string; } | null) => void;
  messages?: Message[];
  currentUserId?: string;
}

export const ChatContainer = ({
  selectedChat,
  selectedFirstName,
  selectedLastName,
  newMessage,
  setNewMessage,
  handleSendMessage,
  isRecording,
  setIsRecording,
  editingMessage,
  setEditingMessage,
  messages = [],
  currentUserId,
}: ChatContainerProps) => {
  return (
    <Card className="flex-1 bg-white/80 backdrop-blur-xl border-0 shadow-lg flex flex-col min-h-0 rounded-2xl overflow-hidden">
      {selectedChat ? (
        <>
          <ChatHeader
            senderFirstName={selectedFirstName}
            senderLastName={selectedLastName}
          />
          <div className="flex-1 min-h-0">
            <ChatMessages
              messages={messages}
              currentUserId={currentUserId}
              selectedChat={selectedChat}
            />
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <p>Select a conversation to start messaging</p>
        </div>
      )}
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
    </Card>
  );
};

export default ChatContainer;