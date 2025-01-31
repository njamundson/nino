import { Card } from "@/components/ui/card";
import { ChatHeader } from "@/components/messages/ChatHeader";
import ChatMessages from "@/components/messages/ChatMessages";
import ChatInput from "@/components/messages/ChatInput";
import { Message } from "@/types/message";
import { useMessages } from "@/hooks/useMessages";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [senderProfileImage, setSenderProfileImage] = useState<string | null>(null);
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
      
      const { data: creatorProfile } = await supabase
        .from('creators')
        .select('profile_image_url')
        .eq('user_id', selectedChat)
        .maybeSingle();

      if (creatorProfile) {
        setSenderProfileImage(creatorProfile.profile_image_url);
      }
    };

    fetchProfileImage();
  }, [selectedChat]);

  return (
    <Card className="flex flex-col h-[calc(100vh-14rem)] bg-white/80 backdrop-blur-xl border-0 shadow-lg rounded-3xl overflow-hidden">
      {selectedChat ? (
        <>
          <ChatHeader
            senderFirstName={selectedFirstName}
            senderLastName={selectedLastName}
            senderProfileImage={senderProfileImage}
            onBack={onMobileBack}
          />
          <div className="flex-1 overflow-hidden">
            <ChatMessages
              messages={messages}
              currentUserId={currentUserId}
              selectedChat={selectedChat}
              onReaction={handleReaction}
            />
          </div>
          <ChatInput
            newMessage={newMessage}
            setNewMessage={setNewMessage}
            handleSendMessage={handleSendMessage}
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