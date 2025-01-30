import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "./chat-list/EmptyState";
import { ChatListHeader } from "./chat-list/ChatListHeader";
import { ChatListItem } from "./chat-list/ChatListItem";
import CreatorSelectionModal from "./CreatorSelectionModal";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useChatList } from "@/hooks/messages/useChatList";
import { supabase } from "@/integrations/supabase/client";

interface ChatListProps {
  onSelectChat: (userId: string, firstName: string, lastName: string, profileImage: string | null) => void;
  selectedUserId: string | null;
}

const ChatList = ({ onSelectChat, selectedUserId }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const { toast } = useToast();

  const { chats, isLoading, deleteChat } = useChatList(currentUser?.id);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setCurrentUser(user);
      } catch (error) {
        console.error('Error fetching current user:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      }
    };

    fetchCurrentUser();
  }, [toast]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const handleDeleteChat = (userId: string) => {
    deleteChat(userId);
    if (selectedUserId === userId) {
      onSelectChat('', '', '', null);
    }
  };

  const filteredChats = chats.filter(chat => {
    if (!chat?.otherUser) return false;
    const fullName = `${chat.otherUser.firstName} ${chat.otherUser.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <LoadingSpinner size="md" />
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

      <div className="flex-1 overflow-y-auto bg-white">
        {filteredChats.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredChats.map((chat) => (
              <ChatListItem
                key={chat.otherUser.id}
                chat={chat}
                isSelected={selectedUserId === chat.otherUser.id}
                currentUserId={currentUser?.id}
                formatTime={formatTime}
                onSelect={() => onSelectChat(
                  chat.otherUser.id,
                  chat.otherUser.firstName,
                  chat.otherUser.lastName,
                  chat.otherUser.profileImage
                )}
                onDelete={() => handleDeleteChat(chat.otherUser.id)}
              />
            ))}
          </div>
        )}
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