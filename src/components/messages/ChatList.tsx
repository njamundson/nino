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
            profiles:creators!creator_id(
              id,
              display_name,
              profile_image_url
            )
          `)
          .eq('sender_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Group messages by user and get latest message
        const uniqueChats = data?.reduce((acc: any[], curr) => {
          const existingChat = acc.find(chat => 
            chat.profiles.id === curr.profiles.id
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
      {chats.map(chat => (
        <div
          key={chat.id}
          className={`flex items-center p-3 cursor-pointer ${selectedUserId === chat.profiles.id ? 'bg-gray-100' : ''}`}
          onClick={() => onSelectChat(chat.profiles.id, chat.profiles.display_name, chat.profiles.profile_image_url)}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={chat.profiles.profile_image_url || ""} />
            <AvatarFallback>{chat.profiles.display_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-medium">{chat.profiles.display_name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;