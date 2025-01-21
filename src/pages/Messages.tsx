import { useState } from "react";
import { Card } from "@/components/ui/card";
import ChatList from "@/components/messages/ChatList";
import { ChatContainer } from "@/components/messages/ChatContainer";
import { useMessages } from "@/hooks/useMessages";
import PageHeader from "@/components/shared/PageHeader";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const {
    messages,
    newMessage,
    setNewMessage,
    isRecording,
    setIsRecording,
    editingMessage,
    setEditingMessage,
    handleSendMessage,
  } = useMessages(selectedChat);

  const selectedChatProfile = messages?.find(m => {
    if (m.sender_id === selectedChat) {
      return m.sender_profile;
    }
    if (m.receiver_id === selectedChat) {
      return m.receiver_profile;
    }
    return null;
  });

  const selectedFirstName = selectedChatProfile?.sender_profile?.first_name || selectedChatProfile?.receiver_profile?.first_name;
  const selectedLastName = selectedChatProfile?.sender_profile?.last_name || selectedChatProfile?.receiver_profile?.last_name;

  return (
    <div className="flex flex-col h-screen">
      <div className="p-8">
        <PageHeader
          title="Messages"
          description="Connect and communicate with brands and creators about your collaborations"
        />
      </div>
      <div className="flex flex-1 gap-6 px-8 pb-8 min-h-0">
        <Card className="w-96 bg-white/80 backdrop-blur-xl border-0 shadow-sm overflow-hidden flex flex-col">
          <ChatList
            onSelectChat={setSelectedChat}
            selectedUserId={selectedChat}
          />
        </Card>

        <ChatContainer
          selectedChat={selectedChat}
          selectedFirstName={selectedFirstName}
          selectedLastName={selectedLastName}
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
  );
};

export default Messages;