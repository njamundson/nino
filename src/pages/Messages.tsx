import { useState } from "react";
import { Card } from "@/components/ui/card";
import ChatList from "@/components/messages/ChatList";
import { BrandChatContainer } from "@/components/messages/brand/BrandChatContainer";
import { useIsMobile } from "@/hooks/use-mobile";

const Messages = () => {
  const isMobile = useIsMobile();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedDisplayName, setSelectedDisplayName] = useState<string | null>(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | null>(null);
  const [showMobileChat, setShowMobileChat] = useState(false);

  const handleChatSelect = (
    userId: string, 
    displayName: string,
    profileImage: string | null
  ) => {
    setSelectedChat(userId);
    setSelectedDisplayName(displayName);
    setSelectedProfileImage(profileImage);
    if (isMobile) {
      setShowMobileChat(true);
    }
  };

  const handleMobileBack = () => {
    setShowMobileChat(false);
    setSelectedChat(null);
  };

  if (isMobile) {
    return (
      <div className="h-full">
        {!showMobileChat ? (
          <ChatList onChatSelect={handleChatSelect} />
        ) : (
          <BrandChatContainer
            selectedChat={selectedChat}
            selectedDisplayName={selectedDisplayName || null}
            selectedProfileImage={selectedProfileImage}
            currentUserId={selectedChat}
            onMobileBack={handleMobileBack}
          />
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-[350px_1fr] gap-6 h-full">
      <ChatList onChatSelect={handleChatSelect} />
      <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-lg rounded-3xl overflow-hidden">
        {selectedChat ? (
          <BrandChatContainer
            selectedChat={selectedChat}
            selectedDisplayName={selectedDisplayName || null}
            selectedProfileImage={selectedProfileImage}
            currentUserId={selectedChat}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a conversation to start messaging
          </div>
        )}
      </Card>
    </div>
  );
};

export default Messages;