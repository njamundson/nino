import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { EmptyState } from "./chat-list/EmptyState";
import { ChatListHeader } from "./chat-list/ChatListHeader";
import { ChatListItem } from "./chat-list/ChatListItem";
import CreatorSelectionModal from "./CreatorSelectionModal";
import { useQueryClient } from "@tanstack/react-query";

interface ChatListProps {
  onSelectChat: (userId: string, firstName: string, lastName: string, profileImage: string | null) => void;
  selectedUserId: string | null;
}

const ChatList = ({ onSelectChat, selectedUserId }: ChatListProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        if (error) throw error;
        
        setCurrentUser(user);
        if (user) {
          await fetchChatUsers(user.id);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        toast({
          title: "Error",
          description: "Failed to load user data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrentUser();
    const channel = subscribeToNewMessages();
    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  const subscribeToNewMessages = () => {
    const channel = supabase
      .channel('chat_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          if (currentUser) {
            fetchChatUsers(currentUser.id);
          }
        }
      )
      .subscribe();

    return channel;
  };

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

  const fetchChatUsers = async (userId: string) => {
    try {
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          receiver_id,
          read,
          sender:profiles!sender_profile_id (
            first_name,
            last_name,
            creator:creators (
              profile_image_url
            )
          ),
          receiver:profiles!receiver_profile_id (
            first_name,
            last_name,
            creator:creators (
              profile_image_url
            )
          )
        `)
        .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const conversationsMap = new Map();
      
      messages?.forEach((msg: any) => {
        const otherUserId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        const otherUser = msg.sender_id === userId ? msg.receiver : msg.sender;
        
        if (!conversationsMap.has(otherUserId) || 
            new Date(msg.created_at) > new Date(conversationsMap.get(otherUserId).created_at)) {
          conversationsMap.set(otherUserId, {
            ...msg,
            otherUser: {
              id: otherUserId,
              firstName: otherUser?.first_name || '',
              lastName: otherUser?.last_name || '',
              profileImage: otherUser?.creator?.profile_image_url || null
            }
          });
        }
      });

      const conversationsList = Array.from(conversationsMap.values());
      setUsers(conversationsList);

    } catch (error) {
      console.error('Error fetching chat users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch conversations",
        variant: "destructive",
      });
    }
  };

  const handleDeleteChat = async (userId: string) => {
    try {
      if (!currentUser) return;
      setIsLoading(true);

      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUser.id})`);

      if (error) throw error;

      // Update local state by filtering out the deleted conversation
      setUsers(prevUsers => prevUsers.filter(user => user.otherUser.id !== userId));
      
      // Clear the messages from the cache for this chat
      queryClient.removeQueries({ queryKey: ['messages', userId] });
      
      // If this was the selected chat, clear the selection
      if (selectedUserId === userId) {
        onSelectChat('', '', '', null);
      }

      toast({
        title: "Chat deleted",
        description: "The conversation has been removed",
      });

    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Error",
        description: "Failed to delete the conversation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredUsers = users.filter(user => {
    if (!user?.otherUser) return false;
    const fullName = `${user.otherUser.firstName} ${user.otherUser.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
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
        {filteredUsers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredUsers.map((chat) => (
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