import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import CreatorSelectionModal from "./CreatorSelectionModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  profiles: {
    first_name: string;
    last_name: string;
  };
}

interface ChatListProps {
  onSelectChat: (userId: string) => void;
  selectedUserId: string | null;
}

const ChatList = ({ onSelectChat, selectedUserId }: ChatListProps) => {
  const [chats, setChats] = useState<{ [key: string]: Message[] }>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isBrand, setIsBrand] = useState(false);
  const { toast } = useToast();

  const fetchChats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          profiles:sender_id(first_name, last_name)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const groupedChats: { [key: string]: Message[] } = {};
      messages?.forEach((message: Message) => {
        const partnerId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
        if (!groupedChats[partnerId]) {
          groupedChats[partnerId] = [];
        }
        groupedChats[partnerId].push(message);
      });

      setChats(groupedChats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast({
        title: "Error",
        description: "Failed to load chats",
        variant: "destructive",
      });
    }
  };

  const checkIfBrand = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: brand } = await supabase
        .from('brands')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      setIsBrand(!!brand);
    } catch (error) {
      console.error('Error checking brand status:', error);
    }
  };

  // Call checkIfBrand when component mounts
  useEffect(() => {
    checkIfBrand();
  }, []);

  useEffect(() => {
    fetchChats();
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {isBrand && (
        <div className="p-4">
          <Button
            onClick={() => setShowModal(true)}
            className="w-full"
            variant="outline"
          >
            New Conversation
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {Object.entries(chats).map(([userId, messages]) => {
          const latestMessage = messages[0];
          const isSelected = selectedUserId === userId;

          return (
            <div
              key={userId}
              className={`p-4 cursor-pointer hover:bg-gray-100 ${
                isSelected ? "bg-gray-100" : ""
              }`}
              onClick={() => onSelectChat(userId)}
            >
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarFallback>
                    {latestMessage.profiles.first_name?.[0]}
                    {latestMessage.profiles.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {latestMessage.profiles.first_name} {latestMessage.profiles.last_name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {latestMessage.content}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {formatDate(latestMessage.created_at)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <CreatorSelectionModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onSelectCreator={(creatorId) => {
            onSelectChat(creatorId);
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatList;