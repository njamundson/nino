import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { BrandChatContainer } from "@/components/messages/brand/BrandChatContainer";
import ChatList from "@/components/messages/ChatList";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(
    searchParams.get("userId")
  );
  const [selectedDisplayName, setSelectedDisplayName] = useState<string | null>(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  useEffect(() => {
    const getUser = async () => {
      try {
        setIsLoading(true);
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    getUser();
  }, [toast]);

  const handleSelectChat = async (
    userId: string, 
    displayName: string,
    profileImage: string | null
  ) => {
    setSelectedUserId(userId);
    setSelectedDisplayName(displayName);
    setSelectedProfileImage(profileImage);
  };

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-6rem)] flex flex-col">
        <PageHeader
          title="Messages"
          description="Connect and communicate with creators."
        />
        <div className="flex-1 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col overflow-hidden">
      <PageHeader
        title="Messages"
        description="Connect and communicate with creators."
      />
      
      <div className="flex-1 container px-0 pb-6 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-14rem)]">
          <div className="md:col-span-1 bg-white rounded-3xl shadow-sm overflow-hidden border border-gray-100">
            <ChatList 
              onSelectChat={handleSelectChat}
              selectedUserId={selectedUserId}
            />
          </div>
          
          <div className="md:col-span-2">
            <BrandChatContainer
              selectedChat={selectedUserId}
              selectedDisplayName={selectedDisplayName}
              selectedProfileImage={selectedProfileImage}
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
