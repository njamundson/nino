import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import BrandChatContainer from "@/components/messages/brand/BrandChatContainer";
import ChatList from "@/components/messages/ChatList";

const Messages = () => {
  const { user } = useAuth();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [selectedDisplayName, setSelectedDisplayName] = useState<string>("");
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | null>(null);

  const handleSelectChat = (userId: string, displayName: string, profileImage: string | null) => {
    setSelectedChat(userId);
    setSelectedDisplayName(displayName);
    setSelectedProfileImage(profileImage);
  };

  const handleMobileBack = () => {
    setSelectedChat(null);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      <div className="w-full md:w-1/3 border-r">
        <ChatList
          onSelectChat={handleSelectChat}
          selectedUserId={selectedChat}
        />
      </div>
      
      {selectedChat && (
        <div className="hidden md:block w-2/3">
          <BrandChatContainer
            selectedChat={selectedChat}
            selectedDisplayName={selectedDisplayName}
            selectedProfileImage={selectedProfileImage}
            currentUserId={user?.id}
            onMobileBack={handleMobileBack}
          />
        </div>
      )}
    </div>
  );
};

export default Messages;