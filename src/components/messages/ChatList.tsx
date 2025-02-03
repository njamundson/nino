import { useState } from 'react';
import ChatListHeader from './chat-list/ChatListHeader';
import { ChatListItem } from './chat-list/ChatListItem';
import { EmptyState } from './chat-list/EmptyState';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ChatListProps {
  selectedUserId?: string;
  onSelectChat: (userId: string) => void;
  onNewChat?: (userId: string, displayName: string, profileImage: string | null) => void;
  isCreator?: boolean;
}

interface ChatData {
  userId: string;
  displayName: string;
  lastMessage: {
    content: string;
    created_at: string;
    sender_id: string;
    read: boolean;
  };
  unreadCount: number;
}

const ChatList = ({ selectedUserId, onSelectChat, onNewChat, isCreator = false }: ChatListProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: chats, isLoading } = useQuery({
    queryKey: ['chats'],
    queryFn: async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        const { data: messages, error } = await supabase
          .from('messages')
          .select(`
            *,
            sender:profiles!messages_sender_profile_id_fkey(
              id,
              display_name,
              brands(id, company_name)
            ),
            receiver:profiles!messages_receiver_profile_id_fkey(
              id,
              display_name,
              brands(id, company_name)
            )
          `)
          .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching messages:', error);
          return [];
        }

        // Group messages by chat participant
        const chatsByUser = messages.reduce((acc: Record<string, ChatData>, message: any) => {
          const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id;
          const otherUser = message.sender_id === user.id ? message.receiver : message.sender;
          const otherBrand = message.sender_id === user.id 
            ? (otherUser?.brands?.[0]?.company_name || otherUser?.display_name)
            : (otherUser?.brands?.[0]?.company_name || otherUser?.display_name);
          
          if (!acc[otherUserId]) {
            acc[otherUserId] = {
              userId: otherUserId,
              displayName: otherBrand || 'Unknown User',
              lastMessage: {
                content: message.content,
                created_at: message.created_at,
                sender_id: message.sender_id,
                read: message.read
              },
              unreadCount: message.sender_id !== user.id && !message.read ? 1 : 0
            };
          } else if (new Date(message.created_at) > new Date(acc[otherUserId].lastMessage.created_at)) {
            acc[otherUserId].lastMessage = {
              content: message.content,
              created_at: message.created_at,
              sender_id: message.sender_id,
              read: message.read
            };
            if (message.sender_id !== user.id && !message.read) {
              acc[otherUserId].unreadCount++;
            }
          }
          return acc;
        }, {});

        return Object.values(chatsByUser);
      } catch (error) {
        console.error('Error in chat query:', error);
        return [];
      }
    }
  });

  const filteredChats = (chats || []).filter(chat => 
    chat.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full border-r">
      <ChatListHeader 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        isCreator={isCreator}
      />
      
      <ScrollArea className="flex-1">
        <div className="px-3">
          {!isLoading && filteredChats.length === 0 && (
            <EmptyState searchQuery={searchQuery} />
          )}
          
          {filteredChats.map((chat) => (
            <ChatListItem
              key={chat.userId}
              userId={chat.userId}
              displayName={chat.displayName}
              lastMessage={chat.lastMessage.content}
              timestamp={chat.lastMessage.created_at}
              unreadCount={chat.unreadCount}
              isSelected={selectedUserId === chat.userId}
              onClick={() => onSelectChat(chat.userId)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};

export default ChatList;
