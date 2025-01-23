import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { ChatSearch } from "./chat-list/ChatSearch";
import { NewChatButton } from "./chat-list/NewChatButton";
import { ChatItem } from "./chat-list/ChatItem";
import { EmptyState } from "./chat-list/EmptyState";

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

interface Creator {
  id: string;
  profile_id: string;
  profile_image_url: string | null;
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
  const [creators, setCreators] = useState<Creator[]>([]);
  const [isBrand, setIsBrand] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const fetchCreators = async () => {
    try {
      const { data, error } = await supabase
        .from('creators')
        .select(`
          id,
          profile_id,
          profile_image_url,
          profiles (
            first_name,
            last_name
          )
        `);

      if (error) throw error;
      setCreators(data || []);
    } catch (error) {
      console.error('Error fetching creators:', error);
      toast({
        title: "Error",
        description: "Failed to load creators",
        variant: "destructive",
      });
    }
  };

  const fetchChats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_profile_id_fkey(
            first_name,
            last_name
          ),
          receiver:profiles!messages_receiver_profile_id_fkey(
            first_name,
            last_name
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const groupedChats: { [key: string]: Message[] } = {};
      messages?.forEach((message: any) => {
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
      if (!!brand) {
        fetchCreators();
      }
    } catch (error) {
      console.error('Error checking brand status:', error);
    }
  };

  const startNewChat = async (profileId: string) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', profileId)
        .single();

      if (profile) {
        onSelectChat(profile.id);
        toast({
          title: "Chat started",
          description: "You can now send messages to this creator",
        });
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      toast({
        title: "Error",
        description: "Could not start chat",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkIfBrand();
  }, []);

  useEffect(() => {
    fetchChats();
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
        <div className="p-4 flex items-center gap-2">
          <ChatSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
          <NewChatButton creators={creators} onStartChat={startNewChat} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {Object.entries(chats).map(([userId, messages]) => (
          <ChatItem
            key={userId}
            userId={userId}
            message={messages[0]}
            isSelected={selectedUserId === userId}
            onClick={() => onSelectChat(userId)}
          />
        ))}

        {Object.keys(chats).length === 0 && (
          <EmptyState isBrand={isBrand} />
        )}
      </div>
    </div>
  );
};

export default ChatList;