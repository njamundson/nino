import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatSearch } from "./chat-list/ChatSearch";
import { EmptyState } from "./chat-list/EmptyState";
import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreatorSelectionModal from "./chat-list/CreatorSelectionModal";

interface ChatListProps {
  onSelectChat: (userId: string, firstName: string, lastName: string, profileImage: string | null) => void;
  selectedUserId: string | null;
}

const ChatList = ({ onSelectChat, selectedUserId }: ChatListProps) => {
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { toast } = useToast();
  const [currentUser, setCurrentUser] = useState<{ id: string } | null>(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error fetching current user:', error);
        return;
      }
      setCurrentUser(user);
      if (user) {
        fetchChatUsers(user.id);
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

      // Process messages to get unique conversations with latest message
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
      console.log('Processed conversations:', conversationsList);
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

  const handleDeleteChat = async (userId: string) => {
    try {
      if (!currentUser) return;

      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${currentUser.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${currentUser.id})`);

      if (error) throw error;

      toast({
        title: "Chat deleted",
        description: "The conversation has been removed",
      });

      if (currentUser) {
        fetchChatUsers(currentUser.id);
      }
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Error",
        description: "Failed to delete the conversation",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    if (!user?.otherUser) return false;
    const fullName = `${user.otherUser.firstName} ${user.otherUser.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <ChatSearch 
          value={searchQuery} 
          onChange={setSearchQuery}
          onNewChat={() => setIsModalOpen(true)}
        />
      </div>

      <div className="flex-1 overflow-y-auto bg-white">
        {filteredUsers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredUsers.map((chat) => {
              const fullName = chat.otherUser.firstName && chat.otherUser.lastName 
                ? `${chat.otherUser.firstName} ${chat.otherUser.lastName}`
                : 'Unnamed User';
                
              return (
                <div
                  key={chat.otherUser.id}
                  className={`group relative px-6 py-4 cursor-pointer hover:bg-gray-50/50 transition-colors ${
                    selectedUserId === chat.otherUser.id ? "bg-gray-50/50" : ""
                  }`}
                  onClick={() => onSelectChat(
                    chat.otherUser.id,
                    chat.otherUser.firstName,
                    chat.otherUser.lastName,
                    chat.otherUser.profileImage
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={chat.otherUser.profileImage || ''} />
                      <AvatarFallback>
                        {`${chat.otherUser.firstName?.[0] || ''}${chat.otherUser.lastName?.[0] || ''}`}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                        <h3 className="text-sm font-medium text-gray-900 truncate">
                          {fullName}
                        </h3>
                        <span className="text-xs text-gray-500">
                          {formatTime(chat.created_at)}
                        </span>
                      </div>
                      <p className={`text-sm truncate ${
                        !chat.read && chat.sender_id !== currentUser?.id ? "font-medium text-gray-900" : "text-gray-500"
                      }`}>
                        {chat.sender_id === currentUser?.id ? `You: ${chat.content}` : chat.content}
                      </p>
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(chat.otherUser.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete conversation
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              );
            })}
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