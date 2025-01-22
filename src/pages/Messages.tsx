import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ChatContainer } from "@/components/messages/ChatContainer";
import ChatList from "@/components/messages/ChatList";
import { Message } from "@/types/message";

const Messages = () => {
  const [searchParams] = useSearchParams();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender_profile:profiles!sender_profile_id(first_name, last_name),
          receiver_profile:profiles!receiver_profile_id(first_name, last_name),
          reactions(*)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching messages:", error);
        return;
      }

      setMessages(data as Message[]);
    };

    fetchMessages();
  }, []);

  return (
    <div className="flex h-full">
      <ChatList onSelectChat={setSelectedChat} selectedUserId={selectedChat} />
      <ChatContainer
        selectedChat={selectedChat}
        newMessage=""
        setNewMessage={() => {}}
        handleSendMessage={() => {}}
        isRecording={false}
        setIsRecording={() => {}}
        editingMessage={null}
        setEditingMessage={() => {}}
        messages={messages}
      />
    </div>
  );
};

export default Messages;
