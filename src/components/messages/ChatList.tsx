import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ChatSearch } from "./chat-list/ChatSearch";
import { EmptyState } from "./chat-list/EmptyState";
import { MoreHorizontal, Trash2, Mail } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import CreatorSelectionModal from "./chat-list/CreatorSelectionModal";

interface MessageUser {
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender: {
    first_name: string | null;
    last_name: string | null;
  } | null;
  receiver: {
    first_name: string | null;
    last_name: string | null;
  } | null;
}

interface ChatListProps {
  onSelectChat: (userId: string, firstName: string, lastName: string, profileImage: string | null) => void;
  selectedUserId: string | null;
}

const ChatList = ({ onSelectChat, selectedUserId }: ChatListProps) => {
  const [users, setUsers] = useState<MessageUser[]>([]);
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
    };

    fetchCurrentUser();
    fetchChatUsers();
    subscribeToNewMessages();
  }, []);

  const subscribeToNewMessages = () => {
    const channel = supabase
      .channel('new_messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchChatUsers();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchChatUsers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: messageUsers, error } = await supabase
        .from('messages')
        .select(`
          sender_id,
          receiver_id,
          content,
          created_at,
          read,
          sender:profiles!sender_profile_id (
            first_name,
            last_name
          ),
          receiver:profiles!receiver_profile_id (
            first_name,
            last_name,
            creator:creators (
              profile_image_url
            )
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch chat users",
          variant: "destructive",
        });
        return;
      }

      // Process users to remove duplicates and format data
      const uniqueUsers = new Map<string, MessageUser>();

      messageUsers?.forEach((msg: any) => {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        
        if (!uniqueUsers.has(otherUserId)) {
          uniqueUsers.set(otherUserId, msg as MessageUser);
        }
      });

      setUsers(Array.from(uniqueUsers.values()));
    } catch (error) {
      console.error('Error fetching chat users:', error);
      toast({
        title: "Error",
        description: "Failed to fetch chat users",
        variant: "destructive",
      });
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

      fetchChatUsers();
    } catch (error) {
      console.error('Error deleting chat:', error);
      toast({
        title: "Error",
        description: "Failed to delete the conversation",
        variant: "destructive",
      });
    }
  };

  const markAsUnread = async (userId: string) => {
    try {
      if (!currentUser) return;

      const { error } = await supabase
        .from('messages')
        .update({ read: false })
        .eq('sender_id', userId)
        .eq('receiver_id', currentUser.id);

      if (error) throw error;

      toast({
        title: "Marked as unread",
        description: "The conversation has been marked as unread",
      });

      fetchChatUsers();
    } catch (error) {
      console.error('Error marking as unread:', error);
      toast({
        title: "Error",
        description: "Failed to mark conversation as unread",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user => {
    const senderName = `${user.sender?.first_name || ''} ${user.sender?.last_name || ''}`.toLowerCase();
    const receiverName = `${user.receiver?.first_name || ''} ${user.receiver?.last_name || ''}`.toLowerCase();
    const query = searchQuery.toLowerCase();
    return senderName.includes(query) || receiverName.includes(query);
  });

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

  const getInitials = (firstName: string | null, lastName: string | null) => {
    const first = firstName?.[0] || '';
    const last = lastName?.[0] || '';
    return (first + last).toUpperCase();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <ChatSearch 
          value={searchQuery} 
          onChange={setSearchQuery}
          onNewChat={() => setIsModalOpen(true)}
        />
      </div>

      <div className="flex-1 overflow-y-auto bg-gray-50">
        {filteredUsers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => {
              if (!currentUser) return null;
              const isCurrentUserSender = user.sender_id === currentUser.id;
              const otherUser = isCurrentUserSender ? user.receiver : user.sender;
              const initials = getInitials(otherUser?.first_name, otherUser?.last_name);

              return (
                <div
                  key={isCurrentUserSender ? user.receiver_id : user.sender_id}
                  className={`group relative p-4 cursor-pointer hover:bg-white transition-colors ${
                    selectedUserId === (isCurrentUserSender ? user.receiver_id : user.sender_id) ? "bg-white" : ""
                  }`}
                  onClick={() => onSelectChat(
                    isCurrentUserSender ? user.receiver_id : user.sender_id,
                    otherUser?.first_name || '',
                    otherUser?.last_name || '',
                    null
                  )}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <div className="flex flex-col">
                          <p className="text-base font-semibold text-gray-900 truncate">
                            {otherUser?.first_name} {otherUser?.last_name}
                          </p>
                          <p className="text-sm text-gray-500">Creator</p>
                        </div>
                        <span className="text-xs text-gray-500">
                          {formatTime(user.created_at)}
                        </span>
                      </div>
                      {user.content && (
                        <p className={`text-sm truncate mt-1 ${
                          user.read ? "text-gray-500" : "text-gray-900"
                        }`}>
                          {user.content}
                        </p>
                      )}
                    </div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            markAsUnread(isCurrentUserSender ? user.receiver_id : user.sender_id);
                          }}>
                            <Mail className="h-4 w-4 mr-2" />
                            Mark as unread
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteChat(isCurrentUserSender ? user.receiver_id : user.sender_id);
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