import { useState, useEffect } from "react";
import { ChatSearch } from "./chat-list/ChatSearch";
import { NewChatButton } from "./chat-list/NewChatButton";
import { EmptyState } from "./chat-list/EmptyState";
import { ChatItem } from "./chat-list/ChatItem";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface ChatListProps {
  onSelectChat: (userId: string, firstName: string, lastName: string, profileImage: string | null) => void;
  selectedUserId: string | null;
}

interface Conversation {
  user_id: string;
  first_name: string;
  last_name: string;
  profile_image_url: string | null;
  last_message?: {
    content: string;
    created_at: string;
  };
}

const ChatList = ({ onSelectChat, selectedUserId }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversations, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Fetch messages where the current user is either sender or receiver
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          id,
          content,
          created_at,
          sender_id,
          receiver_id,
          creators!messages_sender_id_fkey (
            user_id,
            first_name,
            last_name,
            profile_image_url
          ),
          creators!messages_receiver_id_fkey (
            user_id,
            first_name,
            last_name,
            profile_image_url
          )
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Process messages to get unique conversations
      const conversationsMap = new Map<string, Conversation>();

      messages?.forEach(message => {
        const otherUser = message.sender_id === user.id ? 
          message.creators!messages_receiver_id_fkey : 
          message.creators!messages_sender_id_fkey;

        if (!otherUser) return;

        const conversationId = otherUser.user_id;
        
        if (!conversationsMap.has(conversationId)) {
          conversationsMap.set(conversationId, {
            user_id: otherUser.user_id,
            first_name: otherUser.first_name,
            last_name: otherUser.last_name,
            profile_image_url: otherUser.profile_image_url,
            last_message: {
              content: message.content,
              created_at: message.created_at
            }
          });
        }
      });

      return Array.from(conversationsMap.values());
    }
  });

  const filteredConversations = conversations?.filter(conversation => {
    const fullName = `${conversation.first_name} ${conversation.last_name}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 flex items-center gap-2">
        <ChatSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <NewChatButton onStartChat={onSelectChat} />
      </div>

      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-nino-primary" />
          </div>
        ) : filteredConversations?.length ? (
          filteredConversations.map((conversation) => (
            <ChatItem
              key={conversation.user_id}
              userId={conversation.user_id}
              firstName={conversation.first_name}
              lastName={conversation.last_name}
              profileImage={conversation.profile_image_url}
              lastMessage={conversation.last_message}
              isSelected={selectedUserId === conversation.user_id}
              onClick={() => onSelectChat(
                conversation.user_id,
                conversation.first_name,
                conversation.last_name,
                conversation.profile_image_url
              )}
            />
          ))
        ) : (
          <EmptyState isBrand={true} />
        )}
      </div>
    </div>
  );
};

export default ChatList;