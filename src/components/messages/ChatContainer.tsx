import { Card } from "@/components/ui/card";
import ChatHeader from "@/components/messages/ChatHeader";
import ChatMessages from "@/components/messages/ChatMessages";
import ChatInput from "@/components/messages/ChatInput";
import { useMessages } from "@/hooks/useMessages";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ChatContainerProps {
  selectedChat: string | null;
  selectedDisplayName?: string;
  selectedProfileImage?: string | null;
  currentUserId?: string;
  onMobileBack?: () => void;
}

export const ChatContainer = ({
  selectedChat,
  currentUserId,
  onMobileBack,
}: ChatContainerProps) => {
  const {
    data: messages,
    newMessage,
    setNewMessage,
    editingMessage,
    setEditingMessage,
    handleSendMessage,
    handleDeleteMessage,
    handleReaction,
    isLoading
  } = useMessages(selectedChat || '');

  return (
    <Card className="flex flex-col h-[calc(100vh-16rem)] bg-white/80 backdrop-blur-xl border-0 shadow-lg rounded-3xl overflow-hidden mb-6">
      <ChatHeader
        userId={selectedChat || ''}
        onBack={onMobileBack}
      />
      <div className="flex-1 overflow-hidden">
        <ChatMessages
          messages={messages}
          currentUserId={currentUserId}
          selectedChat={selectedChat}
          onReaction={handleReaction}
          isLoading={isLoading}
        />
      </div>
      <ChatInput
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSendMessage={handleSendMessage}
        selectedChat={selectedChat || ''}
        editingMessage={editingMessage}
        setEditingMessage={setEditingMessage}
      />
    </Card>
  );
};

export default ChatContainer;