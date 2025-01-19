import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const [creators, setCreators] = useState<any[]>([]);
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
          profiles:sender_id(first_name, last_name)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

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
      if (!!brand) {
        fetchCreators();
      }
    } catch (error) {
      console.error('Error checking brand status:', error);
    }
  };

  const startNewChat = async (profileId: string) => {
    onSelectChat(profileId);
    toast({
      title: "Chat started",
      description: "You can now send messages to this creator",
    });
  };

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
        <div className="p-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              {creators.map((creator) => (
                <DropdownMenuItem
                  key={creator.id}
                  onClick={() => startNewChat(creator.profile_id)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback>
                        {creator.profiles?.first_name?.[0]}
                        {creator.profiles?.last_name?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {creator.profiles?.first_name} {creator.profiles?.last_name}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
              {creators.length === 0 && (
                <DropdownMenuItem disabled>
                  No creators found
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
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

        {Object.keys(chats).length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {isBrand 
              ? "Start a conversation with a creator"
              : "No messages yet. Brands will contact you here."
            }
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
