import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import ChatContainer from "@/components/messages/ChatContainer";
import ChatList from "@/components/messages/ChatList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    searchParams.get("userId")
  );
  const [selectedFirstName, setSelectedFirstName] = useState<string | null>(null);
  const [selectedLastName, setSelectedLastName] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    getUser();
  }, []);

  const handleSelectChat = async (
    userId: string, 
    firstName: string, 
    lastName: string
  ) => {
    setSelectedUserId(userId);
    setSelectedFirstName(firstName);
    setSelectedLastName(lastName);
  };

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-nino-bg">
      <PageHeader
        title="Messages"
        description="Connect and communicate with brands."
      />
      
      <div className="flex-1 container px-0 pb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100 h-[36rem]">
            <ChatList 
              onSelectChat={handleSelectChat}
              selectedUserId={selectedUserId}
            />
          </div>
          
          <div className="md:col-span-2">
            <ChatContainer
              selectedChat={selectedUserId}
              selectedFirstName={selectedFirstName}
              selectedLastName={selectedLastName}
              currentUserId={currentUser?.id}
              onMobileBack={isMobile ? () => setSelectedUserId(null) : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;