import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatListHeader } from "./chat-list/ChatListHeader";
import { ChatListItem } from "./chat-list/ChatListItem";
import CreatorSelectionModal from "./chat-list/CreatorSelectionModal";
import { useChatList } from "@/hooks/messages/useChatList";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MessageSquare } from "lucide-react";

interface ChatListProps {
  onSelectChat: (userId: string, displayName: string, profileImage: string | null) => void;
  selectedUserId?: string;
}

const ChatList = ({ onSelectChat, selectedUserId }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const getUser = async () => {
      try {
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
      }
    };
    getUser();
  }, [toast]);

  const { chats, isLoading } = useChatList(currentUser?.id);

  const filteredChats = chats?.filter((chat) =>
    chat.otherUser.display_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!chats || chats.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
        <div className="rounded-full bg-gray-100 p-3">
          <MessageSquare className="w-6 h-6 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="font-medium">No messages yet</h3>
          <p className="text-sm text-gray-500">
            Start a conversation with a creator
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <ChatListHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewChat={() => setIsModalOpen(true)}
      />

      <div className="flex-1 overflow-y-auto">
        {filteredChats?.map((chat) => (
          <ChatListItem
            key={chat.otherUser.id}
            chat={chat}
            isSelected={selectedUserId === chat.otherUser.id}
            currentUserId={currentUser?.id}
            onSelect={() => onSelectChat(
              chat.otherUser.id,
              chat.otherUser.display_name,
              chat.otherUser.profileImage
            )}
          />
        ))}
      </div>

      <CreatorSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={onSelectChat}
      />
    </div>
  );
};

export default ChatList;