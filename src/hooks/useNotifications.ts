import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Notification, MessageNotification, ApplicationNotification } from '@/types/creator';

export const useNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationsError, setNotificationsError] = useState<Error | null>(null);

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      try {
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

        const { data: applications, error: applicationsError } = await supabase
          .from('applications')
          .select(`
            *,
            creator:creators!inner (
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

        const messageNotifications: MessageNotification[] = messages.map((message) => ({
          id: message.id,
          type: 'message',
          title: 'New Message',
          content: message.content,
          description: `${message.sender.first_name} ${message.sender.last_name} sent you a message`,
          created_at: message.created_at,
          read: message.read,
          action_url: `/messages/${message.sender_id}`,
          data: message
        }));

        const applicationNotifications: ApplicationNotification[] = applications.map((application) => ({
          id: application.id,
          type: 'application',
          title: 'New Application',
          content: application.cover_letter || '',
          description: `${application.creator.profile.first_name} ${application.creator.profile.last_name} applied to "${application.opportunity.title}"`,
          created_at: application.created_at,
          read: false,
          action_url: `/applications/${application.id}`,
          data: application
        }));

        return [...messageNotifications, ...applicationNotifications]
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      } catch (error) {
        setNotificationsError(error as Error);
        return [];
      }
    }
  });

  const dismissMutation = useMutation({
    mutationFn: async (notification: { id: string, type: string }) => {
      if (notification.type === 'message') {
        const { error } = await supabase
          .from('messages')
          .update({ read: true })
          .eq('id', notification.id);
        if (error) throw error;
      }
    }
  });

  return {
    notifications,
    isOpen,
    setIsOpen,
    notificationsError,
    dismissNotification: dismissMutation,
    isLoading
  };
};