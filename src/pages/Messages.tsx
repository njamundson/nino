import { useState } from "react";
import { Card } from "@/components/ui/card";
import ChatList from "@/components/messages/ChatList";
import { BrandChatContainer } from "@/components/messages/brand/BrandChatContainer";
import { useIsMobile } from "@/hooks/use-mobile";
import PageHeader from "@/components/shared/PageHeader";
import { MessagesSquare } from "lucide-react";

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
      <div className="h-[calc(100vh-4rem)] p-4">
        {!showMobileChat ? (
          <>
            <PageHeader
              title="Messages"
              description="Chat with creators and manage your conversations"
            />
            <ChatList 
              onSelectChat={handleChatSelect} 
              selectedUserId={selectedChat}
            />
          </>
        ) : (
          <BrandChatContainer
            selectedChat={selectedChat}
            selectedDisplayName={selectedDisplayName}
            selectedProfileImage={selectedProfileImage}
            currentUserId={selectedChat}
            onMobileBack={handleMobileBack}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4rem)] p-4 flex flex-col">
      <PageHeader
        title="Messages"
        description="Chat with creators and manage your conversations"
        className="flex-shrink-0 mb-4"
      />
      <Card className="flex-1 grid grid-cols-[350px_1fr] bg-white/80 backdrop-blur-xl border-0 shadow-lg rounded-3xl overflow-hidden">
        <div className="border-r border-gray-100 overflow-hidden">
          <ChatList 
            onSelectChat={handleChatSelect} 
            selectedUserId={selectedChat}
          />
        </div>
        <div className="overflow-hidden">
          {selectedChat ? (
            <BrandChatContainer
              selectedChat={selectedChat}
              selectedDisplayName={selectedDisplayName}
              selectedProfileImage={selectedProfileImage}
              currentUserId={selectedChat}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <MessagesSquare className="w-12 h-12 text-gray-400" />
                <span>Select a conversation to start messaging</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Messages;