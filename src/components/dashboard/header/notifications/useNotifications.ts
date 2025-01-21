import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const useNotifications = () => {
  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // Fetch unread messages
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey (
            first_name,
            last_name
          )
        `)
        .eq('receiver_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Fetch pending applications
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          creator:creators (
            *,
            profile:profiles!creators_user_id_fkey (
              first_name,
              last_name
            )
          ),
          opportunity:opportunities (
            title
          )
        `)
        .eq('status', 'pending');

      if (applicationsError) throw applicationsError;

      // Transform messages into notifications
      const messageNotifications = messages.map((message) => ({
        id: message.id,
        type: 'message',
        title: 'New Message',
        description: `${message.sender.first_name} ${message.sender.last_name} sent you a message`,
        timestamp: message.created_at,
        read: message.read,
        data: message
      }));

      // Transform applications into notifications
      const applicationNotifications = applications.map((application) => ({
        id: application.id,
        type: 'application',
        title: 'New Application',
        description: `${application.creator.profile.first_name} ${application.creator.profile.last_name} applied to "${application.opportunity.title}"`,
        timestamp: application.created_at,
        read: false,
        data: application
      }));

      // Combine and sort notifications
      return [...messageNotifications, ...applicationNotifications]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
  });

  return {
    notifications,
    isLoading
  };
};