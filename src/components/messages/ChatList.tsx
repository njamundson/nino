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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreatorSelectionModal from "./chat-list/CreatorSelectionModal";

interface MessageUser {
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  read: boolean;
  sender: {
    first_name: string;
    last_name: string;
  };
  receiver: {
    first_name: string;
    last_name: string;
    profile_image_url: string | null;
  };
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

  useEffect(() => {
    fetchChatUsers();
  }, []);

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
          receiver:creators!receiver_id (
            first_name,
            last_name,
            profile_image_url
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Process users to remove duplicates and format data
      const uniqueUsers = new Map<string, MessageUser>();

      (messageUsers as MessageUser[])?.forEach((msg) => {
        const otherUserId = msg.sender_id === user.id ? msg.receiver_id : msg.sender_id;
        
        if (!uniqueUsers.has(otherUserId)) {
          uniqueUsers.set(otherUserId, {
            ...msg,
            last_message: {
              content: msg.content,
              created_at: msg.created_at,
              read: msg.read,
            },
          });
        }
      });

      setUsers(Array.from(uniqueUsers.values()));
    } catch (error) {
      console.error('Error fetching chat users:', error);
    }
  };

  const handleDeleteChat = async (userId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('messages')
        .delete()
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`);

      if (error) throw error;

      toast({
        title: "Chat deleted",
        description: "The conversation has been removed",
      });

      // Refresh the chat list
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
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from('messages')
        .update({ read: false })
        .eq('sender_id', userId)
        .eq('receiver_id', user.id);

      if (error) throw error;

      toast({
        title: "Marked as unread",
        description: "The conversation has been marked as unread",
      });

      // Refresh the chat list
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

  const filteredUsers = users.filter(user => 
    `${user.sender.first_name} ${user.sender.last_name}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-100">
        <ChatSearch 
          value={searchQuery} 
          onChange={setSearchQuery}
          onNewChat={() => setIsModalOpen(true)}
        />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredUsers.map((user) => (
              <div
                key={user.receiver_id}
                className={`group relative p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedUserId === user.receiver_id ? "bg-gray-50" : ""
                }`}
                onClick={() => onSelectChat(
                  user.receiver_id, 
                  user.receiver.first_name, 
                  user.receiver.last_name, 
                  user.receiver.profile_image_url
                )}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.receiver.profile_image_url || ""} />
                    <AvatarFallback>
                      {user.receiver.first_name?.[0]}{user.receiver.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {user.receiver.first_name} {user.receiver.last_name}
                    </p>
                    {user.content && (
                      <p className={`text-sm truncate ${
                        user.read ? "text-gray-500" : "text-gray-900 font-medium"
                      }`}>
                        {user.content}
                      </p>
                    )}
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          markAsUnread(user.receiver_id);
                        }}>
                          <Mail className="h-4 w-4 mr-2" />
                          Mark as unread
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteChat(user.receiver_id);
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete conversation
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                {user.created_at && (
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(user.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
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