import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const RecentMessages = () => {
  const navigate = useNavigate();
  
  const { data: recentMessages, refetch } = useQuery({
    queryKey: ['recent-messages'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_profile_id_fkey(
            display_name,
            id
          ),
          receiver:profiles!messages_receiver_profile_id_fkey(
            display_name,
            id
          )
        `)
        .eq('receiver_id', user.id)
        .neq('sender_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      return data || [];
    }
  });

  useEffect(() => {
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
          refetch();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refetch]);

  const handleMessagesClick = () => {
    navigate('/creator/messages');
  };

  const formatMessagePreview = (content: string) => {
    if (content.length > 50) {
      return content.substring(0, 50) + '...';
    }
    return content;
  };

  return (
    <Card className="bg-white border border-gray-100/50 shadow-[0_2px_8px_0_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.06)] transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-nino-text">Recent Messages</h3>
          <button 
            onClick={handleMessagesClick}
            className="p-2 hover:bg-nino-bg rounded-full transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-nino-primary" />
          </button>
        </div>

        <div className="space-y-4">
          {recentMessages?.map((message: any) => (
            <div key={message.id} className="flex items-start gap-3 p-3 rounded-2xl bg-nino-bg/50">
              <Avatar className="w-8 h-8">
                <AvatarImage src={message.sender?.profile_image_url} />
                <AvatarFallback className="bg-nino-primary/10 text-nino-primary text-xs">
                  {message.sender?.display_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-nino-text truncate">
                  {message.sender?.display_name}
                </p>
                <p className="text-sm text-nino-gray line-clamp-2">
                  {formatMessagePreview(message.content)}
                </p>
              </div>
            </div>
          ))}

          {(!recentMessages || recentMessages.length === 0) && (
            <div className="text-center py-4">
              <p className="text-sm text-nino-gray">No messages yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentMessages;