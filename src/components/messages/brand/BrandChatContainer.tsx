import React from 'react';
import BrandChatHeader from './BrandChatHeader';
import BrandChatMessages from './BrandChatMessages';
import BrandChatInput from './BrandChatInput';

interface BrandChatContainerProps {
  selectedChat: string;
  selectedDisplayName: string;
  selectedProfileImage: string | null;
  currentUserId: string;
  onMobileBack: () => void;
}

const BrandChatContainer = ({
  selectedChat,
  selectedDisplayName,
  selectedProfileImage,
  currentUserId,
  onMobileBack,
}: BrandChatContainerProps) => {
  return (
    <div className="flex flex-col h-full">
      <BrandChatHeader
        senderDisplayName={selectedDisplayName}
        senderProfileImage={selectedProfileImage}
        senderUserId={selectedChat}
        onMobileBack={onMobileBack}
      />
      <BrandChatMessages
        currentUserId={currentUserId}
        selectedUserId={selectedChat}
      />
      <BrandChatInput
        currentUserId={currentUserId}
        selectedUserId={selectedChat}
      />
    </div>
  );
};

export default BrandChatContainer;