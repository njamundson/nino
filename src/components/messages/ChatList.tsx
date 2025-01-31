import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ChatListProps {
  onSelectChat: (userId: string, displayName: string, profileImage: string | null) => void;
  selectedUserId?: string | null;
}

const ChatList = ({ onSelectChat, selectedUserId }: ChatListProps) => {
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        setLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('messages')
          .select(`
            id,
            sender_id,
            receiver_id,
            content,
            created_at,
            sender:profiles!sender_profile_id(
              id,
              display_name,
              creator:creators(
                id,
                display_name,
                profile_image_url
              )
            ),
            receiver:profiles!receiver_profile_id(
              id,
              display_name,
              creator:creators(
                id,
                display_name,
                profile_image_url
              )
            )
          `)
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Group messages by user and get latest message
        const uniqueChats = data?.reduce((acc: any[], curr) => {
          const existingChat = acc.find(chat => 
            chat.sender?.id === curr.sender?.id
          );
          
          if (!existingChat) {
            acc.push(curr);
          }
          return acc;
        }, []);

        setChats(uniqueChats || []);
      } catch (error) {
        console.error("Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {chats.map(chat => {
        const otherUser = chat.sender;
        const creatorInfo = otherUser?.creator?.[0];
        const displayName = creatorInfo?.display_name || otherUser?.display_name || 'Unknown User';
        const profileImage = creatorInfo?.profile_image_url;

        return (
          <div
            key={chat.id}
            className={`flex items-center p-3 cursor-pointer ${selectedUserId === otherUser?.id ? 'bg-gray-100' : ''}`}
            onClick={() => onSelectChat(otherUser?.id, displayName, profileImage)}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={profileImage || ""} />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="font-medium">{displayName}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;