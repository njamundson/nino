import { MessageSquare } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const RecentMessages = () => {
  const { data: recentMessages } = useQuery({
    queryKey: ['recent-messages'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      
      const { data } = await supabase
        .from('messages')
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
        .eq('receiver_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);
      
      return data || [];
    }
  });

  return (
    <Card className="bg-white shadow-sm rounded-3xl overflow-hidden">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-nino-text">Recent Messages</h3>
          <button className="p-2 hover:bg-nino-bg rounded-full transition-colors">
            <MessageSquare className="w-5 h-5 text-nino-primary" />
          </button>
        </div>

        <div className="space-y-4">
          {recentMessages?.map((message: any) => (
            <div key={message.id} className="flex items-start gap-3 p-3 rounded-2xl bg-nino-bg/50">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-nino-primary/10 text-nino-primary text-xs">
                  {message.sender_profile?.first_name?.[0]}{message.sender_profile?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-nino-text truncate">
                  {message.sender_profile?.first_name} {message.sender_profile?.last_name}
                </p>
                <p className="text-sm text-nino-gray line-clamp-2">
                  {message.content}
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