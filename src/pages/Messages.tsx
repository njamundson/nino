import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "@/components/messages/ChatHeader";
import { ChatInput } from "@/components/messages/ChatInput";
import { ChatList } from "@/components/messages/ChatList";
import { ChatMessages } from "@/components/messages/ChatMessages";
import { useToast } from "@/hooks/use-toast";

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

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const { data: messages, refetch } = useQuery({
    queryKey: ["messages"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender_profile:profiles!messages_sender_id_fkey(
            first_name,
            last_name
          ),
          receiver_profile:profiles!messages_receiver_id_fkey(
            first_name,
            last_name
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error);
        throw error;
      }
      return data as Message[];
    },
  });

  const { data: creators } = useQuery({
    queryKey: ["creators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("creators")
        .select(`
          id,
          profile:profiles(
            first_name,
            last_name
          )
        `);

      if (error) {
        console.error("Error fetching creators:", error);
        throw error;
      }

      // Transform the data to match the Creator interface
      return data.map(creator => ({
        id: creator.id,
        profile: {
          first_name: creator.profile?.[0]?.first_name || "",
          last_name: creator.profile?.[0]?.last_name || ""
        }
      })) as Creator[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel('public:messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages'
        },
        (payload) => {
          console.log('New message received:', payload);
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) {
      toast({
        title: "Cannot send message",
        description: "Please select a recipient and enter a message",
        variant: "destructive",
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to send messages",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("messages").insert({
      content: newMessage,
      sender_id: user.id,
      receiver_id: selectedChat,
      read: false,
    });

    if (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
    refetch();
  };

  const selectedChatProfile = messages?.find(m => {
    if (m.sender_id === selectedChat) {
      return m.sender_profile;
    }
    if (m.receiver_id === selectedChat) {
      return m.receiver_profile;
    }
    return null;
  });

  const selectedFirstName = selectedChatProfile?.sender_profile?.first_name || selectedChatProfile?.receiver_profile?.first_name;
  const selectedLastName = selectedChatProfile?.sender_profile?.last_name || selectedChatProfile?.receiver_profile?.last_name;

  return (
    <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-4rem)]">
      <div className="flex h-full gap-6">
        <Card className="w-96 bg-white/80 backdrop-blur-xl border-0 shadow-sm overflow-hidden">
          <ChatList
            messages={messages}
            creators={creators}
            selectedChat={selectedChat}
            setSelectedChat={setSelectedChat}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </Card>

        <Card className="flex-1 bg-white/80 backdrop-blur-xl border-0 shadow-sm flex flex-col overflow-hidden">
          {selectedChat ? (
            <>
              <ChatHeader
                senderFirstName={selectedFirstName}
                senderLastName={selectedLastName}
              />
              <ChatMessages
                messages={messages}
                selectedChat={selectedChat}
              />
              <ChatInput
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                handleSendMessage={handleSendMessage}
                isRecording={isRecording}
                setIsRecording={setIsRecording}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
