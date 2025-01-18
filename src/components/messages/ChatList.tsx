import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate } from "@/lib/utils";
import { useState } from "react";
import CreatorSelectionModal from "./CreatorSelectionModal";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
  sender_profile?: {
    first_name: string;
    last_name: string;
  };
  receiver_profile?: {
    first_name: string;
    last_name: string;
  };
}

interface Creator {
  id: string;
  profile: {
    first_name: string;
    last_name: string;
  };
}

interface ChatListProps {
  messages: Message[] | undefined;
  creators: Creator[] | undefined;
  selectedChat: string | null;
  setSelectedChat: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const ChatList = ({
  messages = [],
  creators = [],
  selectedChat,
  setSelectedChat,
  searchQuery,
  setSearchQuery,
}: ChatListProps) => {
  const [isCreatorModalOpen, setIsCreatorModalOpen] = useState(false);
  const { toast } = useToast();
  const [isBrand, setIsBrand] = useState(false);

  // Check if the user is a brand
  const checkIfBrand = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: brands } = await supabase
      .from('brands')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    setIsBrand(!!brands && brands.length > 0);
  };

  // Call checkIfBrand when component mounts
  useState(() => {
    checkIfBrand();
  }, []);

  const handleCreatorSelect = async (creatorId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "Please sign in to send messages",
          variant: "destructive",
        });
        return;
      }

      // Create an empty message to start the conversation
      const { error } = await supabase.from("messages").insert({
        content: "Started a conversation",
        sender_id: user.id,
        receiver_id: creatorId,
        read: false,
      });

      if (error) {
        console.error("Error creating conversation:", error);
        toast({
          title: "Error",
          description: "Could not start conversation. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setSelectedChat(creatorId);
      toast({
        title: "Conversation started",
        description: "You can now send messages to this creator.",
      });
    } catch (error) {
      console.error("Error selecting creator:", error);
      toast({
        title: "Error",
        description: "Could not start conversation. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Group messages by conversation partner
  const conversations = messages.reduce((acc: { [key: string]: Message }, message) => {
    const partnerId = message.sender_id === selectedChat ? message.receiver_id : message.sender_id;
    if (!acc[partnerId] || new Date(acc[partnerId].created_at) < new Date(message.created_at)) {
      acc[partnerId] = message;
    }
    return acc;
  }, {});

  const filteredConversations = Object.values(conversations).filter((message) => {
    const senderName = `${message.sender_profile?.first_name} ${message.sender_profile?.last_name}`.toLowerCase();
    const receiverName = `${message.receiver_profile?.first_name} ${message.receiver_profile?.last_name}`.toLowerCase();
    return senderName.includes(searchQuery.toLowerCase()) || 
           receiverName.includes(searchQuery.toLowerCase()) ||
           message.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="relative flex-1 mr-2">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search messages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-white/50 rounded-full"
          />
        </div>
        {isBrand && (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            onClick={() => setIsCreatorModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {filteredConversations.map((message) => {
            const isReceived = message.receiver_id === selectedChat;
            const profile = isReceived ? message.sender_profile : message.receiver_profile;
            
            return (
              <div
                key={message.id}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedChat === (isReceived ? message.sender_id : message.receiver_id)
                    ? 'bg-gray-200'
                    : 'hover:bg-gray-100'
                }`}
                onClick={() => setSelectedChat(isReceived ? message.sender_id : message.receiver_id)}
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback>
                      {profile?.first_name?.[0]}
                      {profile?.last_name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-semibold text-sm">
                        {profile?.first_name} {profile?.last_name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {formatDate(message.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>

      <CreatorSelectionModal
        isOpen={isCreatorModalOpen}
        onClose={() => setIsCreatorModalOpen(false)}
        onSelect={handleCreatorSelect}
      />
    </div>
  );
};