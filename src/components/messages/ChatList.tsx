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
          .from('chats')
          .select(`
            *,
            users:users (
              id,
              display_name,
              profile_image_url
            )
          `)
          .eq('user_id', user.id);

        if (error) throw error;

        setChats(data);
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
          className={`flex items-center p-3 cursor-pointer ${selectedUserId === chat.users.id ? 'bg-gray-100' : ''}`}
          onClick={() => handleSelectChat(chat.users.id, chat.users.display_name, chat.users.profile_image_url)}
        >
          <Avatar className="h-10 w-10">
            <AvatarImage src={chat.users.profile_image_url || ""} />
            <AvatarFallback>{chat.users.display_name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <p className="font-medium">{chat.users.display_name}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
