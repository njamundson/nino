import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';

export const useNotifications = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: notifications, error: notificationsError } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];

      // First, get unread messages with profile data
      const { data: messages, error: messagesError } = await supabase
        .from('messages')
        .select(`
          *,
          sender:profiles!sender_profile_id(display_name),
          receiver:profiles!receiver_profile_id(display_name)
        `)
        .eq('receiver_id', user.id)
        .eq('read', false)
        .order('created_at', { ascending: false });

      if (messagesError) {
        console.error('Error fetching messages:', messagesError);
        return [];
      }

      // Transform messages into notifications
      const messageNotifications = (messages || []).map(message => ({
        id: message.id,
        type: message.message_type === 'invitation' ? 'invitation' : 'message',
        content: `New message from ${message.sender?.display_name || 'Unknown'}`,
        created_at: message.created_at,
        read: message.read,
        action_url: message.message_type === 'invitation' ? '/creator/projects' : '/messages'
      }));

      // Then, get unread applications (proposals)
      const { data: applications, error: applicationsError } = await supabase
        .from('applications')
        .select(`
          *,
          creator:creators(display_name),
          opportunity:opportunities(title)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (applicationsError) {
        console.error('Error fetching applications:', applicationsError);
        return [];
      }

      // Transform applications into notifications
      const applicationNotifications = (applications || []).map(application => ({
        id: application.id,
        type: 'application',
        content: `New proposal from ${application.creator?.display_name || 'Unknown'} for "${application.opportunity?.title}"`,
        created_at: application.created_at,
        read: false,
        action_url: '/brand/proposals'
      }));

      // Combine and sort all notifications by date
      return [...messageNotifications, ...applicationNotifications]
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .slice(0, 5);
    },
    retry: 1,
  });

  const dismissNotification = useMutation({
    mutationFn: async (notification: { id: string, type: string }) => {
      if (notification.type === 'message' || notification.type === 'invitation') {
        const { error } = await supabase
          .from('messages')
          .update({ read: true })
          .eq('id', notification.id);

        if (error) throw error;
      } else if (notification.type === 'application') {
        const { error } = await supabase
          .from('applications')
          .update({ status: 'viewed' })
          .eq('id', notification.id);

        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast({
        title: "Notification dismissed",
        description: "The notification has been marked as read",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to dismiss notification",
        variant: "destructive",
      });
    },
  });

  return {
    isOpen,
    setIsOpen,
    notifications,
    notificationsError,
    dismissNotification,
    navigate
  };
};