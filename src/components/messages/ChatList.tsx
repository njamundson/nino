import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatListHeader } from "./chat-list/ChatListHeader";
import { ChatListItem } from "./chat-list/ChatListItem";
import CreatorSelectionModal from "./chat-list/CreatorSelectionModal";
import { useChatList } from "@/hooks/messages/useChatList";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface ChatListProps {
  onSelectChat: (userId: string, displayName: string, profileImage: string | null) => void;
  selectedUserId?: string;
}

const ChatList = ({ onSelectChat, selectedUserId }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const [isBrand, setIsBrand] = useState(false);
  const { toast } = useToast();

  const { chats, isLoading } = useChatList(currentUser?.id);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        setCurrentUser(user);

        const { data: brand, error: brandError } = await supabase
          .from('brands')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (brandError) {
          console.error('Error checking brand status:', brandError);
          return;
        }

        setIsBrand(!!brand);
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

  const filteredChats = chats?.filter((chat) =>
    chat.otherUser.displayName
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
      <div className="flex-1 p-6">
        <Card className="p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <div className="rounded-full bg-gray-100 p-3">
              <MessageSquare className="w-6 h-6 text-gray-400" />
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">No messages yet</h3>
              <p className="text-sm text-gray-500">
                {isBrand 
                  ? "Start a conversation with a creator"
                  : "Brands will appear here when they message you"}
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full border-r border-gray-100">
      <ChatListHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onNewChat={isBrand ? () => setIsModalOpen(true) : undefined}
      />

      <div className="flex-1 overflow-y-auto bg-white">
        {filteredChats?.map((chat) => (
          <ChatListItem
            key={chat.otherUser.id}
            chat={chat}
            isSelected={selectedUserId === chat.otherUser.id}
            currentUserId={currentUser?.id}
            onSelect={() => onSelectChat(
              chat.otherUser.id,
              chat.otherUser.displayName,
              chat.otherUser.profileImage
            )}
          />
        ))}
      </div>

      {isBrand && (
        <CreatorSelectionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={onSelectChat}
        />
      )}
    </div>
  );
};

export default ChatList;