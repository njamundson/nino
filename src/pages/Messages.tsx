import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import ChatList from "@/components/messages/ChatList";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    searchParams.get("userId")
  );

  const handleSelectChat = (userId: string) => {
    setSelectedUserId(userId);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Messages"
        description="Connect and communicate with creators and brands."
      />
      <ChatList 
        onSelectChat={handleSelectChat}
        selectedUserId={selectedUserId}
      />
    </div>
  );
};

export default Messages;