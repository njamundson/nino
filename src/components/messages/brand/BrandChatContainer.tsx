import ChatHeader from "@/components/messages/ChatHeader";
import BrandChatMessages from "@/components/messages/brand/BrandChatMessages";
import BrandChatInput from "@/components/messages/brand/BrandChatInput";
import { Message } from "@/types/message";
import { useMessages } from "@/hooks/useMessages";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface BrandChatContainerProps {
  selectedChat: string | null;
  selectedDisplayName?: string;
  selectedProfileImage?: string | null;
  currentUserId?: string;
  onMobileBack?: () => void;
}

export const BrandChatContainer = ({
  selectedChat,
  selectedDisplayName,
  selectedProfileImage,
  currentUserId,
  onMobileBack,
}: BrandChatContainerProps) => {
  const [senderProfileImage, setSenderProfileImage] = useState<string | null>(selectedProfileImage);
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

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (!selectedChat) return;
      
      const { data: creator } = await supabase
        .from('creators')
        .select('profile_image_url')
        .eq('user_id', selectedChat)
        .maybeSingle();

      if (creator) {
        setSenderProfileImage(creator.profile_image_url);
      }
    };

    if (!selectedProfileImage) {
      fetchProfileImage();
    }
  }, [selectedChat, selectedProfileImage]);

  return (
    <div className="flex flex-col h-full">
      <ChatHeader
        senderDisplayName={selectedDisplayName}
        senderProfileImage={senderProfileImage}
        senderUserId={selectedChat}
        onMobileBack={onMobileBack}
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
        selectedChat={selectedChat}
        editingMessage={editingMessage}
        setEditingMessage={setEditingMessage}
      />
    </div>
  );
};

export default BrandChatContainer;